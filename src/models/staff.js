const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require("validator");


const staffSchema = new Schema({
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  StaffId: {
    type: String,
  },
  name: {
    type: String,
    required: [true, "Please provide a name"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: [true, "Email already exists"],
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  phone: {
    type: String,
    validate: [validator.isMobilePhone, "Please provide a valid phone number"],
    minlength: 10,
    maxlength: 10,
  },
  role: {
    type: String,
    enum: ["other", "staff"],
    default: "staff"
  }
 
}, { timestamps: true });

const Staff = mongoose.model("Staff", staffSchema);
module.exports = Staff;