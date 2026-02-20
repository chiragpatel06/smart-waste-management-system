import { useState, useEffect } from "react";
import "./Collectors.css";
import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";

function Collectors() {
    const defaultCollectors = [
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
    ];

    const [collectors, setCollectors] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});

    // 🔥 Load collectors from localStorage
    useEffect(() => {
        const savedCollectors = JSON.parse(localStorage.getItem("collectors"));

        if (savedCollectors && savedCollectors.length > 0) {
            setCollectors(savedCollectors);
        } else {
            setCollectors(defaultCollectors);
            localStorage.setItem(
                "collectors",
                JSON.stringify(defaultCollectors)
            );
        }
    }, []);

    // 🔥 Save collectors whenever updated
    const updateStorage = (updatedCollectors) => {
        setCollectors(updatedCollectors);
        localStorage.setItem(
            "collectors",
            JSON.stringify(updatedCollectors)
        );
    };

    const handleDelete = (id) => {
        const updatedCollectors = collectors.filter(
            (collector) => collector.id !== id
        );
        updateStorage(updatedCollectors);
    };

    const handleUpdate = (id) => {
        const updatedCollectors = collectors.map((collector) =>
            collector.id === id ? editData : collector
        );

        updateStorage(updatedCollectors);
        setEditingId(null);
    };

    return (
        <div className="admin-page">
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

                                {/* NAME */}
                                <td>
                                    {editingId === collector.id ? (
                                        <input
                                            value={editData.name}
                                            onChange={(e) =>
                                                setEditData({
                                                    ...editData,
                                                    name: e.target.value,
                                                })
                                            }
                                        />
                                    ) : (
                                        collector.name
                                    )}
                                </td>

                                {/* PHONE */}
                                <td>
                                    {editingId === collector.id ? (
                                        <input
                                            value={editData.phone}
                                            onChange={(e) =>
                                                setEditData({
                                                    ...editData,
                                                    phone: e.target.value,
                                                })
                                            }
                                        />
                                    ) : (
                                        collector.phone
                                    )}
                                </td>

                                {/* AREA */}
                                <td>
                                    {editingId === collector.id ? (
                                        <input
                                            value={editData.area}
                                            onChange={(e) =>
                                                setEditData({
                                                    ...editData,
                                                    area: e.target.value,
                                                })
                                            }
                                        />
                                    ) : (
                                        collector.area
                                    )}
                                </td>

                                {/* STATUS */}
                                <td>
                                    {editingId === collector.id ? (
                                        <select
                                            value={editData.status}
                                            onChange={(e) =>
                                                setEditData({
                                                    ...editData,
                                                    status: e.target.value,
                                                })
                                            }
                                        >
                                            <option value="Available">
                                                Available
                                            </option>
                                            <option value="Busy">
                                                Busy
                                            </option>
                                        </select>
                                    ) : (
                                        <span
                                            className={
                                                collector.status === "Available"
                                                    ? "status-available"
                                                    : "status-busy"
                                            }
                                        >
                                            {collector.status}
                                        </span>
                                    )}
                                </td>

                                {/* ACTION */}
                                {/* ACTION */}
                                <td className="action-buttons">
                                    {editingId === collector.id ? (
                                        <div className="edit-actions">
                                            <button
                                                className="save-btn"
                                                onClick={() => handleUpdate(collector.id)}
                                            >
                                                Save
                                            </button>

                                            <button
                                                className="cancel-btn"
                                                onClick={() => setEditingId(null)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <button
                                                className="icon-btn edit-icon"
                                                onClick={() => {
                                                    setEditingId(collector.id);
                                                    setEditData(collector);
                                                }}
                                            >
                                                <Pencil size={16} />
                                            </button>

                                            <button
                                                className="icon-btn delete-icon"
                                                onClick={() => handleDelete(collector.id)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </>
                                    )}
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