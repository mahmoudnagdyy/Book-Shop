import { asyncHandler } from "../../../utils/errorHandler.js";
import cartModel from "../../../../DB/model/Cart.model.js"
import bookModel from "../../../../DB/model/Book.model.js"



export const addToCart = asyncHandler(
    async (req, res, next) => {
        const { bookID, quantity } = req.query

        const checkBook = await bookModel.findOne({ _id: bookID })
        if (!checkBook) {
            return next(new Error('Book not found'))
        }

        if (checkBook.stock < quantity) {
            return next(new Error('quantity not available'))
        }

        const checkCart = await cartModel.findOne({ userID: req.user._id })

        if (checkCart) {
            const checkBookInCart = await cartModel.findOne({userID: req.user._id, "books.bookID": bookID})
            if (checkBookInCart) {
                return next(new Error('Book already exist in cart'))
            }

            let cartBooks = []
            for (const book of checkCart.books) {
                cartBooks.push(book)
            }

            const bookItem = {
                bookID,
                quantity,
                unitPrice: checkBook.priceAfterDiscount,
                totalPrice: checkBook.priceAfterDiscount * quantity
            }

            cartBooks.push(bookItem)
            checkCart.books = cartBooks
            checkCart.subTotal += checkBook.priceAfterDiscount * quantity
            const cart = await checkCart.save()
            return res.send({ message: 'Book added to cart successfully', cart })
        }

        const cartItem = {
            userID: req.user._id,
            books: [{ bookID, quantity, unitPrice: checkBook.priceAfterDiscount, totalPrice: checkBook.priceAfterDiscount * quantity }],
            subTotal: checkBook.priceAfterDiscount * quantity
        }

        const addBookToCart = await cartModel.create(cartItem)
        return res.send({ message: 'Book added to cart successfully', addBookToCart })
    }
)


export const UpdateCart = asyncHandler(
    async (req, res, next) => {
        const { bookID, quantity } = req.query

        const checkCart = await cartModel.findOne({ userID: req.user._id })
        if (!checkCart) {
            return next(new Error('Cart not found'))
        }

        let index = -1
        for (const book of checkCart.books) {
            if (book.bookID.toString() == bookID) {
                index = checkCart.books.indexOf(book)
                break
            }
        }

        if (index == -1) {
            return next(new Error('Book not found in cart'))
        }

        if(checkCart.books[index].quantity == quantity){
            return next(new Error('Old and new quantity are same'))
        }

        checkCart.books[index].quantity = quantity
        checkCart.subTotal = checkCart.subTotal - (checkCart.books[index].totalPrice) + (checkCart.books[index].unitPrice * +quantity)
        checkCart.books[index].totalPrice = checkCart.books[index].unitPrice * quantity

        const cart = await checkCart.save()
        return res.send({ message: 'Cart updated successfully', cart })

    }
)


export const removeFromCart = asyncHandler(
    async (req, res, next) => {
        const { bookID } = req.query

        const checkCart = await cartModel.findOne({userID: req.user._id})
        if (!checkCart) {
            return next(new Error('Cart not found'))
        }

        let index = -1

        for (const book of checkCart.books) {
            if (book.bookID.toString() == bookID) {
                index = checkCart.books.indexOf(book)
                break
            }
        }

        if(index == -1){
            return next(new Error('Book not found in cart'))
        }

        checkCart.subTotal = checkCart.subTotal - checkCart.books[index].totalPrice
        checkCart.books.splice(index, 1)

        const cart = await checkCart.save()
        return res.send({ message: 'Book removed from cart successfully', cart })
    }
)


export const getCart = asyncHandler(
    async (req, res, next) => {
        const userCart = await cartModel.findOne({ userID: req.user._id })
        if(!userCart){
            return next(new Error('Cart not found'))
        }
        return res.send({ message: 'Cart found successfully', userCart })
    }
)