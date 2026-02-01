import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import MovieList from './pages/MovieList';
import MovieDetail from './pages/MovieDetail';
import MovieShowtimes from './pages/MovieShowtimes';
import SeatSelection from './pages/SeatSelection';
import BookingConfirmation from './pages/BookingConfirmation';
import MyBookings from './pages/MyBookings';
import AdminMovies from './pages/AdminMovies';
import AdminShowtimes from './pages/AdminShowtimes';
import AdminBookings from './pages/AdminBookings';

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<MovieList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/movies/:id" element={<MovieDetail />} />
          <Route path="/movies/:id/showtimes" element={<MovieShowtimes />} />
          <Route
            path="/showtimes/:showtimeId/seats"
            element={
              <PrivateRoute>
                <SeatSelection />
              </PrivateRoute>
            }
          />
          <Route
            path="/booking/confirm"
            element={
              <PrivateRoute>
                <BookingConfirmation />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <PrivateRoute>
                <MyBookings />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/movies"
            element={
              <PrivateRoute>
                <AdminMovies />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/showtimes"
            element={
              <PrivateRoute>
                <AdminShowtimes />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <PrivateRoute>
                <AdminBookings />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
