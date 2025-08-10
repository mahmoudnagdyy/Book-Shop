import connectDB from '../DB/connection.js'
import authRouter from './modules/auth/auth.router.js'
import { globalErrorHandler } from './utils/errorHandler.js'
import categoryRouter from './modules/category/category.router.js'
import authorRouter from './modules/author/author.router.js'
import publisherRouter from './modules/publisher/publisher.router.js'
import languageRouter from './modules/language/language.router.js'
import bookRouter from './modules/book/book.router.js'
import cartRouter from './modules/cart/cart.router.js'
import orderRouter from './modules/order/order.router.js'
import couponRouter from './modules/coupon/coupon.router.js'



const bootstrap = (app, express) => {

    app.use(express.json())
    app.use('/auth', authRouter)
    app.use('/category', categoryRouter)
    app.use('/author', authorRouter)
    app.use('/publisher', publisherRouter)
    app.use('/language', languageRouter)
    app.use('/book', bookRouter)
    app.use('/cart', cartRouter)
    app.use('/order', orderRouter)
    app.use('/coupon', couponRouter)
    
    app.use(globalErrorHandler)

    app.get('/', (req, res, next) => {
        return res.send('<h1>Hello World In Our Book Store</h1>')
    })

    app.use('*root', (req, res, next) => {
        return res.send({message: '404 page not found'})
    })

    connectDB()
}

export default bootstrap