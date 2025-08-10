import { Router } from "express";
import * as authController from './controller/auth.js'
import {validation} from '../../middleware/validation.js'
import * as authValidation from './auth.validation.js'

const router = Router()

router.post('/signup', validation(authValidation.signup), authController.signup)

router.get('/confirmEmail/:token', authController.confirmEmail)

router.post('/login', validation(authValidation.login), authController.login)

//! Forget Password API

router.post(
    '/forgetPassword',
    validation(authValidation.forgetPassword),
    authController.forgetPassword
)

router.post(
    '/resetPassword/:token',
    validation(authValidation.resetPassword),
    authController.resetPassword
)


export default router