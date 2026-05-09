# Demo Script for Vedaz Expert Booking System

Use this script to record a demo video showing all features of the application.

---

## Part 1: Expert Listing Page (1 minute)

**Start:** Open browser to `http://localhost:5173` or deployed Vercel URL

1. **Show Expert Listing**
   - "Welcome to Vedaz Expert Booking. This is the expert listing page showing 6 experts per page."
   - Scroll through the visible experts
   - Point out: name, category badge, experience, rating, price

2. **Show Search**
   - Click search box
   - Type "Priya"
   - "Search filters experts by name in real-time"
   - Clear search

3. **Show Category Filter**
   - Click category dropdown
   - Select "Career" then "Technology"
   - "Filter switches between categories"
   - Reset to "All"

4. **Show Pagination**
   - Scroll to bottom
   - Click next/prev buttons
   - "Pagination allows browsing all 12 experts"

---

## Part 2: Expert Detail Page (1.5 minutes)

**Action:** Click on any expert card

1. **Show Expert Profile**
   - Point to: photo, name, category, experience, rating, bio
   - "All information comes from MongoDB"

2. **Show Availability Slots**
   - "Slots are grouped by date"
   - Show available slots are clickable
   - Booked slots are disabled if any

3. **Select a Slot**
   - Click available time slot
   - "Notice the slot is highlighted"
   - "Book [slot] button appears"

4. **Real-Time Demo (Optional)**
   - Have second tab open with same expert
   - In Tab 2, book a different slot
   - Return to Tab 1
   - "Watch the booked slot become disabled instantly via Socket.io"

---

## Part 3: Booking Page (1.5 minutes)

**Action:** Click "Continue to Booking"

1. **Show Booking Form**
   - "Form auto-fills expert, date, and slot from URL params"
   - Show all form fields
   - Point to Session Summary sidebar

2. **Show Form Validation**
   - Try invalid email, phone
   - "Each field validates in real-time"
   - Fill correct data

3. **Show Successful Booking**
   - Click "Confirm Booking"
   - Success screen with reference ID

4. **Demonstrate Refresh Safety**
   - Refresh page
   - "Booking data persists via URL query params and state"

---

## Part 4: Double Booking Prevention (1 minute)

**Setup:** Two browser tabs

1. **Tab 1:** Open expert detail, select slot (don't book)
2. **Tab 2:** Book the exact same slot successfully
3. **Tab 1:** See slot disabled instantly
4. **Try to book** → 409 error appears

---

## Part 5: My Bookings Page (1 minute)

**Action:** Click "My Bookings"

1. Enter email used for booking
2. Click "Find Bookings"
3. Show list with expert name, date, time, status
4. Try non-existent email → "No bookings found"

---

## Part 6: Admin Bookings Page (1 minute)

**Action:** Click "Admin Bookings"

1. Enter email with bookings
2. Status dropdown shows Pending/Confirmed/Completed
3. Change status → Updates instantly
4. "This demonstrates the PATCH API"

---

## Part 7: Real-Time Features (1 minute)

Show Socket.io working:

1. Open same expert in two tabs
2. In Tab 1, don't select any slot
3. In Tab 2, select and book a slot
4. Back to Tab 1, watch slot disable without refresh
5. "All users see slot updates instantly"

---

## Part 8: Code Walkthrough (Optional, 1 minute)

Show file structure in VS Code:

1. Frontend pages and components
2. Backend models (unique index on Booking)
3. Socket.io implementation
4. CORS and environment configuration

---

## Recording Tips

- **Total length:** 8-10 minutes
- **Tools:** OBS, Loom, ScreenFlow, or browser recorder
- **Pacing:** Clear and steady
- **Demo data:** Use real bookings, show actual validation errors

---

**Demo Video Link:** your_demo_video_link_here
