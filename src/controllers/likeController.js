const Like = require('../models/like');
const mongoose = require('mongoose');


//get or remove likes on product or business
const insertLike  = async (req, res, next) => {
  try {
      const { productId, userId, business } = req.body;
      
      
      if (!userId) {
          return res.status(400).json({ error: 'userId is required' });
      }

      
      if (!productId && !business) {
          return res.status(400).json({ error: 'Either productId or business is required' });
      }
      
      let existingLike;
      
      if (productId) {
          
          existingLike = await Like.findOne({ product: productId, user: userId });
          
          if (existingLike) {
              await Like.deleteOne({ product: productId, user: userId });
              return res.status(200).json({ message: 'Product like removed successfully' });
          } else {
              const like = new Like({
                  product: productId,
                  user: userId,
                  business: business,
              });
              await like.save();
              return res.status(200).json({ message: 'Product liked successfully' });
          }
      } else if (business) {
        
          existingLike = await Like.findOne({ business: business, user: userId });
          
          if (existingLike) {
              await Like.deleteOne({ business: business, user: userId });
              return res.status(200).json({ message: 'Business like removed successfully' });
          } else {
              const like = new Like({
                  business: business,
                  user: userId,
              });
              await like.save();
              return res.status(200).json({ message: 'Business liked successfully' });
          }
      }

  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
  }
};

//get all likes
// const getAllLikes = async (req, res, next) => {
//   try {
//     const likes = await Like.find();
//     res.status(200).json(likes);  
//   } catch (err) {
//     res.status(500).json({ error: 'Error fetching likes' });
//   }
// };

const getAllLikes = async (req, res, next) => {
  try {
    const likes = await Like.aggregate([
      {
        $lookup: {
          from: 'productitems',
          localField: 'product',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      {
        $lookup: {
          from: 'businesses',
          localField: 'business',
          foreignField: '_id',
          as: 'businessDetails'
        }
      },
      {
        $addFields: {
          details: {
            $cond: [{
              $gt: [{ $size: { $ifNull: ["$productDetails", []] } }, 0]
            }, "$productDetails", "$businessDetails"]
          }
        }
      },
      {
        $project: {
          productDetails: 0,
          businessDetails: 0
        }
      }
    ]);
    res.status(200).json(likes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching likes' });
  }
};

//get all liked or products by user id
// const userLikedProduct = async (req, res, next) =>{
//   const user = req.params.userId;
//   try {

//     if (!user) {
//       return res.status(400).json({ error: 'userId is required' });
//     }

//     const likes = await Like.find({ user, product: {$exists: true}});
//     res.status(200).json(likes);  
//   } catch (err) {
//     res.status(500).json({ error: 'Error fetching likes' });
//   }
// };

const userLikedProduct = async (req, res, next) => {
  
  try {
    const likes = await Like.aggregate([
      {
        $match: { user : new mongoose.Types.ObjectId(req.params.userId), product: {$exists: true} }
      },
      {
        $lookup: {
          from: 'productitems',
          localField: 'product',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      {
        $addFields: {
          productDetails: {
            $cond: [
              { $gt: [{ $size: { $ifNull: ["$productDetails", []] } }, 0] },
              "$productDetails",
              []
            ]
          }
        }
      }
    ]);
    res.status(200).json(likes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching likes' });
  }
};

//get liked business by user id
// const userLikedBusiness = async (req, res, next) => {
//   const user = req.params.userId;
//   try {

//     if (!user) {
//       return res.status(400).json({ error: 'userId is required' });
//     }
    
//     const likes = await Like.find({ user, business: {$exists: true}});
//     res.status(200).json(likes);  
//   } catch (err) {
//     res.status(500).json({ error: 'Error fetching likes' });
//   }
// };

const userLikedBusiness = async (req, res, next) => {

  try { 
    const likes = await Like.aggregate([
      {
        $match: { user : new mongoose.Types.ObjectId(req.params.userId), business: {$exists: true} }
      },
      {
        $lookup: {
          from: 'businesses',
          localField: 'business',
          foreignField: '_id',
          as: 'businessDetails'
        }
      },
      {
        $addFields: {
          businessDetails: {
            $cond: [
              { $gt: [{ $size: { $ifNull: ["$businessDetails", []] } }, 0] },
              "$businessDetails",
              []
            ]
          }
        }
      } 
    ]);
    res.status(200).json(likes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching likes' });
  }
};

module.exports = {insertLike , getAllLikes, userLikedProduct, userLikedBusiness};



