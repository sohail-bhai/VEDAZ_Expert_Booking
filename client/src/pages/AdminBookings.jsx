import { useState } from "react";
import api from "../api/axios";
import Loader from "../components/Loader";

const STATUSES = ["Pending", "Confirmed", "Completed"];

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const AdminBookings = () => {
  const [emailInput, setEmailInput] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searched, setSearched] = useState(false);

  const fetchBookingsByEmail = async (email) => {
    const { data } = await api.get("/bookings", { params: { email } });
    return data.bookings || [];
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const trimmedEmail = emailInput.trim().toLowerCase();

    if (!trimmedEmail || !isValidEmail(trimmedEmail)) {
      setError("Please enter a valid email address.");
      setSuccess("");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const results = await fetchBookingsByEmail(trimmedEmail);
      setBookings(results);
      setCurrentEmail(trimmedEmail);
      setSearched(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch bookings.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, nextStatus) => {
    setUpdatingId(bookingId);
    setError("");
    setSuccess("");

    try {
      await api.patch(`/bookings/${bookingId}/status`, { status: nextStatus });

      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId ? { ...booking, status: nextStatus } : booking
        )
      );

      setSuccess("Booking status updated successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status.");
    } finally {
      setUpdatingId("");
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Admin Bookings</h1>
        <p className="page-subtitle">
          Testing utility to fetch bookings by email and update booking status.
        </p>
      </div>

      <form onSubmit={handleSearch} className="email-search-bar">
        <input
          type="email"
          className={`form-input${error ? " error" : ""}`}
          placeholder="Enter customer email"
          value={emailInput}
          onChange={(e) => {
            setEmailInput(e.target.value);
            if (error) setError("");
          }}
          style={{ flex: 1 }}
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Loading..." : "Load Bookings"}
        </button>
      </form>

      {error && (
        <div className="alert alert-error">
          <span>⚠</span>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="alert" style={{ background: "var(--green-dim)", borderColor: "rgba(76, 175, 125, 0.35)", color: "var(--green)" }}>
          <span>✓</span>
          <span>{success}</span>
        </div>
      )}

      {loading && <Loader message="Fetching bookings..." />}

      {!loading && searched && bookings.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <div className="empty-title">No bookings found</div>
          <p className="empty-desc">No bookings found for {currentEmail}.</p>
        </div>
      )}

      {!loading && bookings.length > 0 && (
        <>
          <p className="results-info">
            {bookings.length} booking{bookings.length !== 1 ? "s" : ""} for {currentEmail}
          </p>

          {bookings.map((booking) => (
            <div key={booking._id} className="booking-card" style={{ alignItems: "center" }}>
              <div>
                <div className="booking-expert-name">{booking.expert?.name || "Expert"}</div>
                <div className="booking-details">
                  <span className="badge badge-category">{booking.expert?.category || "-"}</span>
                  <span className="booking-detail-item">📅 {formatDate(booking.date)}</span>
                  <span className="booking-detail-item">🕐 {booking.timeSlot}</span>
                </div>
              </div>

              <div className="form-group" style={{ minWidth: 170 }}>
                <label className="form-label" style={{ marginBottom: 4 }}>Status</label>
                <select
                  className="form-select"
                  value={booking.status}
                  disabled={updatingId === booking._id}
                  onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default AdminBookings;
