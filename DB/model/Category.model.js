import { Schema, model } from "mongoose";

const categorySchema = new Schema(
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
        timestamps: true
    }
)

const categoryModel = model('Category', categorySchema)
export default categoryModel