import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Trash2, Edit2, Search, Sparkles, Globe, Smartphone, Palette } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { serviceService } from '../services/serviceService';
import { Service } from '../types';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';
import {
  Monitor, Briefcase, CloudCog,
  Shield, Code, TrendingUp, Layers, Zap, Settings,
  Database, Lock, BarChart, Mail, Search as SearchIcon, Star, Cpu, Layout,
  PenTool, Camera, Video, Music, ShoppingCart, Users, Heart,
  MessageSquare, Map, Clock, Wifi, Terminal, Package,
} from 'lucide-react';

type FilterType = 'all' | 'draft' | 'published';

const iconMap: Record<string, React.FC<any>> = {
  monitor:         Monitor,
  briefcase:       Briefcase,
  smartphone:      Smartphone,
  mobile:          Smartphone,
  cloud:           CloudCog,
  palette:         Palette,
  shield:          Shield,
  code:            Code,
  'trending-up':   TrendingUp,
  globe:           Globe,
  layers:          Layers,
  zap:             Zap,
  settings:        Settings,
  database:        Database,
  lock:            Lock,
  'bar-chart':     BarChart,
  mail:            Mail,
  search:          SearchIcon,
  star:            Star,
  cpu:             Cpu,
  layout:          Layout,
  'pen-tool':      PenTool,
  camera:          Camera,
  video:           Video,
  music:           Music,
  'shopping-cart': ShoppingCart,
  users:           Users,
  heart:           Heart,
  message:         MessageSquare,
  map:             Map,
  clock:           Clock,
  wifi:            Wifi,
  terminal:        Terminal,
  package:         Package,
};

const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [services,    setServices]    = useState<Service[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState('');
  const [filter,      setFilter]      = useState<FilterType>('all');
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean; id: string | null; loading: boolean;
  }>({ open: false, id: null, loading: false });

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const data = await serviceService.getAll();
      setServices(data.data);
    } catch {
      toast.error('Gagal memuat data layanan');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  const handleDelete = async () => {
    if (!deleteModal.id) return;
    setDeleteModal(prev => ({ ...prev, loading: true }));
    try {
      await serviceService.delete(deleteModal.id);
      toast.success('Layanan berhasil dihapus');
      setDeleteModal({ open: false, id: null, loading: false });
      fetchServices();
    } catch {
      toast.error('Gagal menghapus layanan');
      setDeleteModal(prev => ({ ...prev, loading: false }));
    }
  };

  const filtered = services.filter(s => {
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filter === 'all'       ? true :
      filter === 'published' ? !!s.isActive :
      !s.isActive;
    return matchSearch && matchStatus;
  });

  const filterLabels: Record<FilterType, string> = {
    all:       'All',
    published: 'Published',
    draft:     'Draft',
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold text-dark">Services</h1>
          <p className="text-gray-400 text-sm mt-1 italic">Kelola konten layanan Winosa</p>
        </div>
        <button
          onClick={() => navigate('/services/add')}
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-dark font-semibold px-6 py-3 rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md text-sm w-fit"
        >
          <Plus size={16} />
          Add Service
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Cari layanan..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-full text-sm outline-none focus:border-primary bg-white transition-colors"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(['all', 'published', 'draft'] as FilterType[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                filter === f
                  ? 'bg-dark border-dark text-white shadow-sm'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
              }`}
            >
              {filterLabels[f]}
            </button>
          ))}
        </div>
      </div>

      {/* Daftar Layanan */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">
          Tidak ada layanan yang ditemukan
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(service => {
            const IconComponent = iconMap[service.icon?.toLowerCase() || ''] || null;

            return (
              <div
                key={service._id}
                className="bg-white rounded-3xl border-2 border-gray-100 shadow-sm p-5 hover:shadow-md transition-all duration-200"
              >
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 sm:items-center">

                  {/* Ikon */}
                  <div className="w-14 h-14 flex-shrink-0 rounded-full border border-black flex items-center justify-center bg-white">
                    {IconComponent ? (
                      <IconComponent size={22} strokeWidth={1.5} className="text-dark" />
                    ) : service.icon ? (
                      <span className="text-2xl">{service.icon}</span>
                    ) : (
                      <Sparkles size={18} className="text-gray-300" />
                    )}
                  </div>

                  {/* Title + Description */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-base font-bold text-dark leading-tight">{service.title}</h3>
                      <span className={`px-3 py-0.5 rounded-full text-xs font-medium border flex-shrink-0 ${
                        service.isActive
                          ? 'bg-green-50 text-green-600 border-green-200'
                          : 'bg-gray-100 text-gray-500 border-gray-200'
                      }`}>
                        {service.isActive ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed line-clamp-2">
                      {service.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => setDeleteModal({ open: true, id: service._id, loading: false })}
                      className="w-9 h-9 border border-gray-200 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-50 hover:border-red-200 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                    <button
                      onClick={() => navigate(`/services/edit/${service._id}`)}
                      className="w-9 h-9 border border-gray-200 rounded-xl flex items-center justify-center text-primary hover:bg-primary/10 hover:border-primary/30 transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={14} />
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModal.open}
        title="Delete Service"
        message="Apakah Anda yakin ingin menghapus layanan ini? Tindakan ini tidak dapat dibatalkan."
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false, id: null, loading: false })}
        loading={deleteModal.loading}
      />

    </div>
  );
};

export default ServicesPage;