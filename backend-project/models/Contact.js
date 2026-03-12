const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  message: { type: String, required: true },
  sentBy:  { type: String, default: 'Admin' },
  sentAt:  { type: Date, default: Date.now },
});

const contactSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  email:   { type: String, required: true },
  subject: String,
  message: { type: String, required: true },
  isRead:  { type: Boolean, default: false },
  replies: { type: [replySchema], default: [] },   
}, {
  timestamps: true
});

module.exports = mongoose.model('Contact', contactSchema);