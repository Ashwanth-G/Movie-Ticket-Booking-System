# Database Design – MongoDB

## 1. Overview

Collections: **users**, **movies**, **showtimes**, **seats**, **bookings**, **payments**.  
Relationships use MongoDB `ObjectId` references. Indexes are chosen for auth, lookups, and preventing double booking.

---

## 2. Collections & Schemas

### 2.1 users

| Field     | Type     | Required | Notes                    |
|----------|----------|----------|--------------------------|
| _id      | ObjectId | auto     |                          |
| email    | string   | yes      | unique, lowercase        |
| password | string   | yes      | bcrypt hash              |
| name     | string   | yes      |                          |
| role     | string   | yes      | enum: 'user', 'admin'    |
| createdAt| Date     | yes      | default now              |
| updatedAt| Date     | yes      | default now              |

**Indexes:**
- `email` (unique) – login and uniqueness.

---

### 2.2 movies

| Field       | Type   | Required | Notes                    |
|------------|--------|----------|--------------------------|
| _id        | ObjectId | auto   |                          |
| title      | string | yes      |                          |
| genre      | string | yes      |                          |
| duration   | number | yes      | minutes                  |
| language   | string | yes      |                          |
| description| string | no       |                          |
| poster     | string | no       | URL or path              |
| isActive   | boolean| yes      | default true (soft use)  |
| createdAt  | Date   | yes      |                          |
| updatedAt  | Date   | yes      |                          |

**Indexes:**
- `title` – search/listing.
- `isActive` – filter active movies.

---

### 2.3 showtimes

| Field    | Type     | Required | Notes                    |
|---------|----------|----------|--------------------------|
| _id     | ObjectId | auto     |                          |
| movieId | ObjectId | yes      | ref: Movie               |
| theatre | string   | yes      |                          |
| screen  | string   | yes      |                          |
| date    | Date     | yes      | show date                |
| startTime| string  | yes      | e.g. "14:00"             |
| createdAt| Date    | yes      |                          |
| updatedAt| Date    | yes      |                          |

**Indexes:**
- `movieId` – list showtimes by movie.
- `movieId + date + startTime` (compound) – uniqueness / listing.

---

### 2.4 seats

Seats are **per showtime** (each showtime has its own seat rows).

| Field      | Type     | Required | Notes                    |
|-----------|----------|----------|--------------------------|
| _id       | ObjectId | auto     |                          |
| showtimeId| ObjectId | yes      | ref: Showtime            |
| row       | string   | yes      | e.g. "A", "B"            |
| number    | number   | yes      | seat number in row       |
| status    | string   | yes      | enum: available, locked, booked |
| lockedAt  | Date     | no       | set when status=locked   |
| lockedBy  | ObjectId | no       | ref: User                |
| createdAt | Date     | yes      |                          |
| updatedAt | Date     | yes      |                          |

**Indexes:**
- `showtimeId` – all seats for a showtime.
- `showtimeId + row + number` (compound, unique) – one seat per (showtime, row, number).
- `showtimeId + status` – availability queries.
- `lockedAt` (optional) – for timeout cleanup.

---

### 2.5 bookings

| Field       | Type     | Required | Notes                    |
|------------|----------|----------|--------------------------|
| _id        | ObjectId | auto     |                          |
| bookingId  | string   | yes      | human-readable, unique   |
| userId     | ObjectId | yes      | ref: User                |
| showtimeId | ObjectId | yes      | ref: Showtime            |
| seatIds    | [ObjectId]| yes     | ref: Seat                |
| status     | string   | yes      | e.g. confirmed, cancelled |
| totalAmount| number   | yes      | for payment record       |
| createdAt  | Date     | yes      |                          |
| updatedAt  | Date     | yes      |                          |

**Indexes:**
- `bookingId` (unique) – lookup by booking ID.
- `userId` – “My Bookings”.
- `showtimeId` – list bookings per show.
- `userId + createdAt` – user history.

---

### 2.6 payments (mock)

| Field      | Type     | Required | Notes                    |
|-----------|----------|----------|--------------------------|
| _id       | ObjectId | auto     |                          |
| bookingId | ObjectId | yes      | ref: Booking             |
| amount    | number   | yes      |                          |
| status    | string   | yes      | e.g. success, failed     |
| method    | string   | no       | e.g. card, upi            |
| createdAt | Date     | yes      |                          |

**Indexes:**
- `bookingId` – one-to-one with booking.

---

## 3. Relationships (References)

```
User 1 ── N Bookings
User 1 ── N (locked) Seats (via lockedBy)

Movie 1 ── N Showtimes
Showtime 1 ── N Seats
Showtime 1 ── N Bookings

Booking N ── N Seats (seatIds[])
Booking 1 ── 1 Payment (mock)
```

---

## 4. Seat Locking and Concurrency

- **Lock:** Update seat only if `status === 'available'` (atomic `findOneAndUpdate` with condition).
- **Unlock:** Set `status = 'available'`, clear `lockedAt`, `lockedBy` when timeout or payment failure.
- **Book:** Only if seat is `locked` and `lockedBy === currentUser`; then set `status = 'booked'` and create booking.

This design is reflected in the **seats** schema and the booking service logic.
