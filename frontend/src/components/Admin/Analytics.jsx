import { useState } from "react";
import "./Analytics.css";

function Analytics() {
  const [view, setView] = useState("visual");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [collectorFilter, setCollectorFilter] = useState("All");
  const [cardFilter, setCardFilter] = useState("All");

  const [reports] = useState([
    { id: 1, status: "Pending", collector: "Rahul" },
    { id: 2, status: "Collected", collector: "Amit" },
    { id: 3, status: "Pending", collector: "Rahul" },
    { id: 4, status: "Collected", collector: "Amit" },
    { id: 5, status: "Collected", collector: "Rahul" },
    { id: 6, status: "Pending", collector: "Amit" },
  ]);

  const collectors = [...new Set(reports.map(r => r.collector))];

  // 🔥 FILTER LOGIC
  const filteredReports = reports.filter(report => {
    const matchesSearch =
      report.collector.toLowerCase().includes(search.toLowerCase()) ||
      report.id.toString().includes(search);

    const matchesStatus =
      statusFilter === "All" || report.status === statusFilter;

    const matchesCollector =
      collectorFilter === "All" || report.collector === collectorFilter;

    const matchesCard =
      cardFilter === "All" || report.status === cardFilter;

    return matchesSearch && matchesStatus && matchesCollector && matchesCard;
  });

  const totalReports = filteredReports.length;
  const pendingReports = filteredReports.filter(r => r.status === "Pending").length;
  const collectedReports = filteredReports.filter(r => r.status === "Collected").length;

  const pendingPercent = totalReports
    ? (pendingReports / totalReports) * 100
    : 0;

  const collectedPercent = totalReports
    ? (collectedReports / totalReports) * 100
    : 0;

  // 🔥 ADVANCED COLLECTOR STATS
  const collectorStats = filteredReports.reduce((acc, report) => {
    if (!acc[report.collector]) {
      acc[report.collector] = { total: 0, Pending: 0, Collected: 0 };
    }

    acc[report.collector].total++;
    acc[report.collector][report.status]++;

    return acc;
  }, {});

  const rankedCollectors = Object.entries(collectorStats).sort(
    (a, b) => b[1].total - a[1].total
  );

  const topCollector = rankedCollectors[0];

  const handleCardClick = (type) => {
    setCardFilter(type);
    setView("table");
  };

  return (
    <div className="admin-page">
      <main className="admin-content">
        <h1>Analytics Dashboard</h1>

        {/* SEARCH + FILTER */}
        <div className="filter-section">
          <input
            type="text"
            placeholder="Search by ID or Collector..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Collected">Collected</option>
          </select>

          <select value={collectorFilter} onChange={(e) => setCollectorFilter(e.target.value)}>
            <option value="All">All Collectors</option>
            {collectors.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>

        {/* CLICKABLE CARDS */}
        <div className="analytics-cards">
          <div className="analytics-card" onClick={() => handleCardClick("All")}>
            <h3>Total Reports</h3>
            <p>{reports.length}</p>
          </div>

          <div className="analytics-card" onClick={() => handleCardClick("Pending")}>
            <h3>Pending</h3>
            <p className="pending">
              {reports.filter(r => r.status === "Pending").length}
            </p>
          </div>

          <div className="analytics-card" onClick={() => handleCardClick("Collected")}>
            <h3>Collected</h3>
            <p className="collected">
              {reports.filter(r => r.status === "Collected").length}
            </p>
          </div>
        </div>

        {/* TOGGLE */}
        <div className="toggle-buttons">
          <button
            className={view === "visual" ? "active" : ""}
            onClick={() => setView("visual")}
          >
            Visual Representation
          </button>

          <button
            className={view === "table" ? "active" : ""}
            onClick={() => setView("table")}
          >
            Table Records
          </button>
        </div>

        {/* VISUAL MODE */}
        {view === "visual" && (
          <div className="overview-card">
            <h2>Waste Reports Overview</h2>

            <div className="chart-container">
              <div className="chart-item">
                <div
                  className="chart-bar pending-bar"
                  style={{ height: `${pendingPercent}%` }}
                >
                  <span>{pendingPercent.toFixed(0)}%</span>
                </div>
                <p>Pending</p>
              </div>

              <div className="chart-item">
                <div
                  className="chart-bar collected-bar"
                  style={{ height: `${collectedPercent}%` }}
                >
                  <span>{collectedPercent.toFixed(0)}%</span>
                </div>
                <p>Collected</p>
              </div>
            </div>
          </div>
        )}

        {/* TABLE MODE */}
        {view === "table" && (
          <>
            <div className="table-card">
              <h2>Report Records</h2>

              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Status</th>
                    <th>Collector</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map(report => (
                    <tr key={report.id}>
                      <td>{report.id}</td>
                      <td>{report.status}</td>
                      <td>{report.collector}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 🔥 ADVANCED COLLECTOR PERFORMANCE */}
            <div className="collector-card">
              <h2>Collector Performance</h2>

              {topCollector && (
                <div className="top-performer">
                  🏆 Top Performer: <strong>{topCollector[0]}</strong> ({topCollector[1].total} Reports)
                </div>
              )}

              {rankedCollectors.map(([name, stats], index) => (
                <div key={name} className="collector-item-advanced">

                  <div className="collector-header">
                    <span className="rank-badge">#{index + 1}</span>
                    <span className="collector-name">{name}</span>
                    <span className="collector-total">{stats.total} Reports</span>
                  </div>

                  <div className="collector-breakdown">
                    <span className="collected-text">✔ {stats.Collected} Collected</span>
                    <span className="pending-text">⏳ {stats.Pending} Pending</span>
                  </div>

                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${(stats.total / reports.length) * 100}%` }}
                    ></div>
                  </div>

                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default Analytics;