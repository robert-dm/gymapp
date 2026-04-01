const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('./cloudinary');
const { Exercise, WorkoutLog, CompletedExercise } = require('./db');
const { verifyGoogleToken, generateToken, authMiddleware } = require('./auth');
const User = require('./models/User');
const Photo = require('./models/Photo');
const BodyWeight = require('./models/BodyWeight');
const Routine = require('./models/Routine');
const ExerciseNote = require('./models/ExerciseNote');

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
  try {
    const user = await User.findById(req.userId).lean();
    if (!user) return res.status(401).json({ error: 'User not found' });
    res.json({ name: user.name, email: user.email, picture: user.picture });
  } catch (err) {
    console.error('Auth me error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Protected routes ---

router.use(authMiddleware);

// Get all exercises
router.get('/exercises', async (req, res) => {
  try {
    const rows = await Exercise.find().sort({ category: 1, name_es: 1 }).lean();
    res.json(rows.map(r => ({ id: r._id, name_es: r.name_es, name_en: r.name_en, category: r.category, per_side: r.per_side || false })));
  } catch (err) {
    console.error('Get exercises error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Save a workout set
router.post('/logs', async (req, res) => {
  try {
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
      date: date || new Date().toLocaleDateString('en-CA'),
    });
    res.json({ id: log._id });
  } catch (err) {
    console.error('Post log error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get logs for a date (defaults to today)
router.get('/logs', async (req, res) => {
  try {
    const date = req.query.date || new Date().toLocaleDateString('en-CA');
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
  } catch (err) {
    console.error('Get logs error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get history for an exercise (last 10 sessions)
router.get('/logs/history/:exerciseId', async (req, res) => {
  try {
    const rows = await WorkoutLog.find({ user_id: req.userId, exercise_id: req.params.exerciseId })
      .sort({ date: -1, set_number: 1 })
      .limit(50)
      .lean();
    res.json(rows.map(r => ({ date: r.date, set_number: r.set_number, reps: r.reps, weight: r.weight, per_side: r.per_side || false })));
  } catch (err) {
    console.error('Get history error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a log entry
router.delete('/logs/:id', async (req, res) => {
  try {
    const result = await WorkoutLog.deleteOne({ _id: req.params.id, user_id: req.userId });
    res.json({ deleted: result.deletedCount });
  } catch (err) {
    console.error('Delete log error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get completed exercises for a date
router.get('/completed', async (req, res) => {
  try {
    const date = req.query.date || new Date().toLocaleDateString('en-CA');
    const rows = await CompletedExercise.find({ user_id: req.userId, date }).lean();
    res.json(rows.map(r => r.exercise_id));
  } catch (err) {
    console.error('Get completed error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark exercise as completed
router.post('/completed', async (req, res) => {
  try {
    const { exercise_id, date } = req.body;
    if (!exercise_id) return res.status(400).json({ error: 'exercise_id is required' });
    const d = date || new Date().toLocaleDateString('en-CA');
    await CompletedExercise.updateOne(
      { user_id: req.userId, exercise_id, date: d },
      { $set: { user_id: req.userId, exercise_id, date: d } },
      { upsert: true }
    );
    res.json({ ok: true });
  } catch (err) {
    console.error('Mark completed error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Unmark exercise as completed
router.delete('/completed/:exerciseId', async (req, res) => {
  try {
    const date = req.query.date || new Date().toLocaleDateString('en-CA');
    await CompletedExercise.deleteOne({ user_id: req.userId, exercise_id: req.params.exerciseId, date });
    res.json({ ok: true });
  } catch (err) {
    console.error('Unmark completed error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get training dates for a month (for calendar)
router.get('/calendar/:year/:month', async (req, res) => {
  try {
    const { year, month } = req.params;
    const startDate = `${year}-${month.padStart(2, '0')}-01`;
    const endDay = new Date(year, month, 0).getDate();
    const endDate = `${year}-${month.padStart(2, '0')}-${String(endDay).padStart(2, '0')}`;

    const logs = await WorkoutLog.distinct('date', {
      user_id: req.userId,
      date: { $gte: startDate, $lte: endDate },
    });

    const completed = await CompletedExercise.distinct('date', {
      user_id: req.userId,
      date: { $gte: startDate, $lte: endDate },
    });

    const photos = await Photo.distinct('date', {
      user_id: req.userId,
      date: { $gte: startDate, $lte: endDate },
    });

    const allDates = [...new Set([...logs, ...completed])];
    res.json({ trainingDates: allDates, photoDates: photos });
  } catch (err) {
    console.error('Calendar error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Dashboard ---

function dateSubtract(dateStr, days) {
  const d = new Date(dateStr + 'T12:00:00');
  d.setDate(d.getDate() - days);
  return d.toLocaleDateString('en-CA');
}

router.get('/dashboard', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const today = new Date().toLocaleDateString('en-CA');
    const currentStart = dateSubtract(today, days);
    const prevStart = dateSubtract(today, days * 2);

    const [allLogs, bodyweightEntries, allExercises] = await Promise.all([
      WorkoutLog.find({ user_id: req.userId, date: { $gt: prevStart, $lte: today } }).lean(),
      BodyWeight.find({ user_id: req.userId, date: { $gt: prevStart, $lte: today } }).sort({ date: 1 }).lean(),
      Exercise.find().lean(),
    ]);

    const exMap = Object.fromEntries(allExercises.map(e => [e._id, e]));

    // Split logs into current and previous periods
    const currentLogs = allLogs.filter(l => l.date > currentStart);
    const prevLogs = allLogs.filter(l => l.date <= currentStart);

    // Summary
    const currentDates = [...new Set(currentLogs.map(l => l.date))];
    const prevDates = [...new Set(prevLogs.map(l => l.date))];

    const calcVolume = (logs) => logs.reduce((sum, l) => {
      return sum + ((l.reps || 0) * (l.weight || 0) * (l.per_side ? 2 : 1));
    }, 0);

    // Streak: consecutive training days ending today or yesterday
    const allTrainingDates = [...new Set(allLogs.map(l => l.date))].sort().reverse();
    let currentStreak = 0;
    if (allTrainingDates.length > 0) {
      let checkDate = today;
      // If no training today, start from yesterday
      if (!allTrainingDates.includes(today)) {
        checkDate = dateSubtract(today, 1);
      }
      const dateSet = new Set(allTrainingDates);
      while (dateSet.has(checkDate)) {
        currentStreak++;
        checkDate = dateSubtract(checkDate, 1);
      }
    }

    const summary = {
      totalWorkouts: currentDates.length,
      prevWorkouts: prevDates.length,
      totalSets: currentLogs.length,
      prevSets: prevLogs.length,
      totalVolume: calcVolume(currentLogs),
      prevVolume: calcVolume(prevLogs),
      currentStreak,
    };

    // Categories
    const catMap = {};
    currentLogs.forEach(l => {
      const cat = exMap[l.exercise_id]?.category || 'other';
      catMap[cat] = (catMap[cat] || 0) + 1;
    });
    const prevCatMap = {};
    prevLogs.forEach(l => {
      const cat = exMap[l.exercise_id]?.category || 'other';
      prevCatMap[cat] = (prevCatMap[cat] || 0) + 1;
    });
    const categories = Object.keys(catMap)
      .map(cat => ({ category: cat, sets: catMap[cat], prevSets: prevCatMap[cat] || 0 }))
      .sort((a, b) => b.sets - a.sets);

    // Exercise progress
    const exGroup = (logs) => {
      const map = {};
      logs.forEach(l => {
        if (!map[l.exercise_id]) map[l.exercise_id] = [];
        map[l.exercise_id].push(l);
      });
      return map;
    };
    const currentByEx = exGroup(currentLogs);
    const prevByEx = exGroup(prevLogs);

    const exerciseProgress = [];
    for (const [exId, logs] of Object.entries(currentByEx)) {
      if (!prevByEx[exId]) continue;
      const prev = prevByEx[exId];
      const ex = exMap[exId];
      if (!ex) continue;

      const curVol = calcVolume(logs);
      const prvVol = calcVolume(prev);
      const curMax = Math.max(...logs.map(l => l.weight || 0));
      const prvMax = Math.max(...prev.map(l => l.weight || 0));

      exerciseProgress.push({
        exercise_id: exId,
        name_es: ex.name_es,
        name_en: ex.name_en,
        category: ex.category,
        current: { maxWeight: curMax, totalVolume: curVol, sets: logs.length },
        previous: { maxWeight: prvMax, totalVolume: prvVol, sets: prev.length },
        volumeChange: prvVol > 0 ? Math.round(((curVol - prvVol) / prvVol) * 100) : 0,
      });
    }
    exerciseProgress.sort((a, b) => b.current.totalVolume - a.current.totalVolume);
    const exercises = exerciseProgress.slice(0, 10);

    const bodyweight = bodyweightEntries.map(e => ({ date: e.date, weight: e.weight }));

    res.json({
      period: { days, currentStart, currentEnd: today, prevStart, prevEnd: currentStart },
      summary,
      categories,
      exercises,
      bodyweight,
    });
  } catch (err) {
    console.error('Dashboard error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Photos ---

router.get('/photos', async (req, res) => {
  try {
    const date = req.query.date || new Date().toLocaleDateString('en-CA');
    const photos = await Photo.find({ user_id: req.userId, date }).sort({ created_at: 1 }).lean();
    res.json(photos.map(p => ({ id: p._id, url: p.url, public_id: p.public_id, date: p.date })));
  } catch (err) {
    console.error('Get photos error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/photos', upload.single('photo'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'photo file is required' });
  const date = req.body.date || new Date().toLocaleDateString('en-CA');

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

router.delete('/photos/:id', async (req, res) => {
  try {
    const photo = await Photo.findOne({ _id: req.params.id, user_id: req.userId });
    if (!photo) return res.json({ deleted: 0 });
    try { await cloudinary.uploader.destroy(photo.public_id); } catch {}
    await photo.deleteOne();
    res.json({ deleted: 1 });
  } catch (err) {
    console.error('Delete photo error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Body Weight ---

router.get('/bodyweight', async (req, res) => {
  try {
    const date = req.query.date || new Date().toLocaleDateString('en-CA');
    const entry = await BodyWeight.findOne({ user_id: req.userId, date }).lean();
    res.json(entry ? { weight: entry.weight, date: entry.date } : null);
  } catch (err) {
    console.error('Get bodyweight error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/bodyweight', async (req, res) => {
  try {
    const { weight, date } = req.body;
    if (!weight) return res.status(400).json({ error: 'weight is required' });
    const d = date || new Date().toLocaleDateString('en-CA');
    await BodyWeight.updateOne(
      { user_id: req.userId, date: d },
      { $set: { user_id: req.userId, date: d, weight } },
      { upsert: true }
    );
    res.json({ ok: true });
  } catch (err) {
    console.error('Save bodyweight error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/bodyweight', async (req, res) => {
  try {
    const date = req.query.date || new Date().toLocaleDateString('en-CA');
    await BodyWeight.deleteOne({ user_id: req.userId, date });
    res.json({ ok: true });
  } catch (err) {
    console.error('Delete bodyweight error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Routine ---

router.get('/routine', async (req, res) => {
  try {
    const routine = await Routine.findOne({ user_id: req.userId }).lean();
    res.json(routine ? { days: routine.days } : null);
  } catch (err) {
    console.error('Get routine error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/routine', async (req, res) => {
  try {
    const { days } = req.body;
    if (!Array.isArray(days)) return res.status(400).json({ error: 'days array is required' });
    await Routine.findOneAndUpdate(
      { user_id: req.userId },
      { user_id: req.userId, days },
      { upsert: true, new: true }
    );
    res.json({ ok: true });
  } catch (err) {
    console.error('Save routine error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/routine', async (req, res) => {
  try {
    await Routine.deleteOne({ user_id: req.userId });
    res.json({ ok: true });
  } catch (err) {
    console.error('Delete routine error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Exercise Notes ---

router.get('/notes/:exerciseId', async (req, res) => {
  try {
    const doc = await ExerciseNote.findOne({ user_id: req.userId, exercise_id: req.params.exerciseId }).lean();
    res.json({ note: doc ? doc.note : '' });
  } catch (err) {
    console.error('Get note error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/notes/:exerciseId', async (req, res) => {
  try {
    const { note } = req.body;
    await ExerciseNote.updateOne(
      { user_id: req.userId, exercise_id: req.params.exerciseId },
      { $set: { user_id: req.userId, exercise_id: req.params.exerciseId, note: note || '' } },
      { upsert: true }
    );
    res.json({ ok: true });
  } catch (err) {
    console.error('Save note error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
