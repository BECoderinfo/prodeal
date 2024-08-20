const express = require('express');
const { insertCartItem ,deleteCartItem ,getUserCart} = require('../controllers/cartController');
const cartRouter = express.Router();

//cart
cartRouter.post("/add", insertCartItem);
cartRouter.get('/get/:userId', getUserCart);
cartRouter.delete('/delete/:id', deleteCartItem);

module.exports = cartRouter;