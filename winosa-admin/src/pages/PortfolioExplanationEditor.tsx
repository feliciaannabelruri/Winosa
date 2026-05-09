import React, { useEffect, useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

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

const inputCls =
  'w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-dark bg-gray-50 transition-colors';

const PortfolioExplanationEditor: React.FC = () => {
  const { t } = useTranslation();

  const [form, setForm] = useState<ExplanationData>(DEFAULT);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [docId, setDocId] = useState<string | null>(null);

  useEffect(() => {
    api.get('/admin/portfolio')
      .then(res => {
        const found = (res.data?.data || []).find(
          (s: any) => s.slug === 'explanation-portfolio'
        );

        if (found) {
          setDocId(found._id);

          try {
            const parsed = JSON.parse(found.description);
            setForm({ ...DEFAULT, ...parsed });
          } catch {}
        }
      })
      .catch(() => toast.error(t('portfolio_explanation_load_error')))
      .finally(() => setFetching(false));
  }, [t]);

  const set =
    (key: keyof ExplanationData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [key]: e.target.value }));

  const handleSave = async () => {
    if (!form.title1.trim()) {
      toast.error(t('portfolio_explanation_title_required'));
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title: 'Explanation Portfolio',
        slug: 'explanation-portfolio',
        description: JSON.stringify(form),
        isActive: true,
      };

      if (docId) {
        await api.put(`/admin/portfolio/${docId}`, payload);
      } else {
        await api.post('/admin/portfolio', payload);
      }

      toast.success(t('portfolio_explanation_saved'));
    } catch {
      toast.error(t('portfolio_explanation_save_error'));
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return (
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
            {t('portfolio_explanation_badge')}
          </label>

          <input
            value={form.badge}
            onChange={set('badge')}
            placeholder={t('portfolio_explanation_badge_placeholder')}
            className={inputCls}
          />

          <p className="text-xs text-gray-400 mt-1">
            {t('portfolio_explanation_badge_desc')}
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            {t('portfolio_explanation_title1')}
            <span className="text-red-400"> *</span>
          </label>

          <input
            value={form.title1}
            onChange={set('title1')}
            placeholder={t('portfolio_explanation_title1_placeholder')}
            className={inputCls}
          />

          <p className="text-xs text-gray-400 mt-1">
            {t('portfolio_explanation_title1_desc')}
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            {t('portfolio_explanation_title2')}
          </label>

          <input
            value={form.title2}
            onChange={set('title2')}
            placeholder={t('portfolio_explanation_title2_placeholder')}
            className={inputCls}
          />

          <p className="text-xs text-gray-400 mt-1">
            {t('portfolio_explanation_title2_desc')}
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            {t('description')}
          </label>

          <textarea
            value={form.description}
            onChange={set('description')}
            placeholder={t('portfolio_explanation_description_placeholder')}
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
        {loading ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            {t('saving')}
          </>
        ) : (
          <>
            <Save size={14} />
            {t('save_changes')}
          </>
        )}
      </button>
    </div>
  );
};

export default PortfolioExplanationEditor;