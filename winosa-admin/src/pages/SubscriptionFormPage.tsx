import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { subscriptionService } from '../services/subscriptionService';
import { Subscription } from '../types';
import toast from 'react-hot-toast';

// Shared UI
const Card: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-5 space-y-4">
    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</p>
    {children}
  </div>
);

const Field: React.FC<{
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}> = ({ label, required, children, hint }) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-semibold text-dark">
      {label}
      {required && <span className="text-red-400 ml-1">*</span>}
    </label>
    {children}
    {hint && <p className="text-xs text-gray-400">{hint}</p>}
  </div>
);

const inputClass =
  'w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-dark bg-gray-50 transition-colors';

// Main Component
const SubscriptionFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const [form, setForm] = useState({
    name: '',
    price: '',
    duration: 'monthly' as 'monthly' | 'yearly',
    isActive: true,
    isPopular: false,
  });
  const [features, setFeatures] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // Fetch data
  useEffect(() => {
    if (!isEdit) return;
    const fetchData = async () => {
      setFetching(true);
      try {
        const data = await subscriptionService.getById(id!);
        const s: Subscription = data.data!;
        setForm({
          name: s.name,
          price: String(s.price),
          duration: s.duration || 'monthly',
          isActive: s.isActive,
          isPopular: s.isPopular || false,
        });
        setFeatures(s.features && s.features.length > 0 ? s.features : ['']);
      } catch {
        toast.error('Gagal memuat data paket');
        navigate('/subscriptions');
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [id, isEdit, navigate]);

  // Handler fitur
  const addFeature = () => setFeatures(prev => [...prev, '']);
  const removeFeature = (i: number) => setFeatures(prev => prev.filter((_, idx) => idx !== i));
  const updateFeature = (i: number, val: string) =>
    setFeatures(prev => prev.map((f, idx) => (idx === i ? val : f)));

  // Submit
  const handleSubmit = async (isActive: boolean) => {
    if (!form.name || !form.price) {
      toast.error('Nama dan harga wajib diisi');
      return;
    }
    const priceNum = parseFloat(form.price);
    if (isNaN(priceNum) || priceNum < 0) {
      toast.error('Harga harus berupa angka yang valid');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: form.name,
        price: priceNum,
        duration: form.duration,
        isActive,
        isPopular: form.isPopular,
        features: features.filter(f => f.trim() !== ''),
      };

      if (isEdit) {
        await subscriptionService.update(id!, payload);
        toast.success('Paket langganan berhasil diperbarui!');
      } else {
        await subscriptionService.create(payload);
        toast.success('Paket langganan berhasil dibuat!');
      }
      navigate('/subscriptions');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Operasi gagal');
    } finally {
      setLoading(false);
    }
  };

  // Skeleton loading
  if (fetching) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="w-32 h-6 bg-gray-200 rounded-full" />
        <div className="w-1/3 h-10 bg-gray-200 rounded-full" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {[...Array(3)].map((_, i) => <div key={i} className="w-full h-12 bg-gray-100 rounded-2xl" />)}
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <div key={i} className="w-full h-12 bg-gray-100 rounded-2xl" />)}
          </div>
        </div>
      </div>
    );
  }

  // Render
  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/subscriptions')}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-dark transition-colors group mb-4"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Plans
        </button>
        <h1 className="text-4xl font-display font-bold text-dark">
          {isEdit ? 'Edit Plan' : 'Add Plan'}
        </h1>
        <p className="text-gray-400 text-sm mt-1 italic">
          {isEdit ? 'Update paket dan harga langganan yang sudah ada' : 'Buat paket dan harga langganan baru'}
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* ── Kiri: 2/3 ──────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-5">

          <Card title="Plan Info">
            <Field label="Plan Name" required>
              <input
                type="text"
                placeholder="cth. Dasar, Profesional, Enterprise"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className={inputClass}
              />
            </Field>

            <Field label="Price (USD)" required>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold">$</span>
                <input
                  type="number"
                  placeholder="cth. 29.99"
                  value={form.price}
                  onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                  className="w-full border border-gray-200 rounded-2xl pl-8 pr-4 py-3 text-sm outline-none focus:border-dark bg-gray-50 transition-colors"
                  min="0"
                  step="0.01"
                />
              </div>
              {form.price && !isNaN(parseFloat(form.price)) && (
                <p className="text-xs text-gray-400 mt-1 ml-1">
                  Pratinjau: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(form.price))}
                </p>
              )}
            </Field>

            <Field label="Duration">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'monthly', label: 'Bulanan', sub: 'per bulan' },
                  { value: 'yearly',  label: 'Tahunan',  sub: 'per tahun' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm(p => ({ ...p, duration: opt.value as 'monthly' | 'yearly' }))}
                    className={`px-4 py-3 rounded-2xl border-2 text-left transition-all duration-200 ${
                      form.duration === opt.value
                        ? 'border-dark bg-dark text-white'
                        : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <p className="text-sm font-semibold">{opt.label}</p>
                    <p className={`text-xs mt-0.5 ${form.duration === opt.value ? 'text-white/70' : 'text-gray-400'}`}>
                      {opt.sub}
                    </p>
                  </button>
                ))}
              </div>
            </Field>
          </Card>

          <Card title="Features">
            <Field label="Features" hint="Add the features included in this plan">
              <div className="space-y-3">
                {features.map((feat, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      placeholder={`Fitur ${i + 1}`}
                      value={feat}
                      onChange={e => updateFeature(i, e.target.value)}
                      className="flex-1 border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-dark bg-gray-50 transition-colors"
                    />
                    {features.length > 1 && (
                      <button
                        onClick={() => removeFeature(i)}
                        className="w-11 h-11 border border-gray-200 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-50 hover:border-red-200 transition-colors flex-shrink-0"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addFeature}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-dark transition-colors px-2 py-1"
                >
                  <Plus size={14} />
                  Add Feature
                </button>
              </div>
            </Field>
          </Card>

        </div>

        {/* ── Kanan: 1/3 ─────────────────────────────────────────────── */}
        <div className="space-y-5 lg:sticky lg:top-6">

          <Card title="Settings">
            {/* Toggle Popular */}
            <Field label="Mark as Popular">
              <button
                type="button"
                onClick={() => setForm(p => ({ ...p, isPopular: !p.isPopular }))}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl border-2 transition-all duration-200 ${
                  form.isPopular
                    ? 'border-primary bg-primary/5 text-dark'
                    : 'border-gray-200 bg-gray-50 text-gray-500'
                }`}
              >
                <div className={`w-10 h-6 rounded-full relative transition-colors duration-200 flex-shrink-0 ${
                  form.isPopular ? 'bg-primary' : 'bg-gray-300'
                }`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                    form.isPopular ? 'translate-x-5' : 'translate-x-1'
                  }`} />
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    {form.isPopular ? 'Ditandai Popular' : 'Tandai sebagai Popular'}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Paket populer akan diberi badge khusus
                  </p>
                </div>
              </button>
            </Field>
          </Card>

          {/* Tombol Aksi */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleSubmit(true)}
              disabled={loading}
              className="w-full py-3 bg-dark text-white rounded-2xl text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : isEdit ? 'Update Paket' : 'Publish'}
            </button>
            <button
              onClick={() => handleSubmit(false)}
              disabled={loading}
              className="w-full py-3 bg-gray-100 text-gray-600 rounded-2xl text-sm font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Save as Inactive
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SubscriptionFormPage;