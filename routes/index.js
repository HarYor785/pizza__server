import express from 'express'
import userRoute from './user/index.js'
import adminRoute from './admin/index.js'


const router = express.Router()

const path = '/api-v1'

router.use(`${path}/admin`, adminRoute)
router.use(`${path}/user`, userRoute)

export default router