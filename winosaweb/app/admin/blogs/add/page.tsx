'use client'

import BlogForm from '@/components/admin/BlogForm'

export default function AddBlogPage() {
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

      <BlogForm mode="add" />
    </div>
  )
}