const express = require('express');
const { body, param } = require('express-validator');
const movieController = require('../controllers/movieController');
const { auth } = require('../middleware/auth');
const { requireRole } = require('../middleware/requireRole');
const { validate } = require('../middleware/validate');
const { ROLES } = require('../utils/constants');

const router = express.Router();

const idParam = param('id').isMongoId().withMessage('Invalid movie ID');

const createValidators = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('genre').trim().notEmpty().withMessage('Genre is required'),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be a positive number'),
  body('language').trim().notEmpty().withMessage('Language is required'),
  body('description').optional().trim(),
  body('poster').optional().trim(),
  body('trailer').optional().trim(),
  body('isActive').optional().isBoolean(),
];

const updateValidators = [
  body('title').optional().trim().notEmpty(),
  body('genre').optional().trim().notEmpty(),
  body('duration').optional().isInt({ min: 1 }),
  body('language').optional().trim().notEmpty(),
  body('description').optional().trim(),
  body('poster').optional().trim(),
  body('trailer').optional().trim(),
  body('isActive').optional().isBoolean(),
];

// Public: list movies, get by id
router.get('/', movieController.findAll);
router.get('/:id', idParam, validate, movieController.findById);

// Admin only: create, update, delete
router.post(
  '/',
  auth,
  requireRole([ROLES.ADMIN]),
  createValidators,
  validate,
  movieController.create
);
router.put(
  '/:id',
  auth,
  requireRole([ROLES.ADMIN]),
  idParam,
  updateValidators,
  validate,
  movieController.updateById
);
router.delete(
  '/:id',
  auth,
  requireRole([ROLES.ADMIN]),
  idParam,
  validate,
  movieController.deleteById
);

module.exports = router;
