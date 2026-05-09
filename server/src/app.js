const express = require("express");
const cors = require("cors");

const expertRoutes = require("./routes/expertRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// CORS configuration for local, Railway, and Vercel
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((origin) => origin.trim())
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => res.json({ message: "Vedaz Expert Booking API is running" }));
app.get("/health", (req, res) => res.json({ status: "ok", service: "vedaz-expert-booking-api" }));

app.use("/api/experts", expertRoutes);
app.use("/api/bookings", bookingRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
