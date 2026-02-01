import React from "react";
import { useRef } from "react";
import { useState } from "react";
import { FaLungs, FaTrash, FaUpload, FaUser } from "react-icons/fa6";

const ProfilePhotoSelector = ({ image, setImage }) => {
  const inputRef = useRef(null);
  const [previewUrl, setpreviewUrl] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // update the image state
      setImage(file);

      // generate preview url from the file
      const preview = URL.createObjectURL(file);
      setpreviewUrl(preview);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setpreviewUrl(null);
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Input file tersembunyi */}
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {/* Jika belum ada gambar */}
      {!image ? (
        <div className="flex flex-col items-center justify-center bg-gray-100 rounded-xl p-6 w-40 h-40 border-2 border-dashed border-gray-300 hover:border-indigo-400 transition duration-300">
          <FaUser className="text-gray-400 text-5xl mb-3" />
          <button
            type="button"
            onClick={onChooseFile}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-3 py-2 rounded-lg transition duration-300 shadow-md"
          >
            <FaUpload size={14} />
            Upload
          </button>
        </div>
      ) : (
        // Jika sudah ada gambar
        <div className="relative w-40 h-40">
          <img
            src={previewUrl}
            alt="Profile"
            className="w-full h-full object-cover rounded-xl shadow-md border border-gray-300"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md transition duration-300"
          >
            <FaTrash size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;
