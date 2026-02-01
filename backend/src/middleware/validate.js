const { validationResult } = require('express-validator');
const { BadRequestError } = require('../utils/errors');

/**
 * Middleware to run express-validator and return 400 with errors if validation fails.
 * Use after route-specific validators.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg || e.path);
    next(new BadRequestError(messages.join(', ')));
    return;
  }
  next();
};

module.exports = { validate };
