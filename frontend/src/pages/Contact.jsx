import { useState } from "react";
import "./Contact.css";
import { MapPin, Mail, Phone, Send, MessageCircle, PhoneCall } from "lucide-react";

function Contact() {
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSending(true);
    setTimeout(() => {
      alert("✅ Message Sent Successfully!");
      setIsSending(false);
    }, 2000);
  };

  return (
    <div className="contact-page">
      <div className="contact-wrapper">
        
        {/* LEFT SIDE: DIRECT HELP */}
        <div className="direct-contact-section">
          <h1>Need Help?</h1>
          <p>Choose how you want to talk to us. We are here to help!</p>

          <div className="action-cards">
            {/* Call Card - Easiest for uneducated users */}
            <a href="tel:+919000000000" className="contact-card call">
              <div className="icon-circle">
                <PhoneCall size={28} />
              </div>
              <div className="card-text">
                <span>Call Us Directly</span>
                <strong>+91 90000 00000</strong>
              </div>
            </a>

            {/* WhatsApp Card - High usage in India */}
            <a href="https://wa.me/919000000000" className="contact-card whatsapp">
              <div className="icon-circle">
                <MessageCircle size={28} />
              </div>
              <div className="card-text">
                <span>Chat on WhatsApp</span>
                <strong>Message our Team</strong>
              </div>
            </a>
          </div>

          <div className="other-info">
            <div className="info-item">
              <MapPin size={20} className="blue-icon" />
              <span>Smart City Office, New Delhi, India</span>
            </div>
            <div className="info-item">
              <Mail size={20} className="blue-icon" />
              <span>support@swachhsetu.com</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: MESSAGE FORM */}
        <div className="message-form-section">
          <h2>Send a Message</h2>
          <p>Fill in the details below and we will email you back.</p>

          <form onSubmit={handleSubmit}>
            <div className="input-field">
              <label>Full Name</label>
              <div className="input-wrapper">
                <input type="text" placeholder="Enter your name" required />
              </div>
            </div>

            <div className="input-field">
              <label>Email Address</label>
              <div className="input-wrapper">
                <input type="email" placeholder="example@mail.com" required />
              </div>
            </div>

            <div className="input-field">
              <label>How can we help you?</label>
              <div className="input-wrapper">
                <textarea placeholder="Write your message here..." rows="4" required></textarea>
              </div>
            </div>

            <button type="submit" className={`contact-btn ${isSending ? "loading" : ""} `} disabled={isSending}>
              {isSending ? (
                "Sending..."
              ) : (
                <>
                  <Send size={18} /> Send Message
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default Contact;