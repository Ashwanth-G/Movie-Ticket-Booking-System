import { useState, useEffect, useMemo } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { showtimeService } from '../services/showtimeService';
import { bookingService } from '../services/bookingService';
import SeatMap from '../components/SeatMap';
import './SeatSelection.css';

export default function SeatSelection() {
  const { showtimeId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [seats, setSeats] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [seatCount, setSeatCount] = useState(1);
  const [showSeatCountModal, setShowSeatCountModal] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const showtime = state?.showtime;
  const movie = state?.movie;

  const seatsByRow = useMemo(() => {
    const byRow = {};
    seats.forEach((s) => {
      const row = s.row || 'A';
      if (!byRow[row]) byRow[row] = [];
      byRow[row].push(s);
    });
    Object.keys(byRow).forEach((row) => byRow[row].sort((a, b) => a.number - b.number));
    return byRow;
  }, [seats]);

  useEffect(() => {
    if (!showtimeId) {
      setError('Invalid showtime');
      setLoading(false);
      return;
    }
    showtimeService
      .getSeats(showtimeId)
      .then((res) => setSeats(res.data || []))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load seats'))
      .finally(() => setLoading(false));
  }, [showtimeId]);

  const getConsecutiveSeats = (clickedSeat) => {
    const row = clickedSeat.row || 'A';
    const rowSeats = seatsByRow[row];
    if (!rowSeats) return [clickedSeat._id];
    const idx = rowSeats.findIndex((s) => s._id === clickedSeat._id);
    if (idx === -1 || rowSeats[idx].status === 'booked') return [];
    const n = Math.max(1, Math.min(seatCount, rowSeats.length));
    const trySlice = (start, end) => {
      const slice = rowSeats.slice(start, end + 1);
      if (slice.length !== n || slice.some((s) => s.status !== 'available')) return null;
      return slice.map((s) => s._id);
    };
    const endRight = idx + n - 1;
    if (endRight < rowSeats.length) {
      const ids = trySlice(idx, endRight);
      if (ids) return ids;
    }
    const startLeft = idx - n + 1;
    if (startLeft >= 0) {
      const ids = trySlice(startLeft, idx);
      if (ids) return ids;
    }
    return [clickedSeat._id];
  };

  const handleSeatClick = (seat) => {
    if (seat.status === 'booked') return;
    if (selectedIds.includes(seat._id)) {
      setSelectedIds((prev) => prev.filter((id) => id !== seat._id));
      return;
    }
    const ids = getConsecutiveSeats(seat);
    setSelectedIds(ids);
  };

  const handleProceedToPayment = async () => {
    if (selectedIds.length === 0) {
      setError('Please select at least one seat.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await bookingService.lockSeats(showtimeId, selectedIds);
      navigate('/booking/confirm', {
        state: {
          showtimeId,
          seatIds: selectedIds,
          showtime,
          movie,
          seats: seats.filter((s) => selectedIds.includes(s._id)),
        },
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Seats may have been taken. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <p>Loading seats...</p>
      </div>
    );
  }

  if (error && !seats.length) {
    return (
      <div className="container">
        <p className="error-msg">{error}</p>
      </div>
    );
  }

  return (
    <div className="container seat-selection-page">
      {showSeatCountModal ? (
        <>
          <div className="seat-count-modal-overlay" onClick={() => {}} aria-hidden="true" />
          <div className="seat-count-modal card">
            <h2 className="seat-count-modal-title">How many seats?</h2>
            <div className="seat-count-buttons">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`btn seat-count-btn ${seatCount === n ? 'seat-count-active' : ''}`}
                  onClick={() => setSeatCount(n)}
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="seat-count-modal-price">₹200 per seat • AVAILABLE</p>
            <button
              type="button"
              className="btn btn-primary btn-block seat-count-modal-cta"
              onClick={() => setShowSeatCountModal(false)}
            >
              Select Seats
            </button>
          </div>
        </>
      ) : (
        <>
          <h1>Select Seats</h1>
          {movie && (
            <p className="movie-info">
              {movie.title} • {showtime?.theatre} • {showtime?.date && new Date(showtime.date).toLocaleDateString()} {showtime?.startTime}
            </p>
          )}
          {error && <div className="error-msg">{error}</div>}

          <div className="seat-selection-layout">
            <div className="seat-map-wrap">
              <SeatMap
                seats={seats}
                selectedIds={selectedIds}
                onSelect={handleSeatClick}
                disabled={submitting}
              />
            </div>
            <div className="seat-options-card card">
              <p className="seat-count-label">
                <strong>{seatCount}</strong> ticket(s) • {selectedIds.length} selected
              </p>
              <button
                type="button"
                className="btn btn-secondary btn-sm change-seats-btn"
                onClick={() => setShowSeatCountModal(true)}
              >
                Change
              </button>
              <button
                type="button"
                className="btn btn-primary btn-block proceed-btn"
                onClick={handleProceedToPayment}
                disabled={selectedIds.length === 0 || submitting}
              >
                {submitting ? 'Processing...' : 'Proceed to payment'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
