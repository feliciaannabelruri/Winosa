const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  blogId: {
    type: String,
    required: true,
  },
  name: String,
  message: String,
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);