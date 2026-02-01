import React from "react";

const InfoCard = ({ icon, label, value, iconColor }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl transition duration-300 ease-in-out transform hover:scale-[1.02] border border-gray-100">
      <div className="flex items-center space-x-4">
        {/* Menggunakan bg-opacity-20 untuk background icon yang lebih lembut */}
        <div className={`p-3 rounded-full ${iconColor} bg-opacity-20`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <h3 className="text-3xl font-bold text-gray-900 mt-1">{value}</h3>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
