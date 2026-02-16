import { useState } from "react";
import "./Collectors.css";
import { Link } from "react-router-dom";

function Collectors() {
    const [collectors, setCollectors] = useState([
        {
            id: 1,
            name: "Rahul Sharma",
            phone: "9876543210",
            area: "Smart City Area",
            status: "Available",
        },
        {
            id: 2,
            name: "Amit Patel",
            phone: "9123456780",
            area: "Main Road",
            status: "Busy",
        },
    ]);
    const handleDelete = (id) => {
        const updatedCollectors = collectors.filter(
            (collector) => collector.id !== id
        );
        setCollectors(updatedCollectors);
    };

    return (
        <div className="admin-page">

            {/* Content */}
            <main className="admin-content">
                <h1>Collectors Management</h1>
                <Link to="/admin/add-collector" className="add-btn">
                    + Add Collector
                </Link>



                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Area</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {collectors.map((collector) => (
                            <tr key={collector.id}>
                                <td>{collector.id}</td>
                                <td>{collector.name}</td>
                                <td>{collector.phone}</td>
                                <td>{collector.area}</td>
                                <td
                                    className={
                                        collector.status === "Available"
                                            ? "status-available"
                                            : "status-busy"
                                    }
                                >
                                    {collector.status}
                                </td>
                                <td>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(collector.id)}>
                                        Delete
                                    </button>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
        </div>
    );
}

export default Collectors;
