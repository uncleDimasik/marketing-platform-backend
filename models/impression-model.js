const { Schema, model } = require('mongoose');

const ImpressionSchema = new Schema({
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
  },
  banner_size: {
    type: String,
    required: true,
    enum: ['300x250', '728x90', '160x600', '468x60'],
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Technology',
      'Health',
      'Finance',
      'Education',
      'Entertainment',
    ],
  },
  user_id: {
    type: String,
    required: true,
  },
  bid: {
    type: Number,
    required: true,
    min: 0.1,
    max: 10,
  },
});

module.exports = model('Impression', ImpressionSchema);
