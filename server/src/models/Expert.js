const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    slots: [{ type: String }],
  },
  { _id: false }
);

const expertSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ["Career", "Finance", "Health", "Legal", "Technology", "Education"],
    },
    experience: { type: Number, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    bio: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, default: "" },
    availability: [availabilitySchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expert", expertSchema);
