import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Briefcase, FolderOpen, FileText,
  Mail, Menu, Crown, Users, Settings,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard',     icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/services',      icon: Briefcase,       label: 'Services' },
  { to: '/portfolio',     icon: FolderOpen,      label: 'Portfolio' },
  { to: '/blogs',         icon: FileText,        label: 'Blogs' },
  { to: '/subscriptions', icon: Crown,           label: 'Subs' },
  { to: '/contacts',      icon: Mail,            label: 'Contacts' },
  { to: '/newsletter',    icon: Users,           label: 'Newsletter' },
  { to: '/settings',      icon: Settings,        label: 'Settings' },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  return (
    <aside
      style={{ top: '4rem', bottom: 0, borderTopRightRadius: '100px' }}
      className={`fixed left-0 z-40 bg-black transition-all duration-300 ease-in-out w-20 ${
        collapsed ? 'lg:w-20' : 'lg:w-56'
      }`}
    >
      <nav className="py-6 px-2 lg:px-3 flex flex-col h-full">

        {/* Desktop only: hamburger toggle */}
        <button
          onClick={onToggle}
          className="hidden lg:flex items-center justify-center w-12 h-12 mb-8 text-white hover:bg-gray-800 rounded-lg transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Mobile only: spacer */}
        <div className="lg:hidden h-4 mb-4" />

        {/* Nav items */}
        <ul className="space-y-1 flex-1 overflow-y-auto scrollbar-hide">
          {navItems.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `transition-all duration-200 flex flex-col items-center justify-center py-2 rounded-xl mx-1 lg:mx-0 lg:flex-row lg:justify-start lg:gap-3 lg:px-3 lg:py-3 lg:rounded-full ${
                    collapsed ? 'lg:flex-col lg:justify-center lg:px-0 lg:w-12 lg:h-12 lg:mx-auto' : ''
                  } ${
                    isActive ? 'bg-white text-yellow-500 font-semibold' : 'text-white hover:bg-gray-800'
                  }`
                }
                title={label}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-[10px] mt-1 leading-tight text-center lg:hidden">{label}</span>
                <span className={`hidden whitespace-nowrap text-[15px] ${collapsed ? '' : 'lg:inline'}`}>
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