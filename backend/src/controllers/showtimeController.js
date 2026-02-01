const showtimeService = require('../services/showtimeService');

const create = async (req, res, next) => {
  try {
    const showtime = await showtimeService.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Showtime created successfully.',
      data: showtime,
    });
  } catch (error) {
    next(error);
  }
};

const findByMovieId = async (req, res, next) => {
  try {
    const showtimes = await showtimeService.findByMovieId(req.params.movieId);
    res.status(200).json({
      success: true,
      data: showtimes,
    });
  } catch (error) {
    next(error);
  }
};

const findById = async (req, res, next) => {
  try {
    const showtime = await showtimeService.findById(req.params.id);
    res.status(200).json({
      success: true,
      data: showtime,
    });
  } catch (error) {
    next(error);
  }
};

const updateById = async (req, res, next) => {
  try {
    const showtime = await showtimeService.updateById(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Showtime updated successfully.',
      data: showtime,
    });
  } catch (error) {
    next(error);
  }
};

const deleteById = async (req, res, next) => {
  try {
    await showtimeService.deleteById(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Showtime deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  findByMovieId,
  findById,
  updateById,
  deleteById,
};
