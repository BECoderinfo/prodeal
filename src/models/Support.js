const mongoose = require("mongoose");

const supportSchema = new mongoose.Schema({
    quotation: {
        type: String,
        required: true
    },
    answer: {
        type: String,
    },
    status: {
        type: String,
        default: "Pending",
        enum: ["Pending", "Answered"]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true } );

module.exports = mongoose.model("Support", supportSchema)