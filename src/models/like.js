const mongoose = require('mongoose');

const LikeSchema = new mongoose.Schema({
  business:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business'
  },
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const Like = mongoose.model('Like', LikeSchema);

module.exports = Like;
