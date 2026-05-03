import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Briefcase, FolderOpen, FileText,
  Mail, Menu, Crown, Users, Settings,
  Grid, X,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard',     icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/services',      icon: Briefcase,       label: 'Services' },
  { to: '/portfolio',     icon: FolderOpen,      label: 'Portfolio' },
  { to: '/blogs',         icon: FileText,        label: 'Blogs' },
  { to: '/subscriptions', icon: Crown,           label: 'Subscriptions' },
  { to: '/content',       icon: Grid,            label: 'Content' },
  { to: '/contacts',      icon: Mail,            label: 'Contacts' },
  { to: '/newsletter',    icon: Users,           label: 'Newsletter' },
  { to: '/settings',      icon: Settings,        label: 'Settings' },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle, mobileOpen, onClose }) => {
  return (
    <aside
      style={{ top: '4rem', bottom: 0 }}
      className={`fixed left-0 z-50 bg-black transition-all duration-300 ease-in-out ${
        // Desktop widths
        collapsed ? 'lg:w-20' : 'lg:w-56'
      } ${
        // Mobile behavior: drawer
        mobileOpen ? 'translate-x-0 w-64 rounded-r-3xl' : '-translate-x-full lg:translate-x-0 w-22 lg:rounded-tr-[100px]'
      }`}
    >
      <nav className="py-6 px-3 flex flex-col h-full relative">
        {/* Close button for mobile */}
        <button 
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 text-gray-500 hover:text-white"
        >
          <X size={20} />
        </button>

        {/* Desktop only (hamburger toggle) */}
        <button
          onClick={onToggle}
          className="hidden lg:flex items-center justify-center w-12 h-12 mb-8 text-white hover:bg-gray-800 rounded-lg transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Mobile only */}
        <div className="lg:hidden h-4 mb-4" />

        {/* Nav items */}
        <ul className="space-y-1 flex-1 overflow-y-auto scrollbar-hide">
          {navItems.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                onClick={onClose}
                className={({ isActive }) =>
                  `transition-all duration-200 flex items-center gap-3 px-4 py-3 rounded-2xl lg:rounded-full ${
                    collapsed ? 'lg:justify-center lg:px-0 lg:w-12 lg:h-12 lg:mx-auto' : ''
                  } ${
                    isActive ? 'bg-white text-yellow-500 font-semibold' : 'text-white hover:bg-gray-800'
                  }`
                }
                title={label}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className={`text-[15px] whitespace-nowrap ${collapsed ? 'lg:hidden' : 'inline'}`}>
                  {label}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;