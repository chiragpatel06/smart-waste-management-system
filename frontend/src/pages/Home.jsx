import "./Home.css";
import wasteImage from "../assets/p1.jpg";
function Home() {
  return (
    <div className="home">

      {/* HERO SECTION */}
      <section className="home-hero">
        <h1>Smart Waste Management System</h1>
        <p>
          A digital platform that enables citizens to report waste problems
          and allows authorities to manage waste collection efficiently
          through a transparent and organized process.
        </p>

        <div className="home-actions">
          <a href="/report" className="btn primary">Report Waste</a>
          <a href="/login" className="btn secondary">Login</a>
        </div>

      </section>
        {/* PROFESSIONAL SECTION */}
      <section className="professional container">
        <div className="professional-text">
          <h2>
            <span>Our</span> Professional Waste <br /> Management Services
          </h2>

          <p>
            We are a digital waste management platform driven by our
            commitment to sustainability, transparency, and efficient resource
            handling.
          </p>

          <p>
            Our system enables better coordination between citizens and
            administrators through reliable workflows, data-driven insights,
            and real-time status tracking.
          </p>

          <p>
            This platform supports cleaner communities by offering a cost-
            effective solution.
          </p>
        </div>

        <div className="professional-image">
          <img src={wasteImage} alt="Waste Management Process" />
        </div>
      </section>



    </div>
  );
}

export default Home;
