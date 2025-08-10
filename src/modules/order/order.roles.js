import { allowedApisRoles } from "../../utils/ApisRoles.js";



export const orderApisRoles = {
    createOrder: [allowedApisRoles.customer],
    updateOrder: [allowedApisRoles.customer],
    deleteOrder: [allowedApisRoles.customer],
    getOrders: [allowedApisRoles.customer],
    deliverOrder: [allowedApisRoles.admin]
}