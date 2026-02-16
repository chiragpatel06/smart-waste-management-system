import "./Services.css";

function Services() {
  return (
    <div className="services-page">
      <h1>Our Services</h1>
      <p>
        The Smart Waste Management System provides digital services
        to improve waste reporting, collection, and monitoring.
      </p>

      <div className="services-grid">
        <div className="service-card">
          <h3>Online Waste Reporting</h3>
          <p>Citizens can report waste issues with location details.</p>
        </div>

        <div className="service-card">
          <h3>Waste Collection Scheduling</h3>
          <p>Optimized scheduling for timely waste pickup.</p>
        </div>

        <div className="service-card">
          <h3>Real-Time Tracking</h3>
          <p>Track waste collection status in real time.</p>
        </div>

        <div className="service-card">
          <h3>Admin Dashboard</h3>
          <p>Monitor reports, users, and system performance.</p>
        </div>
      </div>
    </div>
  );
}

export default Services;
