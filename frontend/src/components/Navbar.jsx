import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Navbar.css";
// Added specific icons for mobile accessibility
import {
  Globe, ChevronDown, Recycle, LogIn, LogOut,
  Menu as MenuIcon, X, Home, Info, Phone, User as UserIcon,
  ArrowLeft, Truck
} from "lucide-react";
function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    setIsMenuOpen(false);
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Prevent scrolling when menu is open
    document.body.style.overflow = !isMenuOpen ? "hidden" : "unset";
  };

  const firstName = user?.name?.split(" ")[0];

  return (
    <nav className="navbar-main">
      {/* LEFT: Logo Section */}
      <div className="navbar-left">
        <Link to="/" className="navbar-logo-container">
          <Recycle size={28} className="navbar-logo-icon" />
          <span className="navbar-logo-text">SwachhSetu</span>
        </Link>
      </div>
    
      {/* CENTER: Main Navigation (Desktop) */}
     
      <div className="navbar-center">
        <ul className="navbar-nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li className="navbar-dropdown">
            <span className="navbar-dropdown-title">
              Services <ChevronDown size={12} />
            </span>
            <ul className="navbar-dropdown-menu">
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
        {/* Language Toggle (Hidden on small mobile) */}
        <button className="navbar-lang-pill navbar-desktop-only">
          <Globe size={18} />
          <span>हिन्दी</span>
        </button>

        {/* Auth Section */}
        {user ? (
          <div className="navbar-user-profile navbar-desktop-only">
            <div className="navbar-user-badge">
              <div className="navbar-avatar">
                {firstName?.charAt(0).toUpperCase()}
              </div>
              <span className="navbar-user-name">Hi, {firstName}</span>
            </div>
            <button onClick={handleLogout} className="navbar-logout-icon">
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <Link to="/login" className="navbar-auth-btn navbar-login-btn navbar-desktop-only">
            Login
          </Link>
        )}

        {/* Hamburger Menu Icon */}
        {/* FIXED: Only show Hamburger icon here */}
        <button className="navbar-mobile-toggle" onClick={toggleMenu}>
          {isMenuOpen ? <X size={30} /> : <MenuIcon size={30} />}
        </button>
      </div>

      {/* MOBILE OVERLAY */}
      {isMenuOpen && <div className="navbar-overlay" onClick={toggleMenu}></div>}

      {/* MOBILE SIDE MENU */}
      <div className={`navbar-mobile-drawer ${isMenuOpen ? "navbar-open" : ""}`}>
        <div className="navbar-mobile-header">
          <div className="navbar-logo-container">
            <Recycle size={24} className="navbar-logo-icon" />
            <span className="navbar-logo-text">SwachhSetu</span>
          </div>

        </div>

        <div className="navbar-mobile-content">

          <Link
            to="/"
            className={`navbar-mobile-link ${location?.pathname === "/" ? "navbar-highlight" : ""
              }`}
            onClick={toggleMenu}
          >
            <Home size={24} />
            <span>Home</span>
          </Link>

          <Link
            to="/report"
            className={`navbar-mobile-link ${location.pathname.startsWith("/report") ? "navbar-highlight" : ""
              }`}
            onClick={toggleMenu}
          >
            <Recycle size={24} />
            <span>Report Waste</span>
          </Link>

          <Link
            to="/services/tracking"
            className={`navbar-mobile-link ${location.pathname.startsWith("/services/tracking")
              ? "navbar-highlight"
              : ""
              }`}
            onClick={toggleMenu}
          >
            <Truck size={24} />
            <span>Live Tracking</span>
          </Link>

          <Link
            to="/about"
            className={`navbar-mobile-link ${location.pathname === "/about" ? "navbar-highlight" : ""
              }`}
            onClick={toggleMenu}
          >
            <Info size={24} />
            <span>About</span>
          </Link>

          <Link
            to="/contact"
            className={`navbar-mobile-link ${location.pathname === "/contact" ? "navbar-highlight" : ""
              }`}
            onClick={toggleMenu}
          >
            <Phone size={24} />
            <span>Contact</span>
          </Link>

          <div className="navbar-mobile-divider"></div>

          <button className="navbar-mobile-link navbar-lang-switch">
            <Globe size={24} /> <span>Change to हिन्दी</span>
          </button>

          {user ? (
            <div className="navbar-mobile-user-section">
              <div className="navbar-mobile-user-card">
                <div className="navbar-avatar">{firstName?.charAt(0).toUpperCase()}</div>
                <div className="navbar-mobile-user-info">
                  <p>Logged in as</p>
                  <strong>{user.name}</strong>
                </div>
              </div>
              <button onClick={handleLogout} className="navbar-mobile-link navbar-logout-mobile">
                <LogOut size={24} /> <span>Logout / बाहर निकलें</span>
              </button>
            </div>
          ) : (
            <Link to="/login" className="navbar-mobile-link navbar-login-mobile" onClick={toggleMenu}>
              <LogIn size={24} /> <span>Login / लॉगिन</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;