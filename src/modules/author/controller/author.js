import slugify from 'slugify'
import authorModel from '../../../../DB/model/Author.model.js'
import { asyncHandler } from '../../../utils/errorHandler.js'
import { cloudinary } from '../../../utils/multerCloud.js'
import { nanoid } from 'nanoid'
import bookModel from '../../../../DB/model/Book.model.js'


export const addAuthor = asyncHandler(
    async (req, res, next) => {
        const { name, bio } = req.body

        const checkAuthor = await authorModel.findOne({ name })
        if (checkAuthor) {
            return next(new Error('Author Already Exists'))
        }

        const slug = slugify(name, '_')

        if (!req.file) {
            return next(new Error('Image is required'))
        }

        const customID = nanoid(5)

        const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, {
            folder: `BookShop/Authors/${customID}`
        })

        const author = await authorModel.create({ name, bio, slug, profilePicture: { public_id, secure_url }, createdBy: req.user._id, customID })
        if (!author) {
            await cloudinary.uploader.destroy(public_id)
            await cloudinary.api.delete_folder(`BookShop/Authors/${customID}`)
            return next(new Error('Author not created'))
        }

        return res.send({ message: 'Author created successfully', author })
    }
)


export const updateAuthor = asyncHandler(
    async (req, res, next) => {
        const { authorID } = req.params
        const { name, bio } = req.body

        const checkAuthor = await authorModel.findById(authorID)
        if (!checkAuthor) {
            return next(new Error('Author not found'))
        }

        if (name) {
            if (name === checkAuthor.name) {
                return next(new Error('Old and new name are same'))
            }

            const checkName = await authorModel.findOne({ name })
            if (checkName) {
                return next(new Error('Author name already exist'))
            }

            checkAuthor.name = name
            checkAuthor.slug = slugify(name, '_')
        }

        if (bio) {
            checkAuthor.bio = bio
        }

        if (req.file) {
            await cloudinary.uploader.destroy(checkAuthor.profilePicture.public_id)
            const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, {
                folder: `BookShop/Authors/${checkAuthor.customID}`
            })

            const profilePicture = { public_id, secure_url }
            checkAuthor.profilePicture = profilePicture
        }

        checkAuthor.updatedBy = req.user._id
        const updatedAuthor = await checkAuthor.save()
        return res.send({ message: 'Author updated successfully', updatedAuthor })
    }
)


export const getAuthorByID = asyncHandler(
    async (req, res, next) => {
        const { authorID } = req.params
        const checkAuthor = await authorModel.findById(authorID).populate([
            {
                path: 'books'
            }
        ])
        if (!checkAuthor) {
            return next(new Error('Author not found'))
        }
        return res.send({ message: 'Author found successfully', checkAuthor })
    }
)


export const getAuthors = asyncHandler(
    async (req, res, next) => {
        const authors = await authorModel.find({}).populate([
            {
                path: 'books'
            }
        ])
        return res.send({ message: 'Authors found successfully', authors })
    }
)


export const deleteAuthor = asyncHandler(
    async (req, res, next) => {
        const { authorID } = req.params

        const author = await authorModel.findByIdAndDelete(authorID).populate([
            {
                path: 'books'
            }
        ])
        if (!author) {
            return next(new Error('Author not found'))
        }

        const authorBooks = await bookModel.find({ authorID })

        if (authorBooks.length) {
            for (const book of authorBooks) {
                await cloudinary.uploader.destroy(book.coverImage.public_id)
                await cloudinary.api.delete_folder(`BookShop/Authors/${author.customID}/Books/${book.customID}`)
            }

            await cloudinary.api.delete_folder(`BookShop/Authors/${author.customID}/Books`)
            await cloudinary.uploader.destroy(author.profilePicture.public_id)
            await cloudinary.api.delete_folder(`BookShop/Authors/${author.customID}`)
        }

        await bookModel.deleteMany({ authorID })

        return res.send({ message: 'Author deleted successfully', author })
    }
)