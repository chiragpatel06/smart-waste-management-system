import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Navbar.css";
// Icons to match the image
import { Globe, ChevronDown, Recycle, LogIn, LogOut } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };
    checkUser();
    window.addEventListener("storage", checkUser);
    return () => window.removeEventListener("storage", checkUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const firstName = user?.name?.split(" ")[0];

  return (
    <nav className="navbar">
      {/* LEFT: Logo Section */}
      <div className="navbar-left">
        <Link to="/" className="logo-container">
          <Recycle size={28} className="logo-icon" />
          <span className="logo-text">SwachhSetu</span>
        </Link>
      </div>

      {/* CENTER: Main Navigation */}
      <div className="navbar-center">
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li className="dropdown">
            <span className="dropdown-title">
              Services <ChevronDown size={12} />
            </span>
            <ul className="dropdown-menu">
              <li><Link to="/report">Waste Reporting</Link></li>
              <li><Link to="/services/tracking">Live Tracking</Link></li>
            </ul>
          </li>
          
          <li><Link to="/report">Report Waste</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </div>

      {/* RIGHT: Stats, Lang, and Auth */}
      <div className="navbar-right">

        {/* Language Toggle */}
        <button className="lang-pill">
          <Globe size={18} />
          <span>हिन्दी</span>
        </button>

        {/* Auth Section */}
        {user ? (
          <div className="user-profile">
            <span className="user-name">Hi, {firstName}</span>
            <button onClick={handleLogout} className="auth-btn login-btn">
               <LogOut size={18} />
            </button>
          </div>
        ) : (
          <Link to="/login" className="auth-btn login-btn">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;