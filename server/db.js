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
  date: { type: String, default: () => new Date().toLocaleDateString('en-CA') },
  created_at: { type: Date, default: Date.now },
});
workoutLogSchema.index({ user_id: 1, date: 1 });
workoutLogSchema.index({ user_id: 1, exercise_id: 1, date: -1 });

const completedExerciseSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  exercise_id: { type: String, required: true, ref: 'Exercise' },
  date: { type: String, default: () => new Date().toLocaleDateString('en-CA') },
});
completedExerciseSchema.index({ user_id: 1, exercise_id: 1, date: 1 }, { unique: true });

const Exercise = mongoose.model('Exercise', exerciseSchema);
const WorkoutLog = mongoose.model('WorkoutLog', workoutLogSchema);
const CompletedExercise = mongoose.model('CompletedExercise', completedExerciseSchema);

const exercises = [
  // Chest (12)
  { _id: 'press_banca', name_es: 'Press banca con barra', name_en: 'Barbell Bench Press', category: 'chest' },
  { _id: 'press_banca_mancuernas', name_es: 'Press banca con mancuernas', name_en: 'Dumbbell Bench Press', category: 'chest' },
  { _id: 'press_inclinado', name_es: 'Press inclinado con barra', name_en: 'Incline Barbell Press', category: 'chest' },
  { _id: 'press_inclinado_mancuernas', name_es: 'Press inclinado con mancuernas', name_en: 'Incline Dumbbell Press', category: 'chest' },
  { _id: 'press_declinado', name_es: 'Press declinado', name_en: 'Decline Press', category: 'chest' },
  { _id: 'aperturas', name_es: 'Aperturas', name_en: 'Dumbbell Flyes', category: 'chest' },
  { _id: 'aperturas_inclinadas', name_es: 'Aperturas inclinadas', name_en: 'Incline Dumbbell Flyes', category: 'chest' },
  { _id: 'cruces_polea', name_es: 'Cruces en polea', name_en: 'Cable Crossover', category: 'chest' },
  { _id: 'pullover', name_es: 'Pullover', name_en: 'Pullover', category: 'chest' },
  { _id: 'contractora', name_es: 'Contractora (Peck Deck)', name_en: 'Pec Deck Machine', category: 'chest' },
  { _id: 'press_maquina_pecho', name_es: 'Press en máquina', name_en: 'Machine Chest Press', category: 'chest' },
  { _id: 'fondos_pecho', name_es: 'Fondos para pecho', name_en: 'Chest Dips', category: 'chest' },
  // Back (11)
  { _id: 'dominadas', name_es: 'Dominadas', name_en: 'Pull-ups', category: 'back' },
  { _id: 'jalon_pecho', name_es: 'Jalón al pecho', name_en: 'Lat Pulldown', category: 'back' },
  { _id: 'jalon_tras_nuca', name_es: 'Jalón tras nuca', name_en: 'Behind Neck Pulldown', category: 'back' },
  { _id: 'jalon_agarre_cerrado', name_es: 'Jalón agarre cerrado', name_en: 'Close Grip Pulldown', category: 'back' },
  { _id: 'remo_barra', name_es: 'Remo con barra', name_en: 'Barbell Row', category: 'back' },
  { _id: 'remo_mancuerna', name_es: 'Remo con mancuerna', name_en: 'One-arm Dumbbell Row', category: 'back' },
  { _id: 'remo_polea', name_es: 'Remo en polea', name_en: 'Seated Cable Row', category: 'back' },
  { _id: 'remo_maquina', name_es: 'Remo en máquina', name_en: 'Machine Row', category: 'back' },
  { _id: 'peso_muerto', name_es: 'Peso muerto', name_en: 'Deadlift', category: 'back' },
  { _id: 'hiperextensiones', name_es: 'Hiperextensiones', name_en: 'Back Extensions', category: 'back' },
  { _id: 'pullover_mancuerna', name_es: 'Pullover con mancuerna', name_en: 'Dumbbell Pullover', category: 'back' },
  // Shoulders (12)
  { _id: 'press_militar', name_es: 'Press militar', name_en: 'Military Press', category: 'shoulders' },
  { _id: 'press_sentado_mancuernas', name_es: 'Press sentado con mancuernas', name_en: 'Seated Dumbbell Press', category: 'shoulders' },
  { _id: 'press_tras_nuca', name_es: 'Press tras nuca sentado', name_en: 'Behind Neck Press', category: 'shoulders' },
  { _id: 'press_tras_nuca_mancuernas', name_es: 'Press tras sentado con mancuernas', name_en: 'Seated Behind Neck Dumbbell Press', category: 'shoulders' },
  { _id: 'press_arnold', name_es: 'Press Arnold', name_en: 'Arnold Press', category: 'shoulders' },
  { _id: 'elevaciones_laterales', name_es: 'Elevaciones laterales', name_en: 'Lateral Raises', category: 'shoulders' },
  { _id: 'elevaciones_laterales_polea', name_es: 'Elevaciones laterales en polea', name_en: 'Cable Lateral Raises', category: 'shoulders' },
  { _id: 'elevaciones_frontales', name_es: 'Elevaciones frontales', name_en: 'Front Raises', category: 'shoulders' },
  { _id: 'pajaros', name_es: 'Pájaros', name_en: 'Reverse Flyes', category: 'shoulders' },
  { _id: 'vuelos_maquina', name_es: 'Vuelos en máquina', name_en: 'Machine Reverse Flyes', category: 'shoulders' },
  { _id: 'remo_menton', name_es: 'Remo al mentón', name_en: 'Upright Row', category: 'shoulders' },
  { _id: 'encogimientos', name_es: 'Encogimientos', name_en: 'Shrugs', category: 'shoulders' },
  // Biceps (8)
  { _id: 'curl_barra', name_es: 'Curl con barra', name_en: 'Barbell Curl', category: 'biceps' },
  { _id: 'curl_barra_z', name_es: 'Curl con barra Z', name_en: 'EZ Bar Curl', category: 'biceps' },
  { _id: 'curl_alterno', name_es: 'Curl alterno', name_en: 'Alternate Dumbbell Curl', category: 'biceps' },
  { _id: 'curl_concentrado', name_es: 'Curl concentrado', name_en: 'Concentration Curl', category: 'biceps' },
  { _id: 'curl_martillo', name_es: 'Curl martillo', name_en: 'Hammer Curl', category: 'biceps' },
  { _id: 'curl_scott', name_es: 'Curl en banco Scott', name_en: 'Preacher Curl', category: 'biceps' },
  { _id: 'curl_misionero_maquina', name_es: 'Misionero en máquina', name_en: 'Machine Preacher Curl', category: 'biceps', per_side: true },
  { _id: 'curl_polea', name_es: 'Curl en polea', name_en: 'Cable Curl', category: 'biceps' },
  // Triceps (7)
  { _id: 'triceps_polea', name_es: 'Tríceps en polea', name_en: 'Triceps Pushdown', category: 'triceps' },
  { _id: 'press_frances', name_es: 'Press francés', name_en: 'Skull Crusher', category: 'triceps' },
  { _id: 'patada_triceps', name_es: 'Patada de tríceps', name_en: 'Triceps Kickback', category: 'triceps' },
  { _id: 'fondos', name_es: 'Fondos', name_en: 'Dips', category: 'triceps' },
  { _id: 'extension_triceps', name_es: 'Extensión tríceps sobre cabeza', name_en: 'Overhead Triceps Extension', category: 'triceps' },
  { _id: 'copa_mancuerna', name_es: 'Copa con mancuerna', name_en: 'Dumbbell Overhead Extension', category: 'triceps' },
  { _id: 'press_cerrado', name_es: 'Press banca agarre cerrado', name_en: 'Close Grip Bench Press', category: 'triceps' },
  // Legs (13)
  { _id: 'sentadillas', name_es: 'Sentadillas', name_en: 'Squats', category: 'legs' },
  { _id: 'sentadilla_hack', name_es: 'Sentadilla hack', name_en: 'Hack Squat', category: 'legs' },
  { _id: 'sentadilla_bulgara', name_es: 'Sentadilla búlgara', name_en: 'Bulgarian Split Squat', category: 'legs' },
  { _id: 'prensa', name_es: 'Prensa', name_en: 'Leg Press', category: 'legs' },
  { _id: 'extensiones_cuadriceps', name_es: 'Extensiones cuádriceps', name_en: 'Leg Extensions', category: 'legs' },
  { _id: 'curl_femoral', name_es: 'Curl femoral', name_en: 'Leg Curl', category: 'legs' },
  { _id: 'peso_muerto_rumano', name_es: 'Peso muerto rumano', name_en: 'Romanian Deadlift', category: 'legs' },
  { _id: 'zancadas', name_es: 'Zancadas', name_en: 'Lunges', category: 'legs' },
  { _id: 'elevacion_talones', name_es: 'Elevación de talones', name_en: 'Calf Raises', category: 'legs' },
  { _id: 'prensa_gemelos', name_es: 'Prensa de gemelos', name_en: 'Calf Press', category: 'legs' },
  { _id: 'hip_thrust', name_es: 'Hip Thrust', name_en: 'Hip Thrust', category: 'legs' },
  { _id: 'aductores', name_es: 'Aductores', name_en: 'Adductors', category: 'legs' },
  { _id: 'abductores', name_es: 'Abductores', name_en: 'Abductors', category: 'legs' },
  // Abs (4)
  { _id: 'abdominales', name_es: 'Abdominales', name_en: 'Crunches', category: 'abs' },
  { _id: 'elevacion_piernas', name_es: 'Elevación de piernas', name_en: 'Leg Raises', category: 'abs' },
  { _id: 'oblicuos', name_es: 'Oblicuos', name_en: 'Oblique Crunches', category: 'abs' },
  { _id: 'plancha', name_es: 'Plancha', name_en: 'Plank', category: 'abs' },
];

async function seedExercises() {
  const ops = exercises.map(ex => ({
    updateOne: {
      filter: { _id: ex._id },
      update: { $set: ex },
      upsert: true,
    }
  }));
  await Exercise.bulkWrite(ops);
}

async function connect() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  await seedExercises();
}

module.exports = { connect, Exercise, WorkoutLog, CompletedExercise };
