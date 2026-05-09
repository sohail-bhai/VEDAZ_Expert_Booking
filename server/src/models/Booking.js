const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    expert: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expert",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    timeSlot: { type: String, required: true },
    notes: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

// Compound unique index — this is the primary guard against double booking.
// Even if two requests hit the server simultaneously, MongoDB will reject
// the second insert with an E11000 duplicate key error.
bookingSchema.index({ expert: 1, date: 1, timeSlot: 1 }, { unique: true });

module.exports = mongoose.model("Booking", bookingSchema);
