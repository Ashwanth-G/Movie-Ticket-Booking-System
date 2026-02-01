const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { UnauthorizedError } = require('../utils/errors');

/**
 * Verify JWT from Authorization: Bearer <token> and attach user to req.user.
 * Responds 401 if token missing or invalid.
 */
const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Access denied. No token provided.');
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      throw new UnauthorizedError('User not found.');
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      next(new UnauthorizedError('Invalid or expired token.'));
      return;
    }
    next(error);
  }
};

module.exports = { auth };
