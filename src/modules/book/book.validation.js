import Joi from "joi";
import {validationID} from "../../utils/validationID.js"



export const addBook = {

    body: Joi.object({
        title: Joi.string().min(3).max(50).required(),
        description: Joi.string().min(10).max(250).required(),
        price: Joi.number().positive().required(),
        stock: Joi.number().integer().positive().required(),
        ISBN: Joi.string().length(17).required(),
        appliedDiscount: Joi.number().integer().positive().min(1).max(100),
    }).required(),

    query: Joi.object({
        categoryID: Joi.string().custom(validationID),
        publisherID: Joi.string().custom(validationID),
        authorID: Joi.string().custom(validationID),
        languageID: Joi.string().custom(validationID)
    }).required().options({presence: 'required'})

}

export const updateBook = {

    body: Joi.object({
        title: Joi.string().min(3).max(50),
        description: Joi.string().min(10).max(250),
        price: Joi.number().positive(),
        stock: Joi.number().integer().positive(),
        ISBN: Joi.string().length(17),
        appliedDiscount: Joi.number().integer().positive().min(1).max(100),
    }).required(),

    query: Joi.object({
        categoryID: Joi.string().custom(validationID),
        publisherID: Joi.string().custom(validationID),
        authorID: Joi.string().custom(validationID),
        languageID: Joi.string().custom(validationID)
    }).required()

}