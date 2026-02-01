import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { movieService } from '../services/movieService';
import { showtimeService } from '../services/showtimeService';
import './AdminShowtimes.css';

const initialForm = {
  movieId: '',
  theatre: '',
  screen: '',
  date: '',
  startTime: '',
};

export default function AdminShowtimes() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [screenSearch, setScreenSearch] = useState('');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/');
      return;
    }
    movieService
      .getAll({ active: 'false' })
      .then((res) => setMovies(res.data || []))
      .catch(() => setError('Failed to load movies'))
      .finally(() => setLoading(false));
  }, [isAuthenticated, user?.role, navigate]);

  useEffect(() => {
    if (form.movieId) {
      showtimeService
        .getByMovieId(form.movieId)
        .then((res) => setShowtimes(res.data || []))
        .catch(() => setShowtimes([]));
    } else {
      setShowtimes([]);
    }
  }, [form.movieId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.movieId || !form.theatre.trim() || !form.screen.trim() || !form.date || !form.startTime.trim()) {
      setError('Movie, theatre, screen, date and start time are required.');
      return;
    }
    setSubmitting(true);
    try {
      await showtimeService.create({
        movieId: form.movieId,
        theatre: form.theatre.trim(),
        screen: form.screen.trim(),
        date: new Date(form.date).toISOString(),
        startTime: form.startTime.trim(),
      });
      setSuccess('Showtime added. Seats created for this screen.');
      setForm((prev) => ({ ...prev, date: '', startTime: '' }));
      const res = await showtimeService.getByMovieId(form.movieId);
      setShowtimes(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add showtime.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (showtimeId) => {
    if (!window.confirm('Delete this screen/showtime? Seats for it will be removed.')) return;
    setDeletingId(showtimeId);
    setError('');
    setSuccess('');
    const previousShowtimes = [...showtimes];
    setShowtimes((prev) => prev.filter((s) => s._id !== showtimeId));
    try {
      await showtimeService.delete(showtimeId);
      setSuccess('Screen/showtime deleted.');
      if (form.movieId) {
        const res = await showtimeService.getByMovieId(form.movieId);
        const list = res?.data ?? (Array.isArray(res) ? res : []);
        setShowtimes(list);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete. Log in again as admin if needed.');
      setShowtimes(previousShowtimes);
    } finally {
      setDeletingId(null);
    }
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  if (loading) {
    return (
      <div className="container">
        <p>Loading...</p>
      </div>
    );
  }

  const filteredShowtimes = screenSearch.trim()
    ? showtimes.filter((st) => {
        const search = screenSearch.trim().toLowerCase();
        const theatre = (st.theatre || '').toLowerCase();
        const screen = (st.screen || '').toString().toLowerCase();
        return theatre.includes(search) || screen.includes(search);
      })
    : showtimes;

  return (
    <div className="container admin-showtimes-page">
      <h1>Add Screen / Showtime (Admin)</h1>
      <p className="admin-hint">Add a new theatre screen and showtime for a movie. Each showtime gets a default seat map (rows A–E, 10 seats per row).</p>

      <form onSubmit={handleSubmit} className="admin-showtime-form card">
        {error && <div className="error-msg">{error}</div>}
        {success && <div className="success-msg">{success}</div>}
        <div className="form-group">
          <label htmlFor="movieId">Movie *</label>
          <select
            id="movieId"
            name="movieId"
            value={form.movieId}
            onChange={handleChange}
            required
          >
            <option value="">Select movie</option>
            {movies.map((m) => (
              <option key={m._id} value={m._id}>{m.title}</option>
            ))}
          </select>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="theatre">Theatre *</label>
            <input
              id="theatre"
              name="theatre"
              value={form.theatre}
              onChange={handleChange}
              placeholder="e.g. PVR Cinemas"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="screen">Screen *</label>
            <input
              id="screen"
              name="screen"
              value={form.screen}
              onChange={handleChange}
              placeholder="e.g. 1"
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date">Date *</label>
            <input
              id="date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="startTime">Start time *</label>
            <input
              id="startTime"
              name="startTime"
              type="time"
              value={form.startTime}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Adding...' : 'Add showtime'}
        </button>
      </form>

      <section className="admin-showtimes-list">
        <h2>Showtimes for selected movie</h2>
        {form.movieId && showtimes.length > 0 && (
          <div className="screen-search-wrap">
            <label htmlFor="screenSearch" className="screen-search-label">Search screens</label>
            <input
              id="screenSearch"
              type="text"
              className="screen-search-input"
              placeholder="Search by theatre or screen name..."
              value={screenSearch}
              onChange={(e) => setScreenSearch(e.target.value)}
            />
          </div>
        )}
        {!form.movieId ? (
          <p>Select a movie above to see its showtimes.</p>
        ) : showtimes.length === 0 ? (
          <p>No showtimes yet. Add one above.</p>
        ) : filteredShowtimes.length === 0 ? (
          <p>No screens match your search. Try a different term.</p>
        ) : (
          <ul className="showtimes-list-simple">
            {filteredShowtimes.map((st) => (
              <li key={st._id} className="admin-showtime-item">
                <span>
                  {st.theatre} • Screen {st.screen} • {new Date(st.date).toLocaleDateString()} {st.startTime}
                </span>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm btn-delete-showtime"
                  onClick={() => handleDelete(st._id)}
                  disabled={deletingId === st._id}
                >
                  {deletingId === st._id ? 'Deleting...' : 'Delete'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
