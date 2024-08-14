const express = require('express');

const { insertPromocode , getPromocode , redeemPromocode, deletePromocode, getreedmedPromocode } = require('../controllers/promocodeController');


const promocodeRouter = express.Router();


//promocode routes

promocodeRouter.post("/Insert", insertPromocode);
promocodeRouter.get("/Getpromo", getPromocode);
promocodeRouter.post("/redeem", redeemPromocode);
promocodeRouter.get("/Getreedmed", getreedmedPromocode);
promocodeRouter.post("/delete", deletePromocode);



module.exports = promocodeRouter;