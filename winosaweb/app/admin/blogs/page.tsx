'use client'

import { Trash2, Pencil, Plus, Search } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal'

const DUMMY_BLOGS = [
  {
    id: '1',
    title: 'Why Winosa',
    category: 'Insight',
    date: '03/01/26',
    author: 'Yurian',
    status: 'Published',
    image: '/placeholder.jpg'
  },
  {
    id: '2',
    title: 'Why Winosa',
    category: 'Insight',
    date: '03/01/26',
    author: 'Yurian',
    status: 'Draft',
    image: '/placeholder.jpg'
  },
  {
    id: '3',
    title: 'Why Winosa',
    category: 'Insight',
    date: '03/01/26',
    author: 'Yurian',
    status: 'Published',
    image: '/placeholder.jpg'
  },
  {
    id: '4',
    title: 'Why Winosa',
    category: 'Insight',
    date: '03/01/26',
    author: 'Yurian',
    status: 'Draft',
    image: '/placeholder.jpg'
  },
  {
    id: '5',
    title: 'Why Winosa',
    category: 'Insight',
    date: '03/01/26',
    author: 'Yurian',
    status: 'Published',
    image: '/placeholder.jpg'
  },
  {
    id: '6',
    title: 'Why Winosa',
    category: 'Insight',
    date: '03/01/26',
    author: 'Yurian',
    status: 'Draft',
    image: '/placeholder.jpg'
  },
]

export default function BlogsPage() {
  const router = useRouter()
  const [blogs, setBlogs] = useState(DUMMY_BLOGS)
  const [activeFilter, setActiveFilter] = useState<'All' | 'Draft' | 'Published'>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; blogId: string | null }>({
    isOpen: false,
    blogId: null,
  })

  const filteredBlogs = blogs.filter((blog) => {
    const matchesFilter = 
      activeFilter === 'All' || 
      blog.status === activeFilter
    
    const matchesSearch = 
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  const handleEdit = (id: string) => {
    router.push(`/admin/blogs/edit/${id}`)
  }

  const handleDelete = (id: string) => {
    setDeleteModal({ isOpen: true, blogId: id })
  }

  const confirmDelete = () => {
    if (deleteModal.blogId) {
      setBlogs(blogs.filter((b) => b.id !== deleteModal.blogId))
    }
    setDeleteModal({ isOpen: false, blogId: null })
  }

  const handleAddNew = () => {
    router.push('/admin/blogs/add')
  }

  return (
    <div className="space-y-6 w-full">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Blog
          </h1>
          <p className="text-gray-600 italic text-base md:text-lg">
            Manage Winosa blog content
          </p>
        </div>

        {/* Add Blog Button */}
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-3 rounded-full transition-colors duration-200 w-fit"
        >
          <Plus className="w-5 h-5" />
          <span>Add Blog</span>
        </button>
      </div>

      {/* SEARCH BAR - SENDIRI di atas */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search Blog Tittle"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
        />
      </div>

      {/* FILTER BUTTONS - TERPISAH di bawah search */}
      <div className="flex gap-3">
        {(['All', 'Draft', 'Published'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setActiveFilter(status)}
            className={`
              px-8 py-2.5 rounded-full font-medium transition-colors duration-200
              ${
                activeFilter === status
                  ? 'bg-black text-white'
                  : 'bg-white text-black border border-gray-300 hover:bg-gray-50'
              }
            `}
          >
            {status}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">No.</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Image</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tittle</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Author</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredBlogs.map((blog, index) => (
              <tr 
                key={blog.id}
                className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              >
                <td className="px-6 py-4 text-sm text-gray-900">{index + 1}.</td>
                <td className="px-6 py-4">
                  <div className="w-14 h-14 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-gray-400 text-xs italic">image</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{blog.title}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{blog.category}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{blog.date}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{blog.author}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleDelete(blog.id)}
                      className="w-9 h-9 flex items-center justify-center border border-black rounded-lg text-red-500 hover:bg-red-50 transition"
                    >
                      <Trash2 size={15} />
                    </button>
                    <button 
                      onClick={() => handleEdit(blog.id)}
                      className="w-9 h-9 flex items-center justify-center border border-black rounded-lg text-yellow-600 hover:bg-yellow-50 transition"
                    >
                      <Pencil size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {filteredBlogs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No blogs found</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, blogId: null })}
        onConfirm={confirmDelete}
        title="Delete Blog"
        message="Are you sure you want to delete this blog? This action cannot be undone."
      />
    </div>
  )
}