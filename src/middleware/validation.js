
const dataMethods = ['body', 'query', 'params', 'headers', 'file', 'files']

export const validation = (schema) => {

    return (req, res, next) => {
        let validationErrors = []
        dataMethods.forEach(key => {
            if (schema[key]) {
                let validationResult = schema[key].validate(req[key], { abortEarly: false })
                if (validationResult.error) {
                    validationErrors.push(validationResult.error)
                }
            }
        });

        if (validationErrors.length) {
            req.validationErrors = validationErrors[0].details
            return next(new Error('Validation Error'))
        }
        next()
    }

}