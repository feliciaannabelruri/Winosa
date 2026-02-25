import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase, FolderOpen, FileText, Mail, Menu, Crown } from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/services', icon: Briefcase, label: 'Services' },
  { to: '/portfolio', icon: FolderOpen, label: 'Portofolio' },
  { to: '/blogs', icon: FileText, label: 'Blogs' },
  { to: '/contacts', icon: Mail, label: 'Contacts' },
  { to: '/subscriptions', icon: Crown, label: 'Subscriptions' },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  return (
    <aside
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-black transition-all duration-300 ease-in-out z-40 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
      style={{ borderTopRightRadius: '100px' }}
    >
      <nav className="py-6 px-4 h-full flex flex-col">
        {/* Hamburger Button */}
        <button
          onClick={onToggle}
          className="flex items-center justify-center w-12 h-12 mb-8 text-white hover:bg-gray-800 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Menu Items */}
        <ul className="space-y-3 flex-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <li key={to} className={collapsed ? 'flex justify-center' : ''}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  collapsed
                    ? `flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 ${
                        isActive ? 'bg-white text-yellow-500' : 'text-white hover:bg-gray-800'
                      }`
                    : `flex items-center gap-4 px-5 py-3 rounded-full transition-all duration-200 ${
                        isActive
                          ? 'bg-white text-yellow-500 font-semibold'
                          : 'text-white hover:bg-gray-800'
                      }`
                }
                title={collapsed ? label : undefined}
              >
                <Icon className={`flex-shrink-0 ${collapsed ? 'w-6 h-6' : 'w-5 h-5'}`} />
                {!collapsed && (
                  <span className="whitespace-nowrap text-[15px]">{label}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;