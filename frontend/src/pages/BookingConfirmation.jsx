import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import './BookingConfirmation.css';

export default function BookingConfirmation() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState(null);

  const showtimeId = state?.showtimeId;
  const seatIds = state?.seatIds;
  const movie = state?.movie;
  const showtime = state?.showtime;
  const seats = state?.seats || [];

  useEffect(() => {
    if (!showtimeId || !seatIds?.length) {
      navigate('/');
    }
  }, [showtimeId, seatIds, navigate]);

  const handleConfirm = async () => {
    setError('');
    setSubmitting(true);
    try {
      const totalAmount = seats.length * 200;
      const res = await bookingService.confirmBooking(showtimeId, seatIds, totalAmount);
      setBooking(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Seats may have expired.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (!showtimeId || !seatIds?.length) {
    return null;
  }

  const totalAmount = seats.length * 200;

  if (booking) {
    return (
      <div className="container confirmation-page">
        <div className="confirmation-success card">
          <h1>Booking Confirmed</h1>
          <p className="booking-id">Booking ID: <strong>{booking.bookingId}</strong></p>
          <p>{movie?.title}</p>
          <p className="meta">
            {showtime?.theatre} • Screen {showtime?.screen} • {showtime?.date && new Date(showtime.date).toLocaleDateString()} {showtime?.startTime}
          </p>
          <p>Seats: {seats.map((s) => `${s.row}${s.number}`).join(', ')}</p>
          <p>Amount: ₹{booking.totalAmount}</p>
          <button type="button" className="btn btn-primary" onClick={() => navigate('/my-bookings')}>
            View My Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container confirmation-page">
      <h1>Confirm Booking</h1>
      <div className="confirm-summary card">
        <p><strong>{movie?.title}</strong></p>
        <p>{showtime?.theatre} • {showtime?.date && new Date(showtime.date).toLocaleDateString()} {showtime?.startTime}</p>
        <p>Seats: {seats.map((s) => `${s.row}${s.number}`).join(', ')}</p>
        <p>Amount: ₹{totalAmount}</p>
      </div>
      {error && <div className="error-msg">{error}</div>}
      <div className="confirm-actions">
        <button type="button" className="btn btn-secondary" onClick={handleBack} disabled={submitting}>
          Back
        </button>
        <button type="button" className="btn btn-primary" onClick={handleConfirm} disabled={submitting}>
          {submitting ? 'Confirming...' : 'Pay & Confirm'}
        </button>
      </div>
    </div>
  );
}
