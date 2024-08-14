const express = require('express');
const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },

    comment: {
        type: String
    }
}, { timestamps: true });

const Rating = mongoose.model("ratings", ratingSchema);

module.exports = Rating;