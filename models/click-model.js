const { Schema, model } = require('mongoose');

const ClickSchema = new Schema({
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
  },
  impression_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Impression',
  },
  user_id: {
    type: String,
    required: true,
  },
});
// Adding indexes
ClickSchema.index({ impression_id: 1 }); // Index on impression_id for faster lookups
ClickSchema.index({ user_id: 1 }); // Index on user_id for fast user-based queries
ClickSchema.index({ timestamp: -1 }); // Index on timestamp for sorting and filtering by time

module.exports = model('Click', ClickSchema);
