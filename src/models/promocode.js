
const mongoose = require('mongoose');

const PromocodeSchema = new mongoose.Schema({
    promocode: {
        type: String,
        required: true,
    },
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Business",
        required: true,
    },
    usedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    neededAmount: {
        type: Number,
        required: true,
    },
    discountType: {
        type: String,
        required: true,
        enum: ["Percentage", "Amount"],
    },
    discount: {
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
});

PromocodeSchema.pre('save', function(next) {
    if (this.isNew) {
      // Only check for expiryDate if the document is new
      if (this.expiryDate < Date.now()) {
        // Delete the document if the expiryDate has already passed
        this.deleteOne();
      } else {
        // Set a TTL index on the expiryDate field to automatically delete documents after the expiryDate
        this.constructor.collection.createIndex({ expiryDate: 1 }, { expireAfterSeconds: 0 });
      }
    }
    next();
});

const Promocode = mongoose.model("Promocode", PromocodeSchema);

module.exports = Promocode;