import Jwt from 'jsonwebtoken'

const authMiddleware = (req, res, next) => {
    try {
        const headers = req.headers?.authorization
        if (!headers || !headers.startsWith('Bearer')){
            return res.status(403).json({
                success: false,
                message: 'Authorization failed!'
            })
        }

        const token = headers.split(' ')[1]

        const verify = Jwt.verify(token, process.env.JWT__TOKEN)

        req.body.user = {
            userId: verify.userId,
        }

        next()
    } catch (error) {
        console.log(error)
    }
}

export default authMiddleware