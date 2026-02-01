import React, { useState } from "react";
import SideMenu from "./SideMenu";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);

  return (
    <>
      {/* Navbar */}
      <nav className="w-full bg-white border-b shadow-sm flex items-center justify-between px-6 py-4 fixed top-0 z-20">
        {/* Left: Toggle Button (Mobile) */}
        <button
          onClick={() => setOpenSideMenu(!openSideMenu)}
          className="md:hidden text-gray-700 hover:text-indigo-600 transition"
        >
          {openSideMenu ? (
            <HiOutlineX className="w-6 h-6" />
          ) : (
            <HiOutlineMenu className="w-6 h-6" />
          )}
        </button>

        {/* Center: Brand */}
        <h2 className="text-xl font-semibold text-gray-800">
          Task Manager
        </h2>

        {/* Right: Placeholder (optional) */}
        <div className="hidden md:flex items-center gap-4">
          <span className="text-gray-500 text-sm">Welcome 👋</span>
        </div>
      </nav>

      {/* Overlay Sidebar (Mobile) */}
      {openSideMenu && (
        <div className="fixed inset-0 z-30 bg-black bg-opacity-40 md:hidden">
          <div className="absolute top-0 left-0 w-64 h-full bg-white shadow-lg p-4 animate-slide-in">
            <SideMenu activeMenu={activeMenu} />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
