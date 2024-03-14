import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pizza',
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    },
    price: {
        type: Number,
        required: true,
    }
}, { timestamps: true });

const CartItem = mongoose.model('CartItem', cartItemSchema);

export default CartItem