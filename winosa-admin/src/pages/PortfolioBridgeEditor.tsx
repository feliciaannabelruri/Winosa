import React, { useEffect, useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

interface StatItem {
  value: string;
  label: string;
}

interface BridgeData {
  quote: string;
  stats: StatItem[];
}

const DEFAULT: BridgeData = {
  quote: 'Great design is not just what it looks like — it\'s how it works.',
  stats: [
    { value: '24+', label: 'Team Members' },
    { value: '15+', label: 'Projects Done' },
    { value: '100%', label: 'Quality Guaranteed' },
  ],
};

const inputCls = 'w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-dark bg-gray-50 transition-colors';

const PortfolioBridgeEditor: React.FC = () => {
  const [form, setForm]         = useState<BridgeData>(DEFAULT);
  const [loading, setLoading]   = useState(false);
  const [fetching, setFetching] = useState(true);
  const [docId, setDocId]       = useState<string | null>(null);

  useEffect(() => {
    api.get('/admin/portfolio')
      .then(res => {
        const found = (res.data?.data || []).find((s: any) => s.slug === 'bridge-portfolio');
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

  const setQuote = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, quote: e.target.value }));

  const setStat = (i: number, key: keyof StatItem, val: string) =>
    setForm(prev => ({
      ...prev,
      stats: prev.stats.map((s, idx) => idx === i ? { ...s, [key]: val } : s),
    }));

  const handleSave = async () => {
    if (!form.quote.trim()) { toast.error('Quote is required'); return; }
    const emptyStats = form.stats.some(s => !s.value.trim() || !s.label.trim());
    if (emptyStats) { toast.error('All stat fields are required'); return; }

    setLoading(true);
    try {
      const payload = {
        title: 'Bridge Portfolio',
        slug: 'bridge-portfolio',
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
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-14 bg-gray-100 rounded-2xl" />
      ))}
    </div>
  );

  return (
    <div className="space-y-5">

      {/* Quote */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div>
          <h2 className="text-base font-bold text-dark mb-0.5">Our Belief</h2>
          <p className="text-xs text-gray-400 mb-4">Kutipan/quote di bagian kiri section</p>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Quote <span className="text-red-400">*</span>
          </label>
          <textarea
            value={form.quote}
            onChange={setQuote}
            placeholder="e.g. Great design is not just what it looks like..."
            rows={3}
            className={`${inputCls} resize-none`}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div>
          <h2 className="text-base font-bold text-dark mb-0.5">Stats</h2>
          <p className="text-xs text-gray-400 mb-4">3 kartu statistik di bagian kanan section</p>
        </div>

        <div className="space-y-3">
          {form.stats.map((stat, i) => (
            <div
              key={i}
              className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex gap-3 items-start"
            >
              <div className="w-7 h-7 rounded-full bg-dark text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">
                {i + 1}
              </div>
              <div className="flex-1 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Value
                  </label>
                  <input
                    value={stat.value}
                    onChange={e => setStat(i, 'value', e.target.value)}
                    placeholder="e.g. 24+"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Label
                  </label>
                  <input
                    value={stat.label}
                    onChange={e => setStat(i, 'label', e.target.value)}
                    placeholder="e.g. Team Members"
                    className={inputCls}
                  />
                </div>
              </div>
            </div>
          ))}
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

export default PortfolioBridgeEditor;