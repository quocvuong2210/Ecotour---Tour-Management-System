import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import History from "./pages/History";
import Notifications from "./pages/Notifications";
import Feedback from "./pages/Feedback";
import Employees from "./pages/Employees";
import AdminDashboard from "./pages/AdminDashboard";
import Membership from "./pages/Membership";
import UserManagement from "./pages/UserManagement";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/history" element={<History />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/users" element={<UserManagement />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
