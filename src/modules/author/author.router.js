import { Router } from "express";
import * as authorController from './controller/author.js'
import {validation} from '../../middleware/validation.js'
import * as authValidation from './author.validation.js'
import {isAuth} from '../../middleware/authentication.js'
import { AuthorApisRoles } from "./author.roles.js";
import { multerCloud } from "../../utils/multerCloud.js";
import { allowedMulterExtensions } from "../../utils/multerCloud.js";

const router = Router()


router.post('/', multerCloud(allowedMulterExtensions.image).single('image'), isAuth(AuthorApisRoles.addAuthor), validation(authValidation.addAuthor), authorController.addAuthor)

router.put('/:authorID', multerCloud(allowedMulterExtensions.image).single('image'), isAuth(AuthorApisRoles.updateAuthor), validation(authValidation.updateAuthor), authorController.updateAuthor)

router.get('/:authorID', isAuth(AuthorApisRoles.getAuthorByID), validation(authValidation.getAuthorByID), authorController.getAuthorByID)

router.get('/', isAuth(AuthorApisRoles.getAuthors), authorController.getAuthors)

router.delete(
    '/:authorID',
    isAuth(AuthorApisRoles.deleteAuthor),
    authorController.deleteAuthor
)




export default router