import express from 'express'
import { createAccount, forgotPassword, login, resetPassword } from '../../controller/admin/authController.js'


const router = express.Router()

router.post('/signup', createAccount)
router.post('/login', login)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:id', resetPassword)

export default router