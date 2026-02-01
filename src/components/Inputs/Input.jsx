import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Input = ({ value, onChange, label, placeholder, type }) => {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <div className="w-full mb-5">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          type={type === "password" ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e)}
          className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-800 transition-all duration-200 placeholder-gray-400"
        />

        {type === "password" && (
          <button
            type="button"
            onClick={toggleShowPassword}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-indigo-600 transition-colors duration-200"
          >
            {showPassword ? <FaRegEye size={20} /> : <FaRegEyeSlash size={20} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
