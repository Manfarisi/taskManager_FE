import React from "react";
import Progress from "../layout/Progress";
import moment from "moment";
import { HiPaperClip } from "react-icons/hi";

const TaskCard = ({
  title,
  description,
  priority,
  status,
  progress,
  createdAt,
  dueDate,
  assignedTo = [],
  attachments = [],
  // completedTodoCount dihapus karena akan dihitung di bawah
  todoCheklist = [],
  onClick,
}) => {
  // Hitung jumlah todo yang selesai secara dinamis dari array yang dikirim
  const actualCompletedTodoCount = todoCheklist.filter(item => item.completed).length;
  const totalTodoCount = todoCheklist?.length || 0;

  // ... (Fungsi getStatusTagColor dan getPriorityTagColor tidak diubah)
  // ...
  const getStatusTagColor = () => {
    switch (status) {
      case "In Progress":
        return "bg-blue-100 text-blue-700 border border-blue-300";
      case "Completed":
        return "bg-green-100 text-green-700 border border-green-300";
      case "Pending":
        return "bg-orange-100 text-orange-700 border border-orange-300";
      case "Cancelled":
        return "bg-gray-100 text-gray-600 border border-gray-300";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-300";
    }
  };

  const getPriorityTagColor = () => {
    switch (priority) {
      case "Low":
        return "bg-emerald-100 text-emerald-700 border border-emerald-300";
      case "Medium":
        return "bg-yellow-100 text-yellow-700 border border-yellow-300";
      case "High":
        return "bg-red-100 text-red-700 border border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-300";
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white shadow-md hover:shadow-xl rounded-2xl p-6 border border-gray-100 cursor-pointer transition-all duration-300 hover:scale-[1.01]"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusTagColor()}`}
        >
          {status}
        </span>
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${getPriorityTagColor()}`}
        >
          {priority} Priority
        </span>
      </div>

      {/* Title and Description */}
      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
        {title}
      </h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>

      {/* Progress Section */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-700">
          Task Dones:{" "}
          <span className="text-blue-600">
            {/* Menggunakan nilai yang dihitung */}
            {actualCompletedTodoCount} / {totalTodoCount}
          </span>
        </p>
        <p className="text-xs text-gray-400 italic">
          {progress}% complete
        </p>
      </div>
      <Progress progress={progress} status={status} />

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4 mt-5 text-sm">
        <div>
          <label className="text-gray-500 font-medium">Start Date</label>
          <p className="text-gray-800">
            {moment(createdAt).format("Do MMM YYYY")}
          </p>
        </div>
        <div>
          <label className="text-gray-500 font-medium">Due Date</label>
          <p className="text-gray-800">
            {moment(dueDate).format("Do MMM YYYY")}
          </p>
        </div>
      </div>

      {/* Assigned Users */}
      {assignedTo.length > 0 && (
        <div className="flex items-center mt-6">
          <div className="flex -space-x-2">
            {assignedTo.slice(0, 4).map((user, index) => (
              <img
                key={index}
                src={
                  user.profileImageUrl ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt={user.name || "User"}
                className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
              />
            ))}
            {assignedTo.length > 4 && (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600 border-2 border-white">
                +{assignedTo.length - 4}
              </div>
            )}
          </div>
          <span className="ml-3 text-sm text-gray-600">
            {assignedTo.length} member(s)
          </span>
        </div>
      )}

      {/* Attachments */}
      {attachments.length > 0 && (
        <div className="flex items-center gap-2 mt-4 text-sm text-gray-700">
          <HiPaperClip className="text-blue-600" />
          <span>{attachments.length} Attachment(s)</span>
        </div>
      )}
    </div>
  );
};

export default TaskCard;