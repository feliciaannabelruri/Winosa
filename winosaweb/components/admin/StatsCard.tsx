interface StatsCardProps {
  label: string
  value: string
}

export default function StatsCard({ label, value }: StatsCardProps) {
  return (
    <div className="rounded-3xl border-2 border-yellow-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <h3 className="text-lg md:text-xl font-bold text-yellow-600 mb-4">
        {label}
      </h3>
      <p className="text-5xl md:text-6xl font-bold text-yellow-600 text-center mt-6">
        {value}
      </p>
    </div>
  )
}