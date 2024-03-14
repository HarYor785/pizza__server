import express from 'express'
import authRoute from './authRoute.js'
import itemRoute from './itemRoute.js'


const router = express.Router()

router.use('/auth', authRoute)
router.use('/item', itemRoute)

export default router