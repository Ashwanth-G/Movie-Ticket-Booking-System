import { api } from './api';

export const bookingService = {
  lockSeats: (showtimeId, seatIds) =>
    api.post('/api/bookings/lock', { showtimeId, seatIds }).then((res) => res.data),

  releaseLock: (showtimeId, seatIds) =>
    api.post('/api/bookings/release', { showtimeId, seatIds }).then((res) => res.data),

  confirmBooking: (showtimeId, seatIds, totalAmount) =>
    api.post('/api/bookings/confirm', { showtimeId, seatIds, totalAmount }).then((res) => res.data),

  getMyBookings: () =>
    api.get('/api/bookings/my').then((res) => res.data),

  getAll: () =>
    api.get('/api/bookings').then((res) => res.data),

  getById: (bookingId) =>
    api.get(`/api/bookings/${bookingId}`).then((res) => res.data),
};
