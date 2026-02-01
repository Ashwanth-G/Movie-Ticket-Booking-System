import { api } from './api';

export const showtimeService = {
  getByMovieId: (movieId) =>
    api.get(`/api/showtimes/movie/${movieId}`).then((res) => res.data),

  getById: (id) =>
    api.get(`/api/showtimes/${id}`).then((res) => res.data),

  getSeats: (showtimeId) =>
    api.get(`/api/showtimes/${showtimeId}/seats`).then((res) => res.data),

  create: (data) =>
    api.post('/api/showtimes', data).then((res) => res.data),

  delete: (id) =>
    api.delete(`/api/showtimes/${id}`).then((res) => res.data),
};
