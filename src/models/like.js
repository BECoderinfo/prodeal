const mongoose = require('mongoose');

const LikeSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductItem',
    required: function() {
      return !this.business; // business is required if product is not provided
    }
  },
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: function() {
      return !this.product; // product is required if business is not provided
    }
  },
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const Like = mongoose.model('Like', LikeSchema);

module.exports = Like;
