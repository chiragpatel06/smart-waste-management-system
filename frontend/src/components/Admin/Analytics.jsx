import { useState } from "react";
import "./Analytics.css";

function Analytics() {
    const [reports] = useState([
        { id: 1, status: "Pending" },
        { id: 2, status: "Collected" },
        { id: 3, status: "Pending" },
        { id: 4, status: "Collected" },
        { id: 5, status: "Collected" },
        { id: 6, status: "Pending" },
    ]);
    const totalReports = reports.length;
    const pendingReports = reports.filter(r => r.status === "Pending").length;
    const collectedReports = reports.filter(r => r.status === "Collected").length;

    const pendingPercent = totalReports ? (pendingReports / totalReports) * 100 : 0;
    const collectedPercent = totalReports ? (collectedReports / totalReports) * 100 : 0;


    return (
        <div className="admin-page">

            <main className="admin-content">
                <h1>Analytics Dashboard</h1>

                {/* TOP STATS */}
                <div className="analytics-cards">
                    <div className="analytics-card">
                        <h3>Total Reports</h3>
                        <p>{totalReports}</p>

                    </div>

                    <div className="analytics-card">
                        <h3>Pending</h3>
                        <p className="pending">{pendingReports}</p>

                    </div>

                    <div className="analytics-card">
                        <h3>Collected</h3>
                        <p className="collected">{collectedReports}</p>

                    </div>
                </div>

                {/* CHART SECTION */}
                <div className="overview-card">
                    <h2>Waste Reports Overview</h2>

                    <div className="chart-container">
                        <div className="chart-item">
                            <div
                                className="chart-bar pending-bar"
                                style={{ height: `${pendingPercent}%` }}
                            >
                                <span>{pendingPercent.toFixed(0)}%</span>
                            </div>
                            <p>Pending</p>
                        </div>

                        <div className="chart-item">
  
                            <div
                                className="chart-bar collected-bar"
                                style={{ height: `${collectedPercent}%` }}
                            >
                                <span>{collectedPercent.toFixed(0)}%</span>
                            </div>
                            <p>Collected</p>
                        </div>
                    </div>
                </div>


            </main>
        </div>
    );
}

export default Analytics;
