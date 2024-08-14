const express = require('express');
const validator = require("validator");
const mongoose = require('mongoose');

// Define the notification schema
const notificationSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please provide a title"],
    },
    description: {
        type: String,
        required: [true, "Please provide a description"],
    },
    type: {
        type: String,
        required: [true, "Please provide a notification type"],
        enum: ['ads', 'business', 'offer', 'other'], // Add other types as needed
    },
    data: {
        type: mongoose.Schema.Types.Mixed, // Flexible field to hold additional data
        default: {},
    },
}, { timestamps: true });


// Create and export the Notification model
module.exports = mongoose.model('Notification', notificationSchema);
