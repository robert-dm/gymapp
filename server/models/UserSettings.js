const mongoose = require('mongoose');

const userSettingsSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User', unique: true },
  ai_provider: { type: String, enum: ['openai', 'anthropic'], default: 'openai' },
  ai_api_key: { type: String, default: '' },
});

module.exports = mongoose.model('UserSettings', userSettingsSchema);
