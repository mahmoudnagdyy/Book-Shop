import jwt from 'jsonwebtoken'
import userModel from '../../DB/model/User.model.js'


export const isAuth = (allowedRoles = []) => {
    return async (req, res, next) => {
        const { authorization } = req.headers
        if (!authorization) {
            return next(new Error('Authorization is required'))
        }

        if (!authorization.startsWith('Barcelona__')) {
            return next(new Error('Invalid Token, It should start with Barcelona__'))
        }

        const token = authorization.split('Barcelona__')[1]

        let decodedData
        let flag = false

        jwt.verify(token, process.env.LOGIN_TOKEN_SIGNATURE, async (err, decoded) => {
            if (err) {
                flag = true
                return 0
            }
            decodedData = decoded
        })

        if (flag) {
            const checkUser = await userModel.findOne({ token })
            if (!checkUser) {
                return next(new Error('User not found'))
            }

            const newToken = jwt.sign({ id: checkUser._id }, process.env.LOGIN_TOKEN_SIGNATURE, { expiresIn: '1h' })
            await userModel.findByIdAndUpdate(checkUser._id, { token: newToken }, { new: true })
            return res.send({ message: 'Token Expired', token: newToken })
        }

        if (!decodedData) {
            return next(new Error('Invalid Token'))
        }

        const user = await userModel.findById(decodedData.id)
        if (!user) {
            return next(new Error('User not found'))
        }

        if (!allowedRoles.includes(user.role)) {
            return next(new Error('You are not allowed to access this api'))
        }

        req.user = user
        next()
    }
}