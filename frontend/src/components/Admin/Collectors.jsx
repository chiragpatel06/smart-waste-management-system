import { useState, useEffect } from "react";
import "./Collectors.css";
import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";

function Collectors() {
    const defaultCollectors = [
        { id: 1, name: "Rahul Sharma", phone: "9876543210", area: "Smart City Area", status: "Available" },
        { id: 2, name: "Amit Patel", phone: "9123456780", area: "Main Road", status: "Busy" },
    ];

    const [collectors, setCollectors] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});

    useEffect(() => {
        const savedCollectors = JSON.parse(localStorage.getItem("collectors"));
        if (savedCollectors && savedCollectors.length > 0) {
            setCollectors(savedCollectors);
        } else {
            setCollectors(defaultCollectors);
            localStorage.setItem("collectors", JSON.stringify(defaultCollectors));
        }
    }, []);

    const updateStorage = (updatedCollectors) => {
        setCollectors(updatedCollectors);
        localStorage.setItem("collectors", JSON.stringify(updatedCollectors));
    };

    const handleDelete = (id) => {
        const updatedCollectors = collectors.filter(c => c.id !== id);
        updateStorage(updatedCollectors);
    };

    const handleUpdate = (id) => {
        const updatedCollectors = collectors.map(c => c.id === id ? editData : c);
        updateStorage(updatedCollectors);
        setEditingId(null);
    };

    return (
        <div className="admin-page">
            <main className="admin-content">
                <header className="collectors-header">
                    <h1>Collectors Management</h1>
                    <Link to="/admin/add-collector" className="add-btn">
                        + Add Collector
                    </Link>
                </header>

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
                            <tr key={collector.id} className={editingId === collector.id ? "editing-row" : ""}>
                                <td data-label="ID">{collector.id}</td>
                                <td data-label="Name">
                                    {editingId === collector.id ? (
                                        <input
                                            className="edit-input"
                                            value={editData.name}
                                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                        />
                                    ) : collector.name}
                                </td>
                                <td data-label="Phone">
                                    {editingId === collector.id ? (
                                        <input
                                            className="edit-input"
                                            value={editData.phone}
                                            onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                                        />
                                    ) : collector.phone}
                                </td>
                                <td data-label="Area">
                                    {editingId === collector.id ? (
                                        <input
                                            className="edit-input"
                                            value={editData.area}
                                            onChange={(e) => setEditData({ ...editData, area: e.target.value })}
                                        />
                                    ) : collector.area}
                                </td>
                                <td data-label="Status">
                                    {editingId === collector.id ? (
                                        <select
                                            className="edit-input"
                                            value={editData.status}
                                            onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                                        >
                                            <option value="Available">Available</option>
                                            <option value="Busy">Busy</option>
                                        </select>
                                    ) : (
                                        <span className={collector.status === "Available" ? "status-available" : "status-busy"}>
                                            {collector.status}
                                        </span>
                                    )}
                                </td>
                                <td data-label="Action" className="action-buttons">
                                    {editingId === collector.id ? (
                                        <div className="edit-actions">
                                            <button className="save-btn" onClick={() => handleUpdate(collector.id)}>Save</button>
                                            <button className="cancel-btn" onClick={() => setEditingId(null)}>Cancel</button>
                                        </div>
                                    ) : (
                                        <div className="action-wrapper">
                                            <button className="icon-btn edit-icon" onClick={() => { setEditingId(collector.id); setEditData(collector); }}>
                                                <Pencil size={18} />
                                            </button>
                                            <button className="icon-btn delete-icon" onClick={() => handleDelete(collector.id)}>
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
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