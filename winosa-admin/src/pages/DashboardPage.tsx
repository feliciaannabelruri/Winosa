import React, { useEffect, useState } from 'react';
import {
  FolderOpen, FileText, Briefcase, Users, Mail,
  TrendingUp, Eye, Clock, ArrowRight
} from 'lucide-react';
import { analyticsService } from '../services/analyticsService';
import { Analytics } from '../types';
import { useAuth } from '../context/AuthContext';

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  bg: string;
  iconColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, bg, iconColor }) => (
  <div className={`rounded-3xl border-2 border-yellow-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}>
    <div className="flex items-center justify-between mb-4">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${bg}`}>
        <span className={iconColor}>{icon}</span>
      </div>
    </div>
    <p className="text-5xl font-display font-bold text-dark">{value}</p>
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
        if (data.success && data.data) setAnalytics(data.data);
      } catch {
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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-display font-bold text-dark">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1 italic">
          Overview of Winosa website activity — Welcome back,{' '}
          <span className="text-dark font-medium not-italic">{user?.name}</span>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          label="Portfolios"
          value={analytics?.counts.portfolios ?? 0}
          icon={<FolderOpen size={20} />}
          bg="bg-blue-50"
          iconColor="text-blue-500"
        />
        <StatCard
          label="Blogs"
          value={analytics?.counts.blogs ?? 0}
          icon={<FileText size={20} />}
          bg="bg-primary/10"
          iconColor="text-primary"
        />
        <StatCard
          label="Services"
          value={analytics?.counts.services ?? 0}
          icon={<Briefcase size={20} />}
          bg="bg-purple-50"
          iconColor="text-purple-500"
        />
        <StatCard
          label="Subscribers"
          value={analytics?.counts.subscribers ?? 0}
          icon={<Users size={20} />}
          bg="bg-green-50"
          iconColor="text-green-500"
        />
        <StatCard
          label="Contacts"
          value={analytics?.counts.contacts ?? 0}
          icon={<Mail size={20} />}
          bg="bg-red-50"
          iconColor="text-red-500"
        />
      </div>

      {/* Recent Activities Section */}
      <div>
        <h2 className="text-2xl font-display font-bold text-dark mb-5">Recent Activities</h2>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-4 bg-gray-50 border-b border-gray-100 px-6 py-4">
            {['Type', 'Title / Name', 'Date', 'Status'].map((h) => (
              <span key={h} className="text-sm font-semibold text-primary">{h}</span>
            ))}
          </div>

          {/* Recent Blogs as activities */}
          {analytics?.recentBlogs && analytics.recentBlogs.length > 0 ? (
            analytics.recentBlogs.map((blog, i) => (
              <div
                key={i}
                className={`grid grid-cols-4 px-6 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors ${
                  i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                }`}
              >
                <span className="text-sm font-medium text-dark">Blog</span>
                <span className="text-sm text-gray-700 truncate pr-4">{blog.title}</span>
                <span className="text-sm text-gray-500">
                  {new Date(blog.createdAt).toLocaleDateString('id-ID', {
                    day: '2-digit', month: 'short', year: '2-digit'
                  })}
                </span>
                <span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600">
                    Published
                  </span>
                </span>
              </div>
            ))
          ) : (
            <div className="px-6 py-12 text-center text-gray-400 text-sm">
              No recent activities yet
            </div>
          )}
        </div>
      </div>

      {/* Popular Blogs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Blogs */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-gray-400" />
              <h3 className="font-semibold text-dark text-sm">Recent Blogs</h3>
            </div>
            <ArrowRight size={14} className="text-gray-300" />
          </div>
          {analytics?.recentBlogs && analytics.recentBlogs.length > 0 ? (
            <div className="space-y-3">
              {analytics.recentBlogs.map((blog, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0"
                >
                  <p className="text-sm text-dark font-medium truncate flex-1 mr-4">{blog.title}</p>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {new Date(blog.createdAt).toLocaleDateString('id-ID', {
                      day: '2-digit', month: 'short'
                    })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No blogs yet</p>
          )}
        </div>

        {/* Popular Blogs */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-primary" />
              <h3 className="font-semibold text-dark text-sm">Popular Blogs</h3>
            </div>
            <ArrowRight size={14} className="text-gray-300" />
          </div>
          {analytics?.popularBlogs && analytics.popularBlogs.length > 0 ? (
            <div className="space-y-3">
              {analytics.popularBlogs.map((blog, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center gap-3 flex-1 mr-4">
                    <span className="text-xs font-bold text-gray-200 w-5 text-right flex-shrink-0">
                      {i + 1}
                    </span>
                    <p className="text-sm text-dark font-medium truncate">{blog.title}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Eye size={12} className="text-gray-400" />
                    <span className="text-xs font-medium text-gray-500">{blog.views}</span>
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