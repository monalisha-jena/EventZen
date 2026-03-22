<div align="center">

# 🎯 EventZen

### Full-Stack Event Management Platform

A production-grade **microservices** application for end-to-end event management —  
covering venue setup, customer bookings, attendee registrations, and real-time budget tracking.

![Java](https://img.shields.io/badge/Java-Spring%20Boot-6DB33F?style=flat-square&logo=spring&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-Vite-61DAFB?style=flat-square&logo=react&logoColor=black)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [User Roles](#-user-roles)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Reference](#-api-reference)
- [Environment Variables](#-environment-variables)
- [User Flow](#-user-flow)

---

## 🌟 Overview

EventZen is a full-stack microservices platform that connects three types of users — **Admins**, **Customers**, and **Attendees** — through a structured event management workflow.

- **Admins** create venues, onboard vendors, launch events, and approve bookings
- **Customers** browse events, submit bookings with a budget, and track their event
- **Attendees** register under approved bookings, with automatic waitlist management

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────┐
│           Frontend — React + Vite + Tailwind         │
│                     Port 5173                        │
└──────────┬──────────────┬──────────────┬────────────┘
           │              │              │
           ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  Service 1   │ │  Service 3   │ │  Service 2   │
│ User &       │ │ Event &      │ │ Venue &      │
│ Attendee     │ │ Booking      │ │ Vendor       │
│ Spring Boot  │ │ Spring Boot  │ │ Node.js      │
│ Port 8081    │ │ Port 8082    │ │ Port 3000    │
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘
       │                │  ◄─────────────┘
       ▼                ▼       Internal PATCH
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│    MySQL     │ │    MySQL     │ │   MongoDB    │
│eventzen_users│ │eventzen_event│ │eventzen_venue│
└──────────────┘ └──────────────┘ └──────────────┘
```

> All three services share a single JWT secret — enabling stateless cross-service authentication without inter-service calls.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Service 1** | Spring Boot, Spring Security, JPA/Hibernate, MySQL |
| **Service 2** | Node.js, Express, Mongoose, MongoDB |
| **Service 3** | Spring Boot, Spring Security, JPA/Hibernate, MySQL |
| **Frontend** | React 18, Vite, TailwindCSS, React Router v6, Axios |
| **Auth** | JWT (shared secret across all 3 services) |
| **Dev Tools** | IntelliJ IDEA, VS Code, Postman, Maven, npm |

---

## ✨ Features

- **Role-Based Access Control** — Granular permissions enforced at controller and security config level across all 3 services
- **Smart Waitlist System** — Attendees are auto-waitlisted when an event is full and promoted to CONFIRMED on any cancellation
- **Budget Tracking** — Customers submit a budget with their booking; admin tracks vendor costs in real time with the ability to add extra vendors per booking (persisted in MongoDB)
- **Cross-Service Venue & Vendor Sync** — Venue and vendor status automatically updates to `OCCUPIED` on event creation and reverts to `AVAILABLE` on cancellation/completion
- **Dual Database Architecture** — MySQL for transactional data, MongoDB for flexible venue/vendor/budget data (polyglot persistence)
- **Stateless Authentication** — JWT tokens carry `email`, `role`, `userId`, `name` — validated independently by each service with no cross-service auth calls

---

## 👥 User Roles

| Role | Registration | Permissions |
|------|-------------|-------------|
| `ADMIN` | `POST /auth/register/admin` with `Admin-Secret` header + existing Admin JWT | Full platform access |
| `CUSTOMER` | `POST /auth/register` with `role: CUSTOMER` | Browse events, submit bookings with budget, view attendees |
| `ATTENDEE` | `POST /auth/register` with `role: ATTENDEE` | Browse approved bookings, register, auto-waitlist |

---

## 📁 Project Structure

```
EventZen/
│
├── UserAndAttendeeBackend/          # Service 1 — Spring Boot (Port 8081)
│   ├── src/main/java/
│   │   ├── controllers/             # AuthController, UserController
│   │   ├── services/                # AuthService, UserService
│   │   ├── models/                  # User.java (Role: ADMIN/CUSTOMER/ATTENDEE)
│   │   ├── dto/                     # Request/Response DTOs
│   │   ├── repositories/
│   │   ├── security/                # SecurityConfig, JwtFilter
│   │   └── util/                   # JwtUtil
│   └── src/main/resources/
│       └── application.properties   # Port 8081, eventzen_users DB
│
├── VenueServiceBackend/             # Service 2 — Node.js (Port 3000)
│   ├── controllers/
│   │   ├── venueController.js
│   │   ├── vendorController.js
│   │   └── bookingVendorController.js
│   ├── models/
│   │   ├── Venue.js
│   │   ├── Vendor.js
│   │   └── BookingVendor.js         # Persistent extra vendors per booking
│   ├── routes/
│   │   ├── venueRoutes.js
│   │   ├── vendorRoutes.js
│   │   └── bookingVendorRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js        # verifyToken, verifyAdmin
│   │   └── errorHandler.js
│   ├── config/db.js
│   └── app.js
│
├── EventAndBookingBackend/          # Service 3 — Spring Boot (Port 8082)
│   ├── src/main/java/
│   │   ├── controllers/             # EventController, BookingController, RegistrationController
│   │   ├── services/                # EventService, BookingService, RegistrationService
│   │   ├── models/                  # Event, Booking (with budget), Registration
│   │   ├── dto/                     # Request/Response DTOs
│   │   ├── repositories/
│   │   └── util/                   # JwtUtil (same secret as Service 1)
│   └── src/main/resources/
│       └── application.properties   # Port 8082, eventzen_events DB
│
└── eventzen-frontend/               # React Frontend (Port 5173)
    ├── src/
    │   ├── api/
    │   │   ├── authApi.js           # Service 1 calls
    │   │   ├── eventApi.js          # Service 3 calls
    │   │   └── venueApi.js          # Service 2 calls (venues, vendors, budgetVendors)
    │   ├── context/
    │   │   └── AuthContext.jsx      # user, token, role state — role stored separately
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── ProtectedRoute.jsx   # AdminRoute, CustomerRoute, AttendeeRoute
    │   └── pages/
    │       ├── Home.jsx
    │       ├── EventList.jsx
    │       ├── EventDetail.jsx
    │       ├── customer/            # CustomerDashboard, MyBookings
    │       ├── attendee/            # BrowseBookings, MyRegistrations
    │       └── admin/               # AdminDashboard, ManageEvents, ManageVenues,
    │                                #   ManageVendors, ManageBookings, AdminBudget
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Java 17+
- Node.js 18+
- MySQL 8+
- MongoDB (local or Atlas)
- Maven

### 1. Clone the repository

```bash
git clone https://github.com/your-username/eventzen.git
cd eventzen
```

### 2. Set up MySQL databases

```sql
CREATE DATABASE eventzen_users;
CREATE DATABASE eventzen_events;
```

> Spring Boot will auto-create tables via Hibernate (`spring.jpa.hibernate.ddl-auto=update`)

### 3. Start Service 1 — User & Attendee (Port 8081)

```bash
cd UserAndAttendeeBackend
# Update application.properties with your MySQL credentials
mvn spring-boot:run
```

### 4. Start Service 2 — Venue & Vendor (Port 3000)

```bash
cd VenueServiceBackend
npm install
# Create .env file (see Environment Variables section)
npm start
```

### 5. Start Service 3 — Event & Booking (Port 8082)

```bash
cd EventAndBookingBackend
# Update application.properties with your MySQL credentials
mvn spring-boot:run
```

### 6. Start Frontend (Port 5173)

```bash
cd eventzen-frontend
npm install
npm run dev
```

> Visit `http://localhost:5173` to access the app.

---

## 📡 API Reference

### Service 1 — Auth & Users (Port 8081)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/auth/register` | Public | Register as CUSTOMER or ATTENDEE |
| `POST` | `/auth/register/admin` | Admin + Admin-Secret header | Register new admin |
| `POST` | `/auth/login` | Public | Login, returns JWT |
| `GET` | `/users/{id}` | Authenticated | Get user by ID |
| `PUT` | `/users/update/{id}` | Authenticated | Update user |
| `DELETE` | `/users/delete/{id}` | Admin | Delete user |

### Service 2 — Venues & Vendors (Port 3000)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/venues` | Public | Get all venues |
| `POST` | `/venues` | Admin | Create venue |
| `PUT` | `/venues/:id` | Admin | Update venue |
| `DELETE` | `/venues/:id` | Admin | Delete venue |
| `PATCH` | `/venues/internal/:id/status` | Internal | Update venue status |
| `GET` | `/vendors` | Public | Get all vendors |
| `POST` | `/vendors` | Admin | Create vendor |
| `GET` | `/booking-vendors/:bookingId` | Admin | Get extra vendors for booking |
| `POST` | `/booking-vendors/:bookingId` | Admin | Add vendor to booking |
| `DELETE` | `/booking-vendors/:bookingId/:vendorId` | Admin | Remove vendor from booking |

### Service 3 — Events & Bookings (Port 8082)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/events` | Public | Get all events |
| `POST` | `/events` | Admin | Create event |
| `PUT` | `/events/{id}` | Admin | Update event |
| `DELETE` | `/events/{id}` | Admin | Delete event |
| `POST` | `/bookings` | Customer | Create booking (with budget) |
| `GET` | `/bookings/my` | Customer | Get my bookings |
| `PUT` | `/bookings/{id}/cancel` | Customer | Cancel booking |
| `GET` | `/bookings/approved` | Attendee | Get approved bookings |
| `PUT` | `/admin/bookings/{id}/approve` | Admin | Approve booking |
| `PUT` | `/admin/bookings/{id}/reject` | Admin | Reject booking |
| `POST` | `/registrations` | Attendee | Register under a booking |
| `GET` | `/registrations/my` | Attendee | Get my registrations |
| `PUT` | `/registrations/{id}/cancel` | Attendee | Cancel registration |

---

## 🔐 Environment Variables

### Service 2 — `.env`

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/eventzen_venues
JWT_SECRET=EventZenSecretKeyForJWTTokenGenerationAndValidation
```

### Service 1 & 3 — `application.properties`

```properties
# Service 1
server.port=8081
spring.datasource.url=jdbc:mysql://localhost:3306/eventzen_users
spring.datasource.username=your_username
spring.datasource.password=your_password
jwt.secret=EventZenSecretKeyForJWTTokenGenerationAndValidation
admin.secret=EventZenAdminSecret@2024

# Service 3
server.port=8082
spring.datasource.url=jdbc:mysql://localhost:3306/eventzen_events
spring.datasource.username=your_username
spring.datasource.password=your_password
jwt.secret=EventZenSecretKeyForJWTTokenGenerationAndValidation
```

> ⚠️ **Important** — The JWT secret must be identical across all three services for cross-service token validation to work.

---

## 🔄 User Flow

```
ADMIN
  1. Create venues & vendors (Service 2)
  2. Create events — picks venue + vendor (Service 3)
     └── venue/vendor auto-marked OCCUPIED in MongoDB
  3. Review pending bookings → approve or reject
  4. Monitor Budget Overview — customer budget vs vendor costs
  5. Add extra vendors per booking within customer's budget

CUSTOMER
  1. Register with role: CUSTOMER
  2. Browse events on /customer dashboard
  3. Enter budget → submit booking → status: PENDING
  4. Wait for admin approval
  5. On approval → see registered attendees

ATTENDEE
  1. Register with role: ATTENDEE
  2. Browse /browse-bookings → see all APPROVED bookings
  3. Register under a booking → CONFIRMED or WAITLISTED
  4. If someone cancels → first WAITLISTED auto-upgrades to CONFIRMED
  5. View all registrations on /my-registrations
```

---

## 🗺 Frontend Routes

| Route | Page | Access |
|-------|------|--------|
| `/` | Home | Public |
| `/events` | Event List | Public |
| `/events/:id` | Event Detail | Public |
| `/customer` | Customer Dashboard | Customer |
| `/my-bookings` | My Bookings | Customer |
| `/browse-bookings` | Browse Bookings | Attendee |
| `/my-registrations` | My Registrations | Attendee |
| `/admin` | Admin Dashboard | Admin |
| `/admin/events` | Manage Events | Admin |
| `/admin/venues` | Manage Venues | Admin |
| `/admin/vendors` | Manage Vendors | Admin |
| `/admin/bookings` | Manage Bookings | Admin |
| `/admin/budget` | Budget Overview | Admin |

---

<div align="center">

Built with ❤️ using Spring Boot · Node.js · React · MySQL · MongoDB

</div>
