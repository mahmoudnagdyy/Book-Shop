import { Router } from "express";
import * as bookController from './controller/book.js'
import { isAuth } from "../../middleware/authentication.js";
import { bookApisRoles } from "./book.roles.js";
import * as bookValidation from './book.validation.js'
import { validation } from "../../middleware/validation.js";
import {allowedMulterExtensions, multerCloud} from '../../utils/multerCloud.js'
import { checkDependencies } from "./book.middleware.js";

const router = Router()


router.post(
    '/', 
    multerCloud(allowedMulterExtensions.image).single('image'), 
    isAuth(bookApisRoles.addBook), 
    validation(bookValidation.addBook), 
    checkDependencies,
    bookController.addBook
)

router.put(
    '/:bookID', 
    multerCloud(allowedMulterExtensions.image).single('image'), 
    isAuth(bookApisRoles.updateBook), 
    validation(bookValidation.updateBook), 
    bookController.updateBook
)

router.delete(
    '/:bookID', 
    isAuth(bookApisRoles.deleteBook), 
    bookController.deleteBook
)

//? Get All Books
router.get(
    '/',
    isAuth(bookApisRoles.getAllBooks),
    bookController.getAllBooks
)

//? Get Book By ID
router.get(
    '/:bookID',
    isAuth(bookApisRoles.getBookByID),
    bookController.getBookByID
)






export default router