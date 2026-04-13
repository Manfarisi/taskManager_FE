import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axiosInstance from "../../utils/axiosinstance";
import { HiCalculator, HiCheckBadge, HiClock, HiEye, HiFunnel } from "react-icons/hi2";
import { toast } from "react-hot-toast";
import moment from "moment";

const AdminSalary = () => {
    // --- STATE DATA ---
    const [users, setUsers] = useState([]); 
    const [filteredUsers, setFilteredUsers] = useState([]); 
    const [salaryHistory, setSalaryHistory] = useState([]); 
    const [loading, setLoading] = useState(false);

    // --- STATE FORM GENERATE ---
    const [formData, setFormData] = useState({
        userId: "",
        department: "",
        nip: "",
        basicSalary: "",
        allowance: "",
    });

    // --- STATE FILTER TABEL RIWAYAT ---
    const [filterMonth, setFilterMonth] = useState(moment().format("M")); 
    const [filterYear, setFilterYear] = useState(moment().format("YYYY"));
    const [filterDept, setFilterDept] = useState(""); // Filter Dept untuk Tabel

    // --- AMBIL DATA DARI API ---
    const fetchUsers = async () => {
        try {
            const res = await axiosInstance.get("/api/users");
            setUsers(res.data);
        } catch (err) {
            toast.error("Gagal memuat data karyawan");
        }
    };

    const fetchHistory = async () => {
        try {
            const res = await axiosInstance.get("/api/sallary/all");
            setSalaryHistory(res.data);
        } catch (err) {
            console.error("Gagal ambil riwayat gaji");
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchHistory();
    }, []);

    // --- LOGIKA HELPER ---
    
    // 1. List Departemen Unik untuk Dropdown (Form & Filter Tabel)
    const departments = [
        ...new Set(users.map((u) => u.employeeInfo?.department))
    ].filter(Boolean);

    // 2. List Tahun untuk Filter
    const years = [];
    for (let i = 0; i < 5; i++) {
        years.push(moment().subtract(i, "years").format("YYYY"));
    }

    // 3. LOGIKA FILTER UTAMA: Filter riwayat berdasarkan Bulan, Tahun, DAN Departemen
    const filteredHistory = salaryHistory.filter((item) => {
        const matchMonth = item.month.toString() === filterMonth.toString();
        const matchYear = item.year.toString() === filterYear.toString();
        const matchDept = filterDept === "" || item.userId?.employeeInfo?.department === filterDept;
        
        return matchMonth && matchYear && matchDept;
    });

    // --- HANDLERS ---

    const handleDeptChange = (e) => {
        const dept = e.target.value;
        const filtered = users.filter((u) => u.employeeInfo?.department === dept);
        setFilteredUsers(filtered);
        setFormData({ ...formData, department: dept, userId: "", nip: "" });
    };

    const handleUserChange = (e) => {
        const selectedId = e.target.value;
        const selectedUser = filteredUsers.find((u) => u._id === selectedId);
        if (selectedUser) {
            setFormData({
                ...formData,
                userId: selectedId,
                nip: selectedUser.employeeInfo?.nip || "-", 
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axiosInstance.post("/api/sallary/generate", {
                userId: formData.userId,
                basicSalary: formData.basicSalary,
                allowance: formData.allowance
            });
            toast.success("Slip gaji berhasil dibuat!");
            setFormData({ userId: "", department: "", nip: "", basicSalary: "", allowance: "" });
            fetchHistory(); 
        } catch (error) {
            toast.error(error.response?.data?.message || "Gagal generate gaji");
        } finally {
            setLoading(false);
        }
    };

    const formatRupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }).format(number);
    };

    return (
        <DashboardLayout activeMenu="AdminSalary">
            <div className="p-6 md:p-10 bg-[#f8fafc] min-h-screen">
                <div className="max-w-6xl mx-auto space-y-10">
                    
                    {/* Header */}
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Management Payroll</h1>
                        <p className="text-slate-500 font-medium">Generate gaji dan kelola riwayat slip karyawan.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* FORM GENERATE GAJI */}
                        <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <HiCalculator className="text-indigo-500" /> Buat Slip Baru
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">1. Pilih Departemen</label>
                                    <select 
                                        className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700"
                                        value={formData.department}
                                        onChange={handleDeptChange}
                                        required
                                    >
                                        <option value="">-- Pilih Departemen --</option>
                                        {departments.map((dept, idx) => (
                                            <option key={idx} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">2. Pilih Karyawan</label>
                                        <select 
                                            className={`w-full border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700 ${!formData.department ? 'bg-slate-200 cursor-not-allowed' : 'bg-slate-50'}`}
                                            value={formData.userId}
                                            onChange={handleUserChange}
                                            disabled={!formData.department}
                                            required
                                        >
                                            <option value="">-- Pilih Nama --</option>
                                            {filteredUsers.map(user => (
                                                <option key={user._id} value={user._id}>{user.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">NIP</label>
                                        <input 
                                            type="text"
                                            className="w-full bg-slate-100 border-none rounded-2xl p-4 font-bold text-slate-500 cursor-not-allowed"
                                            value={formData.nip}
                                            readOnly
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Gaji Pokok (Rp)</label>
                                        <input 
                                            type="number"
                                            className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 font-bold"
                                            value={formData.basicSalary}
                                            onChange={(e) => setFormData({...formData, basicSalary: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Tunjangan (Rp)</label>
                                        <input 
                                            type="number"
                                            className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 font-bold"
                                            value={formData.allowance}
                                            onChange={(e) => setFormData({...formData, allowance: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>

                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-slate-900 hover:bg-indigo-600 text-white p-5 rounded-2xl font-bold transition-all disabled:opacity-50"
                                >
                                    {loading ? "Processing..." : "Generate & Kirim Slip"}
                                </button>
                            </form>
                        </div>

                        {/* SIDEBAR */}
                        <div className="bg-indigo-600 p-6 rounded-[32px] text-white shadow-xl h-fit">
                            <HiCheckBadge className="w-10 h-10 mb-4 opacity-50" />
                            <h4 className="font-bold mb-2 text-lg">Potongan Otomatis</h4>
                            <ul className="text-sm space-y-3 opacity-90">
                                <li className="flex justify-between"><span>BPJS Kesehatan</span> <span>1%</span></li>
                                <li className="flex justify-between"><span>BPJS JHT</span> <span>2%</span></li>
                            </ul>
                        </div>
                    </div>

                    {/* TABEL RIWAYAT DENGAN TIGA FILTER */}
                    <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
                            <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
                                <HiClock className="text-indigo-500" /> Riwayat Payroll
                            </h3>

                            {/* FILTER GROUP */}
                            <div className="flex flex-wrap items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-100 w-full xl:w-auto">
                                <div className="flex items-center gap-2 px-3 border-r border-slate-200">
                                    <HiFunnel className="text-slate-400 w-4 h-4" />
                                    <select 
                                        className="bg-transparent border-none text-[11px] font-bold text-slate-600 focus:ring-0 cursor-pointer"
                                        value={filterDept}
                                        onChange={(e) => setFilterDept(e.target.value)}
                                    >
                                        <option value="">Semua Departemen</option>
                                        {departments.map((dept, idx) => (
                                            <option key={idx} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                </div>
                                <select 
                                    className="bg-transparent border-none text-[11px] font-bold text-slate-600 focus:ring-0 cursor-pointer px-3 border-r border-slate-200"
                                    value={filterMonth}
                                    onChange={(e) => setFilterMonth(e.target.value)}
                                >
                                    {moment.months().map((month, idx) => (
                                        <option key={idx} value={idx + 1}>{month}</option>
                                    ))}
                                </select>
                                <select 
                                    className="bg-transparent border-none text-[11px] font-bold text-slate-600 focus:ring-0 cursor-pointer px-3"
                                    value={filterYear}
                                    onChange={(e) => setFilterYear(e.target.value)}
                                >
                                    {years.map((year) => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Karyawan</th>
                                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">NIP / Dept</th>
                                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Periode</th>
                                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Bersih</th>
                                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredHistory.length > 0 ? (
                                        filteredHistory.map((item) => (
                                            <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="p-6">
                                                    <p className="font-bold text-slate-800">{item.userId?.name || "User Deleted"}</p>
                                                </td>
                                                <td className="p-6">
                                                    <p className="font-bold text-slate-600 text-sm">{item.userId?.employeeInfo?.nip || "-"}</p>
                                                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">
                                                        {item.userId?.employeeInfo?.department || "Tanpa Dept"}
                                                    </p>
                                                </td>
                                                <td className="p-6">
                                                    <span className="font-bold text-slate-600">
                                                        {moment().month(item.month - 1).format("MMMM")} {item.year}
                                                    </span>
                                                </td>
                                                <td className="p-6">
                                                    <span className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl font-bold text-sm">
                                                        {formatRupiah(item.netSalary)}
                                                    </span>
                                                </td>
                                                <td className="p-6 text-center">
                                                    <button className="p-3 bg-slate-100 hover:bg-indigo-100 hover:text-indigo-600 rounded-xl transition-all">
                                                        <HiEye className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="p-20 text-center text-slate-400 italic">
                                                Data tidak ditemukan untuk filter ini.
                                            </td>
                                        </tr>
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

export default AdminSalary;