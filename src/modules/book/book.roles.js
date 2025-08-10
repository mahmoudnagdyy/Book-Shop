import { allowedApisRoles } from "../../utils/ApisRoles.js";


export const bookApisRoles = {
    addBook: [allowedApisRoles.admin],
    updateBook: [allowedApisRoles.admin],
    deleteBook: [allowedApisRoles.admin],
    getAllBooks: [allowedApisRoles.admin],
    getBookByID: [allowedApisRoles.admin],
    searchAboutBooks: [allowedApisRoles.admin]
}