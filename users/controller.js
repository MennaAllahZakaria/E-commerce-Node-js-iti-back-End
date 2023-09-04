const express = require("express");
const router = express.Router();
const customError = require("../CustomError");
const usermodel = require("./userModel");
const bcrypt = require('bcrypt')
const {authorized , adminauthorized} = require('../middleware')
const validator = require('validator');



function isStrongPassword(password) {
    // Validate password length
    if (!validator.isLength(password, { min: 8 })) { 
        return false;
    }
    // Validate password complexity
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+[{\]};:<>|./?])(?!.*\s).{8,}$/;
    if (!validator.matches(password, passwordRegex)) {
    return false;
    }
    // Additional checks
    if (validator.isLowercase(password) || validator.isUppercase(password) || validator.isNumeric(password)) {
    return false;
    }
    return true;
}


const signup = async (req, res) => {
    try {
        const { email, firstname, lastname, username, password, phonenumber, address, isAdmin } = req.body;
        
        // Validate Email
        
        if ( !validator.isEmail(email)){
            return res.status( 400).json({
                message: 'Email format is not correct',
                code: 400
            })
        }
        // Validate Length of first name
        if ( !validator.isLength(firstname,{ min: 3, max: 20 })){
            return  res.status( 400).json({
                message: 'your first name format is not valid',
                code: 400
            })
        }
        // Validate Length of last name
        if ( !validator.isLength(lastname,{ min: 3, max: 20 })){
            returnres.status( 400).json({
                message: 'your last name format is not valid',
                code: 400
              })
        }
        // Validate Mobile Phone
        if ( !validator.isMobilePhone(phonenumber, 'ar-EG')){
            return res.status( 400).json({
                message: 'your phone number format is not valid',
                code: 400
              })
        }
        


        
     // Validate password 
        if (!isStrongPassword(password)) {
            return res.status( 400).json({
                message: 'Your password is not valid \n Password length should be more than 8 char and should contain at least one lowercase letter, one uppercase letter, and one digit',
                code: 400
              })
        }

        

        const hashedPassword = await bcrypt.hash(password, 10);


        const newUser = new usermodel({
            email, 
            firstname,
            lastname,
            username,
            password:hashedPassword,
            phonenumber,
            address,
            isAdmin 
        });
        


        await newUser.save();
        const token = await newUser.generateToken();
        res.status(200).send({newUser,token});
    } catch (error) {
        res.status(500).send(customError({
            statusCode:400,
            message:"can\'t sign up"
        }))
        
}

};


module.exports={signup}