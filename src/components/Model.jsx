import React from "react";

const Model = ({ children, isOpen, onClose, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
      {/* Modal Container */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 px-5 py-3">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100"
          >
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1l6 6m0 0 6-6M7 7l6 6M7 7L1 13"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 text-gray-700">{children}</div>
      </div>
    </div>
  );
};

export default Model;
