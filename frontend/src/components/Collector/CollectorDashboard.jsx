import { useState, useEffect } from "react";
import "./CollectorDashboard.css";

function CollectorDashboard() {
  const [reports, setReports] = useState([]);
  const [collectors, setCollectors] = useState([]);

  const loggedInCollector = "Rahul Sharma"; // Later login se aayega

  useEffect(() => {
    const savedReports =
      JSON.parse(localStorage.getItem("reports")) || [];
    const savedCollectors =
      JSON.parse(localStorage.getItem("collectors")) || [];

    setReports(savedReports);
    setCollectors(savedCollectors);
  }, []);

  const handleComplete = (reportId) => {
    const updatedReports = reports.map((report) =>
      report.id === reportId
        ? { ...report, status: "Collected" }
        : report
    );

    setReports(updatedReports);
    localStorage.setItem("reports", JSON.stringify(updatedReports));

    // Collector becomes Available
    const updatedCollectors = collectors.map((col) =>
      col.name === loggedInCollector
        ? { ...col, status: "Available" }
        : col
    );

    setCollectors(updatedCollectors);
    localStorage.setItem(
      "collectors",
      JSON.stringify(updatedCollectors)
    );
  };

  const assignedReports = reports.filter(
    (report) =>
      report.status === "Assigned" &&
      report.collector === loggedInCollector
  );

  return (
    <div className="collector-page">
      <h2>Collector Dashboard</h2>

      <div className="collector-table-card">
        {assignedReports.length === 0 ? (
          <p className="no-report">
            No assigned reports
          </p>
        ) : (
          <table className="collector-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Location</th>
                <th>Type</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {assignedReports.map((report) => (
                <tr key={report.id}>
                  <td>#{report.id}</td>
                  <td>{report.location}</td>
                  <td>{report.type}</td>

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
                      Mark Completed
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default CollectorDashboard;