import multer from "multer"
import {v2 as cloudinary} from 'cloudinary'


export const allowedMulterExtensions = {
    image: ['image/png', 'image/jpg', 'image/jpeg'],
    video: ['video/mp4'],
    audio: ['audio/mp3'],
    file: ['application/pdf']
}

cloudinary.config({
    cloud_name: "ddbxrwwmz",
    api_key: "797827295144815",
    api_secret: "AatKcubDyFThFk_I_lIixiIF81s"
})


const multerCloud = (allowedExtensions = []) => {

    const storage = multer.diskStorage({})

    function fileFilter(req, file, cb) {

        if(allowedExtensions.includes(file.mimetype)){
            return cb(null, true)
        }
        cb(new Error('File type is not allowed'), false)

    }

    const upload = multer({ storage, fileFilter })
    return upload
}

export {
    cloudinary,
    multerCloud
}