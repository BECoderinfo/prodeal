const express = require('express');

const { adminlogin, admincreate, OTPverify, resendOTP, forgotPassword , resetPassword } = require('../controllers/adminController');

const adminRouter = express.Router();


adminRouter.post('/adminlogin', adminlogin);
adminRouter.post('/admincreate', admincreate);
adminRouter.post('/adminverify/:email', OTPverify);
adminRouter.post('/adminresendOTP/:email', resendOTP);
adminRouter.post('/adminforgot/:email', forgotPassword);
adminRouter.post('/adminreset/:email', resetPassword);


module.exports = adminRouter;