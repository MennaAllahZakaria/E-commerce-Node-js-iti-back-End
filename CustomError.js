module.exports = ({statusCode , message})=>{
    const customError = new Error(message)
    customError.status = statusCode
    customError.message = message
    return customError
}