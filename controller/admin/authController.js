import AdminAcoount from "../../models/admin/authModel.js"
import { compareToken, generateToken, hashToken } from "../../utills/index.js"
import { ForgotPassMail } from "../../utills/mailer.js"


export const createAccount = async (req, res) => {
    try {
        const {firstName, lastName, email, password} = req.body

        if(!firstName || !lastName || !email || !password){
            return res.status(403).json({
                success: false,
                message: 'All field are required'
            })
        }

        const emailExist = await AdminAcoount.findOne({email})

        if(emailExist){
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            })
        }

        const hash = await hashToken(password)

        const newAcc = new AdminAcoount({
            firstName,
            lastName,
            email,
            password: hash
        })

        await newAcc.save()

        res.status(200).json({
            success: true,
            message: 'Acount created successfully'
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Error creating account'
        })
    }
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body

        if(!email || !password){
            return res.status(403).json({
                success: false,
                message: 'All field are mandatory'
            })
        }

        const user = await AdminAcoount.findOne({email})

        if(!user){
            return res.status(403).json({
                success: false,
                message: 'User not found'
            })
        }

        const compare = await compareToken(password, user.password)
        
        if(!compare){
            return res.status(403).json({
                success: false,
                message: 'Invalid password'
            })
        }

        const token = generateToken(user._id)

        user.password = undefined

        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: user,
            token: token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const {email} = req.body

        const user = await AdminAcoount.findOne({email})

        if(!user){
            return res.status(403).json({
                success: false,
                message: 'User not found'
            })
        }

        const mail = await ForgotPassMail(user.email, user._id, true)

        if(mail){
            res.status(200).json({
                success: true,
                message: 'Your password reset link has been send to your email address successfully'
            })
        }else{
            res.status(403).json({
                success: false,
                message: 'Error sending password reset token'
            })
        }
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

export const resetPassword = async (req, res) => {
    try {
        const {password} = req.body
        const {id} = req.params

        if(!password){
            return res.status(403).json({
                success: false,
                message: 'Password field cannot be empty!'
            })
        }

        const user = await AdminAcoount.findById(id)

        if(!user){
            return res.status(403).json({
                success: false,
                message: 'Invalid password token'
            })
        }

        const hash = await hashToken(password)

        const update = await AdminAcoount.findByIdAndUpdate({_id: id},{password: hash,})

        res.status(200).json({
            success: true,
            message: 'Password updated successfully!'
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}