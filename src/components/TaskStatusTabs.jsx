import React from "react";

const TaskStatusTabs = ({ tabs, setActiveTab, activeTab }) => {
  // Fungsi menentukan warna utama berdasarkan label
  const getActiveColor = (label) => {
    switch (label) {
      case "Pending":
        return {
          bg: "bg-red-600",
          hover: "hover:bg-red-700",
          shadow: "shadow-red-300/40",
          badge: "text-red-600",
        };
      case "In Progress":
        return {
          bg: "bg-yellow-500",
          hover: "hover:bg-yellow-600",
          shadow: "shadow-yellow-300/40",
          badge: "text-yellow-500",
        };
      case "Completed":
        return {
          bg: "bg-green-600",
          hover: "hover:bg-green-700",
          shadow: "shadow-green-300/40",
          badge: "text-green-600",
        };
      default:
        return {
          bg: "bg-blue-600",
          hover: "hover:bg-blue-700",
          shadow: "shadow-blue-300/40",
          badge: "text-blue-600",
        };
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-lg p-3 flex items-center justify-between border border-gray-100 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.label;
        const color = getActiveColor(tab.label);

        return (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            className={`relative flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300
              ${
                isActive
                  ? `text-white ${color.bg} ${color.hover} shadow-md ${color.shadow}`
                  : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              }`}
          >
            {/* Label */}
            <span className="whitespace-nowrap">{tab.label}</span>

            {/* Count badge */}
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold transition-colors duration-300 ${
                isActive
                  ? "bg-white"
                  : "bg-gray-200 text-gray-700"
              } ${isActive ? color.badge : ""}`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default TaskStatusTabs;
