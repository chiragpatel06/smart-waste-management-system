import "./WasteReports.css";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
// 👈 reusable button
import API from "../../api/api";
import ImagePreview from "../ImagePreview";
function WasteReports() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState("All");
  const [assigningId, setAssigningId] = useState(null);
  const [reports, setReports] = useState([]);
  const [collectors, setCollectors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
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
  const filteredReports = reports
    .filter((r) => (filter === "All" ? true : r.status === filter))
    .filter((r) =>
      r.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.wasteType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.collector?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="admin-page-wrapper">

      
      <header className="admin-page-header">
        <div className="admin-page-title-group">
          <h1 className="admin-page-title">Waste Reports</h1>
        </div>

        <div className="admin-header-actions">
          <div className="admin-search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search location, type..."
              className="admin-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-bar">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Assigned">Assigned</option>
              <option value="Collected">Collected</option>
            </select>
          </div>
        </div>
      </header>

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
                    onClick={() => setSelectedImage(report.photo)}
                  />
                </td>
                <td>
                  {report.cleanedPhoto ? (
                    <img
                      src={`http://localhost:5000${report.cleanedPhoto}`}
                      alt="Cleaned"
                      className="report-image"
                      onClick={() =>
                        setSelectedImage(`http://localhost:5000${report.cleanedPhoto}`)
                      }
                    />
                  ) : (
                    <span style={{ color: "#64748b" }}>No Image</span>
                  )}
                </td>

                <td>
                  <span className={`admin-status-badge ${report.status.toLowerCase()}`}>
                    {report.status}
                  </span>
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
        <ImagePreview
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
        {/* IMAGE MODAL */}
        {/* IMAGE MODAL */}

      </div>
    </div>
  );
}

export default WasteReports;