import "./WasteReports.css";
import p2 from "../../assets/p2.jpg";
import { useState, useEffect } from "react";
import CloseButton from "../CloseButton"; // 👈 reusable button
import API from "../../api/api";
function WasteReports() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState("All");
  const [assigningId, setAssigningId] = useState(null);
  const [reports, setReports] = useState([]);
  const [collectors, setCollectors] = useState([]);

  // ================= LOAD DATA =================
  useEffect(() => {

    const fetchReports = async () => {
      try {

        const res = await API.get("/reports");

        setReports(res.data);

      } catch (error) {
        console.log("Error loading reports");
      }
    };

    const fetchCollectors = async () => {
      try {

        const res = await API.get("/collectors");

        setCollectors(res.data);

      } catch (error) {
        console.log("Error loading collectors");
      }
    };

    fetchReports();
    fetchCollectors();

  }, []);

  // ================= ASSIGN COLLECTOR =================
  const handleAssign = async (reportId, collectorName) => {

    try {

      await API.put(`/reports/assign/${reportId}`, {
        collector: collectorName
      });

      const updatedReports = reports.map(r =>
        r._id === reportId
          ? { ...r, status: "Assigned", collector: collectorName }
          : r
      );

      setReports(updatedReports);

    } catch (error) {
      console.log("Assign error");
    }

  };
  // ================= FILTER =================
  const filteredReports =
    filter === "All"
      ? reports
      : reports.filter((r) => r.status === filter);

  return (
    <div className="admin-content">
      <h1>Waste Reports</h1>

      {/* FILTER */}
      <div className="filter-bar">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Assigned">Assigned</option>
          <option value="Collected">Collected</option>
        </select>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Location</th>
              <th>Type</th>
              <th>Photo</th>
              <th>Cleaned Photo</th>
              <th>Status</th>
              <th>Collector</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredReports.map((report, index) => (
              <tr key={report._id}>
                <td>#{index + 1}</td>
                <td>{report.location}</td>
                <td>{report.wasteType}</td>

                <td>
                  <img
                    src={report.photo}
                    alt="Waste"
                    className="report-image"
                    onClick={() =>
                      setSelectedImage(report.photo)
                    }
                  />
                </td>
                <td>
                  {report.cleanedPhoto ? (
                    <img
                      src={`http://localhost:5000${report.cleanedPhoto}`}
                      alt="Cleaned"
                      className="report-image"
                      onClick={() => setSelectedImage(`http://localhost:5000${report.cleanedPhoto}`)}
                    />
                  ) : (
                    <span style={{ color: "#64748b" }}>No Image</span>
                  )}
                </td>
                <td
                  className={
                    report.status === "Pending"
                      ? "pending"
                      : report.status === "Assigned"
                        ? "assigned"
                        : "collected"
                  }
                >
                  {report.status}
                </td>

                <td>{report.collector || "-"}</td>

                <td>
                  {report.status === "Pending" ? (
                    assigningId === report._id ? (
                      <select
                        onChange={(e) =>
                          handleAssign(
                            report._id,
                            e.target.value
                          )
                        }
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Select Collector
                        </option>

                        {collectors
                          .filter(
                            (col) =>
                              col.status === "Available"
                          )
                          .map((col) => (
                            <option
                              key={col._id}
                              value={col.name}
                            >
                              {col.name}
                            </option>
                          ))}
                      </select>
                    ) : (
                      <button
                        className="assign-btn"
                        onClick={() =>
                          setAssigningId(report._id)
                        }
                      >
                        Assign
                      </button>
                    )
                  ) : report.status === "Assigned" ? (
                    <span
                      style={{
                        color: "orange",
                        fontWeight: "600",
                      }}
                    >
                      In Progress
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* IMAGE MODAL */}
        {/* IMAGE MODAL */}
        {selectedImage && (
          <div
            className="image-modal"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="image-box"
              onClick={(e) => e.stopPropagation()}
            >
              <CloseButton onClick={() => setSelectedImage(null)} />

              <img
                src={selectedImage}
                alt="Full View"
                className="modal-image"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WasteReports;