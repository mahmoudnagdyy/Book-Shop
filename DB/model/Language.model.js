import { Schema, model } from "mongoose";

const languageSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        code: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        deletedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        }
    },
    {
        timestamps: true
    }
)

const languageModel = model('Language', languageSchema)
export default languageModel