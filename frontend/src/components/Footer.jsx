import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // ✅ Import Link
import "./Footer.css";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Recycle,
  Home,
  LogIn,
  FileText,
  Info,
  Truck
} from "lucide-react";

function Footer() {
  const [user, setUser] = useState(null);

  const handleScrollToTop = () => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
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

  return (
    <footer className="footer">
      <div className="footer-container">

        {/* BRAND */}
        <div className="footer-col">
          <Link to="/" className="brand-title" style={{ textDecoration: 'none' }} onClick={handleScrollToTop}>
            <Recycle size={22} className="brand-icon" />
            SwachhSetu
          </Link>

          <p>
            A digital platform focused on improving waste reporting,
            monitoring, and management for cleaner and sustainable communities.
          </p>

          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><Facebook size={18} /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><Instagram size={18} /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><Linkedin size={18} /></a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 4.01H5.078z" />
              </svg>
            </a>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li>
              <Home size={16} className="link-icon" />
              <Link to="/" onClick={handleScrollToTop}>Home</Link>
            </li>

            {!user && (
              <li>
                <LogIn size={16} className="link-icon" />
                <Link to="/login" onClick={handleScrollToTop}>Login</Link>
              </li>
            )}

            <li>
              <Phone size={16} className="link-icon" />
              <Link to="/contact" onClick={handleScrollToTop}>Contact Us</Link>
            </li>

            <li>
              <Info size={16} className="link-icon" />
              <Link to="/about" onClick={handleScrollToTop}>About Us</Link>
            </li>
          </ul>
        </div>

        {/* SERVICES */}
        <div className="footer-col">
          <h4>Services</h4>
          <ul className="footer-links">
            <li>
              <FileText size={16} className="link-icon" />
              <Link to="/report" onClick={handleScrollToTop}>Report Waste</Link>
            </li>
            <li>
              <Truck size={16} className="link-icon" />
              <Link to="/services/tracking" onClick={handleScrollToTop}>Live Tracking</Link>
            </li>
          </ul>
        </div>

        {/* CONTACT */}
        <div className="footer-col">
          <h4>Contact</h4>

          <div className="contact-item">
            <Mail size={16} className="contact-icon" />
            <span>support@swachhsetu.com</span>
          </div>

          <div className="contact-item">
            <Phone size={16} className="contact-icon" />
            <span>+91 9XXXXXXXXX</span>
          </div>

          <div className="contact-item">
            <MapPin size={16} className="contact-icon" />
            <span>India</span>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} SwachhSetu. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;