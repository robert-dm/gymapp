const mongoose = require('mongoose');

const bodyWeightSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  date: { type: String, required: true },
  weight: { type: Number, required: true },
});

bodyWeightSchema.index({ user_id: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('BodyWeight', bodyWeightSchema);
