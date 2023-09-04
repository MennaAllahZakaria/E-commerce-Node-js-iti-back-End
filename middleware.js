const jwt = require('jsonwebtoken')
const utli = require('util')
const asyncverify = utli.promisify(jwt.verify)
const secretkey = 'kkkk'
const customError = require('./CustomError')

const authorized = async (req, res, next) => {
    const { authorization: token } = req.headers
    const decoded = await asyncverify(token, secretkey)
    if (decoded.id !== req.params.id) 
        next(customError({
            message: "Not Authorized",
            statusCode: 401
        }))
    
    next()
}

const adminauthorized =  async (req, res, next) => {
    const { authorization: token } = req.headers
    const decoded = await asyncverify(token, secretkey)
    console.log(req.params.id)
    if (!decoded.isAdmin) 
        next(customError({
            message: "Not Authorized",
            statusCode: 401
        }))
    
    next()
}
const tokenauthorized= async (req, res, next) => {
    try{
        const { authorization: token } = req.headers
    const decoded = await asyncverify(token, secretkey)
    req.body.userId=decoded.id;
    if (!token) 
    return res.status( 400).json({
        message: 'Not authorized',
        code: 400
    })
    }catch(error){
        return res.status( 400).json({
            message: 'Not authorized',
            code: 400
        })
    }
    
    
    next()
 
  }
module.exports = {authorized , adminauthorized,tokenauthorized}