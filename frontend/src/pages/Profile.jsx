import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, MapPin, User, Calendar, Phone, LogOut, Edit3, ShieldCheck } from "lucide-react";
import API from "../api/api";
import "./profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/users/me");
        setUser(res.data);
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchUser();
  }, []);

  if (loading) return <div className="profile-page"><div className="loader">Loading...</div></div>;

  return (
    <div className="profile-page">
      <div className="profile-card">
        {/* Header - Compact */}
        <div className="profile-header">
          <div className="avatar-container">
            <div className="profile-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
            <div className="role-badge"><ShieldCheck size={12}/> {user?.role || "User"}</div>
          </div>
          <h1 className="user-name">{user?.name}</h1>
          <p className="user-status">Account Active</p>
        </div>

        {/* Content - Two Columns on Desktop */}
        <div className="profile-content">
          {/* Column 1 */}
          <div className="info-section">
            <h3 className="section-title">Basic Details</h3>
            <div className="info-row">
              <div className="info-label"><User size={18} color="#2563eb"/> <span>Name</span></div>
              <div className="info-value">{user?.name}</div>
            </div>
            <div className="divider"></div>
            <div className="info-row">
              <div className="info-label"><Mail size={18} color="#2563eb"/> <span>Email</span></div>
              <div className="info-value">{user?.email}</div>
            </div>
          </div>

          {/* Column 2 */}
          <div className="info-section">
            <h3 className="section-title">Contact Info</h3>
            <div className="info-row">
              <div className="info-label"><Phone size={18} color="#2563eb"/> <span>Mobile</span></div>
              <div className="info-value">{user?.phone || "Not Added"}</div>
            </div>
            <div className="divider"></div>
            <div className="info-row">
              <div className="info-label"><MapPin size={18} color="#2563eb"/> <span>Home</span></div>
              <div className="info-value">{user?.address || "Not Added"}</div>
            </div>
          </div>

          {/* Row 3 - Full Width Info */}
          <div className="info-section full-width">
            <h3 className="section-title" style={{margin:0}}>Account Details</h3>
            <div className="info-row" style={{gap: '20px'}}>
              <div className="info-label"><Calendar size={18} color="#2563eb"/> <span>Joined On:</span></div>
              <div className="info-value">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</div>
            </div>
          </div>
        </div>

        {/* Footer Buttons - Side by Side */}
        <div className="profile-actions">
          <button className="btn-edit" onClick={() => navigate("/edit-profile")}>
            <Edit3 size={18} /> Edit Profile
          </button>
          <button className="btn-logout" onClick={() => {/* logout logic */}}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;