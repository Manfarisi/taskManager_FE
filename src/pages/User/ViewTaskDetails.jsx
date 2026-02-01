import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATH } from "../../utils/apiPath";
import { HiClock, HiClipboardList, HiUser, HiExternalLink, HiExclamationCircle, HiCheckCircle } from "react-icons/hi";
import moment from "moment"; 

const ViewTaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fungsi untuk menentukan warna badge status
  const getStatusTagColor = (status) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Completed":
        return "bg-green-100 text-green-800 border-green-300";
      case "Pending":
      default:
        return "bg-amber-100 text-amber-800 border-amber-300";
    }
  };

  // Fungsi untuk mendapatkan ikon status
  const getStatusIcon = (status) => {
    switch (status) {
      case "In Progress":
        return <HiClock className="w-4 h-4 mr-1.5" />; 
      case "Completed":
        return <HiCheckCircle className="w-4 h-4 mr-1.5" />; 
      case "Pending":
      default:
        return <HiExclamationCircle className="w-4 h-4 mr-1.5" />; 
    }
  };

  // get task info by id (Mengambil data dari response.data.data)
  const getTaskDetailsById = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATH.TASKS.GET_TASK_BY_ID(id));
      
      const taskData = response.data?.data; 

      if (taskData) {
        setTask(taskData);
      }
    } catch (error) {
      console.error("Error fetching task details:", error);
    } finally {
        setLoading(false);
    }
  };

  // hande todo check (Disesuaikan untuk memanggil UPDATE_TODO_CHEKLIST)
  const updateTodoCheklist = async (index) => {
    if (!task || !task.todoCheklist) return;

    // 1. Buat array baru dengan status checklist yang sudah diubah
    const newChecklist = task.todoCheklist.map((item, i) => 
      i === index ? { ...item, completed: !item.completed } : item
    );

    try {
      // 2. Panggil API dengan endpoint yang BENAR: UPDATE_TODO_CHEKLIST
      const response = await axiosInstance.put(
        // Asumsi API_PATH.TASKS.UPDATE_TODO_CHEKLIST(id) sudah didefinisikan
        API_PATH.TASKS.UPDATE_TODO_CHEKLIST(id), 
        { todoCheklist: newChecklist } // Kirim array yang sudah dimodifikasi
      );
      
      // 3. Update state task dengan data terbaru dari respons backend (properti 'task')
      if (response.data?.task) {
        setTask(response.data.task);
      }
    } catch (error) {
      console.error("Error updating checklist:", error);
      // Anda bisa menambahkan logic untuk membatalkan perubahan lokal jika gagal
    }
  };

  // handle link click
  const handleClick = (link) => {
    if (link) window.open(link, "_blank");
  };

  useEffect(() => {
    if (id) {
      getTaskDetailsById();
    }
    return () => {};
  }, [id]);

  // Loading State
  if (loading) {
    return (
        <DashboardLayout activeMenu="My Tasks">
            <div className="flex justify-center items-center h-64 text-gray-500 text-lg">
                Memuat detail tugas... ⏳
            </div>
        </DashboardLayout>
    );
  }

  // Task not found state
  if (!task) {
    return (
      <DashboardLayout activeMenu="My Tasks">
        <div className="flex justify-center items-center h-64 text-red-500 text-lg">
          Tugas tidak ditemukan.
        </div>
      </DashboardLayout>
    );
  }

  // --- Main Content ---
  return (
    <DashboardLayout activeMenu="My Tasks">
      <div className="p-6 md:p-8 space-y-6 bg-gray-50 min-h-screen">
        
        {/* Header Section: Title & Status Badge */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 bg-white rounded-xl shadow-md border border-gray-100">
            <div>
                <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">
                    {task.title || "Nama Tugas"}
                </h2>
                <p className="text-gray-500 mt-1 text-sm">
                    Dibuat pada {moment(task.createdAt).format("DD MMMM YYYY") || 'N/A'}
                </p>
            </div>
            
            {/* Status Badge */}
            <div className="mt-4 md:mt-0">
                <span
                    className={`
                        inline-flex 
                        items-center 
                        px-4 py-1.5 
                        rounded-full 
                        text-sm 
                        font-bold 
                        border
                        shadow-sm 
                        uppercase
                        ${getStatusTagColor(task.status)}
                    `}
                >
                    {getStatusIcon(task.status)}
                    {task.status}
                </span>
            </div>
        </div>

        {/* --- */}
        
        {/* Detail Cards Section: Deadline, Priority, Assigned To */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Deadline */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
                <HiClock className="text-amber-500 w-8 h-8 p-1.5 bg-amber-50 rounded-full" />
                <div>
                    <p className="text-gray-500 text-xs uppercase font-medium">Deadline</p>
                    <p className="font-semibold text-gray-800 text-lg">
                        {task.dueDate ? moment(task.dueDate).format("DD MMM YYYY") : "Tidak Ada"}
                    </p>
                </div>
            </div>

            {/* Card 2: Priority */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
                <HiClipboardList className="text-blue-500 w-8 h-8 p-1.5 bg-blue-50 rounded-full" />
                <div>
                    <p className="text-gray-500 text-xs uppercase font-medium">Prioritas</p>
                    <p
                        className={`font-bold text-lg ${
                            task.priority === "High"
                                ? "text-red-600"
                                : task.priority === "Medium"
                                ? "text-orange-500"
                                : "text-green-600"
                        }`}
                    >
                        {task.priority || "Low"}
                    </p>
                </div>
            </div>

            {/* Card 3: Assigned To */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
                <HiUser className="text-emerald-500 w-8 h-8 p-1.5 bg-emerald-50 rounded-full" />
                <div>
                    <p className="text-gray-500 text-xs uppercase font-medium">Dikerjakan oleh</p>
                    <p className="font-semibold text-gray-800 text-lg truncate">
                        {task.assignedTo && task.assignedTo.length > 0 ? task.assignedTo[0].name : "Belum Ditugaskan"}
                    </p>
                </div>
            </div>
        </div>
        
        {/* --- */}

        {/* Description Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Deskripsi Tugas</h3>
            <div className="prose max-w-none text-gray-700 leading-relaxed">
                <p className="whitespace-pre-line">
                    {task.description || "Tidak ada deskripsi rinci untuk tugas ini."}
                </p>
            </div>
        </div>
        
        {/* --- */}

        {/* Checklist/Todos Section */}
        {task.todoCheklist && task.todoCheklist.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Daftar Pekerjaan</h3>
            <ul className="space-y-3">
              {task.todoCheklist.map((todo, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition duration-150"
                >
                  <div className="flex items-center gap-3 w-full">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => updateTodoCheklist(index)} 
                      className="w-5 h-5 accent-indigo-600 cursor-pointer"
                    />
                    <span
                      className={`text-gray-800 flex-1 ${
                        todo.completed ? "line-through text-gray-500 italic" : "text-gray-800"
                      }`}
                    >
                      {todo.text}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* --- */}

        {/* External Link Section */}
        {task.link && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-md p-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">Tautan Terkait</h3>
              <p className="text-indigo-600 hover:underline break-all max-w-lg">
                <a href={task.link} target="_blank" rel="noopener noreferrer">{task.link}</a>
              </p>
            </div>
            <button
              onClick={() => handleClick(task.link)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-md"
            >
              <HiExternalLink className="w-5 h-5" />
              Buka Tautan
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ViewTaskDetails;