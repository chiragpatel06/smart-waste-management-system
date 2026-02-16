import { useState } from "react";
import "./ReportWaste.css";

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

  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";

    if (!form.email.trim())
      newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Invalid email format";

    if (!form.location.trim())
      newErrors.location = "Location is required";

    if (!form.wasteType)
      newErrors.wasteType = "Please select waste type";

    if (!form.description.trim())
      newErrors.description = "Description is required";

    if (!form.photo)
      newErrors.photo = "Please upload a waste photo";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors({ ...errors, photo: "Only image files allowed" });
      return;
    }

    setForm({
      ...form,
      photo: file,
      photoPreview: URL.createObjectURL(file),
    });

    setErrors({ ...errors, photo: null });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    alert("Waste reported successfully!");

    setForm({
      name: "",
      email: "",
      location: "",
      wasteType: "",
      description: "",
      photo: null,
      photoPreview: null,
    });
  };

  return (
    <div className="report-page">
      <div className="report-card">
        <h1>Report Waste</h1>
        <p>Upload waste details with a photo to help faster resolution.</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          {errors.name && <span className="error">{errors.name}</span>}

          <input
            type="email"
            placeholder="Your Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          {errors.email && <span className="error">{errors.email}</span>}

          <input
            type="text"
            placeholder="Waste Location (Area / Landmark)"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
          {errors.location && <span className="error">{errors.location}</span>}

          <select
            value={form.wasteType}
            onChange={(e) =>
              setForm({ ...form, wasteType: e.target.value })
            }
          >
            <option value="">Select Waste Type</option>
            <option value="Garbage">Garbage</option>
            <option value="Plastic">Plastic</option>
            <option value="Organic">Organic</option>
            <option value="Construction">Construction Waste</option>
          </select>
          {errors.wasteType && <span className="error">{errors.wasteType}</span>}

          <textarea
            rows="4"
            placeholder="Describe the waste issue"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
          {errors.description && (
            <span className="error">{errors.description}</span>
          )}

          {/* PHOTO UPLOAD */}
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
          />
          {errors.photo && <span className="error">{errors.photo}</span>}

          {/* PHOTO PREVIEW */}
          {form.photoPreview && (
            <img
              src={form.photoPreview}
              alt="Waste Preview"
              className="photo-preview"
            />
          )}

          <button type="submit">Submit Report</button>
        </form>
      </div>
    </div>
  );
}

export default ReportWaste;
