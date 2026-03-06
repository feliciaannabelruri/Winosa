'use client'

import { Trash2, Pencil, Plus, Search } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal'

const DUMMY_PORTFOLIOS = [
  {
    id: '1',
    title: 'Prowerty',
    description: 'Platform market place untuk property',
    category: 'Web Application',
    status: 'Draft',
  },
  {
    id: '2',
    title: 'Prowerty',
    description: 'Platform market place untuk property',
    category: 'Web Application',
    status: 'Published',
  },
  {
    id: '3',
    title: 'Prowerty',
    description: 'Platform market place untuk property',
    category: 'Web Application',
    status: 'Draft',
  },
]

export default function PortfolioPage() {
  const router = useRouter()
  const [portfolios, setPortfolios] = useState(DUMMY_PORTFOLIOS)
  const [activeFilter, setActiveFilter] = useState<'All' | 'Draft' | 'Published'>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; portfolioId: string | null }>({
    isOpen: false,
    portfolioId: null,
  })

  const filteredPortfolios = portfolios.filter((portfolio) => {
    const matchesFilter = 
      activeFilter === 'All' || 
      portfolio.status === activeFilter
    
    const matchesSearch = 
      portfolio.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      portfolio.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      portfolio.category.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  const handleEdit = (id: string) => {
    router.push(`/admin/portfolio/edit/${id}`)
  }

  const handleDelete = (id: string) => {
    setDeleteModal({ isOpen: true, portfolioId: id })
  }

  const confirmDelete = () => {
    if (deleteModal.portfolioId) {
      setPortfolios(portfolios.filter((p) => p.id !== deleteModal.portfolioId))
    }
    setDeleteModal({ isOpen: false, portfolioId: null })
  }

  const handleAddNew = () => {
    router.push('/admin/portfolio/add')
  }

  return (
    <div className="space-y-6 w-full">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Portofolio
          </h1>
          <p className="text-gray-600 italic text-base md:text-lg">
            Manage study case and project
          </p>
        </div>

        {/* Add Portfolio Button */}
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-3 rounded-full transition-colors duration-200 w-fit"
        >
          <Plus className="w-5 h-5" />
          <span>Add Portofolio</span>
        </button>
      </div>

      {/* SEARCH BAR - SENDIRI di atas */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search"
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

      {/* CARD GRID */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredPortfolios.map((item) => (
          <div
            key={item.id}
            className="border border-black rounded-3xl overflow-hidden bg-white"
          >
            {/* THUMBNAIL */}
            <div className="relative h-64 bg-[#f4efe9] flex items-center justify-center">
              <span className="text-gray-400 text-base">
                Logo / thumbnail
              </span>

              {/* STATUS BADGE */}
              <div
                className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs border border-black ${
                  item.status === 'Published'
                    ? 'bg-green-200'
                    : 'bg-gray-200'
                }`}
              >
                {item.status}
              </div>
            </div>

            {/* BOTTOM INFO */}
            <div className="border-t border-black p-5 flex justify-between items-end">
              <div>
                <h3 className="text-xl font-semibold leading-tight">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {item.description}
                </p>
                <p className="mt-2 text-sm text-black">
                  {item.category}
                </p>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-2">
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="w-9 h-9 flex items-center justify-center border border-black rounded-lg text-red-500 hover:bg-red-50 transition"
                >
                  <Trash2 size={15} />
                </button>
                <button 
                  onClick={() => handleEdit(item.id)}
                  className="w-9 h-9 flex items-center justify-center border border-black rounded-lg text-yellow-600 hover:bg-yellow-50 transition"
                >
                  <Pencil size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredPortfolios.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No portfolios found</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, portfolioId: null })}
        onConfirm={confirmDelete}
        title="Delete Portfolio"
        message="Are you sure you want to delete this portfolio? This action cannot be undone."
      />
    </div>
  )
}