import React from "react";
import { HiTrash } from "react-icons/hi";

const StatCard = ({ label, count, status }) => {
  const colors = {
    "In Progress": "bg-blue-50 text-blue-600 border-blue-200",
    "Completed": "bg-green-50 text-green-600 border-green-200",
    "Pending": "bg-yellow-50 text-yellow-600 border-yellow-200",
  };
  return (
    <div className={`flex-1 p-2.5 border rounded-lg text-center ${colors[status] || colors["Pending"]}`}>
      <span className="text-xl font-bold leading-none">{count}</span>
      <p className="text-[10px] font-bold uppercase mt-1 tracking-wide">{label}</p>
    </div>
  );
};

const UserCard = ({ userInfo }) => {
  const { name, email, role, inProgressTask, completedTask, pendingTask, employeeInfo, _id } = userInfo || {};

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-5 flex flex-col items-center text-center">

      {/* Nama & Role */}
      <p className="text-sm font-bold text-gray-800 truncate w-full">{name || "Unknown"}</p>
      <span className="inline-block bg-indigo-100 text-indigo-600 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mt-1 mb-1">
        {role}
      </span>

      {/* Email */}
      <p className="text-xs text-gray-400 truncate w-full mb-1">{email}</p>

      {/* Posisi & Departemen */}
      <div className="flex items-center gap-1.5 mb-4">
        {employeeInfo?.position && (
          <span className="text-[10px] text-gray-500 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
            {employeeInfo.position}
          </span>
        )}
        {employeeInfo?.department && (
          <span className="text-[10px] text-gray-500 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
            {employeeInfo.department}
          </span>
        )}
      </div>

      {/* Task Stats */}
      <div className="w-full flex gap-2 pt-3 border-t border-gray-100">
        <StatCard label="Pending" count={pendingTask || 0} status="Pending" />
        <StatCard label="Progress" count={inProgressTask || 0} status="In Progress" />
        <StatCard label="Done" count={completedTask || 0} status="Completed" />
      </div>
    </div>
  );
};

export default UserCard;