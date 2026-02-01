const express = require('express');
const { body, param } = require('express-validator');
const bookingController = require('../controllers/bookingController');
const { auth } = require('../middleware/auth');
const { requireRole } = require('../middleware/requireRole');
const { validate } = require('../middleware/validate');
const { ROLES } = require('../utils/constants');

const router = express.Router();

// All booking routes require authentication
router.use(auth);

const lockValidators = [
  body('showtimeId').isMongoId().withMessage('Valid showtime ID is required'),
  body('seatIds')
    .isArray({ min: 1 })
    .withMessage('At least one seat ID is required'),
  body('seatIds.*').isMongoId().withMessage('Invalid seat ID'),
];

const releaseValidators = [
  body('showtimeId').isMongoId().withMessage('Valid showtime ID is required'),
  body('seatIds').isArray().withMessage('Seat IDs array is required'),
  body('seatIds.*').optional().isMongoId(),
];

const confirmValidators = [
  body('showtimeId').isMongoId().withMessage('Valid showtime ID is required'),
  body('seatIds')
    .isArray({ min: 1 })
    .withMessage('At least one seat ID is required'),
  body('seatIds.*').isMongoId().withMessage('Invalid seat ID'),
  body('totalAmount').optional().isNumeric(),
];

router.post('/lock', lockValidators, validate, bookingController.lockSeats);
router.post('/release', releaseValidators, validate, bookingController.releaseLock);
router.post('/confirm', confirmValidators, validate, bookingController.confirmBooking);

router.get('/my', bookingController.getMyBookings);

router.get('/', requireRole([ROLES.ADMIN]), bookingController.getAllBookings);

router.get(
  '/:bookingId',
  param('bookingId').notEmpty().withMessage('Booking ID is required'),
  validate,
  bookingController.getBookingById
);

module.exports = router;
