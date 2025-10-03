import React, { useState, useEffect } from "react";

function AdminForm({ addUser, saveEdit, isEditing, currentUser, cancelEdit }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setEmail(currentUser.email);
    }
  }, [currentUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) return;
    if (isEditing) {
      saveEdit({ name, email });
    } else {
      addUser({ name, email });
    }
    setName("");
    setEmail("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
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
      <button type="submit" className="bg-blue-500 text-white px-4 py-2">
        {isEditing ? "Save" : "Add"}
      </button>
      {isEditing && (
        <button type="button" onClick={cancelEdit} className="ml-2 px-4 py-2 border">
          Cancel
        </button>
      )}
    </form>
  );
}

export default AdminForm;

