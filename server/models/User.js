const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  google_id: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  name: String,
  picture: String,
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
