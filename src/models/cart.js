const mongoose = require("mongoose");
const validator = require("validator");

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    items: [
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
        },
    ],
    quantity: {
        type: Number,
        default: 1,
        required: true,
    },
},{ timestamps: true });

const CartItem = mongoose.model("CartItem", cartSchema); 
module.exports = CartItem; 
