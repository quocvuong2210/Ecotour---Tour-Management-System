import React from "react";

function AdminList({ users, editUser, deleteUser }) {
  return (
    <div>
      <h3 className="text-lg font-bold mb-2">Admin - Manage Users</h3>
      <ul>
        {users.map((u, i) => (
          <li key={i} className="mb-2 flex justify-between border p-2">
            <span>{u.name} - {u.email}</span>
            <div>
              <button onClick={() => editUser(i)} className="bg-yellow-400 px-3 py-1 mr-2">Edit</button>
              <button onClick={() => deleteUser(i)} className="bg-red-500 text-white px-3 py-1">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminList;
