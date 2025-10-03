import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import UserManagement from "./pages/UserManagement";
import AdminManagement from "./pages/AdminManagement";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<h1 className="p-6">Welcome to Ecotour</h1>} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/admin" element={<AdminManagement />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
