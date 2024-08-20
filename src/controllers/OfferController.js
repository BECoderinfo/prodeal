const Offer = require('../models/offer');
const Business = require('../models/business');

//Create Offer
const createOffer = async (req, res) => {
    try {
        const { offertype, offerPrice, description, expiryDate, businessId, productPrice, validOn } = req.body;

        if (!offertype || !offerPrice || !description || !expiryDate || !businessId || !productPrice || !validOn) {
            return res.status(400).json({ error: 'Please provide all the required fields' });
        }

        const business = await Business.findOne({ _id : businessId }); 
        if(!business){
            return res.status(400).json({ error: 'Please provide valid businessId' });  
        }

        let paymentAmount;

        if (offertype === 'Percentage') {
            paymentAmount = productPrice -((offerPrice / 100) * productPrice); 
        } else {
            paymentAmount = productPrice - offerPrice;
        }

        req.body.paymentAmount = paymentAmount;

        const offer = await Offer.create(req.body);

        return res.status(201).json({ message: 'Offer created successfully', offer });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

//Get Offers
const getOffers = async (req, res) => {
    try {
        const offers = await Offer.find().populate('businessId');
        if (offers.length === 0) {
            return res.status(404).json({ error: 'offers not found' });
        }
        return res.status(200).json({ offers });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

//get offer by bussinessid
const getOffersByBusinessId = async (req, res) => {
    try {
        const offers = await Offer.find({ businessId: req.params.id });
        if (offers.length === 0) {
            return res.status(404).json({ error: 'offers not found' });
        }
        return res.status(200).json({ offers });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

//Update Offer
const updateOffer = async (req, res) => {
    try {
        const updatedOffer = await Offer.findByIdAndUpdate(req.params.offerId,req.body,{ new: true });

        if (!updateOffer) {
            return res.status(404).json({ error: 'Offer not found' });
        }

        res.status(200).json({ message: 'Offer updated successfully',  updatedOffer });

    } catch (error) {
        return res.status(200).json({ message: error.message });
    }
};

const deleteOffer = async (req, res) => {
    try {
        const offer = await Offer.findById(req.params.id);
        if (!offer) {
            return res.status(404).json({ error: 'Offer not found' });
        }
        await Offer.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: 'Offer deleted successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = { createOffer, getOffers, updateOffer, deleteOffer, getOffersByBusinessId };