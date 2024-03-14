import bcryptjs from 'bcryptjs'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'


export const hashToken = async (value)=>{
    const salt = await bcryptjs.genSalt(10)
    const hash = await bcryptjs.hash(value, salt)
    return hash
}


export const compareToken = async (value, defaultValue)=>{
    const compare = await bcryptjs.compare(value, defaultValue)
    return compare
}

export const generateToken = (id) => {
    return jwt.sign({userId: id}, process.env.JWT__TOKEN, {expiresIn: '1d'})
}

export const verificationCode = async () => {
    return crypto.randomBytes(3).toString('hex').toUpperCase()
}
