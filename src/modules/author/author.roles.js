import { allowedApisRoles } from "../../utils/ApisRoles.js";


export const AuthorApisRoles = {

    addAuthor: [allowedApisRoles.admin],
    updateAuthor: [allowedApisRoles.admin],
    getAuthorByID: [allowedApisRoles.admin],
    getAuthors: [allowedApisRoles.admin],
    deleteAuthor: [allowedApisRoles.admin]
}