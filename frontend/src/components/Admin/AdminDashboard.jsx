import "./AdminDashboard.css";
import { Link } from "react-router-dom";

function AdminDashboard() {
  return (
    <div className="admin-page">
      {/* <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li>
            <Link to="/admin">Dashboard</Link>
          </li>
          <li>
            <Link to="/admin/waste-reports">Waste Reports</Link>
          </li>
          <li>
            <Link to="/admin/collectors">Collectors</Link>
          </li>
          <li>
            <Link to="/admin/analytics">Analytics</Link>
          </li>
          <li>
            <Link to="/">Logout</Link>
          </li>
        </ul>
      </aside> */}

      <main className="admin-content">
        <h1>Dashboard Overview</h1>

        <div className="admin-cards">
          <div className="admin-card">
            <h3>Total Reports</h3>
            <p>128</p>
          </div>

          <div className="admin-card">
            <h3>Pending</h3>
            <p>42</p>
          </div>

          <div className="admin-card">
            <h3>Collected</h3>
            <p>76</p>
          </div>

          <div className="admin-card">
            <h3>Collectors</h3>
            <p>10</p>
          </div>
        </div>

        <h2>Recent Waste Reports</h2>

        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Location</th>
              <th>Type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#101</td>
              <td>Smart City Area</td>
              <td>Plastic</td>
              <td>Pending</td>
            </tr>
            <tr>
              <td>#102</td>
              <td>Main Road</td>
              <td>Garbage</td>
              <td>Collected</td>
            </tr>
          </tbody>
        </table>
      </main>
    </div>
  );
}

export default AdminDashboard;
