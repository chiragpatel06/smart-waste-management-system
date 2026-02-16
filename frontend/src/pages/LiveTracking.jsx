import { useState } from "react";
import "./LiveTracking.css";

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
  }
];

function LiveTracking() {
  const [selectedReport, setSelectedReport] = useState(reportsData[0]);

  return (
    <div className="tracking-container">

      {/* LEFT : REPORT LIST */}
      <div className="report-list">
        <h2>My Reports</h2>

        {reportsData.map((report) => (
          <div
            key={report.id}
            className={`report-card ${selectedReport.id === report.id ? "active" : ""
              }`}
            onClick={() => setSelectedReport(report)}
          >
            <h4>Report #{report.id}</h4>
            <p>{report.wasteType}</p>
            <span className={`status ${report.status.replaceAll(" ", "")}`}>
              {report.status}
            </span>
          </div>
        ))}
      </div>

      {/* RIGHT : REPORT DETAILS */}
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

        {/* STEPS */}
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


        {/* INFO */}
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
    </div>
  );
}

export default LiveTracking