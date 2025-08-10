import Joi from "joi";
import {validationID} from "../../utils/validationID.js"


export const createCoupon = {

    body: Joi.object({
        couponCode: Joi.string().alphanum().length(5).required(),
        couponAmount: Joi.number().integer().positive().max(100).required(),
        isPercentage: Joi.boolean(),
        isFixed: Joi.boolean(),
        fromData: Joi.date().greater(Date.now() - 24 * 60 * 60 * 1000).required(),
        toData: Joi.date().greater(Joi.ref('fromData')).required(),
        userID: Joi.string().custom(validationID).required(),
        maxUsage: Joi.number().min(1).max(10).required()
    }).required()
    

}