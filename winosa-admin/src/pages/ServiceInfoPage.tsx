import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Plus, X, Save, Loader2,
  GitBranch, Star, AlertCircle,
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

interface ProcessStep { title: string; desc: string; }
interface Reason { title: string; desc: string; icon: string; }

const ICON_OPTIONS = ['shield', 'chart', 'cursor', 'thumb'];

const DEFAULT_PROCESS: ProcessStep[] = [
  { title: 'Discover', desc: 'We analyze your business needs and goals.' },
  { title: 'Design',   desc: 'We create wireframes and design mockups.' },
  { title: 'Build',    desc: 'We develop your solution with clean code.' },
  { title: 'Test',     desc: 'We test thoroughly before launch.' },
  { title: 'Deploy',   desc: 'We launch and monitor your product.' },
];

const DEFAULT_REASONS: Reason[] = [
  { title: 'Trusted',          desc: 'We deliver quality you can rely on.',          icon: 'shield' },
  { title: 'Scalable',         desc: 'Solutions that grow with your business.',       icon: 'chart'  },
  { title: 'Business Focused', desc: 'We align tech with your business goals.',       icon: 'cursor' },
  { title: 'Partnership',      desc: 'We are your long-term digital partner.',        icon: 'thumb'  },
];

const inputCls = 'w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-dark bg-gray-50 transition-colors';

 interface Props {
  embedded?: boolean;
  activeSection?: 'process' | 'reasons';
}

