import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  ClipboardList, 
  Users, 
  BarChart3, 
  LogOut,
  Recycle,
  Menu, // Hamburger icon
  X     // Close icon
} from "lucide-react";
import "./AdminDashboard.css";

function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="admin-container">
      {/* MOBILE OVERLAY */}
      <div 
        className={`sidebar-overlay ${isSidebarOpen ? "active" : ""}`} 
        onClick={closeSidebar}
      ></div>

      {/* SIDEBAR */}
      <aside className={`admin-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="logo-section">
          <Recycle className="logo-icon" size={32} />
          <span className="logo-text">SwachhSetu</span>
          <button className="close-sidebar-btn" onClick={closeSidebar}>
            <X size={24} />
          </button>
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
          </ul>
        </nav>

        <div className="sidebar-footer">
          <NavLink to="/" className="logout-btn">
            <LogOut size={20} /> <span>Sign Out</span>
          </NavLink>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main">
        {/* MOBILE HEADER TOGGLE */}
        <div className="mobile-header-nav">
          <button className="hamburger-btn" onClick={toggleSidebar}>
            <Menu size={28} />
          </button>
          <span className="mobile-logo-text">SwachhSetu</span>
        </div>
        
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;