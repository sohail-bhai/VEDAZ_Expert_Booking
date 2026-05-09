import { Link } from "react-router-dom";

const StarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const ExpertCard = ({ expert }) => {
  const initials = expert.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  return (
    <Link to={`/experts/${expert._id}`} className="card expert-card">
      <div className="expert-card-top">
        {expert.image ? (
          <img src={expert.image} alt={expert.name} className="expert-avatar" />
        ) : (
          <div
            className="expert-avatar"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: "1.1rem",
              color: "var(--accent)",
            }}
          >
            {initials}
          </div>
        )}
        <div style={{ flex: 1 }}>
          <div className="expert-card-name">{expert.name}</div>
          <div className="expert-card-meta">
            <span className="badge badge-category">{expert.category}</span>
            <span className="expert-rating">
              <StarIcon />
              {expert.rating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      <p className="expert-bio">{expert.bio}</p>

      <div className="expert-card-footer">
        <div className="expert-price">
          ₹{expert.price.toLocaleString("en-IN")}
          <span> / session</span>
        </div>
        <span className="badge badge-green">{expert.experience} yrs exp</span>
      </div>
    </Link>
  );
};

export default ExpertCard;
