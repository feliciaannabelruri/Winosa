import React, { useEffect, useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

interface ExplanationData {
  badge: string;
  title1: string;
  title2: string;
  description: string;
}

const DEFAULT: ExplanationData = {
  badge: 'Our Work',
  title1: 'Projects that',
  title2: 'speak for themselves',
  description: 'We build digital products that solve real problems and create lasting impact.',
};

const inputCls = 'w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-dark bg-gray-50 transition-colors';

const PortfolioExplanationEditor: React.FC = () => {
  const [form, setForm]         = useState<ExplanationData>(DEFAULT);
  const [loading, setLoading]   = useState(false);
  const [fetching, setFetching] = useState(true);
  const [docId, setDocId]       = useState<string | null>(null);

  useEffect(() => {
    api.get('/admin/portfolio')
      .then(res => {
        const found = (res.data?.data || []).find((s: any) => s.slug === 'explanation-portfolio');
        if (found) {
          setDocId(found._id);
          try {
            const parsed = JSON.parse(found.description);
            setForm({ ...DEFAULT, ...parsed });
          } catch {}
        }
      })
      .catch(() => toast.error('Failed to load data'))
      .finally(() => setFetching(false));
  }, []);

  const set = (key: keyof ExplanationData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [key]: e.target.value }));

  const handleSave = async () => {
    if (!form.title1.trim()) { toast.error('Title is required'); return; }
    setLoading(true);
    try {
      const payload = {
        title: 'Explanation Portfolio',
        slug: 'explanation-portfolio',
        description: JSON.stringify(form),
        isActive: true,
      };
      if (docId) await api.put(`/admin/portfolio/${docId}`, payload);
      else       await api.post('/admin/portfolio', payload);
      toast.success('Saved!');
    } catch {
      toast.error('Failed to save');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="space-y-4 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-14 bg-gray-100 rounded-2xl" />
      ))}
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-5">

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Badge Text
          </label>
          <input
            value={form.badge}
            onChange={set('badge')}
            placeholder="e.g. Our Work"
            className={inputCls}
          />
          <p className="text-xs text-gray-400 mt-1">Label kecil di atas judul</p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Title Part 1 <span className="text-red-400">*</span>
          </label>
          <input
            value={form.title1}
            onChange={set('title1')}
            placeholder="e.g. Projects that"
            className={inputCls}
          />
          <p className="text-xs text-gray-400 mt-1">Bagian pertama judul (teks biasa)</p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Title Part 2
          </label>
          <input
            value={form.title2}
            onChange={set('title2')}
            placeholder="e.g. speak for themselves"
            className={inputCls}
          />
          <p className="text-xs text-gray-400 mt-1">Bagian kedua judul (di-highlight / warna berbeda)</p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={set('description')}
            placeholder="e.g. We build digital products..."
            rows={3}
            className={`${inputCls} resize-none`}
          />
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

export default PortfolioExplanationEditor;