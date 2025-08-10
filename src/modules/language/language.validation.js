import Joi from "joi";
import {validationID} from "../../utils/validationID.js"


export const addLanguage = {

    body: Joi.object({
        name: Joi.string().min(3).max(50),
        code: Joi.string().min(2).max(5)
    }).required().options({presence: 'required'})

}

export const updateLanguage = {

    body: Joi.object({
        name: Joi.string().min(3).max(50),
        code: Joi.string().min(2).max(5)
    }).required(),

    params: Joi .object({
        languageID: Joi.string().custom(validationID)
    }).required()

}