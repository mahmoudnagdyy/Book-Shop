import { Router } from "express";
import * as orderController from './controller/order.js'
import { isAuth } from "../../middleware/authentication.js";
import { orderApisRoles } from "./order.roles.js";
import { validation } from "../../middleware/validation.js";
import * as orderValidation from './order.validation.js'

const router = Router()


router.post(
    '/',
    isAuth(orderApisRoles.createOrder),
    validation(orderValidation.createOrder),
    orderController.createOrder
)

router.get(
    '/success/:token',
    orderController.successOrder
)

router.get(
    '/cancel/:token',
    orderController.cancelOrder
)

router.patch(
    '/:orderID',
    isAuth(orderApisRoles.deliverOrder),
    orderController.deliverOrder
)




export default router