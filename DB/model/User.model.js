import { Schema, model } from "mongoose";
import bcrypt from 'bcryptjs'
import { allowedApisRoles } from "../../src/utils/ApisRoles.js";

const userSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true,
            min: 3
        },
        email: {
            type: String,
            unique: true,
            required: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: [allowedApisRoles.customer, allowedApisRoles.admin],
            default: allowedApisRoles.customer
        },
        isConfirmed: {
            type: Boolean,
            default: false
        },
        phoneNumber: [{
            type: String,
            required: true
        }],
        address: [{
            type: String,
            required: true
        }],
        status: {
            type: String,
            default: 'Offline',
            enum: ['Online', 'Offline']
        },
        gender: {
            type: String,
            enum: ['male', 'female', 'not specified'],
            default: 'not specified',
            required: true
        },
        token: String,
        resetCode: String
    },
    {
        timestamps: true
    }
)

userSchema.pre('save', function () {
    this.password = bcrypt.hashSync(this.password, +process.env.SALT_ROUND)
})

const userModel = model('User', userSchema)
export default userModel