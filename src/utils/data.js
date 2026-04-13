import {
  HiHome,
  HiClipboardList,
  HiPlusCircle,
  HiUsers,
  HiLogout,
  HiCalendar,
  HiCash,
  HiStatusOffline,
  HiClipboardCheck,
  HiUserCircle,
  HiOutlinePlusCircle
} from "react-icons/hi";
export const SIDE_MENU_DATA = [
  // SECTION: OVERVIEW
  {
    id: "01",
    label: "Dashboard",
    icon: HiHome,
    path: "/admin/dashboard",
    section: "Overview",
  },
  // SECTION: TASK MANAGER
  {
    id: "02",
    label: "Manage Tasks",
    icon: HiClipboardList,
    path: "/admin/tasks",
    section: "Task Manager",
  },
  {
    id: "03",
    label: "Create Task",
    icon: HiPlusCircle,
    path: "/admin/create-task",
    section: "Task Manager",
  },
   {
    id: "04",
    label: "Team Task",
    icon: HiOutlinePlusCircle,
    path: "/admin/TaskUpdate",
    section: "Task Manager",
  },
  // SECTION: HR MANAGEMENT
  {
    id: "05",
    label: "Team Members",
    icon: HiUsers,
    path: "/admin/users",
    section: "HR Management",
  },
  {
    id: "06",
    label: "Attendance",
    icon: HiUserCircle,
    path: "/admin/attendance",
    section: "HR Management",
  },
  ,
  {
    id: "07",
    label: "Leave Management",
    icon: HiCalendar,
    path: "/admin/leave-management",
    section: "HR Management",
  },
  {
    id: "08",
    label: "Payroll",
    icon: HiCash,
    path: "/admin/payroll",
    section: "HR Management",
  },
  {
    id: "logout",
    label: "Logout",
    icon: HiLogout,
    path: "logout",
  },
];

export const SIDE_MENU_USER_DATA = [
  {
    id: "u01",
    label: "Dashboard",
    icon: HiHome,
    path: "/user/dashboard",
    section: "Overview",
  },
  {
    id: "u02",
    label: "My Tasks",
    icon: HiClipboardCheck,
    path: "/user/tasks",
    section: "Task Manager",
  },
  {
    id: "u03",
    label: "Attendance",
    icon: HiCalendar,
    path: "/user/attendance",
    section: "HR Management",
  },
    {
    id: "u04",
    label: "Payroll",
    icon: HiCash,
    path: "/user/payroll",
    section: "HR Management",
  },
  {
    id: "logout",
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
