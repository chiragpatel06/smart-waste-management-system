import "./WasteReports.css";
import p2 from "../../assets/p2.jpg";
import { useState } from "react";
function WasteReports() {
    const [selectedImage, setSelectedImage] = useState(null);

    return (
        <div className="admin-content">
            <h1>Waste Reports</h1>

            {/* FILTER */}
            <div className="filter-bar">
                <select>
                    <option>All</option>
                    <option>Pending</option>
                    <option>Collected</option>
                </select>
            </div>

            {/* TABLE */}
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
                        <tr>
                            <td>#101</td>
                            <td>Smart City Area</td>
                            <td>Plastic</td>
                            <td>
                                <img
                                    src={p2}
                                    alt="Waste"
                                    className="report-image"
                                    onClick={() => setSelectedImage(p2)}
                                />
                            </td>

                            <td className="pending">Pending</td>
                            <td>-</td>
                            <td>
                                <button className="assign-btn">Assign</button>
                            </td>
                        </tr>

                        <tr>
                            <td>#102</td>
                            <td>Main Road</td>
                            <td>Garbage</td>
                            <td>
                                <img
                                    src={p2}
                                    alt="Waste"
                                    className="report-image"
                                    onClick={() => setSelectedImage(p2)}
                                />
                            </td>
                            <td className="collected">Collected</td>
                            <td>Rahul</td>
                            <td>-</td>
                        </tr>
                    </tbody>
                </table>
                {selectedImage && (
                    <div className="image-modal">
                        <span
                            className="close-btn"
                            onClick={() => setSelectedImage(null)}
                        >
                            ✖
                        </span>

                        <img
                            src={selectedImage}
                            alt="Full View"
                            className="modal-image"
                        />
                    </div>
                )}

            </div>
        </div>
    );
}

export default WasteReports;
