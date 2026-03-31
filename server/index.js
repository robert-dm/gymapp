const express = require('express');
const path = require('path');
const { connect } = require('./db');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Serve config for frontend (Google Client ID)
app.get('/config.js', (req, res) => {
  res.type('application/javascript');
  res.send(`const APP_CONFIG = { GOOGLE_CLIENT_ID: "${process.env.GOOGLE_CLIENT_ID}" };`);
});

// Lazy MongoDB connection for serverless
let dbConnected = false;
app.use('/api', async (req, res, next) => {
  if (!dbConnected) {
    await connect();
    dbConnected = true;
  }
  next();
}, routes);

// Only listen when not running in serverless (Vercel)
if (!process.env.VERCEL) {
  connect().then(() => {
    dbConnected = true;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Gym Tracker running at http://localhost:${PORT}`);
    });
  }).catch(err => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
}

module.exports = app;
