import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA} from "../../utils/data";

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);
  const [sideMenuData, setSideMenuData] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
      return;
    }
    navigate(route);
  };

  useEffect(() => {
    if (user) {
      setSideMenuData(
        user?.role === "admin" ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA
      );
    }
  }, [user]);

  // Fungsi Helper untuk merender item menu
  const renderMenuItem = (item, index) => (
    <button
      key={`menu_${index}`}
      onClick={() => handleClick(item.path)}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group w-full mb-1 ${
        activeMenu === item.label
          ? "bg-indigo-600 text-white font-medium shadow-md"
          : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
      }`}
    >
      <item.icon
        className={`w-5 h-5 ${
          activeMenu === item.label ? "text-white" : "text-gray-400 group-hover:text-indigo-600"
        }`}
      />
      <span className="text-sm">{item.label}</span>
    </button>
  );

  // Fungsi untuk mengelompokkan menu berdasarkan Section
  const renderSection = (sectionName) => {
    const sectionItems = sideMenuData.filter((item) => item.section === sectionName);
    if (sectionItems.length === 0) return null;

    return (
      <div className="mb-6">
        <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
          {sectionName}
        </p>
        {sectionItems.map((item, index) => renderMenuItem(item, index))}
      </div>
    );
  };

  return (
    <aside className="flex flex-col w-64 h-screen bg-white border-r shadow-sm p-5 overflow-hidden">

      {/* NAV SECTIONS (Scrollable if menu is long) */}
      <div className="flex-grow overflow-y-auto no-scrollbar">
        {renderSection("Overview")}
        {renderSection("Task Manager")}
        {renderSection("HR Management")}
        
        {/* Render menu yang tidak punya section (misal Logout atau menu default) */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          {sideMenuData
            .filter((item) => !item.section || item.path === "logout")
            .map((item, index) => renderMenuItem(item, index))}
        </div>
      

      {/* SIDEBAR FOOTER: USER CARD */}
      <div className="mt-3 border-t pt-5">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors group cursor-pointer relative">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-white shadow-sm flex-shrink-0">
            <img
              src={user?.profileImageUrl || "https://ui-avatars.com/api/?name=" + user?.name}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-grow overflow-hidden">
            <h6 className="text-sm font-bold text-gray-800 truncate leading-tight">
              {user?.name || "User"}
            </h6>
            <p className="text-[10px] text-gray-500 truncate uppercase font-semibold tracking-wider">
              {user?.role || "Member"}
            </p>
          </div>
        </div>
      </div>
      </div>
    </aside>
  );
};

export default SideMenu;

