require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');
const { NotFoundError } = require('./utils/errors');

const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const showtimeRoutes = require('./routes/showtimeRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();

// CORS: allow frontend origin
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
app.use(
  cors({
    origin: corsOrigin.includes(',') ? corsOrigin.split(',').map((o) => o.trim()) : corsOrigin,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'OK' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/showtimes', showtimeRoutes);
app.use('/api/bookings', bookingRoutes);

// 404 - pass to error handler for consistent JSON
app.use((req, res, next) => {
  next(new NotFoundError('Route not found'));
});

app.use(errorHandler);

// Connect DB and start server are in server.js so app can be exported for tests
module.exports = app;
