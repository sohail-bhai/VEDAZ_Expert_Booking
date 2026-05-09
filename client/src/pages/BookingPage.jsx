import { useEffect, useMemo, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import api from "../api/axios";
import { useSocket } from "../context/SocketContext";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
};

const validate = (fields) => {
  const errors = {};
  if (!fields.name.trim()) errors.name = "Name is required";
  if (!fields.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = "Enter a valid email address";
  }
  if (!fields.phone.trim()) {
    errors.phone = "Phone number is required";
  } else if (!/^(\+91|0)?[6-9]\d{9}$/.test(fields.phone.replace(/\s/g, ""))) {
    errors.phone = "Enter a valid 10-digit Indian mobile number";
  }
  return errors;
};

const BookingPage = () => {
  const { expertId } = useParams();
  const location = useLocation();
  const { socket } = useSocket();

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const stateData = location.state || {};

  const queryDate = searchParams.get("date") || "";
  const querySlot = searchParams.get("slot") || "";

  const date = queryDate || stateData.date || "";
  const timeSlot = querySlot || stateData.timeSlot || "";

  const [expert, setExpert] = useState(stateData.expert || null);
  const [loadingExpert, setLoadingExpert] = useState(!stateData.expert);
  const [expertError, setExpertError] = useState("");

  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState(false);
  const [bookingRef, setBookingRef] = useState("");
  const [slotTaken, setSlotTaken] = useState(false);

  useEffect(() => {
    const stateExpert = stateData.expert;
    if (stateExpert && stateExpert._id === expertId) {
      setExpert(stateExpert);
      setLoadingExpert(false);
      setExpertError("");
      return;
    }

    if (!expertId) {
      setExpert(null);
      setLoadingExpert(false);
      setExpertError("Invalid expert details.");
      return;
    }

    const fetchExpert = async () => {
      setLoadingExpert(true);
      setExpertError("");
      try {
        const { data } = await api.get(`/experts/${expertId}`);
        setExpert(data);
      } catch (err) {
        setExpertError(err.response?.data?.message || "Failed to load expert details.");
      } finally {
        setLoadingExpert(false);
      }
    };

    fetchExpert();
  }, [expertId, stateData.expert]);

  useEffect(() => {
    if (!socket || !expertId || !date || !timeSlot) return;

    const handleSlotBooked = ({ expertId: bookedExpertId, date: bookedDate, timeSlot: bookedSlot }) => {
      if (bookedExpertId === expertId && bookedDate === date && bookedSlot === timeSlot) {
        setSlotTaken(true);
      }
    };

    socket.on("slot-booked", handleSlotBooked);
    return () => socket.off("slot-booked", handleSlotBooked);
  }, [socket, expertId, date, timeSlot]);

  if (!date || !timeSlot) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <div className="empty-icon">🗓</div>
          <div className="empty-title">No slot selected</div>
          <p className="empty-desc">Please choose a slot from an expert's profile first.</p>
          <Link to={expertId ? `/experts/${expertId}` : "/"} className="btn btn-primary" style={{ marginTop: 16 }}>
            {expertId ? "Back to Expert" : "Browse Experts"}
          </Link>
        </div>
      </div>
    );
  }

  if (loadingExpert) {
    return (
      <div className="page-container">
        <Loader message="Loading booking details..." />
      </div>
    );
  }

  if (expertError || !expert) {
    return (
      <div className="page-container">
        <ErrorMessage message={expertError || "Expert not found."} />
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    if (slotTaken) {
      setApiError("This slot was just booked by someone else. Please choose another slot.");
      return;
    }

    const fieldErrors = validate(form);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        expertId,
        name: form.name,
        email: form.email,
        phone: form.phone,
        date,
        timeSlot,
        notes: form.notes,
      };

      const { data } = await api.post("/bookings", payload);
      setBookingRef(data.booking._id);
      setSuccess(true);
    } catch (err) {
      if (err.response?.status === 409) {
        setSlotTaken(true);
      }
      setApiError(err.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="page-container" style={{ maxWidth: 640, margin: "0 auto" }}>
        <div className="success-card">
          <div className="success-icon">✓</div>
          <div className="success-title">Booking Confirmed!</div>
          <p className="success-desc">
            Your session with <strong>{expert.name}</strong> on{" "}
            <strong>{formatDate(date)}</strong> at <strong>{timeSlot}</strong> has been booked.
          </p>
          {bookingRef && (
            <p style={{ marginTop: 8, fontSize: "0.78rem", color: "var(--text-muted)" }}>
              Ref: {bookingRef}
            </p>
          )}
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/" className="btn btn-outline">Browse More Experts</Link>
          <Link to="/my-bookings" className="btn btn-primary">View My Bookings</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Link to={`/experts/${expertId}`} className="back-link">
        ← Back to {expert.name}
      </Link>

      <div className="booking-layout">
        {/* Form */}
        <div className="booking-form-card">
          <h2 className="booking-form-title">Complete Your Booking</h2>

          {slotTaken && (
            <div className="alert alert-error" style={{ marginBottom: 14 }}>
              <span>⚠</span>
              <span>
                This slot was just booked by someone else. Please choose another slot. {" "}
                <Link to={`/experts/${expertId}`} style={{ color: "var(--accent)", textDecoration: "underline" }}>
                  Go back to expert details
                </Link>
              </span>
            </div>
          )}

          {apiError && (
            <div className="alert alert-error">
              <span>⚠</span>
              <span>{apiError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-row" style={{ marginBottom: 16 }}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  className={`form-input${errors.name ? " error" : ""}`}
                  placeholder="Rahul Sharma"
                  value={form.name}
                  onChange={handleChange}
                />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  className={`form-input${errors.email ? " error" : ""}`}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                className={`form-input${errors.phone ? " error" : ""}`}
                placeholder="9876543210"
                value={form.phone}
                onChange={handleChange}
              />
              {errors.phone && <span className="form-error">{errors.phone}</span>}
            </div>

            <div className="form-divider" />

            <div style={{ marginBottom: 16 }}>
              <div className="form-group" style={{ marginBottom: 10 }}>
                <label className="form-label">Selected Date</label>
                <input
                  type="text"
                  className="form-input"
                  value={formatDate(date)}
                  readOnly
                  style={{ color: "var(--text-muted)", cursor: "not-allowed" }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Selected Time Slot</label>
                <input
                  type="text"
                  className="form-input"
                  value={timeSlot}
                  readOnly
                  style={{ color: "var(--text-muted)", cursor: "not-allowed" }}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 24 }}>
              <label className="form-label">Notes (optional)</label>
              <textarea
                name="notes"
                className="form-textarea"
                placeholder="Describe what you'd like to discuss in this session…"
                value={form.notes}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={submitting || slotTaken} style={{ width: "100%", justifyContent: "center", padding: "13px" }}>
              {submitting ? "Booking…" : "Confirm Booking"}
            </button>
          </form>
        </div>

        {/* Summary sidebar */}
        <div className="booking-summary-card">
          <div className="summary-title">Session Summary</div>

          {expert.image ? (
            <img
              src={expert.image}
              alt={expert.name}
              style={{ width: 56, height: 56, borderRadius: "50%", marginBottom: 12, border: "2px solid var(--border)" }}
            />
          ) : null}

          <div className="summary-row">
            <span className="summary-key">Expert</span>
            <span className="summary-val">{expert.name}</span>
          </div>
          <div className="summary-row">
            <span className="summary-key">Category</span>
            <span className="summary-val">
              <span className="badge badge-category">{expert.category}</span>
            </span>
          </div>
          <div className="summary-row">
            <span className="summary-key">Date</span>
            <span className="summary-val">{formatDate(date)}</span>
          </div>
          <div className="summary-row">
            <span className="summary-key">Time</span>
            <span className="summary-val">{timeSlot}</span>
          </div>

          <div className="summary-price-row">
            <span className="summary-price-label">Session Fee</span>
            <span className="summary-price-val">₹{expert.price?.toLocaleString("en-IN")}</span>
          </div>

          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 14, lineHeight: 1.5 }}>
            Payment is collected at the time of the session. Cancellations accepted up to 2 hours before the slot.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
