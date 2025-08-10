import { asyncHandler } from '../../../utils/errorHandler.js'
import bookModel from '../../../../DB/model/Book.model.js'
import categoryModel from '../../../../DB/model/Category.model.js'
import authorModel from '../../../../DB/model/Author.model.js'
import publisherModel from '../../../../DB/model/Publisher.model.js'
import languageModel from '../../../../DB/model/Language.model.js'
import slugify from 'slugify'
import { cloudinary } from '../../../utils/multerCloud.js'
import { nanoid } from 'nanoid'
import { BookFeatures } from '../../../utils/bookFeatures.js'


export const addBook = asyncHandler(
    async (req, res, next) => {
        const { categoryID, authorID, publisherID, languageID } = req.query
        const { title, description, price, stock, ISBN, appliedDiscount } = req.body

        const checkBook = await bookModel.findOne({ ISBN })
        if (checkBook) {
            return next(new Error('Book already exist'))
        }

        if (!req.file) {
            return next(new Error('Image is required'))
        }

        const slug = slugify(title, '_')
        const customID = nanoid(5)

        const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, {
            folder: `BookShop/Authors/${req.author.customID}/Books/${customID}`,
        })

        let priceAfterDiscount = 0

        if(appliedDiscount){
            priceAfterDiscount = price - (price * (appliedDiscount / 100))
        }
        else{
            priceAfterDiscount = price
        }

        const book = await bookModel.create({ title, description, price, stock, ISBN, slug, coverImage: { public_id, secure_url }, categoryID, authorID, publisherID, languageID, createdBy: req.user._id, customID, appliedDiscount, priceAfterDiscount })
        if (!book) {
            await cloudinary.uploader.destroy(public_id)
            await cloudinary.api.delete_folder(`BookShop/Authors/${req.author.customID}/Books/${customID}`)
            return next(new Error('Book not created'))
        }
        return res.send({ message: 'Book created successfully', book })
    }
)


export const updateBook = asyncHandler(
    async (req, res, next) => {
        const { bookID } = req.params
        const { categoryID, authorID, publisherID, languageID } = req.query
        const { title, description, price, stock, ISBN, appliedDiscount } = req.body

        const checkBook = await bookModel.findById(bookID).populate([
            {
                path: 'authorID',
            }
        ])
        if (!checkBook) {
            return next(new Error('Book not found'))
        }

        if (categoryID) {
            if (categoryID.toString() == checkBook.categoryID.toString()) {
                return next(new Error('Old and new category are same'))
            }
            const checkCategory = await categoryModel.findById(categoryID)
            if (!checkCategory) {
                return next(new Error('Category not found'))
            }
            checkBook.categoryID = categoryID
        }

        if (publisherID) {
            if (publisherID.toString() == checkBook.publisherID.toString()) {
                return next(new Error('Old and new publisher are same'))
            }
            const checkPublisher = await publisherModel.findById(publisherID)
            if (!checkPublisher) {
                return next(new Error('Publisher not found'))
            }
            checkBook.publisherID = publisherID
        }

        if (languageID) {
            if (languageID.toString() == checkBook.languageID.toString()) {
                return next(new Error('Old and new language are same'))
            }
            const checkLanguage = await languageModel.findById(languageID)
            if (!checkLanguage) {
                return next(new Error('Language not found'))
            }
            checkBook.languageID = languageID
        }

        if (authorID) {

            if (authorID.toString() == checkBook.authorID._id.toString()) {
                return next(new Error('Old and new author are same'))
            }

            const checkNewAuthor = await authorModel.findById(authorID)
            if (!checkNewAuthor) {
                return next(new Error('Author not found'))
            }
            req.oldAuthor = checkBook.authorID
            req.newAuthor = checkNewAuthor
            checkBook.authorID = authorID
        }

        if (title) {
            if (title == checkBook.title) {
                return next(new Error('Old and new title are same'))
            }
            checkBook.title = title
            checkBook.slug = slugify(title, '_')
        }

        if (description) {
            if (description == checkBook.description) {
                return next(new Error('Old and new description are same'))
            }
            checkBook.description = description
        }


        if (price && appliedDiscount) {
            if (price == checkBook.price && appliedDiscount == checkBook.appliedDiscount) {
                return next(new Error('Old and new price and discount are same'))
            }
            checkBook.price = price
            checkBook.appliedDiscount = appliedDiscount
            checkBook.priceAfterDiscount = price - (price * (appliedDiscount / 100))
        }
        else if (price) {
            if (price == checkBook.price) {
                return next(new Error('Old and new price are same'))
            }
            checkBook.price = price
            checkBook.priceAfterDiscount = price - (price * (checkBook.appliedDiscount / 100))
        }
        else if (appliedDiscount) {
            if (appliedDiscount == checkBook.appliedDiscount) {
                return next(new Error('Old and new discount are same'))
            }
            checkBook.appliedDiscount = appliedDiscount
            checkBook.priceAfterDiscount = checkBook.price - (checkBook.price * (appliedDiscount / 100))
        }

        if (stock) {
            if (stock == checkBook.stock) {
                return next(new Error('Old and new stock are same'))
            }
            checkBook.stock = stock
        }

        if (ISBN) {
            if (ISBN == checkBook.ISBN) {
                return next(new Error('Old and new ISBN are same'))

            }
            checkBook.ISBN = ISBN
        }

        if (req.file) {
            await cloudinary.uploader.destroy(checkBook.coverImage.public_id)
            if (req.newAuthor) {
                await cloudinary.api.delete_folder(`BookShop/Authors/${req.oldAuthor.customID}/Books/${checkBook.customID}`)
                const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, {
                    folder: `BookShop/Authors/${req.newAuthor.customID}/Books/${checkBook.customID}`
                })
                const coverImage = { public_id, secure_url }
                checkBook.coverImage = coverImage
            }
            else {
                const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, {
                    folder: `BookShop/Authors/${checkBook.authorID.customID}/Books/${checkBook.customID}`
                })

                const coverImage = { public_id, secure_url }
                checkBook.coverImage = coverImage
            }
        }

        await checkBook.save()
        return res.send({ message: 'Book updated successfully', checkBook })
    }
)


export const deleteBook = asyncHandler(
    async (req, res, next) => {
        const { bookID } = req.params

        const checkBook = await bookModel.findById(bookID).populate([
            {
                path: 'authorID'
            }
        ])
        if (!checkBook) {
            return next(new Error('Book not found'))
        }

        await cloudinary.uploader.destroy(checkBook.coverImage.public_id)
        await cloudinary.api.delete_folder(`BookShop/Authors/${checkBook.authorID.customID}/Books/${checkBook.customID}`)


        const book = await bookModel.findByIdAndDelete(bookID)
        return res.send({ message: 'Book deleted successfully', book })
    }
)


export const getAllBooks = asyncHandler(
    async (req, res, next) => {
        const bookFeatureInstanse = new BookFeatures(bookModel.find(), req.query).select().pagination().sort().filter()
        const books = await bookFeatureInstanse.query

        if(!books.length) {
            return next(new Error('Books not found'))
        }

        return res.send({ message: 'Books found successfully', books })
    }
)


export const getBookByID = asyncHandler(
    async (req, res, next) => {
        const { bookID } = req.params
        const book = await bookModel.findById(bookID).populate([
            {
                path: 'categoryID'
            },
            {
                path: 'authorID'
            },
            {
                path: 'publisherID'
            },
            {
                path: 'languageID'
            }
        ])
        if (!book) {
            return next(new Error('Book not found'))
        }
        return res.send({ message: 'Book found successfully', book })
    }
)