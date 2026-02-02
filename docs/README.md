# 🎬 Movie Ticket Booking System
### *Full-Stack Application with DevOps Automation*

---

## 📌 Project Overview
A **production-ready movie ticket booking system** built as a **solo full-stack project** to demonstrate real-world software engineering practices. The application covers **frontend development, backend architecture, authentication, database design, and DevOps automation**, including **Docker, CI/CD with GitHub Actions, and cloud deployment on AWS**.

This system simulates an industry-grade online movie booking platform where:
- Users can browse movies, select showtimes, reserve seats, and manage bookings
- Admins can securely manage movies and schedules

---

## 🎯 Objective
To design and implement a **scalable, secure, and deployable** movie ticket booking platform that reflects **industry-level engineering and DevOps workflows**, going beyond basic CRUD-based applications.

---

## 🚀 Key Features

### 👤 User Features
- User registration & login using **JWT authentication**
- Browse movies and available showtimes
- Interactive **seat selection with real-time availability**
- Secure ticket booking and confirmation
- View booking history under **My Bookings**

### 🛠️ Admin Features
- Admin authentication with **role-based access control**
- Add, update, and delete movies
- Create and manage showtimes
- Automatic seat generation per showtime
- Secure **admin-only APIs**

### 🔐 Security Features
- JWT-based authentication & authorization
- Password hashing using **bcrypt**
- Role-based access (User / Admin)
- Protected routes and middleware
- Input validation and sanitization

---

## 🧰 Tech Stack

### Frontend
- React.js (Vite)
- Axios
- Context API (Authentication State)
- Modular CSS / Styling

### Backend
- Node.js
- Express.js
- JWT Authentication
- bcrypt
- RESTful API design

### Database
- MongoDB Atlas (Cloud-hosted)

### DevOps & Tooling
- Docker
- GitHub Actions (CI/CD)
- Docker Hub
- AWS EC2 (Deployment)
- Nginx (Microservices Gateway)
- Postman (API testing)
- Git & GitHub
- Cursor (AI-assisted development)

---

## 🏗️ System Architecture

### High-Level Architecture
The application follows a **decoupled client–server architecture**:

```
Client (React)
     │
     │ HTTPS Requests
     ▼
Backend API (Node.js + Express)
     │
     ▼
MongoDB Atlas (Cloud Database)
```

### Architecture Documentation
Detailed diagrams are available under the **/docs** folder:
These diagrams explain request flow, booking logic, and service interaction.

- Architecture Diagram
<img width="1536" height="1024" alt="Architectural Diagram" src="https://github.com/user-attachments/assets/30d52d08-18f2-4f0b-8b14-2eef4771996d" />


- Flow Diagram
<img width="1536" height="1024" alt="Flow Diagram" src="https://github.com/user-attachments/assets/c3224ead-8fe0-4b5a-942f-b3f19609056d" />


- Sequence Diagram
<img width="1536" height="1024" alt="Sequence Diagram" src="https://github.com/user-attachments/assets/53b7a57c-285c-49ec-8de6-9bd7959ed91a" />

---


## 🔄 Application Flow

### 🎟️ Ticket Booking Flow
1. User logs in
2. Selects a movie
3. Chooses a showtime
4. Views available seats
5. Selects seats
6. Confirms booking
7. Booking stored in database
8. Seats marked as booked

### 🪑 Seat Management Logic
- Seats are dynamically generated per showtime
- Seat states:
  - Available
  - Selected
  - Booked
  - Locked
- Database-level updates prevent double booking
- Ensures consistency during concurrent access

---

## ⚙️ CI/CD & DevOps Pipeline

### CI/CD Workflow
1. Code is pushed to GitHub
2. GitHub Actions pipeline triggers automatically
3. Application is built and tested
4. Docker image is created
5. Image is pushed to Docker Hub
6. AWS EC2 pulls the latest image
7. Containers restart with the updated version

### Why CI/CD?
- Eliminates manual deployment
- Ensures consistent builds
- Enables faster iteration
- Reflects real-world DevOps practices

---

## 📁 Project Structure

### Backend
```
backend/
├── controllers/
├── routes/
├── models/
├── middleware/
├── config/
├── server.js
└── package.json
```

### Frontend
```
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── context/
│   ├── services/
│   └── App.jsx
└── vite.config.js
```

This separation improves **maintainability, scalability, and clarity**.

---

## 🔐 Environment Variables
A `.env.example` file is included:

| Variable | Description |
|--------|-------------|
| PORT | Backend server port |
| MONGODB_URI | MongoDB Atlas connection string |
| JWT_SECRET | JWT signing secret |
| JWT_EXPIRES_IN | Token expiration time |
| CORS_ORIGIN | Allowed frontend origin |

---

## 🧪 Testing Strategy

### Backend Testing
- API testing using **Postman**
- Authentication & authorization verification
- Edge-case testing for seat booking logic

### Manual Testing
- Login & signup flows
- Booking flow validation
- Admin feature testing
- Error-handling scenarios

📄 A detailed **Test Report** is provided separately.

---

## 📸 Screenshots
Screenshots available under **/docs/screenshots** demonstrating:
- Login & registration
- Movie listings
- Seat selection UI
- Booking confirmation
- Admin dashboard
- Connecting GitHub Actions
- Docker Config in AWS
- Instances Deployed Successfully
- Pulling Images from Docker

---

## 🎥 Demo Video
A complete demo walkthrough covering:
- Project overview
- Code walkthrough
- Booking flow
- Admin features
- Deployment

📎 **Demo Video:** https://drive.google.com/file/d/1PxZXlZw-hC8fylKHuhoyjxiao-x48vtu/view?usp=sharing

---

## 🌐 Live Deployment

| Item | Details |
|----|--------|
| Hosting | AWS EC2 |
| Backend | Dockerized Node.js API |
| Frontend | Dockerized React App |
| Database | MongoDB Atlas |
| Access | Public IP |

👉 **Live URL:** http://3.148.200.172/

---

## 🔮 Future Enhancements
- Online payment integration (Stripe / Razorpay)
- WebSocket-based real-time seat updates
- Email ticket confirmation
- Admin analytics dashboard
- Kubernetes-based deployment

---

## 👤 Project Ownership
**Solo Project**  
Designed, developed, tested, and deployed independently as part of a technical job-application project round.

### Project Usage
This project is intended **solely for evaluation purposes** and showcases full-stack and DevOps expertise.

---

## ✅ Conclusion
This project demonstrates:
- End-to-end full-stack development
- Secure backend architecture
- Real-world booking logic
- CI/CD automation
- Cloud deployment readiness

It reflects **industry-grade engineering practices** expected from a production-ready software developer.
