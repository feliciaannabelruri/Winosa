import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Plus, X, Save, Loader2,
  AlertCircle,
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import IconPicker from './service-form/shared/IconPicker';
import { useTranslation } from 'react-i18next'; // ← TAMBAH

interface ProcessStep { title: string; desc: string; }
interface Reason { title: string; desc: string; icon: string; }

const inputCls = 'w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-dark bg-gray-50 transition-colors';

interface Props {
  embedded?: boolean;
  activeSection?: 'process' | 'reasons';
}

const ServiceInfoPage: React.FC<Props> = ({ embedded = false, activeSection = 'process' }) => {
  const navigate   = useNavigate();
  const { t }      = useTranslation(); // ← TAMBAH

  const [process, setProcess]     = useState<ProcessStep[]>([]);
  const [reasons, setReasons]     = useState<Reason[]>([]);
  const [loading, setLoading]     = useState(false);
  const [fetching, setFetching]   = useState(true);
  const [serviceId, setServiceId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res      = await api.get('/admin/services');
        const services = res.data?.data || [];
        const info     = services.find((s: any) => s.slug === 'info-section');
        if (info) {
          setServiceId(info._id);
          try {
            const parsed = JSON.parse(info.description);
            if (Array.isArray(parsed.process) && parsed.process.length > 0) setProcess(parsed.process);
            if (Array.isArray(parsed.reasons) && parsed.reasons.length > 0) setReasons(parsed.reasons);
          } catch {}
        }
      } catch {
        toast.error(t('service_info_load_error')); // ← GANTI
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, []);

  const updateProcess = (i: number, key: keyof ProcessStep, val: string) =>
    setProcess(prev => prev.map((p, idx) => idx === i ? { ...p, [key]: val } : p));
  const addProcess = () => { if (process.length >= 5) return; setProcess(prev => [...prev, { title: '', desc: '' }]); };
  const removeProcess = (i: number) => setProcess(prev => prev.filter((_, idx) => idx !== i));

  const updateReason = (i: number, key: keyof Reason, val: string) =>
    setReasons(prev => prev.map((r, idx) => idx === i ? { ...r, [key]: val } : r));
  const addReason = () => { if (reasons.length >= 4) return; setReasons(prev => [...prev, { title: '', desc: '', icon: 'shield' }]); };
  const removeReason = (i: number) => setReasons(prev => prev.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    const emptyProcess = process.some(p => !p.title.trim() || !p.desc.trim());
    const emptyReason  = reasons.some(r => !r.title.trim() || !r.desc.trim());
    if (emptyProcess || emptyReason) { toast.error(t('validation_required')); return; } // ← GANTI
    setLoading(true);
    try {
      const payload = {
        title: 'Info Section',
        slug:  'info-section',
        description: JSON.stringify({ process, reasons }),
        isActive: true,
      };
      if (serviceId) await api.put(`/admin/services/${serviceId}`, payload);
      else           await api.post('/admin/services', payload);
      toast.success(t('service_info_saved')); // ← GANTI
    } catch {
      toast.error(t('portfolio_hero_save_error')); // ← GANTI (reuse key)
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="space-y-5 animate-pulse">
      <div className="w-48 h-8 bg-gray-200 rounded-full" />
      {[...Array(3)].map((_, i) => (
        <div key={i} className="w-full h-20 bg-gray-100 rounded-2xl" />
      ))}
    </div>
  );

  const EmptyState = ({ label, onAdd }: { label: string; onAdd: () => void }) => (
    <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-12 text-center">
      <AlertCircle size={32} className="text-gray-200 mx-auto mb-3" />
      <p className="text-gray-400 text-sm mb-4">{t('service_info_no_items')} {label}</p> {/* ← GANTI */}
      <button
        onClick={onAdd}
        className="inline-flex items-center gap-2 bg-dark text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-gray-800 transition-colors"
      >
        <Plus size={14} /> {t('add')} {label}
      </button>
    </div>
  );

  return (
    <div className="space-y-6">

      {/* Header (standalone mode only) */}
      {!embedded && (
        <div>
          <button
            onClick={() => navigate('/services')}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-dark transition-colors group mb-4"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
            {t('service_back')} {/* ← GANTI (reuse key) */}
          </button>
          <h1 className="text-4xl font-display font-bold text-dark">{t('service_info_title')}</h1>       {/* ← GANTI */}
          <p className="text-gray-400 text-sm mt-1 italic">{t('service_info_subtitle')}</p>              {/* ← GANTI */}
        </div>
      )}

      {/* OUR PROCESS TAB */}
      {activeSection === 'process' && (
        <div className="space-y-4">
          {process.length === 0
            ? <EmptyState label={t('service_info_step')} onAdd={addProcess} /> // ← GANTI
            : (
              <div className="space-y-3">
                {process.map((step, i) => (
                  <div key={i} className="bg-white rounded-3xl border-2 border-gray-100 shadow-sm p-5 flex gap-4 items-start hover:border-gray-200 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-dark text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">
                      {i + 1}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div>
                        <input
                          type="text"
                          placeholder={t('service_info_step_title_placeholder')} // ← GANTI
                          value={step.title}
                          onChange={e => { if (e.target.value.length <= 30) updateProcess(i, 'title', e.target.value); }}
                          className={inputCls}
                          maxLength={30}
                        />
                        <p className={`text-xs mt-1 text-right ${step.title.length >= 30 ? 'text-red-400 font-medium' : 'text-gray-400'}`}>
                          {step.title.length}/30
                        </p>
                      </div>
                      <div>
                        <textarea
                          placeholder={t('service_info_step_desc_placeholder')} // ← GANTI
                          value={step.desc}
                          onChange={e => { if (e.target.value.length <= 100) updateProcess(i, 'desc', e.target.value); }}
                          rows={2}
                          className={`${inputCls} resize-none`}
                          maxLength={100}
                        />
                        <p className={`text-xs mt-1 text-right ${step.desc.length >= 100 ? 'text-red-400 font-medium' : 'text-gray-400'}`}>
                          {step.desc.length}/100
                        </p>
                      </div>
                    </div>
                    {process.length > 1 && (
                      <button onClick={() => removeProcess(i)} className="text-red-400 hover:text-red-500 transition-colors mt-1 flex-shrink-0">
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )
          }
          {process.length > 0 && (
            <div className="flex items-center justify-between px-1">
              <p className="text-xs text-gray-400">{process.length}/5 {t('service_info_steps')}</p> {/* ← GANTI */}
              {process.length < 5 && (
                <button onClick={addProcess} className="flex items-center gap-2 py-2 px-4 border-2 border-dashed border-gray-200 rounded-2xl text-sm font-semibold text-gray-400 hover:border-gray-400 hover:text-dark transition-colors">
                  <Plus size={14} /> {t('service_info_add_step')} {/* ← GANTI */}
                </button>
              )}
              {process.length >= 5 && (
                <p className="text-xs text-amber-500 font-medium">{t('service_info_max_steps')}</p> // ← GANTI
              )}
            </div>
          )}
        </div>
      )}

      {/* WHY CHOOSE US TAB */}
      {activeSection === 'reasons' && (
        <div className="space-y-4">
          {reasons.length === 0
            ? <EmptyState label={t('service_info_reason')} onAdd={addReason} /> // ← GANTI
            : (
              <div className="space-y-3">
                {reasons.map((reason, i) => (
                  <div key={i} className="bg-white rounded-3xl border-2 border-gray-100 shadow-sm p-5 flex gap-4 items-start hover:border-gray-200 transition-colors">
                    <div className="flex-1 space-y-2">
                      <div>
                        <input
                          type="text"
                          placeholder={t('service_info_reason_title_placeholder')} // ← GANTI
                          value={reason.title}
                          onChange={e => { if (e.target.value.length <= 30) updateReason(i, 'title', e.target.value); }}
                          className={inputCls}
                          maxLength={30}
                        />
                        <p className={`text-xs mt-1 text-right ${reason.title.length >= 30 ? 'text-red-400 font-medium' : 'text-gray-400'}`}>
                          {reason.title.length}/30
                        </p>
                      </div>
                      <div>
                        <textarea
                          placeholder={t('service_info_reason_desc_placeholder')} // ← GANTI
                          value={reason.desc}
                          onChange={e => { if (e.target.value.length <= 100) updateReason(i, 'desc', e.target.value); }}
                          rows={2}
                          className={`${inputCls} resize-none`}
                          maxLength={100}
                        />
                        <p className={`text-xs mt-1 text-right ${reason.desc.length >= 100 ? 'text-red-400 font-medium' : 'text-gray-400'}`}>
                          {reason.desc.length}/100
                        </p>
                      </div>
                      <div>
                        <IconPicker value={reason.icon} onChange={val => updateReason(i, 'icon', val)} />
                      </div>
                    </div>
                    {reasons.length > 1 && (
                      <button onClick={() => removeReason(i)} className="text-red-400 hover:text-red-500 transition-colors mt-1 flex-shrink-0">
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )
          }
          {reasons.length > 0 && (
            <div className="flex items-center justify-between px-1">
              <p className="text-xs text-gray-400">{reasons.length}/4 {t('service_info_reasons')}</p> {/* ← GANTI */}
              {reasons.length < 4 && (
                <button type="button" onClick={addReason} className="flex items-center gap-2 py-2 px-4 border-2 border-dashed border-gray-200 rounded-2xl text-sm font-semibold text-gray-400 hover:border-gray-400 hover:text-dark transition-colors">
                  <Plus size={14} /> {t('service_info_add_reason')} {/* ← GANTI */}
                </button>
              )}
              {reasons.length >= 4 && (
                <p className="text-xs text-amber-500 font-medium">{t('service_info_max_reasons')}</p> // ← GANTI
              )}
            </div>
          )}
        </div>
      )}

      {/* Save */}
      <div className="flex gap-3 pb-10">
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-dark text-white rounded-2xl text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {loading
            ? <><Loader2 size={14} className="animate-spin" /> {t('saving')}</>       // ← GANTI
            : <><Save size={14} /> {t('blog_save_changes')}</>                         // ← GANTI (reuse key)
          }
        </button>
      </div>

    </div>
  );
};

export default ServiceInfoPage;