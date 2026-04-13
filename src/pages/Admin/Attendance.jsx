import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axiosInstance from "../../utils/axiosinstance";
import moment from "moment";
import toast from "react-hot-toast";

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk filter (Default ke minggu sekarang)
  const [selectedWeek, setSelectedWeek] = useState(moment().format("YYYY-[W]WW"));

  // Logika menghitung rentang hari berdasarkan filter
  const startOfWeek = moment(selectedWeek, "YYYY-[W]WW").startOf("isoWeek");
  const weekDays = [0, 1, 2, 3, 4].map((i) => moment(startOfWeek).add(i, "days"));

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      // Kamu bisa mengirim filter ke backend jika API mendukung:
      // const response = await axiosInstance.get(`/api/attendance/all?week=${selectedWeek}`);
      const response = await axiosInstance.get("/api/attendance/all");
      setAttendanceData(response.data);
      setLoading(false);
    } catch (error) {
      toast.error("Gagal mengambil data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [selectedWeek]); // Refresh data setiap kali filter minggu berubah

  // Logika mengelompokkan data berdasarkan User ID
  const groupedData = attendanceData.reduce((acc, curr) => {
    const userId = curr.userId?._id;
    if (!userId) return acc;
    if (!acc[userId]) {
      acc[userId] = {
        name: curr.userId.name,
        init: curr.userId.name?.charAt(0) || "U",
        records: {},
      };
    }
    const dateKey = moment(curr.date).format("YYYY-MM-DD");
    acc[userId].records[dateKey] = curr;
    return acc;
  }, {});

  return (
    <DashboardLayout activeMenu="Attendance">
      <div className="p-8 bg-[#f8fafc] min-h-screen">
        <div className="max-w-7xl mx-auto">
          
          {/* Toolbar / Header */}
          <div className="flex justify-between items-end mb-6 flex-wrap gap-6">
            <div>
              <h2 className="text-[18px] font-bold text-slate-800">Rekap Kehadiran</h2>
              <p className="text-[12px] text-slate-500 mt-1">
                Periode: <span className="font-semibold text-slate-700">
                  {startOfWeek.format("DD MMM")} - {moment(startOfWeek).add(4, "days").format("DD MMM YYYY")}
                </span>
              </p>
            </div>

            {/* Filter Controls */}
            <div className="flex items-center gap-4 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 mb-1">Pilih Minggu</label>
                <input 
                  type="week" 
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(e.target.value)}
                  className="text-[13px] border-none focus:ring-0 text-slate-700 font-medium cursor-pointer"
                />
              </div>
              <div className="h-8 w-[1px] bg-slate-200"></div>
              <div className="flex gap-2 pr-2">
                <span className="text-[10px] px-2 py-1 bg-[#EAF3DE] text-[#27500A] rounded font-bold">Hadir</span>
                <span className="text-[10px] px-2 py-1 bg-[#FCEBEB] text-[#791F1F] rounded font-bold">Absen</span>
              </div>
            </div>
          </div>

          {/* Table Wrapper */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-slate-50/80">
                    <th className="p-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 min-w-[180px]">Karyawan</th>
                    {weekDays.map((day, i) => (
                      <th key={i} className={`p-4 text-center border-b border-slate-100 border-l border-slate-50 min-w-[130px] ${moment().isSame(day, 'day') ? 'bg-indigo-50/30' : ''}`}>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">{day.format("dddd")}</div>
                        <div className="text-[15px] text-slate-700 font-bold">{day.format("DD MMM")}</div>
                      </th>
                    ))}
                    <th className="p-4 text-center text-[11px] font-bold text-slate-500 uppercase border-b border-slate-100 border-l border-slate-50 bg-slate-50/50">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="7" className="p-16 text-center"><div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></td></tr>
                  ) : Object.values(groupedData).length > 0 ? (
                    Object.values(groupedData).map((user, idx) => {
                      let hadirCount = 0;
                      return (
                        <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                          <td className="p-4 border-b border-slate-50">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shadow-sm">
                                {user.init}
                              </div>
                              <span className="text-[13px] font-bold text-slate-700">{user.name}</span>
                            </div>
                          </td>
                          
                          {weekDays.map((day, i) => {
                            const dateKey = day.format("YYYY-MM-DD");
                            const record = user.records[dateKey];
                            const isToday = moment().isSame(day, 'day');

                            if (record?.status === 'Hadir') hadirCount++;

                            return (
                              <td key={i} className={`p-4 border-b border-slate-50 border-l border-slate-50 text-center ${isToday ? 'bg-indigo-50/10' : ''}`}>
                                {record ? (
                                  <div className="flex flex-col items-center gap-1">
                                    <div className="flex flex-col text-[10px] font-bold mb-1">
                                      <span className="text-emerald-600">IN {record.checkIn ? moment(record.checkIn).format("HH:mm") : "--"}</span>
                                      <span className="text-rose-500">OUT {record.checkOut ? moment(record.checkOut).format("HH:mm") : "--"}</span>
                                    </div>
                                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter ${getStatusClass(record.status)}`}>
                                      {record.status}
                                    </span>
                                  </div>
                                ) : (
                                  <div className="py-2">
                                    <span className="text-slate-200 text-[18px] font-light">—</span>
                                  </div>
                                )}
                              </td>
                            );
                          })}

                          <td className="p-4 border-b border-slate-50 border-l border-slate-50 text-center bg-slate-50/20">
                            <div className="text-[16px] font-black text-indigo-600">{hadirCount}</div>
                            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Hadir</div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr><td colSpan="7" className="p-20 text-center text-slate-400 font-medium">Tidak ditemukan data kehadiran untuk periode ini.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

const getStatusClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'hadir': return 'bg-[#EAF3DE] text-[#3B6D11] border border-[#d9e8c5]';
    case 'absen': return 'bg-[#FCEBEB] text-[#A32D2D] border border-[#f9dada]';
    case 'cuti':  return 'bg-[#FAEEDA] text-[#854F0B] border border-[#f5e1c2]';
    case 'izin':  return 'bg-[#E6F1FB] text-[#185FA5] border border-[#d1e4f7]';
    default: return 'bg-slate-100 text-slate-400';
  }
};

export default Attendance;