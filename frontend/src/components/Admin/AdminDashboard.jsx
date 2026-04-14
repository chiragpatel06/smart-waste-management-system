import React, { useState, useEffect } from "react";
import API from "../../api/api";
import ImagePreview from "../ImagePreview";
import "./AdminDashboard.css";
import {
  ClipboardList,
  CheckCircle,
  Clock,
  Users,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

function AdminDashboard() {

  const [activeCard, setActiveCard] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [reportsData, setReportsData] = useState([]);
  const [collectorsData, setCollectorsData] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  // Add these lines
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const itemsPerPage = isMobile ? 3 : 5;
  const filteredReports = reportsData
    .filter((r) => (activeCard === "All" ? true : r.status === activeCard))
    .filter((r) =>
      r.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.wasteType?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const filteredCollectors = collectorsData.filter((c) =>
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.area?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeData = activeCard === "Collectors" ? filteredCollectors : filteredReports;

  // Pagination Calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = activeData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(activeData.length / itemsPerPage);

  const currentReports = activeCard !== "Collectors" ? currentItems : [];
  const currentCollectors = activeCard === "Collectors" ? currentItems : [];
  // Reset to page 1 when search or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeCard]);




  useEffect(() => {

    const fetchReports = async () => {
      try {
        const res = await API.get("/reports");
        setReportsData(res.data);
      } catch (error) {
        console.log("Error fetching reports");
      }
    };

    const fetchCollectors = async () => {
      try {
        const res = await API.get("/collectors");
        setCollectorsData(res.data);
      } catch (error) {
        console.log("Error fetching collectors");
      }
    };

    fetchReports();
    fetchCollectors();

  }, []);

  return (

    <div className="admin-page-wrapper">

      {/* HEADER */}
      <header className="admin-page-header">

        <div className="admin-page-title-group">
          <h1 className="admin-page-title">Dashboard Overview</h1>
          <p className="admin-page-subtitle">Welcome back, Admin</p>
        </div>

        <div className="admin-header-actions">
          <div className="admin-search-box">
            <Search size={18} className="search-icon" />
            <input
              className="admin-search-input"
              type="text"
              placeholder="Search locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button className="admin-primary-btn">
            <Plus size={18} />
            <span className="admin-btn-text">New Report</span>
          </button>
        </div>
      </header>

      {/* STAT CARDS */}

      <div className="admin-stats-grid">

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


      {/* DATA SECTION */}

      <section className="admin-dashboard-section">

        <div className="admin-section-header">

          <h2 className="admin-section-title">
            Recent Activity
          </h2>

          <div className="admin-view-toggle">

            <button
              className={`admin-toggle-btn ${(activeCard === "All" || activeCard === "Pending" || activeCard === "Collected") ? "active" : ""}`}
              onClick={() => setActiveCard("All")}
            >
              Reports
            </button>

            <button
              className={`admin-toggle-btn ${activeCard === "Collectors" ? "active" : ""}`}
              onClick={() => setActiveCard("Collectors")}
            >
              Collectors
            </button>

          </div>

        </div>


        {/* TABLE */}

        <div className="admin-table-wrapper">

          <table className="admin-table">

            <thead className="admin-table-head">

              {activeCard === "Collectors" ? (

                <tr className="admin-table-row">

                  <th className="admin-table-th">ID</th>
                  <th className="admin-table-th">Name</th>
                  <th className="admin-table-th">Area</th>
                  <th className="admin-table-th">Status</th>

                </tr>

              ) : (

                <tr className="admin-table-row">

                  <th className="admin-table-th">ID</th>
                  <th className="admin-table-th">Location</th>
                  <th className="admin-table-th">Category</th>
                  <th className="admin-table-th">Photo</th>
                  <th className="admin-table-th">Cleaned</th>
                  <th className="admin-table-th">Status</th>

                </tr>

              )}

            </thead>


            <tbody className="admin-table-body">
              {activeCard === "Collectors"
                ? currentCollectors.map((collector, index) => (
                  <tr className="admin-table-row" key={collector._id}>
                    <td className="admin-table-td">#{indexOfFirstItem + index + 1}</td>
                    <td className="admin-table-td">
                      <strong className="admin-collector-name">{collector.name}</strong>
                    </td>
                    <td className="admin-table-td">{collector.area}</td>
                    <td className="admin-table-td">
                      <span className={`admin-status-badge ${collector.status.toLowerCase().replace(" ", "-")}`}>
                        {collector.status}
                      </span>
                    </td>
                  </tr>
                ))
                : (
                  <>
                    {/* Render Actual Data */}
                    {currentReports.map((report, index) => (
                      <tr className="admin-table-row" key={report._id}>
                        <td className="admin-table-td">#{indexOfFirstItem + index + 1}</td>
                        <td className="admin-table-td">
                          <strong className="admin-location-text">{report.location}</strong>
                        </td>
                        <td className="admin-table-td">{report.wasteType}</td>
                        <td className="admin-table-td">
                          {report.photo ? (
                            <img src={report.photo} alt="Waste" className="admin-mini-img" onClick={() => setSelectedImage(report.photo)} style={{ cursor: "pointer" }} />
                          ) : "-"}
                        </td>
                        <td className="admin-table-td">
                          {report.cleanedPhoto ? (
                            <img src={`http://localhost:5000${report.cleanedPhoto}`} alt="Cleaned" className="admin-mini-img" onClick={() => setSelectedImage(`http://localhost:5000${report.cleanedPhoto}`)} style={{ cursor: "pointer" }} />
                          ) : "-"}
                        </td>
                        <td className="admin-table-td">
                          <span className={`admin-status-badge ${report.status.toLowerCase()}`}>
                            {report.status}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {/* Render Placeholder Rows (Fills the gap to always show 5 rows) */}
                    {currentReports.length < itemsPerPage &&
                      Array.from({ length: itemsPerPage - currentReports.length }).map((_, index) => (
                        <tr key={`empty-${index}`} className="admin-table-row placeholder-row">
                          <td className="admin-table-td">-</td>
                          <td className="admin-table-td"></td>
                          <td className="admin-table-td"></td>
                          <td className="admin-table-td"></td>
                          <td className="admin-table-td"></td>
                          <td className="admin-table-td"></td>
                        </tr>
                      ))
                    }
                  </>
                )
              }
            </tbody>

          </table>
          {activeData.length > itemsPerPage && (
            <div className="admin-pagination">
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} /> {isMobile ? "Prev" : "Previous"}
              </button>

              <div className="pagination-numbers">
                {(() => {
                  let pages = [];
                  if (!isMobile || totalPages <= 3) {
                    pages = [...Array(totalPages)].map((_, i) => i + 1);
                  } else {
                    if (currentPage === 1) pages = [1, 2, 3];
                    else if (currentPage === totalPages) pages = [totalPages - 2, totalPages - 1, totalPages];
                    else pages = [currentPage - 1, currentPage, currentPage + 1];
                  }

                  return pages.map(pageNum => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`pagination-number ${currentPage === pageNum ? "active" : ""}`}
                    >
                      {pageNum}
                    </button>
                  ));
                })()}
              </div>

              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
          <ImagePreview
            image={selectedImage}
            onClose={() => setSelectedImage(null)}
          />

        </div>

      </section>

    </div>
  );
}



function StatCard({ title, count, icon, active, onClick }) {

  return (

    <div
      className={`admin-stat-card ${active ? "admin-stat-active" : ""}`}
      onClick={onClick}
    >

      <div className="admin-stat-icon">
        {icon}
      </div>

      <div className="admin-stat-text">

        <h3 className="admin-stat-title">
          {title}
        </h3>

        <p className="admin-stat-number">
          {count}
        </p>

      </div>

    </div>

  );

}

export default AdminDashboard;