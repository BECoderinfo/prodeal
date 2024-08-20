const express = require('express');

const { insertLike , userLikedBusiness} = require('../controllers/likeController');

const likeRouter = express.Router();
//like routes
likeRouter.post("/", insertLike);
likeRouter.get("/business/:userId", userLikedBusiness);

module.exports = likeRouter;