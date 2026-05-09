// Formats "2026-05-10" → "Saturday, 10 May 2026"
const formatDate = (dateStr) => {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const SlotGroup = ({ dateEntry, onSlotClick, selectedSlot, selectedDate }) => {
  const isThisDateSelected = selectedDate === dateEntry.date;

  return (
    <div className="slot-group">
      <div className="slot-date-header">{formatDate(dateEntry.date)}</div>
      <div className="slot-grid">
        {dateEntry.slots.map((slot) => {
          const isBooked = slot.isBooked;
          const isSelected =
            isThisDateSelected && selectedSlot === slot.time;

          let className = "slot-btn";
          if (isBooked) className += " booked";
          else if (isSelected) className += " selected";

          return (
            <button
              key={slot.time}
              className={className}
              disabled={isBooked}
              onClick={() => !isBooked && onSlotClick(dateEntry.date, slot.time)}
              title={isBooked ? "Already booked" : slot.time}
            >
              {slot.time}
              {isBooked && " ✕"}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SlotGroup;
