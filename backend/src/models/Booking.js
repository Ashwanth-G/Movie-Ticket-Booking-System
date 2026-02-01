const mongoose = require('mongoose');
const { BOOKING_STATUS } = require('../utils/constants');

const bookingSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true, unique: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    showtimeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Showtime',
      required: true,
    },
    seatIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seat',
        required: true,
      },
    ],
    status: {
      type: String,
      enum: Object.values(BOOKING_STATUS),
      default: BOOKING_STATUS.CONFIRMED,
    },
    totalAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

bookingSchema.index({ bookingId: 1 }, { unique: true });
bookingSchema.index({ userId: 1 });
bookingSchema.index({ showtimeId: 1 });
bookingSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Booking', bookingSchema);
