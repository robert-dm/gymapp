const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User', index: true },
  date: { type: String, required: true },
  url: { type: String, required: true },
  public_id: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

photoSchema.index({ user_id: 1, date: 1 });

module.exports = mongoose.model('Photo', photoSchema);
