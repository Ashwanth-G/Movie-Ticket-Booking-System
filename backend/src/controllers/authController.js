const authService = require('../services/authService');

const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    const result = await authService.register({ email, password, name });
    res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/** Get current user profile (requires auth). */
const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
};
