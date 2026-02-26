import React, { useState } from "react";
import "./Home.css";
import homeImage from "../assets/home.png";
import {
  Camera,
  MapPin,
  CheckCircle,
  Globe,
  LogIn,
  Trash2,
  Shield,
  Zap,
  Info
} from "lucide-react";

function Home() {
  const [language, setLanguage] = useState("English");

  const content = {
    English: {
      title: "SwachhSetu",
      subtitle: "See waste? Report it. We clean it.",
      mainBtn: "Report Waste Now",
      loginBtn: "Login",
      stepsTitle: "3 Simple Steps",
      step1: "Take Photo",
      step2: "Send Location",
      step3: "Area Cleaned",
      stats: "1,200+ Areas Cleaned",
    },
    हिन्दी: {
      title: "स्वच्छसेतु",
      subtitle: "कचरा देखें? फोटो भेजें। हम सफाई करेंगे।",
      mainBtn: "कचरे की सूचना दें",
      loginBtn: "लॉगिन",
      stepsTitle: "3 आसान तरीके",
      step1: "फोटो लें",
      step2: "जगह भेजें",
      step3: "सफाई सफल",
      stats: "1,200+ जगहें साफ की गईं",
    }
  };

  const t = content[language];

  return (
    <div className="home">

      {/* HERO */}
      <section className="hero">
        <div className="overlay"></div>

        <div className="hero-box">
          <div className="logo-circle">
            <Trash2 size={34} color="white" />
          </div>

          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>

          <div className="cta-area">
            <a href="/report" className="action-btn report-btn">
              <Camera size={22} />
              {t.mainBtn}
            </a>

            <a href="/login" className="action-btn loginyo-btn">
              <LogIn size={18} />
              {t.loginBtn}
            </a>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-it-works">
        <h2>{t.stepsTitle}</h2>

        <div className="flow-container">
          <div className="flow-card">
            <div className="flow-icon bg-blue">
              <Camera size={30} />
            </div>
            <h3>{t.step1}</h3>
          </div>

          <div className="flow-arrow">→</div>

          <div className="flow-card">
            <div className="flow-icon bg-blue">
              <MapPin size={30} />
            </div>
            <h3>{t.step2}</h3>
          </div>

          <div className="flow-arrow">→</div>

          <div className="flow-card">
            <div className="flow-icon bg-green">
              <CheckCircle size={30} />
            </div>
            <h3>{t.step3}</h3>
          </div>
        </div>
      </section>


      {/* WHY TRUST US */}
      <section className="info-section">
        <div className="info-content">
          <div className="info-text">
            <h2 className="section-heading">
              {language === "English" ? "Why Trust Us?" : "हम पर भरोसा क्यों?"}
            </h2>

            <div className="feature">
              <div className="icon-box">
                <Shield size={28} className="f-icon" />
              </div>
              <div className="feature-details">
                <h4>Secure Reporting</h4>
                <p>Your data stays safe and private.</p>
              </div>
            </div>

            <div className="feature">
              <div className="icon-box">
                <Zap size={28} className="f-icon" />
              </div>
              <div className="feature-details">
                <h4>Fast Response</h4>
                <p>Cleanup starts within 24 hours.</p>
              </div>
            </div>

            <div className="feature">
              <div className="icon-box">
                <Info size={28} className="f-icon" />
              </div>
              <div className="feature-details">
                <h4>Government Verified</h4>
                <p>Direct link to municipal authorities.</p>
              </div>
            </div>
          </div>

          <div className="info-image">
            <img src={homeImage} alt="Clean City Street" />
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;