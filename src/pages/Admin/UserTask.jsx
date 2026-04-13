import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATH } from "../../utils/apiPath";
import toast from "react-hot-toast";
import UserCard from "../../components/Card/UserCard";
import moment from "moment"; // Pastikan install moment: npm install moment

// ── Helpers ──────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const s = {
    Pending: "bg-yellow-100 text-yellow-600",
    "In Progress": "bg-blue-100 text-blue-600",
    Completed: "bg-green-100 text-green-600",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${s[status] || "bg-gray-100 text-gray-500"}`}>
      {status}
    </span>
  );
};

const PriorityBadge = ({ priority }) => {
  const p = {
    High: "bg-red-100 text-red-500",
    Medium: "bg-orange-100 text-orange-500",
    Low: "bg-gray-100 text-gray-400",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${p[priority] || "bg-gray-100 text-gray-400"}`}>
      {priority}
    </span>
  );
};

// Menggunakan moment untuk handling tanggal yang lebih aman
const formatDate = (date) => {
  if (!date) return "-";
  return moment(date).format("DD MMM YYYY");
};

const isOverdue = (task) =>
  task.dueDate && moment(task.dueDate).isBefore(moment()) && task.status !== "Completed";

// ── Komponen Modal Detail Task ─────────────────────────────
const UserTaskModal = ({ user, onClose }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");

  const TABS = ["All", "Pending", "In Progress", "Completed"];

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const params = activeTab !== "All" ? { status: activeTab } : {};
        const res = await axiosInstance.get(API_PATH.TASKS.GET_ALL_TASK, { params });
        
        // Filter hanya task yang di-assign ke user ini
        const userTasks = (res.data.tasks || []).filter((t) =>
          t.assignedTo?.some((u) => u._id === user._id)
        );
        setTasks(userTasks);
      } catch (err) {
        toast.error("Gagal memuat task!");
      } finally {
        setLoading(false);
      }
    };
    if (user?._id) fetchTasks();
  }, [activeTab, user._id]);

  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === "Pending").length,
    inProgress: tasks.filter((t) => t.status === "In Progress").length,
    completed: tasks.filter((t) => t.status === "Completed").length,
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-100">
        
        {/* Header Modal */}
        <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {user.profileImageUrl ? (
              <img src={user.profileImageUrl} alt={user.name} className="w-10 h-10 rounded-full object-cover border-2 border-white/40" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
                {user.name?.charAt(0)}
              </div>
            )}
            <div>
              <h3 className="text-white font-bold text-base">{user.name}</h3>
              <p className="text-indigo-200 text-xs">{user.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white hover:rotate-90 transition-all text-xl">✕</button>
        </div>

        {/* Statistik Mini */}
        <div className="grid grid-cols-4 divide-x divide-gray-100 border-b border-gray-100">
          {[
            { label: "Total", value: stats.total, color: "text-indigo-600" },
            { label: "Pending", value: stats.pending, color: "text-yellow-500" },
            { label: "In Progress", value: stats.inProgress, color: "text-blue-500" },
            { label: "Completed", value: stats.completed, color: "text-green-500" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center py-3">
              <span className={`text-2xl font-bold ${s.color}`}>{s.value}</span>
              <span className="text-[10px] text-gray-400 uppercase font-semibold">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Tab Filter */}
        <div className="flex gap-1 px-6 pt-4 pb-0">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                activeTab === tab ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-3">
          {loading ? (
            <p className="text-center text-gray-400 py-10">Memuat task...</p>
          ) : tasks.length === 0 ? (
            <p className="text-center text-gray-400 italic py-10">Tidak ada task untuk filter ini.</p>
          ) : (
            tasks.map((task) => {
              const overdue = isOverdue(task);
              const completedCount = task.todoCheklist?.filter((i) => i.completed).length || 0;
              const totalCount = task.todoCheklist?.length || 0;

              return (
                <div key={task._id} className={`rounded-xl border p-4 space-y-3 transition ${overdue ? "border-red-200 bg-red-50/30" : "border-gray-100 hover:border-indigo-100"}`}>
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-bold text-gray-800 leading-snug">{task.title}</p>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <PriorityBadge priority={task.priority} />
                      <StatusBadge status={task.status} />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all"
                        style={{ width: `${task.progress || 0}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 w-8 text-right">{task.progress || 0}%</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-medium ${overdue ? "text-red-500" : "text-gray-400"}`}>
                      📅 {formatDate(task.dueDate)} {overdue && "(Overdue)"}
                    </span>
                    {totalCount > 0 && (
                      <span className="text-gray-400">
                        ✅ {completedCount}/{totalCount} checklist
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

// ── Halaman Utama UserTask ──────────────────────────────────
const UserTask = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filterDept, setFilterDept] = useState("");

  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATH.USERS.GET_ALL_USERS);
      if (response.data?.length > 0) {
        setAllUsers(response.data);
      } else {
        toast("No users found.", { icon: "ℹ️" });
      }
    } catch (error) {
      toast.error("Failed to load users!");
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get(API_PATH.REPORTS.EXPORT_USERS, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `report_team_${moment().format('YYYYMMDD')}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Report downloaded!");
    } catch {
      toast.error("Failed to download report!");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axiosInstance.delete(API_PATH.USERS.DELETE_USER(userId));
      toast.success("User deleted!");
      setAllUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch {
      toast.error("Failed to delete user!");
    }
  };

  // Ambil daftar departemen unik untuk filter dropdown
  const departmentList = [
    ...new Set(allUsers.map((u) => u.employeeInfo?.department).filter(Boolean)),
  ];

  // Filter user berdasarkan departemen yang dipilih
  const filteredUsers = allUsers.filter((user) => {
    return filterDept === "" || user.employeeInfo?.department === filterDept;
  });

  return (
    <DashboardLayout activeMenu="Team Members">
      <div className="p-6 bg-white rounded-lg shadow-lg min-h-full">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b pb-4 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Team Members</h2>
            <p className="text-sm text-gray-500">Manajemen tugas berdasarkan personil tim.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Dropdown Filter Departemen */}
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Filter Dept:</span>
              <select 
                className="bg-transparent text-sm font-semibold text-gray-700 outline-none cursor-pointer"
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
              >
                <option value="">Semua Departemen</option>
                {departmentList.map((dept, idx) => (
                  <option key={idx} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleDownloadReport}
              className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition flex items-center gap-2"
            >
              <span>⬇️</span> Export Excel
            </button>
          </div>
        </div>

        {/* User Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className="cursor-pointer hover:scale-[1.02] transition-transform"
              >
                <UserCard userInfo={user} onDelete={handleDeleteUser} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400 text-lg">Tidak ada anggota tim ditemukan.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Detail */}
      {selectedUser && (
        <UserTaskModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </DashboardLayout>
  );
};

export default UserTask;