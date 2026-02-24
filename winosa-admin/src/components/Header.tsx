import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50 h-16">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-3">
          <img
            src="/images/logo.png"
            alt="Winosa"
            className="w-10 h-10 object-contain"
          />
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
  );
};

export default Header;