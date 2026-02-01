/**
 * Export all models for central access.
 */
module.exports = {
  User: require('./User'),
  Movie: require('./Movie'),
  Showtime: require('./Showtime'),
  Seat: require('./Seat'),
  Booking: require('./Booking'),
  Payment: require('./Payment'),
};
