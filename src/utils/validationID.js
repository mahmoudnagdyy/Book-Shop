import { Types } from "mongoose"



export const validationID = (value, helper) => {
    return Types.ObjectId.isValid(value)? true: helper.message('Invalid ID')
}