const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    genre: { type: String, required: true, trim: true },
    duration: { type: Number, required: true, min: 1 }, // minutes
    language: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    poster: { type: String, default: '' },
    trailer: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

movieSchema.index({ title: 1 });
movieSchema.index({ isActive: 1 });

module.exports = mongoose.model('Movie', movieSchema);
