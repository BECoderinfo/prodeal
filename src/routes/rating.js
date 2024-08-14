const express = require('express');
const {createRating, getRatingsByProduct, getAverageRating, deleteRating} = require('../controllers/ratingController');

const ratingRouter = express.Router();


ratingRouter.post("/add", createRating);
ratingRouter.get("/:productId", getRatingsByProduct);
ratingRouter.get("/average/:productId", getAverageRating);
ratingRouter.delete("/:ratingId", deleteRating);

module.exports = ratingRouter

