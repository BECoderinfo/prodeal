const Admin = require('../models/Admin')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');


const admincreate = async function (req, res) {
  try {

    //   let adminData = await Admin.create(req.body)

    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 12);


    const admin = new Admin({
      email,
      password: hashedPassword,
    });

    await admin.save();

    res.status(201).json({
      status: "Succses",
      massage: "Signup Succesfully",

    })
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "Fail",
      massage: error.massage
    }
    )
  }
}

const adminlogin = async (req, res) => {
  try {
      const { email, password } = req.body;
      const adminModel = await Admin.findOne({ email });

      if (!adminModel) {
          return res.status(400).json({ message: 'Invalid email or password' });
      }

      const isPasswordCorrect = await bcrypt.compare(password, adminModel.password);
      if (!isPasswordCorrect) {
          return res.status(400).json({ message: 'Invalid email or password' });
      }

      const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
      const otpHash = await bcrypt.hash(otp, 10);
      const otpExpires = Date.now() + 1 * 60 * 1000; 

      adminModel.otp = otpHash;
      adminModel.otpExpires = otpExpires;

      await adminModel.save();

      const transporter = nodemailer.createTransport({
          service: 'gmail', 
          auth: {
              user: 'ProDeals:upendrajin069@gmail.com', 
              pass: 'sdjtxujwaavlraob', 
          },
      });
    
      const mailOptions = {
          from: 'ProDeals:upendrajin069@gmail.com',
          to: adminModel.email,
          subject: 'Your OTP Code',
          html: `<p style="font-size: 20px">Admin OTP code is <span style="color: blue">${otp}</span>. It is valid for 2 minutes.</p>`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              console.error(`Error sending OTP email: ${error.message}`);
              return res.status(500).json({ message: 'Error sending OTP' });
          }
          console.log(`OTP sent: ${info.response}`);
          res.json({ message: 'OTP successfully sent', otp });
      });

  } catch (error) {
      console.log('Server error:', error);
      res.status(500).json({ message: 'Server error', error });
  }
};

//otp verify
const OTPverify = async (req, res) => {
  const { email } = req.params;
  const { otp } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({ message: 'admin not found' });
    }

    if (Date.now() > admin.otpExpires) {
      admin.otp = null;
      admin.otpExpires = null;
      await admin.save();
      return res.status(400).json({ message: 'OTP has expired' });
    }

    const isMatch = await bcrypt.compare(otp, admin.otp);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    admin.status = "Verified";
    admin.otp = null;
    admin.otpExpires = null;
    await admin.save();

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// resend otp
const resendOTP = async (req, res) => {
  const { email } = req.params; // Use req.body if you're sending email in body instead
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: 'Admin not found' });
    }

    const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
    const otpHash = await bcrypt.hash(otp, 12);
    const otpExpires = Date.now() + 2 * 60 * 1000; // Valid for 2 minutes 

    admin.otp = otpHash;
    admin.otpExpires = otpExpires;
    await admin.save();

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'mailto:upendrajin069@gmail.com', // Use 'user' instead of 'admin'
        pass: 'sdjtxujwaavlraob', // Use your Gmail app password
      },
    });

    const mailOptions = {
      from: 'mailto:upendrajin069@gmail.com',
      to: admin.email,
      subject: 'Your OTP Code',
      html: `<p style="font-size: 20px">Admin OTP code is <span style="color: blue">${otp}</span>. It is valid for 2 minutes.</p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(`Error sending OTP email: ${error}`);
        return res.status(500).json({ message: 'Error sending OTP' });
      }
      console.log(`OTP sent: ${info.response}`);
      res.json({ message: 'OTP successfully sent', otp });
    });
  } catch (error) {
    console.log('Server error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};
module.exports = { adminlogin, admincreate, OTPverify, resendOTP };
