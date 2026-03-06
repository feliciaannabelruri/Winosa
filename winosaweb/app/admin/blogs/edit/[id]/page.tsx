'use client'

import { useParams } from 'next/navigation'
import BlogForm from '@/components/admin/BlogForm'

const DUMMY_BLOGS = [
  {
    id: '1',
    title: 'Why Winosa',
    category: 'Insight',
    author: 'Yurian',
    content: '',
    status: 'Published',
  },
  {
    id: '2',
    title: 'Why Winosa',
    category: 'Insight',
    author: 'Yurian',
    content: '',
    status: 'Draft',
  },
  {
    id: '3',
    title: 'Why Winosa',
    category: 'Insight',
    author: 'Yurian',
    content: '',
    status: 'Published',
  },
]

export default function EditBlogPage() {
  const params = useParams()
  const blogId = params.id as string

  // Find blog by ID
  const blog = DUMMY_BLOGS.find((b) => b.id === blogId)

  if (!blog) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Blog not found</h2>
      </div>
    )
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
          Blog
        </h1>
        <p className="text-gray-600 italic text-base md:text-lg">
          Manage Winosa blog content
        </p>
      </div>

      <BlogForm mode="edit" initialData={blog} />
    </div>
  )
}