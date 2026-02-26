import "./WasteReports.css";
import p2 from "../../assets/p2.jpg";
import { useState, useEffect } from "react";
import CloseButton from "../CloseButton"; // 👈 reusable button

function WasteReports() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState("All");
  const [assigningId, setAssigningId] = useState(null);
  const [reports, setReports] = useState([]);
  const [collectors, setCollectors] = useState([]);

  // ================= LOAD DATA =================
  useEffect(() => {
    const savedReports = JSON.parse(localStorage.getItem("reports"));
    const savedCollectors =
      JSON.parse(localStorage.getItem("collectors")) || [];

    if (!savedReports || savedReports.length === 0) {
      const defaultReports = [
        {
          id: 101,
          location: "Smart City Area",
          type: "Plastic",
          status: "Pending",
          collector: null,
          photo: p2,
        },
        {
          id: 102,
          location: "Main Road",
          type: "Other",
          status: "Pending",
          collector: null,
          photo: p2,
        },
        {
          id: 103,
          location: "River Side",
          type: "Organic",
          status: "Pending",
          collector: null,
          photo: p2,
        },
      ];

      setReports(defaultReports);
      localStorage.setItem("reports", JSON.stringify(defaultReports));
    } else {
      setReports(savedReports);
    }

    setCollectors(savedCollectors);
  }, []);

  // ================= ASSIGN COLLECTOR =================
  const handleAssign = (reportId, collectorName) => {
    const updatedReports = reports.map((report) =>
      report.id === reportId
        ? {
          ...report,
          status: "Assigned",
          collector: collectorName,
        }
        : report
    );

    setReports(updatedReports);
    localStorage.setItem("reports", JSON.stringify(updatedReports));

    const updatedCollectors = collectors.map((col) =>
      col.name === collectorName
        ? { ...col, status: "Busy" }
        : col
    );

    setCollectors(updatedCollectors);
    localStorage.setItem(
      "collectors",
      JSON.stringify(updatedCollectors)
    );

    setAssigningId(null);
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
              <th>Status</th>
              <th>Collector</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredReports.map((report) => (
              <tr key={report.id}>
                <td>#{report.id}</td>
                <td>{report.location}</td>
                <td>{report.type}</td>

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
                    assigningId === report.id ? (
                      <select
                        onChange={(e) =>
                          handleAssign(
                            report.id,
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
                              key={col.id}
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
                          setAssigningId(report.id)
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