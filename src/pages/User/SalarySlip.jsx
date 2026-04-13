import React, { useState, useEffect, useContext } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { UserContext } from "../../context/userContext";
import axiosInstance from "../../utils/axiosinstance";
import toast from "react-hot-toast";
import moment from "moment";
import { HiTicket, HiCurrencyDollar, HiDocumentText, HiInformationCircle, HiArrowDownTray } from "react-icons/hi2";

const SalarySlip = () => {
    const { user } = useContext(UserContext);
    const [salaries, setSalaries] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSalaries = async () => {
        setLoading(true);
        try {
            // Sesuai dengan route backend kamu: /api/sallary/my-salary
            const response = await axiosInstance.get("/api/sallary/my-salary");
            setSalaries(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Gagal mengambil data gaji");
            toast.error("Gagal memuat data payroll");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSalaries();
    }, []);

    const formatRupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }).format(number || 0);
    };

    // Fungsi untuk mengubah angka bulan ke Nama Bulan
    const getMonthName = (monthNumber) => {
        return moment().month(monthNumber - 1).format("MMMM");
    };

    return (
        <DashboardLayout activeMenu="Payroll">
            <div className="p-6 md:p-10 bg-[#f8fafc] min-h-screen">
                
                <div className="mb-10">
                    <p className="text-xs font-black text-indigo-500 uppercase tracking-[0.2em] mb-1">Financial Records</p>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                        Payroll & Slip Gaji
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    <div className="lg:col-span-2 space-y-6">
                        {loading ? (
                            <div className="bg-white p-10 rounded-[40px] text-center border border-slate-100">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                                <p className="text-slate-500 font-bold">Memuat data...</p>
                            </div>
                        ) : salaries.length > 0 ? (
                            salaries.map((salary) => (
                                <div key={salary._id} className="bg-white p-8 rounded-[35px] border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-center gap-6">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600">
                                            <HiTicket className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Periode Gaji</p>
                                            <h3 className="text-lg font-bold text-slate-800">
                                                {/* Gabungkan month dan year dari Schema */}
                                                {getMonthName(salary.month)} {salary.year}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="text-center md:text-right">
                                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Total Diterima (Net)</p>
                                        <h2 className="text-2xl font-black text-slate-900">
                                            {/* Pakai netSalary sesuai Schema Mongoose */}
                                            {formatRupiah(salary.netSalary)}
                                        </h2>
                                    </div>

                                    <button 
                                        className="bg-slate-900 text-white p-4 rounded-2xl hover:bg-indigo-600 transition-colors group"
                                        onClick={() => toast.success("PDF sedang disiapkan!")}
                                    >
                                        <HiArrowDownTray className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white p-20 rounded-[40px] border border-dashed border-slate-200 text-center">
                                <HiDocumentText className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                                <p className="text-slate-400 font-medium">Belum ada slip gaji.</p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-8">
                        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                            <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <HiCurrencyDollar className="w-5 h-5 text-indigo-500" /> Ringkasan
                            </h4>
                            <div className="space-y-4">
                                <div className="p-5 bg-slate-50 rounded-3xl">
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Rata-rata Gaji Bersih</p>
                                    <p className="text-xl font-bold text-slate-800">
                                        {salaries.length > 0 
                                            ? formatRupiah(salaries.reduce((acc, curr) => acc + (curr.netSalary || 0), 0) / salaries.length)
                                            : "Rp 0"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-emerald-600 p-8 rounded-[40px] text-white shadow-lg relative overflow-hidden">
                            <h5 className="font-bold mb-2">Tips</h5>
                            <p className="text-xs text-emerald-50 leading-relaxed">
                                Simpan slip gaji ini sebagai bukti penghasilan resmi kamu.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
};

export default SalarySlip;