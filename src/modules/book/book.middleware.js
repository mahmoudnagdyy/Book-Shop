import authorModel from "../../../DB/model/Author.model.js";
import categoryModel from "../../../DB/model/Category.model.js";
import languageModel from "../../../DB/model/Language.model.js";
import publisherModel from "../../../DB/model/Publisher.model.js";
import { asyncHandler } from "../../utils/errorHandler.js";



export const checkDependencies = asyncHandler(
    async (req, res, next) => {
        const { categoryID, authorID, publisherID, languageID } = req.query
        const checkCategory = await categoryModel.findById(categoryID)
        if (!checkCategory) {
            return next(new Error('Category not found'))
        }

        const checkAuthor = await authorModel.findById(authorID)
        if (!checkAuthor) {
            return next(new Error('Author not found'))
        }

        const checkPublisher = await publisherModel.findById(publisherID)
        if (!checkPublisher) {
            return next(new Error('Publisher not found'))
        }

        const checkLanguage = await languageModel.findById(languageID)
        if (!checkLanguage) {
            return next(new Error('Language not found'))
        }

        req.author = checkAuthor
        req.category = checkCategory
        req.publisher = checkPublisher
        req.language = checkLanguage

        next()
    }
)