import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const sidebarWidth = collapsed ? 'ml-24' : 'ml-24 lg:ml-56';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />

      <main className={`transition-all duration-300 ${sidebarWidth} pt-16 min-h-screen`}>
        <div className="p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;