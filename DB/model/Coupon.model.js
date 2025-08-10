import { Schema, model } from "mongoose";

const couponSchema = new Schema(
    {
        couponCode: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        couponAmount: {
            type: Number,
            required: true
        },
        isPercentage: {
            type: Boolean,
            default: false
        },
        isFixed: {
            type: Boolean,
            default: false
        },
        couponStatus: {
            type: String,
            enum: ['valid', 'expired'],
            required: true
        },
        fromData: {
            type: Date,
            required: true
        },
        toData: {
            type: Date,
            required: true
        },
        couponAssignedToUsers: [
            {
                userID: {
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                    required: true
                },
                maxUsage: {
                    type: Number,
                    required: true,
                    default: 1,
                    min: 1,
                    max: 10,
                },
                usageCount: {
                    type: Number,
                    required: true,
                    default: 0,
                }
            }
        ],
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


const couponModel = model('Coupon', couponSchema)
export default couponModel