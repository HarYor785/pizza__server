import express from 'express'
import bodyParser from 'body-parser'
import compression from 'compression'
import cors from 'cors'
import ExpressMongoSanitize from 'express-mongo-sanitize'
import helmet from 'helmet'
import morgan from 'morgan'
import xss from 'xss-clean'
import dotenv from 'dotenv'
import router from './routes/index.js'
import errorMiddleware from './middleware/errorMiddleware.js'
import dbConnection from './db/index.js'



dotenv.config()

const PORT = process.env.PORT || 4000

const app = express()

app.use(express.static('public'));

app.use(cors())
app.use(helmet())
app.use(xss())
app.use(ExpressMongoSanitize())
app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.json({limit: '10mb'}))
app.use(express.urlencoded({extended: true}))
app.use(morgan('dev'))

app.use(router)

dbConnection()

app.use(errorMiddleware)

app.listen(PORT, ()=>{
    console.log('listening on port', PORT)
})