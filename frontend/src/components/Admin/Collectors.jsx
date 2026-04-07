import { useState, useEffect } from "react";
import "./Collectors.css";
import { Link } from "react-router-dom";
import { Pencil, Trash2, Search, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import API from "../../api/api";

function Collectors() {
    const defaultCollectors = [
        { id: 1, name: "Rahul Sharma", phone: "9876543210", area: "Smart City Area", status: "Available" },
        { id: 2, name: "Amit Patel", phone: "9123456780", area: "Main Road", status: "Busy" },
    ];

    const [collectors, setCollectors] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const collectorsPerPage = 5;

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
            toast.success("Collector updated successfully");
        } catch (error) {
            console.log("Update error", error);
            toast.error("Something went wrong");
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure you want to delete this collector?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#9ca3af",
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel",
            customClass: {
                popup: "admin-swal-popup",
                title: "admin-swal-title",
                actions: "admin-swal-actions",
                confirmButton: "admin-swal-confirm-btn"
            }
        });

        if (result.isConfirmed) {
            try {
                await API.delete(`/collectors/${id}`);

                setCollectors(collectors.filter(c => c._id !== id));
                toast.success("Collector deleted successfully");
            } catch (error) {
                console.log("Delete error", error);
                toast.error("Something went wrong");
            }
        }
    };



    const filteredCollectors = collectors.filter(c =>
        (c.name && c.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (c.phone && c.phone.includes(searchTerm)) ||
        (c.area && c.area.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const indexOfLastCollector = currentPage * collectorsPerPage;
    const indexOfFirstCollector = indexOfLastCollector - collectorsPerPage;
    const currentCollectors = filteredCollectors.slice(indexOfFirstCollector, indexOfLastCollector);
    const totalPages = Math.ceil(filteredCollectors.length / collectorsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    return (
        <div className="admin-page-wrapper">
            <header className="admin-page-header">
                <div className="admin-page-title-group">
                    <h1 className="admin-page-title">Collectors Management</h1>
                </div>

                <div className="admin-header-actions">
                    <div className="admin-search-box">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search Name, Phone, Area..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="admin-search-input"
                        />
                    </div>
                    <Link to="/admin/add-collector" className="admin-primary-btn" style={{ textDecoration: 'none' }}>
                        <Plus size={18} />
                        <span className="admin-btn-text">Add Collector</span>
                    </Link>
                </div>
            </header>


            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead className="admin-table-head">
                        <tr className="admin-table-row">
                            <th className="admin-table-th">ID</th>
                            <th className="admin-table-th">Name</th>
                            <th className="admin-table-th">Phone</th>
                            <th className="admin-table-th">Area</th>
                            <th className="admin-table-th">Status</th>
                            <th className="admin-table-th">Action</th>
                        </tr>
                    </thead>
                    <tbody className="admin-table-body">
                        {currentCollectors.map((collector, index) => (
                            <tr key={collector._id} className={`admin-table-row ${editingId === collector._id ? "editing-row" : ""}`}>
                                <td className="admin-table-td">{indexOfFirstCollector + index + 1}</td>
                                <td className="admin-table-td">
                                    {editingId === collector._id ? (
                                        <input
                                            className="edit-input"
                                            value={editData.name}
                                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                        />
                                    ) : <strong className="admin-collector-name">{collector.name}</strong>}
                                </td>
                                <td className="admin-table-td">
                                    {editingId === collector._id ? (
                                        <input
                                            className="edit-input"
                                            value={editData.phone}
                                            onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                                        />
                                    ) : collector.phone}
                                </td>
                                <td className="admin-table-td">
                                    {editingId === collector._id ? (
                                        <input
                                            className="edit-input"
                                            value={editData.area}
                                            onChange={(e) => setEditData({ ...editData, area: e.target.value })}
                                        />
                                    ) : collector.area}
                                </td>
                                <td className="admin-table-td">
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
                                        <span className={`admin-status-badge ${collector.status.toLowerCase()}`}>
                                            {collector.status}
                                        </span>
                                    )}
                                </td>
                                <td className="admin-table-td action-buttons">
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

                        {currentCollectors.length < collectorsPerPage &&
                            Array.from({ length: collectorsPerPage - currentCollectors.length }).map((_, index) => (
                                <tr key={`empty-${index}`} className="admin-table-row placeholder-row">
                                    <td className="admin-table-td">-</td>
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

                {filteredCollectors.length > collectorsPerPage && (
                    <div className="admin-pagination">
                        <button
                            className="pagination-btn"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft size={16} /> Previous
                        </button>

                        <div className="pagination-numbers">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`pagination-number ${currentPage === i + 1 ? "active" : ""}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
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
            </div>
        </div>
    );
}

export default Collectors;