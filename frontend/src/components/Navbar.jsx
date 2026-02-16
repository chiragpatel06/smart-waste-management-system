import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        Smart Waste
      </div>

      <ul className="navbar-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li className="dropdown">
          <span className="dropdown-title">Services ▾</span>
          <ul className="dropdown-menu">
            <li><Link to="/report">Waste Reporting</Link></li>
            <li><Link to="/services/tracking">Live Tracking</Link></li>
            <li><Link to="/admin">Admin Dashboard</Link></li>

          </ul>
        </li>

        <li>
          <Link to="/contact">Contact</Link>
        </li>
        <li>
          <Link to="/report">Report Waste</Link>
        </li>
        <li>
          <Link to="/login" >Login</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
