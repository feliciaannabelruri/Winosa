import ServiceForm from '@/components/admin/ServiceForm'


export default function AddServicePage() {
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


      <ServiceForm mode="add" />
    </div>
  )
}
