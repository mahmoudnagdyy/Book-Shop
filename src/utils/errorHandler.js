

export const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((err) => {
            if(err.error){
                return next(new Error(err.error))
            }
            return next(new Error(err))
        })
    }
}


export const globalErrorHandler = (err, req, res, next) => {
    if(req.validationErrors){
        return res.send({message: 'Validation Error', errors: req.validationErrors})
    }
    return res.send({message: err.message, stack: err.stack})
}