const exprtess = require('express');

const { adminlogin, admincreate, OTPverify, resendOTP } = require('../controllers/adminController');

const adminRouter = exprtess.Router();


adminRouter.post('/adminlogin', adminlogin);
adminRouter.post('/admincreate', admincreate);
adminRouter.post('/adminverify/:email', OTPverify);
adminRouter.post('/adminresendOTP/:email', resendOTP);


module.exports = adminRouter;