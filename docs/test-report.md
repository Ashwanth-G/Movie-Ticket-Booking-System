# 🧪 Test Report
## Movie Ticket Booking System

---

## 1. Introduction
This document outlines the **testing strategy, tools, test cases, execution results, and validation outcomes** for the *Movie Ticket Booking System* — a full-stack web application developed as a **solo project** and deployed using **modern DevOps practices**.

### 🎯 Testing Objectives
The primary goals of testing were to ensure:
- Functional correctness
- Secure authentication and authorization
- Data consistency during seat booking
- API stability and reliability
- Deployment and CI/CD integrity

---

## 2. Scope of Testing

### ✔️ In Scope
- User authentication and authorization
- Movie listing and showtime management
- Seat availability and booking logic
- Admin functionalities
- REST API endpoints
- Database integration
- CI/CD pipeline execution
- Dockerized deployment

### ❌ Out of Scope
- Payment gateway testing (future enhancement)
- Load and stress testing
- Mobile application testing

---

## 3. Testing Types Performed

| Test Type | Description |
|---------|-------------|
| Unit Testing | Individual backend routes and business logic |
| Integration Testing | API ↔ Database interaction |
| Functional Testing | End-to-end user workflows |
| Security Testing | Authentication & role-based access |
| Manual UI Testing | Frontend validation |
| Deployment Testing | Docker & AWS verification |

---

## 4. Test Environment

### Hardware
- Windows 11 (Local Development)
- AWS Ubuntu EC2 Instance (Production)

### Software
- Node.js
- MongoDB Atlas
- Docker
- GitHub Actions
- Postman
- Web Browser (Chrome / Edge)

### Environments

| Environment | Purpose |
|------------|--------|
| Local | Development & initial testing |
| Cloud (AWS) | Final validation & demo |

---

## 5. Tools Used

| Tool | Purpose |
|------|--------|
| Postman | API testing |
| MongoDB Atlas | Database verification |
| GitHub Actions | CI/CD validation |
| Docker | Container testing |
| Nginx | Microservices Gateway|
| Browser DevTools | UI validation |
| GitHub | Version control |

---

## 6. Test Strategy

### Backend Testing
- REST APIs tested using Postman
- Positive and negative test cases executed
- JWT authentication tokens validated
- Authorization checks for admin-only routes

### Frontend Testing
- Manual testing of UI workflows
- Form validation checks
- Error message verification

### DevOps Testing
- Docker image build validation
- CI/CD workflow execution
- Cloud deployment verification on AWS EC2

---

## 7. Test Scenarios & Test Cases

### 🔐 Authentication Tests

| Test Case ID | Scenario | Expected Result | Status |
|-------------|----------|----------------|--------|
| AUTH-01 | User registration | User created successfully | ✅ Pass |
| AUTH-02 | Duplicate email registration | Error returned | ✅ Pass |
| AUTH-03 | Login with valid credentials | JWT token generated | ✅ Pass |
| AUTH-04 | Login with invalid password | Access denied | ✅ Pass |
| AUTH-05 | Access protected route without token | Unauthorized error | ✅ Pass |

---

### 🎬 Movie & Showtime Tests

| Test Case ID | Scenario | Expected Result | Status |
|-------------|----------|----------------|--------|
| MOV-01 | Fetch movie list | Movies returned | ✅ Pass |
| MOV-02 | Add movie (Admin) | Movie added | ✅ Pass |
| MOV-03 | Add movie (User) | Access denied | ✅ Pass |
| MOV-04 | Create showtime | Showtime created | ✅ Pass |
| MOV-05 | Fetch showtimes | Data displayed correctly | ✅ Pass |

---

### 🪑 Seat Booking Tests

| Test Case ID | Scenario | Expected Result | Status |
|-------------|----------|----------------|--------|
| SEAT-01 | View seat availability | Available seats shown | ✅ Pass |
| SEAT-02 | Book available seat | Booking successful | ✅ Pass |
| SEAT-03 | Book already booked seat | Error returned | ✅ Pass |
| SEAT-04 | Multiple seat booking | Seats booked correctly | ✅ Pass |
| SEAT-05 | Concurrent booking attempt | Double booking prevented | ✅ Pass |

---

### 📦 Booking Management Tests

| Test Case ID | Scenario | Expected Result | Status |
|-------------|----------|----------------|--------|
| BOOK-01 | Confirm booking | Booking ID generated | ✅ Pass |
| BOOK-02 | View booking history | Correct bookings displayed | ✅ Pass |
| BOOK-03 | Unauthorized booking access | Access denied | ✅ Pass |

---

### 🛠️ Admin Functionality Tests

| Test Case ID | Scenario | Expected Result | Status |
|-------------|----------|----------------|--------|
| ADM-01 | Admin login | Successful | ✅ Pass |
| ADM-02 | Add movie | Movie added | ✅ Pass |
| ADM-03 | Update movie | Movie updated | ✅ Pass |
| ADM-04 | Delete movie | Movie removed | ✅ Pass |
| ADM-05 | User access admin route | Forbidden | ✅ Pass |

---

## 8. Database Validation
- Booking records correctly stored in MongoDB
- Seat availability updated atomically
- Referential integrity maintained
- No duplicate seat entries observed

Database consistency was verified using **MongoDB Atlas dashboard** and manual queries.

---

## 9. API Testing Summary
- All APIs returned correct HTTP status codes
- Proper error handling implemented
- Input validation enforced
- Secure headers verified

Postman collections validated:
- Request/response formats
- Authorization headers
- Error messages

---

## 10. CI/CD Pipeline Testing

### GitHub Actions Validation
- Workflow triggered on push
- Docker image built successfully
- Image pushed to Docker Hub
- No pipeline failures observed

### Deployment Testing
- EC2 pulled latest Docker image
- Containers started successfully
- Application accessible via public IP

---

## 11. UI Testing Results
Manual UI testing validated:
- Navigation flow
- Seat selection behavior
- Error prompts
- Responsive layout
- Authentication session persistence

All UI workflows matched expected behavior.

---

## 12. Defects Summary

| Defect ID | Description | Severity | Status |
|---------|------------|----------|--------|
| — | No critical defects found | — | — |

Minor UI alignment issues were identified during early development and resolved before final submission.

---

## 13. Screenshots & Evidence
The following evidence is provided:
- API responses (Postman)
- Booking confirmation UI
- Admin dashboard actions
- MongoDB document entries

📁 Available under **/docs/screenshots**

---

## 14. Limitations
- No automated testing framework implemented
- Load testing not performed
- Payment testing deferred

These are planned as future enhancements.

---

## 15. Conclusion
All planned test cases were executed successfully. The *Movie Ticket Booking System* satisfies all **functional, security, and deployment requirements** defined for this project.

The application is:
- Stable
- Secure
- Deployment-ready
- Suitable for real-world extension

✅ This test report confirms the system is ready for **evaluation and demonstration**.
