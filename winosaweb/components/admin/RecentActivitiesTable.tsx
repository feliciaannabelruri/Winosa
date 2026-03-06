interface Activity {
  type: string
  title: string
  date: string
  status: string
}

interface RecentActivitiesTableProps {
  activities: Activity[]
}

export default function RecentActivitiesTable({ activities }: RecentActivitiesTableProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published':
        return 'text-green-600 bg-green-50'
      case 'new':
        return 'text-blue-600 bg-blue-50'
      case 'draft':
        return 'text-gray-600 bg-gray-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-600">
                Type
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-600">
                Tittle/Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-600">
                Date
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-600">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {activities.map((activity, index) => (
              <tr
                key={index}
                className={`
                  ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  hover:bg-gray-100 transition-colors duration-150
                `}
              >
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                  {activity.type}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {activity.title}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {activity.date}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`
                      inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                      ${getStatusColor(activity.status)}
                    `}
                  >
                    {activity.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}