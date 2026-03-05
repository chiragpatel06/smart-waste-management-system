import { useState, useEffect } from "react";
import "./CollectorDashboard.css";
import { Truck, CheckCircle, MapPin, ClipboardList, Calendar, Layers } from "lucide-react";
import CloseButton from "../CloseButton";

function CollectorDashboard() {
  const [reports, setReports] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    let savedReports = JSON.parse(localStorage.getItem("reports")) || [];
    if (savedReports.length === 0) {
      savedReports = [
        {
          id: 101,
          location: "MG Road, Ahmedabad",
          type: "Plastic Waste",
          status: "Assigned",
          date: "23 Feb 2026",
          collector: "Rahul Sharma",
          photo: "https://images.unsplash.com/photo-1581578731548-c64695cc6952",
        },
        {
          id: 102,
          location: "Satellite Area",
          type: "Organic Waste",
          status: "Assigned",
          date: "22 Feb 2026",
          collector: "Sushil Kumar",
          photo: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807",
        },
        {
          id: 103,
          location: "Navrangpura",
          type: "Mixed Waste",
          status: "Collected",
          date: "21 Feb 2026",
          collector: "Rahul Sharma",
          photo: "https://images.unsplash.com/photo-1595278069441-2cf29f8005a4",
        },
      ];
      localStorage.setItem("reports", JSON.stringify(savedReports));
    }
    setReports(savedReports);
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setSelectedImage(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleComplete = (reportId) => {
    const updatedReports = reports.map((report) =>
      report.id === reportId ? { ...report, status: "Collected" } : report
    );
    setReports(updatedReports);
    localStorage.setItem("reports", JSON.stringify(updatedReports));
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
                  <th className="collector-table-th">Action</th>
                </tr>
              </thead>
              <tbody>
                {assignedReports.map((report) => (
                  <tr key={report.id} className="collector-table-row">
                    <td className="collector-table-td id-cell">#{report.id}</td>
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
                    <td className="collector-table-td">{report.type}</td>
                    <td className="collector-table-td date-cell">
                        <div className="date-wrapper">
                            <Calendar size={14} className="icon-sub" /> {report.date}
                        </div>
                    </td>
                    <td className="collector-table-td">
                      <span className="status-assigned">{report.status}</span>
                    </td>
                    <td className="collector-table-td">
                      <button className="complete-btn" onClick={() => handleComplete(report.id)}>
                        Complete
                      </button>
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
                  <th className="collector-table-th">Status</th>
                </tr>
              </thead>
              <tbody>
                {completedReports.map((report) => (
                  <tr key={report.id} className="collector-table-row">
                    <td className="collector-table-td id-cell">#{report.id}</td>
                    <td className="collector-table-td fw-600">{report.collector}</td>
                    <td className="collector-table-td location-cell">{report.location}</td>
                    <td className="collector-table-td">{report.type}</td>
                    <td className="collector-table-td date-cell">{report.date}</td>
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
        <div className="collector-image-modal" onClick={() => setSelectedImage(null)}>
          <div className="collector-image-box" onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={() => setSelectedImage(null)} />
            <img src={selectedImage} alt="Zoomed Waste" className="collector-modal-image" />
          </div>
        </div>
      )}
    </div>
  );
}

export default CollectorDashboard;