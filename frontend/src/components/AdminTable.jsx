function AdminTable({ children }) {
  return (
    <div className="admin-table-container">
      <table className="admin-table">
        {children}
      </table>
    </div>
  );
}

export default AdminTable;