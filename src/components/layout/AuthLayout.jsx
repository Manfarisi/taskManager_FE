import React from "react";

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white shadow-2xl rounded-2xl flex flex-col md:flex-row overflow-hidden w-[90%] max-w-5xl">
        {/* Bagian kiri (form auth) */}
        <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            Task Manager
          </h2>
          <div className="w-full max-w-md">{children}</div>
        </div>

        {/* Bagian kanan (gambar ilustrasi) */}
        <div className="hidden md:flex flex-1 bg-gray-100 items-center justify-center p-8">
          <img
            src="https://illustrations.popsy.co/gray/team-idea.svg"
            alt="Auth Illustration"
            className="w-3/4 max-w-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
