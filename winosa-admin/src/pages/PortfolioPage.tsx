import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Search, Trash2, Edit2, Image } from 'lucide-react';
import { portfolioService } from '../services/portfolioService';
import { Portfolio } from '../types';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';
import PortfolioFormModal from '../components/PortfolioFormModal';

type FilterType = 'all' | 'draft' | 'published';

const PortfolioPage: React.FC = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string | null; loading: boolean }>({
    open: false, id: null, loading: false
  });
  const [formModal, setFormModal] = useState<{ open: boolean; portfolio: Portfolio | null }>({
    open: false, portfolio: null
  });

  const fetchPortfolios = useCallback(async () => {
    setLoading(true);
    try {
      const data = await portfolioService.getAll();
      setPortfolios(data.data);
    } catch {
      toast.error('Failed to fetch portfolios');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPortfolios(); }, [fetchPortfolios]);

  const handleDelete = async () => {
    if (!deleteModal.id) return;
    setDeleteModal(prev => ({ ...prev, loading: true }));
    try {
      await portfolioService.delete(deleteModal.id);
      toast.success('Portfolio deleted');
      setDeleteModal({ open: false, id: null, loading: false });
      fetchPortfolios();
    } catch {
      toast.error('Delete failed');
      setDeleteModal(prev => ({ ...prev, loading: false }));
    }
  };

  const filtered = portfolios.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    if (filter === 'published') return matchSearch && p.isActive;
    if (filter === 'draft') return matchSearch && !p.isActive;
    return matchSearch;
  });

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-dark">Portofolio</h1>
          <p className="text-gray-400 text-sm mt-1 italic">Manage study case and project</p>
        </div>
        <button
          onClick={() => setFormModal({ open: true, portfolio: null })}
          className="flex items-center gap-2 bg-primary text-dark font-semibold px-5 py-3 rounded-2xl hover:bg-primary-dark transition-colors shadow-sm text-sm"
        >
          <Plus size={16} />
          Add Portofolio
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-full text-sm outline-none focus:border-primary w-44 bg-white"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'draft', 'published'] as FilterType[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm border transition-colors capitalize ${
                filter === f
                  ? 'border-dark bg-dark text-white'
                  : 'border-gray-200 text-gray-600 hover:border-gray-400 bg-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">No portfolios found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(portfolio => (
            <div key={portfolio._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Status Badge */}
              <div className="relative">
                <div className="h-44 bg-gray-100 flex items-center justify-center">
                  {portfolio.image ? (
                    <img src={portfolio.image} alt={portfolio.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <Image size={32} className="text-gray-300 mx-auto mb-1" />
                      <p className="text-xs text-gray-300">Logo/thumbnail</p>
                    </div>
                  )}
                </div>
                <span className={`absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full italic font-medium ${
                  portfolio.isActive
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {portfolio.isActive ? 'Published' : 'Draft'}
                </span>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-semibold text-dark">{portfolio.title}</h3>
                {portfolio.description && (
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{portfolio.description}</p>
                )}
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-gray-500">{portfolio.category || 'Web Application'}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDeleteModal({ open: true, id: portfolio._id, loading: false })}
                      className="w-8 h-8 border border-red-200 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                    <button
                      onClick={() => setFormModal({ open: true, portfolio })}
                      className="w-8 h-8 border border-yellow-200 rounded-lg flex items-center justify-center text-yellow-500 hover:bg-yellow-50 transition-colors"
                    >
                      <Edit2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModal.open}
        title="Delete Portfolio"
        message="Are you sure you want to delete this portfolio?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false, id: null, loading: false })}
        loading={deleteModal.loading}
      />

      <PortfolioFormModal
        isOpen={formModal.open}
        portfolio={formModal.portfolio}
        onClose={() => setFormModal({ open: false, portfolio: null })}
        onSuccess={() => { setFormModal({ open: false, portfolio: null }); fetchPortfolios(); }}
      />
    </div>
  );
};

export default PortfolioPage;
