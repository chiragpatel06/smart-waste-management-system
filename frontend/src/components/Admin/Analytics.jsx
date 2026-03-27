import { useState, useEffect } from "react";
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
  ChevronRight
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
    const matchesSearch = (report.collector?.toLowerCase().includes(search.toLowerCase()) || report._id?.includes(search));
    const matchesStatus = statusFilter === "All" || report.status === statusFilter;
    const matchesCollector = collectorFilter === "All" || report.collector === collectorFilter;
    const matchesCard = cardFilter === "All" || report.status === cardFilter;
    return matchesSearch && matchesStatus && matchesCollector && matchesCard;
  });

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
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="filter-chips">
            <div className={`chip ${statusFilter === 'All' ? 'active' : ''}`} onClick={() => setStatusFilter('All')}>All</div>
            <div className={`chip ${statusFilter === 'Pending' ? 'active' : ''}`} onClick={() => setStatusFilter('Pending')}>Pending</div>
            <div className={`chip ${statusFilter === 'Collected' ? 'active' : ''}`} onClick={() => setStatusFilter('Collected')}>Collected</div>
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
          onClick={() => setCardFilter("All")}
        />
        <StatCard 
          title="Pending" 
          value={reports.filter(r => r.status === "Pending").length} 
          icon={<Clock color="#f59e0b" />} 
          subtitle="Awaiting action"
          color="warning"
          onClick={() => setCardFilter("Pending")}
        />
        <StatCard 
          title="Collected" 
          value={reports.filter(r => r.status === "Collected").length} 
          icon={<CheckCircle color="#10b981" />} 
          subtitle="Completed tasks"
          color="success"
          onClick={() => setCardFilter("Collected")}
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
                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                    <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={60} />
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
                    <Tooltip />
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
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Report Info</th>
                  <th>Waste Type</th>
                  <th>Collector</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.length > 0 ? (
                  filteredReports.slice(0, 8).map((report) => (
                    <tr key={report._id}>
                      <td>
                        <div className="id-cell">
                          <span className="id-text">#{report._id.slice(-6)}</span>
                          <span className="loc-text"><MapPin size={12} /> {report.location || 'Unknown'}</span>
                        </div>
                      </td>
                      <td>
                        <span className="waste-tag">
                          <Trash2 size={14} /> {report.wasteType}
                        </span>
                      </td>
                      <td className="collector-cell">
                        <div className="mini-avatar">{getInitials(report.collector || 'U')}</div>
                        {report.collector || 'Unassigned'}
                      </td>
                      <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`status-pill ${report.status.toLowerCase()}`}>
                          {report.status}
                        </span>
                      </td>
                      <td><ChevronRight size={18} className="row-arrow" /></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="empty-state">
                      <div className="empty-content">
                        <Filter size={48} />
                        <p>No reports found matching your criteria</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="table-footer">
              <p>Showing {Math.min(filteredReports.length, 8)} of {filteredReports.length} records</p>
              <button className="outline-btn">Download Report</button>
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