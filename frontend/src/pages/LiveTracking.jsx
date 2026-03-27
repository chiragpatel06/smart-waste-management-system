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
import API from "../api/api";


function LiveTracking() {
  const [reportsData, setReportsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedReport, setSelectedReport] = useState(null);
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);
  const [showImage, setShowImage] = useState(null);
  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/300"; // fallback

    if (path.startsWith("http")) return path;

    return `http://localhost:5000/${path.replace(/^\/+/, "")}`;
  };


  useEffect(() => {
    const fetchReports = async () => {
      try {


        const res = await API.get("/reports/my-reports");

        setReportsData(res.data);
      } catch (error) {
        console.log("Error fetching reports", error);
      }
    };

    fetchReports();
  }, []);
  // ✅ Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 3;

  // ✅ Filter Logic
  const filteredReports = reportsData.filter((report) => {
    const matchesSearch =
      report.wasteType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report._id.toString().includes(searchTerm);

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
      case "Pending":
        return { color: "#64748b", icon: <Clock size={16} />, class: "status-pending" };
      default:
        return { color: "#64748b", icon: <Clock size={16} />, class: "" };
    }
  };
  const getStep = (status) => {
    if (status === "Pending") return 1;
    if (status === "Assigned") return 2;
    if (status === "Out for Collection") return 3;
    if (status === "Collected") return 4;
    return 1;
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
                key={report._id}
                className={`report-item ${selectedReport?.id === report._id ? "selected" : ""}`}
                onClick={() => handleSelectReport(report)}
              >
                <div
                  className="status-indicator"
                  style={{ backgroundColor: config.color }}
                ></div>

                <div className="item-content">
                  <div className="item-top">
                    <span className="report-id">#{report._id.slice(-6)}</span>
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

            {/* IMPROVED BEFORE & AFTER SECTION */}
            <div className="comparison-grid">
              {/* BEFORE CLEANING CARD */}
              <div className="comparison-card before">
                <div className="comparison-badge">
                  <Clock size={14} />
                  <span>Before / पहले</span>
                </div>
                <div className="img-wrapper">
                  <img
                    src={getImageUrl(selectedReport.photo)}
                    alt="Before Cleaning"
                    onClick={() => setShowImage("before")}   // ✅ ADD THIS
                  />
                  <div className="status-bar danger">⚠️ Reported / शिकायत</div>
                </div>
              </div>

              {/* AFTER CLEANING CARD */}
              {selectedReport.cleanedPhoto ? (
                <div className="comparison-card after">
                  <div className="comparison-badge">
                    <CheckCircle size={14} />
                    <span>After / बाद में</span>
                  </div>
                  <div className="img-wrapper">
                    <img
                      src={`http://localhost:5000${selectedReport.cleanedPhoto}`}
                      alt="After Cleaning"
                      onClick={() => setShowImage("after")}
                    />
                    <div className="status-bar success">✅ Cleaned / सफाई सफल</div>
                  </div>
                </div>
              ) : (
                <div className="comparison-card processing">
                  <div className="comparison-badge">
                    <Clock size={14} />
                    <span>Status / स्थिति</span>
                  </div>
                  <div className="processing-placeholder">
                    <div className="pulse-loader"></div>
                    <p>Cleaning in Progress...</p>
                    <span>सफाई चल रही है</span>
                  </div>
                </div>
              )}
            </div>


            {/* 🔥 STEPPER */}
            <div className="stepper">
              {[
                { label: "Submitted", icon: <Trash2 size={18} /> },
                { label: "Assigned", icon: <Clock size={18} /> },
                { label: "On the Way", icon: <Truck size={18} /> },
                { label: "Completed", icon: <CheckCircle size={18} /> }
              ].map((step, idx) => (
                <div
                  key={idx}
                  className={`step-item ${getStep(selectedReport.status) >= idx + 1 ? "completed" : ""
                    }`}
                >
                  <div className="step-node">
                    {getStep(selectedReport.status) >= idx + 1 ? (
                      <CheckCircle size={18} />
                    ) : (
                      step.icon
                    )}
                  </div>
                  <div className="step-label">{step.label}</div>
                  {idx !== 3 && <div className="step-line"></div>}
                </div>
              ))}
            </div>

            {/* 🔥 INFO CARDS */}
            <div className="info-grid">
              <div className="info-card">
                <label>
                  <MapPin size={16} /> Location
                </label>
                <p>{selectedReport.location}</p>
              </div>

              <div className="info-card">
                <label>
                  <Trash2 size={16} /> Waste Type
                </label>
                <p>{selectedReport.wasteType}</p>
              </div>
            </div>
            {showImage && (
              <div className="image-modal" onClick={() => setShowImage(null)}>
                <img
                  src={
                    showImage === "before"
                      ? getImageUrl(selectedReport.photo)
                      : getImageUrl(selectedReport.cleanedPhoto)
                  }
                  alt="Preview"
                />
              </div>
            )}

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