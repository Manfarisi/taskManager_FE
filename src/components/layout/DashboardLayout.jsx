import React, { useContext } from "react";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";
import { UserContext } from "../../context/userContext";

const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 mt-10 p-3">
      {/* Navbar */}
      <Navbar activeMenu={activeMenu} />

      {/* Sidebar + Content */}
      {user && (
        <div className="flex flex-1">
          {/* Sidebar */}
          <aside className="hidden md:flex w-64 bg-white border-r shadow-sm">
            <SideMenu activeMenu={activeMenu} />
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-y-auto h-[calc(100vh-100px)]">
            <div className="bg-white shadow-sm rounded-2xl p-6 min-h-max">
              {children}
            </div>
          </main>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
