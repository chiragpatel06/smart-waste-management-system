import {
  Camera,
  Send,
  CheckCircle,
  ShieldCheck,
  BarChart3,
  Users
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./About.css";
import aboutImg from "../assets/about-illustration.png";
import dashboardImg from "../assets/dashboard.png";

function About() {
  const navigate = useNavigate();
  return (
    <div className="about-wrapper">
      {/* 1. HERO SECTION: Big & Clear Purpose */}
      <section className="about-hero">
        <div className="hero-content">
          <div className="logo-badge">SwachhSetu</div>
          <h1>Clean City, Healthy Life</h1>
          <p>We help you report waste and help the government clean it up faster.</p>
        </div>
      </section>

      {/* 2. HOW IT WORKS: Essential for uneducated users (Visual Process) */}
      <section className="how-it-works">
        <h2 className="section-title">How to use SwachhSetu?</h2>
        <div className="step-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <div className="step-icon-box"><Camera size={40} /></div>
            <h3>Take a Photo</h3>
            <p>Click a picture of the garbage you see.</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <div className="step-icon-box"><Send size={40} /></div>
            <h3>Send Report</h3>
            <p>Share the location and photo with us.</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <div className="step-icon-box"><CheckCircle size={40} /></div>
            <h3>Get it Cleaned</h3>
            <p>The waste team will come and clean it.</p>
          </div>
        </div>
      </section>

      {/* 3. MAIN CONTENT: Balanced for both groups */}
      <section className="about-main-content">
        <div className="about-row">
          <div className="about-image-side">
            <img src={aboutImg} alt="Helping hands" className="float-img" />
          </div>
          <div className="about-text-side">
            <div className="label">Our Mission</div>
            <h2>Connecting Citizens & Authorities</h2>
            <p>
              SwachhSetu is more than just a website. It is a bridge. We believe that
              <strong> transparency </strong> leads to action. By giving every citizen a voice,
              we make our city cleaner together.
            </p>
            <ul className="simple-list">
              <li><ShieldCheck size={18} /> Verified by Local Authorities</li>
              <li><Users size={18} /> Community Driven Project</li>
            </ul>
          </div>
        </div>

        {/* 4. DATA SECTION: For the Educated/Analytical User */}
        <div className="about-row reverse">
          <div className="about-image-side">
            <img src={dashboardImg} alt="Data Dashboard" className="shadow-img" />
          </div>
          <div className="about-text-side">
            <div className="label">For Administrators</div>
            <h3>Smart Monitoring & Data</h3>
            <p>
              For officials, we provide a <strong>Data Dashboard</strong>. This helps
              the government see which areas have the most waste and manage trucks
              efficiently.
            </p>
            <div className="mini-stats">
              <div className="stat">
                <BarChart3 size={24} />
                <span>Live Analytics</span>
              </div>
              <div className="stat">
                <CheckCircle size={24} />
                <span>99% Resolution</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="about-footer-cta">
        <h2>Ready to make a difference?</h2>
        <button
          className="cta-button"
          onClick={() => navigate("/report")}
        >
          Report Waste Now
        </button>
      </section>
    </div>
  );
}

export default About;