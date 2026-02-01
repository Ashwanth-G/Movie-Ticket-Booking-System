/**
 * Application constants.
 */

// Seat status: available -> locked (by user) -> booked (after confirmation)
const SEAT_STATUS = {
  AVAILABLE: 'available',
  LOCKED: 'locked',
  BOOKED: 'booked',
};

// Lock timeout: 3 minutes (milliseconds). After this, locked seats are released automatically.
const LOCK_TIMEOUT_MS = 3 * 60 * 1000;

// User roles
const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

// Booking status
const BOOKING_STATUS = {
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
};

// Payment status (mock)
const PAYMENT_STATUS = {
  SUCCESS: 'success',
  FAILED: 'failed',
};

module.exports = {
  SEAT_STATUS,
  LOCK_TIMEOUT_MS,
  ROLES,
  BOOKING_STATUS,
  PAYMENT_STATUS,
};
