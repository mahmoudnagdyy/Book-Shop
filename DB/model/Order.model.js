import { Schema, model } from "mongoose";

const orderSchema = new Schema(
    {
        userID: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        books: [
            {
                bookID: {
                    type: Schema.Types.ObjectId,
                    ref: 'Book',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                },
                unitPrice: {
                    type: Number,
                    required: true
                },
                totalPrice: {
                    type: Number,
                    required: true
                }
            }
        ],
        subTotal: {
            type: Number,
            required: true
        },
        couponCode: {
            type: String,
        },
        couponAmount: {
            type: Number
        },
        totalPriceAfterCoupon: {
            type: Number,
            required: true,
        },
        orderStatus: {
            type: String,
            enum: ['pending', 'delivered', 'cancelled', 'rejected', 'placed', 'confirmed'],
            default: 'pending'
        },
        shippingAddress: {
            type: String,
            required: true
        },
        paymentMethod: {
            type: String,
            enum: ['cash', 'card'],
            required: true
        },
        phoneNubmer: [
            {
                type: String,
                required: true,
                length: 11
            }
        ]
    },
    {
        timestamps: true
    }
)


const orderModel = model('Order', orderSchema)
export default orderModel