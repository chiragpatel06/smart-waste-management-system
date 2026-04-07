import React, { useState, useEffect } from "react";
import API from "../../api/api";
import { 
  Search, 
  Edit2, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  UserPlus,
  Mail,
  Phone,
  UserCheck,
  UserX
} from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import "./UsersManagement.css";

function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 7;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure you want to delete this user?",
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
        await API.delete(`/users/${id}`);
        setUsers(users.filter(u => u._id !== id));
        toast.success("User deleted successfully");
      } catch (error) {
        console.error("Failed to delete user", error);
        toast.error("Something went wrong");
      }
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.phone?.includes(searchQuery)
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="userboard-page-wrapper">
      {/* HEADER SECTION */}
      <header className="userboard-page-header">
        <div className="userboard-page-title-group">
          <h1 className="userboard-page-title">Users Management</h1>
          <p className="userboard-page-subtitle">View, edit and manage platform users</p>
        </div>

        <div className="userboard-header-actions">
          <div className="userboard-search-box">
            <Search size={18} className="userboard-search-icon" />
            <input
              className="userboard-search-input"
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <button className="userboard-primary-btn">
            <UserPlus size={18} />
            <span>Add New User</span>
          </button>
        </div>
      </header>

      {/* STATS SUMMARY (Mini) */}
      <div className="userboard-mini-stats">
        <div className="userboard-mini-card">
          <UserCheck size={20} color="#10b981" />
          <span>Total: {users.length}</span>
        </div>
        <div className="userboard-mini-card">
          <UserX size={20} color="#ef4444" />
          <span>Inactive: {users.filter(u => u.status === 'Inactive').length}</span>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="userboard-main-section">
        <div className="userboard-table-container">
          <table className="userboard-table">
            <thead className="userboard-table-head">
              <tr className="userboard-table-row">
                <th className="userboard-table-th">User Details</th>
                <th className="userboard-table-th">Contact Info</th>
                <th className="userboard-table-th">Role</th>
                <th className="userboard-table-th">Status</th>
                <th className="userboard-table-th">Joined Date</th>
                <th className="userboard-table-th userboard-align-right">Actions</th>
              </tr>
            </thead>
            <tbody className="userboard-table-body">
              {currentUsers.length > 0 ? (
                currentUsers.map((user, index) => (
                  <tr className="userboard-table-row" key={user._id}>
                    <td className="userboard-table-td">
                      <div className="userboard-name-info">
                        <span className="userboard-bold-text">{user.name}</span>
                        <span className="userboard-id-text">ID: {user._id.slice(-6).toUpperCase()}</span>
                      </div>
                    </td>
                    <td className="userboard-table-td">
                      <div className="userboard-contact-box">
                        <span className="userboard-contact-item"><Mail size={12} /> {user.email}</span>
                        <span className="userboard-contact-item"><Phone size={12} /> {user.phone || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="userboard-table-td">
                      <span className="userboard-badge userboard-role-badge">
                        {user.role || 'User'}
                      </span>
                    </td>
                    <td className="userboard-table-td">
                      <span className={`userboard-badge ${user.status === 'Inactive' ? 'userboard-status-red' : 'userboard-status-green'}`}>
                        {user.status || 'Active'}
                      </span>
                    </td>
                    <td className="userboard-table-td">
                      {new Date(user.createdAt || Date.now()).toLocaleDateString('en-GB')}
                    </td>
                    <td className="userboard-table-td userboard-align-right">
                      <div className="userboard-action-btns">
                        <button className="userboard-icon-btn userboard-edit-btn" title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button 
                          className="userboard-icon-btn userboard-delete-btn" 
                          title="Delete"
                          onClick={() => handleDelete(user._id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="userboard-no-data">No users found matching your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="userboard-pagination">
            <button 
              className="userboard-page-btn" 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={18} /> <span>Prev</span>
            </button>
            
            <div className="userboard-page-numbers">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  className={`userboard-number ${currentPage === i + 1 ? "userboard-active" : ""}`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button 
              className="userboard-page-btn" 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <span>Next</span> <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default UsersManagement;
