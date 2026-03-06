import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Plus, X,
  Monitor, Briefcase, Smartphone, CloudCog, Palette,
  Shield, Code, TrendingUp, Globe, Layers, Zap, Settings,
  Database, Lock, BarChart, Mail, Search, Star, Cpu, Layout,
  PenTool, Camera, Video, Music, ShoppingCart, Users, Heart,
  MessageSquare, Map, Clock, Wifi, Terminal, Package,
} from 'lucide-react';
import { serviceService } from '../services/serviceService';
import { Service } from '../types';
import toast from 'react-hot-toast';

const generateSlug = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// Icon map — same keys as frontend user SectionServices iconMap + extras
const ICON_OPTIONS: { key: string; label: string; Icon: React.FC<any> }[] = [
  { key: 'monitor',      label: 'Monitor',       Icon: Monitor },
  { key: 'briefcase',    label: 'Briefcase',      Icon: Briefcase },
  { key: 'smartphone',   label: 'Smartphone',     Icon: Smartphone },
  { key: 'cloud',        label: 'Cloud',          Icon: CloudCog },
  { key: 'palette',      label: 'Palette',        Icon: Palette },
  { key: 'shield',       label: 'Shield',         Icon: Shield },
  { key: 'code',         label: 'Code',           Icon: Code },
  { key: 'trending-up',  label: 'Trending Up',    Icon: TrendingUp },
  { key: 'globe',        label: 'Globe',          Icon: Globe },
  { key: 'layers',       label: 'Layers',         Icon: Layers },
  { key: 'zap',          label: 'Zap',            Icon: Zap },
  { key: 'settings',     label: 'Settings',       Icon: Settings },
  { key: 'database',     label: 'Database',       Icon: Database },
  { key: 'lock',         label: 'Lock',           Icon: Lock },
  { key: 'bar-chart',    label: 'Bar Chart',      Icon: BarChart },
  { key: 'mail',         label: 'Mail',           Icon: Mail },
  { key: 'search',       label: 'Search',         Icon: Search },
  { key: 'star',         label: 'Star',           Icon: Star },
  { key: 'cpu',          label: 'CPU',            Icon: Cpu },
  { key: 'layout',       label: 'Layout',         Icon: Layout },
  { key: 'pen-tool',     label: 'Pen Tool',       Icon: PenTool },
  { key: 'camera',       label: 'Camera',         Icon: Camera },
  { key: 'video',        label: 'Video',          Icon: Video },
  { key: 'music',        label: 'Music',          Icon: Music },
  { key: 'shopping-cart',label: 'Shopping Cart',  Icon: ShoppingCart },
  { key: 'users',        label: 'Users',          Icon: Users },
  { key: 'heart',        label: 'Heart',          Icon: Heart },
  { key: 'message',      label: 'Message',        Icon: MessageSquare },
  { key: 'map',          label: 'Map',            Icon: Map },
  { key: 'clock',        label: 'Clock',          Icon: Clock },
  { key: 'wifi',         label: 'Wifi',           Icon: Wifi },
  { key: 'terminal',     label: 'Terminal',       Icon: Terminal },
  { key: 'package',      label: 'Package',        Icon: Package },
  { key: 'mobile',       label: 'Mobile',         Icon: Smartphone },
];

const ServiceFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    icon: '',
    price: '',
    features: [] as string[],
    isActive: true,
  });
  const [featureInput, setFeatureInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [iconPickerOpen, setIconPickerOpen] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    const fetchService = async () => {
      setFetching(true);
      try {
        const data = await serviceService.getById(id!);
        const s: Service = data.data!;
        setForm({
          title:       s.title,
          slug:        s.slug,
          description: s.description,
          icon:        s.icon || '',
          price:       s.price || '',
          features:    s.features || [],
          isActive:    s.isActive,
        });
      } catch {
        toast.error('Failed to load service');
        navigate('/services');
      } finally {
        setFetching(false);
      }
    };
    fetchService();
  }, [id, isEdit, navigate]);

  const handleSubmit = async (isActive: boolean) => {
    if (!form.title || !form.slug || !form.description) {
      toast.error('Title, slug, and description are required');
      return;
    }
    setLoading(true);
    try {
      const payload = { ...form, isActive };
      if (isEdit) {
        await serviceService.update(id!, payload);
        toast.success('Service updated!');
      } else {
        await serviceService.create(payload);
        toast.success('Service created!');
      }
      navigate('/services');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const addFeature = () => {
    const val = featureInput.trim();
    if (!val) return;
    setForm(p => ({ ...p, features: [...p.features, val] }));
    setFeatureInput('');
  };

  const removeFeature = (idx: number) => {
    setForm(p => ({ ...p, features: p.features.filter((_, i) => i !== idx) }));
  };

  const selectedIcon = ICON_OPTIONS.find(o => o.key === form.icon);

  const inputClass =
    'w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-dark bg-gray-50 transition-colors';

  if (fetching) {
    return (
      <div className="max-w-2xl space-y-6 animate-pulse">
        <div className="w-24 h-8 bg-gray-200 rounded-full" />
        <div className="w-1/2 h-10 bg-gray-200 rounded-full" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-full h-12 bg-gray-100 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-8">

      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/services')}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-dark transition-colors group mb-4"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Services
        </button>
        <h1 className="text-4xl font-display font-bold text-dark">
          {isEdit ? 'Edit Service' : 'Add Service'}
        </h1>
        <p className="text-gray-400 text-sm mt-1 italic">Manage Winosa services content</p>
      </div>

      {/* Form */}
      <div className="space-y-5">

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-dark mb-2">Service Title :</label>
          <input
            type="text"
            placeholder="e.g. Web Development"
            value={form.title}
            onChange={e => setForm(p => ({
              ...p,
              title: e.target.value,
              slug: !isEdit ? generateSlug(e.target.value) : p.slug,
            }))}
            className={inputClass}
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-semibold text-dark mb-2">Slug :</label>
          <input
            type="text"
            placeholder="web-development"
            value={form.slug}
            onChange={e => setForm(p => ({ ...p, slug: e.target.value }))}
            className={inputClass}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-dark mb-2">Description :</label>
          <textarea
            placeholder="Brief description of the service shown on the website"
            value={form.description}
            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            rows={4}
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Icon Picker */}
        <div>
          <label className="block text-sm font-semibold text-dark mb-1">Icon :</label>
          <p className="text-xs text-gray-400 mb-2">
            Pilih icon Lucide — tampil di kartu service di website
          </p>

          {/* Trigger button */}
          <button
            type="button"
            onClick={() => setIconPickerOpen(v => !v)}
            className="flex items-center gap-3 w-full border border-gray-200 rounded-2xl px-4 py-3 bg-gray-50 hover:border-dark transition-colors text-left"
          >
            {selectedIcon ? (
              <>
                <div className="w-9 h-9 rounded-xl bg-dark flex items-center justify-center flex-shrink-0">
                  <selectedIcon.Icon size={18} className="text-white" />
                </div>
                <span className="text-sm font-medium text-dark">{selectedIcon.label}</span>
                <span className="text-xs text-gray-400 ml-auto font-mono">{form.icon}</span>
              </>
            ) : (
              <>
                <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Layers size={16} className="text-gray-300" />
                </div>
                <span className="text-sm text-gray-400">Select an icon...</span>
              </>
            )}
          </button>

          {/* Icon Grid */}
          {iconPickerOpen && (
            <div className="mt-2 border border-gray-200 rounded-2xl bg-white p-4 shadow-sm">
              <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
                {/* No icon option */}
                <button
                  type="button"
                  onClick={() => { setForm(p => ({ ...p, icon: '' })); setIconPickerOpen(false); }}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all text-xs ${
                    form.icon === ''
                      ? 'border-dark bg-dark/5'
                      : 'border-transparent hover:border-gray-200'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                    <X size={12} className="text-gray-300" />
                  </div>
                  <span className="text-gray-400 leading-tight text-center" style={{ fontSize: '9px' }}>None</span>
                </button>

                {ICON_OPTIONS.map(({ key, label, Icon }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => { setForm(p => ({ ...p, icon: key })); setIconPickerOpen(false); }}
                    title={label}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all ${
                      form.icon === key
                        ? 'border-dark bg-dark text-white'
                        : 'border-transparent hover:border-gray-200 text-gray-600 hover:text-dark'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      form.icon === key ? 'bg-white/10' : 'bg-gray-50'
                    }`}>
                      <Icon size={16} />
                    </div>
                    <span className="leading-tight text-center truncate w-full" style={{ fontSize: '9px' }}>
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Preview */}
          {selectedIcon && (
            <div className="mt-3 flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-16 h-16 rounded-full border border-black flex items-center justify-center bg-white flex-shrink-0">
                <selectedIcon.Icon size={28} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-xs font-semibold text-dark">{selectedIcon.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">Preview seperti di website user</p>
              </div>
            </div>
          )}
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-semibold text-dark mb-2">Price :</label>
          <input
            type="text"
            placeholder="e.g. Starting from $999"
            value={form.price}
            onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
            className={inputClass}
          />
          <p className="text-xs text-gray-400 mt-1.5">
            Tampil di bagian Pricing — teks "Starting from" akan otomatis dihapus saat ditampilkan
          </p>
        </div>

        {/* Features */}
        <div>
          <label className="block text-sm font-semibold text-dark mb-2">Features :</label>
          <p className="text-xs text-gray-400 mb-3">
            Tampil sebagai list di pricing card dan tech section di website
          </p>

          {/* Feature list */}
          {form.features.length > 0 && (
            <div className="space-y-2 mb-3">
              {form.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-3 bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-100"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span className="text-sm text-dark">{feat}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFeature(idx)}
                    className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add feature input */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Responsive Design"
              value={featureInput}
              onChange={e => setFeatureInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }}
              className="flex-1 border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-dark bg-gray-50 transition-colors"
            />
            <button
              type="button"
              onClick={addFeature}
              disabled={!featureInput.trim()}
              className="flex items-center gap-1.5 px-4 py-3 bg-dark text-white rounded-2xl text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus size={14} />
              Add
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
            Save as Draft
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

export default ServiceFormPage;