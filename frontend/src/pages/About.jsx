import "./About.css";

function About() {
  return (
    <div className="about-wrapper">
      
      {/* HERO SECTION */}
      <section className="about-hero">
        <h1>Smart Waste Management System</h1>
        <p>
          A digital platform designed to improve waste reporting, monitoring,
          and collection through transparency and efficiency.
        </p>
      </section>

      {/* CONTENT SECTION */}
      <section className="about-content">
        <div className="about-text">
          <h2>About US</h2>
          <p>
            The Smart Waste Management System is a modern web-based solution that
            connects citizens and waste management authorities on a single
            platform. It simplifies waste issue reporting and ensures timely
            action through real-time tracking and updates.
          </p>

          <p>
            This project emphasizes a streamlined, software-driven approach that enables
            efficient waste reporting, monitoring, and coordination without operational
            complexity, making it practical, scalable, and easy to adopt for local
            communities and educational institutions.

          </p>
        </div>

        {/* FEATURES */}
        <div className="features">
          <div className="feature-card">
            <h3>🧑‍🤝‍🧑 Citizen Reporting</h3>
            <p>
              Report uncollected garbage, overflowing bins, or illegal dumping
              directly from the platform.
            </p>
          </div>

          <div className="feature-card">
            <h3>📊 Real-Time Tracking</h3>
            <p>
              Track complaint status and updates in real time for full
              transparency.
            </p>
          </div>

        

          <div className="feature-card">
            <h3>🌱 Clean & Sustainable</h3>
            <p>
              Promotes cleaner surroundings and responsible waste disposal
              practices.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}

export default About;
