import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useSocket } from "../context/SocketContext";
import SlotGroup from "../components/SlotGroup";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ color: "var(--accent)" }}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const ExpertDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { socket } = useSocket();

  const [expert, setExpert] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");

  useEffect(() => {
    const fetchExpert = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get(`/experts/${id}`);
        setExpert(data);
        setAvailability(data.availability || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load expert details.");
      } finally {
        setLoading(false);
      }
    };
    fetchExpert();
  }, [id]);

  // Listen for real-time slot-booked events and mark that slot as booked immediately
  useEffect(() => {
    if (!socket) return;

    const handleSlotBooked = ({ expertId, date, timeSlot }) => {
      if (expertId !== id) return;

      setAvailability((prev) =>
        prev.map((dayObj) => {
          if (dayObj.date !== date) return dayObj;
          return {
            ...dayObj,
            slots: dayObj.slots.map((slot) =>
              slot.time === timeSlot ? { ...slot, isBooked: true } : slot
            ),
          };
        })
      );

      // If the user had this slot selected, clear it
      if (selectedDate === date && selectedSlot === timeSlot) {
        setSelectedDate("");
        setSelectedSlot("");
      }
    };

    socket.on("slot-booked", handleSlotBooked);
    return () => socket.off("slot-booked", handleSlotBooked);
  }, [socket, id, selectedDate, selectedSlot]);

  const handleSlotClick = (date, time) => {
    setSelectedDate(date);
    setSelectedSlot(time);
  };

  const handleBookClick = () => {
    if (!selectedDate || !selectedSlot) return;
    navigate(
      `/booking/${id}?date=${selectedDate}&slot=${encodeURIComponent(selectedSlot)}`,
      { state: { expert, date: selectedDate, timeSlot: selectedSlot } }
    );
  };

  if (loading) return <div className="page-container"><Loader message="Loading expert profile…" /></div>;
  if (error) return <div className="page-container"><ErrorMessage message={error} /></div>;
  if (!expert) return null;

  return (
    <div className="page-container">
      <Link to="/" className="back-link">
        ← Back to experts
      </Link>

      {/* Hero card */}
      <div className="detail-hero">
        {expert.image ? (
          <img src={expert.image} alt={expert.name} className="detail-avatar" />
        ) : (
          <div
            className="detail-avatar"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: "1.5rem",
              color: "var(--accent)",
              background: "var(--bg-elevated)",
            }}
          >
            {expert.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
          </div>
        )}
        <div className="detail-info">
          <h1 className="detail-name">{expert.name}</h1>
          <div className="detail-badges">
            <span className="badge badge-category">{expert.category}</span>
            <span className="badge badge-green">{expert.experience} yrs experience</span>
            <span className="live-badge">
              <span className="live-dot" />
              Live slots
            </span>
          </div>
          <p className="detail-bio">{expert.bio}</p>
          <div className="detail-stats">
            <div className="stat-item">
              <span className="stat-label">Rating</span>
              <span className="stat-value accent" style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <StarIcon /> {expert.rating?.toFixed(1)}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Session Fee</span>
              <span className="stat-value accent">₹{expert.price?.toLocaleString("en-IN")}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Category</span>
              <span className="stat-value">{expert.category}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Slot selection */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <h2 className="slots-section-title" style={{ marginBottom: 0 }}>Available Slots</h2>
        {selectedSlot && (
          <button className="btn btn-primary" onClick={handleBookClick}>
            Book {selectedSlot} on {selectedDate} →
          </button>
        )}
      </div>

      {availability.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <div className="empty-title">No slots available</div>
          <p className="empty-desc">This expert has no upcoming availability.</p>
        </div>
      ) : (
        availability.map((dayEntry) => (
          <SlotGroup
            key={dayEntry.date}
            dateEntry={dayEntry}
            onSlotClick={handleSlotClick}
            selectedSlot={selectedSlot}
            selectedDate={selectedDate}
          />
        ))
      )}

      {selectedSlot && (
        <div style={{ marginTop: 28, display: "flex", justifyContent: "flex-end" }}>
          <button className="btn btn-primary" onClick={handleBookClick}>
            Continue to Booking →
          </button>
        </div>
      )}
    </div>
  );
};

export default ExpertDetail;
