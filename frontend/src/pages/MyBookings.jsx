import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import './MyBookings.css';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    bookingService
      .getMyBookings()
      .then((res) => setBookings(res.data || []))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load bookings'))
      .finally(() => setLoading(false));
  }, []);

  const getMovieTitle = (b) => {
    const movie = b.showtimeId?.movieId;
    return movie?.title || 'Movie';
  };

  const getShowtimeInfo = (b) => {
    const st = b.showtimeId;
    if (!st) return '';
    const date = st.date ? new Date(st.date).toLocaleDateString() : '';
    return `${st.theatre} • Screen ${st.screen} • ${date} ${st.startTime || ''}`;
  };

  const getSeatLabels = (b) => {
    const seats = b.seatIds || [];
    return seats.map((s) => (s.row ? `${s.row}${s.number}` : s._id)).join(', ');
  };

  if (loading) {
    return (
      <div className="container">
        <p>Loading your bookings...</p>
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
    <div className="container my-bookings-page">
      <h1>My Bookings</h1>
      {bookings.length === 0 ? (
        <p>You have no bookings yet.</p>
      ) : (
        <div className="bookings-list">
          {bookings.map((b) => (
            <div key={b._id} className="booking-card card">
              <div className="booking-header">
                <span className="booking-id">{b.bookingId}</span>
                <span className={`booking-status status-${b.status}`}>{b.status}</span>
              </div>
              <p className="booking-movie">{getMovieTitle(b)}</p>
              <p className="booking-meta">{getShowtimeInfo(b)}</p>
              <p className="booking-seats">Seats: {getSeatLabels(b)}</p>
              <p className="booking-amount">Amount: ₹{b.totalAmount}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
