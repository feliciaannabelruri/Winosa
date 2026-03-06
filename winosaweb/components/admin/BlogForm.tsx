'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface BlogFormProps {
  mode: 'add' | 'edit'
  initialData?: {
    id: string
    title: string
    category: string
    author: string
    content: string
    status: string
    featuredImage?: string
  }
}

export default function BlogForm({ mode, initialData }: BlogFormProps) {
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    category: initialData?.category || '',
    content: initialData?.content || '',
    featuredImage: null as File | null,
    author: initialData?.author || 'Admin',
    status: initialData?.status || 'Draft'
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleInputChange('featuredImage', e.target.files[0])
    }
  }

  const handleSaveDraft = () => {
    const blogData = {
      ...formData,
      status: 'Draft',
      date: new Date().toLocaleDateString('en-GB'),
    }

    console.log('Save as Draft:', blogData)
    router.push('/admin/blogs')
  }

  const handlePublish = () => {
    const blogData = {
      ...formData,
      status: 'Published',
      date: new Date().toLocaleDateString('en-GB'),
    }

    console.log('Publish:', blogData)
    router.push('/admin/blogs')
  }

  return (
    <div className="max-w-4xl space-y-6">

      {/* Title */}
      <div>
        <label className="block text-base font-medium text-black mb-2">
          Title :
        </label>
        <input
          type="text"
          placeholder="Enter blog title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-gray-400 text-sm"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-base font-medium text-black mb-2">
          Category :
        </label>
        <select
          value={formData.category}
          onChange={(e) => handleInputChange('category', e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-gray-400 text-sm"
        >
          <option value="">Select Category</option>
          <option value="Insight">Insight</option>
          <option value="Tutorial">Tutorial</option>
          <option value="News">News</option>
          <option value="Case Study">Case Study</option>
        </select>
      </div>

      {/* Thumbnail */}
      <div>
        <label className="block text-base font-medium text-black mb-2">
          Thumbnail Image :
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full"
        />
      </div>

      {/* Content - Simple Textarea */}
      <div>
        <label className="block text-base font-medium text-black mb-2">
          Content :
        </label>
        <textarea
          rows={12}
          placeholder="Write your blog content here..."
          value={formData.content}
          onChange={(e) => handleInputChange('content', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-gray-400 text-sm resize-none"
        />
      </div>

      {/* Author */}
      <div>
        <label className="block text-base font-medium text-black mb-2">
          Author :
        </label>
        <input
          type="text"
          value={formData.author}
          onChange={(e) => handleInputChange('author', e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-gray-400 text-sm"
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={handleSaveDraft}
          className="px-6 py-2.5 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg text-sm transition"
        >
          Draft
        </button>
        <button
          type="button"
          onClick={handlePublish}
          className="px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg text-sm transition"
        >
          Publish
        </button>
      </div>

    </div>
  )
}
