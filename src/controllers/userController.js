const User = require("../models/users");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const cron = require('node-cron');

// Runs every 24 hours for deleting unverified users
cron.schedule('0 0 * * *', async () => {
    try {
        await User.deleteMany({
            status: 'unVerified',
        });
    } catch (err) {
        console.error('Error deleting unverified users:', err);
    }
});

// Middleware for token verification
const sequre = async function (req, res, next) {
    try {
        const token = req.headers.token;
        if (!token) {
            throw new Error('Please send token');
        }
        const decoded = jwt.verify(token, 'Prodeals');
        req.userId = decoded.userId; 
        const userdata = await User.findById(req.userId);
        
        res.status(200).json({
            status: "Success",
            message: "Token verified",
            data: userdata   
        })
        next();
    } catch (error) {
        res.status(404).json({
            status: "Fail",
            message: error.message
        });
    }
};

// User Registration
const userRegister = async (req, res, next) => {
    try {
        const { userName, email, phone, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const otp = otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets : false });
        const otpHash = await bcrypt.hash(otp, 12);
        const otpExpires = Date.now() + 1 * 60 * 1000;

        const user = new User({
            userName,
            email,
            phone,
            password: hashedPassword,
            otp: otpHash,
            otpExpires
        });

        await user.save();

        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: 'ProDeals:upendrajin069@gmail.com',
                pass: 'sdjtxujwaavlraob', 
            },
            service: 'Gmail',
        });

        const mailOptions = {
            from: 'ProDeals:upendrajin069@gmail.com',
            to: user.email,
            subject: 'Your OTP Code',
            html: `<p style="font-size: 20px">Your OTP code is <span style="color: blue">${otp}</span>. It is valid for 2 minutes.</p>`,
        };

        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                return res.status(500).json({ message: 'Error sending OTP' });
            }
            res.json({ message: 'OTP successfully sent', user ,otp}); 
        });

    } catch (error) {
       
        res.status(500).json({ message: 'Server error', error });
    }
};

// User Login
const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        if(user.status !== "Verified"){
            return res.status(400).json({ message: 'Please complete your OTP verification' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const usertoken = jwt.sign({ userId: user._id }, 'Prodeals'); 

        res.status(200).json({ message: 'Login successful', usertoken });
    } catch (error) {
        
        res.status(500).json({ message: 'Server error', error });
    }
};

// Verify OTP
const OTPverify = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });   

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (Date.now() > user.otpExpires) {
            user.otp = null;
            user.otpExpires = null;
            await user.save();
            return res.status(400).json({ message: 'OTP has expired' });
        }

        const isMatch = await bcrypt.compare(otp, user.otp);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        user.otp = null;
        user.otpExpires = null;
        user.status = "Verified";
        await user.save();

        res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

//Get user by userId
const getUserById = async (req, res) => {   
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const resendOTP = async (req, res) => {
    
    const { email } = req.params;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const otp = otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets : false });
        const salt = bcrypt.genSaltSync(10);
        user.otp = bcrypt.hashSync(otp, salt);
        user.otpExpires = Date.now() + 1 * 60 * 1000; 
        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: 'ProDeals:upendrajin069@gmail.com',
                pass: 'sdjtxujwaavlraob',
            },
            service: 'Gmail',
           
        });

        const mailOptions = {
            from: 'ProDeals:upendrajin069@gmail.com',
            to: user.email,
            subject: 'Your OTP Code',
            html: `<p style="font-size: 20px">Your OTP code is <span style="color: blue">${otp}</span>. It is valid for 2 minutes.</p>`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ message: 'Error sending OTP' });
            }
            res.json({ message: 'OTP sent to your email' });
        });


        await user.save();
        res.status(200).json({ message: 'OTP sent successfully', otp });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update User Profile
const userProfileUpdate = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const { userName, address } = req.body;
        const image = req.file;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (userName) user.userName = userName;
        if (address) user.address = address;
        if (image && image.buffer) {
            user.image = image.buffer;
        }

        await user.save();

        res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Upload User Image
const userImageUpload = async (req, res, next) => {
    const userId = req.params.id;

    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const imgBase64 = req.file.buffer.toString('base64');

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.image = imgBase64;

        const updatedUser = await user.save();

        res.json({ user: updatedUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get All Users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//User Forget Password
const forgetPassword = async (req, res) => {
    try {
        const { email } = req.params;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const otp = otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets : false });
        const salt = bcrypt.genSaltSync(10);
        user.otp = bcrypt.hashSync(otp, salt);
        user.otpExpires = Date.now() + 1 * 60 * 1000; 
        await user.save();

        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: 'ProDeals:upendrajin069@gmail.com',
                pass: 'sdjtxujwaavlraob',
            },
            service: 'Gmail',
        });

        const mailOptions = {
            from: 'ProDeals:upendrajin069@gmail.com',
            to: user.email,
            subject: 'Your OTP Code',
            html: `<p style="font-size: 20px">Password Reset OTP code is <span style="color: blue">${otp}</span>. It is valid for 1 minute.</p>`,
        };

        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                return res.status(500).json({ message: 'Error sending OTP' });
            }
            res.json({ message: 'Password Reset OTP sent to your email', otp });
        });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

//Update User Password
const userPasswordUpdate = async (req, res) => {
    try {
        const { email, newPassword, confirmPassword } = req.body;

        if( !email || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const salt = bcrypt.genSaltSync(10);
        user.password = bcrypt.hashSync(newPassword, salt);
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = { userRegister, userLogin, userImageUpload, userProfileUpdate, getAllUsers, sequre, OTPverify, resendOTP, forgetPassword, userPasswordUpdate, getUserById };
