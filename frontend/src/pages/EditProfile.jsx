import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Phone, MapPin, ArrowLeft, Save, CheckCircle } from "lucide-react";
import API from "../api/api";
import "./profile.css";

const EditProfile = () => {
  const navigate = useNavigate();
  const savedUser = JSON.parse(localStorage.getItem("user")) || {};
  
  const [formData, setFormData] = useState({
    name: savedUser.name || "",
    phone: savedUser.phone || "",
    address: savedUser.address || "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.put("/users/update", formData);
      localStorage.setItem("user", JSON.stringify(res.data));
      setSuccess(true);
      setTimeout(() => navigate("/profile"), 1500);
    } catch (err) {
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card edit-card">
        <div className="edit-header">
          <button className="back-btn" onClick={() => navigate("/profile")}>
            <ArrowLeft size={24} />
          </button>
          <h2>Edit My Profile</h2>
        </div>

        {success && (
          <div className="success-banner">
            <CheckCircle size={20} /> Changes Saved Successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="edit-form">
          <div className="input-group">
            <label><User size={16} /> Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="input-group">
            <label><Phone size={16} /> Mobile Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter mobile number"
            />
          </div>

          <div className="input-group">
            <label><MapPin size={16} /> Home Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your full address"
              rows="3"
            />
          </div>

          <div className="edit-actions">
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
              {!loading && <Save size={18} />}
            </button>
            <button type="button" className="btn-cancel" onClick={() => navigate("/profile")}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;