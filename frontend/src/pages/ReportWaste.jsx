import { useState } from "react";
import "./ReportWaste.css";
import {
  User,
  Mail,
  MapPin,
  Image as ImageIcon,
  Eye,
  X
} from "lucide-react";

function ReportWaste() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    location: "",
    wasteType: "",
    description: "",
    photo: null,
    photoPreview: null,
  });

  const [showPreview, setShowPreview] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setForm({
      ...form,
      photo: file,
      photoPreview: URL.createObjectURL(file),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    alert("Report Submitted Successfully!");
  };

  return (
    <div className="report-wrapper">
      <div className="report-container">
        <h1>Report Waste</h1>
        <p>Upload waste details with a photo for faster resolution.</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <User size={18} />
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <Mail size={18} />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <MapPin size={18} />
            <input
              type="text"
              name="location"
              placeholder="Waste Location"
              value={form.location}
              onChange={handleChange}
              required
            />
          </div>

          <select
            name="wasteType"
            value={form.wasteType}
            onChange={handleChange}
            required
          >
            <option value="">Select Waste Type</option>
            <option>Garbage</option>
            <option>Plastic</option>
            <option>Organic</option>
            <option>Others</option>
          </select>

          <textarea
            rows="4"
            name="description"
            placeholder="Describe the issue"
            value={form.description}
            onChange={handleChange}
            required
          />

          <div className="file-upload">
            <div
              className="upload-btn"
              onClick={() => document.getElementById("fileInput").click()}
            >
              <ImageIcon size={18} />
              <span>
                {form.photo ? form.photo.name : "Choose a photo"}
              </span>
            </div>

            {form.photo && (
              <Eye
                size={18}
                className="preview-icon"
                onClick={() => setShowPreview(true)}
              />
            )}

            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
            />
          </div>

          <button type="submit">Submit Report</button>
        </form>
      </div>

      {showPreview && (
        <div
          className="modal"
          onClick={() => setShowPreview(false)}
        >
          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <X
              size={24}
              className="close-btn"
              onClick={() => setShowPreview(false)}
            />
            <img src={form.photoPreview} alt="Preview" />
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportWaste;
