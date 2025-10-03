import React from "react";

function UserList({ users }) {
  return (
    <div>
      <h3 className="text-lg font-bold mb-2">User List</h3>
      <ul>
        {users.map((u, i) => (
          <li key={i} className="mb-2 border p-2">
            {u.name} - {u.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
