import Joi from "joi";
import {validationID} from "../../utils/validationID.js"



export const addPublisher = {

    body: Joi.object({
        name: Joi.string().min(3).max(50).required(),
        address: Joi.string().min(3).max(50).required(),
        contactEmail: Joi.string().email().required(),
        phoneNumber: Joi.string().length(11).required(),
        website: Joi.string().uri()
    }).required()

}

export const updatePublisher = {

    body: Joi.object({
        name: Joi.string().min(3).max(50),
        address: Joi.string().min(3).max(50),
        contactEmail: Joi.string().email(),
        phoneNumber: Joi.string().length(11),
        website: Joi.string().uri()
    }).required(),

    params: Joi.object({
        publisherID: Joi.string().custom(validationID)
    })

}