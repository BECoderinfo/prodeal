const express = require('express');
const userRouter = require('./users');
const cartRouter = require('./cart');
const likeRouter = require('./like');
const businessRouter = require('./business');
const addressRouter = require('./address');
const orderRouter = require('./order');
const promocodeRouter = require('./promocode');
const notificationRouter = require('./notification');
const supportRouter = require('./support');
const  adminRouter = require('./Admin');
const offerRouter = require('./offer');
const ratingRouter = require('./rating');
const bannerRouter = require('./banner');
const staffRouter = require('./staff');

const indexRouter = express.Router();

indexRouter.use('/users', userRouter); // Assuming your userRouter handles routes for users
indexRouter.use('/cart', cartRouter); // Assuming your cartRouter handles routes for cart op
indexRouter.use('/like', likeRouter); // Assuming your cartRouter handles routes for like op
indexRouter.use('/business', businessRouter);
indexRouter.use('/address', addressRouter);
indexRouter.use('/order', orderRouter);
indexRouter.use('/promocode', promocodeRouter);
indexRouter.use('/notification', notificationRouter);
indexRouter.use('/support', supportRouter);
indexRouter.use('/admin', adminRouter);
indexRouter.use('/offer', offerRouter);
indexRouter.use('/rating', ratingRouter);
indexRouter.use('/banner', bannerRouter);
indexRouter.use('/staff', staffRouter);


module.exports = indexRouter;
