import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    name: {type: String},
    type: [{
        name: {type: String},
        stock: {type: Number}
    }],
},{timestamps: true})

const Items = new mongoose.model('Items', itemSchema)

export default Items