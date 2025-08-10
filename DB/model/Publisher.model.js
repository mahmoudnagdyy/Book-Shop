import { Schema, model } from "mongoose";


const publisherSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        slug:{
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        address: {
            type: String,
            required: true
        },
        contactEmail: {
            type: String,
            required: true
        },
        website: String,
        phoneNumber: {
            type: String,
            required: true
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        deletedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true
    }
)

const publisherModel = model('Publisher', publisherSchema)
export default publisherModel