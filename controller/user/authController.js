import UserAccount from "../../models/user/authModel.js";
import { verificationCode, hashToken, generateToken, compareToken } from "../../utills/index.js";
import { ForgotPassMail, verificationMail } from "../../utills/mailer.js";


const code = await verificationCode()

export const register = async (req, res) => {
    try {
        const {firstName, lastName, email, password, phone} = req.body;
        
        if (!email || !password  || !firstName || !lastName || !phone){ 
            return res.status(400).json({
                success: false,
                message: "Please enter all fields"
            });
        }

        const exist = await UserAccount.findOne({email: email})

        if(exist){
            return res.status(403).json({
                success: false,
                message: 'Email already exists'
            })
        }

        const hash = await hashToken(password)

        const user = new UserAccount({
            firstName : firstName ,
            lastName : lastName ,
            email : email ,
            password : hash ,
            phone : phone,
            token: code
        })
    
        await user.save()

        const sendToken = await verificationMail(code, email);
    
        if(!sendToken) {
            return res.status(400).json({
                success: false,
                message: 'Faild to Send Verfication Email, Try again!'
            })
        }
        res.status(200).json({
            success: true,
            message: 'Account created successfuly'
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

export const verifyUser = async (req, res) => {
    try {
        const {token} = req.body

        const user = await UserAccount.findOne({token: token})

        if(!user){
            return res.status(400).json({
                success:false,  
                message:'Invalid Token or it may have expired.'  
            }) 
        }

        if(user.token !== token){
            return res.status(400).json({
                success: false,
                message: 'Invalid token'
            })
        }

        user.verify = true

        await user.save()

        user.password = undefined
        
        const jwtToken = generateToken(user._id)
        
        res.status(200).json({
            success: true,
            user: user,
            token: jwtToken,
            message: "Verification Successful!"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body

        if(!email  || !password) {
            return res.status(400).json({
                success:false,
                message:'Please provide email and password.'
            });
        }

        const user = await UserAccount.findOne({email: email})
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Credentials!'
            })
        }

        if(!user.verify){
            return res.status(400).json({
                success: false,
                message: 'Account not verified!'
            })
        }

        const compare = await compareToken(password, user.password)

        if (!compare) {
            return res.status(401).json({
                success: false,
                message: 'Invalid Password!'
            })
        }

        user.password = undefined

        const token = generateToken(user._id)
        console.log(hashToken)

        res.status(200).json({
            success: true,
            message: 'Login successful',
            user,
            token
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

        const user = await UserAccount.findOne({email})

        if(!user){
            return res.status(403).json({
                success: false,
                message: 'User not found'
            })
        }

        const mail = await ForgotPassMail(user.email, user._id, false)

        if(mail){
            res.status(200).json({
                success: true,
                message: 'Your password reset link has been sent to your email address successfully'
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

        const user = await UserAccount.findById(id)

        if(!user){
            return res.status(403).json({
                success: false,
                message: 'Invalid password token'
            })
        }

        const hash = await hashToken(password)

        const update = await UserAccount.findByIdAndUpdate({_id: id},{password: hash,})

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