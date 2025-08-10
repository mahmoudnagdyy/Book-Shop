import { allowedApisRoles } from "../../utils/ApisRoles.js";


export const categoryApisRoles = {
    createCategory: [allowedApisRoles.admin],
    updateCategory: [allowedApisRoles.admin],
    deleteCategory: [allowedApisRoles.admin],
    getCategories: [allowedApisRoles.admin],
    getCategoryByID: [allowedApisRoles.admin],
}