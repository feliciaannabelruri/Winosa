'use client'


import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Service } from '@/constants/services'


interface ServiceFormProps {
  initialData?: Service
  mode: 'add' | 'edit'
}


export default function ServiceForm({ initialData, mode }: ServiceFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    price: initialData?.price || '',
    status: initialData?.status || 'Draft',
    thumbnail: initialData?.thumbnail || '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})


  const validate = () => {
    const newErrors: Record<string, string> = {}


    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    if (!formData.price.trim()) {
      newErrors.price = 'Price is required'
    }


    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }


  const handleSubmit = (status: 'Draft' | 'Published') => {
    if (!validate()) return


    // Simulasi save
    const dataToSave = { ...formData, status }
    console.log('Saving service:', dataToSave)
    alert(`Service ${mode === 'add' ? 'added' : 'updated'} as ${status}!`)
    router.push('/admin/services')
  }


  return (
    <div className="space-y-8">
      {/* Service Title */}
      <div>
        <label className="block text-base font-semibold text-gray-900 mb-3">
          Service Title :
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className={`
            w-full px-4 py-3 border rounded-lg bg-gray-50
            focus:outline-none focus:ring-2 focus:ring-gray-300
            ${errors.title ? 'border-red-500' : 'border-gray-300'}
          `}
          placeholder="e.g. UI/UX Design"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title}</p>
        )}
      </div>


      {/* Service Description */}
      <div>
        <label className="block text-base font-semibold text-gray-900 mb-3">
          Service Description :
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={6}
          className={`
            w-full px-4 py-3 border rounded-lg bg-gray-50
            focus:outline-none focus:ring-2 focus:ring-gray-300
            ${errors.description ? 'border-red-500' : 'border-gray-300'}
          `}
          placeholder="Brief description of the service"
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
        )}
      </div>


      {/* Thumbnail Image */}
      <div>
        <label className="block text-base font-semibold text-gray-900 mb-3">
          Thumbnail Image :
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 p-12 text-center hover:border-gray-400 transition-colors cursor-pointer">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="thumbnail-upload"
          />
          <label htmlFor="thumbnail-upload" className="cursor-pointer">
            <p className="text-gray-400 italic text-lg">Upload</p>
          </label>
        </div>
      </div>


      {/* Price */}
      <div>
        <label className="block text-base font-semibold text-gray-900 mb-3">
          Price :
        </label>
        <input
          type="text"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          className={`
            w-full px-4 py-3 border rounded-lg bg-gray-50
            focus:outline-none focus:ring-2 focus:ring-gray-300
            ${errors.price ? 'border-red-500' : 'border-gray-300'}
          `}
          placeholder="e.g. 5000000"
        />
        {errors.price && (
          <p className="text-red-500 text-sm mt-1">{errors.price}</p>
        )}
      </div>


      {/* Actions - Back Button & Status Buttons DI KANAN */}
      <div className="flex items-center justify-between pt-6">
        {/* Back Button - Kiri */}
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>


        {/* Status Buttons - Kanan (sejajar seperti di card) */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => handleSubmit('Draft')}
            className="px-8 py-3 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold rounded-lg transition-colors duration-200"
          >
            Draft
          </button>
          <button
            type="button"
            onClick={() => handleSubmit('Published')}
            className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            Published
          </button>
        </div>
      </div>
    </div>
  )
}
