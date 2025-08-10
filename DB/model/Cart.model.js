import { Schema, model } from "mongoose";

const cartSchema = new Schema(
    {
        userID: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        books: [
            {
                bookID: {
                    type: Schema.Types.ObjectId,
                    ref: 'Book',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                },
                unitPrice: {
                    type: Number,
                    required: true
                },
                totalPrice: {
                    type: Number,
                    required: true
                }
            }
        ],
        subTotal: {
            type: Number,
            required: true,
            default: 0
        }
    },
    {
        timestamps: true
    }
)

const cartModel = model('Cart', cartSchema)
export default cartModel