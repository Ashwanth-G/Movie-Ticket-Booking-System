import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const logoUrl = import.meta.env.VITE_LOGO_URL || '';

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-brand">
          {logoUrl ? (
            <img src={logoUrl} alt="Company logo" className="navbar-logo" />
          ) : null}
          <span className="navbar-brand-text">Movie Booking</span>
        </Link>
        <div className="navbar-links">
          <Link to="/">Movies</Link>
          {isAuthenticated ? (
            <>
              {user?.role !== 'admin' && <Link to="/my-bookings">My Bookings</Link>}
              {user?.role === 'admin' && (
              <>
                <Link to="/admin/movies">Show Details</Link>
                <Link to="/admin/showtimes">Add Screens</Link>
                <Link to="/admin/bookings">All Bookings</Link>
              </>
            )}
              <span className="navbar-user">{user?.name}</span>
              <button type="button" className="btn btn-secondary btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
