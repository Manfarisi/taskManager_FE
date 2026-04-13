import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axiosInstance from "../../utils/axiosinstance";
import moment from "moment";
import toast from "react-hot-toast";
import { HiCheck, HiXMark, HiMagnifyingGlass, HiCalendarDays, HiUserCircle, HiFunnel } from "react-icons/hi2";

const LeaveManagement = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // --- STATE FILTER ---
  const [filterMonth, setFilterMonth] = useState(""); // Kosong berarti semua bulan
  const [filterYear, setFilterYear] = useState(moment().format("YYYY"));

  const MAX_LEAVE_QUOTA = 32;

  const fetchLeaves = async () => {
    try {
      const response = await axiosInstance.get("/api/attendance/leave-requests");
      setLeaves(response.data);
      setLoading(false);
    } catch (error) {
      toast.error("Gagal mengambil data pengajuan");
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeaves(); }, []);

  const handleAction = async (id, status) => {
    try {
      await axiosInstance.put(`/api/attendance/leave-action/${id}`, { status });
      toast.success(`Pengajuan berhasil di-${status}`);
      fetchLeaves(); 
    } catch (error) {
      toast.error("Gagal memproses aksi");
    }
  };

  // --- LOGIKA KALKULASI SISA CUTI ---
  const getLeaveStats = (userId) => {
    // Hitung total hari yang sudah DISETUJUI pada tahun yang sedang difilter
    const usedDays = leaves
      .filter(l => 
        l.userId?._id === userId && 
        l.status === 'Disetujui' && 
        moment(l.startDate).format("YYYY") === filterYear
      )
      .reduce((acc, curr) => {
        const days = moment(curr.endDate).diff(moment(curr.startDate), 'days') + 1;
        return acc + days;
      }, 0);

    return {
      used: usedDays,
      remaining: MAX_LEAVE_QUOTA - usedDays
    };
  };

  // --- LOGIKA FILTER TABEL ---
  const filteredLeaves = leaves.filter(leave => {
    const matchSearch = leave.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        leave.type?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchYear = moment(leave.startDate).format("YYYY") === filterYear;
    const matchMonth = filterMonth === "" || moment(leave.startDate).format("M") === filterMonth;

    return matchSearch && matchYear && matchMonth;
  });

  // Data Tahun untuk Dropdown (3 tahun terakhir)
  const years = [moment().format("YYYY"), moment().subtract(1, "year").format("YYYY"), moment().subtract(2, "year").format("YYYY")];

  return (
    <DashboardLayout activeMenu="Leave Management">
      <div className="min-h-screen bg-[#f8fafc] p-6 md:p-10 text-slate-700">
        
        {/* Header Section */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
              Manajemen Cuti
            </h2>
            <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
              <HiCalendarDays className="w-4 h-4" /> Kuota Tahunan: <span className="font-bold text-slate-800">{MAX_LEAVE_QUOTA} Hari</span>
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-3 w-full xl:w-auto">
            {/* Search */}
            <div className="relative flex-1 md:w-64">
              <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Cari karyawan..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-6 text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
              />
            </div>

            {/* Filter Group */}
            <div className="flex items-center gap-2 bg-white border border-slate-200 p-1.5 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 px-3 border-r border-slate-100">
                <HiFunnel className="text-slate-400 w-4 h-4" />
                <select 
                  className="bg-transparent border-none text-xs font-bold text-slate-600 focus:ring-0 cursor-pointer"
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                >
                  <option value="">Semua Bulan</option>
                  {moment.months().map((m, i) => (
                    <option key={i} value={i + 1}>{m}</option>
                  ))}
                </select>
              </div>
              <select 
                className="bg-transparent border-none text-xs font-bold text-slate-600 focus:ring-0 cursor-pointer px-3"
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
              >
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm shadow-slate-200/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">
                  <th className="p-6">Karyawan & Sisa Kuota</th>
                  <th className="p-6">Detail Izin</th>
                  <th className="p-6">Periode</th>
                  <th className="p-6 text-center">Status</th>
                  <th className="p-6 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="p-20 text-center">
                      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-slate-400 text-sm">Memuat data...</p>
                    </td>
                  </tr>
                ) : filteredLeaves.length > 0 ? (
                  filteredLeaves.map((leave) => {
                    const stats = getLeaveStats(leave.userId?._id);
                    return (
                      <tr key={leave._id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                              {leave.userId?.name?.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-800">{leave.userId?.name || "User"}</p>
                              {/* Keterangan Sisa Cuti */}
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${stats.remaining < 5 ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                                  Sisa: {stats.remaining} Hari
                                </span>
                                <span className="text-[10px] text-slate-400 font-medium italic">Terpakai: {stats.used}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="p-6">
                          <div className="bg-slate-100/50 px-3 py-1 rounded-lg w-fit mb-1">
                            <span className="text-xs font-bold text-slate-600">{leave.type}</span>
                          </div>
                          <p className="text-xs text-slate-400 italic max-w-[180px] truncate">"{leave.reason}"</p>
                        </td>

                        <td className="p-6">
                          <div className="text-[13px] font-bold text-slate-700">
                            {moment(leave.startDate).format("DD MMM")} - {moment(leave.endDate).format("DD MMM YYYY")}
                          </div>
                          <p className="text-[11px] text-slate-400 font-medium">
                            Durasi: {moment(leave.endDate).diff(moment(leave.startDate), 'days') + 1} Hari
                          </p>
                        </td>

                        <td className="p-6 text-center">
                          <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-2
                            ${leave.status === 'Disetujui' ? 'bg-green-50 text-green-600' : 
                              leave.status === 'Ditolak' ? 'bg-red-50 text-red-600' : 
                              'bg-orange-50 text-orange-600'}`}
                          >
                            {leave.status}
                          </div>
                        </td>

                        <td className="p-6 text-center">
                          <div className="flex justify-center gap-3">
                            {leave.status === 'Pending' ? (
                              <>
                                <button 
                                  onClick={() => handleAction(leave._id, 'Disetujui')}
                                  className="bg-white hover:bg-green-500 text-green-600 hover:text-white p-2.5 rounded-xl transition-all border border-slate-200 active:scale-90 shadow-sm"
                                >
                                  <HiCheck className="w-5 h-5" />
                                </button>
                                <button 
                                  onClick={() => handleAction(leave._id, 'Ditolak')}
                                  className="bg-white hover:bg-red-500 text-red-600 hover:text-white p-2.5 rounded-xl transition-all border border-slate-200 active:scale-90 shadow-sm"
                                >
                                  <HiXMark className="w-5 h-5" />
                                </button>
                              </>
                            ) : (
                              <span className="text-[10px] font-bold text-slate-300 tracking-widest uppercase">Selesai</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="p-20 text-center text-slate-400 italic">
                      Tidak ada data untuk periode ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LeaveManagement;