import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { useUserauth } from "../../hooks/useUserAuth";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATH } from "../../utils/apiPath";
import moment from "moment";
import InfoCard from "../../components/Card/InfoCard";
import { addThousandsSeparator } from "../../utils/helper";
import {
  HiClipboardList,
  HiClock,
  HiCheckCircle,
  HiOutlineArrowRight,
} from "react-icons/hi";
import { FaTasks } from "react-icons/fa";
import TaskListTable from "../../components/Table/TaskListTable";
import CustomPieChart from "../../Chart/CustomPieChart";

// ========================================================================
// DEFINISI WARNA
// ========================================================================
const STATUS_COLORS = [
  "#f59e0b", // Pending - Amber
  "#3b82f6", // In Progress - Blue
  "#10b981", // Completed - Green
];

const PRIORITY_COLORS = [
  "#f87171", // High - Red
  "#fb923c", // Medium - Orange
  "#4ade80", // Low - Green
];

// ========================================================================

const Dashboard = () => {
  useUserauth();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  // ================================================================
  // 🔹 Prepare Chart Data
  // ================================================================
  const prepareChartData = (data) => {
    const taskDistribution = data?.taskDistribution || {};
    const taskPriorityLevels = data?.taskPriorityLevels || {};

    const taskDistributionData = [
      { status: "Pending", count: taskDistribution?.Pending || 0 },
      { status: "In Progress", count: taskDistribution?.InProgress || 0 },
      { status: "Completed", count: taskDistribution?.Completed || 0 },
    ].filter((d) => d.count > 0);

    const taskPriorityData = [
      { priority: "High", count: taskPriorityLevels?.High || 0 },
      { priority: "Medium", count: taskPriorityLevels?.Medium || 0 },
      { priority: "Low", count: taskPriorityLevels?.Low || 0 },
    ].filter((d) => d.count > 0);

    setPieChartData(taskDistributionData);
    setBarChartData(taskPriorityData);
  };

  // ================================================================
  // 🔹 Fetch Dashboard Data
  // ================================================================
  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(API_PATH.TASKS.GET_DASHBOARD_DATA);
      if (response.data) {
        setDashboardData(response.data);
        prepareChartData(response.data?.charts);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  const onSeeMore = () => {
    navigate("/admin/tasks");
  };

  // ================================================================
  // 🔹 Render
  // ================================================================
  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="p-8 space-y-10 bg-gray-50 h-full">
        {/* ======================== Greeting ======================== */}
        <div className="pb-4 border-b border-gray-200">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Halo, <span className="text-indigo-700">{user?.name || "User"}!</span> 👋
          </h2>
          <p className="text-gray-500 mt-2 text-lg">
            Ayo kita selesaikan tugas-tugasmu hari ini.
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {moment().format("dddd, Do MMMM YYYY")}
          </p>
        </div>

        {/* ======================== Info Cards ======================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <InfoCard
            icon={<FaTasks className="w-6 h-6 text-white" />}
            iconColor="bg-indigo-600"
            label="Total Tugas"
            value={addThousandsSeparator(
              dashboardData?.charts?.taskDistribution?.All || 0
            )}
          />
          <InfoCard
            icon={<HiClock className="w-6 h-6 text-white" />}
            iconColor="bg-amber-500"
            label="Tugas Tertunda"
            value={addThousandsSeparator(
              dashboardData?.charts?.taskDistribution?.Pending || 0
            )}
          />
          <InfoCard
            icon={<HiClipboardList className="w-6 h-6 text-white" />}
            iconColor="bg-blue-500"
            label="Tugas Berjalan"
            value={addThousandsSeparator(
              dashboardData?.charts?.taskDistribution?.InProgress || 0
            )}
          />
          <InfoCard
            icon={<HiCheckCircle className="w-6 h-6 text-white" />}
            iconColor="bg-emerald-500"
            label="Tugas Selesai"
            value={addThousandsSeparator(
              dashboardData?.charts?.taskDistribution?.Completed || 0
            )}
          />
        </div>

        {/* ======================== Charts ======================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart Status */}
          <div className="bg-white shadow-xl border border-gray-100 rounded-xl p-6">
            <h5 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-3">
              Distribusi Tugas Berdasarkan Status
            </h5>
            <CustomPieChart data={pieChartData} colors={STATUS_COLORS} />
          </div>

          {/* Pie Chart Priority */}
          <div className="bg-white shadow-xl border border-gray-100 rounded-xl p-6">
            <h5 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-3">
              Distribusi Tugas Berdasarkan Prioritas
            </h5>
            <CustomPieChart
              data={barChartData.map((item) => ({
                status: item.priority,
                count: item.count,
              }))}
              colors={PRIORITY_COLORS}
            />
          </div>
        </div>

        {/* ======================== Recent Tasks ======================== */}
        <div className="bg-white shadow-2xl border border-gray-100 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h5 className="text-xl font-semibold text-gray-800">Tugas Terbaru</h5>
            <button
              onClick={onSeeMore}
              className="flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-700 transition-colors py-2 px-3 rounded-lg hover:bg-indigo-50"
            >
              Lihat Semua
              <HiOutlineArrowRight className="w-5 h-5" />
            </button>
          </div>
          <TaskListTable tableData={dashboardData?.recentTasks || []} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
