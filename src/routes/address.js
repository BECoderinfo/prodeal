const express = require('express');

const { addAddress, getAddress, updateAddress, deleteAddress } = require('../controllers/addressController');


const addressRouter = express.Router();


addressRouter.post("/:id", addAddress);
addressRouter.get("/:id", getAddress);
addressRouter.put("/:id", updateAddress);
addressRouter.delete("/:id", deleteAddress);


module.exports = addressRouter;