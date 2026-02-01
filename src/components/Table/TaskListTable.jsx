import moment from 'moment'
import React from 'react'

const TaskListTable = ({tableData}) => {
    // Fungsi untuk menentukan warna badge Status
    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'Completed':
                // Hijau untuk Selesai
                return 'bg-emerald-100 text-emerald-700';
            case 'InProgress':
                // Biru untuk Sedang Berjalan
                return 'bg-sky-100 text-sky-700';
            case 'Pending':
                // Oranye/Kuning untuk Tertunda/Menunggu
                return 'bg-amber-100 text-amber-700';
            default:
                // Abu-abu untuk status lain (misal: 'New', 'Canceled')
                return 'bg-gray-100 text-gray-700';
        }
    }

    // Fungsi untuk menentukan warna badge Prioritas
    const getPriorityBadgeColor = (priority) => {
        switch (priority) {
            case 'High':
                // Merah untuk Prioritas Tinggi
                return 'bg-red-100 text-red-700';
            case 'Medium':
                // Oranye untuk Prioritas Sedang
                return 'bg-orange-100 text-orange-700';
            case 'Low':
                // Hijau untuk Prioritas Rendah
                return 'bg-green-100 text-green-700';
            default:
                // Abu-abu
                return 'bg-gray-100 text-gray-700';
        }
    }

    // Periksa jika data kosong untuk menghindari error dan memberikan feedback
    if (!tableData || tableData.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500">
                <p className="text-lg font-medium">Tidak ada tugas terbaru yang ditemukan.</p>
                <p className="text-sm mt-1">Buat tugas baru untuk melihatnya di sini.</p>
            </div>
        );
    }
    
  return (
    // Tambahkan styling untuk container tabel
    <div className="overflow-x-auto rounded-lg border border-gray-100 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        
        {/* Header Tabel */}
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600"
            >
              Nama Tugas
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600"
            >
              Prioritas
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600"
            >
              Dibuat Pada
            </th>
          </tr>
        </thead>

        {/* Body Tabel */}
        <tbody className="divide-y divide-gray-100 bg-white">
          {tableData.map((task) => (
            <tr key={task._id} className="hover:bg-gray-50 transition-colors">
              {/* Nama Tugas */}
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                {task.title}
              </td>
              
              {/* Status Badge */}
              <td className="whitespace-nowrap px-6 py-4 text-sm">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getStatusBadgeColor(
                    task.status
                  )}`}
                >
                  {task.status}
                </span>
              </td>
              
              {/* Priority Badge */}
              <td className="whitespace-nowrap px-6 py-4 text-sm">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getPriorityBadgeColor(
                    task.priority
                  )}`}
                >
                  {task.priority}
                </span>
              </td>
              
              {/* Created On */}
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {task.createdAt ? moment(task.createdAt).format('Do MMM YYYY') : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TaskListTable