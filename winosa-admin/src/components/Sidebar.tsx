import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase, FolderOpen, FileText, Mail, Menu } from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/services', icon: Briefcase, label: 'Services' },
  { to: '/portfolio', icon: FolderOpen, label: 'Portofolio' },
  { to: '/blogs', icon: FileText, label: 'Blogs' },
  { to: '/contacts', icon: Mail, label: 'Contacts' },
];

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-dark-sidebar transition-all duration-300 z-50 flex flex-col ${
        collapsed ? 'w-16' : 'w-56'
      }`}
    >
      {/* Logo area */}
      <div className="flex items-center h-16 px-4 border-b border-white/5">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-black font-bold text-sm">
              W
            </div>
            <span className="text-white font-display font-semibold text-sm">Winosa Admin</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-black font-bold text-sm mx-auto">
            W
          </div>
        )}
      </div>

      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 bg-dark-sidebar border border-white/10 rounded-full p-1 text-white/60 hover:text-white transition-colors z-10"
      >
        <Menu size={12} />
      </button>

      {/* Nav Items */}
      <nav className="flex-1 py-6 px-2 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-primary/15 text-primary'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={18}
                  className={`flex-shrink-0 ${isActive ? 'text-primary' : ''}`}
                />
                {!collapsed && (
                  <span className="text-sm font-medium truncate">{label}</span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
