import { useState, useEffect } from "react";
import "./Collectors.css";
import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import API from "../../api/api";

function Collectors() {
    const defaultCollectors = [
        { id: 1, name: "Rahul Sharma", phone: "9876543210", area: "Smart City Area", status: "Available" },
        { id: 2, name: "Amit Patel", phone: "9123456780", area: "Main Road", status: "Busy" },
    ];

    const [collectors, setCollectors] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});

    useEffect(() => {
        const fetchCollectors = async () => {
            try {
                const res = await API.get("/collectors");

                setCollectors(res.data);
            } catch (error) {
                console.log("Error fetching collectors");
            }
        };

        fetchCollectors();
    }, []);

    const handleUpdate = async (id) => {
        try {

            const res = await API.put(`/collectors/${id}`, editData);

            const updatedCollectors = collectors.map((c) =>
                c._id === id ? res.data.collector : c
            );

            setCollectors(updatedCollectors);
            setEditingId(null);

        } catch (error) {
            console.log("Update error", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await API.delete(`/collectors/${id}`);

            setCollectors(collectors.filter(c => c._id !== id));
        } catch (error) {
            console.log("Delete error");
        }
    };;



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
                        {collectors.map((collector, index) => (
                            <tr key={collector._id} className={editingId === collector._id ? "editing-row" : ""}>
                                <td data-label="ID">{index + 1}</td>
                                <td data-label="Name">
                                    {editingId === collector._id ? (
                                        <input
                                            className="edit-input"
                                            value={editData.name}
                                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                        />
                                    ) : collector.name}
                                </td>
                                <td data-label="Phone">
                                    {editingId === collector._id ? (
                                        <input
                                            className="edit-input"
                                            value={editData.phone}
                                            onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                                        />
                                    ) : collector.phone}
                                </td>
                                <td data-label="Area">
                                    {editingId === collector._id ? (
                                        <input
                                            className="edit-input"
                                            value={editData.area}
                                            onChange={(e) => setEditData({ ...editData, area: e.target.value })}
                                        />
                                    ) : collector.area}
                                </td>
                                <td data-label="Status">
                                    {editingId === collector._id ? (
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
                                    {editingId === collector._id ? (
                                        <div className="edit-actions">
                                            <button className="save-btn" onClick={() => handleUpdate(collector._id)}>Save</button>
                                            <button className="cancel-btn" onClick={() => setEditingId(null)}>Cancel</button>
                                        </div>
                                    ) : (
                                        <div className="action-wrapper">
                                            <button className="icon-btn edit-icon" onClick={() => { setEditingId(collector._id); setEditData(collector); }}>
                                                <Pencil size={18} />
                                            </button>
                                            <button className="icon-btn delete-icon" onClick={() => handleDelete(collector._id)}>
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