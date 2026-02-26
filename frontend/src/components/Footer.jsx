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
  Info
} from "lucide-react";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* BRAND */}
        <div className="footer-col">
          <h3 className="brand-title">
            <Recycle size={22} className="brand-icon" />
            SwachhSetu
          </h3>

          <p>
            A digital platform focused on improving waste reporting,
            monitoring, and management for cleaner and sustainable communities.
          </p>

          <div className="social-icons">
            <a href="#"><Facebook size={18} /></a>
            <a href="#"><Instagram size={18} /></a>
            <a href="#"><Linkedin size={18} /></a>
            <a href="#"><Twitter size={18} /></a>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li>
              <Home size={16} className="link-icon" />
              <a href="/">Home</a>
            </li>

            <li>
              <FileText size={16} className="link-icon" />
              <a href="/report">Report Waste</a>
            </li>

            <li>
              <LogIn size={16} className="link-icon" />
              <a href="/login">Login</a>
            </li>

            <li>
              <Info size={16} className="link-icon" />
              <a href="/about">About Us</a>
            </li>
          </ul>
        </div>

        {/* SERVICES */}
        <div className="footer-col">
          <h4>Services</h4>
          <ul className="footer-links">
            <li>Waste Issue Reporting</li>
            <li>Collection Monitoring</li>
            <li>Administrative Dashboard</li>
            <li>Data Insights</li>
          </ul>
        </div>

        {/* CONTACT */}
        <div className="footer-col">
          <h4>Contact</h4>

          <div className="contact-item">
            <Mail size={16} className="contact-icon" />
            <span>support@smartwaste.com</span>
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