import mongoose from "mongoose";
import validator from 'validator'


const addressSchema = new mongoose.Schema({
    street: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    postalCode: {
        type: String,
        required: true
    }
});

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required']
    },
    email: {
        type: String,
        required: [true, 'Email name is required'],
        unique: true,
        validate: validator.isEmail
    },
    password: {
        type: String,
        minLenght: [8, 'Pasword must be more than 8 characters'],
        select: true
    },
    phone: {
        type: String
    },
    balance: {
        type: String,
        default: 700, 
    },
    address: {
        type: addressSchema
    },
    profilePic: {type: String},
    gender:{type: String},
    token: {type: String},
    verify: {type: Boolean, default: false}

},{timestamps: true})

const UserAccount = new mongoose.model('User', userSchema)

export default UserAccount