import {asyncHandler} from "../../../utils/errorHandler.js"
import categoryModel from "../../../../DB/model/Category.model.js"
import slugify from "slugify"


export const createCategory = asyncHandler(
    async (req, res, next) => {
        
        const {name} = req.body
        
        const checkCategory = await categoryModel.findOne({name})
        if (checkCategory) {
            return next(new Error('Category already exist'))
        }

        const slug = slugify(name, '_')

        const category = await categoryModel.create({name, slug, createdBy: req.user._id})
        return res.send({message: 'Category created successfully', category})
    }
)

export const updateCategory = asyncHandler(
    async (req, res, next) => {
        const {categroyID} = req.params
        const {name} = req.body

        const checkCategory = await categoryModel.findById(categroyID)
        if (!checkCategory) {
            return next(new Error('Category not found'))
        }

        if(name === checkCategory.name){
            return next(new Error('Old and new name are same'))
        }

        const checkCategoryName = await categoryModel.findOne({name})
        if (checkCategoryName) {
            return next(new Error('Category already exist'))
        }

        checkCategory.name = name
        checkCategory.slug = slugify(name, '_')
        checkCategory.updatedBy = req.user._id

        const category = await checkCategory.save()
        return res.send({message: 'Category updated successfully', category})
    }
)

export const deleteCategory = asyncHandler(
    async (req, res, next) => {
        const {categroyID} = req.params

        const checkCategory = await categoryModel.findById(categroyID)
        if (!checkCategory) {
            return next(new Error('Category not found'))
        }

        //? delete Related Books

        //! delete Category

    }
)


export const getCategories = asyncHandler(
    async (req, res, next) => {
        
    }
)


export const getCategoryByID = asyncHandler(
    async (req, res, next) => {
        
    }
)