const mongoose = require('mongoose');
const { PAYMENT_STATUS } = require('../utils/constants');

const paymentSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      required: true,
    },
    method: { type: String, default: '' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

paymentSchema.index({ bookingId: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
