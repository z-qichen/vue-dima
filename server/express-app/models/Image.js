var mongoose = require('mongoose');

var imageSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  originalname: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Image', imageSchema);
