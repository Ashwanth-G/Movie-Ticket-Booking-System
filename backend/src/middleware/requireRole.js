const { ForbiddenError } = require('../utils/errors');

/**
 * Restrict route to given roles. Use after auth middleware.
 * Expects req.user to be set (role on req.user.role).
 */
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      next(new ForbiddenError('Authentication required.'));
      return;
    }
    if (!allowedRoles.includes(req.user.role)) {
      next(new ForbiddenError('You do not have permission to access this resource.'));
      return;
    }
    next();
  };
};

module.exports = { requireRole };
