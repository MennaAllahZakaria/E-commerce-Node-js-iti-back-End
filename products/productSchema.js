const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        unique:true,
        required: true,
        },
    price: {
        type:Number,
        required: true,
        },
    description:{
        type: String,
        },
    instock:{
        type:Number,
        default:false
    }
  
})



module.exports = productSchema