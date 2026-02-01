const mongoose = require('mongoose');
const { Seat, Showtime, Booking, Payment } = require('../models');
const { BadRequestError, NotFoundError, ConflictError } = require('../utils/errors');
const { SEAT_STATUS, LOCK_TIMEOUT_MS, BOOKING_STATUS, PAYMENT_STATUS } = require('../utils/constants');

/**
 * Release seats that are locked beyond LOCK_TIMEOUT_MS (5 minutes).
 * Called before lock/confirm to ensure expired locks are freed.
 */
const releaseExpiredLocks = async (showtimeId = null) => {
  const cutoff = new Date(Date.now() - LOCK_TIMEOUT_MS);
  const query = { status: SEAT_STATUS.LOCKED, lockedAt: { $lt: cutoff } };
  if (showtimeId) {
    query.showtimeId = showtimeId;
  }
  await Seat.updateMany(query, {
    $set: { status: SEAT_STATUS.AVAILABLE },
    $unset: { lockedAt: 1, lockedBy: 1 },
  });
};

/**
 * Get all seats for a showtime. Optionally release expired locks first.
 * Returns seats with status (available | locked | booked) for seat map UI.
 */
const getSeatsByShowtime = async (showtimeId, releaseExpired = true) => {
  const showtime = await Showtime.findById(showtimeId);
  if (!showtime) {
    throw new NotFoundError('Showtime not found.');
  }
  if (releaseExpired) {
    await releaseExpiredLocks(showtimeId);
  }
  const seats = await Seat.find({ showtimeId }).sort({ row: 1, number: 1 }).lean();
  return seats;
};

/**
 * Lock selected seats for the current user. Atomic per-seat: only available seats are locked.
 * Prevents double booking: two requests cannot lock the same seat.
 * Lock timeout: 5 minutes; after that seats are released by releaseExpiredLocks.
 */
const lockSeats = async (showtimeId, seatIds, userId) => {
  if (!seatIds || !Array.isArray(seatIds) || seatIds.length === 0) {
    throw new BadRequestError('At least one seat is required.');
  }
  await releaseExpiredLocks(showtimeId);

  const objectIds = seatIds.map((id) => new mongoose.Types.ObjectId(id));
  const seats = await Seat.find({
    _id: { $in: objectIds },
    showtimeId,
  }).lean();

  if (seats.length !== objectIds.length) {
    throw new BadRequestError('One or more seats not found for this showtime.');
  }

  const allAvailable = seats.every((s) => s.status === SEAT_STATUS.AVAILABLE);
  if (!allAvailable) {
    throw new ConflictError('One or more seats are no longer available.');
  }

  const now = new Date();
  const result = await Seat.updateMany(
    {
      _id: { $in: objectIds },
      showtimeId,
      status: SEAT_STATUS.AVAILABLE, // atomic: only update if still available
    },
    {
      $set: { status: SEAT_STATUS.LOCKED, lockedAt: now, lockedBy: userId },
    }
  );

  if (result.modifiedCount !== objectIds.length) {
    throw new ConflictError('Seats were taken by another user. Please select again.');
  }

  const updatedSeats = await Seat.find({ _id: { $in: objectIds } }).lean();
  return {
    seats: updatedSeats,
    lockedAt: now,
    expiresAt: new Date(now.getTime() + LOCK_TIMEOUT_MS),
  };
};

/**
 * Release lock on seats (e.g. user abandons or payment fails).
 * Only seats locked by this user for this showtime are released.
 */
const releaseLock = async (showtimeId, seatIds, userId) => {
  if (!seatIds || !Array.isArray(seatIds)) {
    throw new BadRequestError('Seat IDs required.');
  }
  const objectIds = seatIds.map((id) => new mongoose.Types.ObjectId(id));
  await Seat.updateMany(
    {
      _id: { $in: objectIds },
      showtimeId,
      status: SEAT_STATUS.LOCKED,
      lockedBy: userId,
    },
    {
      $set: { status: SEAT_STATUS.AVAILABLE },
      $unset: { lockedAt: 1, lockedBy: 1 },
    }
  );
  return { released: true };
};

/**
 * Generate unique booking ID (e.g. MTB-20240201-XXXX).
 */
const generateBookingId = () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `MTB-${date}-${random}`;
};

/**
 * Confirm booking: verify seats are still locked by this user, create booking, mark seats booked.
 * Mock payment: create Payment with status success.
 */
const confirmBooking = async (showtimeId, seatIds, userId, totalAmount = 0) => {
  if (!seatIds || !Array.isArray(seatIds) || seatIds.length === 0) {
    throw new BadRequestError('At least one seat is required.');
  }
  await releaseExpiredLocks(showtimeId);

  const objectIds = seatIds.map((id) => new mongoose.Types.ObjectId(id));
  const seats = await Seat.find({
    _id: { $in: objectIds },
    showtimeId,
    status: SEAT_STATUS.LOCKED,
    lockedBy: userId,
  }).lean();

  if (seats.length !== objectIds.length) {
    throw new ConflictError('Seats are no longer locked by you or have expired. Please try again.');
  }

  const bookingId = generateBookingId();
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const booking = await Booking.create(
      [
        {
          bookingId,
          userId,
          showtimeId,
          seatIds: objectIds,
          status: BOOKING_STATUS.CONFIRMED,
          totalAmount: totalAmount || seats.length * 200, // mock: 200 per seat
        },
      ],
      { session }
    );

    await Seat.updateMany(
      { _id: { $in: objectIds } },
      {
        $set: { status: SEAT_STATUS.BOOKED },
        $unset: { lockedAt: 1, lockedBy: 1 },
      },
      { session }
    );

    await Payment.create(
      [
        {
          bookingId: booking[0]._id,
          amount: booking[0].totalAmount,
          status: PAYMENT_STATUS.SUCCESS,
          method: 'mock',
        },
      ],
      { session }
    );

    await session.commitTransaction();
    const populated = await Booking.findById(booking[0]._id)
      .populate('showtimeId')
      .populate('seatIds')
      .lean();
    return populated;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

/**
 * Get all bookings for a user (for "My Bookings" page).
 */
const getBookingsByUser = async (userId) => {
  return Booking.find({ userId })
    .populate({ path: 'showtimeId', populate: { path: 'movieId' } })
    .populate('seatIds')
    .sort({ createdAt: -1 })
    .lean();
};

/**
 * Get all bookings (admin only) with user, showtime, movie populated.
 */
const getAllBookings = async () => {
  return Booking.find()
    .populate('userId', 'name email')
    .populate({ path: 'showtimeId', populate: { path: 'movieId' } })
    .populate('seatIds')
    .sort({ createdAt: -1 })
    .lean();
};

/**
 * Get single booking by ID. Only owner or admin should access.
 */
const getBookingById = async (bookingId, userId, isAdmin = false) => {
  const booking = await Booking.findOne({ bookingId })
    .populate('showtimeId')
    .populate({ path: 'showtimeId', populate: { path: 'movieId' } })
    .populate('seatIds')
    .lean();
  if (!booking) {
    throw new NotFoundError('Booking not found.');
  }
  if (!isAdmin && booking.userId.toString() !== userId.toString()) {
    throw new NotFoundError('Booking not found.');
  }
  return booking;
};

module.exports = {
  releaseExpiredLocks,
  getSeatsByShowtime,
  lockSeats,
  releaseLock,
  confirmBooking,
  getBookingsByUser,
  getAllBookings,
  getBookingById,
};
