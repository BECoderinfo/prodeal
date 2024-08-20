const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Business",
        required: true,
    },
    offertype: {
        type: String,
        required: true,
        enum: ["Percentage", "Amount"],
    },
    offerPrice: {
        type: Number,
        required: true,
    },
    productPrice: {
        type: Number,
        required: true,
    },
    paymentAmount: {
        type: Number,
    },
    validOn: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    usedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],  
    expiryDate: {
        type: Date,
        required: true,
    }
}, { timestamps: true });


OfferSchema.pre('save', async function (next) {
    if (this.isNew) {
        // Only check for expiryDate if the document is new
        if (this.expiryDate < Date.now()) {
            // Delete the document if the expiryDate has already passed
            await this.deleteOne();
        } else {
            // Set a TTL index on the expiryDate field to automatically delete documents after the expiryDate
            await this.constructor.collection.createIndex({ expiryDate: 1 }, { expireAfterSeconds: 0 });
            this.constructor.collection.createIndex({ expiryDate: 1 }, { expireAfterSeconds: 0 });
        }
    }
    next();
});

const Offer = mongoose.model("Offers", OfferSchema);

module.exports = Offer;