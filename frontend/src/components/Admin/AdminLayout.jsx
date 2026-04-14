import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  BarChart3,
  LogOut,
  Recycle,
  Menu,
  X,
  MessageSquare
} from "lucide-react";
import "./AdminLayout.css";

function AdminLayout() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isAdmin");
    window.dispatchEvent(new Event("storage"));
    navigate("/admin-login");
  };

  return (
    <div className="admin-container">
      <div className={`sidebar-overlay ${isSidebarOpen ? "active" : ""}`} onClick={closeSidebar}></div>

      <aside className={`admin-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="logo-section">
          <Recycle className="logo-icon" size={32} />
          <span className="logo-text">SwachhSetu</span>
          <button className="close-sidebar-btn" onClick={closeSidebar}><X size={24} /></button>
        </div>

        <nav className="sidebar-nav">
          <p className="nav-label">Management</p>
          <ul>
            <li>
              <NavLink to="/admin" end onClick={closeSidebar}>
                <LayoutDashboard size={20} /> <span>Dashboard</span>
              </NavLink>
            </li>

            <li>
              <NavLink to="/admin/waste-reports" onClick={closeSidebar}>
                <ClipboardList size={20} /> <span>Waste Reports</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/collectors" onClick={closeSidebar}>
                <Users size={20} /> <span>Collectors</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/analytics" onClick={closeSidebar}>
                <BarChart3 size={20} /> <span>Analytics</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/messages" onClick={closeSidebar}>
                <MessageSquare size={20} /> <span>Customer Queries</span>
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn" style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer', textAlign: 'left', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <LogOut size={20} /> <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="mobile-header-nav">
          <button className="hamburger-btn" onClick={toggleSidebar}><Menu size={28} /></button>
          <span className="mobile-logo-text">SwachhSetu</span>
        </div>
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;