import { api } from './api';

export const movieService = {
  getAll: (params = {}) =>
    api.get('/api/movies', { params }).then((res) => res.data),

  getById: (id) =>
    api.get(`/api/movies/${id}`).then((res) => res.data),

  create: (data) =>
    api.post('/api/movies', data).then((res) => res.data),

  update: (id, data) =>
    api.put(`/api/movies/${id}`, data).then((res) => res.data),

  delete: (id) =>
    api.delete(`/api/movies/${id}`).then((res) => res.data),
};
