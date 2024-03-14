
const errorMiddleware = (err, req, res, next) => {
    console.log(err.stack)

    const statusCode = err.statusCode
    const errorMessage = err.errorMessage || 'Internal sever error!'

    res.status(statusCode).json({
        success: false,
        message: errorMessage
    })

}


export default errorMiddleware