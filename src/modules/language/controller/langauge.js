import {asyncHandler} from '../../../utils/errorHandler.js'
import languageModel from '../../../../DB/model/Language.model.js'



export const addLanguage = asyncHandler(
    async (req, res, next) => {
        const {name, code} = req.body

        const checkLanguage = await languageModel.findOne({name})
        if(checkLanguage){
            return next(new Error('Language already exist'))
        }

        const language = await languageModel.create({name, code, createdBy: req.user._id})
        return res.send({message: 'Language created successfully', language})

    }
)


export const updateLanguage = asyncHandler(
    async (req, res, next) => {
        const {languageID} = req.params
        const {name, code} = req.body

        const checkLanguage = await languageModel.findById(languageID)
        if(!checkLanguage){
            return next(new Error('Language not found'))
        }

        if(name){
            if(checkLanguage.name === name){
                return next(new Error('Old and new name are same'))
            }

            const checkName = await languageModel.findOne({name})
            if(checkName){
                return next(new Error('Language name already exist'))
            }

            checkLanguage.name = name
        }

        if(code){
            if(code === checkLanguage.code){
                return next(new Error('Old and new code are same'))
            }

            const checkCode = await languageModel.findOne({code})
            if(checkCode){
                return next(new Error('Language code already exist'))
            }

            checkLanguage.code = code
        }
        
        checkLanguage.updatedBy = req.user._id

        const language = await checkLanguage.save()
        return res.send({message: 'Language updated successfully', language})
    }
)