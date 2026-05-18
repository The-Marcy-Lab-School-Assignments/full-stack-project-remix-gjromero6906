const path = require('path');
const express = require('express');
const cookieSession = require('cookie-session');
require('dotenv').config();

const logRoutes = require('./middleware/logRoutes');
const checkAuthentication = require('./middleware/checkAuthentication');
const authControllers = require('./controllers/authControllers');
const gameControllers = require('./controllers/gameControllers');

const app = express();
const PORT = process.env.PORT || 8080;

// ====================================
// Middleware
// ====================================

app.use(logRoutes);
app.use(
  cookieSession({
    name: 'session',
    keys: [process.env.SESSION_SECRET],
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })
);
app.use(express.json());

// In production, serve the built React app from frontend/dist.
// In development, Vite's dev server handles the frontend on a separate port
// and proxies /api requests to this server.
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// ====================================
// Auth routes
// ====================================

app.post('/api/auth/register', authControllers.register);
app.post('/api/auth/login', authControllers.login);
app.get('/api/auth/me', authControllers.getMe);
app.delete('/api/auth/logout', authControllers.logout);

// ====================================
// Game routes (all require authentication)
// ====================================

app.get('/api/games', checkAuthentication, gameControllers.listGames);
app.post('/api/games', checkAuthentication, gameControllers.createGame);
app.patch('/api/games/:game_id', checkAuthentication, gameControllers.updateGame);
app.delete('/api/games/:game_id', checkAuthentication, gameControllers.deleteGame);

// ====================================
// Global Error Handler
// ====================================

const handleError = (err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);

  const isDatabaseError = Boolean(err?.code || err?.severity || err?.routine);
  if (isDatabaseError) {
    return res.status(500).send({ message: 'Internal Server Error' });
  }

  res.status(err.status || 500).send({ message: err.message || 'Internal Server Error' });
};
app.use(handleError);

// ====================================
// Fallback route for client-side routing
// ====================================
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// ====================================
// Listen
// ====================================

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
