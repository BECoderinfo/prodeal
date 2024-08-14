const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
    offerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Offers',
        required: true
    },
    image: {
        type: Buffer,
        data: Buffer,
        contentType: String,
        required: [true, "Please provide a product image"],
    },
},{ timestamps: true });

const Banner = mongoose.model("Banner", bannerSchema); 
module.exports = Banner;