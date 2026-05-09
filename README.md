# Vedaz Expert Booking System

A real-time expert session booking platform built with the MERN stack. Users can browse experts, book sessions, and receive live updates when slots are booked. Designed as a full-stack internship assignment.

---

## Project Overview

Vedaz is a web application that connects users with domain experts for 1-on-1 consultation sessions. The system handles real-time slot management, prevents double-booking through database-level constraints, and provides instant updates to all connected users when a slot is booked.

**Key Features:**
- Browse and search experts by name and category
- View expert availability in a date-grouped format
- Book sessions with validation
- View all bookings by email
- Admin panel to manage booking status
- Real-time slot updates across all users via Socket.io
- Double-booking protection at database level

---

## Features

- **Expert Listing** — Search by name, filter by category, paginated results (6 per page)
- **Expert Detail** — View profile, ratings, experience, and available slots grouped by date
- **Real-Time Slots** — Socket.io broadcasts slot-booked events; all users see updates instantly
- **Booking Form** — Full form validation (name, email, phone, date, slot, notes)
- **Booking URL State** — Refresh-safe using query params + navigation state fallback
- **My Bookings** — Search bookings by email, view all session details
- **Admin Bookings** — Testing utility to fetch bookings and update status (Pending → Confirmed → Completed)
- **Double-Booking Prevention** — MongoDB compound index on (expert, date, timeSlot) prevents race conditions
- **Professional Error Handling** — Meaningful error messages and proper HTTP status codes

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, React Router v6, Axios, Socket.io Client |
| **Backend** | Node.js, Express.js, Mongoose, Socket.io |
| **Database** | MongoDB Atlas (cloud) or local MongoDB |
| **Styling** | Custom CSS (no UI framework) |

---

## Folder Structure

```
vedaz-expert-booking/
├── client/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js                 # Axios instance with base URL
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ExpertCard.jsx
│   │   │   ├── SlotGroup.jsx
│   │   │   ├── Loader.jsx
│   │   │   └── ErrorMessage.jsx
│   │   ├── context/
│   │   │   └── SocketContext.jsx        # Socket.io provider
│   │   ├── pages/
│   │   │   ├── ExpertList.jsx
│   │   │   ├── ExpertDetail.jsx
│   │   │   ├── BookingPage.jsx
│   │   │   ├── MyBookings.jsx
│   │   │   └── AdminBookings.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── expertController.js
│   │   │   └── bookingController.js
│   │   ├── models/
│   │   │   ├── Expert.js
│   │   │   └── Booking.js
│   │   ├── routes/
│   │   │   ├── expertRoutes.js
│   │   │   └── bookingRoutes.js
│   │   ├── middleware/
│   │   │   ├── errorHandler.js
│   │   │   └── notFound.js
│   │   ├── seed/
│   │   │   └── seedExperts.js
│   │   ├── socket/
│   │   │   └── socket.js
│   │   └── app.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── README.md
├── DEMO_SCRIPT.md
└── .gitignore
```

---

## Backend API Documentation

### Experts

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/experts` | List all experts with pagination & search |
| GET | `/api/experts/:id` | Get single expert with availability |

**GET /api/experts Query Params:**
- `page` — page number (default: 1)
- `limit` — results per page (default: 6)
- `search` — search by name (case-insensitive)
- `category` — filter by category

**Response:**
```json
{
  "experts": [
    {
      "_id": "...",
      "name": "Priya Sharma",
      "category": "Career",
      "experience": 8,
      "rating": 4.9,
      "price": 1200
    }
  ],
  "currentPage": 1,
  "totalPages": 2,
  "totalExperts": 12
}
```

---

### Bookings

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/bookings` | Create a new booking |
| GET | `/api/bookings?email=...` | Get all bookings for an email |
| PATCH | `/api/bookings/:id/status` | Update booking status |

**POST /api/bookings Body:**
```json
{
  "expertId": "...",
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "phone": "9876543210",
  "date": "2026-05-10",
  "timeSlot": "10:00 AM",
  "notes": "Need guidance on switching careers"
}
```

**Error Responses:**
- `400` — Validation failed
- `404` — Expert not found
- `409` — Slot already booked

---

## Environment Variables

### Backend (`server/.env`)

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
CLIENT_URL=http://localhost:5173
```

### Frontend (`client/.env`)

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## Local Setup Instructions

### Prerequisites
- Node.js v16+
- MongoDB Atlas account
- Git

### Step 1: Backend

```bash
cd server
npm install
cp .env.example .env
# Edit .env and add your MongoDB URI
npm run seed
npm run dev
```

Backend runs on `http://localhost:5000`

### Step 2: Frontend (New Terminal)

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## Commands Reference

**Backend:**
```bash
cd server
npm install        # Install dependencies
npm run seed       # Seed database with 12 experts
npm run dev        # Start with nodemon (auto-reload)
npm start          # Start production server
```

