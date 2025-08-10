import { Router } from "express";
import * as publisherController from './controller/publisher.js'
import {validation} from '../../middleware/validation.js'
import * as publisherValidation from './publisher.validation.js'
import { isAuth } from "../../middleware/authentication.js";
import { publisherApisRoles } from "./publisher.roles.js";

const router = Router()


router.post('/', isAuth(publisherApisRoles.addPublisher), validation(publisherValidation.addPublisher), publisherController.addPublisher)

router.put('/:publisherID', isAuth(publisherApisRoles.updatePublisher), validation(publisherValidation.updatePublisher), publisherController.updatePublisher)


export default router