import Link from 'next/link'
import { Edit2, Trash2 } from 'lucide-react'

export interface Service {
  _id: string
  title: string
  description: string
  status: 'Published' | 'Draft'
}

interface ServiceCardProps {
  service: Service
  onDelete: () => void
}

export default function ServiceCard({ service, onDelete }: ServiceCardProps) {
  return (
    <div className="bg-white rounded-3xl border-2 border-gray-300 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex gap-6 items-start">
        {/* Icon/Thumbnail */}
        <div className="w-32 h-32 flex-shrink-0 bg-gray-100 rounded-2xl flex items-center justify-center border-2 border-gray-300">
          <span className="text-gray-400 text-sm italic">icon/thumbnail</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.title}</h3>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{service.description}</p>
        </div>

        {/* Status & Actions */}
        <div className="flex flex-col items-end gap-4 w-36 flex-shrink-0 pr-2">
          <span
            className={`px-5 py-1.5 rounded-full text-sm font-medium border-2 inline-block ${
              service.status === 'Published'
                ? 'bg-green-100 text-green-700 border-green-400'
                : 'bg-gray-100 text-gray-700 border-gray-400'
            }`}
          >
            {service.status}
          </span>

          <div className="flex flex-col gap-2">
            <Link
              href={`/admin/services/edit/${service._id}`}
              className="w-12 h-12 flex items-center justify-center bg-white border-2 border-gray-300 rounded-xl hover:bg-yellow-50 hover:border-yellow-500 transition-colors duration-200 group"
            >
              <Edit2 className="w-5 h-5 text-gray-600 group-hover:text-yellow-600" />
            </Link>

            <button
              onClick={onDelete}
              className="w-12 h-12 flex items-center justify-center bg-white border-2 border-gray-300 rounded-xl hover:bg-red-50 hover:border-red-500 transition-colors duration-200 group"
            >
              <Trash2 className="w-5 h-5 text-gray-600 group-hover:text-red-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}