import { useState } from "react";
import api from "../api/axios";
import Loader from "../components/Loader";

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const statusBadgeClass = (status) => {
  if (status === "Confirmed") return "badge badge-confirmed";
  if (status === "Completed") return "badge badge-completed";
  return "badge badge-pending";
};

const MyBookings = () => {
  const [email, setEmail] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!emailInput.trim() || !isValidEmail(emailInput.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setLoading(true);
    setSearched(false);

    try {
      const { data } = await api.get("/bookings", {
        params: { email: emailInput.trim() },
      });
      setBookings(data.bookings);
      setEmail(emailInput.trim());
      setSearched(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch bookings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">My Bookings</h1>
        <p className="page-subtitle">Enter your email address to view all your booked sessions.</p>
      </div>

      <form onSubmit={handleSearch} className="email-search-bar">
        <input
          type="email"
          className={`form-input${error ? " error" : ""}`}
          placeholder="you@example.com"
          value={emailInput}
          onChange={(e) => {
            setEmailInput(e.target.value);
            if (error) setError("");
          }}
          style={{ flex: 1 }}
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Searching…" : "Find Bookings"}
        </button>
      </form>

      {error && (
        <div className="alert alert-error">
          <span>⚠</span>
          <span>{error}</span>
        </div>
      )}

      {loading && <Loader message="Fetching your bookings…" />}

      {!loading && searched && bookings.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <div className="empty-title">No bookings found</div>
          <p className="empty-desc">
            We couldn't find any bookings for <strong>{email}</strong>. Double-check the email or{" "}
            <a href="/" style={{ color: "var(--accent)" }}>book a session</a>.
          </p>
        </div>
      )}

      {!loading && searched && bookings.length > 0 && (
        <>
          <p className="results-info">
            {bookings.length} booking{bookings.length !== 1 ? "s" : ""} found for {email}
          </p>

          {bookings.map((booking) => (
            <div key={booking._id} className="booking-card">
              <div>
                <div className="booking-expert-name">
                  {booking.expert?.name || "Expert"}
                </div>
                <div className="booking-details">
                  <span className="badge badge-category">
                    {booking.expert?.category || "—"}
                  </span>
                  <span className="booking-detail-item">
                    📅 {formatDate(booking.date)}
                  </span>
                  <span className="booking-detail-item">
                    🕐 {booking.timeSlot}
                  </span>
                </div>
                {booking.notes && (
                  <p className="booking-notes">"{booking.notes}"</p>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                <span className={statusBadgeClass(booking.status)}>{booking.status}</span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  Booked {new Date(booking.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </span>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default MyBookings;
