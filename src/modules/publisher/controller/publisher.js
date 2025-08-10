import {asyncHandler} from '../../../utils/errorHandler.js'
import publisherModel from '../../../../DB/model/Publisher.model.js'
import slugify from 'slugify'



export const addPublisher = asyncHandler(
    async (req, res, next) => {
        const {name, address, contactEmail, phoneNumber} = req.body

        const checkPublisher = await publisherModel.findOne({name})
        if(checkPublisher){
            return next(new Error('Publisher already exist'))
        }

        const slug = slugify(name, '_')

        const publisher = await publisherModel.create({name, address, contactEmail, phoneNumber, slug, createdBy: req.user._id})
        return res.send({message: 'Publisher created successfully', publisher})
    }
)


export const updatePublisher = asyncHandler(
    async (req, res, next) => {
        const {publisherID} = req.params
        const {name, address, contactEmail, phoneNumber} = req.body

        const checkPublisher = await publisherModel.findById(publisherID)
        if(!checkPublisher){
            return next(new Error('Publisher not found'))
        }

        if(name){
            if(name === checkPublisher.name){
                return next(new Error('Old and new name are same'))
            }
            const checkName = await publisherModel.findOne({name})
            if(checkName){
                return next(new Error('Publisher name already exist'))
            }
            checkPublisher.name = name
            checkPublisher.slug = slugify(name, '_')
        }

        if(address){
            if(address === checkPublisher.address){
                return next (new Error('Old and new address are same'))
            }
            checkPublisher.address = address
        }

        if(contactEmail){
            if(contactEmail === checkPublisher.contactEmail){
                return next (new Error('Old and new contact email are same'))
            }
            checkPublisher.contactEmail = contactEmail
        }

        if(phoneNumber){
            if(phoneNumber === checkPublisher.phoneNumber){
                return next (new Error('Old and new phone number are same'))
            }
            checkPublisher.phoneNumber = phoneNumber
        }

        checkPublisher.updatedBy = req.user._id
        const publisher = await checkPublisher.save()
        return res.send({message: 'Publisher updated successfully', publisher})
    }
)