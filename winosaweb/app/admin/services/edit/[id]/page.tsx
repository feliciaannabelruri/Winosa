'use client'


import { useParams } from 'next/navigation'
import ServiceForm from '@/components/admin/ServiceForm'
import { DUMMY_SERVICES } from '@/constants/services'


export default function EditServicePage() {
  const params = useParams()
  const serviceId = params.id as string


  // Find service by ID
  const service = DUMMY_SERVICES.find((s) => s.id === serviceId)


  if (!service) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Service not found</h2>
      </div>
    )
  }


  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
          Services
        </h1>
        <p className="text-gray-600 italic text-base md:text-lg">
          Manage Winosa services content
        </p>
      </div>


      <ServiceForm mode="edit" initialData={service} />
    </div>
  )
}
