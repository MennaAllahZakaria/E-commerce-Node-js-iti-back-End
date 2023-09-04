require('./db')
const express = require("express");
const app = express();
const port = 3000;

const userRouter = require('./users/userRouter');
const productRouter=require('./products/productRouter');
const cartRouter=require("./cart/cartRouter")
const cart=require("./users/cart")
app.use(express.json());
app.use(['/users' , "/user"], userRouter);
app.use(['/products',"/product"], productRouter);
app.use(['/cart'], cart);


app.use((err , req ,res ,next)=>{
    res.status(err.status).send({
        message : err.message
    })
})


app.listen(port, () => {
    console.log(`Server is running at ${port}`);
  });
  
/*
  "name":"book",
  "price":100,
  "description":"it is book",
  "instock":10

  ---------------------------------

  "firstname":"menna",
    "lastname":"zakaria",
   "email":"menna@gmail.com",
    "username":"menna",
   "password":"Menna200#",
    "phonenumber":"01201908898",
    "address":"portsaid",
    "isAdmin":false

    "firstname":"nouran",
    "lastname":"noah",
   "email":"nouran@gmail.com",
    "username":"nouran",
   "password":"Nouran200#",
    "phonenumber":"01201908898",
    "address":"portsaid",
    "isAdmin":false

*/

