import React, { useEffect, useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

interface HeroData {
  title: string;
  subtitle: string;
}

const DEFAULT: HeroData = {
  title: 'Our Portfolio',
  subtitle: 'Explore our work and see what we can build for you.',
};

const inputCls = 'w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-dark bg-gray-50 transition-colors';

const PortfolioHeroEditor: React.FC = () => {
  const [form, setForm]         = useState<HeroData>(DEFAULT);
  const [loading, setLoading]   = useState(false);
  const [fetching, setFetching] = useState(true);
  const [heroId, setHeroId]     = useState<string | null>(null);

  useEffect(() => {
    api.get('/admin/portfolio')
      .then(res => {
        const found = (res.data?.data || []).find((s: any) => s.slug === 'hero-portfolio');
        if (found) {
          setHeroId(found._id);
          try {
            const parsed = JSON.parse(found.description);
            setForm({ ...DEFAULT, ...parsed });
          } catch {}
        }
      })
      .catch(() => toast.error('Failed to load hero data'))
      .finally(() => setFetching(false));
  }, []);

  const set = (key: keyof HeroData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [key]: e.target.value }));

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    setLoading(true);
    try {
      const payload = {
        title: 'Hero Portfolio',
        slug: 'hero-portfolio',
        description: JSON.stringify(form),
        isActive: true,
      };
      if (heroId) await api.put(`/admin/portfolio/${heroId}`, payload);
      else        await api.post('/admin/portfolio', payload);
      toast.success('Hero saved!');
    } catch {
      toast.error('Failed to save');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="space-y-4 animate-pulse">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="h-14 bg-gray-100 rounded-2xl" />
      ))}
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-5">

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Title <span className="text-red-400">*</span>
          </label>
          <input
            value={form.title}
            onChange={set('title')}
            placeholder="e.g. Our Portfolio"
            className={inputCls}
          />
          <p className="text-xs text-gray-400 mt-1">Judul besar di hero section</p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Subtitle
          </label>
          <input
            value={form.subtitle}
            onChange={set('subtitle')}
            placeholder="e.g. Explore our work..."
            className={inputCls}
          />
          <p className="text-xs text-gray-400 mt-1">Teks di bawah judul</p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3">
          <p className="text-xs text-gray-500">
            ℹ️ Tombol <strong>"Explore Projects"</strong> tidak bisa diedit — scroll ke section portfolio.
          </p>
        </div>

      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3 bg-dark text-white rounded-2xl text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
      >
        {loading
          ? <><Loader2 size={14} className="animate-spin" /> Saving...</>
          : <><Save size={14} /> Save Changes</>
        }
      </button>
    </div>
  );
};

export default PortfolioHeroEditor;