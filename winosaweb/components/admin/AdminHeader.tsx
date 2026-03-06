'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { LogOut } from 'lucide-react'

export default function AdminHeader() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn')
    localStorage.removeItem('adminEmail')
    router.push('/admin/login')
  }

  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50 h-16">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-3">
          {/* Logo Image */}
          <div className="w-10 h-10 relative">
            <Image
              src="/images/logo.png"
              alt="Winosa Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-lg font-semibold text-gray-900">Winosa Admin</span>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
        >
          <span className="hidden sm:inline text-sm font-medium">Logout</span>
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}