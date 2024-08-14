const mongoose = require("mongoose");
const validator = require("validator");

const requestBusinessSchema = new mongoose.Schema({
    businessName: {
        type: String,
        required: [true, "Please provide the business name"],
    },
    contactNumber: {
        type: String,
        required: [true, "Please provide a contact number"],
        validate: [validator.isMobilePhone, "Please provide a valid contact number"],
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
}, { timestamps: true });

const RequestBusiness = mongoose.model("RequestBusiness", requestBusinessSchema);

module.exports = RequestBusiness;