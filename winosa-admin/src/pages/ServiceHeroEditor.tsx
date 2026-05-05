import React, { useEffect, useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

interface HeroData {
  title: string;
  subtitle: string;
  description: string;
}

const DEFAULT: HeroData = {
  title: 'Our Services',
  subtitle: 'Everything you need to grow digitally.',
  description: '',
};

const inputCls = 'w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-dark bg-gray-50 transition-colors';

const ServiceHeroEditor: React.FC = () => {
  const [form, setForm]         = useState<HeroData>(DEFAULT);
  const [loading, setLoading]   = useState(false);
  const [fetching, setFetching] = useState(true);
  const [heroId, setHeroId]     = useState<string | null>(null);

  useEffect(() => {
    api.get('/admin/services')
      .then(res => {
        const found = (res.data?.data || []).find((s: any) => s.slug === 'hero-services');
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
        title: 'Hero Services',
        slug: 'hero-services',
        description: JSON.stringify(form),
        isActive: true,
      };
      if (heroId) await api.put(`/admin/services/${heroId}`, payload);
      else        await api.post('/admin/services', payload);
      toast.success('Hero saved!');
    } catch {
      toast.error('Failed to save');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="space-y-4 animate-pulse">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-14 bg-gray-100 rounded-2xl" />
      ))}
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-5">

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Title <span className="text-red-400">*</span>
          </label>
          <input
            value={form.title}
            onChange={set('title')}
            placeholder="e.g. Our Services"
            className={inputCls}
          />
          <p className="text-xs text-gray-400 mt-1">Judul besar di hero section</p>
        </div>

        {/* Subtitle */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Subtitle
          </label>
          <input
            value={form.subtitle}
            onChange={set('subtitle')}
            placeholder="e.g. Everything you need to grow digitally."
            className={inputCls}
          />
          <p className="text-xs text-gray-400 mt-1">Teks di bawah judul</p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Description
            <span className="ml-2 text-gray-400 font-normal normal-case">(optional)</span>
          </label>
          <textarea
            value={form.description}
            onChange={set('description')}
            placeholder="Additional description below subtitle..."
            rows={3}
            className={`${inputCls} resize-none`}
          />
          <p className="text-xs text-gray-400 mt-1">Teks tambahan, boleh dikosongkan</p>
        </div>

        {/* Info note */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3">
          <p className="text-xs text-gray-500">
            ℹ️ Tombol <strong>"Get in Touch"</strong> tidak bisa diedit — selalu mengarah ke halaman Contact.
          </p>
        </div>

      </div>

      {/* Save */}
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

export default ServiceHeroEditor;