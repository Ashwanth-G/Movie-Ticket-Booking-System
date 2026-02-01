const express = require('express');
const { body, param } = require('express-validator');
const showtimeController = require('../controllers/showtimeController');
const bookingController = require('../controllers/bookingController');
const { auth } = require('../middleware/auth');
const { requireRole } = require('../middleware/requireRole');
const { validate } = require('../middleware/validate');
const { ROLES } = require('../utils/constants');

const router = express.Router();

const idParam = param('id').isMongoId().withMessage('Invalid showtime ID');
const movieIdParam = param('movieId').isMongoId().withMessage('Invalid movie ID');

const createValidators = [
  body('movieId').isMongoId().withMessage('Valid movie ID is required'),
  body('theatre').trim().notEmpty().withMessage('Theatre is required'),
  body('screen').trim().notEmpty().withMessage('Screen is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('startTime').trim().notEmpty().withMessage('Start time is required'),
];

const updateValidators = [
  body('movieId').optional().isMongoId(),
  body('theatre').optional().trim().notEmpty(),
  body('screen').optional().trim().notEmpty(),
  body('date').optional().isISO8601(),
  body('startTime').optional().trim().notEmpty(),
];

// Public: get showtimes by movie
router.get('/movie/:movieId', movieIdParam, validate, showtimeController.findByMovieId);

// Seats for a showtime (public read; lock/confirm require auth via booking routes)
router.get(
  '/:showtimeId/seats',
  param('showtimeId').isMongoId().withMessage('Invalid showtime ID'),
  validate,
  bookingController.getSeats
);

// Public: get showtime by id (must be after /:showtimeId/seats)
router.get('/:id', idParam, validate, showtimeController.findById);

// Admin only: create, update, delete showtimes
router.post(
  '/',
  auth,
  requireRole([ROLES.ADMIN]),
  createValidators,
  validate,
  showtimeController.create
);
router.put(
  '/:id',
  auth,
  requireRole([ROLES.ADMIN]),
  idParam,
  updateValidators,
  validate,
  showtimeController.updateById
);
router.delete(
  '/:id',
  auth,
  requireRole([ROLES.ADMIN]),
  idParam,
  validate,
  showtimeController.deleteById
);

module.exports = router;
