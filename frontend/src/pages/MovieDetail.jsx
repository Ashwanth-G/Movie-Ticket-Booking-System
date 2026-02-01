import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { movieService } from '../services/movieService';
import './MovieDetail.css';

/** Extract YouTube video ID from watch URL, embed URL, or short URL. */
function getYouTubeVideoId(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  const watchMatch = trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  return watchMatch ? watchMatch[1] : null;
}

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    movieService
      .getById(id)
      .then((res) => setMovie(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="container">
        <p>Loading...</p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container">
        <p className="error-msg">{error || 'Movie not found'}</p>
        <Link to="/">Back to movies</Link>
      </div>
    );
  }

  const trailerVideoId = getYouTubeVideoId(movie.trailer);

  return (
    <div className="container movie-detail-page">
      <Link to="/" className="back-link">
        ← Back to movies
      </Link>
      <div className="movie-detail-header card">
        <div className="movie-detail-left">
          <div className="movie-detail-poster">
            {movie.poster ? (
              <img src={movie.poster} alt={movie.title} />
            ) : (
              <div className="poster-placeholder">No poster</div>
            )}
          </div>
          <div className="movie-detail-info">
            <h1>{movie.title}</h1>
            <p className="movie-meta">
              {movie.genre} • {movie.duration} min • {movie.language}
            </p>
            {movie.description && <p className="movie-description">{movie.description}</p>}
            <button
              type="button"
              className="btn btn-book-tickets"
              onClick={() => navigate(`/movies/${id}/showtimes`)}
            >
              Book tickets
            </button>
          </div>
        </div>
        <div className="movie-detail-trailer">
          {trailerVideoId ? (
            <div className="trailer-embed-wrapper">
              <iframe
                title={`${movie.title} trailer`}
                src={`https://www.youtube.com/embed/${trailerVideoId}?rel=0`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="trailer-iframe"
              />
            </div>
          ) : (
            <div className="trailer-placeholder">No trailer</div>
          )}
        </div>
      </div>
    </div>
  );
}
