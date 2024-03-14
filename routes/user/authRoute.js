import express from 'express'
import { forgotPassword, login, register, resetPassword, verifyUser } from '../../controller/user/authController.js'


const router = express.Router()

router.post('/register', register)
router.post('/verify', verifyUser)
router.post('/login', login)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:id', resetPassword)

export default router