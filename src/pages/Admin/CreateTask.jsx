import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { PRIORITY_DATA } from "../../utils/data";
import SelecDropdown from "../../components/Inputs/SelecDropdown";
import SelectUsers from "../../components/Inputs/SelectUsers";
import { HiTrash, HiPlusCircle, HiArrowLeft } from "react-icons/hi";
import TodoListInput from "../../components/Inputs/todoListInput";
import AddAttachmentsInput from "../../components/Inputs/AddAttachmentsInput";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATH } from "../../utils/apiPath";
import toast from "react-hot-toast";
import moment from "moment";

const CreateTask = () => {
  const location = useLocation();
  const { taskId } = location.state || {};
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "",
    dueDate: "",
    assignedTo: [],
    todoCheklist: [],
    attachments: [],
  });

  const [currentTask, setCurrentTask] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // 🟦 HANDLE VALUE CHANGE
  const handleValueChange = (key, value) => {
    setTaskData((prev) => ({ ...prev, [key]: value }));
  };

  // 🟦 RESET FORM
  const clearData = () => {
    setTaskData({
      title: "",
      description: "",
      priority: "",
      dueDate: "",
      assignedTo: [],
      todoCheklist: [],
      attachments: [],
    });
  };

  // 🟩 CREATE TASK
  const createTask = async () => {
    setLoading(true);
    try {
      const todoList = taskData.todoCheklist.map((item) => ({
        text: item,
        completed: false,
      }));

      await axiosInstance.post(API_PATH.TASKS.CREATE_TASK, {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoCheklist: todoList,
      });

      toast.success("✅ Task created successfully!");
      clearData();
      navigate("/admin/tasks");
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("❌ Failed to create task!");
    } finally {
      setLoading(false);
    }
  };

  // 🟨 FETCH TASK DETAILS (for Update mode)
  const getTaskDetailsById = async (id) => {
    setFetching(true);
    try {
      const response = await axiosInstance.get(API_PATH.TASKS.GET_TASK_BY_ID(id));
      if (response.data) {
        const taskInfo = response.data.data;
        setCurrentTask(taskInfo);
        setTaskData({
          title: taskInfo.title || "",
          description: taskInfo.description || "",
          priority: taskInfo.priority || "",
          dueDate: taskInfo.dueDate ? moment(taskInfo.dueDate).format("YYYY-MM-DD") : "",
          assignedTo: taskInfo.assignedTo?.map((item) => item._id) || [],
          todoCheklist: taskInfo.todoCheklist?.map((item) => item.text) || [],
          attachments: taskInfo.attachments || [],
        });
      }
    } catch (error) {
      console.error("Error fetching task details:", error);
      toast.error("⚠️ Failed to load task details.");
    } finally {
      setFetching(false);
    }
  };

  // 🟦 UPDATE TASK
  const updateTask = async () => {
    setLoading(true);
    try {
      const prevTodos = currentTask?.todoCheklist || [];
      const todoList = taskData.todoCheklist.map((item) => {
        const matched = prevTodos.find((t) => t.text === item);
        return { text: item, completed: matched ? matched.completed : false };
      });

      await axiosInstance.put(API_PATH.TASKS.UPDATE_TASK(taskId), {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoCheklist: todoList,
      });

      toast.success("✅ Task updated successfully!");
      navigate("/admin/tasks");
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("❌ Failed to update task!");
    } finally {
      setLoading(false);
    }
  };

  // 🟥 DELETE TASK
  const deleteTask = async () => {
    if (!taskId) return;
    try {
      await axiosInstance.delete(API_PATH.TASKS.DELETE_TASK(taskId));
      toast.success("🗑️ Task deleted successfully!");
      navigate("/admin/tasks");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("❌ Failed to delete task!");
    }
  };

  // 🟦 AUTO FETCH DATA IF EDIT MODE
  useEffect(() => {
    if (taskId) getTaskDetailsById(taskId);
  }, [taskId]);

  // 🟦 VALIDATE FORM & HANDLE SUBMIT
  const handleSubmit = async () => {
    setError("");
    if (!taskData.title.trim()) return setError("Title is required.");
    if (!taskData.description.trim()) return setError("Description is required.");
    if (!taskData.dueDate) return setError("Due date is required.");
    if (taskData.assignedTo.length === 0) return setError("At least one assignee is required.");
    if (taskData.todoCheklist.length === 0) return setError("Add at least one todo task.");

    taskId ? updateTask() : createTask();
  };

  // 🟦 DYNAMIC UI TEXT
  const formTitle = taskId ? "Update Task" : "Create New Task";
  const buttonText = taskId ? "Save Changes" : "Create Task";

  // 🟨 LOADING STATE
  if (taskId && fetching) {
    return (
      <DashboardLayout>
        <div className="p-10 text-center text-gray-500">Loading task data...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="CreateTask">
      <div className="max-w-5xl mx-auto py-8">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mr-4"
          >
            <HiArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-extrabold text-gray-900">{formTitle}</h1>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-2xl p-8 lg:p-10 border border-gray-100">
          <div className="flex items-center justify-between border-b border-blue-100 pb-5 mb-8">
            <h2 className="text-xl font-semibold text-blue-700">Task Details</h2>
            {taskId && (
              <button
                onClick={deleteTask}
                className="flex items-center gap-2 text-red-600 border border-red-200 bg-red-50 px-4 py-2 rounded-lg hover:bg-red-100 transition-all duration-200 shadow-sm"
              >
                <HiTrash className="w-5 h-5" /> Delete Task
              </button>
            )}
          </div>

          {/* Fields */}
          <div className="space-y-8">
            {/* Title */}
            <div className="border border-gray-200 p-4 rounded-lg bg-gray-50/50">
              <label className="block text-sm font-bold text-gray-700 mb-2">Task Title</label>
              <input
                type="text"
                placeholder="e.g., Design the new dashboard UI"
                value={taskData.title}
                onChange={(e) => handleValueChange("title", e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            {/* Description */}
            <div className="border border-gray-200 p-4 rounded-lg bg-gray-50/50">
              <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
              <textarea
                placeholder="Provide a detailed description of the task."
                rows={5}
                value={taskData.description}
                onChange={(e) => handleValueChange("description", e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            {/* Priority, Due Date, Assign */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-blue-50/50 p-6 rounded-xl border border-blue-100">
              <div>
                <label className="block text-sm font-bold text-blue-800 mb-2">Priority</label>
                <SelecDropdown
                  options={PRIORITY_DATA}
                  value={taskData.priority}
                  onChange={(v) => handleValueChange("priority", v)}
                  placeholder="Select Priority Level"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-blue-800 mb-2">Due Date</label>
                <input
                  type="date"
                  value={taskData.dueDate}
                  onChange={(e) => handleValueChange("dueDate", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-blue-800 mb-2">Assign To</label>
                <SelectUsers
                  selectedUsers={taskData.assignedTo}
                  setSelectedUsers={(v) => handleValueChange("assignedTo", v)}
                />
              </div>
            </div>

            {/* Todo Checklist */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Todo Checklist</label>
              <TodoListInput
                todoList={taskData.todoCheklist}
                setTodoList={(v) => handleValueChange("todoCheklist", v)}
              />
            </div>

            {/* Attachments */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Add Attachments</label>
              <AddAttachmentsInput
                attachments={taskData.attachments}
                setAttachments={(v) => handleValueChange("attachments", v)}
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end mt-10 border-t border-gray-100 pt-6">
            <button
              disabled={loading}
              onClick={handleSubmit}
              className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg shadow-blue-500/50 hover:bg-blue-700 transition-all duration-300 transform hover:scale-[1.02] disabled:bg-blue-400 disabled:shadow-none"
            >
              <HiPlusCircle className="w-5 h-5" />
              {loading ? "Processing..." : buttonText}
            </button>
          </div>

          {error && <p className="text-red-600 text-sm font-medium mt-4">{error}</p>}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateTask;
