const mongoose = require('mongoose');
require('dotenv').config();

const exerciseSchema = new mongoose.Schema({
  _id: String,
  name_es: { type: String, required: true },
  name_en: { type: String, required: true },
  category: { type: String, required: true },
  per_side: { type: Boolean, default: false },
}, { _id: false });

const workoutLogSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User', index: true },
  exercise_id: { type: String, required: true, ref: 'Exercise' },
  set_number: { type: Number, required: true },
  reps: Number,
  weight: Number,
  per_side: { type: Boolean, default: false },
  date: { type: String, default: () => new Date().toISOString().slice(0, 10) },
  created_at: { type: Date, default: Date.now },
});
workoutLogSchema.index({ user_id: 1, date: 1 });

const completedExerciseSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  exercise_id: { type: String, required: true, ref: 'Exercise' },
  date: { type: String, default: () => new Date().toISOString().slice(0, 10) },
});
completedExerciseSchema.index({ user_id: 1, exercise_id: 1, date: 1 }, { unique: true });

const Exercise = mongoose.model('Exercise', exerciseSchema);
const WorkoutLog = mongoose.model('WorkoutLog', workoutLogSchema);
const CompletedExercise = mongoose.model('CompletedExercise', completedExerciseSchema);

const exercises = [
  // Chest
  { _id: 'press_banca', name_es: 'Press banca', name_en: 'Bench Press', category: 'chest' },
  { _id: 'press_inclinado', name_es: 'Press inclinado', name_en: 'Incline Press', category: 'chest' },
  { _id: 'press_declinado', name_es: 'Press declinado', name_en: 'Decline Press', category: 'chest' },
  { _id: 'aperturas', name_es: 'Aperturas', name_en: 'Dumbbell Flyes', category: 'chest' },
  { _id: 'cruces_polea', name_es: 'Cruces en polea', name_en: 'Cable Crossover', category: 'chest' },
  { _id: 'pullover', name_es: 'Pullover', name_en: 'Pullover', category: 'chest' },
  // Back
  { _id: 'dominadas', name_es: 'Dominadas', name_en: 'Pull-ups', category: 'back' },
  { _id: 'jalon_pecho', name_es: 'Jalón al pecho', name_en: 'Lat Pulldown', category: 'back' },
  { _id: 'jalon_tras_nuca', name_es: 'Jalón tras nuca', name_en: 'Behind Neck Pulldown', category: 'back' },
  { _id: 'remo_barra', name_es: 'Remo con barra', name_en: 'Barbell Row', category: 'back' },
  { _id: 'remo_mancuerna', name_es: 'Remo con mancuerna', name_en: 'One-arm Dumbbell Row', category: 'back' },
  { _id: 'remo_polea', name_es: 'Remo en polea', name_en: 'Seated Cable Row', category: 'back' },
  { _id: 'peso_muerto', name_es: 'Peso muerto', name_en: 'Deadlift', category: 'back' },
  { _id: 'hiperextensiones', name_es: 'Hiperextensiones', name_en: 'Back Extensions', category: 'back' },
  { _id: 'pullover_mancuerna', name_es: 'Pullover con mancuerna', name_en: 'Dumbbell Pullover', category: 'back' },
  // Shoulders
  { _id: 'press_militar', name_es: 'Press militar', name_en: 'Military Press', category: 'shoulders' },
  { _id: 'elevaciones_laterales', name_es: 'Elevaciones laterales', name_en: 'Lateral Raises', category: 'shoulders' },
  { _id: 'elevaciones_frontales', name_es: 'Elevaciones frontales', name_en: 'Front Raises', category: 'shoulders' },
  { _id: 'pajaros', name_es: 'Pájaros', name_en: 'Reverse Flyes', category: 'shoulders' },
  { _id: 'remo_menton', name_es: 'Remo al mentón', name_en: 'Upright Row', category: 'shoulders' },
  { _id: 'encogimientos', name_es: 'Encogimientos', name_en: 'Shrugs', category: 'shoulders' },
  // Biceps
  { _id: 'curl_barra', name_es: 'Curl con barra', name_en: 'Barbell Curl', category: 'biceps' },
  { _id: 'curl_alterno', name_es: 'Curl alterno', name_en: 'Alternate Dumbbell Curl', category: 'biceps' },
  { _id: 'curl_concentrado', name_es: 'Curl concentrado', name_en: 'Concentration Curl', category: 'biceps' },
  { _id: 'curl_martillo', name_es: 'Curl martillo', name_en: 'Hammer Curl', category: 'biceps' },
  { _id: 'curl_scott', name_es: 'Curl en banco Scott', name_en: 'Preacher Curl', category: 'biceps' },
  { _id: 'curl_misionero_maquina', name_es: 'Misionero en máquina', name_en: 'Machine Preacher Curl', category: 'biceps', per_side: true },
  // Triceps
  { _id: 'triceps_polea', name_es: 'Tríceps en polea', name_en: 'Triceps Pushdown', category: 'triceps' },
  { _id: 'press_frances', name_es: 'Press francés', name_en: 'Skull Crusher', category: 'triceps' },
  { _id: 'patada_triceps', name_es: 'Patada de tríceps', name_en: 'Triceps Kickback', category: 'triceps' },
  { _id: 'fondos', name_es: 'Fondos', name_en: 'Dips', category: 'triceps' },
  { _id: 'extension_triceps', name_es: 'Extensiones tríceps', name_en: 'Overhead Triceps Extension', category: 'triceps' },
  // Legs
  { _id: 'sentadillas', name_es: 'Sentadillas', name_en: 'Squats', category: 'legs' },
  { _id: 'prensa', name_es: 'Prensa', name_en: 'Leg Press', category: 'legs' },
  { _id: 'extensiones_cuadriceps', name_es: 'Extensiones cuádriceps', name_en: 'Leg Extensions', category: 'legs' },
  { _id: 'curl_femoral', name_es: 'Curl femoral', name_en: 'Leg Curl', category: 'legs' },
  { _id: 'zancadas', name_es: 'Zancadas', name_en: 'Lunges', category: 'legs' },
  { _id: 'elevacion_talones', name_es: 'Elevación de talones', name_en: 'Calf Raises', category: 'legs' },
  { _id: 'aductores', name_es: 'Aductores', name_en: 'Adductors', category: 'legs' },
  { _id: 'abductores', name_es: 'Abductores', name_en: 'Abductors', category: 'legs' },
  // Abs
  { _id: 'abdominales', name_es: 'Abdominales', name_en: 'Crunches', category: 'abs' },
  { _id: 'elevacion_piernas', name_es: 'Elevación de piernas', name_en: 'Leg Raises', category: 'abs' },
  { _id: 'oblicuos', name_es: 'Oblicuos', name_en: 'Oblique Crunches', category: 'abs' },
];

async function seedExercises() {
  for (const ex of exercises) {
    await Exercise.updateOne({ _id: ex._id }, ex, { upsert: true });
  }
}

async function connect() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  await seedExercises();
}

module.exports = { connect, Exercise, WorkoutLog, CompletedExercise };
