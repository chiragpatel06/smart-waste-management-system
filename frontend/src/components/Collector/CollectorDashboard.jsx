import { useState, useEffect } from "react";
import "./CollectorDashboard.css";
import { Recycle, CheckCircle, MapPin, ClipboardList, Calendar, Layers } from "lucide-react";
import ImagePreview from "../ImagePreview";
import API from "../../api/api";
import LocationModal from "../Admin/LocationModal";


function CollectorDashboard() {
  const [reports, setReports] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [cleanedImages, setCleanedImages] = useState({});
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

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
                {assignedReports.map((report, index) => (
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
              </tbody>
            </table>
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
                {completedReports.map((report, index) => (
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
              </tbody>
            </table>
          </div>
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