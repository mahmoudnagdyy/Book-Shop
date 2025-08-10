import Joi from "joi";
import {validationID} from "../../utils/validationID.js"


export const addToCart = {

    query: Joi.object({
        bookID: Joi.string().custom(validationID),
        quantity: Joi.number().integer().positive(),
    }).required().options({presence: 'required'})

}


export const UpdateCart = {

    query: Joi.object({
        bookID: Joi.string().custom(validationID),
        quantity: Joi.number().integer().positive(),
    }).required().options({presence: 'required'})

}


export const removeFromCart = {

    query: Joi.object({
        bookID: Joi.string().custom(validationID),
    }).required().options({presence: 'required'})

}