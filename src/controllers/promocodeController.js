const express = require('express');
const Promocode = require('../models/promocode');
const User = require('../models/users');

const { v4: uuidv4 } = require('uuid');

const insertPromocode = async (req, res) => {
    const { businessId, discountType, discount, expiryDate, description, neededAmount } = req.body;
    if (!businessId || !discountType || !discount || !expiryDate || !neededAmount) {
        return res.status(400).json({ error: 'Please provide all the required fields' });
    }

   
    const convertedExpiryDate = new Date(expiryDate);

    try {
        let promocode;
        do {
            promocode = uuidv4().slice(0, 7).toUpperCase().replace(/[^A-Z0-9]/g, '');
        } while (promocode.length < 7 || promocode.length > 7);
        
        const newPromocode = new Promocode({ promocode, businessId, discountType, discount, expiryDate: convertedExpiryDate, description, neededAmount });
        await newPromocode.save();
        return res.status(200).json({ message: 'Promocode added successfully', promocode });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const getPromocode = async (req, res) => {
    try {
        const promocodes = await Promocode.find();
        return res.status(200).json({ promocodes });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const redeemPromocode = async (req, res) => {
    const { promocode, userId } = req.body;
    if (!promocode || !userId) {
        return res.status(400).json({ error: 'Please provide a promocode' });
    }
    try {
    
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const promocodeData = await Promocode.findOne({
            promocode,
            usedBy: { $ne: userId }
        });
        if (!promocodeData) {
            return res.status(404).json({ error: 'Promocode not found or already used by you' });
        }
        const updatedPromocode = await Promocode.findOneAndUpdate(
            { promocode },
            { $push: { usedBy: userId } },
            { new: true }
        );
        return res.status(200).json({ promocodeData: updatedPromocode });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const deletePromocode = async (req, res) => {
    try {
        const { promocode } = req.body;
        const deletedPromocode = await Promocode.findOneAndDelete({ promocode });
        if (!deletedPromocode) {
            return res.status(404).json({ error: 'Promocode not found' });
        }
        return res.status(200).json({ message: 'Promocode deleted successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const getreedmedPromocode = async (req, res) => {
    try {
        const promocodes = await Promocode.find({ usedBy: { $ne: [] } });
        const promocodesWithPromocode = promocodes.map(promocode => {
            return {
                promocode: promocode.promocode,
                usedBy: promocode.usedBy.map(userId => {
                    return {
                        userId,
                        promocode: promocode.promocode
                    };
                })
            };
        });
        return res.status(200).json({ promocodes: promocodesWithPromocode });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { insertPromocode , getPromocode , redeemPromocode , deletePromocode, getreedmedPromocode };