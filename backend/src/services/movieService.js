const { Movie } = require('../models');
const { NotFoundError } = require('../utils/errors');

const create = async (data) => {
  return Movie.create(data);
};

const findAll = async (options = {}) => {
  const { activeOnly = true } = options;
  const query = activeOnly ? { isActive: true } : {};
  return Movie.find(query).sort({ createdAt: -1 }).lean();
};

const findById = async (id) => {
  const movie = await Movie.findById(id).lean();
  if (!movie) {
    throw new NotFoundError('Movie not found.');
  }
  return movie;
};

const updateById = async (id, data) => {
  const movie = await Movie.findByIdAndUpdate(id, data, { new: true }).lean();
  if (!movie) {
    throw new NotFoundError('Movie not found.');
  }
  return movie;
};

const deleteById = async (id) => {
  const movie = await Movie.findByIdAndDelete(id);
  if (!movie) {
    throw new NotFoundError('Movie not found.');
  }
  return movie;
};

module.exports = {
  create,
  findAll,
  findById,
  updateById,
  deleteById,
};
