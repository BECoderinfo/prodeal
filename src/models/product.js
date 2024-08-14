const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Business",
        required: true,
    },
    productName: {
        type: String,
        required: [true, "Please provide the product name"],
    },
    productDescription: {
        type: String,
        required: [true, "Please provide a product description"],
    },
    productPrice: {
        type: Number,
        required: [true, "Please provide a product price"],
    },
    quantity: {
        type: Number,   
        default: 1, 
        required: true,
    },
    image: {
        type: Buffer,
        data: Buffer,
        contentType: String,
        required: [true, "Please provide a product image"],
    },
    category: {
        type: String,
        default: "Other",
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
    rating: {
        type: Number,
        default: 0,
    },

},{ timestamps: true });

const productItem = mongoose.model("ProductItem", productSchema); 
module.exports = productItem;