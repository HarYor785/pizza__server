import nodemailer from 'nodemailer'
import { verificationCode } from './index.js'
import dotenv from 'dotenv'

dotenv.config()

const code = verificationCode()

const transporter = nodemailer.createTransport({
    host: 'smtp.google.com',
    service: 'Gmail',
    secure: false,
    auth:{
        user: process.env.MAILER__ADDRESS,
        pass: process.env.MAILER__PASSWORD
    }
})

export const verificationMail = async (code, to)=>{
    try {
        const mailOptions = {
            from: 'Oven Fresh Pizza',
            to: to,
            subject: 'Verification Token',
            html: `<html>
                        <head>
                            <style>
                                h3{
                                    text-transform: uppercase;
                                }
                                h5{
                                    padding: 0.85rem;
                                    background: #ffb400;
                                    color: #fff;
                                }
                            </style>
                        </head>
                        <body>
                            <div>
                                <h3>Verification Token</h3>
                                <p>Here is your Verification Token</p>
                                <h5>${code}</h5>
                                <p>@Oven Fresh Pizza</p>
                            </div>
                        </body>
            </html>`
        }

        await transporter.sendMail(mailOptions)
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}


export const ForgotPassMail = async (to, id, admin) => {
    try {
        const mailOptions = {
            from: 'Oven Fresh Pizza',
            to: to,
            subject: 'Password reset link',
            html: `<html>
                        <head>
                            <style>
                                h3{
                                    text-transform: uppercase;
                                }
                                a{
                                    padding: 0.85rem;
                                    background: #ffb400;
                                    color: #fff;
                                    border-radius: 5px;
                                    text-decoration: none;
                                    text-transform: uppercase;
                                }
                            </style>
                        </head>
                        <body>
                            <div>
                                <h3>Password Reset Link</h3>
                                <p>You request to change your password, Click the button below to reset your password</p>
                                <a href={${admin ? `http://localhost:3001/reset_password/${id}` 
                                : `http://localhost:3002/reset_password/${id}`}}>Reset Password</a>
                                <p>Kindly ignore this message if you did not request to change your password</p>
                            </div>
                        </body>
            </html>`
        }

        await transporter.sendMail(mailOptions)
        return true
    } catch (error) {
        console.log(error)
        return true
    }
}

export const OrderMail = async (to) => {
    try {
        const mailOptions = {
            from: 'Oven Fresh Pizza',
            to: to,
            subject: 'Pizza Order Confirmation',
            html: `<html>
                        <head>
                            <style>
                                h3{
                                    text-transform: uppercase;
                                }
                                a{
                                    padding: 0.85rem;
                                    background: #ffb400;
                                    color: #fff;
                                    border-radius: 5px;
                                    text-decoration: none;
                                    text-transform: uppercase;
                                }
                            </style>
                        </head>
                        <body>
                            <div>
                                <h3>Pizza Order Confirmation</h3>
                                <p>Thank you for your order. Your pizza will be delivered soon!</p>
                                <a href={'http://localhost:3002/order'}>Track Order</a>
                                <p>@Oven_Fresh_Pizza</p>
                            </div>
                        </body>
            </html>`
        }

        await transporter.sendMail(mailOptions)
        return true
    } catch (error) {
        console.log(error)
        return true
    }
}