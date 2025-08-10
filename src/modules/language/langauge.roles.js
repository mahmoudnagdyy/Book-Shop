import { allowedApisRoles } from "../../utils/ApisRoles.js";


export const languageApisRoles = {
    addLanguage: [allowedApisRoles.admin],
    updateLanguage: [allowedApisRoles.admin]
}