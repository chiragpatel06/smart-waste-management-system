import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail, MapPin, User, Calendar, Phone, LogOut,
  Edit3, ShieldCheck, CheckCircle2, ArrowLeft, Save, X,
  Camera, Trash2, LayoutDashboard, Truck, Map, Lock, AlertCircle
} from "lucide-react";
import API from "../api/api";
import "./profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // States
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [editData, setEditData] = useState({});
  const [passwordData, setPasswordData] = useState({ current: "", new: "", confirm: "" });

  // UI States
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // navigate instead of refresh
    navigate("/login");
  };

  const fetchUser = async () => {
    try {
      const res = await API.get("/users/me");
      setUser(res.data);
      setEditData(res.data);
      // Sync with localStorage so navbar stays updated
      localStorage.setItem("user", JSON.stringify(res.data));
      window.dispatchEvent(new Event("userUpdated"));
    } catch (err) {
      showToast("Failed to load profile", "error");
    } finally {
      setLoading(false);
    }
  };

  // --- Toast Logic ---
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  // --- Change Detection ---
  const hasChanges =
    user && editData && JSON.stringify(user) !== JSON.stringify(editData);


  const handleCancel = () => {
    setEditData(user);
    setIsEditing(false);
    showToast("Changes discarded", "success");
  };


  // --- Profile Image Logic ---
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      setLoading(true);
      const res = await API.post("/users/upload-photo", formData);
      const updatedUser = { ...user, profileImage: res.data.url };
      setUser(updatedUser);
      setEditData({ ...editData, profileImage: res.data.url });
      
      localStorage.setItem("user", JSON.stringify(updatedUser)); // FIXED: updatedUser was undefined
      window.dispatchEvent(new Event("userUpdated"));
      showToast("Photo updated successfully");
    } catch (err) {
      showToast("Error uploading photo", "error");
    } finally {
      setLoading(false);
    }
  };

  // --- Form Handlers ---
  const handleInputChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    if (!hasChanges) return;
    setLoading(true);

    try {
      const res = await API.put("/users/update", editData);

      setUser(res.data);

      // ✅ ADD THIS
      localStorage.setItem("user", JSON.stringify(res.data));
      window.dispatchEvent(new Event("userUpdated"));

      setIsEditing(false);
      showToast("Profile updated successfully");

    } catch (err) {
      showToast("Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
      return showToast("Passwords do not match", "error");
    }
    if (passwordData.new.length < 6) {
      return showToast("Min 6 characters required", "error");
    }

    try {
      setLoading(true);
      await API.put("/users/change-password", {
        currentPassword: passwordData.current,
        newPassword: passwordData.new
      });
      showToast("Password changed successfully");
      setShowPasswordForm(false);
      setPasswordData({ current: "", new: "", confirm: "" });
    } catch (err) {
      showToast(err.response?.data?.message || "Error changing password", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) return <div className="profile-loading-screen"><div className="profile-spinner"></div></div>;
  // Profile.js ke update functions ke andar:


  return (
    <div className="profile-page-container">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`profile-toast profile-toast-${toast.type}`}>
          {toast.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {toast.message}
        </div>
      )}

      <div className="profile-glass-bg"></div>

      <div className={`profile-main-card ${isEditing ? "profile-mode-editing" : ""}`}>

        {/* Nav */}
        <div className="profile-card-nav">
          <button className="profile-back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} /> <span>Back</span>
          </button>
          {hasChanges && isEditing && (
            <span className="profile-unsaved-tag">Unsaved Changes</span>
          )}
        </div>

        {/* Header */}
        <header className="profile-header-section">
          <div className="profile-avatar-container">
            <div className="profile-avatar-main">
              {user?.profileImage ? (
                <img src={user.profileImage} alt="Profile" className="profile-img-fluid" />
              ) : (
                user?.name?.charAt(0).toUpperCase()
              )}
              <div className="profile-avatar-overlay" onClick={() => fileInputRef.current.click()}>
                <Camera size={20} />
                <span>Change</span>
              </div>
            </div>
            <input type="file" ref={fileInputRef} hidden onChange={handleImageUpload} accept="image/*" />
            <div className="profile-role-badge">
              <ShieldCheck size={12} /> {user?.role || "User"}
            </div>
          </div>

          <div className="profile-header-info">
            <h1>{user?.name}</h1>
            <div className="profile-status-active">
              <span className="profile-dot-glow"></span> Account Active
            </div>
          </div>
        </header>

        {/* Stats Section */}
        <div className="profile-stats-grid">
          <div className="profile-stat-item">
            <div className="profile-stat-icon blue"><LayoutDashboard size={20} /></div>
            <div className="profile-stat-data">
              <h3>{user?.stats?.reports || 0}</h3>
              <p>Total Reports</p>
            </div>
          </div>
          <div className="profile-stat-item">
            <div className="profile-stat-icon green"><Truck size={20} /></div>
            <div className="profile-stat-data">
              <h3>{user?.stats?.pickups || 0}</h3>
              <p>Completed</p>
            </div>
          </div>
          <div className="profile-stat-item">
            <div className="profile-stat-icon orange"><Map size={20} /></div>
            <div className="profile-stat-data">
              <h3>{user?.stats?.areas || 0}</h3>
              <p>Pending</p>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="profile-info-grid">
          <section className="profile-info-subcard">
            <h2 className="profile-group-title">Personal Details</h2>
            <div className="profile-data-row">
              <div className="profile-icon-wrapper"><User size={18} /></div>
              <div className="profile-field-content">
                <label>Full Name</label>
                {isEditing ? (
                  <input type="text" name="name" className="profile-input-field" value={editData.name || ""} onChange={handleInputChange} />
                ) : <p>{user?.name}</p>}
              </div>
            </div>
            <div className="profile-data-row">
              <div className="profile-icon-wrapper"><Mail size={18} /></div>
              <div className="profile-field-content">
                <label>Email</label>
                {isEditing ? (
                  <input type="email" name="email" className="profile-input-field" value={editData.email || ""} onChange={handleInputChange} />
                ) : <p>{user?.email}</p>}
              </div>
            </div>
          </section>

          <section className="profile-info-subcard">
            <h2 className="profile-group-title">Contact Information</h2>
            <div className="profile-data-row">
              <div className="profile-icon-wrapper"><Phone size={18} /></div>
              <div className="profile-field-content">
                <label>Mobile</label>
                {isEditing ? (
                  <input type="text" name="phone" className="profile-input-field" value={editData.phone || ""} onChange={handleInputChange} />
                ) : <p>{user?.phone || "Not Added"}</p>}
              </div>
            </div>
            <div className="profile-data-row">
              <div className="profile-icon-wrapper"><MapPin size={18} /></div>
              <div className="profile-field-content">
                <label>Address</label>
                {isEditing ? (
                  <textarea name="address" className="profile-input-field" value={editData.address || ""} onChange={handleInputChange} rows="1" />
                ) : <p>{user?.address || "Not Added"}</p>}
              </div>
            </div>
          </section>
        </div>

        {/* Change Password Card */}
        <div className="profile-info-subcard profile-password-card">
          <div className="profile-password-header" onClick={() => setShowPasswordForm(!showPasswordForm)}>
            <div className="profile-flex-center">
              <Lock size={18} className="profile-text-blue" />
              <h2 className="profile-group-title" style={{ margin: 0, marginLeft: '10px' }}>Security & Password</h2>
            </div>
            <Edit3 size={16} className="profile-text-muted" />
          </div>

          {showPasswordForm && (
            <form className="profile-password-form" onSubmit={handlePasswordChange}>
              <div className="profile-input-group">
                <label>Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  value={passwordData.current}
                  onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                />
              </div>

              <div className="profile-input-group">
                <label>New Password</label>
                <input
                  type="password"
                  placeholder="Minimum 6 characters"
                  required
                  value={passwordData.new}
                  onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                />
              </div>

              <div className="profile-input-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Re-type new password"
                  required
                  value={passwordData.confirm}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                />
              </div>

              <button type="submit" className="profile-btn-sm">Update Password</button>
            </form>
          )}
        </div>

        {/* Footer */}
        <footer className="profile-card-actions">
          {isEditing ? (
            <>
              <button className={`profile-btn profile-btn-primary ${!hasChanges ? 'disabled' : ''}`} onClick={handleSaveProfile} disabled={!hasChanges}>
                <Save size={18} /> Save Changes
              </button>
              <button className="profile-btn profile-btn-cancel" onClick={handleCancel}><X size={18} /> Cancel</button>
            </>
          ) : (
            <>
              <button className="profile-btn profile-btn-primary" onClick={() => setIsEditing(true)}>
                <Edit3 size={18} /> Edit Profile
              </button>
              <button
                className="profile-btn profile-btn-secondary"
                onClick={handleLogout}
              >
                <LogOut size={18} /> Logout
              </button>
            </>
          )}
        </footer>
      </div>
    </div>
  );
};

export default Profile;