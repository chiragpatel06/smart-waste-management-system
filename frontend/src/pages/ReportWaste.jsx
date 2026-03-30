import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Image as ImageIcon, 
  Trash2, Recycle, Leaf, Box, ChevronRight, ChevronLeft, CheckCircle, Info, X 
} from "lucide-react";
import API from "../api/api";
import "./ReportWaste.css";

const wasteInfo = {
  Garbage: {
    title: "Garbage Waste",
    description: "Non-recyclable and non-compostable waste that usually goes to landfills.",
    items: ["Diapers", "Sanitary waste", "Broken ceramics", "Dust", "Cigarette butts"],
    avoid: ["Plastic bottles", "Food waste", "Metal cans"]
  },
  Plastic: {
    title: "Plastic Waste",
    description: "Recyclable plastic materials that can be processed into new products.",
    items: ["Bottles", "Containers", "Wrappers", "Plastic bags", "Shampoo bottles"],
    avoid: ["Food waste", "Glass", "Paper with grease"]
  },
  Organic: {
    title: "Organic Waste",
    description: "Biodegradable natural waste that can be turned into compost for plants.",
    items: ["Food scraps", "Vegetable peels", "Leaves", "Coffee grounds", "Eggshells"],
    avoid: ["Plastic", "Metal", "Glass", "Meat/Dairy"]
  },
  Others: {
    title: "Special/Others",
    description: "Hazardous or special waste that requires professional handling.",
    items: ["Batteries", "E-waste", "Chemicals", "LED bulbs", "Expired Medicines"],
    avoid: ["Regular garbage", "Food waste"]
  }
};

function ReportWaste() {
  const [step, setStep] = useState(1);
  const [showInfo, setShowInfo] = useState(false); // ✅ Info Panel Toggle

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
  const navigate = useNavigate();
useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/login", { state: { from: "/report" } });
  }
}, []);
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
    setShowInfo(true); // Open info panel on selection
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
        <div className={`report-card ${step === 2 ? "step-two-card" : ""} ${showInfo && step === 2 ? "info-open" : ""}`}>

          {/* Progress Bar */}
          <div className="progress-bar-report">
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
                onClick={() => document.getElementById("cameraInput").click()}
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
            <div className={`step-container animate-in ${showInfo ? "info-open" : ""}`}>
              <div className="category-header">
                <h2>Step 2: What is it?</h2>
                <p>Select the type of waste you found.</p>
              </div>

              <div className="step-two-layout">
                <div className="waste-grid">
                  {[
                    { name: "Garbage", icon: <Trash2 color="#ef4444" /> },
                    { name: "Plastic", icon: <Box color="#3b82f6" /> },
                    { name: "Organic", icon: <Leaf color="#22c55e" /> },
                    { name: "Others", icon: <Recycle color="#64748b" /> }
                  ].map((item) => (
                    <div
                      key={item.name}
                      className={`waste-card ${form.wasteType === item.name ? "selected" : ""}`}
                      onClick={() => selectWasteType(item.name)}
                    >
                      <div className="card-selection-indicator">
                        <CheckCircle size={16} />
                      </div>
                      {item.icon}
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>

                {/* INFO PANEL (Desktop: Side, Mobile: Bottom Drawer) */}
                <div className={`waste-info-panel ${showInfo ? "panel-active" : "panel-placeholder"}`}>
                  {form.wasteType ? (
                    <>
                      <div className="panel-header">
                        <div className="header-left">
                          <Info size={18} />
                          <h3>{wasteInfo[form.wasteType].title}</h3>
                        </div>
                        <button className="close-panel" onClick={() => setShowInfo(false)}>
                          <X size={20} />
                        </button>
                      </div>

                      <div className="panel-body">
                        <p className="type-desc">{wasteInfo[form.wasteType].description}</p>

                        <div className="items-section">
                          <h4>✅ Put these items here:</h4>
                          <ul className="items-list">
                            {wasteInfo[form.wasteType].items.map(i => <li key={i}>{i}</li>)}
                          </ul>
                        </div>

                        <div className="items-section avoid">
                          <h4>❌ Avoid putting:</h4>
                          <ul className="items-list">
                            {wasteInfo[form.wasteType].avoid.map(i => <li key={i}>{i}</li>)}
                          </ul>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="panel-empty-state">
                      <Recycle size={50} className="empty-icon" />
                      <p>Select a category to see detailed guidance.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="nav-btns">
                <button className="btn-back" onClick={() => { setStep(1); setShowInfo(false); }}>
                  <ChevronLeft /> Back
                </button>
                <button
                  className="btn-next"
                  disabled={!form.wasteType}
                  onClick={() => { setStep(3); setShowInfo(false); }}
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
                onClick={() => {
                  setForm({
                    name: "",
                    email: "",
                    location: "",
                    wasteType: "",
                    description: "",
                    photo: null,
                    photoPreview: null,
                  });
                  setStep(1);
                }}
              >
                Report Another
              </button>
            </div>
          )}
        </div>
      </div>

  

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