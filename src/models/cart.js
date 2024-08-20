const mongoose = require("mongoose");
const Offer = require('../models/offer');

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    items: [{
        offer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Offer",
            required: true,
        }
    }]
}, { timestamps: true });

cartSchema.pre('save', async function (next) {
    if (this.isModified('items')) {
        try {
            const now = new Date();

            const offerIds = this.items.map(item => item.offer);
            const offers = await Offer.find({ _id: { $in: offerIds } });

            const expiredOfferIds = offers
                .filter(offer => offer.expiresAt < now)
                .map(offer => offer._id);

            this.items = this.items.filter(item => !expiredOfferIds.includes(item.offer));

            console.log(`Removed ${expiredOfferIds.length} items with expired offers from the cart`);

        } catch (err) {
            return next(err);
        }
    }
    next(); 
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
