import React, { useState } from "react";
import {
  ClipboardList,
  CheckCircle,
  Clock,
  Users,
  Search,
  Plus
} from "lucide-react";

function AdminDashboard() {
  const [activeCard, setActiveCard] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const reportsData = [
    { id: 101, location: "Smart City Area", type: "Plastic", status: "Pending" },
    { id: 102, location: "Main Road", type: "Garbage", status: "Collected" },
    { id: 103, location: "River Side", type: "E-Waste", status: "Pending" },
    { id: 104, location: "Market Area", type: "Organic", status: "Collected" },
  ];

  const collectorsData = [
    { id: 1, name: "Rahul Sharma", area: "Smart City Area", status: "Active" },
    { id: 2, name: "Amit Kumar", area: "Main Road", status: "On Break" },
  ];

  const filteredReports = reportsData
    .filter((r) => (activeCard === "All" ? true : r.status === activeCard))
    .filter((r) => r.location.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="dashboard-content">
      <header className="content-header">
        <div>
          <h1>Dashboard Overview</h1>
          <p className="subtitle">Welcome back, Admin</p>
        </div>
        <div className="header-actions">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="primary-btn">
            <Plus size={18} /> New Report
          </button>
        </div>
      </header>

      <div className="stats-grid">
        <StatCard
          title="Total Reports"
          count={reportsData.length}
          icon={<ClipboardList color="#3b82f6" />}
          active={activeCard === "All"}
          onClick={() => setActiveCard("All")}
        />
        <StatCard
          title="Pending"
          count={reportsData.filter(r => r.status === "Pending").length}
          icon={<Clock color="#f59e0b" />}
          active={activeCard === "Pending"}
          onClick={() => setActiveCard("Pending")}
        />
        <StatCard
          title="Collected"
          count={reportsData.filter(r => r.status === "Collected").length}
          icon={<CheckCircle color="#10b981" />}
          active={activeCard === "Collected"}
          onClick={() => setActiveCard("Collected")}
        />
        <StatCard
          title="Collectors"
          count={collectorsData.length}
          icon={<Users color="#6366f1" />}
          active={activeCard === "Collectors"}
          onClick={() => setActiveCard("Collectors")}
        />
      </div>

      <section className="data-section">
        <div className="section-header">
          <h2>Recent Activity</h2>
          <div className="view-toggle">
            <button className={activeCard === "All" ? "active" : ""}>
              Reports
            </button>
            <button className={activeCard === "Collectors" ? "active" : ""}>
              Collectors
            </button>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="modern-table">
            <thead>
              {activeCard === "Collectors" ? (
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Area</th>
                  <th>Status</th>
                </tr>
              ) : (
                <tr>
                  <th>ID</th>
                  <th>Location</th>
                  <th>Category</th>
                  <th>Status</th>
                </tr>
              )}
            </thead>
            <tbody>
              {activeCard === "Collectors"
                ? collectorsData.map((collector) => (
                  <tr key={collector.id}>
                    <td>#{collector.id}</td>
                    <td><strong>{collector.name}</strong></td>
                    <td>{collector.area}</td>
                    <td>
                      <span className={`status-badge ${collector.status.toLowerCase().replace(" ", "-")}`}>
                        {collector.status}
                      </span>
                    </td>
                  </tr>
                ))
                : filteredReports.map((report) => (
                  <tr key={report.id}>
                    <td>#{report.id}</td>
                    <td><strong>{report.location}</strong></td>
                    <td>{report.type}</td>
                    <td>
                      <span className={`status-badge ${report.status.toLowerCase()}`}>
                        {report.status}
                      </span>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StatCard({ title, count, icon, active, onClick }) {
  return (
    <div className={`stat-card ${active ? "is-active" : ""}`} onClick={onClick}>
      <div className="stat-icon-bg">{icon}</div>
      <div>
        <h3>{title}</h3>
        <p className="stat-number">{count}</p>
      </div>
    </div>
  );
}

export default AdminDashboard;