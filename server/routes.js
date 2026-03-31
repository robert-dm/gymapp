const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('./cloudinary');
const { Exercise, WorkoutLog, CompletedExercise } = require('./db');
const { verifyGoogleToken, generateToken, authMiddleware } = require('./auth');
const User = require('./models/User');
const Photo = require('./models/Photo');
const BodyWeight = require('./models/BodyWeight');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// --- Auth routes (no middleware) ---

router.post('/auth/google', async (req, res) => {
  try {
    const { credential } = req.body;
    const payload = await verifyGoogleToken(credential);

    let user = await User.findOne({ google_id: payload.sub });
    if (!user) {
      user = await User.create({
        google_id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      });
    } else {
      user.name = payload.name;
      user.picture = payload.picture;
      await user.save();
    }

    const token = generateToken(user._id);
    res.json({ token, user: { name: user.name, email: user.email, picture: user.picture } });
  } catch (err) {
    console.error('Google auth error:', err.message);
    res.status(401).json({ error: 'Authentication failed' });
  }
});

router.get('/auth/me', authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId).lean();
  if (!user) return res.status(401).json({ error: 'User not found' });
  res.json({ name: user.name, email: user.email, picture: user.picture });
});

// --- Protected routes ---

router.use(authMiddleware);

// Get all exercises
router.get('/exercises', async (req, res) => {
  const rows = await Exercise.find().sort({ category: 1, name_es: 1 }).lean();
  res.json(rows.map(r => ({ id: r._id, name_es: r.name_es, name_en: r.name_en, category: r.category, per_side: r.per_side || false })));
});

// Save a workout set
router.post('/logs', async (req, res) => {
  const { exercise_id, set_number, reps, weight, per_side, date } = req.body;
  if (!exercise_id || !set_number) {
    return res.status(400).json({ error: 'exercise_id and set_number are required' });
  }
  const log = await WorkoutLog.create({
    user_id: req.userId,
    exercise_id,
    set_number,
    reps: reps || null,
    weight: weight || null,
    per_side: per_side || false,
    date: date || new Date().toISOString().slice(0, 10),
  });
  res.json({ id: log._id });
});

// Get logs for a date (defaults to today)
router.get('/logs', async (req, res) => {
  const date = req.query.date || new Date().toISOString().slice(0, 10);
  const logs = await WorkoutLog.find({ user_id: req.userId, date }).sort({ created_at: 1 }).lean();

  const exerciseIds = [...new Set(logs.map(l => l.exercise_id))];
  const exercises = await Exercise.find({ _id: { $in: exerciseIds } }).lean();
  const exMap = Object.fromEntries(exercises.map(e => [e._id, e]));

  const rows = logs.map(l => ({
    id: l._id,
    exercise_id: l.exercise_id,
    set_number: l.set_number,
    reps: l.reps,
    weight: l.weight,
    per_side: l.per_side || false,
    created_at: l.created_at,
    date: l.date,
    name_es: exMap[l.exercise_id]?.name_es,
    name_en: exMap[l.exercise_id]?.name_en,
    category: exMap[l.exercise_id]?.category,
  }));
  res.json(rows);
});

// Get history for an exercise (last 10 sessions)
router.get('/logs/history/:exerciseId', async (req, res) => {
  const rows = await WorkoutLog.find({ user_id: req.userId, exercise_id: req.params.exerciseId })
    .sort({ date: -1, set_number: 1 })
    .limit(50)
    .lean();
  res.json(rows.map(r => ({ date: r.date, set_number: r.set_number, reps: r.reps, weight: r.weight, per_side: r.per_side || false })));
});

// Delete a log entry
router.delete('/logs/:id', async (req, res) => {
  const result = await WorkoutLog.deleteOne({ _id: req.params.id, user_id: req.userId });
  res.json({ deleted: result.deletedCount });
});

// Get completed exercises for a date
router.get('/completed', async (req, res) => {
  const date = req.query.date || new Date().toISOString().slice(0, 10);
  const rows = await CompletedExercise.find({ user_id: req.userId, date }).lean();
  res.json(rows.map(r => r.exercise_id));
});

