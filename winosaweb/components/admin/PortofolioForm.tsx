'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface PortfolioFormProps {
  mode: 'add' | 'edit'
  initialData?: {
    id: string
    title: string
    description: string
    category: string
    status: string
  }
}

export default function PortfolioForm({ mode, initialData }: PortfolioFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    shortDescription: initialData?.description || '',
    category: initialData?.category || '',
    thumbnailImage: null as File | null,
    projectCover: null as File | null,
    galleryImages: [] as File[],
    projectDescription: '',
    status: initialData?.status || 'Draft'
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleInputChange('thumbnailImage', e.target.files[0])
    }
  }

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleInputChange('projectCover', e.target.files[0])
    }
  }

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      handleInputChange('galleryImages', [...formData.galleryImages, ...filesArray])
    }
  }

  const handleSaveDraft = () => {
    console.log('Save as Draft:', formData)
    router.push('/admin/portfolio')
  }

  const handlePublish = () => {
    console.log('Publish:', formData)
    router.push('/admin/portfolio')
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Project Title */}
      <div>
        <label className="block text-base font-medium text-black mb-2">
          Project Title :
        </label>
        <input
          type="text"
          placeholder="e.g. Prowerty"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-gray-400 text-sm placeholder:italic placeholder:text-gray-400"
        />
      </div>

      {/* Short Description */}
      <div>
        <label className="block text-base font-medium text-black mb-2">
          Short Description :
        </label>
        <input
          type="text"
          placeholder="Short description"
          value={formData.shortDescription}
          onChange={(e) => handleInputChange('shortDescription', e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-gray-400 text-sm placeholder:italic placeholder:text-gray-400"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-base font-medium text-black mb-2">
          Category :
        </label>
        <div className="relative">
          <select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-gray-400 appearance-none bg-white text-sm italic text-gray-400 cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%239CA3AF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 1rem center'
            }}
          >
            <option value="">Dropdown</option>
            <option value="Web Application" className="text-black not-italic">Web Application</option>
            <option value="Mobile Application" className="text-black not-italic">Mobile Application</option>
            <option value="Design" className="text-black not-italic">Design</option>
            <option value="Branding" className="text-black not-italic">Branding</option>
          </select>
        </div>
      </div>

      {/* Thumbnail Image */}
      <div>
        <label className="block text-base font-medium text-black mb-2">
          Thumbnail Image :
        </label>
        <div className="border border-gray-300 rounded-lg p-6 text-center bg-gray-50">
          <p className="text-gray-400 italic text-sm mb-2">
            Displayed on portofolio card
          </p>
          <label className="inline-block">
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailUpload}
              className="hidden"
            />
            <span className="text-blue-600 italic text-sm underline cursor-pointer hover:text-blue-700">
              Upload
            </span>
          </label>
          {formData.thumbnailImage && (
            <p className="text-sm text-gray-600 mt-2">
              {formData.thumbnailImage.name}
            </p>
          )}
        </div>
      </div>

      {/* Project Cover */}
      <div>
        <label className="block text-base font-medium text-black mb-2">
          Project Cover :
        </label>
        <div className="border border-gray-300 rounded-lg p-6 text-center bg-gray-50">
          <p className="text-gray-400 italic text-sm mb-2">
            Displayed at the top of project detail
          </p>
          <label className="inline-block">
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverUpload}
              className="hidden"
            />
            <span className="text-blue-600 italic text-sm underline cursor-pointer hover:text-blue-700">
              Upload
            </span>
          </label>
          {formData.projectCover && (
            <p className="text-sm text-gray-600 mt-2">
              {formData.projectCover.name}
            </p>
          )}
        </div>
      </div>

      {/* Gallery Images */}
      <div>
        <label className="block text-base font-medium text-black mb-2">
          Gallery Images :
        </label>
        <div className="border border-gray-300 rounded-lg p-6 text-center bg-gray-50">
          <p className="text-gray-400 italic text-sm mb-2">
            Displayed as image slider
          </p>
          <label className="inline-block">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleGalleryUpload}
              className="hidden"
            />
            <span className="text-blue-600 italic text-sm underline cursor-pointer hover:text-blue-700">
              Upload
            </span>
          </label>
          {formData.galleryImages.length > 0 && (
            <p className="text-sm text-gray-600 mt-2">
              {formData.galleryImages.length} file(s) selected
            </p>
          )}
        </div>
      </div>

      {/* Project Description */}
      <div>
        <label className="block text-base font-medium text-black mb-2">
          Project Description :
        </label>
        <textarea
          placeholder="Full description shown in project detail"
          value={formData.projectDescription}
          onChange={(e) => handleInputChange('projectDescription', e.target.value)}
          rows={6}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-gray-400 text-sm placeholder:italic placeholder:text-gray-400 resize-none"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          onClick={handleSaveDraft}
          className="px-6 py-2.5 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg text-sm transition"
        >
          Draft
        </button>
        <button
          onClick={handlePublish}
          className="px-6 py-2.5 bg-green-400 hover:bg-green-500 text-white font-medium rounded-lg text-sm transition"
        >
          Published
        </button>
      </div>
    </div>
  )
}