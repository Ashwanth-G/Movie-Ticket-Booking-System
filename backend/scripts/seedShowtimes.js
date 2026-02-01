/**
 * Seed showtimes (3–4 screens per movie) with seat maps.
 * Run after seed:movies. Usage: node scripts/seedShowtimes.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const { Movie, Showtime, Seat } = require('../src/models');
const { SEAT_STATUS } = require('../src/utils/constants');

const DEFAULT_ROWS = ['A', 'B', 'C', 'D', 'E'];
const SEATS_PER_ROW = 10;

const THEATRES = [
  { theatre: 'PVR Cinemas', screen: 'Screen 1' },
  { theatre: 'PVR Cinemas', screen: 'Screen 2' },
  { theatre: 'INOX', screen: 'Screen 1' },
  { theatre: 'Cinepolis', screen: 'Screen 1' },
];

function getDates() {
  const dates = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < 3; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    dates.push(d);
  }
  return dates;
}

const TIME_SLOTS = ['10:00', '13:30', '17:00', '21:00'];

async function createSeatsForShowtime(showtimeId) {
  const seatDocs = [];
  for (const row of DEFAULT_ROWS) {
    for (let number = 1; number <= SEATS_PER_ROW; number++) {
      seatDocs.push({
        showtimeId,
        row,
        number,
        status: SEAT_STATUS.AVAILABLE,
      });
    }
  }
  await Seat.insertMany(seatDocs);
}

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/movie-booking';
  await mongoose.connect(uri);

  const movies = await Movie.find().lean();
  if (movies.length === 0) {
    console.log('No movies found. Run npm run seed:movies first.');
    process.exit(1);
  }

  const dates = getDates();
  let totalShowtimes = 0;

  for (const movie of movies) {
    // Create 3–4 showtimes per movie (different theatre/screen/date/time)
    const toCreate = [];
    for (let i = 0; i < 4; i++) {
      const { theatre, screen } = THEATRES[i % THEATRES.length];
      const date = dates[i % dates.length];
      const startTime = TIME_SLOTS[i % TIME_SLOTS.length];
      toCreate.push({
        movieId: movie._id,
        theatre,
        screen,
        date,
        startTime,
      });
    }

    for (const data of toCreate) {
      const existing = await Showtime.findOne({
        movieId: data.movieId,
        theatre: data.theatre,
        screen: data.screen,
        date: data.date,
        startTime: data.startTime,
      });
      if (existing) continue;

      const showtime = await Showtime.create(data);
      await createSeatsForShowtime(showtime._id);
      totalShowtimes++;
    }
  }

  console.log(`Created ${totalShowtimes} showtimes (with seats) for ${movies.length} movies.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
