import { Schema, model } from "mongoose";

const authorSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        bio:{
            type: String,
            required: true,
        },
        profilePicture: {
            public_id: {
                type: String,
                required: true
            },
            secure_url: {
                type: String,
                required: true
            }
        },
        customID: String,
        createdBy:{
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        updatedBy:{
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        deletedBy:{
            type: Schema.Types.ObjectId,
            ref: 'User',
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
)


authorSchema.virtual('books', {
    ref: 'Book',
    localField: '_id',
    foreignField: 'authorID'
})



const authorModel = model('Author', authorSchema)
export default authorModel