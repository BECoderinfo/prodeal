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
    },
    status: {
        type : String,
        default: "unVerified",
        enum: ["unVerified", "Verified"]
    },
    otp: { type: String },

    otpExpires: { type: Date },
}, { timestamps: true });


adminSchema.pre("save", async function (next) {
    if (this.isModified("status") && this.status === "Verified") {
        this.otp = undefined;
        this.otpExpires = undefined;
    }
    next();
});

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
