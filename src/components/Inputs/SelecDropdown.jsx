import React, { useState } from "react";
import { HiChevronDown } from "react-icons/hi";

const SelecDropdown = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:border-indigo-500 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all"
      >
        <span>
          {value
            ? options.find((opt) => opt.value === value)?.label
            : placeholder || "Select..."}
        </span>
        <HiChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden animate-fadeIn">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`px-4 py-2 cursor-pointer text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors ${
                value === option.value ? "bg-indigo-100 text-indigo-700" : ""
              }`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelecDropdown;
