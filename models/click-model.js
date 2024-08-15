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

module.exports = model('Click', ClickSchema);
