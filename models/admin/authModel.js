import mongoose from "mongoose";
import validator from "validator";
// E6P7Hlr0PtmPWDSI

const authSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Last Name is required']
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        validate: validator.isEmail
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [8, 'Password must be more than 8 characters'],
        select: true
    }
},{timestamps: true})

const AdminAcoount = new mongoose.model('AdminAuth', authSchema)

export default AdminAcoount