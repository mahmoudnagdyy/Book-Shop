import { allowedApisRoles } from "../../utils/ApisRoles.js";

export const cartApisRoles = {
    addToCart: [allowedApisRoles.customer],
    UpdateCart: [allowedApisRoles.customer],
    removeFromCart: [allowedApisRoles.customer],
    getCart: [allowedApisRoles.customer]
}