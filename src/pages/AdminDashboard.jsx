import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const data = [
  { name: "T1", revenue: 120 },
  { name: "T2", revenue: 200 },
  { name: "T3", revenue: 150 },
  { name: "T4", revenue: 300 },
];

function AdminDashboard() {
  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-3">Doanh thu</h2>
      <BarChart width={500} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="revenue" fill="#10b981" />
      </BarChart>
    </div>
  );
}

export default AdminDashboard;
