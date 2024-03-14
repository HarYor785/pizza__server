import express from 'express'
import authMiddleware from '../../middleware/authMiddleware.js'
import { createOrder, createPizza, fetchCart, clearCart, 
    addToCart, decreaseQuantity, getOrder } from '../../controller/user/itemController.js'


const router = express.Router()

router.post('/create-pizza', authMiddleware, createPizza)
router.get('/cart', authMiddleware, fetchCart)
router.post('/create-order', authMiddleware, createOrder)
router.post('/clear-cart', authMiddleware, clearCart)
router.post('/add-cart', authMiddleware, addToCart)
router.post('/quantity', authMiddleware, decreaseQuantity)
router.get('/orders', authMiddleware, getOrder)

export default router