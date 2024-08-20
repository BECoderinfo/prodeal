const express = require('express');

const { createOffer, getOffers, updateOffer, deleteOffer, getOffersByBusinessId } = require('../controllers/OfferController');


const offerRouter = express.Router();

offerRouter.post("/Create", createOffer);
offerRouter.get("/Get", getOffers);
offerRouter.put("/Update/:offerId", updateOffer);
offerRouter.get("/bussinessGet/:id", getOffersByBusinessId);
offerRouter.delete("/Delete/:id", deleteOffer);



module.exports = offerRouter;
