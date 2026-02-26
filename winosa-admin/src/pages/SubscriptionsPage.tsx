import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Search, Trash2, Edit2, Crown, Star, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { subscriptionService } from '../services/subscriptionService';
import { Subscription } from '../types';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';

type FilterType = 'all' | 'active' | 'inactive';

const formatUSD = (price: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

const SubscriptionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string | null; loading: boolean }>({
    open: false, id: null, loading: false,
  });

  const fetchSubscriptions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await subscriptionService.getAll();
      setSubscriptions(data.data);
    } catch {
      toast.error('Failed to fetch subscriptions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSubscriptions(); }, [fetchSubscriptions]);

  const handleDelete = async () => {
    if (!deleteModal.id) return;
    setDeleteModal(prev => ({ ...prev, loading: true }));
    try {
      await subscriptionService.delete(deleteModal.id);
      toast.success('Subscription deleted');
      setDeleteModal({ open: false, id: null, loading: false });
      fetchSubscriptions();
    } catch {
      toast.error('Delete failed');
      setDeleteModal(prev => ({ ...prev, loading: false }));
    }
  };

  const filtered = subscriptions.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filter === 'all' ? true :
      filter === 'active' ? s.isActive :
      !s.isActive;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold text-dark">Subscriptions</h1>
          <p className="text-gray-400 text-sm mt-1 italic">Manage subscription plans and pricing</p>
        </div>
        <button
          onClick={() => navigate('/subscriptions/add')}
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-dark font-semibold px-6 py-3 rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md text-sm w-fit"
        >
          <Plus size={16} />
          Add Subscription
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Search subscription"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-full text-sm outline-none focus:border-primary bg-white transition-colors"
        />
      </div>

      {/* Filter */}
      <div className="flex gap-3">
        {(['all', 'active', 'inactive'] as FilterType[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-8 py-2.5 rounded-full text-sm font-medium border transition-all duration-200 capitalize ${
              filter === f
                ? 'bg-dark border-dark text-white shadow-sm'
                : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">No subscriptions found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(sub => (
            <div
              key={sub._id}
              className={`relative bg-white rounded-3xl border-2 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 flex flex-col ${
                sub.isPopular ? 'border-primary' : 'border-gray-100'
              }`}
            >
              {/* Popular Badge */}
              {sub.isPopular && (
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-primary text-dark text-xs font-bold px-3 py-1 rounded-full">
                  <Star size={10} fill="currentColor" />
                  Popular
                </div>
              )}

              <div className="p-6 space-y-4 flex-1">
                {/* Icon + Name */}
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                    sub.isPopular ? 'bg-primary/10' : 'bg-gray-100'
                  }`}>
                    <Crown size={18} className={sub.isPopular ? 'text-primary' : 'text-gray-400'} />
                  </div>
                  <div>
                    <h3 className="font-bold text-dark text-lg leading-tight">{sub.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      sub.isActive
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {sub.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div>
                  <p className="text-2xl font-bold text-dark">{formatUSD(sub.price)}</p>
                  <p className="text-xs text-gray-400">per {sub.duration}</p>
                </div>

                {/* Description */}
                {sub.description && (
                  <p className="text-sm text-gray-500 leading-relaxed">{sub.description}</p>
                )}

                {/* Features — semua ditampilkan */}
                {sub.features && sub.features.length > 0 && (
                  <ul className="space-y-1.5">
                    {sub.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
                        <CheckCircle2 size={13} className="text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Actions */}
              <div className="border-t-2 border-gray-50 px-6 py-4 flex items-center justify-between">
                <p className="text-xs text-gray-400">
                  {new Date(sub.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDeleteModal({ open: true, id: sub._id, loading: false })}
                    className="w-9 h-9 border border-gray-200 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-50 hover:border-red-200 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                  <button
                    onClick={() => navigate(`/subscriptions/edit/${sub._id}`)}
                    className="w-9 h-9 border border-gray-200 rounded-xl flex items-center justify-center text-primary hover:bg-primary/10 hover:border-primary/30 transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModal.open}
        title="Delete Subscription"
        message="Are you sure you want to delete this subscription plan? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false, id: null, loading: false })}
        loading={deleteModal.loading}
      />
    </div>
  );
};

export default SubscriptionsPage;