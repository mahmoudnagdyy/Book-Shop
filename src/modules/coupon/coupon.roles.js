import { allowedApisRoles } from "../../utils/ApisRoles.js";


export const couponApisRoles = {
    createCoupon: [allowedApisRoles.admin],
    updateCoupon: [allowedApisRoles.admin],
    deleteCoupon: [allowedApisRoles.admin],
    getCoupon: [allowedApisRoles.admin]
}