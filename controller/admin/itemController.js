import Items from "../../models/admin/itemModel.js"
import AdminAcoount from "../../models/admin/authModel.js"
import UserAccount from "../../models/user/authModel.js"
import Order from "../../models/user/orderModel.js"

export const createItem = async (req, res) => {
    try {
        const {name, type, stock} = req.body
        const {userId} = req.body.user

        const user = await AdminAcoount.findById(userId)

        if(!user){
            return res.status.jason({
                success: false,
                message: 'Authorization failed!'
            })
        }

        if (!name || !type || !stock) {
            return res.status(400).json({
                success: false,
                message: 'Name, type, and stock fields are required'
            });
        }

        const item = await Items.findOne({name: name})

        if(item){
            return res.status(403).json({
                success: false,
                message: 'Item already exists!'
            })
        }

        const newItem = new Items({
            name: name,
            type: [{name: type, stock: stock}]
        })

        const savedItem = await newItem.save()

        res.status(200).json({
            success: true,
            message: 'Item saved successfully',
            item: savedItem
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

export const updateItem = async (req, res) => {
    try {
        const {id, type, stock} = req.body
        const {userId} = req.body.user

        const user = await AdminAcoount.findById(userId)

        if(!user){
            return res.status.jason({
                success: false,
                message: 'Authorization failed!'
            })
        }

        if (!id || !type || !stock) {
            return res.status(400).json({
                success: false,
                message: 'Id, type, and stock fields are required'
            });
        }

        const item = await Items.findById(id)

        if(!item){
            return res.status(403).json({
                success: false,
                message: 'Item not found!'
            })
        }

        item._id = id
        const existType = item.type.find((t)=>t.name === type)
        if(existType){
            existType.stock = parseInt(existType.stock) + parseInt(stock)
        }else{
            item.type.push({name: type, stock})
        }

        const savedItem = await item.save()

        res.status(200).json({
            success: true,
            message: 'Item saved successfully',
            item: savedItem
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

export const getItems = async (req, res) => {
    try {
        const {userId} = req.body.user

        const user = await AdminAcoount.findById(userId)

        if(!user){
            return res.status.jason({
                success: false,
                message: 'Authorization failed!'
            })
        }

        const items = await Items.find()

        res.status(200).json({
            success: true,
            message: 'Item fetched successfully',
            item: items
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

export const addTypeToItem = async (req, res) => {
    try {
        const {name, type, stock} = req.body
        const {userId} = req.body.user

        const user = await AdminAcoount.findById(userId)

        if(!user){
            return res.status.jason({
                success: false,
                message: 'Authorization failed!'
            })
        }

        if (!name || !type || !stock) {
            return res.status(400).json({
                success: false,
                message: 'Name, type, and stock fields are required'
            });
        }

        const item = await Items.findOne({name: name})

        if(!item){
            return res.status(403).json({
                success: false,
                message: 'Item not found!'
            })
        }

        item.type.push({name: type, stock})

        const updated = await item.save()

        res.status(200).json({
            success: true,
            message: 'Item saved successfully',
            item: updated
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

export const getAllUsers = async (req, res) => {
    try{
        const {userId} = req.body.user

        const user = await AdminAcoount.findById(userId)

        if(!user){
            return res.status(403).jason({
                success: false,
                message: 'Authorization failed!'
            })
        }

        const accounts = await UserAccount.find()

        res.status(200).json({
            success: true,
            message: 'Accounts fetched successfully',
            data: accounts
        })
    }catch(error){
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}


export const totalOrders = async (req, res) => {
    try{
        const {userId} = req.body.user

        const user = await AdminAcoount.findById(userId)

        if(!user){
            return res.status(403).jason({
                success: false,
                message: 'Authorization failed!'
            })
        }

        const orders = await Order.find()

        res.status(200).json({
            success: true,
            message: 'orders fetched successfully',
            data: orders
        })
    }catch(error){
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

export const updateOrder = async (req, res) => {
    try {
        const {userId} = req.body.user
        const {id, status} = req.body


        const user = await AdminAcoount.findById(userId)

        if(!user){
            return res.status(403).jason({
                success: false,
                message: 'Authorization failed!'
            })
        }

        const findOrder = await Order.findById(id)

        if(!findOrder){
            return res.status(403).json({
                success: false,
                message: 'Order nor found!'
            })
        }

        findOrder.status = status

        await findOrder.save()

        res.status(200).json({
            success: true,
            message: 'Orders updated'
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}