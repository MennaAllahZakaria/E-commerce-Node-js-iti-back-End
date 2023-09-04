
const mongoose = require("mongoose");
const productschema= require("./productSchema")
const productModel = mongoose.model("Product", productschema);



module.exports = productModel

