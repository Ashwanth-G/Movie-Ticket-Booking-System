# User & System Flows

## 1. Authentication Flow

```
User → Register/Login Page → POST /api/auth/register or /api/auth/login
       → Backend: validate → hash (register) / compare (login)
       → Return JWT + user
       → Frontend stores token, redirects to home/profile
```

## 2. Booking Flow (End-to-End)

```
1. User browses movies           → GET /api/movies
2. Clicks movie                  → GET /api/movies/:id (details)
3. Sees showtimes                → GET /api/showtimes?movieId=...
4. Selects showtime              → GET /api/showtimes/:id/seats (seat map + status)
5. Selects seats                 → POST /api/bookings/lock (lock seats, 5min timeout)
6. Confirms booking              → POST /api/bookings/confirm (validate lock, create booking, mark seats booked)
   - On failure                  → POST /api/bookings/release (release lock)
7. Sees confirmation             → GET /api/bookings/:id or /api/users/me/bookings
```

## 3. Seat Lock Flow (Detail)

```
Client: "Lock seats A1, A2 for showtime X"
  → POST /api/bookings/lock { showtimeId, seatIds[] }
  → Backend:
     - Check seats exist for showtime, status = available
     - Atomic update: set status=locked, lockedAt=now, lockedBy=userId
     - Return lockId/session or expiry time
  → If timeout (5 min) or user abandons: cron or on-next-request releases lock
  → Client: "Confirm booking" with same seats
  → Backend: verify still locked by this user, create booking, set seats booked
```

## 4. Admin Flows

```
Admin login → JWT with role=admin
  - Add/Update/Delete movie      → POST/PUT/DELETE /api/movies (admin only)
  - Add showtime for movie       → POST /api/showtimes (admin only)
  - (Optional) View all bookings → GET /api/bookings (admin only)
```
