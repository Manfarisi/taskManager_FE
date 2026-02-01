import React, { useState } from "react";
import { HiOutlineTrash, HiPlus } from "react-icons/hi";

const TodoListInput = ({ todoList, setTodoList }) => {
  const [option, setOption] = useState("");

  const handleAddOption = () => {
    if (option.trim()) {
      // Pastikan todoList adalah array, meskipun seharusnya sudah aman dari komponen induk
      setTodoList([...(todoList || []), option.trim()]);
      setOption("");
    }
  };

  const handleDeleteOption = (index) => {
    const updatedArr = todoList.filter((_, idx) => idx !== index);
    setTodoList(updatedArr);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 space-y-5">
      <h3 className="text-xl font-bold text-blue-700 border-b border-blue-100 pb-3">
        📝 To-Do Checklist
      </h3>

      {/* Daftar Todo */}
      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
        {(todoList?.length === 0 || !todoList) && (
          <p className="text-gray-500 text-sm italic py-2">
            Belum ada item di checklist. Tambahkan satu di bawah!
          </p>
        )}

        {todoList?.map((item, index) => (
          <div
            // Gunakan index sebagai key jika item hanya string dan tidak memiliki ID unik
            key={index} 
            className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm transition-all hover:border-blue-300"
          >
            <div className="flex items-start gap-4">
              {/* Nomor Urut Berwarna */}
              <span className="text-sm font-bold text-white bg-blue-500 w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0 mt-0.5">
                {index + 1}
              </span>
              <p className="text-gray-800 text-base break-words flex-1">
                {item}
              </p>
            </div>

            {/* Tombol Hapus dengan Warna dan Pointer */}
            <button
              onClick={() => handleDeleteOption(index)}
              className="text-red-500 hover:text-white hover:bg-red-600 transition-all duration-200 p-1.5 rounded-full cursor-pointer flex-shrink-0"
              title="Hapus Tugas"
            >
              <HiOutlineTrash className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      {/* Input Tambah Todo */}
      <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
        <input
          type="text"
          placeholder="Tambahkan tugas baru..."
          value={option}
          onChange={({ target }) => setOption(target.value)}
          onKeyDown={(e) => { // Memungkinkan penambahan dengan tombol Enter
            if (e.key === 'Enter') {
                handleAddOption();
            }
          }}
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-150"
        />
        {/* Tombol Add dengan Ikon Berwarna dan Pointer */}
        <button
          onClick={handleAddOption}
          disabled={!option.trim()}
          className="flex items-center gap-2 bg-blue-600 text-white font-medium text-sm px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-md cursor-pointer disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          <HiPlus className="w-4 h-4" />
          Add
        </button>
      </div>
    </div>
  );
};

export default TodoListInput;