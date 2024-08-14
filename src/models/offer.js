const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({

    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
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
    offer: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
    },
    expiryDate: {
        type: Date,
        required: true,
    },
},{ timestamps: true } );


OfferSchema.pre('save',async function(next) {
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