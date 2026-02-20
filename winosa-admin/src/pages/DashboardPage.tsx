import React, { useEffect, useState } from 'react';
import { FolderOpen, FileText, Briefcase, Users, Mail, TrendingUp, Eye, Clock } from 'lucide-react';
import { analyticsService } from '../services/analyticsService';
import { Analytics } from '../types';
import { useAuth } from '../context/AuthContext';

const StatCard: React.FC<{
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}> = ({ label, value, icon, color }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
    <div className="flex items-center justify-between mb-4">
      <span className="text-sm text-gray-500">{label}</span>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        {icon}
      </div>
    </div>
    <p className="text-3xl font-display font-bold text-dark">{value}</p>
  </div>
);

const DashboardPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await analyticsService.getAnalytics();
        if (data.success && data.data) {
          setAnalytics(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-dark">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1 italic">
          Welcome back, {user?.name}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard
          label="Portfolios"
          value={analytics?.counts.portfolios ?? 0}
          icon={<FolderOpen size={18} className="text-blue-500" />}
          color="bg-blue-50"
        />
        <StatCard
          label="Blogs"
          value={analytics?.counts.blogs ?? 0}
          icon={<FileText size={18} className="text-primary" />}
          color="bg-primary/10"
        />
        <StatCard
          label="Services"
          value={analytics?.counts.services ?? 0}
          icon={<Briefcase size={18} className="text-purple-500" />}
          color="bg-purple-50"
        />
        <StatCard
          label="Subscribers"
          value={analytics?.counts.subscribers ?? 0}
          icon={<Users size={18} className="text-green-500" />}
          color="bg-green-50"
        />
        <StatCard
          label="Contacts"
          value={analytics?.counts.contacts ?? 0}
          icon={<Mail size={18} className="text-red-500" />}
          color="bg-red-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Blogs */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-5">
            <Clock size={16} className="text-gray-400" />
            <h3 className="font-semibold text-dark text-sm">Recent Blogs</h3>
          </div>
          {analytics?.recentBlogs && analytics.recentBlogs.length > 0 ? (
            <div className="space-y-3">
              {analytics.recentBlogs.map((blog, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <p className="text-sm text-dark font-medium truncate flex-1 mr-4">{blog.title}</p>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {new Date(blog.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No blogs yet</p>
          )}
        </div>

        {/* Popular Blogs */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={16} className="text-primary" />
            <h3 className="font-semibold text-dark text-sm">Popular Blogs</h3>
          </div>
          {analytics?.popularBlogs && analytics.popularBlogs.length > 0 ? (
            <div className="space-y-3">
              {analytics.popularBlogs.map((blog, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <p className="text-sm text-dark font-medium truncate flex-1 mr-4">{blog.title}</p>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Eye size={12} className="text-gray-400" />
                    <span className="text-xs text-gray-400">{blog.views}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No data yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
