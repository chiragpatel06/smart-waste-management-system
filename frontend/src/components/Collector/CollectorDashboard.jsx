import { useState, useEffect } from "react";
import "./CollectorDashboard.css";
import { Truck, CheckCircle, MapPin, ClipboardList } from "lucide-react";
import CloseButton from "../CloseButton";

function CollectorDashboard() {
  const [reports, setReports] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    let savedReports =
      JSON.parse(localStorage.getItem("reports")) || [];

    if (savedReports.length === 0) {
      savedReports = [
        {
          id: 101,
          location: "MG Road, Ahmedabad",
          type: "Plastic Waste",
          status: "Assigned",
          date: "23 Feb 2026",
          collector: "Rahul Sharma",
          photo:
            "https://images.unsplash.com/photo-1581578731548-c64695cc6952",
        },
        {
          id: 102,
          location: "Satellite Area",
          type: "Organic Waste",
          status: "Assigned",
          date: "22 Feb 2026",
          collector: "Sushil Kumar",
          photo:
            "https://images.unsplash.com/photo-1604187351574-c75ca79f5807",
        },
        {
          id: 103,
          location: "Navrangpura",
          type: "Mixed Waste",
          status: "Collected",
          date: "21 Feb 2026",
          collector: "Rahul Sharma",
          photo:
            "https://images.unsplash.com/photo-1595278069441-2cf29f8005a4",
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
      report.id === reportId
        ? { ...report, status: "Collected" }
        : report
    );

    setReports(updatedReports);
    localStorage.setItem("reports", JSON.stringify(updatedReports));
  };

  const assignedReports = reports.filter(
    (r) => r.status === "Assigned"
  );

  const completedReports = reports.filter(
    (r) => r.status === "Collected"
  );

  const totalReports =
    assignedReports.length + completedReports.length;

  const completionRate =
    totalReports === 0
      ? 0
      : Math.round(
        (completedReports.length / totalReports) * 100
      );

  return (
    <div className="collector-page">
      <div className="collectordas-header">
        <Truck size={26} />
        <h2>Collector Dashboard</h2>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <ClipboardList size={22} />
          <div>
            <h3>{assignedReports.length}</h3>
            <p>Assigned Reports</p>
          </div>
        </div>

        <div className="stat-card success">
          <CheckCircle size={22} />
          <div>
            <h3>{completedReports.length}</h3>
            <p>Completed</p>
          </div>
        </div>

        <div className="stat-card">
          <CheckCircle size={22} />
          <div>
            <h3>{completionRate}%</h3>
            <p>Completion Rate</p>
          </div>
        </div>
      </div>

      <div className="collector-table-card">
        <h3 className="section-title">Assigned Reports</h3>

        {assignedReports.length === 0 ? (
          <div className="empty-state">
            <CheckCircle size={40} />
            <p>No assigned reports 🎉</p>
          </div>
        ) : (
          <table className="collector-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Photo</th>
                <th>Collector</th>
                <th>Location</th>
                <th>Type</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {assignedReports.map((report) => (
                <tr key={report.id}>
                  <td>#{report.id}</td>

                  <td>
                    {report.photo ? (
                      <img
                        src={report.photo}
                        alt="Waste"
                        className="waste-img"
                        onClick={() =>
                          setSelectedImage(report.photo)
                        }
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>

                  <td>{report.collector}</td>

                  <td>
                    <MapPin size={14} /> {report.location}
                  </td>

                  <td>{report.type}</td>
                  <td>{report.date}</td>

                  <td>
                    <span className="status-assigned">
                      {report.status}
                    </span>
                  </td>

                  <td>
                    <button
                      className="complete-btn"
                      onClick={() =>
                        handleComplete(report.id)
                      }
                    >
                      Complete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {completedReports.length > 0 && (
        <div className="collector-table-card">
          <h3 className="section-title">
            Completed Reports
          </h3>

          <table className="collector-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Collector</th>
                <th>Location</th>
                <th>Type</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {completedReports.map((report) => (
                <tr key={report.id}>
                  <td>#{report.id}</td>
                  <td>{report.collector}</td>
                  <td>{report.location}</td>
                  <td>{report.type}</td>
                  <td>{report.date}</td>
                  <td>
                    <span className="status-completed">
                      Collected
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* IMAGE MODAL */}
      {/* IMAGE MODAL */}
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
              alt="Zoomed Waste"
              className="collector-modal-image"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default CollectorDashboard;