const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

const registerValidators = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('name').trim().notEmpty().withMessage('Name is required'),
];

const loginValidators = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

router.post('/register', registerValidators, validate, authController.register);
router.post('/login', loginValidators, validate, authController.login);
router.get('/me', auth, authController.getMe);

module.exports = router;
