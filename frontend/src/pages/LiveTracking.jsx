import { useState, useEffect } from "react";
import "./LiveTracking.css";
import {
  Search,
  MapPin,
  Trash2,
  CheckCircle,
  Clock,
  Truck,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const reportsData = [
  { id: 101, location: "Smart City, India", wasteType: "Plastic", status: "Out for Collection", step: 3, image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952" },
  { id: 102, location: "Sector 21, India", wasteType: "Organic", status: "Assigned", step: 2, image: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807" },
  { id: 103, location: "Industrial Zone", wasteType: "E-Waste", status: "Collected", step: 4, image: "https://images.unsplash.com/photo-1581092335397-9583eb92d232" },
  { id: 104, location: "City Center", wasteType: "Plastic", status: "Assigned", step: 2, image: "https://images.unsplash.com/photo-1509099836639-18ba1795216d" },
  { id: 105, location: "Green Park", wasteType: "Organic", status: "Collected", step: 4, image: "https://images.unsplash.com/photo-1524593119774-6c22d0d49f53" }
];

function LiveTracking() {

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedReport, setSelectedReport] = useState(null);
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);

  // ✅ Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 3;

  // ✅ Filter Logic
  const filteredReports = reportsData.filter((report) => {
    const matchesSearch =
      report.wasteType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.id.toString().includes(searchTerm);

    const matchesFilter =
      filterStatus === "All" || report.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  // ✅ Pagination Logic
  const totalPages = Math.ceil(filteredReports.length / recordsPerPage);

  // Auto reset page if invalid
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [filteredReports, totalPages, currentPage]);

  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentReports = filteredReports.slice(indexOfFirst, indexOfLast);

  const handleSelectReport = (report) => {
    setSelectedReport(report);
    setIsMobileDetailOpen(true);
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "Assigned":
        return { color: "#f59e0b", icon: <Clock size={16} />, class: "status-assigned" };
      case "Out for Collection":
        return { color: "#3b82f6", icon: <Truck size={16} />, class: "status-shipping" };
      case "Collected":
        return { color: "#10b981", icon: <CheckCircle size={16} />, class: "status-done" };
      default:
        return { color: "#64748b", icon: <Clock size={16} />, class: "" };
    }
  };

  return (
    <div className="tracking-wrapper">

      {/* LEFT PANEL */}
      <div className={`list-panel ${isMobileDetailOpen ? "hide-on-mobile" : ""}`}>
        <div className="panel-header">
          <h1>My Reports</h1>
          <p>Track your waste collection progress</p>
        </div>

        <div className="controls">
          <div className="search-bar">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search ID or Waste Type..."
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="filter-pill-container">
            {["All", "Assigned", "Out for Collection", "Collected"].map(f => (
              <button
                key={f}
                className={`filter-pill ${filterStatus === f ? "active" : ""}`}
                onClick={() => {
                  setFilterStatus(f);
                  setCurrentPage(1);
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="scroll-area">
          {currentReports.map((report) => {
            const config = getStatusConfig(report.status);

            return (
              <div
                key={report.id}
                className={`report-item ${selectedReport?.id === report.id ? "selected" : ""}`}
                onClick={() => handleSelectReport(report)}
              >
                <div
                  className="status-indicator"
                  style={{ backgroundColor: config.color }}
                ></div>

                <div className="item-content">
                  <div className="item-top">
                    <span className="report-id">#{report.id}</span>
                    <span className={`status-tag ${config.class}`}>
                      {config.icon} {report.status}
                    </span>
                  </div>

                  <h3>{report.wasteType}</h3>
                  <div className="item-loc">
                    <MapPin size={14} /> {report.location}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ✅ Pagination only if more than 3 reports */}
        {filteredReports.length > recordsPerPage && (
          <div className="pagination">

            {/* PREV */}
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="pag-nav"
            >
              Prev
            </button>

            {/* PAGE NUMBERS */}
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`pag-number ${currentPage === index + 1 ? "active" : ""}`}
              >
                {index + 1}
              </button>
            ))}

            {/* NEXT */}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="pag-nav"
            >
              Next
            </button>

          </div>
        )}
      </div>

      {/* RIGHT PANEL */}
      <div className={`detail-panel ${isMobileDetailOpen ? "show-on-mobile" : ""}`}>
        {selectedReport ? (
          <>
            <button
              className="mobile-back"
              onClick={() => setIsMobileDetailOpen(false)}
            >
              <ChevronLeft /> Back
            </button>

            <div className="detail-header">
              <h1>Tracking Status</h1>
              <span className={`large-status ${getStatusConfig(selectedReport.status).class}`}>
                {selectedReport.status}
              </span>
            </div>

            <div className="image-container">
              <img src={selectedReport.image} alt="Waste" />
            </div>
          </>
        ) : (
          <div className="empty-state">
            <Truck size={48} />
            <h2>Select a report to track</h2>
            <p>Choose a report from the left panel</p>
          </div>
        )}
      </div>

    </div>
  );
}

export default LiveTracking;