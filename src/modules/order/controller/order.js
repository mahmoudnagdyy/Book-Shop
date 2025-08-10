import { asyncHandler } from "../../../utils/errorHandler.js";
import orderModel from "../../../../DB/model/Order.model.js";
import cartModel from "../../../../DB/model/Cart.model.js";
import bookModel from "../../../../DB/model/Book.model.js";
import couponModel from "../../../../DB/model/Coupon.model.js";
import moment from "moment";
import Stripe from "stripe";
import jwt from 'jsonwebtoken'
import { generateQrCode } from "../../../utils/QRcode.js";
import { nanoid } from "nanoid";
import createInvoice from '../../../utils/pdfkit.js'
import { sendEmail } from "../../../utils/sendEmail.js";


export const createOrder = asyncHandler(
    async (req, res, next) => {
        const { couponCode, shippingAddress, paymentMethod, phoneNubmer } = req.body

        const checkCart = await cartModel.findOne({ userID: req.user._id }).populate([
            {
                path: 'books.bookID',
            }
        ])

        if (!checkCart) {
            return next(new Error('Cart not found'))
        }

        if (!checkCart.books.length) {
            return next(new Error('Cart is empty'))
        }

        //? Coupon
        let totalPriceAfterCoupon = 0
        if (couponCode) {
            const checkCoupon = await couponModel.findOne({ couponCode, "couponAssignedToUsers.userID": req.user._id })
            if (!checkCoupon) {
                return next(new Error('Coupon not found'))
            }

            if (checkCoupon.couponStatus == 'expired' || moment(checkCoupon.toData).isBefore(moment())) {
                return next(new Error('Coupon is expired'))
            }

            if ((checkCoupon.couponStatus === 'valid') && (moment().isBefore(moment(checkCoupon.fromData)))) {
                return next(new Error('Coupon does not start yet'))
            }

            if (checkCoupon) {
                for (const user of checkCoupon.couponAssignedToUsers) {
                    if (user.userID.toString() == req.user._id) {
                        if (user.usageCount >= user.maxUsage) {
                            return next(new Error('Coupon usage limit exceeded'))
                        }
                        break
                    }

                }
            }

            if (checkCoupon.isPercentage) {
                totalPriceAfterCoupon = checkCart.subTotal - (checkCart.subTotal * checkCoupon.couponAmount) / 100
            }
            else if (checkCoupon.isFixed) {
                totalPriceAfterCoupon = checkCart.subTotal - checkCoupon.couponAmount
            }

            req.coupon = checkCoupon
        }
        else {
            totalPriceAfterCoupon = checkCart.subTotal
        }

        const orderData = {
            userID: req.user._id,
            books: checkCart.books,
            subTotal: checkCart.subTotal,
            totalPriceAfterCoupon,
            orderStatus: paymentMethod == 'card' ? 'pending' : 'placed',
            couponCode,
            shippingAddress,
            paymentMethod,
            phoneNubmer
        }

        const order = await orderModel.create(orderData)
        if (!order) {
            return next(new Error('Order not created'))
        }

        for (const book of checkCart.books) {
            await bookModel.updateOne({ _id: book.bookID }, { $inc: { stock: -book.quantity } })
        }

        if (req.coupon) {
            for (const user of req.coupon.couponAssignedToUsers) {
                if (user.userID.toString() == req.user._id) {
                    user.usageCount += 1
                    break
                }
            }
            await req.coupon.save()
        }

        checkCart.books = []
        checkCart.subTotal = 0
        await checkCart.save()

        //! Stripe payment
        let sessionURL
        if (paymentMethod == 'card') {
            const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

            let stripeCoupon

            if (req.coupon?.isPercentage) {
                stripeCoupon = await stripe.coupons.create({
                    percent_off: req.coupon.couponAmount,
                })
            }

            if (req.coupon?.isFixed) {
                stripeCoupon = await stripe.coupons.create({
                    amount_off: req.coupon.couponAmount * 100,
                    currency: 'EGP',
                })
            }

            const token = jwt.sign({ id: order._id }, process.env.PAYEMENT_TOKEN_SIGNATURE, { expiresIn: '1h' })

            sessionURL = await stripe.checkout.sessions.create({
                discounts: stripeCoupon ? [{ coupon: stripeCoupon.id }] : [],
                mode: 'payment',
                line_items: order.books.map(book => {
                    return {
                        price_data: {
                            currency: 'EGP',
                            product_data: {
                                name: book.bookID.title,
                            },
                            unit_amount: book.bookID.priceAfterDiscount * 100,
                        },
                        quantity: book.quantity,
                    }
                }),
                payment_method_types: ['card'],
                currency: 'EGP',
                success_url: `${req.protocol}://${req.headers.host}/order/success/${token}`,
                cancel_url: `${req.protocol}://${req.headers.host}/order/cancel/${token}`,
            })
        }

        //? Generate QR Code
        const qrcode = await generateQrCode({
            data: {
                orderID: order._id,
                userID: req.user._id,
            }
        })

        const orderCode = nanoid(5)

        const invoice = {
            orderCode,
            date: moment(),
            shipping: {
                name: req.user.fullName,
                address: order.shippingAddress,
                city: order.shippingAddress,
                state: order.shippingAddress,
                country: 'Egypt',
            },
            items: order.books.map(book => {
                return {
                    title: book.bookID.slug,
                    price: book.bookID.priceAfterDiscount,
                    quantity: book.quantity,
                    finalPrice: book.totalPrice
                }
            }),
            subTotal: order.subTotal,
            paidAmount: order.totalPriceAfterCoupon,
        }

        createInvoice(invoice, `${req.user.fullName}_${orderCode}.pdf`)

        sendEmail({
            to: req.user.email,
            subject: order.paymentMethod == 'card' ? 'Order confirmed successfully' : 'Order placed successfully',
            html: `<p>Order confirmed successfully, Your order code is <b>${orderCode}</b></p>`,
            attachments: [
                {
                    path: `./Files/${req.user.fullName}_${orderCode}.pdf`
                }
            ]
        })

        return res.send({ message: 'Order created successfully', order, sessionURL: sessionURL?.url, qrcode })
    }
)


