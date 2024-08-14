const Offer = require('../models/offer');

//Create Offer
const createOffer = async (req, res) => {
    const { productId, businessId, offertype, offer, description, expiryDate } = req.body;
    if (!productId || !businessId || !offertype || !offer || !description || !expiryDate) {
        return res.status(400).json({ error: 'Please provide all the required fields' });   
    }
    try {
        const convertedExpiryDate = new Date(expiryDate);

        const newOffer = new Offer({ productId, businessId, offertype, offer, description, expiryDate: convertedExpiryDate });
        await newOffer.save();
        return res.status(200).json({ message: 'Offer added successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

//Get Offers
const getOffers = async (req, res) => {
    try {
        const offers = await Offer.find();
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
    
    const { productId, businessId, offertype, offer, description, expiryDate } = req.body;

    const offerToUpdate = await Offer.findOne({ productId: req.params.id });


    try {
        if(!offerToUpdate) {
            return res.status(404).json({ error: 'Offer not found' });
        }
        const updatedOffer = await Offer.findByIdAndUpdate(
            offerToUpdate._id,
            {
                $set: {
            
                    offertype,
                    offer,
                    description,
                    expiryDate: new Date(expiryDate),
                }
            },
            { new: true }
        );
        res.status(200).json({ message: 'Offer updated successfully', oldOffer: offerToUpdate, updatedOffer });
    } catch (error) {
        if (!updatedOffer) {
            return res.status(404).json({ error: 'Offer not found' });
        }
        return res.status(200).json({ message: 'Offer updated successfully', updatedOffer });
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