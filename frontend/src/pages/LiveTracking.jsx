import { useState, useEffect } from "react";
import "./LiveTracking.css";
import { Search } from "lucide-react";

const reportsData = [
  {
    id: 101,
    location: "Smart City Area, India",
    wasteType: "Plastic",
    status: "Out for Collection",
    step: 3,
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952"
  },
  {
    id: 102,
    location: "Sector 21, India",
    wasteType: "Organic",
    status: "Assigned",
    step: 2,
    image: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807"
  },
  {
    id: 103,
    location: "Industrial Zone, India",
    wasteType: "E-Waste",
    status: "Collected",
    step: 4,
    image: "https://images.unsplash.com/photo-1581092335397-9583eb92d232"
  },
  {
    id: 104,
    location: "Sector 21, India",
    wasteType: "Organic",
    status: "Assigned",
    step: 2,
    image: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807"
  },
  {
    id: 105,
    location: "Sector 21, India",
    wasteType: "Organic",
    status: "Assigned",
    step: 2,
    image: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807"
  },
  {
    id: 106,
    location: "Sector 21, India",
    wasteType: "Organic",
    status: "Assigned",
    step: 2,
    image: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807"
  },
  {
    id: 107,
    location: "Sector 21, India",
    wasteType: "Organic",
    status: "Assigned",
    step: 2,
    image: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807"
  }
];

function LiveTracking() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState(null);

  const recordsPerPage = 3;

  // FILTERING
  const filteredReports = reportsData.filter((report) => {
    const matchesSearch =
      report.wasteType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.id.toString().includes(searchTerm);

    const matchesFilter =
      filterStatus === "All" || report.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  // RESET PAGE ON SEARCH/FILTER
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  // PAGINATION
  const totalPages = Math.ceil(filteredReports.length / recordsPerPage);
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentReports = filteredReports.slice(indexOfFirst, indexOfLast);

  // AUTO SELECT FIRST ITEM ON PAGE
  useEffect(() => {
    if (currentReports.length > 0) {
      setSelectedReport(currentReports[0]);
    } else {
      setSelectedReport(null);
    }
  }, [currentPage, searchTerm, filterStatus]);

  return (
    <div className="tracking-container">

      {/* LEFT PANEL */}
      <div className="report-list">

        <h2>My Reports</h2>

        <div className="report-controls">
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search by ID or Type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="All">All</option>
            <option value="Assigned">Assigned</option>
            <option value="Out for Collection">Out for Collection</option>
            <option value="Collected">Collected</option>
          </select>
        </div>

        {/* REPORT CARDS WRAPPER */}
        <div className="reports-wrapper">
          {currentReports.length === 0 ? (
            <p className="no-data">No Reports Found</p>
          ) : (
            currentReports.map((report) => (
              <div
                key={report.id}
                className={`report-card ${
                  selectedReport?.id === report.id ? "active" : ""
                }`}
                onClick={() => setSelectedReport(report)}
              >
                <h4>Report #{report.id}</h4>
                <p>{report.wasteType}</p>
                <span className={`status ${report.status.replaceAll(" ", "")}`}>
                  {report.status}
                </span>
              </div>
            ))
          )}
        </div>

        {/* PAGINATION FIXED BOTTOM */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={currentPage === index + 1 ? "active-page" : ""}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        )}

      </div>

      {/* RIGHT PANEL */}
      {selectedReport && (
        <div className="report-details">
          <h1>Live Waste Tracking</h1>
          <p className="subtitle">
            Monitor the progress of your reported waste in real time.
          </p>

          <img
            src={selectedReport.image}
            alt="Waste"
            className="tracking-image"
          />

          <div className="steps-wrapper">
            {["Report Submitted", "Assigned", "Out for Collection", "Collected"].map(
              (label, index) => (
                <div className="step-box" key={index}>
                  <div className={`circle ${selectedReport.step >= index + 1 ? "active" : ""}`}>
                    {index + 1}
                  </div>

                  {index !== 3 && (
                    <div
                      className={`line ${
                        selectedReport.step > index + 1 ? "active" : ""
                      }`}
                    ></div>
                  )}

                  <span>{label}</span>
                </div>
              )
            )}
          </div>

          <div className="info-box">
            <div>
              <label>Location</label>
              <p>{selectedReport.location}</p>
            </div>
            <div>
              <label>Waste Type</label>
              <p>{selectedReport.wasteType}</p>
            </div>
            <div>
              <label>Status</label>
              <p className="highlight">{selectedReport.status}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LiveTracking;
