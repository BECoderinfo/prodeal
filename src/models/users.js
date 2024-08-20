const mongoose = require("mongoose");
const validator = require("validator");


const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, "Please tell us your name!"],
        minlength: 3,
        maxlength: 50,
    },
    email: {
        type: String,
        required: [true, "Please provide your email"],
        unique: [true, "Email already exists"],
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email"],
    },
    phone: {
        type: String,
        required: [true, "Please provide your phone number"],
        validate: [validator.isMobilePhone, "Please provide a valid phone number"],
        minlength: 10,
        maxlength: 10,
    },
    password: {
        type: String,
        required: [true, "Please provide your phone number"],
        minlength: 8,
    },
    image: {
        type: Buffer,
        data: Buffer,
        contentType: String
    },
    address: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Address"
        }
    ],
    status: {
        type : String,
        default: "unVerified",
        enum: ["unVerified", "Verified"]
    },
    isBusiness: {
        type: Boolean,
        default: false,
    },
    
    otp: { type: String },

    otpExpires: { type: Date },

}, { timestamps: true });

userSchema.pre("save", async function (next) {
    try {
        if (this.isModified("status") && this.status === "Verified") {
            this.otp = undefined;
            this.otpExpires = undefined;
        }
        next();
    } catch (err) {
        next(err); 
    }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
