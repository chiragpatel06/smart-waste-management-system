import "./AdminDashboard.css";
import { useState } from "react";

function AdminDashboard() {

  const reportsData = [
    { id: 101, location: "Smart City Area", type: "Plastic", status: "Pending" },
    { id: 102, location: "Main Road", type: "Garbage", status: "Collected" },
    { id: 103, location: "River Side", type: "E-Waste", status: "Pending" },
    { id: 104, location: "Market Area", type: "Organic", status: "Collected" },
  ];

  const collectorsData = [
    { id: 1, name: "Rahul", area: "Smart City Area" },
    { id: 2, name: "Amit", area: "Main Road" },
  ];

  const [activeCard, setActiveCard] = useState("All");

  // Filtering Logic
  const filteredReports =
    activeCard === "All"
      ? reportsData
      : reportsData.filter((r) => r.status === activeCard);

  return (
    <div className="admin-page">
      <main className="admin-content">
        <h1>Dashboard Overview</h1>

        {/* CARDS */}
        <div className="admin-cards">

          <div
            className={`admin-card ${activeCard === "All" ? "active" : ""}`}
            onClick={() => setActiveCard("All")}
          >
            <h3>Total Reports</h3>
            <p>{reportsData.length}</p>
          </div>

          <div
            className={`admin-card ${activeCard === "Pending" ? "active" : ""}`}
            onClick={() => setActiveCard("Pending")}
          >
            <h3>Pending</h3>
            <p>{reportsData.filter(r => r.status === "Pending").length}</p>
          </div>

          <div
            className={`admin-card ${activeCard === "Collected" ? "active" : ""}`}
            onClick={() => setActiveCard("Collected")}
          >
            <h3>Collected</h3>
            <p>{reportsData.filter(r => r.status === "Collected").length}</p>
          </div>

          <div
            className={`admin-card ${activeCard === "Collectors" ? "active" : ""}`}
            onClick={() => setActiveCard("Collectors")}
          >
            <h3>Collectors</h3>
            <p>{collectorsData.length}</p>
          </div>

        </div>

        <h2>
          {activeCard === "Collectors"
            ? "Collectors List"
            : "Recent Waste Reports"}
        </h2>

        {/* TABLE SWITCH */}
        {activeCard === "Collectors" ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Area</th>
              </tr>
            </thead>
            <tbody>
              {collectorsData.map((c) => (
                <tr key={c.id}>
                  <td>#{c.id}</td>
                  <td>{c.name}</td>
                  <td>{c.area}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
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
              {filteredReports.map((report) => (
                <tr key={report.id}>
                  <td>#{report.id}</td>
                  <td>{report.location}</td>
                  <td>{report.type}</td>
                  <td>{report.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </main>
    </div>
  );
}

export default AdminDashboard;