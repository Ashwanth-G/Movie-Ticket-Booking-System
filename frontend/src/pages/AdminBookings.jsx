import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { bookingService } from '../services/bookingService';
import './AdminBookings.css';

export default function AdminBookings() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/');
      return;
    }
    bookingService
      .getAll()
      .then((res) => setBookings(res.data || []))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load bookings'))
      .finally(() => setLoading(false));
  }, [isAuthenticated, user?.role, navigate]);

  const getMovieTitle = (b) => {
    const movie = b.showtimeId?.movieId;
    return movie?.title || '—';
  };

  const getShowtimeInfo = (b) => {
    const st = b.showtimeId;
    if (!st) return '';
    const date = st.date ? new Date(st.date).toLocaleDateString() : '';
    return `${st.theatre} • Screen ${st.screen} • ${date} ${st.startTime || ''}`;
  };

  const getSeatLabels = (b) => {
    const seats = b.seatIds || [];
    return seats.map((s) => (s.row ? `${s.row}${s.number}` : '—')).join(', ');
  };

  const getCustomer = (b) => {
    const u = b.userId;
    return u ? `${u.name} (${u.email})` : '—';
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  if (loading) {
    return (
      <div className="container">
        <p>Loading bookings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <p className="error-msg">{error}</p>
      </div>
    );
  }

  return (
    <div className="container admin-bookings-page">
      <h1>All Customer Bookings (Admin)</h1>
      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <div className="admin-bookings-list">
          {bookings.map((b) => (
            <div key={b._id} className="admin-booking-card card">
              <div className="admin-booking-header">
                <span className="booking-id">{b.bookingId}</span>
                <span className={`booking-status status-${b.status}`}>{b.status}</span>
              </div>
              <p className="admin-booking-customer"><strong>Customer:</strong> {getCustomer(b)}</p>
              <p className="admin-booking-movie"><strong>Movie:</strong> {getMovieTitle(b)}</p>
              <p className="admin-booking-showtime"><strong>Show:</strong> {getShowtimeInfo(b)}</p>
              <p className="admin-booking-seats"><strong>Seats:</strong> {getSeatLabels(b)}</p>
              <p className="admin-booking-amount"><strong>Amount:</strong> ₹{b.totalAmount}</p>
              <p className="admin-booking-date"><strong>Booked at:</strong> {new Date(b.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
