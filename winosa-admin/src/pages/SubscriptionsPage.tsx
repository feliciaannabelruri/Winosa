import React, { useEffect, useState, useCallback } from 'react';
import {
  Plus,
  Check,
  Star,
  Trash2,
  Edit2,
  X,
  Crown,
  Calendar,
  DollarSign,
} from 'lucide-react';
import { subscriptionService } from '../services/subscriptionService';
import { Subscription } from '../types';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';

type FilterType = 'all' | 'monthly' | 'yearly';

/* ─────────────────────────────────────────────
   Form slide-panel (add / edit)
───────────────────────────────────────────── */
interface FormState {
  name: string;
  price: string;
  duration: 'monthly' | 'yearly';
  features: string;      // raw textarea — split by newline on submit
  isPopular: boolean;
  isActive: boolean;
}

const defaultForm: FormState = {
  name: '',
  price: '',
  duration: 'monthly',
  features: '',
  isPopular: false,
  isActive: true,
};

/* ─────────────────────────────────────────────
   Subscription Card
───────────────────────────────────────────── */
interface CardProps {
  sub: Subscription;
  onEdit: () => void;
  onDelete: () => void;
}

const SubscriptionCard: React.FC<CardProps> = ({ sub, onEdit, onDelete }) => {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);

  return (
    <div
      className={`relative bg-white rounded-3xl border-2 shadow-sm overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
        sub.isPopular
          ? 'border-primary shadow-primary/10'
          : 'border-gray-100'
      }`}
    >
      {/* Popular badge */}
      {sub.isPopular && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-primary rounded-t-3xl" />
      )}

      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            {sub.isPopular && (
              <div className="inline-flex items-center gap-1 text-xs font-bold text-primary bg-yellow-50 border border-yellow-200 px-3 py-1 rounded-full mb-2">
                <Star size={10} fill="currentColor" />
                Most Popular
              </div>
            )}
            <h3 className="text-xl font-bold text-dark">{sub.name}</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <Calendar size={12} className="text-gray-400" />
              <span className="text-xs text-gray-400 capitalize">{sub.duration}</span>
            </div>
          </div>
          {/* Status Badge */}
          <span
            className={`text-xs font-medium px-3 py-1 rounded-full border ${
              sub.isActive
                ? 'bg-green-50 text-green-600 border-green-200'
                : 'bg-gray-100 text-gray-500 border-gray-200'
            }`}
          >
            {sub.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-end gap-1">
          <span className="text-3xl font-display font-bold text-dark">
            {formatPrice(sub.price)}
          </span>
          <span className="text-sm text-gray-400 mb-1">
            /{sub.duration === 'monthly' ? 'mo' : 'yr'}
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* Features */}
        <ul className="space-y-2.5">
          {sub.features.map((feat, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                sub.isPopular ? 'bg-primary/10' : 'bg-gray-100'
              }`}>
                <Check size={10} className={sub.isPopular ? 'text-primary' : 'text-gray-500'} />
              </div>
              <span className="text-sm text-gray-600 leading-tight">{feat}</span>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={onDelete}
            className="w-10 h-10 border-2 border-gray-100 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-50 hover:border-red-200 transition-colors"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
          <button
            onClick={onEdit}
            className="flex-1 py-2.5 border-2 border-gray-100 rounded-xl text-sm font-semibold text-dark hover:bg-gray-50 hover:border-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <Edit2 size={13} />
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
const SubscriptionsPage: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Subscription | null>(null);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    id: string | null;
    loading: boolean;
  }>({ open: false, id: null, loading: false });

  /* ── Fetch ── */
  const fetchSubscriptions = useCallback(async () => {
    setLoading(true);
    try {
      const params =
        filter !== 'all' ? { duration: filter as 'monthly' | 'yearly' } : undefined;
      const data = await subscriptionService.getAll(params);
      setSubscriptions(data.data);
    } catch {
      toast.error('Failed to fetch subscriptions');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  /* ── Open Form ── */
  const openForm = (sub?: Subscription) => {
    if (sub) {
      setEditTarget(sub);
      setForm({
        name: sub.name,
        price: String(sub.price),
        duration: sub.duration,
        features: sub.features.join('\n'),
        isPopular: sub.isPopular,
        isActive: sub.isActive,
      });
    } else {
      setEditTarget(null);
      setForm(defaultForm);
    }
    setFormOpen(true);
  };

  /* ── Submit ── */
  const handleSubmit = async (isActive: boolean) => {
    if (!form.name || !form.price) {
      toast.error('Name and price are required');
      return;
    }
    setSaving(true);
    try {
      const payload: Partial<Subscription> = {
        name: form.name,
        price: Number(form.price),
        duration: form.duration,
        features: form.features
          .split('\n')
          .map(f => f.trim())
          .filter(Boolean),
        isPopular: form.isPopular,
        isActive,
      };

      if (editTarget) {
        await subscriptionService.update(editTarget._id, payload);
        toast.success('Subscription updated!');
      } else {
        await subscriptionService.create(payload);
        toast.success('Subscription created!');
      }
      setFormOpen(false);
      fetchSubscriptions();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  /* ── Delete ── */
  const handleDelete = async () => {
    if (!deleteModal.id) return;
    setDeleteModal(prev => ({ ...prev, loading: true }));
    try {
      await subscriptionService.delete(deleteModal.id);
      toast.success('Subscription deleted');
      setDeleteModal({ open: false, id: null, loading: false });
      fetchSubscriptions();
    } catch {
      toast.error('Delete failed');
      setDeleteModal(prev => ({ ...prev, loading: false }));
    }
  };

  const inputClass =
    'w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-dark bg-gray-50 transition-colors';

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold text-dark">Subscriptions</h1>
          <p className="text-gray-400 text-sm mt-1 italic">Manage pricing plans & packages</p>
        </div>
        <button
          onClick={() => openForm()}
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-dark font-semibold px-6 py-3 rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md text-sm w-fit"
        >
          <Plus size={16} />
          Add Plan
        </button>
      </div>

      {/* ── Filter ── */}
      <div className="flex gap-3">
        {(['all', 'monthly', 'yearly'] as FilterType[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-8 py-2.5 rounded-full text-sm font-medium border transition-all duration-200 capitalize ${
              filter === f
                ? 'bg-dark border-dark text-white shadow-sm'
                : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* ── Grid ── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl border-2 border-gray-100 p-6 space-y-4 animate-pulse"
            >
              <div className="w-1/2 h-6 bg-gray-200 rounded-full" />
              <div className="w-1/3 h-8 bg-gray-200 rounded-full" />
              <div className="border-t border-gray-100 my-2" />
              {[...Array(4)].map((_, j) => (
                <div key={j} className="w-full h-4 bg-gray-100 rounded-full" />
              ))}
            </div>
          ))}
        </div>
      ) : subscriptions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-3xl flex items-center justify-center mb-4">
            <Crown size={28} className="text-gray-300" />
          </div>
          <p className="text-gray-400 text-sm">No subscription plans yet</p>
          <button
            onClick={() => openForm()}
            className="mt-4 text-sm text-primary font-semibold hover:underline"
          >
            + Create your first plan
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subscriptions.map(sub => (
            <SubscriptionCard
              key={sub._id}
              sub={sub}
              onEdit={() => openForm(sub)}
              onDelete={() => setDeleteModal({ open: true, id: sub._id, loading: false })}
            />
          ))}
        </div>
      )}

      {/* ── Slide Form Panel ── */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-end">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setFormOpen(false)}
          />
          <div className="relative bg-white h-full w-full max-w-xl overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-xl font-display font-bold text-dark">
                  {editTarget ? 'Edit Plan' : 'New Plan'}
                </h2>
                <p className="text-xs text-gray-400 italic">Manage pricing plans & packages</p>
              </div>
              <button
                onClick={() => setFormOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-dark hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5">

              {/* Plan Name */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Plan Name :</label>
                <input
                  type="text"
                  placeholder="e.g. Basic, Pro, Enterprise"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className={inputClass}
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">
                  Price (IDR) :
                </label>
                <div className="relative">
                  <DollarSign size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    placeholder="e.g. 500000"
                    value={form.price}
                    onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                    className={`${inputClass} pl-9`}
                    min="0"
                  />
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Duration :</label>
                <div className="flex gap-3">
                  {(['monthly', 'yearly'] as const).map(d => (
                    <button
                      key={d}
                      onClick={() => setForm(p => ({ ...p, duration: d }))}
                      className={`flex-1 py-3 rounded-2xl text-sm font-semibold border-2 capitalize transition-all ${
                        form.duration === d
                          ? 'bg-dark text-white border-dark'
                          : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">
                  Features :
                  <span className="font-normal text-gray-400 ml-1">(1 per line)</span>
                </label>
                <textarea
                  placeholder={`e.g.\n5 Projects\n10 GB Storage\nEmail Support`}
                  value={form.features}
                  onChange={e => setForm(p => ({ ...p, features: e.target.value }))}
                  rows={7}
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* Most Popular Toggle */}
              <div>
                <label className="flex items-center justify-between cursor-pointer py-1">
                  <div>
                    <p className="text-sm font-semibold text-dark">Mark as Popular</p>
                    <p className="text-xs text-gray-400 mt-0.5">Shows "Most Popular" badge on card</p>
                  </div>
                  <button
                    onClick={() => setForm(p => ({ ...p, isPopular: !p.isPopular }))}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                      form.isPopular ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                        form.isPopular ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => handleSubmit(false)}
                  disabled={saving}
                  className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-2xl text-sm font-semibold italic hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Save Draft
                </button>
                <button
                  onClick={() => handleSubmit(true)}
                  disabled={saving}
                  className="flex-1 py-3 bg-green-500 text-white rounded-2xl text-sm font-semibold italic hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Publish'}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ── Delete Modal ── */}
      <ConfirmModal
        isOpen={deleteModal.open}
        title="Delete Subscription Plan"
        message="Are you sure you want to delete this plan? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false, id: null, loading: false })}
        loading={deleteModal.loading}
      />

    </div>
  );
};

export default SubscriptionsPage;