const Like = require('../models/like');
const mongoose = require('mongoose');

//get or remove likes on offer or business
const insertLike = async (req, res) => {
  try {
    const { userId, business } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    if (!business) {
      return res.status(400).json({ error: 'business is required' });
    }

    const existingLike = await Like.findOne({ business: business, user: userId });

    if (existingLike) {
      await Like.deleteOne({ _id: existingLike._id });
      return res.status(200).json({ message: 'Business unliked successfully' });
    } else {
      const like = new Like({
        business: business,
        user: userId,
      });

      await like.save();
      return res.status(200).json({ message: 'Business liked successfully' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
//get all likes
// const getAllLikes = async (req, res) => {
//   try {
//     const likes = await Like.find().populate('business');
//     return res.json(likes);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: 'Error fetching likes' });
//   }
// };
//get liked business by user id
const userLikedBusiness = async (req, res) => {
  try {
    const { userId } = req.params;
    const likes = await Like.find({ user: userId }).populate('user');
   
    res.status(200).json(likes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching likes' });
  }
};

module.exports = { insertLike, userLikedBusiness };



