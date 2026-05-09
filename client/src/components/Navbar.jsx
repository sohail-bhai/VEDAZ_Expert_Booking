import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-logo">
          vedaz<span>.</span>
        </NavLink>
        <div className="navbar-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
          >
            Experts
          </NavLink>
          <NavLink
            to="/my-bookings"
            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
          >
            My Bookings
          </NavLink>
          <NavLink
            to="/admin-bookings"
            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
          >
            Admin Bookings
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
