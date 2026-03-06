'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Briefcase, 
  FolderOpen, 
  FileText, 
  Mail,
  Menu
} from 'lucide-react'

const menuItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Services', href: '/admin/services', icon: Briefcase },
  { name: 'Portofolio', href: '/admin/portfolio', icon: FolderOpen },
  { name: 'Blogs', href: '/admin/blogs', icon: FileText },
  { name: 'Contacts', href: '/admin/contacts', icon: Mail },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <>
      {/* Sidebar dengan lengkungan di kanan atas saja */}
      <aside
        className={`
          fixed top-16 left-0 h-[calc(100vh-4rem)] bg-black
          transition-all duration-300 ease-in-out z-40
          ${isExpanded ? 'w-64' : 'w-20'}
        `}
        style={{
          borderTopRightRadius: '100px',
        }}
      >
        <nav className="py-6 px-4 h-full flex flex-col">
          {/* Hamburger Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-center w-12 h-12 mb-8 text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Menu Items */}
          <ul className="space-y-3 flex-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              
              // Check if current path starts with item href (untuk highlight sub-pages)
              const isActive = pathname === item.href || 
                               (item.href !== '/admin' && pathname.startsWith(item.href))

              if (isExpanded) {
                // Mode EXPANDED - full width dengan text
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`
                        flex items-center gap-4 px-5 py-3 rounded-full
                        transition-all duration-200
                        ${
                          isActive
                            ? 'bg-white text-yellow-500 font-semibold'
                            : 'text-white hover:bg-gray-800'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="whitespace-nowrap text-[15px]">{item.name}</span>
                    </Link>
                  </li>
                )
              } else {
                // Mode COLLAPSED - hanya icon
                return (
                  <li key={item.name} className="flex justify-center">
                    <Link
                      href={item.href}
                      className={`
                        flex items-center justify-center w-12 h-12 rounded-full
                        transition-all duration-200
                        ${
                          isActive
                            ? 'bg-white text-yellow-500'
                            : 'text-white hover:bg-gray-800'
                        }
                      `}
                      title={item.name}
                    >
                      <Icon className="w-6 h-6" />
                    </Link>
                  </li>
                )
              }
            })}
          </ul>
        </nav>
      </aside>

      {/* Spacer untuk push content ke kanan - RESPONSIVE */}
      <div 
        className={`
          flex-shrink-0 transition-all duration-300
          ${isExpanded ? 'w-64' : 'w-20'}
        `} 
      />
    </>
  )
}