import { Router } from "express";
import * as couponController from './controller/coupon.js'
import { isAuth } from "../../middleware/authentication.js";
import { couponApisRoles } from "./coupon.roles.js";
import * as couponValidation from './coupon.validation.js'
import { validation } from "../../middleware/validation.js";

const router = Router()

router.post(
    '/',
    isAuth(couponApisRoles.createCoupon),
    validation(couponValidation.createCoupon),
    couponController.createCoupon
)

router.delete(
    '/:couponID',
    isAuth(couponApisRoles.deleteCoupon),
    couponController.deleteCoupon
)




export default router