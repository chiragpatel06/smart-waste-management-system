import "./Footer.css";

function Footer() {
  return (
    <footer className="footer" >
      <div className="footer-container">

        {/* BRAND */}
        <div className="footer-col">
          <h3>Smart Waste Management</h3>
          <p>
            A digital platform focused on improving waste reporting,
            monitoring, and management for cleaner and more sustainable
            communities.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/report">Report Waste</a></li>
            <li><a href="/login">Login</a></li>
            <li><a href="/about">About Us</a></li>
          </ul>
        </div>

        {/* SERVICES */}
        <div className="footer-col">
          <h4>Services</h4>
          <ul>
            <li>Waste Issue Reporting</li>
            <li>Collection Monitoring</li>
            <li>Administrative Dashboard</li>
            <li>Data Insights</li>
          </ul>
        </div>

        {/* CONTACT */}
        <div className="footer-col">
          <h4>Contact</h4>
          <p>Email: support@smartwaste.com</p>
          <p>Phone: +91 9XXXXXXXXX</p>
          <p>Location: India</p>
        </div>

      </div>

      {/* BOTTOM */}
      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Smart Waste Management System.
          All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
