import React from "react";

function AdminTable({ columns, data, renderRow }) {

  return (
    <div className="admin-table-wrapper">
      <p>hello</p>
      <table className="admin-table">

        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col}</th>
            ))}
          </tr>
        </thead>

        <tbody>

          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: "center", padding: "20px" }}>
                
                No Data Found
              </td>
            </tr>
          ) : (
            data.map((item, index) => renderRow(item, index))
          )}

        </tbody>

      </table>

    </div>
  );
}

export default AdminTable;