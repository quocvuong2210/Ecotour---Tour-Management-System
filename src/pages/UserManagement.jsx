import React, { useState } from "react";
import { motion } from "framer-motion";

function UserManagement() {
  const [users, setUsers] = useState([
    { id: 1, name: "Nguyễn Văn A", role: "VIP" },
    { id: 2, name: "Trần Thị B", role: "User" },
  ]);

  const [newUser, setNewUser] = useState("");

  const addUser = () => {
    if (newUser.trim() === "") return;
    setUsers([...users, { id: Date.now(), name: newUser, role: "User" }]);
    setNewUser("");
  };

  const deleteUser = (id) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  return (
    <motion.div
      className="p-6 bg-white rounded-xl shadow"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-xl font-semibold mb-3">Quản lý người dùng</h2>
      <div className="flex gap-2 mb-4">
        <input
          className="border rounded px-3 py-2 flex-1"
          placeholder="Nhập tên người dùng..."
          value={newUser}
          onChange={(e) => setNewUser(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg"
          onClick={addUser}
        >
          Thêm
        </button>
      </div>
      <ul className="space-y-2">
        {users.map((u) => (
          <motion.li
            key={u.id}
            className="flex items-center justify-between p-3 border rounded-lg"
            whileHover={{ scale: 1.02 }}
          >
            <span>
              {u.name} — <span className="text-sm text-gray-500">{u.role}</span>
            </span>
            <button
              className="px-3 py-1 bg-red-500 text-white rounded-md"
              onClick={() => deleteUser(u.id)}
            >
              Xoá
            </button>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

export default UserManagement;
