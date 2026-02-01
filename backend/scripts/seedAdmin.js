/**
 * One-time seed: create an admin user if no admin exists.
 * Usage: node scripts/seedAdmin.js
 * Set ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME in env or edit below.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User } = require('../src/models');
const { ROLES } = require('../src/utils/constants');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin';

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/movie-booking');
  const existing = await User.findOne({ role: ROLES.ADMIN });
  if (existing) {
    console.log('Admin user already exists:', existing.email);
    process.exit(0);
    return;
  }
  const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await User.create({
    email: ADMIN_EMAIL,
    password: hashed,
    name: ADMIN_NAME,
    role: ROLES.ADMIN,
  });
  console.log('Admin user created:', ADMIN_EMAIL);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
