import React, { useState, useRef, useEffect } from 'react';
import { LogOut, User, ChevronDown, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleAccount = () => {
    setOpen(false);
    navigate('/account');
  };

  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50 h-16">
      <div className="flex items-center justify-between h-full px-4 sm:px-6">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Toggle */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
            <img src="https://ik.imagekit.io/feliciaaaa/winosa/settings/1775642460741_logo_lymnvf9lA4.png" alt="Winosa" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
            <span className="text-base sm:text-lg font-semibold text-gray-900 truncate max-w-[120px] sm:max-w-none">Winosa Admin</span>
          </Link>
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(prev => !prev)}
            className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 hover:text-dark"
          >
            <User size={18} />
            <span className="hidden sm:block text-sm font-medium max-w-[120px] truncate">
              {user?.name || 'Admin'}
            </span>
            <ChevronDown
              size={14}
              className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            />
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-gray-50">
                <p className="text-sm font-semibold text-dark truncate">{user?.name || 'Admin'}</p>
                <p className="text-xs text-gray-400 truncate mt-0.5">{user?.email || ''}</p>
              </div>
              <div className="py-1.5">
                <button
                  onClick={handleAccount}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User size={14} className="text-gray-400" />
                  Account
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={14} className="text-red-400" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;