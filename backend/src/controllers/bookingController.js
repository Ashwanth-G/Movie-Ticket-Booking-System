const bookingService = require('../services/bookingService');

/**
 * GET /api/showtimes/:showtimeId/seats
 * Returns seat map for showtime. Expired locks are released first.
 */
const getSeats = async (req, res, next) => {
  try {
    const { showtimeId } = req.params;
    const seats = await bookingService.getSeatsByShowtime(showtimeId);
    res.status(200).json({
      success: true,
      data: seats,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/bookings/lock
 * Body: { showtimeId, seatIds: [] }
 * Locks seats for current user (5 min timeout).
 */
const lockSeats = async (req, res, next) => {
  try {
    const { showtimeId, seatIds } = req.body;
    const result = await bookingService.lockSeats(showtimeId, seatIds, req.user._id);
    res.status(200).json({
      success: true,
      message: 'Seats locked successfully.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/bookings/release
 * Body: { showtimeId, seatIds: [] }
 * Releases lock on seats.
 */
const releaseLock = async (req, res, next) => {
  try {
    const { showtimeId, seatIds } = req.body;
    await bookingService.releaseLock(showtimeId, seatIds, req.user._id);
    res.status(200).json({
      success: true,
      message: 'Seats released.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/bookings/confirm
 * Body: { showtimeId, seatIds: [], totalAmount? }
 * Confirms booking: creates booking, marks seats booked, mock payment.
 */
const confirmBooking = async (req, res, next) => {
  try {
    const { showtimeId, seatIds, totalAmount } = req.body;
    const booking = await bookingService.confirmBooking(
      showtimeId,
      seatIds,
      req.user._id,
      totalAmount
    );
    res.status(201).json({
      success: true,
      message: 'Booking confirmed.',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/bookings/my
 * Returns current user's bookings.
 */
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await bookingService.getBookingsByUser(req.user._id);
    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/bookings (admin only)
 * Returns all customer bookings.
 */
const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await bookingService.getAllBookings();
    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/bookings/:bookingId
 * Returns single booking by human-readable bookingId (owner or admin).
 */
const getBookingById = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const isAdmin = req.user.role === 'admin';
    const booking = await bookingService.getBookingById(bookingId, req.user._id, isAdmin);
    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSeats,
  lockSeats,
  releaseLock,
  confirmBooking,
  getMyBookings,
  getAllBookings,
  getBookingById,
};
