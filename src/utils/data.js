import {
  HiHome,
  HiClipboardList,
  HiPlusCircle,
  HiUsers,
  HiLogout,
  HiChartBar,
  HiClipboardCheck,
} from "react-icons/hi";

export const SIDE_MENU_DATA = [
  {
    id: "01",
    label: "Dashboard",
    icon: HiHome, // lebih umum dan jelas untuk tampilan utama
    path: "/admin/dashboard",
  },
  {
    id: "02",
    label: "Manage Tasks",
    icon: HiClipboardList, // ikon daftar tugas
    path: "/admin/tasks",
  },
  {
    id: "03",
    label: "Create Task",
    icon: HiPlusCircle, // ikon tambah
    path: "/admin/create-task",
  },
  {
    id: "04",
    label: "Team Members",
    icon: HiUsers, // ikon grup/orang
    path: "/admin/users",
  },
  {
    id: "06",
    label: "Logout",
    icon: HiLogout,
    path: "logout",
  },
];

export const SIDE_MENU_USER_DATA = [
  {
    id: "01",
    label: "Dashboard",
    icon: HiHome,
    path: "/user/dashboard",
  },
  {
    id: "02",
    label: "My Tasks",
    icon: HiClipboardCheck,
    path: "/user/tasks",
  },
  {
    id: "04",
    label: "Logout",
    icon: HiLogout,
    path: "logout",
  },
];

export const PRIORITY_DATA = [
  { label: "Low", value: "Low" },
  { label: "Medium", value: "Medium" },
  { label: "High", value: "High" },
];

export const STATUS_DATA = [
  { label: "Pending", value: "Pending" },
  { label: "In Progress", value: "In Progress" },
  { label: "Completed", value: "Completed" },
];
