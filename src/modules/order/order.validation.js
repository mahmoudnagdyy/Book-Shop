import Joi from "joi";



export const createOrder = {

    body: Joi.object({
        couponCode: Joi.string().length(5),
        shippingAddress: Joi.string().min(3).max(50).required(),
        paymentMethod: Joi.string().valid('cash', 'card').required(),
        phoneNubmer: Joi.array().items(Joi.string().length(11).required()).required()
    }).required()

}