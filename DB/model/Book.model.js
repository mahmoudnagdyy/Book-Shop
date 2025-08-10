import { Schema, model } from "mongoose";

const bookSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            lowercase: true
        },
        slug: {
            type: String,
            required: true,
            lowercase: true
        },
        description: String,
        price: {
            type: Number,
            required: true
        },
        stock:{
            type: Number,
            required: true,
            default: 1
        },
        appliedDiscount: {
            type: Number,
            default: 0
        },
        priceAfterDiscount: {
            type: Number,
            required: true,
        },
        ISBN: {
            type: String,
            required: true,
            unique: true
        },
        coverImage: {
            public_id: {
                type: String,
                required: true
            },
            secure_url:{
                type: String,
                required: true
            }
        },
        categoryID: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        },
        authorID: {
            type: Schema.Types.ObjectId,
            ref: 'Author',
            required: true
        },
        publisherID: {
            type: Schema.Types.ObjectId,
            ref: 'Publisher',
            required: true
        },
        languageID: {
            type: Schema.Types.ObjectId,
            ref: 'Language',
            required: true
        },
        customID: String,
        rate: Number
    },
    {
        timestamps: true
    }
)

const bookModel = model('Book', bookSchema)
export default bookModel