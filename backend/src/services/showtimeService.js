const { Showtime, Movie, Seat } = require('../models');
const { NotFoundError } = require('../utils/errors');
const { SEAT_STATUS } = require('../utils/constants');

/** Default seat map: rows A–E, 10 seats per row. */
const DEFAULT_ROWS = ['A', 'B', 'C', 'D', 'E'];
const SEATS_PER_ROW = 10;

const create = async (data) => {
  const movie = await Movie.findById(data.movieId);
  if (!movie) {
    throw new NotFoundError('Movie not found.');
  }
  const showtime = await Showtime.create(data);
  // Create default seat map for this showtime
  const seatDocs = [];
  for (const row of DEFAULT_ROWS) {
    for (let number = 1; number <= SEATS_PER_ROW; number++) {
      seatDocs.push({
        showtimeId: showtime._id,
        row,
        number,
        status: SEAT_STATUS.AVAILABLE,
      });
    }
  }
  await Seat.insertMany(seatDocs);
  return showtime;
};

/** Get show datetime as timestamp (date + startTime). */
function getShowDateTime(st) {
  const d = new Date(st.date);
  const parts = (st.startTime || '00:00').toString().split(':');
  const hours = parseInt(parts[0], 10) || 0;
  const mins = parseInt(parts[1], 10) || 0;
  d.setHours(hours, mins, 0, 0);
  return d.getTime();
}

/** Only return showtimes in the future (outdated shows disappear from the website). */
const findByMovieId = async (movieId) => {
  const list = await Showtime.find({ movieId }).sort({ date: 1, startTime: 1 }).lean();
  const now = Date.now();
  return list.filter((st) => getShowDateTime(st) > now);
};

const findById = async (id) => {
  const showtime = await Showtime.findById(id).populate('movieId').lean();
  if (!showtime) {
    throw new NotFoundError('Showtime not found.');
  }
  return showtime;
};

const updateById = async (id, data) => {
  const showtime = await Showtime.findByIdAndUpdate(id, data, { new: true }).lean();
  if (!showtime) {
    throw new NotFoundError('Showtime not found.');
  }
  return showtime;
};

const deleteById = async (id) => {
  const showtime = await Showtime.findById(id);
  if (!showtime) {
    throw new NotFoundError('Showtime not found.');
  }
  await Seat.deleteMany({ showtimeId: id });
  await Showtime.findByIdAndDelete(id);
  return showtime;
};

module.exports = {
  create,
  findByMovieId,
  findById,
  updateById,
  deleteById,
};
