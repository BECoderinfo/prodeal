const express = require('express');

const { insertLike , getAllLikes, userLikedProduct, userLikedBusiness} = require('../controllers/likeController');


const likeRouter = express.Router();


//like routes

likeRouter.post("/", insertLike);
likeRouter.get("/all", getAllLikes);
likeRouter.get("/:userId", userLikedProduct);
likeRouter.get("/business/:userId", userLikedBusiness);



module.exports = likeRouter;