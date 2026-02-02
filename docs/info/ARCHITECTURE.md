# Movie Ticket Booking System – Architecture

## 1. Overview

Production-ready MERN stack application with modular backend, React SPA frontend, JWT auth, role-based access, and DevOps (Docker, CI/CD, cloud deployment).

---

## 2. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CLIENT (Browser)                                    │
│                     React SPA (Axios, React Router)                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        │ HTTPS
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         API GATEWAY / REVERSE PROXY (optional)                │
│                    (e.g. Nginx / Render / Platform LB)                        │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         EXPRESS.JS BACKEND                                    │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐   │
│  │   Routes    │ │ Controllers  │ │  Services   │ │  Middleware         │   │
│  │  (REST API) │ │ (business)  │ │ (logic)     │ │  (auth, validation)  │   │
│  └──────┬──────┘ └──────┬──────┘ └──────┬──────┘ └──────────┬──────────┘   │
│         │               │               │                    │              │
│         └───────────────┴───────────────┴────────────────────┘              │
│                                    │                                         │
│                         ┌──────────┴──────────┐                             │
│                         │  Mongoose (ODM)      │                             │
│                         └──────────┬──────────┘                             │
└────────────────────────────────────┼────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            MONGODB                                            │
│         Users | Movies | Showtimes | Seats | Bookings | Payments             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Backend Architecture (Modular)

```
backend/
├── src/
│   ├── app.js                 # Express app, middleware wiring
│   ├── config/                # DB connection, env
│   ├── controllers/           # Request/response, call services
│   ├── models/                # Mongoose schemas
│   ├── routes/                # Express routers (mount in app.js)
│   ├── middleware/            # auth, validation, error handler
│   ├── services/              # Business logic (booking, seat lock)
│   └── utils/                 # Helpers (errors, constants)
```

**Flow:** `Request → Route → Middleware (auth/validation) → Controller → Service → Model → DB`

- **Routes:** Define HTTP method and path; delegate to controller.
- **Controllers:** Parse body/params, call service, send JSON/status.
- **Services:** Core logic (e.g. seat locking, booking creation, double-booking checks).
- **Models:** Schema + indexes; no business logic.

---

## 4. Frontend Architecture

```
frontend/
├── src/
│   ├── App.jsx                # Router, layout, auth context
│   ├── components/            # Reusable UI (Navbar, SeatMap, etc.)
│   ├── pages/                 # Route-level pages
│   ├── services/              # Axios API client (auth, movies, bookings)
│   └── hooks/                 # useAuth, useApi, etc.
```

**Flow:** User action → Page/Component → Service (Axios) → Backend API → Update state → Re-render.

---

## 5. Authentication & Authorization

- **Auth:** JWT (access token in `Authorization: Bearer <token>`).
- **Storage:** Frontend stores token (e.g. localStorage); Axios interceptor adds header.
- **Roles:** `user` (default), `admin`.
- **Protected routes:**
  - **User:** profile, bookings, seat selection, create booking.
  - **Admin:** CRUD movies, CRUD showtimes, view all bookings (if implemented).
- **Middleware:** `auth` (verify JWT, attach `req.user`), `requireRole(['admin'])` for admin-only routes.

---

## 6. Seat Locking (Double-Booking Prevention)

- **Seat status:** `available` | `locked` | `booked`.
- **Lock:** User selects seats → backend marks seats as `locked` with `lockedAt` and `lockedBy` (userId/session).
- **Timeout:** 5 minutes; background job or on-read check: if `lockedAt + 5min < now` → set back to `available`.
- **Booking:** On payment/confirmation → seats set to `booked`, booking record created.
- **Failure:** On payment failure or timeout → release lock (set to `available`).
- **Concurrency:** Use atomic updates (e.g. `findOneAndUpdate` with status `available` → `locked`) so two requests cannot lock the same seat.

---

## 7. DevOps

- **Containers:** Backend and Frontend each have a Dockerfile; `docker-compose.yml` runs backend, frontend, MongoDB.
- **CI/CD:** GitHub Actions (or Jenkins): Build → Test → Build Docker images → Push to Docker Hub → Deploy to cloud (Render/AWS/GCP/Azure).
- **Deployment:** Backend and frontend as separate services; MongoDB as managed DB or container; env vars for API URL, JWT secret, DB URL.

---

## 8. Security Summary

- Passwords hashed with bcrypt.
- JWT for stateless auth; admin routes guarded by role.
- Input validation (e.g. express-validator) on all inputs.
- CORS configured for frontend origin only.
- No secrets in code; `.env` and env vars in deployment.

---

## 9. Diagram References

- **architecture-diagram.png** – High-level system and backend layout (this section in visual form).
- **flow-diagram.png** – User flows: Auth, Browse → Movie → Showtime → Seats → Booking → Confirmation.
