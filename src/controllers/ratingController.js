const Rating = require('../models/rating');



// get ratings
const createRating = async (req, res) => { 
    try {
      const { productId, userId, rating, comment } = req.body;

      const existingRating = await Rating.findOne({ productId, userId });
      if (existingRating) {
        return res.status(400).json({ message: 'You already gave a rated on this product' });
      }

      const newRating = new Rating({ productId, userId, rating, comment });
      await newRating.save();
      res.status(201).json({ message: 'Rating added successfully', rating: newRating });
    } catch (error) {
      res.status(500).json({ message: 'Error adding rating', error });
    }
};


// get ratings by product
const getRatingsByProduct = async (req, res) => {
    try {
      const { productId } = req.params;
      const ratings = await Rating.find({ productId });
      res.status(200).json(ratings);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching ratings', error });
    }
  };


// get average rating
const getAverageRating = async (req, res) => {
    try {
      const { productId } = req.params;
      const ratings = await Rating.find({ productId });
      const averageRating = ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length;
      res.status(200).json({ averageRating });
    } catch (error) {
      res.status(500).json({ message: 'Error calculating average rating', error });
    }
};

//delete rating

const deleteRating = async (req, res) => {
    try {
      const { ratingId } = req.params;
      const deletedRating = await Rating.findByIdAndDelete(ratingId);
      if (!deletedRating) {
        return res.status(404).json({ message: 'Rating not found' });
      }
      res.status(200).json({ message: 'Rating deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting rating', error });
    }
  };


module.exports = { createRating, getRatingsByProduct, getAverageRating, deleteRating };