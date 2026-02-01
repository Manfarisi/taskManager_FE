import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from "../../utils/data";

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);
  const [sideMenuData, setSideMenuData] = useState([]);
  const navigate = useNavigate();

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
      return;
    }
    navigate(route);
  };

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  useEffect(() => {
    if (user) {
      setSideMenuData(
        user?.role === "admin" ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA
      );
    }
  }, [user]);

  return (
    <div className="flex flex-col w-64 min-h-screen bg-white border-r shadow-sm p-5">
      {/* User Info Section */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-300 mb-3">
          <img
            src={user?.profileImageUrl || "/default-profile.png"}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        {user?.role === "admin" && (
          <span className="text-xs text-white bg-indigo-500 px-3 py-1 rounded-full mb-2">
            Admin
          </span>
        )}
        <h5 className="text-lg font-semibold text-gray-800">
          {user?.name || "User"}
        </h5>
        <p className="text-sm text-gray-500">{user?.email || ""}</p>
      </div>

      {/* Menu List */}
      <div className="flex flex-col gap-2">
        {sideMenuData.map((item, index) => (
          <button
            key={`menu_${index}`}
            onClick={() => handleClick(item.path)}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
              activeMenu === item.label
                ? "bg-indigo-500 text-white font-medium shadow"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {/* Render icon di sini */}
            <item.icon
              className={`w-5 h-5 ${
                activeMenu === item.label ? "text-white" : "text-gray-500"
              }`}
            />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SideMenu;
