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
  const [mobileLangOpen, setMobileLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  const isLoggedIn = !!user;

  useEffect(() => {
    const cookie = document.cookie;
    if (cookie.includes("googtrans=/en/hi")) setCurrentLang('hi');
    else if (cookie.includes("googtrans=/en/gu")) setCurrentLang('gu');
    else setCurrentLang('en');
  }, []);

  const changeLanguage = (langCode) => {
    document.cookie = `googtrans=/en/${langCode}; path=/`;
    document.cookie = `googtrans=/en/${langCode}; domain=` + window.location.hostname + `; path=/`;
    window.location.reload();
  };

  const cycleLanguage = () => {
    if (currentLang === 'en') changeLanguage('hi');
    else if (currentLang === 'hi') changeLanguage('gu');
    else changeLanguage('en');
  };

  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    checkUser();

    window.addEventListener("userUpdated", checkUser);
    window.addEventListener("storage", checkUser);

    return () => {
      window.removeEventListener("userUpdated", checkUser);
      window.removeEventListener("storage", checkUser);
    };
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
  const renderAvatar = () => (
    <div className="navbar-avatar">
      {user?.profileImage ? (
        <img src={user.profileImage} alt="Profile" className="navbar-avatar-img" />
      ) : (
        firstName?.charAt(0).toUpperCase()
      )}
    </div>
  );

  return (
    <nav className="navbar-main notranslate">
      {/* LEFT: Logo Section */}
      <div className="navbar-left">
        <Link to="/" className="navbar-logo-container">
          <Recycle size={32} className="navbar-logo-icon" />
          <span className="navbar-logo-text">SwachhSetu</span>
        </Link>
      </div>

      {/* CENTER: Main Navigation (Desktop) */}

      <div className="navbar-center">
        <ul className="navbar-nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          {isLoggedIn && (<li><Link to="/services/tracking">Live Tracking</Link></li>)}

          <li><Link to="/report">Report Waste</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </div>

      {/* RIGHT: Stats, Lang, and Auth */}
      <div className="navbar-right">
        {/* Language Toggle (Hidden on small mobile) */}
        <div className="navbar-dropdown navbar-desktop-only">
          <button className="navbar-lang-pill">
            <Globe size={18} />
            <span>{currentLang === 'hi' ? 'Hin' : currentLang === 'gu' ? 'Guj' : 'Eng'}</span>
            <ChevronDown size={16} />
          </button>
          
          <ul className="navbar-dropdown-menu" style={{ minWidth: '130px', padding: '5px 0' }}>
            <li><a style={{ cursor: 'pointer' }} onClick={() => changeLanguage('en')}>English</a></li>
            <li><a style={{ cursor: 'pointer' }} onClick={() => changeLanguage('hi')}>हिन्दी</a></li>
            <li><a style={{ cursor: 'pointer' }} onClick={() => changeLanguage('gu')}>ગુજરાતી</a></li>
          </ul>
        </div>

        {/* Auth Section */}
        {user ? (
          <div className="navbar-user-profile navbar-desktop-only">
            <div
              className="navbar-user-badge"
              onClick={() => navigate("/profile")}
              style={{ cursor: "pointer" }}
            >
              {renderAvatar()}
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

        {!isMenuOpen && (
          <button className="navbar-mobile-toggle" onClick={toggleMenu}>
            <MenuIcon size={30} />
          </button>
        )}
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
          <button className="navbar-close-btn" onClick={toggleMenu}>
            <X size={30} />
          </button>

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

          {isLoggedIn && (
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
          )}

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

          <div className="navbar-mobile-lang-container">
            <button 
              className="navbar-mobile-link navbar-lang-switch" 
              onClick={() => setMobileLangOpen(!mobileLangOpen)}
              style={{ justifyContent: 'space-between', width: '100%', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Globe size={24} style={{ color: '#2563eb' }} /> 
                <span style={{ fontWeight: 600, fontSize: '1.1rem', color: '#1e293b' }}>
                  {currentLang === 'en' ? 'English' : currentLang === 'hi' ? 'हिन्दी' : 'ગુજરાતી'}
                </span>
              </div>
              <ChevronDown size={20} style={{ color: '#64748b', transform: mobileLangOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
            </button>
            
            {mobileLangOpen && (
              <div style={{ display: 'flex', flexDirection: 'column', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', marginTop: '8px', overflow: 'hidden' }}>
                <button onClick={() => changeLanguage('en')} style={{ padding: '14px 20px', background: currentLang === 'en' ? '#f8fafc' : 'white', border: 'none', borderBottom: '1px solid #f1f5f9', textAlign: 'left', fontSize: '1rem', color: currentLang === 'en' ? '#2563eb' : '#1e293b', fontWeight: currentLang === 'en' ? 600 : 500, cursor: 'pointer' }}>English</button>
                <button onClick={() => changeLanguage('hi')} style={{ padding: '14px 20px', background: currentLang === 'hi' ? '#f8fafc' : 'white', border: 'none', borderBottom: '1px solid #f1f5f9', textAlign: 'left', fontSize: '1rem', color: currentLang === 'hi' ? '#2563eb' : '#1e293b', fontWeight: currentLang === 'hi' ? 600 : 500, cursor: 'pointer' }}>हिन्दी</button>
                <button onClick={() => changeLanguage('gu')} style={{ padding: '14px 20px', background: currentLang === 'gu' ? '#f8fafc' : 'white', border: 'none', textAlign: 'left', fontSize: '1rem', color: currentLang === 'gu' ? '#2563eb' : '#1e293b', fontWeight: currentLang === 'gu' ? 600 : 500, cursor: 'pointer' }}>ગુજરાતી</button>
              </div>
            )}
          </div>

          {user ? (
            <div className="navbar-mobile-user-section">

              {/* Profile Link */}
              <Link
                to="/profile"
                className="navbar-mobile-link"
                onClick={toggleMenu}
              >
                <UserIcon size={24} />
                <span>Profile</span>
              </Link>

              {/* User Card */}
              <div
                className="navbar-mobile-user-card"
                onClick={() => {
                  navigate("/profile");
                  toggleMenu();
                }}
                style={{ cursor: "pointer" }}
              >
                {renderAvatar()}
                <div className="navbar-mobile-user-info">
                  <p>Logged in as</p>
                  <strong>{user.name}</strong>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="navbar-mobile-link navbar-logout-mobile"
              >
                <LogOut size={24} />
                <span>Logout</span>
              </button>

            </div>
          ) : (
            <Link to="/login" className="navbar-mobile-link navbar-login-mobile" onClick={toggleMenu}>
              <LogIn size={24} /> <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;