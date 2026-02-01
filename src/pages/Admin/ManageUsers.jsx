import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useState } from "react";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATH } from "../../utils/apiPath";
import { useEffect } from "react";
import UserCard from "../../components/Card/UserCard";
import toast from "react-hot-toast";

const ManageUsers = () => {
  const [allUsers, setAllUsers] = useState([]);

  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATH.USERS.GET_ALL_USERS);

      if (response.data?.length > 0) {
        setAllUsers(response.data);
      } else {
        toast("No users found.", { icon: "ℹ️" });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users!");
    }
  };

  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get(API_PATH.REPORTS.EXPORT_USERS, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "user_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Report downloaded!");
    } catch (error) {
      console.error("Error downloading user report:", error);
      toast.error("Failed to download report!");
    }
  };

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) {
      toast("Cancelled.", { icon: "❌" });
      return;
    }

    try {
      const response = await axiosInstance.delete(API_PATH.USERS.DELETE_USER(userId));

      if (response.status === 200) {
        toast.success("User deleted successfully!");
        setAllUsers((prev) => prev.filter((u) => u._id !== userId));
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user!");
    }
  };

  useEffect(() => {
    getAllUsers();

    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Team Members">
      <div className="p-6 bg-white rounded-lg shadow-lg min-h-full">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-3xl font-bold text-gray-800">Team Members</h2>
          <button
            onClick={handleDownloadReport}
            className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
          >
            ⬇️ Download Report
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {allUsers?.length > 0 ? (
            allUsers.map((user) => (
              <UserCard key={user._id} userInfo={user} onDelete={handleDeleteUser} />
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500 text-lg">No team members found.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageUsers;
