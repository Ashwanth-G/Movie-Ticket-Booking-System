const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { BadRequestError, UnauthorizedError } = require('../utils/errors');
const { ROLES } = require('../utils/constants');

/**
 * Register a new user. Hashes password and returns user + token.
 */
const register = async ({ email, password, name, role }) => {
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new BadRequestError('Email already registered.');
  }
  const emailLower = email.toLowerCase();
  const isAdminEmail = process.env.ADMIN_EMAIL && emailLower === process.env.ADMIN_EMAIL.toLowerCase();
  const userRole = role ?? (isAdminEmail ? ROLES.ADMIN : ROLES.USER);
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    email: emailLower,
    password: hashedPassword,
    name,
    role: userRole,
  });
  const token = generateToken(user._id);
  const userObj = user.toObject();
  delete userObj.password;
  return { user: userObj, token };
};

/**
 * Login: validate credentials and return user + token.
 * If ADMIN_EMAIL is set and this user's email matches, promote them to admin (so existing accounts work).
 */
const login = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    throw new UnauthorizedError('Invalid email or password.');
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new UnauthorizedError('Invalid email or password.');
  }
  const emailLower = user.email.toLowerCase();
  const isAdminEmail = process.env.ADMIN_EMAIL && emailLower === process.env.ADMIN_EMAIL.toLowerCase();
  if (isAdminEmail && user.role !== ROLES.ADMIN) {
    await User.findByIdAndUpdate(user._id, { role: ROLES.ADMIN });
    user.role = ROLES.ADMIN;
  }
  const token = generateToken(user._id);
  const userObj = user.toObject();
  delete userObj.password;
  return { user: userObj, token };
};

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

module.exports = {
  register,
  login,
};
