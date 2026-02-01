import React from "react";

const Progress = ({ progress, status }) => {
  const getColor = () => {
    switch (status) {
      case "In Progress":
        return "bg-blue-500"; // Biru: sedang dikerjakan
      case "Completed":
        return "bg-green-500"; // Hijau: selesai
      case "Pending":
        return "bg-yellow-500"; // Kuning: menunggu
      case "Cancelled":
        return "bg-gray-400"; // Abu-abu: batal
      default:
        return "bg-gray-300";
    }
  };

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
      <div
        className={`${getColor()} h-2.5 transition-all duration-500 ease-in-out`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default Progress;
