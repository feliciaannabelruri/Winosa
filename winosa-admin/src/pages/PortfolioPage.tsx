import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Search, Trash2, Edit2, Image, Eye, FileEdit, ChevronDown, Save, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { portfolioService } from '../services/portfolioService';
import type { Portfolio } from '../types';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';
import { PORTFOLIO_CATEGORIES } from '../constants';
import api from '../services/api';

type FilterType = 'all' | 'draft' | 'published';
const CATEGORY_FILTER_OPTIONS = ['All Categories', ...PORTFOLIO_CATEGORIES];

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
      <button
        onClick={() => setOpen(p => !p)}
        className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 text-sm font-medium pl-5 pr-4 py-3 rounded-full outline-none cursor-pointer hover:border-dark hover:text-dark transition-all whitespace-nowrap"
      >
        {selected?.label}
        <span className="text-gray-400 text-xs">▾</span>
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden z-50 min-w-full">
          {options.map(opt => (
            <button
              key={opt.value}
              onMouseDown={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-5 py-2.5 text-sm transition-colors ${
                opt.value === value ? 'bg-dark text-white font-medium' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
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
  const [category, setCategory] = useState('All Categories');
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string | null; loading: boolean }>(
    { open: false, id: null, loading: false }
  );
  const [tab, setTab] = useState<'portfolio' | 'page-content'>('portfolio');

  // ── Page Content State ──
  const [openSection, setOpenSection] = useState<string | null>('hero');
  const [heroForm, setHeroForm] = useState({ title: '', subtitle: '' });
  const [heroId, setHeroId] = useState<string | null>(null);
  const [heroErrors, setHeroErrors] = useState({ title: false, subtitle: false });

  const [bridgeForm, setBridgeForm] = useState({
    quote: '',
    stats: [
      { value: '24+', label: 'Team Members' },
      { value: '15+', label: 'Projects Done' },
      { value: '100%', label: 'Quality Guaranteed' },
    ],
  });
  const [bridgeId, setBridgeId] = useState<string | null>(null);
  const [bridgeErrors, setBridgeErrors] = useState({ quote: false });

  const [explanationForm, setExplanationForm] = useState({
    badge: '', title1: '', title2: '', description: '',
  });
  const [explanationId, setExplanationId] = useState<string | null>(null);
  const [explanationErrors, setExplanationErrors] = useState({ title1: false });

  const [savingHero, setSavingHero] = useState(false);
  const [savingBridge, setSavingBridge] = useState(false);
  const [savingExplanation, setSavingExplanation] = useState(false);
  const [fetchingContent, setFetchingContent] = useState(false);

  const fetchPortfolios = useCallback(async () => {
    setLoading(true);
    try {
      const data = await portfolioService.getAll();
      setPortfolios(data.data);
    } catch {
      toast.error('Gagal memuat data portfolio');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPortfolios(); }, [fetchPortfolios]);

  useEffect(() => {
    if (tab !== 'page-content') return;
    setFetchingContent(true);
    api.get('/admin/portfolio').then(res => {
      const all = res.data?.data || [];

      const hero = all.find((s: any) => s.slug === 'hero-portfolio');
      if (hero) {
        setHeroId(hero._id);
        try {
          const p = JSON.parse(hero.description);
          setHeroForm({ title: p.title || '', subtitle: p.subtitle || '' });
        } catch {}
      }

      const bridge = all.find((s: any) => s.slug === 'bridge-portfolio');
      if (bridge) {
        setBridgeId(bridge._id);
        try {
          const p = JSON.parse(bridge.description);
          setBridgeForm({ quote: p.quote || '', stats: p.stats || bridgeForm.stats });
        } catch {}
      }

      const explanation = all.find((s: any) => s.slug === 'explanation-portfolio');
      if (explanation) {
        setExplanationId(explanation._id);
        try {
          const p = JSON.parse(explanation.description);
          setExplanationForm({
            badge: p.badge || '',
            title1: p.title1 || '',
            title2: p.title2 || '',
            description: p.description || '',
          });
        } catch {}
      }
    }).catch(() => toast.error('Failed to load page content'))
      .finally(() => setFetchingContent(false));
  }, [tab]);

  // ← saveHero, saveBridge, saveExplanation TARUH DI SINI, di luar useEffect
  const saveHero = async () => {
    const errors = { title: !heroForm.title.trim(), subtitle: !heroForm.subtitle.trim() };
    setHeroErrors(errors);
    if (errors.title || errors.subtitle) { toast.error('All fields are required'); return; }
    setSavingHero(true);
    try {
      const payload = { title: 'Hero Portfolio', slug: 'hero-portfolio', description: JSON.stringify(heroForm), isActive: true };
      if (heroId) await api.put(`/admin/portfolio/${heroId}`, payload);
      else await api.post('/admin/portfolio', payload);
      toast.success('Hero saved!');
    } catch { toast.error('Failed to save'); }
    finally { setSavingHero(false); }
  };

  const saveBridge = async () => {
    const errors = { quote: !bridgeForm.quote.trim() };
    setBridgeErrors(errors);
    const emptyStats = bridgeForm.stats.some(s => !s.value.trim() || !s.label.trim());
    if (errors.quote || emptyStats) { toast.error('All fields are required'); return; }
    setSavingBridge(true);
    try {
      const payload = { title: 'Bridge Portfolio', slug: 'bridge-portfolio', description: JSON.stringify(bridgeForm), isActive: true };
      if (bridgeId) await api.put(`/admin/portfolio/${bridgeId}`, payload);
      else await api.post('/admin/portfolio', payload);
      toast.success('Our Belief saved!');
    } catch { toast.error('Failed to save'); }
    finally { setSavingBridge(false); }
  };

  const saveExplanation = async () => {
    const errors = { title1: !explanationForm.title1.trim() };
    setExplanationErrors(errors);
    if (errors.title1) { toast.error('Title is required'); return; }
    setSavingExplanation(true);
    try {
      const payload = { title: 'Explanation Portfolio', slug: 'explanation-portfolio', description: JSON.stringify(explanationForm), isActive: true };
      if (explanationId) await api.put(`/admin/portfolio/${explanationId}`, payload);
      else await api.post('/admin/portfolio', payload);
      toast.success('Explanation saved!');
    } catch { toast.error('Failed to save'); }
    finally { setSavingExplanation(false); }
  };

  const handleDelete = async () => {
    if (!deleteModal.id) return;
    setDeleteModal(p => ({ ...p, loading: true }));
    try {
      await portfolioService.delete(deleteModal.id);
      toast.success('Portfolio berhasil dihapus');
      setDeleteModal({ open: false, id: null, loading: false });
      fetchPortfolios();
    } catch {
      toast.error('Gagal menghapus portfolio');
      setDeleteModal(p => ({ ...p, loading: false }));
    }
  };

  const PORTFOLIO_SYSTEM_SLUGS = ['hero-portfolio', 'explanation-portfolio', 'bridge-portfolio'];
  const filtered = portfolios.filter(p => {
    if (PORTFOLIO_SYSTEM_SLUGS.includes(p.slug)) return false;
    const matchSearch   = p.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus   = filter === 'all' ? true : filter === 'published' ? !!p.isActive : !p.isActive;
    const matchCategory = category === 'All Categories' ? true : p.category === category;
    return matchSearch && matchStatus && matchCategory;
  });

  const statusOptions: { label: string; value: FilterType }[] = [
    { label: 'All Status',  value: 'all' },
    { label: 'Published',   value: 'published' },
    { label: 'Draft',       value: 'draft' },
  ];

  return (
  <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-4xl font-display font-bold text-dark">Portfolio</h1>
        <p className="text-gray-400 text-sm mt-1 italic">Manage Winosa portfolio & page content</p>
      </div>

      {/* Tab bar */}
      <div className="overflow-x-auto pb-1 -mb-1">
        <div className="inline-flex items-center gap-1 bg-white border border-gray-200 rounded-full px-2 py-1.5 shadow-sm min-w-max">
          {([
            { id: 'portfolio',    label: 'Portfolio',     icon: Image    },
            { id: 'page-content', label: 'Page Content',  icon: FileEdit },
          ] as const).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                tab === id ? 'bg-dark text-white shadow-sm' : 'text-gray-500 hover:text-dark'
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Portfolio Tab */}
      {tab === 'portfolio' && (
        <>
          {/* Add Portfolio — mobile: baris 1 kiri */}
          <button
            onClick={() => navigate('/portfolio/add')}
            className="flex sm:hidden items-center gap-2 bg-primary hover:bg-primary-dark text-dark font-semibold px-6 py-3 rounded-full transition-all hover:-translate-y-0.5 hover:shadow-md text-sm w-fit"
          >
            <Plus size={16} />
            Add Portfolio
          </button>

          {/* Search + Filter + Add (desktop) */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search portfolio..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-full text-sm outline-none focus:border-primary bg-white transition-colors"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <CustomDropdown
                value={filter}
                onChange={v => setFilter(v as FilterType)}
                options={statusOptions}
              />
              <CustomDropdown
                value={category}
                onChange={setCategory}
                options={CATEGORY_FILTER_OPTIONS.map(c => ({ label: c, value: c }))}
              />
            </div>
            {/* Add Portfolio — desktop: ujung kanan */}
            <button
              onClick={() => navigate('/portfolio/add')}
              className="hidden sm:flex items-center gap-2 bg-primary hover:bg-primary-dark text-dark font-semibold px-6 py-3 rounded-full transition-all hover:-translate-y-0.5 hover:shadow-md text-sm w-fit ml-auto"
            >
              <Plus size={16} />
              Add Portfolio
            </button>
          </div>

          {/* Card Grid */}
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-sm">No portfolio found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(portfolio => (
                <div
                  key={portfolio._id}
                  className="bg-white rounded-3xl border-2 border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5 flex flex-col"
                >
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
                    <span className={`absolute top-3 right-3 text-xs px-3 py-1 rounded-full font-medium border ${
                      portfolio.isActive
                        ? 'bg-green-100 text-green-600 border-green-200'
                        : 'bg-gray-100 text-gray-500 border-gray-200'
                    }`}>
                      {portfolio.isActive ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <div className="border-t-2 border-gray-100 p-5 flex flex-col flex-1">
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
                    <div className="flex gap-2 justify-end flex-shrink-0">
                      <button
                        onClick={() => navigate(`/portfolio/${portfolio._id}`)}
                        className="w-9 h-9 border border-gray-200 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                        title="View"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteModal({ open: true, id: portfolio._id, loading: false })}
                        className="w-9 h-9 border border-gray-200 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-50 hover:border-red-200 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                      <button
                        onClick={() => navigate(`/portfolio/edit/${portfolio._id}`)}
                        className="w-9 h-9 border border-gray-200 rounded-xl flex items-center justify-center text-primary hover:bg-primary/10 hover:border-primary/30 transition-colors"
                        title="Edit"
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
            title="Delete Portfolio"
            message="Are you sure you want to delete this portfolio? This action cannot be undone."
            onConfirm={handleDelete}
            onCancel={() => setDeleteModal({ open: false, id: null, loading: false })}
            loading={deleteModal.loading}
          />
        </>
      )}
      {tab === 'page-content' && (
        <div className="space-y-4">
          {fetchingContent ? (
            <div className="space-y-4 animate-pulse">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 rounded-2xl" />
              ))}
            </div>
          ) : (
            <>
              {/* ── HERO SECTION ── */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenSection(openSection === 'hero' ? null : 'hero')}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <div>
                    <p className="font-semibold text-dark text-sm">Page Hero</p>
                    <p className="text-xs text-gray-400 mt-0.5">Title · Subtitle</p>
                  </div>
                  <ChevronDown size={15} className={`text-gray-400 transition-transform ${openSection === 'hero' ? 'rotate-180' : ''}`} />
                </button>
                {openSection === 'hero' && (
                  <div className="px-6 pb-6 space-y-4 border-t border-gray-100 pt-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                        Title <span className="text-red-400">*</span>
                      </label>
                      <input
                        value={heroForm.title}
                        onChange={e => { if (e.target.value.length <= 50) { setHeroForm(p => ({ ...p, title: e.target.value })); setHeroErrors(p => ({ ...p, title: false })); } }}
                        placeholder="e.g. Our Portfolio"
                        maxLength={50}
                        className={`w-full border rounded-2xl px-4 py-3 text-sm outline-none bg-gray-50 transition-colors ${heroErrors.title ? 'border-red-400 bg-red-50/30' : 'border-gray-200 focus:border-dark'}`}
                      />
                      <div className="flex items-center justify-between mt-1">
                        {heroErrors.title && <p className="text-xs text-red-400 font-medium">Title is required</p>}
                        <p className={`text-xs ml-auto ${heroForm.title.length >= 50 ? 'text-red-400 font-medium' : 'text-gray-400'}`}>{heroForm.title.length}/50</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                        Subtitle <span className="text-red-400">*</span>
                      </label>
                      <input
                        value={heroForm.subtitle}
                        onChange={e => { if (e.target.value.length <= 80) { setHeroForm(p => ({ ...p, subtitle: e.target.value })); setHeroErrors(p => ({ ...p, subtitle: false })); } }}
                        placeholder="e.g. Explore our work..."
                        maxLength={80}
                        className={`w-full border rounded-2xl px-4 py-3 text-sm outline-none bg-gray-50 transition-colors ${heroErrors.subtitle ? 'border-red-400 bg-red-50/30' : 'border-gray-200 focus:border-dark'}`}
                      />
                      <div className="flex items-center justify-between mt-1">
                        {heroErrors.subtitle && <p className="text-xs text-red-400 font-medium">Subtitle is required</p>}
                        <p className={`text-xs ml-auto ${heroForm.subtitle.length >= 80 ? 'text-red-400 font-medium' : 'text-gray-400'}`}>{heroForm.subtitle.length}/80</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={saveHero}
                      disabled={savingHero}
                      className="flex items-center gap-2 px-6 py-2.5 bg-dark text-white rounded-2xl text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                      {savingHero ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : <><Save size={14} /> Save Hero</>}
                    </button>
                  </div>
                )}
              </div>

              {/* ── OUR BELIEF (BRIDGE) ── */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenSection(openSection === 'bridge' ? null : 'bridge')}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <div>
                    <p className="font-semibold text-dark text-sm">Our Belief</p>
                    <p className="text-xs text-gray-400 mt-0.5">Quote · 3 Stats</p>
                  </div>
                  <ChevronDown size={15} className={`text-gray-400 transition-transform ${openSection === 'bridge' ? 'rotate-180' : ''}`} />
                </button>
                {openSection === 'bridge' && (
                  <div className="px-6 pb-6 space-y-4 border-t border-gray-100 pt-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                        Quote <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        value={bridgeForm.quote}
                        onChange={e => { if (e.target.value.length <= 150) { setBridgeForm(p => ({ ...p, quote: e.target.value })); setBridgeErrors(p => ({ ...p, quote: false })); } }}
                        placeholder="e.g. Great design is not just what it looks like..."
                        rows={3}
                        maxLength={150}
                        className={`w-full border rounded-2xl px-4 py-3 text-sm outline-none bg-gray-50 resize-none transition-colors ${bridgeErrors.quote ? 'border-red-400 bg-red-50/30' : 'border-gray-200 focus:border-dark'}`}
                      />
                      <div className="flex items-center justify-between mt-1">
                        {bridgeErrors.quote && <p className="text-xs text-red-400 font-medium">Quote is required</p>}
                        <p className={`text-xs ml-auto ${bridgeForm.quote.length >= 150 ? 'text-red-400 font-medium' : 'text-gray-400'}`}>{bridgeForm.quote.length}/150</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Stats (3 kartu)</p>
                      {bridgeForm.stats.map((stat, i) => (
                        <div key={i} className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex gap-3 items-start">
                          <div className="w-7 h-7 rounded-full bg-dark text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">{i + 1}</div>
                          <div className="flex-1 grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Value</label>
                              <input
                                value={stat.value}
                                onChange={e => { if (e.target.value.length <= 10) setBridgeForm(p => ({ ...p, stats: p.stats.map((s, idx) => idx === i ? { ...s, value: e.target.value } : s) })); }}
                                placeholder="e.g. 24+"
                                maxLength={10}
                                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-dark bg-white transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Label</label>
                              <input
                                value={stat.label}
                                onChange={e => { if (e.target.value.length <= 30) setBridgeForm(p => ({ ...p, stats: p.stats.map((s, idx) => idx === i ? { ...s, label: e.target.value } : s) })); }}
                                placeholder="e.g. Team Members"
                                maxLength={30}
                                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-dark bg-white transition-colors"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={saveBridge}
                      disabled={savingBridge}
                      className="flex items-center gap-2 px-6 py-2.5 bg-dark text-white rounded-2xl text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                      {savingBridge ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : <><Save size={14} /> Save Our Belief</>}
                    </button>
                  </div>
                )}
              </div>

              {/* ── EXPLANATION ── */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenSection(openSection === 'explanation' ? null : 'explanation')}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <div>
                    <p className="font-semibold text-dark text-sm">Explanation</p>
                    <p className="text-xs text-gray-400 mt-0.5">Badge · Title · Description</p>
                  </div>
                  <ChevronDown size={15} className={`text-gray-400 transition-transform ${openSection === 'explanation' ? 'rotate-180' : ''}`} />
                </button>
                {openSection === 'explanation' && (
                  <div className="px-6 pb-6 space-y-4 border-t border-gray-100 pt-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Badge Text</label>
                      <input
                        value={explanationForm.badge}
                        onChange={e => { if (e.target.value.length <= 30) setExplanationForm(p => ({ ...p, badge: e.target.value })); }}
                        placeholder="e.g. Our Work"
                        maxLength={30}
                        className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-dark bg-gray-50 transition-colors"
                      />
                      <div className="flex justify-end mt-1">
                        <p className={`text-xs ${explanationForm.badge.length >= 30 ? 'text-red-400 font-medium' : 'text-gray-400'}`}>{explanationForm.badge.length}/30</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                        Title Part 1 <span className="text-red-400">*</span>
                      </label>
                      <input
                        value={explanationForm.title1}
                        onChange={e => { if (e.target.value.length <= 50) { setExplanationForm(p => ({ ...p, title1: e.target.value })); setExplanationErrors(p => ({ ...p, title1: false })); } }}
                        placeholder="e.g. Projects that"
                        maxLength={50}
                        className={`w-full border rounded-2xl px-4 py-3 text-sm outline-none bg-gray-50 transition-colors ${explanationErrors.title1 ? 'border-red-400 bg-red-50/30' : 'border-gray-200 focus:border-dark'}`}
                      />
                      <div className="flex items-center justify-between mt-1">
                        {explanationErrors.title1 && <p className="text-xs text-red-400 font-medium">Title is required</p>}
                        <p className={`text-xs ml-auto ${explanationForm.title1.length >= 50 ? 'text-red-400 font-medium' : 'text-gray-400'}`}>{explanationForm.title1.length}/50</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Title Part 2</label>
                      <input
                        value={explanationForm.title2}
                        onChange={e => { if (e.target.value.length <= 50) setExplanationForm(p => ({ ...p, title2: e.target.value })); }}
                        placeholder="e.g. speak for themselves"
                        maxLength={50}
                        className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-dark bg-gray-50 transition-colors"
                      />
                      <div className="flex justify-end mt-1">
                        <p className={`text-xs ${explanationForm.title2.length >= 50 ? 'text-red-400 font-medium' : 'text-gray-400'}`}>{explanationForm.title2.length}/50</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Description</label>
                      <textarea
                        value={explanationForm.description}
                        onChange={e => { if (e.target.value.length <= 200) setExplanationForm(p => ({ ...p, description: e.target.value })); }}
                        placeholder="e.g. We build digital products..."
                        rows={3}
                        maxLength={200}
                        className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-dark bg-gray-50 resize-none transition-colors"
                      />
                      <div className="flex justify-end mt-1">
                        <p className={`text-xs ${explanationForm.description.length >= 200 ? 'text-red-400 font-medium' : 'text-gray-400'}`}>{explanationForm.description.length}/200</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={saveExplanation}
                      disabled={savingExplanation}
                      className="flex items-center gap-2 px-6 py-2.5 bg-dark text-white rounded-2xl text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                      {savingExplanation ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : <><Save size={14} /> Save Explanation</>}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PortfolioPage;