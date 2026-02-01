import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { movieService } from '../services/movieService';
import './AdminMovies.css';

const initialForm = {
  title: '',
  genre: '',
  duration: '',
  language: 'English',
  description: '',
  poster: '',
  trailer: '',
};

export default function AdminMovies() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'duration' ? (value ? Number(value) : '') : value }));
    setError('');
    setSuccess('');
  };

  const startEdit = (movie) => {
    setEditingId(movie._id);
    setForm({
      title: movie.title || '',
      genre: movie.genre || '',
      duration: movie.duration ?? '',
      language: movie.language || 'English',
      description: movie.description || '',
      poster: movie.poster || '',
      trailer: movie.trailer || '',
    });
    setError('');
    setSuccess('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(initialForm);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.title.trim() || !form.genre.trim() || !form.duration || !form.language.trim()) {
      setError('Title, genre, duration and language are required.');
      return;
    }
    if (form.duration < 1) {
      setError('Duration must be at least 1 minute.');
      return;
    }
    setSubmitting(true);
    try {
      if (editingId) {
        await movieService.update(editingId, {
          title: form.title.trim(),
          genre: form.genre.trim(),
          duration: Number(form.duration),
          language: form.language.trim(),
          description: (form.description || '').trim(),
          poster: (form.poster || '').trim(),
          trailer: (form.trailer || '').trim(),
        });
        setSuccess('Movie updated successfully.');
        setEditingId(null);
        setForm(initialForm);
      } else {
        await movieService.create({
          title: form.title.trim(),
          genre: form.genre.trim(),
          duration: Number(form.duration),
          language: form.language.trim(),
          description: (form.description || '').trim(),
          poster: (form.poster || '').trim(),
          trailer: (form.trailer || '').trim(),
        });
        setSuccess('Movie added successfully.');
        setForm(initialForm);
      }
      const res = await movieService.getAll({ active: 'false' });
      setMovies(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || (editingId ? 'Failed to update movie.' : 'Failed to add movie.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (movieId, title) => {
    if (!window.confirm(`Delete movie "${title}"? This cannot be undone.`)) return;
    setDeletingId(movieId);
    setError('');
    try {
      await movieService.delete(movieId);
      setSuccess('Movie deleted.');
      const res = await movieService.getAll({ active: 'false' });
      setMovies(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete movie.');
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

  return (
    <div className="container admin-movies-page">
      <h1>{editingId ? 'Edit Movie' : 'Add Movie'} (Admin)</h1>
      <p className="admin-hint">
        {editingId ? 'Update the movie details below and save.' : 'Add movies using the form below. Fields: title, genre, duration (minutes), language, description (optional), poster URL (optional), trailer URL (optional).'}
      </p>

      <form onSubmit={handleSubmit} className="admin-movie-form card">
        {error && <div className="error-msg">{error}</div>}
        {success && <div className="success-msg">{success}</div>}
        {editingId && (
          <div className="form-actions-inline">
            <button type="button" className="btn btn-secondary btn-sm" onClick={cancelEdit}>
              Cancel
            </button>
          </div>
        )}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input id="title" name="title" value={form.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="genre">Genre *</label>
            <input id="genre" name="genre" value={form.genre} onChange={handleChange} placeholder="e.g. Action, Drama" required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="duration">Duration (minutes) *</label>
            <input id="duration" name="duration" type="number" min={1} value={form.duration} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="language">Language *</label>
            <input id="language" name="language" value={form.language} onChange={handleChange} required />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="description">Description (optional)</label>
          <textarea id="description" name="description" rows={3} value={form.description} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="poster">Poster URL (optional)</label>
          <input id="poster" name="poster" type="url" value={form.poster} onChange={handleChange} placeholder="https://..." />
        </div>
        <div className="form-group">
          <label htmlFor="trailer">Trailer URL (optional)</label>
          <input id="trailer" name="trailer" type="url" value={form.trailer} onChange={handleChange} placeholder="https://www.youtube.com/watch?v=..." />
        </div>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? (editingId ? 'Saving...' : 'Adding...') : (editingId ? 'Save changes' : 'Add Movie')}
        </button>
      </form>

      <section className="admin-movies-list">
        <h2>Current movies ({movies.length})</h2>
        {movies.length === 0 ? (
          <p>No movies yet. Add one above.</p>
        ) : (
          <ul className="movies-list-simple">
            {movies.map((m) => (
              <li key={m._id} className="admin-movie-item">
                <span>
                  <strong>{m.title}</strong> — {m.genre} • {m.duration} min • {m.language}
                </span>
                <div className="admin-movie-item-actions">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm btn-edit"
                    onClick={() => startEdit(m)}
                    disabled={!!editingId}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm btn-delete"
                    onClick={() => handleDelete(m._id, m.title)}
                    disabled={deletingId === m._id}
                  >
                    {deletingId === m._id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
