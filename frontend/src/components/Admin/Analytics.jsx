import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import API from "../../api/api";
import "./Analytics.css";
import {
  Search,
  TrendingUp,
  Clock,
  CheckCircle,
  BarChart3,
  Filter,
  Award,
  Calendar,
  MapPin,
  Trash2,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

function Analytics() {
  const [view, setView] = useState("visual");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [collectorFilter, setCollectorFilter] = useState("All");
  const [cardFilter, setCardFilter] = useState("All");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 8;

  useEffect(() => {
    // Reset to first page when filtering
    setCurrentPage(1);
  }, [search, statusFilter, collectorFilter, cardFilter]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await API.get("/reports");
        setReports(res.data);
      } catch (error) {
        console.error("Error loading reports");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  // Data Calculations
  const now = new Date();
  const oneMonthReports = reports.filter(r => (now - new Date(r.createdAt)) / 86400000 <= 30);
  const prevMonthReports = reports.filter(r => {
    const d = (now - new Date(r.createdAt)) / 86400000;
    return d > 30 && d <= 60;
  });

  const growth = oneMonthReports.length - prevMonthReports.length;
  const growthType = growth >= 0 ? "positive" : "negative";

  // Chart Data Preparation
  const statusData = [
    { name: "Pending", value: reports.filter(r => r.status === "Pending").length, fill: "#f59e0b" },
    { name: "Collected", value: reports.filter(r => r.status === "Collected").length, fill: "#10b981" }
  ];

  const categoryCounts = reports.reduce((acc, r) => {
    acc[r.wasteType] = (acc[r.wasteType] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));
  const COLORS = ["#3b82f6", "#6366f1", "#8b5cf6", "#ec4899", "#f43f5e"];

  // Filter Logic
  const filteredReports = reports.filter(report => {
    const searchLower = search.toLowerCase();
    const matchesSearch = (
      report.collector?.toLowerCase()?.includes(searchLower) ||
      report.location?.toLowerCase()?.includes(searchLower) ||
      report.wasteType?.toLowerCase()?.includes(searchLower) ||
      report._id?.includes(searchLower)
    );
    const matchesStatus = statusFilter === "All" || report.status === statusFilter;
    const matchesCollector = collectorFilter === "All" || report.collector === collectorFilter;
    const matchesCard = cardFilter === "All" || report.status === cardFilter;
    return matchesSearch && matchesStatus && matchesCollector && matchesCard;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredReports.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredReports.slice(indexOfFirstRecord, indexOfLastRecord);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Collector Performance Logic
  const collectorStats = reports.reduce((acc, r) => {
    if (!r.collector) return acc;
    if (!acc[r.collector]) acc[r.collector] = { total: 0, Collected: 0, Pending: 0 };
    acc[r.collector].total++;
    acc[r.collector][r.status]++;
    return acc;
  }, {});

  const rankedCollectors = Object.entries(collectorStats)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 5);

  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  const handleDownload = () => {
    const headers = ["Report ID", "Location", "Waste Type", "Collector", "Date", "Status"];
    const rows = filteredReports.map(report => [
      report._id,
      `"${(report.location || '').replace(/"/g, '""')}"`, // Escape quotes and wrap in quotes
      report.wasteType,
      report.collector || 'Unassigned',
      new Date(report.createdAt).toLocaleDateString(),
      report.status
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "reports.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Report downloaded successfully");
  };

  return (
    <div className="analytics-container">
      {/* HEADER SECTION */}
      <header className="analytics-header">
        <div className="title-section">
          <h1 className="main-title">Analytics Overview</h1>
          <p className="sub-title">Monitor waste collection performance and trends</p>
        </div>

        <div className="action-bar">
          <div className="modern-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search reports..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setView("table");
              }}
            />
          </div>

          <div className="filter-chips">
            <div className={`chip ${statusFilter === 'All' ? 'active' : ''}`} onClick={() => { setStatusFilter('All'); setView("table"); }}>All</div>
            <div className={`chip ${statusFilter === 'Pending' ? 'active' : ''}`} onClick={() => { setStatusFilter('Pending'); setView("table"); }}>Pending</div>
            <div className={`chip ${statusFilter === 'Collected' ? 'active' : ''}`} onClick={() => { setStatusFilter('Collected'); setView("table"); }}>Collected</div>
          </div>
        </div>
      </header>

      {/* STATS GRID */}
      <div className="stats-grid">
        <StatCard
          title="Total Reports"
          value={reports.length}
          icon={<BarChart3 color="#3b82f6" />}
          subtitle="Lifetime volume"
          trend="+12% from last month"
          onClick={() => { setCardFilter("All"); setView("table"); }}
        />
        <StatCard
          title="Pending"
          value={reports.filter(r => r.status === "Pending").length}
          icon={<Clock color="#f59e0b" />}
          subtitle="Awaiting action"
          color="warning"
          onClick={() => { setCardFilter("Pending"); setView("table"); }}
        />
        <StatCard
          title="Collected"
          value={reports.filter(r => r.status === "Collected").length}
          icon={<CheckCircle color="#10b981" />}
          subtitle="Completed tasks"
          color="success"
          onClick={() => { setCardFilter("Collected"); setView("table"); }}
        />
        <StatCard
          title="Monthly Growth"
          value={growth >= 0 ? `+${growth}` : growth}
          icon={<TrendingUp color="#8b5cf6" />}
          subtitle="Last 30 days"
          trend={growthType === "positive" ? "Trending Up" : "Trending Down"}
          color="purple"
        />
      </div>

      {/* VIEW TOGGLE */}
      <div className="view-switcher">
        <button className={view === "visual" ? "active" : ""} onClick={() => setView("visual")}>
          <BarChart3 size={18} /> Visual Insights
        </button>
        <button className={view === "table" ? "active" : ""} onClick={() => setView("table")}>
          <Calendar size={18} /> Detailed Records
        </button>
      </div>

      <div className="analytics-content">
        {view === "visual" ? (
          <div className="visual-grid">
            {/* CHARTS */}
            <div className="chart-card main-chart">
              <h3>Reports Distribution</h3>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={statusData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip
                      cursor={{ fill: 'rgba(241,245,249,0.5)' }}
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
                        color: '#f8fafc'
                      }}
                      itemStyle={{ color: '#e2e8f0', fontWeight: 600 }}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="chart-card side-chart">
              <h3>Waste Categories</h3>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
                        color: '#f8fafc'
                      }}
                      itemStyle={{ color: '#e2e8f0', fontWeight: 600 }}
                    />
                    <Legend verticalAlign="bottom" iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* LEADERBOARD */}
            <div className="leaderboard-card">
              <div className="card-header">
                <h3><Award size={20} color="#f59e0b" /> Top Performers</h3>
                <button className="text-btn">View All</button>
              </div>
              <div className="leaderboard-list">
                {rankedCollectors.map(([name, stats], index) => (
                  <div key={name} className="leader-item">
                    <div className="leader-info">
                      <div className="leader-avatar">{getInitials(name)}</div>
                      <div>
                        <p className="leader-name">{name}</p>
                        <p className="leader-sub">{stats.total} assignments</p>
                      </div>
                    </div>
                    <div className="leader-stats">
                      <div className="progress-mini">
                        <div className="progress-label">
                          <span>Efficiency</span>
                          <span>{Math.round((stats.Collected / stats.total) * 100)}%</span>
                        </div>
                        <div className="progress-track">
                          <div className="progress-bar" style={{ width: `${(stats.Collected / stats.total) * 100}%` }}></div>
                        </div>
                      </div>
                      {index === 0 && <span className="top-badge">🏆</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="table-container fade-in">
            <div className="table-scroll-wrapper">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Report Info</th>
                    <th>Waste Type</th>
                    <th>Collector</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: recordsPerPage }).map((_, idx) => (
                      <tr key={`skeleton-${idx}`} className="skeleton-row">
                        <td>
                          <div className="report-info-wrapper">
                            <div className="skeletonloc-icon skeleton" style={{ width: '16px', height: '16px', borderRadius: '50%' }}></div>
                            <div className="skeleton skeleton-text" style={{ width: '80%' }}></div>
                          </div>
                        </td>
                        <td>
                          <div className="skeleton skeleton-text" style={{ width: '60%' }}></div>
                        </td>
                        <td className="collector-td">
                          <div className="collector-flex-container">
                            <div className="skeleton skeleton-avatar"></div>
                            <div className="skeleton skeleton-text" style={{ width: '50%' }}></div>
                          </div>
                        </td>
                        <td>
                          <div className="skeleton skeleton-text" style={{ width: '40%' }}></div>
                        </td>
                        <td>
                          <div className="skeleton skeleton-pill"></div>
                        </td>
                      </tr>
                    ))
                  ) : currentRecords.length > 0 ? (
                    <>
                      {currentRecords.map((report) => (
                        <tr key={report._id}>
                          <td>
                            <div className="report-info-wrapper">
                              <MapPin size={16} className="loc-icon" />
                              <strong className="address-text">
                                {report.location || 'Unknown'}
                              </strong>
                            </div>
                          </td>
                          <td>
                            <span className="waste-tag">
                              <Trash2 size={14} /> {report.wasteType}
                            </span>
                          </td>
                          <td className="collector-td">
                            <div className="collector-flex-container">
                              <div className="mini-avatar">{getInitials(report.collector || 'Unassigned')}</div>
                              <span className="collector-name">{report.collector || 'Unassigned'}</span>
                            </div>
                          </td>
                          <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                          <td>
                            <span className={`status-pill ${report.status?.toLowerCase()}`}>
                              {report.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </>
                  ) : (
                    <tr>
                      <td colSpan="5" className="empty-state">
                        <div className="empty-content">
                          <div className="empty-icon-wrapper">
                            <Filter size={40} strokeWidth={2} />
                          </div>
                          <h3>No Reports Found</h3>
                          <p>We couldn't find any data matching your current filters.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="table-footer">
              <div className="footer-left">
                <p>Showing {indexOfFirstRecord + 1} - {Math.min(indexOfLastRecord, filteredReports.length)} of {filteredReports.length} records</p>
              </div>

              <div className="pagination-controls">
                {totalPages > 1 && (
                  <>
                    <button
                      className="page-btn prev"
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft size={16} />
                      <span>Previous</span>
                    </button>
                    <div className="page-numbers">
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          className={`page-num ${currentPage === i + 1 ? 'active' : ''}`}
                          onClick={() => paginate(i + 1)}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    <button
                      className="page-btn next"
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <span>Next</span>
                      <ChevronRight size={16} />
                    </button>
                  </>
                )}
              </div>

              <button className="outline-btn" onClick={handleDownload}>Download Report</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, subtitle, trend, color, onClick }) {
  return (
    <div className={`modern-stat-card ${color}`} onClick={onClick}>
      <div className="card-top">
        <div className="icon-box">{icon}</div>
        {trend && <span className="trend-label">{trend}</span>}
      </div>
      <div className="card-body">
        <h2 className="stat-value">{value}</h2>
        <p className="stat-title">{title}</p>
        <p className="stat-subtitle">{subtitle}</p>
      </div>
    </div>
  );
}

export default Analytics;