const express = require('express');

const { addAddress, getAddress, updateAddress, deleteAddress } = require('../controllers/addressController');


const addressRouter = express.Router();


addressRouter.post("/add/:id", addAddress);
addressRouter.get("/get/:id", getAddress);
addressRouter.put("/update/:id", updateAddress);
addressRouter.delete("/delete/:id", deleteAddress);


module.exports = addressRouter;