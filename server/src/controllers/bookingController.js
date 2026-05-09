const Booking = require("../models/Booking");
const Expert = require("../models/Expert");
const { getIO } = require("../socket/socket");

// Basic email validation
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Indian mobile number: 10 digits, optionally prefixed with +91 or 0
const isValidPhone = (phone) => /^(\+91|0)?[6-9]\d{9}$/.test(phone.replace(/\s/g, ""));

// POST /api/bookings
const createBooking = async (req, res, next) => {
  try {
    const { expertId, name, email, phone, date, timeSlot, notes } = req.body;

    // Field validation
    const errors = {};
    if (!name || !name.trim()) errors.name = "Name is required";
    if (!email || !email.trim()) {
      errors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!phone || !phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!isValidPhone(phone)) {
      errors.phone = "Enter a valid 10-digit Indian mobile number";
    }
    if (!date) errors.date = "Date is required";
    if (!timeSlot) errors.timeSlot = "Time slot is required";
    if (!expertId) errors.expertId = "Expert is required";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    // Verify expert exists
    const expert = await Expert.findById(expertId);
    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    // Check the selected date/slot actually exists in expert's availability
    const dayEntry = expert.availability.find((d) => d.date === date);
    if (!dayEntry) {
      return res.status(400).json({ message: "Selected date is not available for this expert" });
    }
    if (!dayEntry.slots.includes(timeSlot)) {
      return res.status(400).json({ message: "Selected time slot is not available on this date" });
    }

    // Create the booking — the unique index handles race conditions at the DB level
    const booking = await Booking.create({
      expert: expertId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      date,
      timeSlot,
      notes: notes ? notes.trim() : "",
    });

    // Notify all connected clients so they disable this slot in real time
    try {
      const io = getIO();
      io.emit("slot-booked", {
        expertId,
        date,
        timeSlot,
        bookingId: booking._id,
      });
    } catch (socketErr) {
      // Socket errors should not fail the booking response
      console.error("Socket emit error:", socketErr.message);
    }

    return res.status(201).json({ message: "Booking created successfully", booking });
  } catch (err) {
    // E11000 is MongoDB's duplicate key error code
    if (err.code === 11000) {
      return res.status(409).json({
        message: "This slot was just booked. Please choose another slot.",
      });
    }
    next(err);
  }
};

// GET /api/bookings?email=
const getBookingsByEmail = async (req, res, next) => {
  try {
    const email = req.query.email;

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ message: "Please provide a valid email address" });
    }

    const bookings = await Booking.find({ email: email.toLowerCase() })
      .populate("expert", "name category")
      .sort({ createdAt: -1 })
      .lean();

    res.json({ bookings });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/bookings/:id/status
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ["Pending", "Confirmed", "Completed"];

    if (!allowed.includes(status)) {
      return res.status(400).json({
        message: `Status must be one of: ${allowed.join(", ")}`,
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Status updated", booking });
  } catch (err) {
    next(err);
  }
};

module.exports = { createBooking, getBookingsByEmail, updateBookingStatus };
