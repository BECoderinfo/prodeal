const express = require('express');
const Address = require('../models/address');
const User = require('../models/users');

const addAddress = async (req, res) => {

    try {
        const { userName, phone, email, address, city, state, pincode } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const newAddress = new Address({
            userName,
            phone,
            email,
            address,
            city,
            state,
            pincode,
        });

        await newAddress.save();
        user.address.push(newAddress._id);
        await user.save();
        res.status(201).json({ message: 'Address added successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getAddress = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const addresses = await Address.find({ _id: { $in: user.address } });
        res.status(200).json(addresses);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const updateAddress = async (req, res) => {
    try {
        const addressId = req.params.id;
        const updatedAddress = await Address.findByIdAndUpdate(addressId, req.body, { new: true });
        res.status(200).json(updatedAddress);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteAddress = async (req, res) => {
    try {
        const addressId = req.params.id;
        await Address.findByIdAndDelete(addressId);
        res.status(200).json({ message: 'Address deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { addAddress , getAddress , updateAddress , deleteAddress};