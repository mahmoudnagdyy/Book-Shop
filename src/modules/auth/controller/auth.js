import userModel from "../../../../DB/model/User.model.js";
import { asyncHandler } from "../../../utils/errorHandler.js";
import { confirmEmailTemplete, EmailConfirmedTemplete, forgetPasswordTemplete } from "../../../utils/htmlTempletes.js";
import { sendEmail } from "../../../utils/sendEmail.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { nanoid } from "nanoid";


export const signup = asyncHandler(
    async (req, res, next) => {
        const { fullName, email, password, phoneNumber, address, gender } = req.body

        const checkUser = await userModel.findOne({ email })
        if (checkUser) {
            return next(new Error('User already exist'))
        }

        const user = new userModel({ fullName, email, password, phoneNumber, address, gender })
        await user.save()

        const token = jwt.sign({ id: user._id }, process.env.CONFIRM_EMAIL_TOKEN_SIGNATURE, { expiresIn: '1d' })

        sendEmail({
            to: email,
            subject: 'Confirm Your Email',
            html: confirmEmailTemplete(token, req)
        })

        return res.send({ message: 'User created successfully', user })
    }
)

export const confirmEmail = asyncHandler(
    async (req, res, next) => {
        const { token } = req.params

        const decoded = jwt.verify(token, process.env.CONFIRM_EMAIL_TOKEN_SIGNATURE)
        if (!decoded) {
            return next(new Error('Invalid Token'))
        }

        const checkUser = await userModel.findById(decoded.id)
        if (!checkUser) {
            return next(new Error('User not found'))
        }

        if (checkUser.isConfirmed) {
            return next(new Error('User already confirmed'))
        }

        await userModel.findByIdAndUpdate(decoded.id, { isConfirmed: true })
        sendEmail({
            to: checkUser.email,
            subject: 'Email Confirmed',
            html: EmailConfirmedTemplete()
        })
        return res.send({ message: 'Email confirmed successfully' })
    }
)

export const login = asyncHandler(
    async (req, res, next) => {
        const { email, password } = req.body

        const checkUser = await userModel.findOne({ email })
        if (!checkUser) {
            return next(new Error('User not found'))
        }

        const checkPassword = bcrypt.compareSync(password, checkUser.password)
        if (!checkPassword) {
            return next(new Error('Wrong password or invalid email'))
        }

        const token = jwt.sign({ id: checkUser._id }, process.env.LOGIN_TOKEN_SIGNATURE, { expiresIn: '1h' })

        const user = await userModel.findByIdAndUpdate(checkUser._id, { status: 'Online', token }, { new: true })

        return res.send({ message: 'Login Done', user })
    }
)


export const forgetPassword = asyncHandler(
    async (req, res, next) => {
        const { email } = req.body

        const checkUser = await userModel.findOne({ email })
        if (!checkUser) {
            return next(new Error('User not found'))
        }

        const token = jwt.sign({ id: checkUser._id }, process.env.FORGET_PASSWORD_TOKEN_SIGNATURE, { expiresIn: '1d' })
        sendEmail({
            to: email,
            subject: 'Forget Password',
            html: forgetPasswordTemplete(token, req)
        })

        const resetCode = nanoid(5)
        await userModel.updateOne({ _id: checkUser._id }, { resetCode })

        return res.send({ message: 'Check your email to reset password' })
    }
)

export const resetPassword = asyncHandler(
    async (req, res, next) => {
        const { token } = req.params
        const { password } = req.body

        const decoded = jwt.verify(token, process.env.FORGET_PASSWORD_TOKEN_SIGNATURE)
        if (!decoded) {
            return next(new Error('Invalid Token, please try again'))
        }

        const user = await userModel.findById(decoded.id )
        if (!user) {
            return next(new Error('User not found'))
        }

        if(!user.resetCode){
            return next(new Error('Password is already reset'))
        }

        const checkPassword = bcrypt.compareSync(password, user.password)
        if (checkPassword) {
            return next(new Error('Old and new password are same'))
        }

        user.resetCode = null
        user.password = password
        await user.save()

        sendEmail({
            to: user.email,
            subject: 'Password Reset',
            html: '<p>Password reset successfully</p>'
        })

        return res.send({ message: 'Password reset successfully' })
    }
)