import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
    },
    quantity: {
        type: Number,
    },
    totalPrice: {
        type: Number,
    },
    status: {
        type: String,
        enum: ['Processing', 'Delivered', 'Canceled', 'Out for Delivery'],
        default: 'Processing'
    }
}, { timestamps: true });


const Order = mongoose.model('Order', orderSchema);

export default Order