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

ImpressionSchema.index({ user_id: 1 }); // Index on user_id for quick lookups
ImpressionSchema.index({ banner_size: 1, category: 1 }); // Compound index on banner_size and category

module.exports = model('Impression', ImpressionSchema);
