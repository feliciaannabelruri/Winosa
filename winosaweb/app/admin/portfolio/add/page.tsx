'use client'

import PortfolioForm from '@/components/admin/PortofolioForm'

export default function AddPortfolioPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
          Portofolio
        </h1>
        <p className="text-gray-600 italic text-base md:text-lg">
          Manage study case and project
        </p>
      </div>

      <PortfolioForm mode="add" />
    </div>
  )
}