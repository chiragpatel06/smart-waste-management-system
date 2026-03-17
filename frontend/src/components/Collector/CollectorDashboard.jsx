import { useState, useEffect } from "react";
import "./CollectorDashboard.css";
import { Truck, CheckCircle, MapPin, ClipboardList, Calendar, Layers } from "lucide-react";
import CloseButton from "../CloseButton";
import API from "../../api/api";


function CollectorDashboard() {
  const [reports, setReports] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [cleanedImages, setCleanedImages] = useState({});

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
          <div className="header-icon-box">
            <Truck size={24} />
          </div>
          <h2 className="header-main-title">Collector Dashboard</h2>
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
                  <th className="collector-table-th">Photo</th>
                  <th className="collector-table-th">Collector</th>
                  <th className="collector-table-th">Location</th>
                  <th className="collector-table-th">Type</th>
                  <th className="collector-table-th">Date</th>
                  <th className="collector-table-th">Status</th>
                  <th className="collector-table-th">Cleaned Photo</th>
                  <th className="collector-table-th">Action</th>
                </tr>
              </thead>
              <tbody>
                {assignedReports.map((report, index) => (
                  <tr key={report._id} className="collector-table-row">
                    <td className="collector-table-td id-cell">#{index + 1}</td>
                    <td className="collector-table-td">
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
                        <MapPin size={14} className="icon-sub" /> {report.location}
                      </div>
                    </td>
                    <td className="collector-table-td">{report.wasteType}</td>
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
                    <td className="collector-table-td">
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
                    <td className="collector-table-td">
                      <div className="collector-action-box">

                        <input
                          type="file"
                          accept="image/*"
                          id={`clean-${report._id}`}
                          hidden
                          onChange={(e) => handleFileChange(report._id, e.target.files[0])}
                        />

                        <label htmlFor={`clean-${report._id}`} className="upload-clean-btn">
                          Upload
                        </label>

                        <button
                          className="complete-btn"
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
                  <th className="collector-table-th">Cleaned Photo</th>
                  <th className="collector-table-th">Status</th>
                </tr>
              </thead>
              <tbody>
                {completedReports.map((report, index) => (
                  <tr key={report._id} className="collector-table-row">
                    <td className="collector-table-td id-cell">#{index + 1}</td>
                    <td className="collector-table-td fw-600">{report.collector}</td>
                    <td className="collector-table-td location-cell">{report.location?.replaceAll(",", ", ")}</td>
                    <td className="collector-table-td">{report.wasteType}</td>

                    <td className="collector-table-td date-cell">{new Date(report.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    })}</td>

                    <td className="collector-table-td">
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

      {selectedImage && (
        <div
          className="collector-image-modal"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="collector-image-box"
            onClick={(e) => e.stopPropagation()}
          >
            <CloseButton onClick={() => setSelectedImage(null)} />

            <img
              src={selectedImage}
              alt="Preview"
              className="collector-modal-image"
            />

          </div>
        </div>
      )}
    </div>
  );
}

export default CollectorDashboard;