import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATH } from "../../utils/apiPath";
import { FaFileArchive } from "react-icons/fa";
import TaskStatusTabs from "../../components/TaskStatusTabs";
import TaskCard from "../../components/Card/TaskCard";
import toast from "react-hot-toast";

const MyTask = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");

  const navigate = useNavigate();

  const getAllTasks = async () => {
    try {
      const response = await axiosInstance.get(API_PATH.TASKS.GET_ALL_TASK, {
        params: { status: filterStatus === "All" ? "" : filterStatus },
      });

      setAllTasks(response.data?.tasks || []);

      const statusSummary = response.data?.statusSummary || {};
      const statusArray = [
        { label: "All", count: statusSummary.all || 0 },
        { label: "Pending", count: statusSummary.pendingTasks || 0 },
        { label: "In Progress", count: statusSummary.inProgressTasks || 0 },
        { label: "Completed", count: statusSummary.completedTasks || 0 },
      ];

      setTabs(statusArray);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleClick = (taskId) => {
    navigate(`/user/task-details/${taskId}`);
  };

  useEffect(() => {
    getAllTasks(filterStatus);
  }, [filterStatus]);

  return (
    <DashboardLayout activeMenu="Manage Tasks">
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

        {/* Tabs Section */}
        {tabs.length > 0 && (
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <TaskStatusTabs
              tabs={tabs}
              activeTab={filterStatus}
              setActiveTab={setFilterStatus}
            />
          </div>
        )}

        {/* Task List */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {allTasks?.length > 0 ? (
            allTasks.map((item) => (
              <TaskCard
                key={item._id}
                title={item.title}
                description={item.description}
                priority={item.priority}
                status={item.status}
                progress={item.progress}
                createdAt={item.createdAt}
                dueDate={item.dueDate}
                assignedTo={item.assignedTo?.map((a) => a.profileImageUrl)}
                attachmentCount={item.attachments?.length || 0}
                completedTodoCount={item.completedTodoCount || 0}
                todoCheklist={item.todoCheklist || []}
                onClick={() => handleClick(item._id)}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-10">
              <p className="text-lg">Tidak ada tugas ditemukan 📭</p>
              <p className="text-sm">
                Tambahkan atau ubah filter status di atas.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyTask;
