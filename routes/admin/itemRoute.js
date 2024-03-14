import express from 'express'
import authMiddleware from '../../middleware/authMiddleware.js'
import { addTypeToItem, createItem, getItems, updateItem, getAllUsers, totalOrders, updateOrder } from '../../controller/admin/itemController.js'


const router = express.Router()

router.post('/create-item', authMiddleware, createItem)
router.put('/update-item', authMiddleware, updateItem)
router.get('/get-items', authMiddleware, getItems)
router.post('/create-type', authMiddleware, addTypeToItem)
router.get('/get-users', authMiddleware, getAllUsers)
router.get('/get-orders', authMiddleware, totalOrders)
router.put('/update-order', authMiddleware, updateOrder)

export default router