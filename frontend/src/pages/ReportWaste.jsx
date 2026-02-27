import { useState } from "react";
import { 
  MapPin, Image as ImageIcon, 
  Trash2, Recycle, Leaf, Box, ChevronRight, ChevronLeft, CheckCircle 
} from "lucide-react";
import API from "../api/api";
import "./ReportWaste.css";

function ReportWaste() {
  const [step, setStep] = useState(1);
  const [showOptions, setShowOptions] = useState(false); // ✅ NEW

  const [form, setForm] = useState({
    name: "",
    email: "",
    location: "",
    wasteType: "",
    description: "",
    photo: null,
    photoPreview: null,
  });

  const [loading, setLoading] = useState(false);

  const getMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );

          const data = await response.json();
          const address = data.display_name;

          setForm((prev) => ({
            ...prev,
            location: address
          }));

          alert("Location Captured Successfully!");
        } catch (error) {
          alert("Error fetching address");
        }
      },
      () => alert("Please allow location access."),
      { enableHighAccuracy: true }
    );
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const selectWasteType = (type) => {
    setForm({ ...form, wasteType: type });
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

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const user = JSON.parse(localStorage.getItem("user"));

    const formData = new FormData();
    formData.append("name", user?.name);
    formData.append("email", user?.email);
    formData.append("location", form.location);
    formData.append("wasteType", form.wasteType);
    formData.append("description", form.description || "No description");
    formData.append("photo", form.photo);

    const res = await API.post("/reports", formData);

    alert("✅ " + res.data.message);
    setStep(4);

  } catch (err) {
    console.log(err.response?.data);
    alert("❌ Error submitting report");
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <div className="report-wrapper">
        <div className="report-card">

          {/* Progress Bar */}
          <div className="progress-bar">
            <div className={`progress-step ${step >= 1 ? "active" : ""}`}></div>
            <div className={`progress-step ${step >= 2 ? "active" : ""}`}></div>
            <div className={`progress-step ${step >= 3 ? "active" : ""}`}></div>
          </div>

          {step === 1 && (
            <div className="step-container animate-in">
              <h2>Step 1: Upload Photo</h2>
              <p>Show us the waste problem.</p>

              {/* ✅ Upload Box */}
              <div 
                className="huge-upload-area"
                onClick={() => setShowOptions(true)}
              >
                {form.photoPreview ? (
                  <img src={form.photoPreview} alt="Preview" className="img-filled" />
                ) : (
                  <div className="upload-placeholder">
                    <ImageIcon size={60} />
                    <span>Tap to Upload Photo</span>
                  </div>
                )}
              </div>

              {form.photo && (
                <button className="btn-next" onClick={() => setStep(2)}>
                  Next <ChevronRight />
                </button>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="step-container animate-in">
              <h2>Step 2: What is it?</h2>
              <div className="waste-grid">
                {[
                  { name: "Garbage", icon: <Trash2 color="#ef4444"/> },
                  { name: "Plastic", icon: <Box color="#3b82f6"/> },
                  { name: "Organic", icon: <Leaf color="#22c55e"/> },
                  { name: "Others", icon: <Recycle color="#64748b"/> }
                ].map((item) => (
                  <div 
                    key={item.name}
                    className={`waste-card ${form.wasteType === item.name ? "selected" : ""}`}
                    onClick={() => selectWasteType(item.name)}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>

              <div className="nav-btns">
                <button className="btn-back" onClick={() => setStep(1)}>
                  <ChevronLeft /> Back
                </button>
                <button 
                  className="btn-next" 
                  disabled={!form.wasteType}
                  onClick={() => setStep(3)}
                >
                  Next <ChevronRight />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="step-container animate-in">
              <h2>Step 3: Where is it?</h2>

              <button type="button" className="btn-location" onClick={getMyLocation}>
                <MapPin /> Use My Current Location
              </button>

              <input
                type="text"
                name="location"
                placeholder="Or type address here..."
                value={form.location}
                onChange={handleChange}
                className="text-input"
              />

              <textarea
                name="description"
                placeholder="Any extra details? (Optional)"
                value={form.description}
                onChange={handleChange}
              />

              <div className="nav-btns">
                <button className="btn-back" onClick={() => setStep(2)}>
                  <ChevronLeft /> Back
                </button>
                <button 
                  className="btn-submit" 
                  onClick={handleSubmit} 
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Submit Report"}
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="step-container animate-in success-step">
              <CheckCircle size={80} color="#22c55e" />
              <h2>Thank You!</h2>
              <p>Your report has been sent to the authorities.</p>
              <button 
                className="btn-next" 
                onClick={() => window.location.reload()}
              >
                Report Another
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ✅ Upload Popup */}
      {showOptions && (
        <div className="upload-modal">
          <div className="upload-popup">
            <button
              type="button"
              onClick={() => {
                document.getElementById("cameraInput").click();
                setShowOptions(false);
              }}
            >
              📷 Open Camera
            </button>

            <button
              type="button"
              onClick={() => {
                document.getElementById("galleryInput").click();
                setShowOptions(false);
              }}
            >
              🖼 Choose from Gallery
            </button>

            <button
              type="button"
              className="cancel-btn"
              onClick={() => setShowOptions(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Hidden Inputs */}
      <input
        id="cameraInput"
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handlePhotoChange}
        hidden
      />

      <input
        id="galleryInput"
        type="file"
        accept="image/*"
        onChange={handlePhotoChange}
        hidden
      />
    </>
  );
}

export default ReportWaste;