import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Search, Trash2, Edit2, Image, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { portfolioService, Portfolio } from '../services/portfolioService';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';
import { PORTFOLIO_CATEGORIES } from '../constants';

type FilterType = 'all' | 'draft' | 'published';
const CATEGORY_FILTER_OPTIONS = ['All', ...PORTFOLIO_CATEGORIES];

interface DropdownOption { label: string; value: string; }

const CustomDropdown: React.FC<{
  value: string;
  onChange: (val: string) => void;
  options: DropdownOption[];
}> = ({ value, onChange, options }) => {
  const [open, setOpen] = useState(false);
  const selected = options.find(o => o.value === value);
  return (
    <div className="relative" onBlur={() => setOpen(false)} tabIndex={0}>
      <button onClick={() => setOpen(p => !p)}
        className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 text-sm font-medium pl-5 pr-4 py-3 rounded-full outline-none cursor-pointer hover:border-dark hover:text-dark transition-all">
        {selected?.label}
        <span className="text-gray-400 text-xs">▾</span>
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden z-50 min-w-full">
          {options.map(opt => (
            <button key={opt.value}
              onMouseDown={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-5 py-2.5 text-sm transition-colors ${
                opt.value === value ? 'bg-dark text-white font-medium' : 'text-gray-600 hover:bg-gray-50'
              }`}>
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const PortfolioPage: React.FC = () => {
  const navigate = useNavigate();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [category, setCategory] = useState('All');
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string | null; loading: boolean }>(
    { open: false, id: null, loading: false }
  );

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
    setDeleteModal(p => ({ ...p, loading: true }));
    try {
      await portfolioService.delete(deleteModal.id);
      toast.success('Portfolio deleted');
      setDeleteModal({ open: false, id: null, loading: false });
      fetchPortfolios();
    } catch {
      toast.error('Delete failed');
      setDeleteModal(p => ({ ...p, loading: false }));
    }
  };

  const filtered = portfolios.filter(p => {
    const matchSearch   = p.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus   = filter === 'all' ? true : filter === 'published' ? !!p.isActive : !p.isActive;
    const matchCategory = category === 'All' ? true : p.category === category;
    return matchSearch && matchStatus && matchCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold text-dark">Portfolio</h1>
          <p className="text-gray-400 text-sm mt-1 italic">Manage study case and project</p>
        </div>
        <button onClick={() => navigate('/portfolio/add')}
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-dark font-semibold px-6 py-3 rounded-full transition-all hover:-translate-y-0.5 hover:shadow-md text-sm w-fit">
          <Plus size={16} />
          Add Portfolio
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input type="text" placeholder="Search"
          value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-full text-sm outline-none focus:border-primary bg-white transition-colors"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <CustomDropdown value={filter} onChange={v => setFilter(v as FilterType)}
          options={[
            { label: 'All Status',  value: 'all' },
            { label: 'Published',   value: 'published' },
            { label: 'Draft',       value: 'draft' },
          ]}
        />
        <CustomDropdown value={category} onChange={setCategory}
          options={CATEGORY_FILTER_OPTIONS.map(c => ({ label: c, value: c }))}
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">No portfolios found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(portfolio => (
            <div key={portfolio._id}
              className="bg-white rounded-3xl border-2 border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5 flex flex-col">

              {/* Thumbnail — fixed height */}
              <div className="h-48 flex-shrink-0 bg-gray-50 flex items-center justify-center relative">
                {portfolio.thumbnail || portfolio.image ? (
                  <img
                    src={portfolio.thumbnail || portfolio.image}
                    alt={portfolio.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <Image size={32} className="text-gray-200 mx-auto mb-2" />
                    <p className="text-xs text-gray-300 italic">No thumbnail</p>
                  </div>
                )}
                {/* Status badge */}
                <span className={`absolute top-3 right-3 text-xs px-3 py-1 rounded-full font-medium border ${
                  portfolio.isActive
                    ? 'bg-green-100 text-green-600 border-green-200'
                    : 'bg-gray-100 text-gray-500 border-gray-200'
                }`}>
                  {portfolio.isActive ? 'Published' : 'Draft'}
                </span>
              </div>

              {/* Info — flex-grow agar semua card sama tinggi, action selalu di bawah */}
              <div className="border-t-2 border-gray-100 p-5 flex flex-col flex-1">
                {/* Text block — grow supaya action selalu nempel bawah */}
                <div className="flex-1 min-h-0 mb-4">
                  <h3 className="font-bold text-dark text-base leading-snug line-clamp-2">
                    {portfolio.title}
                  </h3>
                  {(portfolio.shortDesc || portfolio.description) && (
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                      {portfolio.shortDesc || portfolio.description}
                    </p>
                  )}
                  <p className="text-sm text-dark font-medium mt-2">
                    {portfolio.category || '—'}
                  </p>
                </div>

                {/* Actions — always at bottom */}
                <div className="flex gap-2 justify-end flex-shrink-0">
                  <button
                    onClick={() => navigate(`/portfolio/${portfolio._id}`)}
                    className="w-9 h-9 border border-gray-200 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                    title="View Detail">
                    <Eye size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteModal({ open: true, id: portfolio._id, loading: false })}
                    className="w-9 h-9 border border-gray-200 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-50 hover:border-red-200 transition-colors"
                    title="Delete">
                    <Trash2 size={14} />
                  </button>
                  <button
                    onClick={() => navigate(`/portfolio/edit/${portfolio._id}`)}
                    className="w-9 h-9 border border-gray-200 rounded-xl flex items-center justify-center text-primary hover:bg-primary/10 hover:border-primary/30 transition-colors"
                    title="Edit">
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
        title="Delete Portfolio"
        message="Are you sure you want to delete this portfolio?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false, id: null, loading: false })}
        loading={deleteModal.loading}
      />
    </div>
  );
};

export default PortfolioPage;