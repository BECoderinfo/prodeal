const mongoose = require("mongoose");
const validator = require("validator");

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please provide your email"],
        unique: [true, "Email already exists"],
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
        type: String,
        required: [true, "Please provide your phone number"],
        
    }
}, { timestamps: true });

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
