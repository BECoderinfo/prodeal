const express = require('express');
const { getAllNotifications , adsNotification , businessNotification , offerNotification , otherNotification , createNotification } = require('../controllers/notificationController');


const notificationRouter = express.Router();


//notification routes
notificationRouter.get("/", getAllNotifications);

notificationRouter.post("/ads", adsNotification);
notificationRouter.post("/business", businessNotification);
notificationRouter.post("/offer", offerNotification);
notificationRouter.post("/other", otherNotification);

notificationRouter.post("/create", createNotification);


module.exports = notificationRouter;