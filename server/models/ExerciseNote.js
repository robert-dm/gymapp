const mongoose = require('mongoose');

const exerciseNoteSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User', index: true },
  exercise_id: { type: String, required: true, ref: 'Exercise' },
  note: { type: String, default: '' },
});
exerciseNoteSchema.index({ user_id: 1, exercise_id: 1 }, { unique: true });

module.exports = mongoose.model('ExerciseNote', exerciseNoteSchema);
