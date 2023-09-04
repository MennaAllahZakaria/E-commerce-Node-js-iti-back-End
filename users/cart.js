const express = require("express");
const router = express.Router();
const customError = require("../CustomError");
const usermodel = require("./userModel")
const productmodel= require("../products/productModel")
const { authorized, adminauthorized,tokenauthorized} = require('../middleware')
const { signup } = require('./controller')
const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");



function getProductById(productId) {
    // Logic to retrieve the product by ID from the products array or the database
    return productmodel.findOne(productId)
  }
  
  function getUserById(userId) {
    // Logic to retrieve the user by ID from the users array or the database
    return usermodel.find(user => user.id === userId);
  }
  
  

  router.post('/:id',authorized,async (req, res) => {
    try{
    
  
        const productId = req.body.productId;
        const userId = req.params.id; 
        const product = await productmodel.findById(productId);
        const user = await usermodel.findById( userId);
        
        if (!product) {
            res.status(404).json({ message: 'Product not found' });
        }
        
        if (!user) {
        res.status(404).json({ message: 'User not found' });
        }
        ;
        // const productIndex = user.cart.find({ product});
        // console.log(productIndex)
        // if (productIndex===-1 ){
        //   return res.status(404).json({ message: 'Product is allredy found' });
        // }

        // Add the product to the user's cart
        user.cart.push({product});
        await user.save();
        
        return res.status(200).json({ message: 'Product added to cart successfully' });
    }catch(error){
        res.status(error.status || 500).send({ error: error.message });
    }


});

    router.get('/', async(req, res) => {
    const userId = req.body.userId; // Assuming the user ID is sent as a query parameter
    const user = await usermodel.findById( userId);
  
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
  
    const cart = user.cart;
    res.status(200).json({ cart });
    
  });
    
  
  router.delete('/cancel', async(req, res) => {
    const userId = req.body.userId; // Assuming the user ID is sent as a query parameter
    const productId = req.body.productId;
    const user =await usermodel.findById( userId);
  
    if (!user) {
      return res.status(404).send(customError({
        statusCode:400,
        message:"User not found"
    }))
    }
  
    const productIndex = user.cart.findIndex((product) => product.id === productId);
    
    if (productIndex !== -1) { 
        return res.status( 404).json({
            message: 'Product not found in cart',
            code: 404
        })
    
    }
  
    user.cart.splice(productIndex, 1);
    await user.save();
    res.status(200).send("Product removed from cart");
  });

module.exports = router;
