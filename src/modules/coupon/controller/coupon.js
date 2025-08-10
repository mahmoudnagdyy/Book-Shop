import { asyncHandler } from '../../../utils/errorHandler.js'
import couponModel from '../../../../DB/model/Coupon.model.js'


export const createCoupon = asyncHandler(
    async (req, res, next) => {
        const { couponCode, couponAmount, isPercentage, isFixed, fromData, toData, userID, maxUsage } = req.body

        const checkCoupon = await couponModel.findOne({ couponCode })
        if (checkCoupon) {
            return next(new Error('Coupon already exist'))
        }

        if ((!isPercentage && !isFixed) || (isPercentage && isFixed)) {
            return next(new Error('Please select either percentage or fixed'))
        }

        const couponData = {
            couponCode,
            couponAmount,
            couponStatus: 'valid',
            isPercentage, 
            isFixed,
            fromData,
            toData,
            createdBy: req.user._id,
            couponAssignedToUsers: [{userID, maxUsage }]
        }

        const coupon = await couponModel.create(couponData)
        return res.send({ message: 'Coupon created successfully', coupon })

    }
)


export const deleteCoupon = asyncHandler(
    async (req, res, next) => {
        const {couponID} = req.params

        const coupon = await couponModel.findByIdAndDelete(couponID)
        if (!coupon) {
            return next(new Error('Coupon not found'))
        }

        return res.send({ message: 'Coupon deleted successfully', coupon })
    }
)