import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATH } from "../../utils/apiPath";
import toast from "react-hot-toast";
import { HiTrash, HiPencilAlt, HiFilter } from "react-icons/hi";

const ManageUsers = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  
  // --- STATE FILTER ---
  const [filterDept, setFilterDept] = useState("");

  const [formData, setFormData] = useState({
    name: "", email: "", password: "",
    nip: "", position: "", department: "IT",
    phoneNumber: "", address: "", contrack: "Contrack"
  });

  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATH.USERS.GET_ALL_USERS);
      if (response.data) setAllUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users!");
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  // --- LOGIKA FILTER DEPARTEMEN ---
  const filteredUsers = allUsers.filter((user) => {
    return filterDept === "" || user.employeeInfo?.department === filterDept;
  });

  // Ambil list departemen unik untuk filter dropdown secara dinamis
  const departmentList = [
    ...new Set(allUsers.map((u) => u.employeeInfo?.department).filter(Boolean)),
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditClick = (user) => {
    setSelectedUserId(user._id);
    setIsEditMode(true);
    setIsModalOpen(true);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      nip: user.employeeInfo?.nip || "",
      position: user.employeeInfo?.position || "",
      department: user.employeeInfo?.department || "IT",
      phoneNumber: user.employeeInfo?.phoneNumber || "",
      address: user.employeeInfo?.address || "",
      contrack: user.employeeInfo?.contrack || "Contrack"
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (isEditMode) {
        response = await axiosInstance.put(`/api/users/update-employee/${selectedUserId}`, formData);
      } else {
        response = await axiosInstance.post("/api/users/register-employee", formData);
      }

      if (response.status === 200 || response.status === 201) {
        toast.success(isEditMode ? "Data diperbarui!" : "Karyawan ditambahkan!");
        closeModal();
        await getAllUsers();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Terjadi kesalahan");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Yakin ingin menghapus karyawan ini?")) return;
    try {
      await axiosInstance.delete(API_PATH.USERS.DELETE_USER(userId));
      toast.success("Karyawan dihapus!");
      setAllUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (error) {
      toast.error("Gagal menghapus!");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedUserId(null);
    setFormData({ name: "", email: "", password: "", nip: "", position: "", department: "IT", phoneNumber: "", address: "", contrack: "Contrack" });
  };

  return (
    <DashboardLayout activeMenu="Team Members">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800" style={{ fontFamily: "'Syne', sans-serif" }}>Daftar Karyawan</h2>
          <p className="text-sm text-gray-500 mt-1">Kelola data karyawan perusahaan</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* FILTER DROPDOWN */}
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
            <HiFilter className="text-gray-400 w-4 h-4" />
            <select 
              className="bg-transparent border-none text-xs font-bold text-gray-600 focus:ring-0 cursor-pointer outline-none"
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
            >
              <option value="">Semua Departemen</option>
              {departmentList.map((dept, index) => (
                <option key={index} value={dept}>{dept}</option>
              ))}
              {/* Fallback jika data masih kosong agar tetap ada pilihan */}
              {departmentList.length === 0 && (
                <>
                  <option value="IT">IT</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                </>
              )}
            </select>
          </div>

          <button 
            onClick={() => {setIsEditMode(false); setIsModalOpen(true)}}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-semibold shadow-sm hover:bg-indigo-700 transition whitespace-nowrap"
          >
            + Karyawan Baru
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Karyawan</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">No HP</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Departemen</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Posisi</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">NIP</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Kontrak</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xs">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800">{user.name}</p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                     <td className="px-6 py-4 text-sm text-gray-600">
                      {user.employeeInfo?.phoneNumber || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.employeeInfo?.department || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.employeeInfo?.position || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-500">
                      {user.employeeInfo?.nip || "-"}
                    </td>
                     <td className="px-6 py-4 text-sm font-mono text-gray-500">
                      {user.employeeInfo?.contrack || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                        user.employeeInfo?.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {user.employeeInfo?.status || 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => handleEditClick(user)} className="p-2 text-indigo-400 hover:text-indigo-600 transition">
                          <HiPencilAlt className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDeleteUser(user._id)} className="p-2 text-red-400 hover:text-red-600 transition">
                          <HiTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-400 italic">
                    Tidak ada data karyawan untuk departemen ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL FORM TETAP SAMA */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            {/* ... isi modal yang sudah Anda buat ... */}
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden border border-gray-100">
                <div className="bg-indigo-600 p-5 text-white flex justify-between items-center">
                    <h3 className="text-lg font-bold">{isEditMode ? "Edit Data Karyawan" : "Tambah Karyawan Baru"}</h3>
                    <button onClick={closeModal} className="hover:rotate-90 transition-transform">✕</button>
                </div>
                <form onSubmit={handleFormSubmit} className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Info Akun */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-widest border-b pb-1">Info Akun</h4>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Nama Lengkap</label>
                                <input name="name" value={formData.name} required onChange={handleInputChange} className="w-full mt-1 p-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Email</label>
                                <input name="email" type="email" value={formData.email} required onChange={handleInputChange} className="w-full mt-1 p-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Password</label>
                                <input 
                                    name="password" type="password" 
                                    placeholder={isEditMode ? "Kosongkan jika tidak ingin diubah" : "Masukkan password"} 
                                    required={!isEditMode} 
                                    onChange={handleInputChange} 
                                    className="w-full mt-1 p-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                                />
                            </div>
                        </div>

                        {/* Detail Pekerjaan */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-widest border-b pb-1">Detail Pekerjaan</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase">NIP</label>
                                    <input name="nip" value={formData.nip} required onChange={handleInputChange} className="w-full mt-1 p-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase">Status Kontrak</label>
                                    <select name="contrack" value={formData.contrack} onChange={handleInputChange} className="w-full mt-1 p-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                                        <option value="Contrack">Contract</option>
                                        <option value="Intership">Internship</option>
                                        <option value="Permanent">Permanent</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Posisi</label>
                                <input name="position" value={formData.position} required onChange={handleInputChange} className="w-full mt-1 p-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Departemen</label>
                                <select name="department" value={formData.department} onChange={handleInputChange} className="w-full mt-1 p-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                                    <option value="IT">IT Department</option>
                                    <option value="HR">Human Resource</option>
                                    <option value="Finance">Finance</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
                        <button type="button" onClick={closeModal} className="px-6 py-2 text-sm font-bold text-gray-400 hover:text-gray-600 transition">Batal</button>
                        <button type="submit" className="px-10 py-2.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
                            {isEditMode ? "Simpan Perubahan" : "Simpan Karyawan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ManageUsers;