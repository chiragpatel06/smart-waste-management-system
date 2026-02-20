import "./About.css";
import aboutImg from "../assets/about-illustration.png";
import dashboardImg from "../assets/dashboard.png";

function About() {
  return (
    <div className="about-wrapper">

      {/* HERO SECTION */}
      <section className="about-hero">
        <div className="hero-overlay">
          <h1>Smart Waste Management System</h1>
          <p>
            A digital platform designed to improve waste reporting, monitoring,
            and collection through transparency and efficiency.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="about-section">
        <div className="about-board">
          <div className="about-row">
          <div className="about-text">
            <h2>About Us</h2>
            <p>
              The Smart Waste Management System is a modern web-based solution
              that connects citizens and waste management authorities on a single platform.
              It simplifies waste issue reporting and ensures timely action through
              real-time tracking and updates.
            </p>

            <p>
              This project emphasizes a streamlined, software-driven approach that enables
              efficient waste reporting, monitoring, and coordination without operational
              complexity.
            </p>
          </div>

          <div className="about-image">
            <img src={aboutImg} alt="About Illustration" />
          </div>
        </div>

        {/* DASHBOARD SECTION */}
        <div className="about-row ">
          <div className="about-image">
            <img src={dashboardImg} alt="Dashboard" />
          </div>

          <div className="about-text">
            <h3>Data-Driven Insights</h3>
            <p>
              Our platform provides comprehensive analytics and real-time dashboards
              that help administrators monitor waste collection efficiency,
              track complaint resolution, and make informed decisions.
            </p>
          </div>
        </div>

        {/* FEATURES */}
        <div className="features">
          <div className="feature-card">
            <h4>🧑‍🤝‍🧑 Citizen Reporting</h4>
            <p>Report uncollected garbage or illegal dumping easily.</p>
          </div>

          <div className="feature-card">
            <h4>📊 Real-Time Tracking</h4>
            <p>Track complaint status and updates instantly.</p>
          </div>

          <div className="feature-card">
            <h4>🌱 Clean & Sustainable</h4>
            <p>Promotes cleaner surroundings and responsible disposal.</p>
          </div>
        </div>

        </div>
        {/* TEXT + IMAGE */}
        

      </section>
    </div>
  );
}

export default About;
