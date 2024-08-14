const express = require('express');
const Notification = require('../models/notification');
const User = require('../models/users');
const Product = require('../models/product');
const Business = require('../models/business');
const Order = require('../models/order');


const getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find().sort({ createdAt: -1 });
        res.status(200).json({ notifications });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving notifications' });
    }
}

const adsNotification = async (req, res) => {
    try {
        const notifications = await Notification.find({ type: 'ads' });
        res.status(200).json({ notifications });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving notifications' });
    }
};

const businessNotification = async (req, res) => {
    try {
        const notifications = await Notification.find({ type: 'business' });
        res.status(200).json({ notifications });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving notifications' });
    }
};

const offerNotification = async (req, res) => { 
    try {
        const notifications = await Notification.find({ type: 'offer' });
        res.status(200).json({ notifications });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving notifications' });
    }
};

const otherNotification = async (req, res) => {
    try {
        const notifications = await Notification.find({ type: 'other' });
        res.status(200).json({ notifications });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving notifications' });
    }
};

const createNotification = async (req, res) => {

    const { title, description, type, data } = req.body;
    try {
        const newNotification = new Notification({
            title,
            description,
            type,
            data
        });
        await newNotification.save();
        res.status(201).json({ message: 'Notification created successfully', newNotification });
    } catch (error) {
        res.status(500).json({ message: 'Error creating notification' });
    }

};

module.exports = { adsNotification,
    businessNotification,
    offerNotification,
    otherNotification,
    createNotification,
    getAllNotifications
};