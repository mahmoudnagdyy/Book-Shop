import Joi from "joi";
import {validationID} from "../../utils/validationID.js"


export const createCategory = {

    body: Joi.object({
        name: Joi.string().min(3).max(50),
    }).required().options({presence: 'required'})

}


export const updateCategory = {

    body: Joi.object({
        name: Joi.string().min(3).max(50),
    }).required().options({presence: 'required'}),

    params: Joi.object({
        categroyID: Joi.string().custom(validationID)
    }).required().options({presence: 'required'})

}


export const deleteCategory = {
    params: Joi.object({
        categoryID: Joi.string().custom(validationID)
    }).required().options({presence: 'required'}),
}

export const getCategoryByID = {

    params: Joi.object({
        categroyID: Joi.string().custom(validationID)
    }).required().options({presence: 'required'})

}