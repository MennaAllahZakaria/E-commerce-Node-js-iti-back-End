
const mongoose = require("mongoose");
const userschema= require("./userSchema")
const usermodel = mongoose.model("user", userschema);



module.exports = usermodel