import { Outlet, NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  ClipboardList, 
  Users, 
  BarChart3, 
  LogOut,
  Recycle // Using a blue-themed icon
} from "lucide-react";
import "./AdminDashboard.css";

function AdminLayout() {
  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div className="logo-section">
          <Recycle className="logo-icon" size={32} />
          <span className="logo-text">SwachhSetu</span>
        </div>

        <nav className="sidebar-nav">
          <p className="nav-label">Management</p>
          <ul>
            <li>
              <NavLink to="/admin" end>
                <LayoutDashboard size={20} /> <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/waste-reports">
                <ClipboardList size={20} /> <span>Waste Reports</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/collectors">
                <Users size={20} /> <span>Collectors</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/analytics">
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

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;