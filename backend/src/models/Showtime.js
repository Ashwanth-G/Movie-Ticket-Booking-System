const mongoose = require('mongoose');

const showtimeSchema = new mongoose.Schema(
  {
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
    },
    theatre: { type: String, required: true, trim: true },
    screen: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true }, // e.g. "14:00"
  },
  { timestamps: true }
);

showtimeSchema.index({ movieId: 1 });
showtimeSchema.index({ movieId: 1, date: 1, startTime: 1 });

module.exports = mongoose.model('Showtime', showtimeSchema);
