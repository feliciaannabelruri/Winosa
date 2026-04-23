import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderOpen, FileText, Briefcase, Users, Mail,
  TrendingUp, Eye, Clock, ArrowRight,
  Globe, Wrench, UserPlus, MessageSquare
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
  <div className="rounded-3xl border-2 border-yellow-100 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 overflow-hidden min-w-0">
    <div className="flex items-center justify-between mb-2 sm:mb-3 gap-1">
      <p className="text-xs font-medium text-gray-500 leading-tight truncate">{label}</p>
      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${bg}`}>
        <span className={iconColor}>{icon}</span>
      </div>
    </div>
    <p className="text-2xl sm:text-3xl font-display font-bold text-dark truncate">{value ?? 0}</p>
  </div>
);

// Badge color per activity type
const typeConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  Blog:       { bg: 'bg-primary/10',  text: 'text-primary',    icon: <FileText size={12} /> },
  Service:    { bg: 'bg-purple-50',   text: 'text-purple-500', icon: <Wrench size={12} /> },
  Subscriber: { bg: 'bg-green-50',    text: 'text-green-500',  icon: <UserPlus size={12} /> },
  Contact:    { bg: 'bg-red-50',      text: 'text-red-500',    icon: <MessageSquare size={12} /> },
};

const statusConfig: Record<string, string> = {
  Published:    'bg-green-50 text-green-600',
  Draft:        'bg-gray-100 text-gray-500',
  Active:       'bg-green-50 text-green-600',
  Unsubscribed: 'bg-gray-100 text-gray-500',
  Unread:       'bg-primary/10 text-primary',
  Read:         'bg-gray-100 text-gray-500',
};

interface Activity {
  type: string;
  title: string;
  subtitle?: string;
  status: string;
  createdAt: string;
}

const DashboardPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await analyticsService.getAnalytics();
        if (data.success && data.data) setAnalytics(data.data);
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
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

  const counts = analytics?.counts ?? {
    portfolios: 0, blogs: 0, services: 0, subscribers: 0, contacts: 0,
  };

  const recentActivities: Activity[] = (analytics as any)?.recentActivities ?? [];

  return (
    <div className="space-y-6 sm:space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-dark">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1 italic">
          Overview of Winosa website activity — Welcome back,{' '}
          <span className="text-dark font-medium not-italic">{user?.name ?? 'Admin'}</span>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <StatCard label="Portfolios"  value={counts.portfolios}  icon={<FolderOpen size={16} />} bg="bg-blue-50"    iconColor="text-blue-500"   />
        <StatCard label="Blogs"       value={counts.blogs}       icon={<FileText size={16} />}   bg="bg-primary/10" iconColor="text-primary"    />
        <StatCard label="Services"    value={counts.services}    icon={<Briefcase size={16} />}  bg="bg-purple-50"  iconColor="text-purple-500" />
        <StatCard label="Subscribers" value={counts.subscribers} icon={<Users size={16} />}      bg="bg-green-50"   iconColor="text-green-500"  />
        <StatCard label="Contacts"    value={counts.contacts}    icon={<Mail size={16} />}       bg="bg-red-50"     iconColor="text-red-500"    />
      </div>



      {/* Recent Activities */}
      <div>
        <h2 className="text-xl sm:text-2xl font-display font-bold text-dark mb-4 sm:mb-5">Recent Activities</h2>
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] table-fixed">
              <colgroup>
                <col className="w-[110px]" />
                <col />
                <col className="w-[90px]" />
                <col className="w-[110px]" />
              </colgroup>
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['Type', 'Title / Name', 'Date', 'Status'].map(h => (
                    <th key={h} className="text-left text-sm font-semibold text-primary py-4 px-4 first:pl-6">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity, i) => {
                    const cfg = typeConfig[activity.type] ?? { bg: 'bg-gray-100', text: 'text-gray-500', icon: <Globe size={12} /> };
                    const statusCls = statusConfig[activity.status] ?? 'bg-gray-100 text-gray-500';
                    return (
                      <tr
                        key={i}
                        className={`border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors ${
                          i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                        }`}
                      >
                        {/* Type badge */}
                        <td className="py-3 px-4 pl-6">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
                            {cfg.icon}
                            {activity.type}
                          </span>
                        </td>

                        <td className="py-3 px-4 overflow-hidden">
                          <p className="text-sm text-dark font-medium truncate">{activity.title}</p>
                          {activity.subtitle && (
                            <p className="text-xs text-gray-400 truncate mt-0.5">{activity.subtitle}</p>
                          )}
                        </td>

                        {/* Date */}
                        <td className="py-3 px-4 text-sm text-gray-500 whitespace-nowrap">
                          {new Date(activity.createdAt).toLocaleDateString('id-ID', {
                            day: '2-digit', month: 'short', year: '2-digit'
                          })}
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusCls}`}>
                            {activity.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400 text-sm">
                      No recent activities yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Popular + Recent Blogs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Blogs */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-6 overflow-hidden">
          <button
            onClick={() => navigate('/blogs')}
            className="flex items-center justify-between mb-4 sm:mb-5 w-full group"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Clock size={16} className="text-gray-400 flex-shrink-0" />
              <h3 className="font-semibold text-dark text-sm truncate">Recent Blogs</h3>
            </div>
            <ArrowRight size={14} className="text-gray-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0" />
          </button>
          {analytics?.recentBlogs && analytics.recentBlogs.length > 0 ? (
            <div className="space-y-3">
              {analytics.recentBlogs.map((blog, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0 gap-3 min-w-0">
                  <p className="text-sm text-dark font-medium truncate min-w-0 flex-1">{blog.title}</p>
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
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-6 overflow-hidden">
          <button
            onClick={() => navigate('/blogs')}
            className="flex items-center justify-between mb-4 sm:mb-5 w-full group"
          >
            <div className="flex items-center gap-2 min-w-0">
              <TrendingUp size={16} className="text-primary flex-shrink-0" />
              <h3 className="font-semibold text-dark text-sm truncate">Popular Blogs</h3>
            </div>
            <ArrowRight size={14} className="text-gray-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0" />
          </button>
          {analytics?.popularBlogs && analytics.popularBlogs.length > 0 ? (
            <div className="space-y-3">
              {analytics.popularBlogs.map((blog, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0 gap-3 min-w-0">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="text-xs font-bold text-gray-200 w-5 text-right flex-shrink-0">{i + 1}</span>
                    <p className="text-sm text-dark font-medium truncate min-w-0">{blog.title}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Eye size={12} className="text-gray-400" />
                    <span className="text-xs font-medium text-gray-500">{blog.views ?? 0}</span>
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