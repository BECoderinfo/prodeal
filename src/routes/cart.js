const express = require('express');

const { insertCartItem,updateCartItem ,deleteCartItem} = require('../controllers/cartController');


const cartRouter = express.Router();


//cart

cartRouter.post("/add", insertCartItem);
cartRouter.put("/:id", updateCartItem);
cartRouter.delete('/:id', deleteCartItem);




module.exports = cartRouter;