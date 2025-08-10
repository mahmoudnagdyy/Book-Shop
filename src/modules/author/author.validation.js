import Joi from "joi";
import {validationID} from "../../utils/validationID.js"


export const addAuthor = {

    body: Joi.object({
        name: Joi.string().min(3),
        bio: Joi.string().min(10)
    }).required().options({presence: 'required'})

}

export const updateAuthor = {
    
    body: Joi.object({
        name: Joi.string().min(3),
        bio: Joi.string().min(10)
    }).required(),

    params: Joi.object({
        authorID: Joi.string().custom(validationID)
    })

}


export const getAuthorByID = {
    params: Joi.object({
        authorID: Joi.string().custom(validationID)
    }).required()
}