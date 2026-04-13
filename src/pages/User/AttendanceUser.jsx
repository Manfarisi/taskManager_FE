import React, { useState, useEffect, useContext } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { UserContext } from "../../context/userContext";
import axiosInstance from "../../utils/axiosinstance";
import toast from "react-hot-toast";
import moment from "moment";
import { HiClock, HiMapPin, HiCalendarDays, HiCheckCircle, HiReceiptRefund, HiInformationCircle } from "react-icons/hi2";

const AttendanceUser = () => {
    const { user } = useContext(UserContext);
    const [todayLog, setTodayLog] = useState(null);
    const [currentTime, setCurrentTime] = useState(moment());
    const [loading, setLoading] = useState(true);
    const [locationName, setLocationName] = useState("Mencari lokasi...");
    const [history, setHistory] = useState([]);
    const [leaveHistory, setLeaveHistory] = useState([]); // State baru untuk riwayat cuti
    const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
    const [leaveData, setLeaveData] = useState({
        type: "Cuti",
        startDate: "",
        endDate: "",
        reason: ""
    });

    // 1. Fetch Semua Data
    const fetchData = async () => {
        setLoading(true);
        try {
            const [resToday, resHistory, resLeaves] = await Promise.all([
                axiosInstance.get("/api/attendance/today"),
                axiosInstance.get("/api/attendance/my-history"),
                axiosInstance.get("/api/attendance/my-leave-requests") // Endpoint baru di backend nanti
            ]);
            
            setTodayLog(resToday.data);
            setHistory(resHistory.data);
            setLeaveHistory(resLeaves.data);
        } catch (error) {
            console.error("Gagal memuat data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const timer = setInterval(() => setCurrentTime(moment()), 1000);
        getUserLocation();
        return () => clearInterval(timer);
    }, []);

    // 2. Handle Pengajuan Cuti
    const handleLeaveSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axiosInstance.post("/api/attendance/request-leave", leaveData);
            toast.success("Pengajuan berhasil dikirim!");
            setIsLeaveModalOpen(false);
            setLeaveData({ type: "Cuti", startDate: "", endDate: "", reason: "" });
            fetchData(); // Refresh semua data
        } catch (error) {
            toast.error(error.response?.data?.message || "Gagal mengajukan");
        } finally {
            setLoading(false);
        }
    };

    // Geolocation logic tetap sama...
    const getUserLocation = () => {
        if (!navigator.geolocation) return setLocationName("Geo tidak didukung");
        navigator.geolocation.getCurrentPosition(async (pos) => {
            try {
                const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&localityLanguage=id`);
                const data = await res.json();
                setLocationName(`${data.city || data.locality}, ${data.principalSubdivision}`);
            } catch { setLocationName("Gagal memuat lokasi"); }
        }, () => setLocationName("Akses lokasi ditolak"));
    };

    const handleAttendanceAction = async () => {
        setLoading(true);
        try {
            let response;
            if (!todayLog) {
                response = await axiosInstance.post("/api/attendance/check-in");
                toast.success("Check-in berhasil!");
            } else {
                response = await axiosInstance.post("/api/attendance/check-out");
                toast.success("Check-out berhasil!");
            }
            setTodayLog(response.data.data);
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Gagal absen");
        } finally { setLoading(false); }
    };

    return (
        <DashboardLayout activeMenu="Attendance">
            <div className="p-6 md:p-10 bg-[#f8fafc] min-h-screen">
                
                {/* Header */}
                <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                            Halo, {user?.name?.split(' ')[0] || "User"}!
                        </h1>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-bold text-slate-600 bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100">
                        <HiMapPin className="w-5 h-5 text-rose-500 animate-bounce" />
                        {locationName}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* LEFT: Attendance Action */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm text-center flex flex-col items-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6">
                                <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest">Shift Pagi</span>
                            </div>

                            <h2 className="text-6xl font-black text-slate-900 tracking-tighter mb-2">
                                {currentTime.format("HH:mm:ss")}
                            </h2>
                            <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[11px] mb-12">
                                {currentTime.format("dddd, DD MMMM YYYY")}
                            </p>

                            <div className="w-full max-w-sm space-y-4">
                                <button
                                    onClick={handleAttendanceAction}
                                    disabled={loading || (todayLog && todayLog.checkOut)}
                                    className={`w-full py-5 rounded-[24px] text-lg font-black transition-all shadow-lg active:scale-95 ${
                                        !todayLog ? "bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700" :
                                        !todayLog.checkOut ? "bg-orange-500 text-white shadow-orange-200 hover:bg-orange-600" :
                                        "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                                    }`}
                                >
                                    {loading ? "Sabar ya..." : !todayLog ? "MULAI KERJA" : !todayLog.checkOut ? "SELESAI KERJA" : "TUGAS SELESAI"}
                                </button>

                                {!todayLog && (
                                    <button
                                        onClick={() => setIsLeaveModalOpen(true)}
                                        className="w-full py-4 rounded-[24px] text-sm font-bold border-2 border-dashed border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-indigo-300 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
                                    >
                                        <HiReceiptRefund className="w-5 h-5" />
                                        Ajukan Izin / Cuti
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* BOTTOM: Leave Request Tracking (Fitur Baru) */}
                        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                            <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2 text-lg">
                                <HiReceiptRefund className="w-6 h-6 text-indigo-500" /> Status Pengajuan Terakhir
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {leaveHistory.length > 0 ? (
                                    leaveHistory.slice(0, 4).map((leave) => (
                                        <div key={leave._id} className="p-5 rounded-3xl border border-slate-50 bg-slate-50/50 flex justify-between items-center">
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{leave.type}</p>
                                                <p className="text-sm font-bold text-slate-800">{moment(leave.startDate).format("DD MMM")} - {moment(leave.endDate).format("DD MMM")}</p>
                                            </div>
                                            <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border
                                                ${leave.status === 'Disetujui' ? 'bg-green-50 text-green-600 border-green-100' : 
                                                  leave.status === 'Ditolak' ? 'bg-red-50 text-red-600 border-red-100' : 
                                                  'bg-orange-50 text-orange-600 border-orange-100'}`}
                                            >
                                                {leave.status}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="col-span-2 text-center py-10 text-slate-400 text-sm italic font-medium">Belum ada riwayat pengajuan cuti.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Weekly History */}
                    <div className="space-y-8">
                        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                                    <HiCalendarDays className="w-5 h-5 text-indigo-500" /> Absensi Mingguan
                                </h4>
                            </div>
                            <div className="space-y-4">
                                {history.slice(0, 5).map((log) => (
                                    <div key={log._id} className="group p-4 bg-white hover:bg-slate-50 rounded-[24px] border border-slate-50 transition-all flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">{moment(log.date).format("dddd")}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">{moment(log.date).format("D MMMM")}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-black text-slate-700">{log.checkIn ? moment(log.checkIn).format("HH:mm") : "--:--"}</p>
                                            <p className={`text-[9px] font-black uppercase ${log.status === 'Hadir' ? 'text-green-500' : 'text-orange-500'}`}>{log.status}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tips Card */}
                        <div className="bg-indigo-600 p-8 rounded-[40px] text-white shadow-lg shadow-indigo-200 relative overflow-hidden group">
                            <HiInformationCircle className="w-24 h-24 absolute -right-6 -bottom-6 text-white/10 group-hover:rotate-12 transition-transform" />
                            <h5 className="font-bold mb-2">Ingat Berdoa!</h5>
                            <p className="text-xs text-indigo-100 leading-relaxed font-medium">
                                Jangan lupa awali pekerjaanmu dengan doa agar setiap langkahmu menjadi berkah bagi keluarga di rumah. Semangat!
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Pengajuan Cuti (Tetap Sama) */}
            {isLeaveModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[99] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[40px] w-full max-w-md overflow-hidden shadow-2xl border border-white">
                        <div className="bg-slate-900 p-8 text-white">
                            <h3 className="text-2xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>Form Izin</h3>
                            <p className="text-slate-400 text-xs mt-1 font-bold uppercase tracking-widest">Nexawork Leave Management</p>
                        </div>
                        <form onSubmit={handleLeaveSubmit} className="p-8 space-y-5">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Jenis Izin</label>
                                <select className="w-full mt-2 p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm text-slate-700"
                                    value={leaveData.type} onChange={(e) => setLeaveData({ ...leaveData, type: e.target.value })}>
                                    <option value="Cuti">🌴 Cuti Tahunan</option>
                                    <option value="Izin">📝 Izin Keperluan</option>
                                    <option value="Sakit">🤒 Sakit (SKS)</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mulai</label>
                                    <input type="date" required className="w-full mt-2 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700"
                                        onChange={(e) => setLeaveData({ ...leaveData, startDate: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Selesai</label>
                                    <input type="date" required className="w-full mt-2 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700"
                                        onChange={(e) => setLeaveData({ ...leaveData, endDate: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Alasan</label>
                                <textarea required placeholder="Tulis alasan singkat..." className="w-full mt-2 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm h-28 resize-none outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-600"
                                    onChange={(e) => setLeaveData({ ...leaveData, reason: e.target.value })}></textarea>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setIsLeaveModalOpen(false)} className="flex-1 py-4 text-sm font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest">Batal</button>
                                <button type="submit" disabled={loading} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl hover:bg-slate-800 active:scale-95 transition-all uppercase tracking-widest text-xs">
                                    {loading ? "Mengirim..." : "Kirim Pengajuan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default AttendanceUser;