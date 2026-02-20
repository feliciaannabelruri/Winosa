import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Branding */}
      <div className="hidden lg:flex w-1/2 bg-gray-100 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />
        <div className="relative text-center">
          {/* Logo placeholder */}
          <div className="w-32 h-32 bg-dark rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <span className="text-primary font-display font-bold text-4xl">W</span>
          </div>
          <h2 className="text-2xl font-display font-bold text-dark mt-6">
            PT. Winosa Mitra Bharatadjaya
          </h2>
          <p className="text-gray-500 mt-2 text-sm">Professional IT Solutions</p>
        </div>
      </div>

      {/* Right - Login Form */}
      <div className="w-full lg:w-1/2 bg-primary flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h1 className="text-4xl font-display font-bold text-dark mb-2">Welcome Back!</h1>
            <p className="text-dark/60 text-sm italic">Sign in to access Winosa admin dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-white rounded-xl pl-12 pr-4 py-4 text-sm outline-none placeholder-gray-400 text-dark shadow-sm"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-white rounded-xl pl-12 pr-12 py-4 text-sm outline-none placeholder-gray-400 text-dark shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-dark text-white rounded-xl py-4 text-sm font-semibold hover:bg-dark/90 transition-colors disabled:opacity-60 mt-2"
            >
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-dark/50 text-xs italic">
              "This page is restricted to authorized administrators"
            </p>
          </div>

          <p className="text-center text-dark/50 text-xs mt-8">© 2026 Winosa</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
