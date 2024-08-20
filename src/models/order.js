const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    status: {
        type: String,
        default: "Pending",
        enum: ["Pending", "Processing", "Completed", "Cancelled"],
    },
    orderStatus: {
        type: String,
        default: "Pending",
        enum: ["Pending", "Accepted", "Rejected"],
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    offerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Offers",
        required: true
    },
    quantity: {
        type: Number,
        default: 1,
    },
    offerprice: {
        type: Number,
        default: 0.0,
    },
    promocode: {
        type: String
    },
    discount:
    {
        type: Number,
        default: 0.0,
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0,
    }

}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;