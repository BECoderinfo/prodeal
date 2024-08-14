const mongoose = require("mongoose");
const validator = require("validator");

const addressSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, "Please tell us your name!"],
        minlength: 3,
        maxlength: 50,
    },
    phone: {
        type: String,
        required: [true, "Please provide your phone number"],
        validate: [validator.isMobilePhone, "Please provide a valid phone number"],
        minlength: 10,
        maxlength: 10,
    },
    email:{
        type: String,
        required: [true, "Please provide your email"],
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email"],
    },
    address: {
        type: String,
        required: [true, "Please provide an address"],
    },
    city: {
        type: String,
        required: [true, "Please provide a city"],
    },
    state: {
        type: String,
        required: [true, "Please provide a state"],
    },
    country: {
        type: String,
    },
    pincode: {
        type: String,
        required: [true, "Please provide a pincode"],
    },
    landmark: {
        type: String,
    },  
}, { timestamps: true });

const Address = mongoose.model("Address", addressSchema);

module.exports = Address;