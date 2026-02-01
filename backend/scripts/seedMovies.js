/**
 * Seed movies into the database.
 * Usage: node scripts/seedMovies.js
 * Optional: node scripts/seedMovies.js path/to/movies.json
 *
 * Movie structure: { title, genre, duration, language, description?, poster?, isActive? }
 */
require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { Movie } = require('../src/models');

const DEFAULT_MOVIES = [
  {
    title: 'The Dark Knight',
    genre: 'Action, Crime, Drama',
    duration: 152,
    language: 'English',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests to fight injustice.',
    poster: '',
    isActive: true,
  },
  {
    title: 'Inception',
    genre: 'Action, Sci-Fi, Thriller',
    duration: 148,
    language: 'English',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.',
    poster: '',
    isActive: true,
  },
  {
    title: 'Dangal',
    genre: 'Biography, Drama, Sport',
    duration: 161,
    language: 'Hindi',
    description: 'Former wrestler Mahavir Singh Phogat trains his daughters Geeta and Babita to become world-class wrestlers.',
    poster: '',
    isActive: true,
  },
  {
    title: 'Interstellar',
    genre: 'Adventure, Drama, Sci-Fi',
    duration: 169,
    language: 'English',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    poster: '',
    isActive: true,
  },
  {
    title: '3 Idiots',
    genre: 'Comedy, Drama',
    duration: 170,
    language: 'Hindi',
    description: 'Two friends are searching for their long lost companion. They revisit their college days and recall the memories of their friend who inspired them to think differently.',
    poster: '',
    isActive: true,
  },
];

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/movie-booking';
  await mongoose.connect(uri);

  let moviesToInsert = DEFAULT_MOVIES;

  const jsonPath = process.argv[2];
  if (jsonPath) {
    const fullPath = path.resolve(process.cwd(), jsonPath);
    if (fs.existsSync(fullPath)) {
      const raw = fs.readFileSync(fullPath, 'utf8');
      moviesToInsert = JSON.parse(raw);
      if (!Array.isArray(moviesToInsert)) {
        throw new Error('JSON file must contain an array of movie objects');
      }
      console.log(`Loading ${moviesToInsert.length} movies from ${jsonPath}`);
    } else {
      console.error('File not found:', fullPath);
      process.exit(1);
    }
  } else {
    console.log('Using default sample movies.');
  }

  const result = await Movie.insertMany(moviesToInsert);
  console.log(`Inserted ${result.length} movies.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