const ServiceInfoPage: React.FC<Props> = ({ embedded = false, activeSection = 'process' }) => {
  const navigate  = useNavigate();

  const [process,  setProcess]  = useState<ProcessStep[]>(DEFAULT_PROCESS);
  const [reasons,  setReasons]  = useState<Reason[]>(DEFAULT_REASONS);
  const [loading,  setLoading]  = useState(false);
  const [fetching, setFetching] = useState(true);
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
          } catch { /* use defaults */ }
        }
      } catch {
        toast.error('Failed to load data');
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, []);

  // ── Process handlers ──────────────────────────────────
  const updateProcess = (i: number, key: keyof ProcessStep, val: string) =>
    setProcess(prev => prev.map((p, idx) => idx === i ? { ...p, [key]: val } : p));
  const addProcess    = () => setProcess(prev => [...prev, { title: '', desc: '' }]);
  const removeProcess = (i: number) => setProcess(prev => prev.filter((_, idx) => idx !== i));

  // ── Reason handlers ───────────────────────────────────
  const updateReason = (i: number, key: keyof Reason, val: string) =>
    setReasons(prev => prev.map((r, idx) => idx === i ? { ...r, [key]: val } : r));
  const addReason    = () => setReasons(prev => [...prev, { title: '', desc: '', icon: 'shield' }]);
  const removeReason = (i: number) => setReasons(prev => prev.filter((_, idx) => idx !== i));

  // ── Save ──────────────────────────────────────────────
  const handleSave = async () => {
    const emptyProcess = process.some(p => !p.title.trim() || !p.desc.trim());
    const emptyReason  = reasons.some(r => !r.title.trim() || !r.desc.trim());
    if (emptyProcess || emptyReason) { toast.error('All fields are required'); return; }

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
      toast.success('Changes saved!');
    } catch {
      toast.error('Failed to save');
    } finally {
      setLoading(false);
    }
  };

  // ── Skeleton ──────────────────────────────────────────
  if (fetching) return (
    <div className="space-y-5 animate-pulse">
      <div className="w-48 h-8 bg-gray-200 rounded-full" />
      {[...Array(3)].map((_, i) => (
        <div key={i} className="w-full h-20 bg-gray-100 rounded-2xl" />
      ))}
    </div>
  );

  // ── Empty state helper ────────────────────────────────
  const EmptyState = ({ label, onAdd }: { label: string; onAdd: () => void }) => (
    <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-12 text-center">
      <AlertCircle size={32} className="text-gray-200 mx-auto mb-3" />
      <p className="text-gray-400 text-sm mb-4">No {label} added yet</p>
      <button
        onClick={onAdd}
        className="inline-flex items-center gap-2 bg-dark text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-gray-800 transition-colors"
      >
        <Plus size={14} /> Add {label}
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
            Back to Services
          </button>
          <h1 className="text-4xl font-display font-bold text-dark">Our Process & Why Choose Us</h1>
          <p className="text-gray-400 text-sm mt-1 italic">Manage process steps and reasons to choose Winosa</p>
        </div>
      )}


      {/* ── OUR PROCESS TAB ── */}
      {activeSection === 'process' && (
        <div className="space-y-4">
          {process.length === 0
            ? <EmptyState label="step" onAdd={addProcess} />
            : (
              <div className="space-y-3">
                {process.map((step, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-3xl border-2 border-gray-100 shadow-sm p-5 flex gap-4 items-start hover:border-gray-200 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-dark text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">
                      {i + 1}
                    </div>
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        placeholder="Step title (e.g. Discover)"
                        value={step.title}
                        onChange={e => updateProcess(i, 'title', e.target.value)}
                        className={inputCls}
                      />
                      <textarea
                        placeholder="Step description..."
                        value={step.desc}
                        onChange={e => updateProcess(i, 'desc', e.target.value)}
                        rows={2}
                        className={`${inputCls} resize-none`}
                      />
                    </div>
                    {process.length > 1 && (
                      <button
                        onClick={() => removeProcess(i)}
                        className="text-red-400 hover:text-red-500 transition-colors mt-1 flex-shrink-0"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )
          }
          {process.length > 0 && (
            <button
              onClick={addProcess}
              className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 rounded-2xl text-sm font-semibold text-gray-400 hover:border-gray-400 hover:text-dark transition-colors"
            >
              <Plus size={14} /> Add Step
            </button>
          )}
        </div>
      )}

      {/* ── WHY CHOOSE US TAB ── */}
      {activeSection === 'reasons' && (
        <div className="space-y-4">
          {reasons.length === 0
            ? <EmptyState label="reason" onAdd={addReason} />
            : (
              <div className="space-y-3">
                {reasons.map((reason, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-3xl border-2 border-gray-100 shadow-sm p-5 flex gap-4 items-start hover:border-gray-200 transition-colors"
                  >
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        placeholder="Reason title (e.g. Trusted)"
                        value={reason.title}
                        onChange={e => updateReason(i, 'title', e.target.value)}
                        className={inputCls}
                      />
                      <textarea
                        placeholder="Reason description..."
                        value={reason.desc}
                        onChange={e => updateReason(i, 'desc', e.target.value)}
                        rows={2}
                        className={`${inputCls} resize-none`}
                      />
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Icon</label>
                        <select
                          value={reason.icon}
                          onChange={e => updateReason(i, 'icon', e.target.value)}
                          className={inputCls}
                        >
                          {ICON_OPTIONS.map(icon => (
                            <option key={icon} value={icon}>{icon}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {reasons.length > 1 && (
                      <button
                        onClick={() => removeReason(i)}
                        className="text-red-400 hover:text-red-500 transition-colors mt-1 flex-shrink-0"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )
          }
          {reasons.length > 0 && (
            <button
              onClick={addReason}
              className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 rounded-2xl text-sm font-semibold text-gray-400 hover:border-gray-400 hover:text-dark transition-colors"
            >
              <Plus size={14} /> Add Reason
            </button>
          )}
        </div>
      )}
      
      {/* Save / Cancel */}
      <div className="flex gap-3 pb-10">
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-dark text-white rounded-2xl text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {loading
            ? <><Loader2 size={14} className="animate-spin" /> Saving...</>
            : <><Save size={14} /> Save Changes</>
          }
        </button>
      </div>

    </div>
  );
};

export default ServiceInfoPage;