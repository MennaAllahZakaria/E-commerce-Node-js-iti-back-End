const express = require("express");
const router = express.Router();
const customError = require("../CustomError");
const productmodel = require("./productModel")
const { authorized, adminauthorized} = require('../middleware')
const {addpro } = require('./controller')
const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");


router.post("/", addpro);

router.get("/", async (req, res) => {
    try {
      const list = await productmodel.find({});
      res.status(200).send(list);
    } catch (error) {
      res.status(error.status || 500).send({ error: error.message });
    }
  });


  
router.get("/get/:id", async (req, res,next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
        next(
            customError({
            statusCode: 400,
            message: "Sorry, Invalid product ID",
            })
          );
      }
  
      const fineproduct = await productmodel.findById(id);
      if (fineproduct) {
        res.status(200).send(fineproduct);
      } else {
        next(
            customError({
            statusCode: 404,
            message: "product not found",
            })
          );
      }
    } catch (error) {
      res.status(error.status || 500).send({ error: error.message });
    }
  });

 

  router.patch("/edit/:id", async (req, res,next) => {
    try {
      const { id } = req.params;
      const {   name,price,description,instock} = req.body;
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        next(
            customError({
              statusCode: 400,
              message: "Sorry, Invalid product ID",
            })
          );
      }
  
      const editproduct = await productmodel.findByIdAndUpdate(id, {
        name,
        price,
        description,
        instock,
      });
     
      if (editproduct) {
        console.log('Product Updated successfully');
        res.status(200).send("It is Updated");
      } else {
        next(
            customError({
              statusCode: 404,
              message: "product not found",
            })
          );
      }
    } catch (error) {
      res.status(error.status || 500).send({ error: error.message });
    }
  });


  router.delete("/del/:id" ,(req, res) => {
    const { id } = req.params;
  
    productmodel.findByIdAndDelete(id)
    .then(() => {
      
      console.log('Product deleted successfully');
      res.status(200).send("deleted")
    })
    .catch(err => {
      console.error('Failed to delete product', err);
      res.status(201).send("Faild")
    });
  
  });
  

module.exports = router;