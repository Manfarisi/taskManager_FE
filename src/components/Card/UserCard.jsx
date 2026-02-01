import React from "react";
import { HiTrash } from "react-icons/hi";

// --- Komponen StatCard ---
const StatCard = ({ label, count, status }) => {
  const getStatusTagColor = () => {
    switch (status) {
      case "In Progress":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "Completed":
        return "bg-green-50 text-green-600 border-green-200";
      default:
        return "bg-yellow-50 text-yellow-600 border-yellow-200";
    }
  };

  return (
    <div className={`flex-1 p-3 border rounded-lg text-center ${getStatusTagColor()}`}>
      <span className="text-2xl font-bold leading-none">{count}</span>
      <p className="text-xs font-medium uppercase mt-1 tracking-wide">{label}</p>
    </div>
  );
};
// ---------------------------------

// --- Komponen UserCard (dengan Delete Button) ---
const UserCard = ({ userInfo, onDelete }) => {
  const {
    name,
    email,
    profileImageUrl,
    role,
    pendingTask,
    inProgressTask,
    completedTask,
    _id,
  } = userInfo || {};

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out p-6 flex flex-col items-center text-center">

      {/* Avatar Section */}
      <div className="mb-4">
        <img
          src={profileImageUrl || "https://via.placeholder.com/150"}
          alt={`${name}'s Avatar`}
          className="w-24 h-24 object-cover rounded-full border-4 border-indigo-100 shadow-md"
        />
      </div>

      {/* User Info Section */}
      <div className="flex-grow w-full">
        <p className="text-xl font-semibold text-gray-800 mb-1 truncate">
          {name || "Unknown User"}
        </p>

        {role && (
          <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
            {role}
          </span>
        )}

        <p className="text-sm text-gray-500 mb-5 break-words">
          {email || "N/A"}
        </p>
      </div>

      {/* Task Stats */}
      <div className="w-full flex justify-between gap-3 mt-auto pt-4 border-t border-gray-100">
        <StatCard label="Pending" count={pendingTask || 0} status="Pending" />
        <StatCard label="In Progress" count={inProgressTask || 0} status="In Progress" />
        <StatCard label="Completed" count={completedTask || 0} status="Completed" />
      </div>

      {/* Delete Button */}
      <button
        onClick={() => onDelete(_id)}
        className="mt-5 w-full flex items-center justify-center gap-2 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg shadow hover:bg-red-700 transition-all cursor-pointer"
      >
        <HiTrash className="w-4 h-4" />
        Delete User
      </button>
    </div>
  );
};

export default UserCard;