**Frontend:**
```bash
cd client
npm install        # Install dependencies
npm run dev        # Start dev server with hot reload
npm run build      # Build for production
npm run preview    # Preview production build
```

---

## Double Booking Prevention

Prevented at two levels:

1. **Application Level** — Backend validates expert, date, and slot exist before creating booking

2. **Database Level (Primary)** — Unique compound index on `(expert, date, timeSlot)` ensures MongoDB rejects duplicates with E11000 error → API returns 409

**Verification:** Open two browser tabs, select same slot in both, book simultaneously. Second booking fails.

---

## Real-Time Slot Updates

1. User books slot → POST `/api/bookings` succeeds
2. Backend emits `io.emit("slot-booked", { expertId, date, timeSlot, bookingId })`
3. All connected clients listen via Socket.io
4. Frontend updates UI instantly — no page refresh needed
5. ExpertDetail marks slot disabled; BookingPage shows warning if same slot booked

**Verify:** Open same expert in two tabs. Book slot in Tab 2. Tab 1 shows slot disabled instantly.

---

## Deployment Guide

### Backend Deployment (Railway)

Railway automatically detects Node.js projects and deploys them.

#### Steps:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Create Railway Account & Project**
   - Go to https://railway.app
   - Sign up or log in with GitHub
   - Create new project → Import from GitHub repo

3. **Configure Railway**
   - Select repository: `vedaz-expert-booking`
   - Root directory: `server`
   - Environment variables:
     ```
     MONGO_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/vedaz_booking
     CLIENT_URL=https://your-vercel-frontend-url.vercel.app
     ```

4. **Deploy**
   - Railway automatically builds and deploys
   - Copy generated domain (e.g., `https://vedaz-api.up.railway.app`)

5. **Verify Deployment**
   ```bash
   # Test health endpoint
   curl https://your-railway-url.up.railway.app/health
   
   # Expected response
   {"status":"ok","service":"vedaz-expert-booking-api"}
   
   # Test API
   curl https://your-railway-url.up.railway.app/api/experts
   ```

---

### Frontend Deployment (Vercel)

Vercel integrates seamlessly with React projects.

#### Steps:

1. **Import Project in Vercel**
   - Go to https://vercel.com
   - Import GitHub repository
   - Select repository: `vedaz-expert-booking`

2. **Configure Build Settings**
   - Root directory: `client`
   - Build command: `npm run build`
   - Output directory: `dist`

3. **Set Environment Variables**
   - Add in Vercel project settings:
     ```
     VITE_API_URL=https://your-railway-url.up.railway.app/api
     VITE_SOCKET_URL=https://your-railway-url.up.railway.app
     ```

4. **Deploy**
   - Vercel automatically builds and deploys on every push
   - Copy generated URL (e.g., `https://vedaz-booking.vercel.app`)

5. **Verify Deployment**
   - Open frontend URL in browser
   - Should load without CORS errors
   - Real-time slots should work
   - Bookings should submit successfully

---

### MongoDB Atlas Setup

If using MongoDB Atlas (recommended):

1. Create cluster on https://www.mongodb.com/cloud/atlas
2. Create database user with password
3. Whitelist IP addresses:
   - For Railway: Add `0.0.0.0/0` (or Railway IP range)
   - For local testing: Add your IP
4. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`
5. Add to environment variables on Railway

---

## Environment Variables for Deployment

### Railway Backend

```env
PORT=5000
MONGO_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/vedaz_booking?retryWrites=true&w=majority
CLIENT_URL=https://your-vercel-frontend-url.vercel.app
```

**Multiple Frontend Origins** (if needed):
```env
CLIENT_URL=http://localhost:5173,https://your-vercel-frontend-url.vercel.app
```

### Vercel Frontend

```env
VITE_API_URL=https://your-railway-url.up.railway.app/api
VITE_SOCKET_URL=https://your-railway-url.up.railway.app
```

---

## Testing Deployment

### Backend Health Check

```bash
# Should respond with status
curl https://your-railway-url.up.railway.app/health

# Should return expert list
curl https://your-railway-url.up.railway.app/api/experts
```

### Frontend Features

- [ ] Expert listing loads
- [ ] Search works
- [ ] Category filter works
- [ ] Expert detail loads
- [ ] Booking form submits
- [ ] Real-time slot updates work (open two tabs)
- [ ] My Bookings searches by email
- [ ] Admin status update works

---

## Submission Links

- **GitHub Repository:** https://github.com/your-username/vedaz-expert-booking
- **Demo Video:** your_demo_video_link_here
- **Live Frontend:** https://your-vercel-frontend-url.vercel.app
- **Live Backend API:** https://your-railway-url.up.railway.app

---

## Code Quality Notes

- Clean, minimal code with comments only where needed
- Proper error handling and validation at both layers
- Follows React and Node.js best practices
- No external UI frameworks — custom CSS only

For detailed feature walkthrough, see `DEMO_SCRIPT.md`
