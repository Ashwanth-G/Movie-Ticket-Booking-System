import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { movieService } from '../services/movieService';
import './MovieList.css';

export default function MovieList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    movieService
      .getAll()
      .then((res) => setMovies(res.data || []))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load movies'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="container">
        <p>Loading movies...</p>
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
    <div className="movie-list-page">
      <header className="dashboard-hero">
        <div className="container">
          <h1 className="dashboard-title">Now Showing</h1>
          <p className="dashboard-subtitle">Choose a movie and book your tickets</p>
        </div>
      </header>
      <div className="container movie-list-content">
        {movies.length === 0 ? (
          <div className="dashboard-empty card">
            <p>No movies available at the moment.</p>
          </div>
        ) : (
          <div className="movie-grid">
            {movies.map((movie) => (
              <Link key={movie._id} to={`/movies/${movie._id}`} className="movie-card card">
                <div className="movie-card-poster-wrap">
                  {movie.poster ? (
                    <img src={movie.poster} alt={movie.title} className="movie-poster" />
                  ) : (
                    <div className="movie-poster-placeholder">No poster</div>
                  )}
                </div>
                <div className="movie-card-body">
                  <h3 className="movie-title">{movie.title}</h3>
                  <p className="movie-meta">
                    {movie.genre} • {movie.duration} min • {movie.language}
                  </p>
                  <span className="movie-card-cta">View details →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
