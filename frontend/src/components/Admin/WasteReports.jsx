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
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 5;
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

  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport);
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filter]);

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


      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead className="admin-table-head">
            <tr className="admin-table-row">
              <th className="admin-table-th">ID</th>
              <th className="admin-table-th">Location</th>
              <th className="admin-table-th">Type</th>
              <th className="admin-table-th">Photo</th>
              <th className="admin-table-th">Cleaned Photo</th>
              <th className="admin-table-th">Status</th>
              <th className="admin-table-th">Collector</th>
              <th className="admin-table-th">Action</th>
            </tr>
          </thead>

          <tbody className="admin-table-body">
            {currentReports.map((report, index) => (
              <tr key={report._id} className="admin-table-row">
                <td className="admin-table-td">#{indexOfFirstReport + index + 1}</td>
                <td className="admin-table-td">
                   <strong className="admin-location-text">{report.location}</strong>
                </td>
                <td className="admin-table-td">{report.wasteType}</td>

                <td className="admin-table-td">
                  <img
                    src={report.photo}
                    alt="Waste"
                    className="admin-mini-img"
                    onClick={() => setSelectedImage(report.photo)}
                    style={{ cursor: 'pointer' }}
                  />
                </td>
                <td className="admin-table-td">
                  {report.cleanedPhoto ? (
                    <img
                      src={`http://localhost:5000${report.cleanedPhoto}`}
                      alt="Cleaned"
                      className="admin-mini-img"
                      onClick={() =>
                        setSelectedImage(`http://localhost:5000${report.cleanedPhoto}`)
                      }
                      style={{ cursor: 'pointer' }}
                    />
                  ) : (
                    <span style={{ color: "#94a3b8" }}>No Image</span>
                  )}
                </td>

                <td className="admin-table-td">
                  <span className={`admin-status-badge ${report.status.toLowerCase()}`}>
                    {report.status}
                  </span>
                </td>

                <td className="admin-table-td">{report.collector || "-"}</td>

                <td className="admin-table-td">
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

            {currentReports.length < reportsPerPage &&
              Array.from({ length: reportsPerPage - currentReports.length }).map((_, index) => (
                <tr key={`empty-${index}`} className="admin-table-row placeholder-row">
                  <td className="admin-table-td">-</td>
                  <td className="admin-table-td"></td>
                  <td className="admin-table-td"></td>
                  <td className="admin-table-td"></td>
                  <td className="admin-table-td"></td>
                  <td className="admin-table-td"></td>
                  <td className="admin-table-td"></td>
                  <td className="admin-table-td"></td>
                </tr>
              ))
            }
          </tbody>
        </table>

        {filteredReports.length > reportsPerPage && (
          <div className="admin-pagination">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            <div className="pagination-numbers">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`pagination-number ${currentPage === i + 1 ? "active" : ""}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
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