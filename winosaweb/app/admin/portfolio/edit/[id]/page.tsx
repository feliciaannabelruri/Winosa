'use client'

import { useParams } from 'next/navigation'
import PortfolioForm from '@/components/admin/PortofolioForm'

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

export default function EditPortfolioPage() {
  const params = useParams()
  const portfolioId = params.id as string

  // Find portfolio by ID
  const portfolio = DUMMY_PORTFOLIOS.find((p) => p.id === portfolioId)

  if (!portfolio) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Portfolio not found</h2>
      </div>
    )
  }

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

      <PortfolioForm mode="edit" initialData={portfolio} />
    </div>
  )
}