const exprtess = require('express');

const { adminlogin, admincreate } = require('../controllers/adminController');

const adminRouter = exprtess.Router();


adminRouter.post('/adminlogin', adminlogin);
adminRouter.post('/admincreate', admincreate);

module.exports = adminRouter;