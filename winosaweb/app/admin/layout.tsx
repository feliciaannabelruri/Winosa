'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Skip auth check untuk login page
    if (pathname === '/admin/login') {
      setIsLoading(false)
      return
    }

    // Check authentication
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn')
    
    if (!isLoggedIn) {
      router.push('/admin/login')
    } else {
      setIsLoading(false)
    }
  }, [pathname, router])

  // Jangan render layout untuk login page
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  // Show loading saat check auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex pt-16">
        <AdminSidebar />
        {/* Main Content dengan padding yang cukup */}
        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}