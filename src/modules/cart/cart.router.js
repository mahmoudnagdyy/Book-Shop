import { Router } from 'express'
import * as cartController from './controller/cart.js'
import { isAuth } from '../../middleware/authentication.js'
import { cartApisRoles } from './cart.roles.js'
import {validation} from '../../middleware/validation.js'
import * as cartValidation from './cart.validation.js'

const router = Router()

router.post(
    '/',
    isAuth(cartApisRoles.addToCart),
    validation(cartValidation.addToCart),
    cartController.addToCart
)

router.put(
    '/',
    isAuth(cartApisRoles.UpdateCart),
    validation(cartValidation.UpdateCart),
    cartController.UpdateCart
)

router.delete(
    '/',
    isAuth(cartApisRoles.removeFromCart),
    validation(cartValidation.removeFromCart),
    cartController.removeFromCart
)

router.get(
    '/',
    isAuth(cartApisRoles.getCart),
    cartController.getCart
)







export default router