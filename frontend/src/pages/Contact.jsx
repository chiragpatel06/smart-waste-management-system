import "./Contact.css";

function Contact() {
  return (
    <div className="contact-page">
      <div className="contact-container">
        
        {/* LEFT INFO */}
        <div className="contact-info">
          <h1>Contact Us</h1>
          <p>
            Have questions or want to report an issue?
            Get in touch with the Smart Waste Management team.
          </p>

          <div className="info-item">
            📍 <span>Smart City Office, India</span>
          </div>
          <div className="info-item">
            📧 <span>support@smartwaste.com</span>
          </div>
          <div className="info-item">
            📞 <span>+91 9XXXXXXXXX</span>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="contact-form">
          <h2>Send a Message</h2>
          <form>
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea placeholder="Your Message" rows="5" required></textarea>
            <button type="submit">Submit</button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default Contact;
