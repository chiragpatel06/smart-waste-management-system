import { Outlet, Link } from "react-router-dom";
import "./AdminDashboard.css";

function AdminLayout() {
  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li><Link to="/admin">Dashboard</Link></li>
          <li><Link to="/admin/waste-reports">Waste Reports</Link></li>
          <li><Link to="/admin/collectors">Collectors</Link></li>
          <li><Link to="/admin/analytics">Analytics</Link></li>
          <li>
            <Link to="/">Logout</Link>
          </li>
        </ul>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
