// src/Chart/CustomPieChart.jsx

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

// =====================================================================
// 🧩 Custom Tooltip Component — Menampilkan label, jumlah, & persentase
// =====================================================================
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const total = data.totalValue; // Total keseluruhan nilai dari dataset
    const percent = total ? ((data.count / total) * 100).toFixed(1) : 0;

    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg text-sm">
        <p className="font-semibold text-gray-900">{data.status}</p>
        <p className="text-gray-700">
          Jumlah: <span className="font-bold">{data.count}</span>
        </p>
        <p className="text-gray-500">
          Persentase: <span className="font-bold">{percent}%</span>
        </p>
      </div>
    );
  }

  return null;
};

// =====================================================================
// 🥧 CustomPieChart Component
// =====================================================================
const CustomPieChart = ({ data = [], colors = [] }) => {
  // Jika data kosong
  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center h-full text-gray-500 py-10">
        <p>Data distribusi tugas tidak tersedia.</p>
      </div>
    );
  }

  // Hitung total nilai (untuk menghitung persentase)
  const totalValue = data.reduce((sum, entry) => sum + entry.count, 0);

  // Tambahkan total ke tiap item agar bisa diakses di tooltip
  const dataWithTotal = data.map((item) => ({
    ...item,
    totalValue,
  }));

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={dataWithTotal}
          dataKey="count"
          nameKey="status"
          cx="50%"
          cy="45%"
          outerRadius={100}
          innerRadius={60}
          fill="#8884d8"
          paddingAngle={3}
        >
          {dataWithTotal.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={colors[index % colors.length]}
              className="hover:opacity-80 transition-opacity cursor-pointer"
            />
          ))}
        </Pie>

        {/* Tooltip Kustom */}
        <Tooltip content={<CustomTooltip />} />

        {/* Legend */}
        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          wrapperStyle={{ paddingTop: "20px" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CustomPieChart;
