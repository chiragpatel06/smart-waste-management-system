import { useState, useEffect } from "react";
import "./CollectorDashboard.css";
import { Recycle, CheckCircle, MapPin, ClipboardList, Calendar, Layers, ChevronLeft, ChevronRight } from "lucide-react";
import ImagePreview from "../ImagePreview";
import API from "../../api/api";
import LocationModal from "../Admin/LocationModal";


function CollectorDashboard() {
  const [reports, setReports] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [cleanedImages, setCleanedImages] = useState({});
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [currentAssignedPage, setCurrentAssignedPage] = useState(1);
  const [currentCompletedPage, setCurrentCompletedPage] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const reportsPerPage = isMobile ? 3 : 4;

  const extractCity = (address) => {
    if (!address) return "-";
    const parts = address.split(",").map((p) => p.trim());

    if (parts.length >= 4 && /^\d+$/.test(parts[parts.length - 2])) {
      return parts[parts.length - 4];
    }
    if (parts.length >= 3) {
      return parts[parts.length - 3];
    }
    if (parts.length === 2) {
      return parts[0];
    }
    return parts[0] || "-";
  };

  const handleFileChange = (reportId, file) => {
    setCleanedImages({
      ...cleanedImages,
      [reportId]: file
    });
  };
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await API.get("/reports");
        setReports(res.data);
      } catch (error) {
        console.log("Error loading reports");
      }
    };

    fetchReports();
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setSelectedImage(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);



  const handleComplete = async (reportId) => {
    try {
      const formData = new FormData();

      // 👇 yahi hai
      formData.append("cleanedPhoto", cleanedImages[reportId]);

      const res = await API.put(`/reports/complete/${reportId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      const updatedReports = reports.map((r) =>
        r._id === reportId ? res.data : r
      );

      setReports(updatedReports);

    } catch (error) {
      console.log(error);
    }
  };


  const assignedReports = reports.filter((r) => r.status === "Assigned");
  const completedReports = reports.filter((r) => r.status === "Collected");
  const totalReports = assignedReports.length + completedReports.length;
  const completionRate = totalReports === 0 ? 0 : Math.round((completedReports.length / totalReports) * 100);

  // Pagination for Assigned
  const indexOfLastAssigned = currentAssignedPage * reportsPerPage;
  const indexOfFirstAssigned = indexOfLastAssigned - reportsPerPage;
  const currentAssigned = assignedReports.slice(indexOfFirstAssigned, indexOfLastAssigned);
  const totalAssignedPages = Math.ceil(assignedReports.length / reportsPerPage);

  // Pagination for Completed
  const indexOfLastCompleted = currentCompletedPage * reportsPerPage;
  const indexOfFirstCompleted = indexOfLastCompleted - reportsPerPage;
  const currentCompleted = completedReports.slice(indexOfFirstCompleted, indexOfLastCompleted);
  const totalCompletedPages = Math.ceil(completedReports.length / reportsPerPage);

  return (
    <div className="collector-page">
      <div className="collectordas-header">
        <div className="header-title-wrapper">
          <Recycle size={32} className="swachhsetu-logo-icon" />
          <h1 className="header-main-title">SwachhSetu</h1>
          <span className="header-divider">|</span>
          <span className="header-subtitle">Collector Dashboard</span>
        </div>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon-wrapper blue">
            <ClipboardList size={22} />
          </div>
          <div className="stat-info">
            <h3 className="stat-value">{assignedReports.length}</h3>
            <p className="stat-label">Assigned Reports</p>
          </div>
        </div>

        <div className="stat-card success-card">
          <div className="stat-icon-wrapper green">
            <CheckCircle size={22} />
          </div>
          <div className="stat-info">
            <h3 className="stat-value">{completedReports.length}</h3>
            <p className="stat-label">Completed</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper yellow">
            <Layers size={22} />
          </div>
          <div className="stat-info">
            <h3 className="stat-value">{completionRate}%</h3>
            <p className="stat-label">Completion Rate</p>
          </div>
        </div>
      </div>

      <div className="collector-table-card">
        <h3 className="section-title">Assigned Reports</h3>

        {assignedReports.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon-wrapper">
              <CheckCircle size={40} />
            </div>
            <p className="empty-text">No assigned reports 🎉</p>
          </div>
        ) : (
          <div className="table-responsive-wrapper">
            <table className="collector-table">
              <thead>
                <tr className="collector-table-header-row">
                  <th className="collector-table-th">ID</th>
                  <th className="collector-table-th photo-cell">Photo</th>
                  <th className="collector-table-th">Collector</th>
                  <th className="collector-table-th">Location</th>
                  <th className="collector-table-th">Type</th>
                  <th className="collector-table-th">Date</th>
                  <th className="collector-table-th">Status</th>
                  <th className="collector-table-th photo-cell">Cleaned Photo</th>
                  <th className="collector-table-th action-cell">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentAssigned.map((report, index) => (
                  <tr key={report._id} className="collector-table-row">
                    <td className="collector-table-td id-cell">#{index + 1}</td>
                    <td className="collector-table-td photo-cell">
                      {report.photo ? (
                        <img
                          src={report.photo}
                          alt="Waste"
                          className="waste-img"
                          onClick={() => setSelectedImage(report.photo)}
                        />
                      ) : (
                        <span className="no-image-text">No Image</span>
                      )}
                    </td>
                    <td className="collector-table-td fw-600">{report.collector}</td>
                    <td className="collector-table-td location-cell">
                      <div className="location-wrapper">
                        <span
                          className="clickable-city"
                          title="Click here to view full address"
                          onClick={() => {
                            setSelectedLocation(report.location);
                            setIsLocationModalOpen(true);
                          }}
                        >
                          <MapPin size={14} className="cell-location-icon" />
                          {extractCity(report.location)}
                        </span>
                      </div>
                    </td>
                    <td className="collector-table-td type-cell">{report.wasteType}</td>
                    <td className="collector-table-td date-cell">
                      <div className="date-wrapper">
                        <Calendar size={14} className="icon-sub" />
                        {new Date(report.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        })}
                      </div>
                    </td>
                    <td className="collector-table-td">
                      <span className="collector-status-assigned">{report.status}</span>
                    </td>
                    <td className="collector-table-td photo-cell">
                      {report.cleanedPhoto ? (
                        <img
                          src={report.cleanedPhoto}
                          alt="Cleaned"
                          className="waste-img"
                          onClick={() =>
                            setSelectedImage(report.cleanedPhoto)
                          }
                        />
                      ) : cleanedImages[report._id] ? (
                        <img
                          src={URL.createObjectURL(cleanedImages[report._id])}
                          alt="Preview"
                          className="waste-img"
                          onClick={() =>
                            setSelectedImage(URL.createObjectURL(cleanedImages[report._id]))
                          }
                        />
                      ) : (
                        <span className="no-image-text">Not Uploaded</span>
                      )}
                    </td>
                    <td className="collector-table-td action-cell">
                      <div className="collector-action-box">

                        <input
                          type="file"
                          accept="image/*"
                          id={`clean-${report._id}`}
                          hidden
                          onChange={(e) => handleFileChange(report._id, e.target.files[0])}
                        />

                        <label htmlFor={`clean-${report._id}`} className="collector-btn upload-clean-btn">
                          Upload
                        </label>

                        <button
                          className="collector-btn complete-btn"
                          disabled={!cleanedImages[report._id]}
                          onClick={() => handleComplete(report._id)}
                        >
                          Complete
                        </button>

                      </div>
                    </td>
                  </tr>
                ))}
                
                {currentAssigned.length < reportsPerPage &&
                  Array.from({ length: reportsPerPage - currentAssigned.length }).map((_, index) => (
                    <tr key={`empty-assigned-${index}`} className="collector-table-row placeholder-row">
                      <td className="collector-table-td id-cell">-</td>
                      <td className="collector-table-td photo-cell"></td>
                      <td className="collector-table-td"></td>
                      <td className="collector-table-td location-cell"></td>
                      <td className="collector-table-td type-cell"></td>
                      <td className="collector-table-td date-cell"></td>
                      <td className="collector-table-td"></td>
                      <td className="collector-table-td photo-cell"></td>
                      <td className="collector-table-td action-cell"></td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        )}
        
        {assignedReports.length > reportsPerPage && (
          <div className="admin-pagination">
            <button
              className="pagination-btn"
              onClick={() => setCurrentAssignedPage(prev => Math.max(prev - 1, 1))}
              disabled={currentAssignedPage === 1}
            >
              <ChevronLeft size={16} /> {isMobile ? "Prev" : "Previous"}
            </button>

            <div className="pagination-numbers">
              {(() => {
                let pages = [];
                if (!isMobile || totalAssignedPages <= 3) {
                  pages = [...Array(totalAssignedPages)].map((_, i) => i + 1);
                } else {
                  if (currentAssignedPage === 1) pages = [1, 2, 3];
                  else if (currentAssignedPage === totalAssignedPages) pages = [totalAssignedPages - 2, totalAssignedPages - 1, totalAssignedPages];
                  else pages = [currentAssignedPage - 1, currentAssignedPage, currentAssignedPage + 1];
                }

                return pages.map(pageNum => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentAssignedPage(pageNum)}
                    className={`pagination-number ${currentAssignedPage === pageNum ? "active" : ""}`}
                  >
                    {pageNum}
                  </button>
                ));
              })()}
            </div>

            <button
              className="pagination-btn"
              onClick={() => setCurrentAssignedPage(prev => Math.min(prev + 1, totalAssignedPages))}
              disabled={currentAssignedPage === totalAssignedPages}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {completedReports.length > 0 && (
        <div className="collector-table-card">
          <h3 className="section-title">Completed Reports</h3>
          <div className="table-responsive-wrapper">
            <table className="collector-table">
              <thead>
                <tr className="collector-table-header-row">
                  <th className="collector-table-th">ID</th>
                  <th className="collector-table-th">Collector</th>
                  <th className="collector-table-th">Location</th>
                  <th className="collector-table-th">Type</th>
                  <th className="collector-table-th">Date</th>
                  <th className="collector-table-th photo-cell">Cleaned Photo</th>
                  <th className="collector-table-th">Status</th>
                </tr>
              </thead>
              <tbody>
                {currentCompleted.map((report, index) => (
                  <tr key={report._id} className="collector-table-row">
                    <td className="collector-table-td id-cell">#{index + 1}</td>
                    <td className="collector-table-td fw-600">{report.collector}</td>
                    <td className="collector-table-td location-cell">
                      <div className="location-wrapper">
                        <span
                          className="clickable-city"
                          title="Click here to view full address"
                          onClick={() => {
                            setSelectedLocation(report.location);
                            setIsLocationModalOpen(true);
                          }}
                        >
                          <MapPin size={14} className="cell-location-icon" />
                          {extractCity(report.location)}
                        </span>
                      </div>
                    </td>
                    <td className="collector-table-td type-cell">{report.wasteType}</td>

                    <td className="collector-table-td date-cell">
                      <div className="date-wrapper">
                        <Calendar size={14} className="icon-sub" />
                        {new Date(report.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        })}
                      </div>
                    </td>

                    <td className="collector-table-td photo-cell">
                      {report.cleanedPhoto ? (
                        <img
                          src={`http://localhost:5000${report.cleanedPhoto}`}
                          alt="Cleaned"
                          className="waste-img"
                          onClick={() =>
                            setSelectedImage(`http://localhost:5000${report.cleanedPhoto}`)
                          }
                        />
                      ) : (
                        <span className="no-image-text">No Image</span>
                      )}
                    </td>
                    <td className="collector-table-td">
                      <span className="status-completed">Collected</span>
                    </td>
                  </tr>
                ))}
                
                {currentCompleted.length < reportsPerPage &&
                  Array.from({ length: reportsPerPage - currentCompleted.length }).map((_, index) => (
                    <tr key={`empty-completed-${index}`} className="collector-table-row placeholder-row">
                      <td className="collector-table-td id-cell">-</td>
                      <td className="collector-table-td"></td>
                      <td className="collector-table-td location-cell"></td>
                      <td className="collector-table-td type-cell"></td>
                      <td className="collector-table-td date-cell"></td>
                      <td className="collector-table-td photo-cell"></td>
                      <td className="collector-table-td"></td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
          
          {completedReports.length > reportsPerPage && (
            <div className="admin-pagination">
              <button
                className="pagination-btn"
                onClick={() => setCurrentCompletedPage(prev => Math.max(prev - 1, 1))}
                disabled={currentCompletedPage === 1}
              >
                <ChevronLeft size={16} /> {isMobile ? "Prev" : "Previous"}
              </button>

              <div className="pagination-numbers">
                {(() => {
                  let pages = [];
                  if (!isMobile || totalCompletedPages <= 3) {
                    pages = [...Array(totalCompletedPages)].map((_, i) => i + 1);
                  } else {
                    if (currentCompletedPage === 1) pages = [1, 2, 3];
                    else if (currentCompletedPage === totalCompletedPages) pages = [totalCompletedPages - 2, totalCompletedPages - 1, totalCompletedPages];
                    else pages = [currentCompletedPage - 1, currentCompletedPage, currentCompletedPage + 1];
                  }

                  return pages.map(pageNum => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentCompletedPage(pageNum)}
                      className={`pagination-number ${currentCompletedPage === pageNum ? "active" : ""}`}
                    >
                      {pageNum}
                    </button>
                  ));
                })()}
              </div>

              <button
                className="pagination-btn"
                onClick={() => setCurrentCompletedPage(prev => Math.min(prev + 1, totalCompletedPages))}
                disabled={currentCompletedPage === totalCompletedPages}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      <ImagePreview
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
      <LocationModal
        address={selectedLocation}
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />
    </div>
  );
}

export default CollectorDashboard;