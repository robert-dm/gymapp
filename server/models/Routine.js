const mongoose = require('mongoose');

const routineDaySchema = new mongoose.Schema({
  name_es: { type: String, required: true },
  name_en: { type: String, required: true },
  exercises: [{ type: String, ref: 'Exercise' }],
}, { _id: true });

const routineSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User', unique: true },
  days: [routineDaySchema],
});

module.exports = mongoose.model('Routine', routineSchema);
