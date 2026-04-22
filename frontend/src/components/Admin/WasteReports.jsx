import "./WasteReports.css";
import { Search, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import Select from "react-select";
// 👈 reusable button
import API from "../../api/api";
import ImagePreview from "../ImagePreview";
function WasteReports() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState("All");
  const [assigningId, setAssigningId] = useState(null);
  const [selectedCollector, setSelectedCollector] = useState(null);
  const [reports, setReports] = useState([]);
  const [collectors, setCollectors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const reportsPerPage = isMobile ? 3 : 5;
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

      // Update local collector status to Busy so they disappear from available list immediately
      const updatedCollectors = collectors.map(col =>
        col.name === collectorName
          ? { ...col, status: "Busy" }
          : col
      );
      setCollectors(updatedCollectors);

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
    <div className="admin-page-wrapper waste-reports-wrapper">


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
              <th className="admin-table-th">Cleaned</th>
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
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', width: '100%', minWidth: '160px', textAlign: 'left' }}>
                        <div style={{ flex: 1 }}>
                          <Select
                            options={collectors
                              .filter((col) => col.status === "Available")
                              .map((col) => ({ value: col.name, label: col.name }))}
                            onChange={(selectedOption) => {
                              if (!selectedOption) {
                                setAssigningId(null);
                                setSelectedCollector(null);
                              } else {
                                setSelectedCollector(selectedOption);
                              }
                            }}
                            value={selectedCollector}
                            isClearable={true}
                            placeholder="Select"
                            menuPlacement="auto"
                            menuPosition="fixed"
                            styles={{
                              control: (base, state) => ({
                                ...base,
                                padding: '2px',
                                borderRadius: '10px',
                                borderColor: state.isFocused ? '#3C80F3' : '#e2e8f0',
                                backgroundColor: '#ffffff',
                                boxShadow: state.isFocused ? '0 0 0 3px rgba(60, 128, 243, 0.1)' : '0 1px 3px rgba(0,0,0,0.04)',
                                '&:hover': { borderColor: '#cbd5e1' },
                                fontSize: '13.5px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                minHeight: '42px'
                              }),
                              option: (base, state) => ({
                                ...base,
                                backgroundColor: state.isSelected ? '#eff6ff' : state.isFocused ? '#f8fafc' : '#ffffff',
                                color: state.isSelected ? '#2563eb' : '#334155',
                                fontWeight: state.isSelected ? '600' : '500',
                                padding: '10px 14px',
                                cursor: 'pointer',
                                fontSize: '13.5px',
                                borderRadius: '6px',
                                margin: '2px 0'
                              }),
                              singleValue: (base) => ({
                                ...base,
                                color: '#1e293b',
                              }),
                              menu: (base) => ({
                                ...base,
                                borderRadius: '10px',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                                overflow: 'hidden',
                                zIndex: 9999
                              }),
                              menuList: (base) => ({
                                ...base,
                                padding: '4px'
                              }),
                              placeholder: (base) => ({
                                ...base,
                                color: '#94a3b8'
                              })
                            }}
                          />
                        </div>
                        {selectedCollector && (
                          <button
                            onClick={() => {
                              handleAssign(report._id, selectedCollector.value);
                              setAssigningId(null);
                              setSelectedCollector(null);
                            }}
                            title="Confirm Assignment"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '42px',
                              height: '42px',
                              borderRadius: '10px',
                              backgroundColor: '#10b981',
                              color: 'white',
                              border: 'none',
                              cursor: 'pointer',
                              boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)',
                              fontSize: '18px',
                              transition: 'transform 0.2s',
                              flexShrink: 0
                            }}
                            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                          >
                            ✓
                          </button>
                        )}
                      </div>
                    ) : (
                      <button
                        className="assign-btn"
                        onClick={() => {
                          setAssigningId(report._id);
                          setSelectedCollector(null);
                        }}
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
              <ChevronLeft size={16} /> {isMobile ? "Prev" : "Previous"}
            </button>

            <div className="pagination-numbers">
              {(() => {
                let pages = [];
                if (!isMobile || totalPages <= 3) {
                  pages = [...Array(totalPages)].map((_, i) => i + 1);
                } else {
                  if (currentPage === 1) pages = [1, 2, 3];
                  else if (currentPage === totalPages) pages = [totalPages - 2, totalPages - 1, totalPages];
                  else pages = [currentPage - 1, currentPage, currentPage + 1];
                }

                return pages.map(pageNum => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`pagination-number ${currentPage === pageNum ? "active" : ""}`}
                  >
                    {pageNum}
                  </button>
                ));
              })()}
            </div>

            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next <ChevronRight size={16} />
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