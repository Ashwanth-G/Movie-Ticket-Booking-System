const movieService = require('../services/movieService');

const create = async (req, res, next) => {
  try {
    const movie = await movieService.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Movie created successfully.',
      data: movie,
    });
  } catch (error) {
    next(error);
  }
};

const findAll = async (req, res, next) => {
  try {
    const activeOnly = req.query.active !== 'false';
    const movies = await movieService.findAll({ activeOnly });
    res.status(200).json({
      success: true,
      data: movies,
    });
  } catch (error) {
    next(error);
  }
};

const findById = async (req, res, next) => {
  try {
    const movie = await movieService.findById(req.params.id);
    res.status(200).json({
      success: true,
      data: movie,
    });
  } catch (error) {
    next(error);
  }
};

const updateById = async (req, res, next) => {
  try {
    const movie = await movieService.updateById(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Movie updated successfully.',
      data: movie,
    });
  } catch (error) {
    next(error);
  }
};

const deleteById = async (req, res, next) => {
  try {
    await movieService.deleteById(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Movie deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  findAll,
  findById,
  updateById,
  deleteById,
};
