const express = require("express");
const router = express.Router();
const customError = require("../CustomError");
const usermodel = require("./userModel")
const bcrypt = require('bcrypt')
const { authorized, adminauthorized,tokenauthorized} = require('../middleware')
const { signup } = require('./controller')
const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");

////////////////////sinup////////////////////////////
router.post("/", signup);
//////////////////////////////get////////////////////////////////////////////
router.get("/",adminauthorized, async (req, res) => {
  try {
    const list = await usermodel.find({});
    res.status(200).send(list);
  } catch (error) {
    res.status(error.status || 500).send({ error: error.message });
  }
});

//////////////////////////////get (ID)////////////////////////////////////////////

router.get("/get/:id", async (req, res,next) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        next(
            customError({
              statusCode: 400,
              message: "Sorry, Invalid user ID",
            })
          );
      }
  
      const fineuser = await usermodel.findById(id);
      if (fineuser) {
        res.send(fineuser);
      } else {
        next(
            customError({
              statusCode: 404,
              message: "user not found",
            })
          );
      }
    } catch (error) {
      res.status(error.status || 500).send({ error: error.message });
    }
  });

  ///////////////////////////////login//////////////////////////////
router.post('/login',async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await usermodel.findOne({ email });
        
  if (!user) {
    next(customError({
      statusCode: 401,
      message: "password or email is not correct"

    }))
  }

  const copmarpass = await bcrypt.compare(password, user.password)
  if (copmarpass) {
    const token = await user.generateToken()
    res.status(200).send(token)
  }

  next(customError({
    statusCode: 401,
    message: "password or email is not correct"
  }))

    } catch (error) {
        res.status(404).send({ error: 'Error logging in'});
}
}

);


////////////////////////edit///////////////////////////////

router.patch("/edit/:id", authorized, async (req, res,next) => {
    try {
      const { id } = req.params;
      const { firstname, lastname,email,username,password, phoneNumber,address, isAdmin } = req.body;
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        next(
            customError({
              statusCode: 400,
              message: "Sorry, Invalid user ID",
            })
          );
      }
  
      const edituser = await usermodel.findByIdAndUpdate(id, {
        firstname,
        lastname,
        email,
        username,
        password,
        phoneNumber,
        address, 
        isAdmin
      });
     
      if (edituser) {
        console.log('User Updated successfully');
        res.status(200).send("It is Updated");
      } else {
        next(
            customError({
              statusCode: 404,
              message: "user not found",
            })
          );
      }
    } catch (error) {
      res.status(error.status || 500).send({ error: error.message });
    }
  });

// ////////////////////////del//////////////////////////////////////////

router.delete("/del/:id", authorized ,(req, res) => {
  const { id } = req.params;

  usermodel.findByIdAndDelete(id)
  .then(() => {
    
    console.log('User deleted successfully');
    res.status(200).send("deleted")
  })
  .catch(err => {
    console.error('Failed to delete user', err);
    res.status(201).send("Faild")
  });

});

//-------------------------cart--------------------------


module.exports = router;