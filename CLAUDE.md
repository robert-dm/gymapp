# Gym Tracker — Project Guide

## Overview
Full-stack gym workout tracking app with Google OAuth, MongoDB, and Vercel deployment.

## Tech Stack
- **Backend**: Express.js (Node.js), Mongoose/MongoDB Atlas
- **Frontend**: Vanilla JS (no framework), single-page app
- **Auth**: Google Identity Services (GSI) + JWT (30-day expiry)
- **Photos**: Cloudinary server-side upload via multer (CLOUDINARY_URL env var)
- **Deployment**: Vercel (serverless), lazy MongoDB connection
- **Language**: Bilingual ES/EN via i18n system (localStorage)

## Project Structure
```
server/
  index.js          — Express server, Vercel compat, lazy DB, global error handler
  db.js             — Mongoose schemas (Exercise, WorkoutLog, CompletedExercise), exercise seed data
  routes.js         — All API routes with try/catch (auth, exercises, logs, completed, calendar, photos, bodyweight, routine)
  auth.js           — Google token verification, JWT generation, authMiddleware
  cloudinary.js     — Cloudinary v2 export (auto-configured from CLOUDINARY_URL)
  models/
    User.js         — google_id, email, name, picture
    Photo.js        — user_id, date, url, public_id
    BodyWeight.js   — user_id, date, weight (unique index user+date)
    Routine.js      — user_id (unique), embedded days [{name_es, name_en, exercises[]}]
public/
  index.html        — SPA with login screen, main view, exercise modal, history modal, calendar modal, routine modal, lightbox
  css/style.css     — Full styling with mobile-responsive breakpoints (<768px, <380px)
  js/
    app.js          — Main application logic (~900 lines)
    api.js          — API client with JWT token management
    exercises.js    — SVG stick-figure icons per exercise ID
    instructions.js — Step-by-step instructions with SVG icons (chest exercises)
    i18n.js         — Spanish/English translations
vercel.json         — Routes /api/* to server, static to public
.env                — MONGODB_URI, GOOGLE_CLIENT_ID, JWT_SECRET, CLOUDINARY_URL (gitignored)
```

## Key Architecture Decisions
- **Per-side weight**: Stored per workout log entry (not per exercise), user toggles on each set
- **Dates as strings**: YYYY-MM-DD format, using local timezone (not UTC) to avoid off-by-one in Argentina (UTC-3)
- **Exercise IDs**: String snake_case IDs (e.g., `press_banca`), not ObjectId
- **Seed on connect**: Exercises are seeded/upserted on every DB connection via bulkWrite
- **One routine per user**: Embedded days array, full replacement on save (PUT)

## API Endpoints
All under `/api`, protected routes require `Authorization: Bearer <jwt>`:
- `POST /auth/google`, `GET /auth/me`
- `GET /exercises`
- `POST/GET/DELETE /logs`, `GET /logs/history/:id`
- `POST/GET/DELETE /completed`
- `GET /calendar/:year/:month`
- `POST/GET/DELETE /photos`
- `POST/GET/DELETE /bodyweight`
- `GET/PUT/DELETE /routine`

## Exercises
65 exercises across 7 categories: chest(12), back(11), shoulders(11), biceps(8), triceps(7), legs(13), abs(4). All have SVG stick-figure icons. Instructions currently implemented for chest exercises only.

## Performance Patterns
- Init: `Promise.all` for parallel API fetches (exercises, logs, completed, routine)
- openExercise: `Promise.all` (logs, completed, history)
- Add/delete set: local array update (no refetch)
- Seed: `bulkWrite` (1 call, not 65 sequential)
- MongoDB indexes: `{user_id, date}`, `{user_id, exercise_id, date}` on WorkoutLog

## Development
```bash
# Install
npm install

# Run locally (needs .env with MONGODB_URI, GOOGLE_CLIENT_ID, JWT_SECRET)
node server/index.js

# Deploy (auto-deploys on push to main via Vercel)
git push origin main
```

## Important Rules
- **NEVER delete the database** — user has real workout data
- **All routes must have try/catch** — unhandled errors crash the Node process, causing ERR_CONNECTION_REFUSED for all subsequent requests
- **Use local dates, not UTC** — `localToday()` on client, never `toISOString().slice(0,10)`
- **Retain input values** after adding a set (user convenience for multiple same-weight sets)
