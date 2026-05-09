const Expert = require("../models/Expert");
const Booking = require("../models/Booking");

// GET /api/experts
const getExperts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const search = req.query.search || "";
    const category = req.query.category || "";

    const query = {};

    if (search.trim()) {
      query.name = { $regex: search.trim(), $options: "i" };
    }

    if (category.trim()) {
      query.category = category.trim();
    }

    const totalExperts = await Expert.countDocuments(query);
    const totalPages = Math.ceil(totalExperts / limit);
    const skip = (page - 1) * limit;

    const experts = await Expert.find(query)
      .select("name category experience rating bio price image")
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({ experts, currentPage: page, totalPages, totalExperts });
  } catch (err) {
    next(err);
  }
};

// GET /api/experts/:id
const getExpertById = async (req, res, next) => {
  try {
    const expert = await Expert.findById(req.params.id).lean();

    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    // Find all booked slots for this expert so we can mark them in the response
    const bookings = await Booking.find({ expert: expert._id }).select("date timeSlot").lean();

    const bookedSet = new Set(bookings.map((b) => `${b.date}__${b.timeSlot}`));

    const availabilityWithStatus = expert.availability.map((dayObj) => ({
      date: dayObj.date,
      slots: dayObj.slots.map((slot) => ({
        time: slot,
        isBooked: bookedSet.has(`${dayObj.date}__${slot}`),
      })),
    }));

    res.json({ ...expert, availability: availabilityWithStatus });
  } catch (err) {
    next(err);
  }
};

module.exports = { getExperts, getExpertById };
