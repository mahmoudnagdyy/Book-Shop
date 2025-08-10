import { allowedApisRoles } from "../../utils/ApisRoles.js";


export const publisherApisRoles = {
    addPublisher: [allowedApisRoles.admin],
    updatePublisher: [allowedApisRoles.admin]
}