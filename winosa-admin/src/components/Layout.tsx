import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Layout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const sidebarWidth = collapsed ? 'ml-16' : 'ml-56';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className={`h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 fixed top-0 right-0 z-40 transition-all duration-300 ${sidebarWidth} left-0`}>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-dark rounded-full flex items-center justify-center">
            <span className="text-primary font-bold text-xs">W</span>
          </div>
          <span className="font-semibold text-dark text-sm tracking-wide">Winosa Admin</span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-dark transition-colors"
        >
          <span>Logout</span>
          <LogOut size={15} />
        </button>
      </header>

      {/* Sidebar */}
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      {/* Main Content */}
      <main className={`transition-all duration-300 ${sidebarWidth} pt-16 min-h-screen`}>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
