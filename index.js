import express from 'express'
import bootstrap from './src/index.router.js'
import qs from 'qs'

import dotenv from 'dotenv'
dotenv.config()

const app = express()

app.set('query parser', str => qs.parse(str));


bootstrap(app, express)



app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ...... ${process.env.PORT}`)
})