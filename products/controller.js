const express = require("express");
const router = express.Router();
const customError = require("../CustomError");
const productmodel = require("./productModel");
const validator = require('validator');
const {authorized , adminauthorized} = require('../middleware')




const addpro = async (req, res) => {
    try{
    const {  name,price,description,instock } = req.body;
    
    const newproduct= new productmodel({
        name,
        price,
        description,
        instock
    });

    await newproduct.save();
    //const token = await newproduct.generateToken();
    res.status(200).send({newproduct});
    } catch (error) {
        res.status(error.status || 500).send({ error: error.message });
        
}
}
    

module.exports={addpro}
