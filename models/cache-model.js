const { Schema, model } = require('mongoose');

const cacheSchema = new Schema({
    key: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed, required: true },
    createdAt: { type: Date, expires: '1h', default: Date.now }
});


module.exports = model('Cache', cacheSchema);