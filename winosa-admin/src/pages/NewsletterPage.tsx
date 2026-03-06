import React, { useEffect, useState } from 'react';
import { Search, Trash2, Download, Mail } from 'lucide-react';
import { subscriberService } from '../services/subscriberService';
import { Subscriber } from '../types';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';

const NewsletterPage: React.FC = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string | null; loading: boolean }>({
    open: false, id: null, loading: false,
  });

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const data = await subscriberService.getAll();
      setSubscribers(data.data);
    } catch {
      toast.error('Failed to fetch subscribers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSubscribers(); }, []);

  const handleDelete = async () => {
    if (!deleteModal.id) return;
    setDeleteModal(prev => ({ ...prev, loading: true }));
    try {
      await subscriberService.delete(deleteModal.id);
      toast.success('Subscriber removed');
      setDeleteModal({ open: false, id: null, loading: false });
      fetchSubscribers();
    } catch {
      toast.error('Delete failed');
      setDeleteModal(prev => ({ ...prev, loading: false }));
    }
  };

  const handleExport = () => {
    if (!subscribers.length) return;
    subscriberService.exportFromData(subscribers);
    toast.success(`Exported ${subscribers.length} subscribers to CSV`);
  };

  const filtered = subscribers.filter(s => {
    const matchSearch = s.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'all'    ? true :
      filter === 'active' ? s.isActive :
      !s.isActive;
    return matchSearch && matchFilter;
  });

  const activeCount = subscribers.filter(s => s.isActive).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold text-dark">Newsletter</h1>
          <p className="text-gray-400 text-sm mt-1 italic">Manage email subscribers</p>
        </div>
        <button
          onClick={handleExport}
          disabled={subscribers.length === 0}
          className="flex items-center gap-2 bg-dark text-white font-semibold px-6 py-3 rounded-full transition-all duration-200 hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-md text-sm w-fit disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Stats Cards — responsive: 3 cols always but with smaller text on mobile */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-gray-100 p-3 sm:p-5 shadow-sm">
          <p className="text-[10px] sm:text-sm text-gray-400 mb-1 sm:mb-2 leading-tight">Total Subscribers</p>
          <p className="text-2xl sm:text-3xl font-display font-bold text-dark">{subscribers.length}</p>
        </div>
        <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-gray-100 p-3 sm:p-5 shadow-sm">
          <p className="text-[10px] sm:text-sm text-gray-400 mb-1 sm:mb-2 leading-tight">Active</p>
          <p className="text-2xl sm:text-3xl font-display font-bold text-green-500">{activeCount}</p>
        </div>
        <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-gray-100 p-3 sm:p-5 shadow-sm">
          <p className="text-[10px] sm:text-sm text-gray-400 mb-1 sm:mb-2 leading-tight">Inactive</p>
          <p className="text-2xl sm:text-3xl font-display font-bold text-gray-400">{subscribers.length - activeCount}</p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by email"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-full text-sm outline-none focus:border-primary bg-white transition-colors"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(['all', 'active', 'inactive'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium border transition-all duration-200 capitalize ${
                filter === f
                  ? 'bg-dark border-dark text-white'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table — scrollable on mobile */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left text-sm font-semibold text-dark py-4 px-4 pl-6 w-12">No.</th>
                <th className="text-left text-sm font-semibold text-dark py-4 px-4">Email</th>
                <th className="text-left text-sm font-semibold text-dark py-4 px-4">Status</th>
                <th className="text-left text-sm font-semibold text-dark py-4 px-4">Subscribed At</th>
                <th className="text-left text-sm font-semibold text-dark py-4 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-16">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <Mail size={32} className="text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">No subscribers found</p>
                  </td>
                </tr>
              ) : (
                filtered.map((sub, idx) => (
                  <tr
                    key={sub._id}
                    className={`border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                    }`}
                  >
                    <td className="py-4 px-4 pl-6 text-sm text-gray-500">{idx + 1}.</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Mail size={13} className="text-primary" />
                        </div>
                        <span className="text-sm text-dark font-medium truncate max-w-[180px] sm:max-w-none">
                          {sub.email}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ${
                        sub.isActive
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {sub.isActive ? 'Active' : 'Unsubscribed'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(sub.createdAt).toLocaleDateString('id-ID', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => setDeleteModal({ open: true, id: sub._id, loading: false })}
                        className="w-9 h-9 border border-gray-200 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-50 hover:border-red-200 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteModal.open}
        title="Remove Subscriber"
        message="Are you sure you want to remove this subscriber? They will no longer receive newsletters."
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false, id: null, loading: false })}
        loading={deleteModal.loading}
      />
    </div>
  );
};

export default NewsletterPage;