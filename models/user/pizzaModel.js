import mongoose from "mongoose";

const pizzaSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    base: {
        type: String,
        required: true
    },
    sauce: {
        type: String,
        required: true
    },
    cheese: {
        type: String,
        required: true
    },
    veggies: [{
        type: String
    }],
    meat: {
        type: String
    },
    price: {type: Number},
    quantity: {
        type: Number,
        default: 1
    },
}, { timestamps: true });

const Pizza = mongoose.model('Pizza', pizzaSchema);

export default Pizza
