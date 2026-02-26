import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { subscriptionService } from '../services/subscriptionService';
import { Subscription } from '../types';
import toast from 'react-hot-toast';

const DURATION_OPTIONS = [
  { value: 'monthly', label: 'Monthly (per bulan)' },
  { value: 'yearly', label: 'Yearly (per tahun)' },
];

const SubscriptionFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const [form, setForm] = useState<{
    name: string;
    price: string;
    duration: 'monthly' | 'yearly';
    isActive: boolean;
    isPopular: boolean;
  }>({
    name: '',
    price: '',
    duration: 'monthly',
    isActive: true,
    isPopular: false,
  });
  const [features, setFeatures] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

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
        toast.error('Failed to load subscription');
        navigate('/subscriptions');
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [id, isEdit, navigate]);

  const addFeature = () => setFeatures(prev => [...prev, '']);
  const removeFeature = (i: number) => setFeatures(prev => prev.filter((_, idx) => idx !== i));
  const updateFeature = (i: number, val: string) =>
    setFeatures(prev => prev.map((f, idx) => idx === i ? val : f));

  const handleSubmit = async (isActive: boolean) => {
    if (!form.name || !form.price) {
      toast.error('Name and price are required');
      return;
    }
    const priceNum = parseFloat(form.price);
    if (isNaN(priceNum) || priceNum < 0) {
      toast.error('Price must be a valid number');
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
        toast.success('Subscription updated!');
      } else {
        await subscriptionService.create(payload);
        toast.success('Subscription created!');
      }
      navigate('/subscriptions');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-dark bg-gray-50 transition-colors';

  if (fetching) {
    return (
      <div className="max-w-2xl space-y-6 animate-pulse">
        <div className="w-24 h-8 bg-gray-200 rounded-full" />
        <div className="w-1/2 h-10 bg-gray-200 rounded-full" />
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-full h-12 bg-gray-100 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-8">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/subscriptions')}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-dark transition-colors group mb-4"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Subscriptions
        </button>
        <h1 className="text-4xl font-display font-bold text-dark">
          {isEdit ? 'Edit Subscription' : 'Add Subscription'}
        </h1>
        <p className="text-gray-400 text-sm mt-1 italic">Manage subscription plans and pricing</p>
      </div>

      {/* Form */}
      <div className="space-y-5">

        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-dark mb-2">Plan Name :</label>
          <input
            type="text"
            placeholder="e.g. Basic, Professional, Enterprise"
            value={form.name}
            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            className={inputClass}
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-semibold text-dark mb-2">Price (USD) :</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold">$</span>
            <input
              type="number"
              placeholder="e.g. 29.99"
              value={form.price}
              onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
              className="w-full border border-gray-200 rounded-2xl pl-8 pr-4 py-3 text-sm outline-none focus:border-dark bg-gray-50 transition-colors"
              min="0"
              step="0.01"
            />
          </div>
          {form.price && !isNaN(parseFloat(form.price)) && (
            <p className="text-xs text-gray-400 mt-1 ml-1">
              Preview: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(form.price))}
            </p>
          )}
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-semibold text-dark mb-2">Duration :</label>
          <div className="grid grid-cols-2 gap-3">
            {DURATION_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm(p => ({ ...p, duration: opt.value as 'monthly' | 'yearly' }))}
                className={`px-4 py-3 rounded-2xl border-2 text-sm font-semibold transition-all duration-200 text-left ${
                  form.duration === opt.value
                    ? 'border-dark bg-dark text-white'
                    : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Popular Toggle */}
        <div>
          <button
            type="button"
            onClick={() => setForm(p => ({ ...p, isPopular: !p.isPopular }))}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl border-2 transition-all duration-200 ${
              form.isPopular
                ? 'border-primary bg-primary/5 text-dark'
                : 'border-gray-200 bg-gray-50 text-gray-500'
            }`}
          >
            <div className={`w-10 h-6 rounded-full relative transition-colors duration-200 ${
              form.isPopular ? 'bg-primary' : 'bg-gray-300'
            }`}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                form.isPopular ? 'translate-x-5' : 'translate-x-1'
              }`} />
            </div>
            <span className="text-sm font-semibold">Mark as Popular</span>
          </button>
        </div>

        {/* Features */}
        <div>
          <label className="block text-sm font-semibold text-dark mb-3">Features :</label>
          <div className="space-y-3">
            {features.map((feat, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  placeholder={`Feature ${i + 1}`}
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
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-dark transition-colors px-2"
            >
              <Plus size={14} />
              Add Feature
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={() => handleSubmit(false)}
            disabled={loading}
            className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-2xl text-sm font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            Save as Inactive
          </button>
          <button
            onClick={() => handleSubmit(true)}
            disabled={loading}
            className="flex-1 py-3 bg-dark text-white rounded-2xl text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Publish'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default SubscriptionFormPage;