import { Router } from "express";
import * as categoryController from './controller/category.js'
import { isAuth } from "../../middleware/authentication.js";
import { categoryApisRoles } from "./category.roles.js";
import * as categoryValidation from './category.validation.js'
import { validation } from "../../middleware/validation.js";

const router = Router()

router.post('/', isAuth(categoryApisRoles.createCategory), validation(categoryValidation.createCategory), categoryController.createCategory)

router.put('/:categroyID', isAuth(categoryApisRoles.updateCategory), validation(categoryValidation.updateCategory), categoryController.updateCategory)

router.delete('/:categroyID', isAuth(categoryApisRoles.deleteCategory), validation(categoryValidation.deleteCategory), categoryController.deleteCategory)

// ! ToDO
router.get('/', isAuth(categoryApisRoles.getCategories), categoryController.getCategories)

router.get('/:categroyID', isAuth(categoryApisRoles.getCategoryByID), validation(categoryValidation.getCategoryByID), categoryController.getCategoryByID)

export default router