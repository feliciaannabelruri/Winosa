import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Responsive margins: 
  // Mobile: 0 margin (sidebar is a drawer)
  // Desktop: ml-24 or ml-56 depending on collapse state
  const sidebarMargin = collapsed ? 'lg:ml-24' : 'lg:ml-56';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setMobileOpen(true)} />

      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <main className={`transition-all duration-300 ${sidebarMargin} pt-16 min-h-screen`}>
        <div className="p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;