export const successOrder = asyncHandler(
    async (req, res, next) => {
        const { token } = req.params

        const decoded = jwt.verify(token, process.env.PAYEMENT_TOKEN_SIGNATURE)
        if (!decoded) {
            return next(new Error('Invalid Token'))
        }

        let order = await orderModel.findOne({ _id: decoded.id, orderStatus: 'pending' })
        if (!order) {
            return next(new Error('Order not found or already confirmed'))
        }

        if (order.orderStatus === 'confirmed') {
            return next(new Error('Order already confirmed'))
        }

        order.orderStatus = 'confirmed'
        await order.save()

        return res.send('<h1>Order confirmed successfully</h1>')
    }
)


export const cancelOrder = asyncHandler(
    async (req, res, next) => {
        const { token } = req.params

        const decoded = jwt.verify(token, process.env.PAYEMENT_TOKEN_SIGNATURE)
        if (!decoded) {
            return next(new Error('Invalid Token'))
        }

        let order = await orderModel.findById(decoded.id)
        if (!order) {
            return next(new Error('Order not found'))
        }

        if (order.orderStatus === 'cancelled') {
            return next(new Error('Order already cancelled'))
        }

        await orderModel.deleteOne({ _id: order._id })

        for (const book of order.books) {
            await bookModel.updateOne({ _id: book.bookID }, { $inc: { stock: +book.quantity } })
        }

        const coupon = await couponModel.findOne({ _id: order.couponID })
        if (coupon) {
            for (const user of coupon.couponAssignedToUsers) {
                if (user.userID.toString() == order.userID.toString()) {
                    user.usageCount -= 1
                    break
                }
            }
        }
        await coupon.save()

        order.orderStatus = 'cancelled'
        await order.save()
        return res.send('<h1>Order cancelled successfully</h1>')
    }
)


export const deliverOrder = asyncHandler(
    async (req, res, next) => {
        const { orderID } = req.params
        const order = await orderModel.findOne({ _id: orderID, orderStatus: { $nin: ['cancelled', 'delivered', 'rejected', 'pending'] } })
        if (!order) {
            return next(new Error('Order not found'))
        }

        order.orderStatus = 'delivered'
        await order.save()
        return res.send({ message: 'Order delivered successfully', order })
    }
)