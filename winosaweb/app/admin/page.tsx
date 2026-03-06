import StatsCard from '@/components/admin/StatsCard'
import RecentActivitiesTable from '@/components/admin/RecentActivitiesTable'
import { DUMMY_STATS, DUMMY_ACTIVITIES } from '@/constants/admin'

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 w-full">
      {/* Header */}
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 italic text-base md:text-lg">
          Overview of Winosa website activity
        </p>
      </div>
      {/* Stats Grid - Loop pakai DUMMY_STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        {DUMMY_STATS.map((stat, index) => (
          <StatsCard 
            key={index} 
            label={stat.label} 
            value={stat.value} 
          />
        ))}
      </div>

      {/* Recent Activities */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          Recent Activities
        </h2>
        <RecentActivitiesTable activities={DUMMY_ACTIVITIES} />
      </div>
    </div>
  )
}