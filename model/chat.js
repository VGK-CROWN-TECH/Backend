const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  message: { type: String },
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
  fileUrls: [String]
});

module.exports = mongoose.model('Chat', chatSchema);
