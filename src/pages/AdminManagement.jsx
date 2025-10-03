import React, { useState } from "react";
import AdminForm from "./AdminForm";
import AdminList from "./AdminList";

function AdminManagement() {
  const [users, setUsers] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const addUser = (user) => setUsers([...users, user]);

  const editUser = (index) => setEditingIndex(index);

  const saveEdit = (updatedUser) => {
    const newUsers = [...users];
    newUsers[editingIndex] = updatedUser;
    setUsers(newUsers);
    setEditingIndex(null);
  };

  const cancelEdit = () => setEditingIndex(null);

  const deleteUser = (index) => setUsers(users.filter((_, i) => i !== index));

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Admin Management</h2>
      <AdminForm
        addUser={addUser}
        saveEdit={saveEdit}
        isEditing={editingIndex !== null}
        currentUser={editingIndex !== null ? users[editingIndex] : null}
        cancelEdit={cancelEdit}
      />
      <AdminList users={users} editUser={editUser} deleteUser={deleteUser} />
    </div>
  );
}

export default AdminManagement;
