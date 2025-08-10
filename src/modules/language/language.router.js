import { Router } from "express";
import * as languageController from './controller/langauge.js'
import { isAuth } from "../../middleware/authentication.js";
import { languageApisRoles } from "./langauge.roles.js";
import * as languageValidation from './language.validation.js'
import { validation } from "../../middleware/validation.js";

const router = Router()


router.post('/', isAuth(languageApisRoles.addLanguage), validation(languageValidation.addLanguage), languageController.addLanguage)

router.put('/:languageID', isAuth(languageApisRoles.updateLanguage), validation(languageValidation.updateLanguage), languageController.updateLanguage)



export default router