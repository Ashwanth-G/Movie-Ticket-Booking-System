const mongoose = require('mongoose');
const { SEAT_STATUS } = require('../utils/constants');

const seatSchema = new mongoose.Schema(
  {
    showtimeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Showtime',
      required: true,
    },
    row: { type: String, required: true },
    number: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(SEAT_STATUS),
      default: SEAT_STATUS.AVAILABLE,
    },
    lockedAt: { type: Date, default: null },
    lockedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

seatSchema.index({ showtimeId: 1 });
seatSchema.index({ showtimeId: 1, row: 1, number: 1 }, { unique: true });
seatSchema.index({ showtimeId: 1, status: 1 });
seatSchema.index({ lockedAt: 1 });

module.exports = mongoose.model('Seat', seatSchema);
