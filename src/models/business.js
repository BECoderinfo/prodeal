const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Assume you have a User model defined somewhere else
// const User = require('./userModel'); 

const businessSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    businessName: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    landmark: {
        type: String
    },
    state: {
        type: String
    },
    city: {
        type: String
    },
    pincode: {
        type: String
    },
    location: {
        type: String
    },
    telephone: {
        type: String
    },
    businessEmailId: {
        type: String
    },
    businessWebsite: {
        type: String
    },
    category: {
        type: String
    },
    gstNumber: {
        type: String
    },
    panNumber: {
        type: String
    },
    proofImage: {
        type: String
    },
    openTime: {
        type: String
    },
    closeTime: {
        type: String
    },
    offDays: {
        type: [String]
    },
    notes: {
        type: String
    },
    menuImages: {
        type: [
            {
                data: Buffer,
                contentType: String
            },
        ],
    },
    storeImages: {
        type: [
            {
                data: Buffer,
                contentType: String
            },
        ],
    },
    mainImage: {
        data: Buffer,
        contentType: String
    },
    waterIdImage: {
        data: Buffer,
        contentType: String
    },
    govermentIdImage: {
        data: Buffer,
        contentType: String
    }
});


const Business = mongoose.model('Business', businessSchema);

module.exports = Business;
