import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { movieService } from '../services/movieService';
import { showtimeService } from '../services/showtimeService';
import './MovieShowtimes.css';

function getDateKey(d) {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

function formatDateShort(d) {
  const date = new Date(d);
  const weekday = date.toLocaleDateString('en-IN', { weekday: 'short' }).toUpperCase();
  const day = date.getDate();
  const month = date.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase();
  return { weekday, day, month };
}

export default function MovieShowtimes() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedDateKey, setSelectedDateKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([movieService.getById(id), showtimeService.getByMovieId(id)])
      .then(([movieRes, showtimesRes]) => {
        setMovie(movieRes.data);
        const list = showtimesRes.data || [];
        setShowtimes(list);
        if (list.length > 0) {
          setSelectedDateKey(getDateKey(list[0].date));
        } else {
          setSelectedDateKey(null);
        }
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load'))
      .finally(() => setLoading(false));
  }, [id]);

  const showtimesByDay = useMemo(() => {
    const byDay = {};
    (showtimes || []).forEach((st) => {
      const key = getDateKey(st.date);
      if (!byDay[key]) byDay[key] = { key, date: st.date, list: [] };
      byDay[key].list.push(st);
    });
    return Object.values(byDay).sort((a, b) => a.key - b.key);
  }, [showtimes]);

  const showtimesByTheatre = useMemo(() => {
    const day = showtimesByDay.find((d) => d.key === selectedDateKey);
    if (!day) return [];
    const byTheatre = {};
    day.list.forEach((st) => {
      const key = `${st.theatre}|${st.screen}`;
      if (!byTheatre[key]) byTheatre[key] = { theatre: st.theatre, screen: st.screen, showtimes: [] };
      byTheatre[key].showtimes.push(st);
    });
    return Object.values(byTheatre);
  }, [showtimesByDay, selectedDateKey]);

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

  return (
    <div className="container movie-showtimes-page">
      <Link to={`/movies/${id}`} className="back-link">
        ← Back to movie
      </Link>

      <h1 className="showtimes-movie-title">{movie.title} ({movie.language})</h1>
      <div className="showtimes-movie-meta">
        <span>Movie runtime: {movie.duration}m</span>
        <span>{movie.genre}</span>
      </div>

      {showtimesByDay.length === 0 ? (
        <p>No showtimes available.</p>
      ) : (
        <>
          <div className="date-selector-bar">
            {showtimesByDay.map((day) => {
              const { weekday, day: d, month } = formatDateShort(day.date);
              const isSelected = day.key === selectedDateKey;
              return (
                <button
                  key={day.key}
                  type="button"
                  className={`date-tab ${isSelected ? 'date-tab-active' : ''}`}
                  onClick={() => setSelectedDateKey(day.key)}
                >
                  <span className="date-tab-weekday">{weekday}</span>
                  <span className="date-tab-day">{d}</span>
                  <span className="date-tab-month">{month}</span>
                </button>
              );
            })}
          </div>

          <div className="showtimes-legend">
            <span className="legend-available">AVAILABLE</span>
          </div>

          <div className="theatres-list">
            {showtimesByTheatre.map(({ theatre, screen, showtimes: stList }) => (
              <div key={`${theatre}-${screen}`} className="theatre-card card">
                <h3 className="theatre-name">{theatre}: Screen {screen}</h3>
                <div className="showtime-buttons">
                  {stList.map((st) => (
                    <Link
                      key={st._id}
                      to={`/showtimes/${st._id}/seats`}
                      state={{ showtime: st, movie }}
                      className="showtime-btn"
                    >
                      <span className="showtime-btn-time">{st.startTime}</span>
                      <span className="showtime-btn-format">Screen {st.screen}</span>
                    </Link>
                  ))}
                </div>
                <p className="theatre-policy">Cancellation available</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
