import React, { useState } from "react";
import UserList from "./UserList";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const addUser = (e) => {
    e.preventDefault();
    if (!name || !email) return;
    setUsers([...users, { name, email }]);
    setName("");
    setEmail("");
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">User Management</h2>

      {/* form cho user tự nhập */}
      <form onSubmit={addUser} className="mb-4">
        <input
          type="text"
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 mr-2"
        />
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">Add</button>
      </form>

      {/* hien danh sach */}
      <UserList users={users} />
    </div>
  );
}

export default UserManagement;