// Mark exercise as completed
router.post('/completed', async (req, res) => {
  const { exercise_id, date } = req.body;
  if (!exercise_id) return res.status(400).json({ error: 'exercise_id is required' });
  const d = date || new Date().toISOString().slice(0, 10);
  await CompletedExercise.updateOne(
    { user_id: req.userId, exercise_id, date: d },
    { user_id: req.userId, exercise_id, date: d },
    { upsert: true }
  );
  res.json({ ok: true });
});

// Unmark exercise as completed
router.delete('/completed/:exerciseId', async (req, res) => {
  const date = req.query.date || new Date().toISOString().slice(0, 10);
  await CompletedExercise.deleteOne({ user_id: req.userId, exercise_id: req.params.exerciseId, date });
  res.json({ ok: true });
});

// Get training dates for a month (for calendar)
router.get('/calendar/:year/:month', async (req, res) => {
  const { year, month } = req.params;
  const startDate = `${year}-${month.padStart(2, '0')}-01`;
  const endDay = new Date(year, month, 0).getDate();
  const endDate = `${year}-${month.padStart(2, '0')}-${String(endDay).padStart(2, '0')}`;

  // Days with logs
  const logs = await WorkoutLog.distinct('date', {
    user_id: req.userId,
    date: { $gte: startDate, $lte: endDate },
  });

  // Days with completed exercises
  const completed = await CompletedExercise.distinct('date', {
    user_id: req.userId,
    date: { $gte: startDate, $lte: endDate },
  });

  // Days with photos
  const photos = await Photo.distinct('date', {
    user_id: req.userId,
    date: { $gte: startDate, $lte: endDate },
  });

  const allDates = [...new Set([...logs, ...completed])];
  res.json({ trainingDates: allDates, photoDates: photos });
});

// --- Photos ---

// Get photos for a date
router.get('/photos', async (req, res) => {
  const date = req.query.date || new Date().toISOString().slice(0, 10);
  const photos = await Photo.find({ user_id: req.userId, date }).sort({ created_at: 1 }).lean();
  res.json(photos.map(p => ({ id: p._id, url: p.url, public_id: p.public_id, date: p.date })));
});

// Upload photo to Cloudinary and save reference
router.post('/photos', upload.single('photo'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'photo file is required' });
  const date = req.body.date || new Date().toISOString().slice(0, 10);

  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'gymapp', resource_type: 'image' },
        (err, result) => err ? reject(err) : resolve(result)
      );
      stream.end(req.file.buffer);
    });

    const photo = await Photo.create({
      user_id: req.userId,
      url: result.secure_url,
      public_id: result.public_id,
      date,
    });
    res.json({ id: photo._id, url: result.secure_url });
  } catch (err) {
    console.error('Cloudinary upload error:', err.message);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Delete a photo
router.delete('/photos/:id', async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id, user_id: req.userId });
  if (!photo) return res.json({ deleted: 0 });
  try { await cloudinary.uploader.destroy(photo.public_id); } catch {}
  await photo.deleteOne();
  res.json({ deleted: 1 });
});

// --- Body Weight ---

// Get body weight for a date
router.get('/bodyweight', async (req, res) => {
  const date = req.query.date || new Date().toISOString().slice(0, 10);
  const entry = await BodyWeight.findOne({ user_id: req.userId, date }).lean();
  res.json(entry ? { weight: entry.weight, date: entry.date } : null);
});

// Save/update body weight for a date
router.post('/bodyweight', async (req, res) => {
  const { weight, date } = req.body;
  if (!weight) return res.status(400).json({ error: 'weight is required' });
  const d = date || new Date().toISOString().slice(0, 10);
  await BodyWeight.updateOne(
    { user_id: req.userId, date: d },
    { user_id: req.userId, date: d, weight },
    { upsert: true }
  );
  res.json({ ok: true });
});

// Delete body weight for a date
router.delete('/bodyweight', async (req, res) => {
  const date = req.query.date || new Date().toISOString().slice(0, 10);
  await BodyWeight.deleteOne({ user_id: req.userId, date });
  res.json({ ok: true });
});

module.exports = router;
