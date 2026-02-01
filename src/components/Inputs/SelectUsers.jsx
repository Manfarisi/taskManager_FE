import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATH } from "../../utils/apiPath";
import { HiUserAdd } from "react-icons/hi";
import Model from "../Model";

const SelectUsers = ({ selectedUsers, setSelectedUsers }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelectedUsers, setTempSelectedUsers] = useState([]);

  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATH.USERS.GET_ALL_USERS);
      if (response.data?.length > 0) {
        setAllUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const toggleUserSelection = (userId) => {
    setTempSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAssign = () => {
    setSelectedUsers(tempSelectedUsers);
    setIsModalOpen(false);
  };

  const selectedUsersAvatars = allUsers
    .filter((user) => selectedUsers.includes(user._id))
    .map((user) => user.profileImageUrl);

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div className="mt-4">
      {selectedUsersAvatars.length === 0 ? (
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          <HiUserAdd className="text-lg" /> Add Members
        </button>
      ) : (
        <div className="flex items-center gap-2">
          {selectedUsersAvatars.map((avatar, idx) => (
            <img
              key={idx}
              src={avatar}
              alt="user"
              className="w-10 h-10 rounded-full border-2 border-white shadow-md"
            />
          ))}
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition"
          >
            <HiUserAdd />
          </button>
        </div>
      )}


      <Model
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Select Users"
      >
        <div className="max-h-[400px] overflow-y-auto space-y-3">
          {allUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between p-3 border rounded-xl hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-4 p-3 rounded-xl bg-gradient-to-r from-white to-gray-50 hover:from-blue-50 hover:to-white shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer">
                {user.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-200 shadow-sm"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold">
                    {user.name?.[0]?.toUpperCase() || "?"}
                  </div>
                )}

                <div className="flex flex-col">
                  <p className="font-semibold text-gray-800 tracking-wide">
                    {user.name}
                  </p>
                  <p className="text-sm text-gray-500 italic">{user.email}</p>
                </div>
              </div>

              <input
                type="checkbox"
                checked={tempSelectedUsers.includes(user._id)}
                onChange={() => toggleUserSelection(user._id)}
                className="w-5 h-5 accent-blue-600 cursor-pointer"
              />
            </div>
          ))}
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={handleAssign}
            className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            Assign Selected
          </button>
        </div>
      </Model>
    </div>
  );
};

export default SelectUsers;
