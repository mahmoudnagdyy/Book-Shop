import Joi from "joi";

export const signup = {

    body: Joi.object({
        fullName: Joi.string().min(3).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
        phoneNumber: Joi.array().items(Joi.string().length(11).required()).required(),
        address: Joi.array().items().required(),
        gender: Joi.string().valid('male', 'female').required()
    }).required(),

}


export const login = {

    body: Joi.object({
        email: Joi.string().email(),
        password: Joi.string()
    }).required().options({presence: 'required'}),

}


export const forgetPassword = {

    body: Joi.object({
        email: Joi.string().email()
    }).required().options({presence: 'required'})

}

export const resetPassword = {

    body: Joi.object({
        password: Joi.string().min(8),
        confirmPassword: Joi.string().valid(Joi.ref('password'))
    }).required().options({presence: 'required'}),

}