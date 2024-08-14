const express = require('express');
const validator = require("validator");
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderItems: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: {
                type: Number,
                default: 1,
            },
            price: {
                type: Number,
                required: true,
            },
            total: {
                type: Number,
                required: true,
            },
        },
    ],
    status: {
        type: String,
        default: "Pending",
        enum: ["Pending", "Processing", "Completed", "Cancelled"],
    },
    orderStatus: {
        type: String,
        default: "Pending",
        enum: ["Pending","Accepted","Rejected"],
    },
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Business",
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    promocode: {
        type: String
    },
    discount: [
        {
            type: String,
        },
        {
            type: Number,
            default: 0.0,
        }
    ],
    tax: [
        {   
            type: String,
        },
        {   
           type: Number,
            default: 0.0,
        }
    ],
    totalPrice: {   
        type: Number,
        required: true,
        default: 0.0,
    }

}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;