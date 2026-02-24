import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Trash2, Edit2, X, Image, Search } from 'lucide-react';
import { serviceService } from '../services/serviceService';
import { Service } from '../types';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';

type FilterType = 'all' | 'draft' | 'published';

const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editService, setEditService] = useState<Service | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string | null; loading: boolean }>({
    open: false, id: null, loading: false,
  });
  const [form, setForm] = useState({
    title: '', slug: '', description: '', icon: '', price: '', isActive: true,
  });
  const [saving, setSaving] = useState(false);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const data = await serviceService.getAll();
      setServices(data.data);
    } catch {
      toast.error('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  const openForm = (service?: Service) => {
    if (service) {
      setEditService(service);
      setForm({
        title: service.title,
        slug: service.slug,
        description: service.description,
        icon: service.icon || '',
        price: service.price || '',
        isActive: service.isActive,
      });
    } else {
      setEditService(null);
      setForm({ title: '', slug: '', description: '', icon: '', price: '', isActive: true });
    }
    setFormOpen(true);
  };

  const handleSubmit = async (isActive: boolean) => {
    if (!form.title || !form.slug || !form.description) {
      toast.error('Title, slug and description required');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, isActive };
      if (editService) {
        await serviceService.update(editService._id, payload);
        toast.success('Service updated!');
      } else {
        await serviceService.create(payload);
        toast.success('Service created!');
      }
      setFormOpen(false);
      fetchServices();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.id) return;
    setDeleteModal(prev => ({ ...prev, loading: true }));
    try {
      await serviceService.delete(deleteModal.id);
      toast.success('Service deleted');
      setDeleteModal({ open: false, id: null, loading: false });
      fetchServices();
    } catch {
      toast.error('Delete failed');
      setDeleteModal(prev => ({ ...prev, loading: false }));
    }
  };

  const filtered = services.filter(s => {
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filter === 'all' ? true :
      filter === 'published' ? !!s.isActive :
      !s.isActive;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold text-dark">Services</h1>
          <p className="text-gray-400 text-sm mt-1 italic">Manage Winosa services content</p>
        </div>
        <button
          onClick={() => openForm()}
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-dark font-semibold px-6 py-3 rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md text-sm w-fit"
        >
          <Plus size={16} />
          Add Service
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-full text-sm outline-none focus:border-primary bg-white transition-colors"
        />
      </div>

      {/* Filter */}
      <div className="flex gap-3">
        {(['all', 'draft', 'published'] as FilterType[]).map(f => (
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

      {/* Service Cards */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">No services found</div>
      ) : (
        <div className="space-y-4">
          {filtered.map(service => (
            <div
              key={service._id}
              className="bg-white rounded-3xl border-2 border-gray-100 shadow-sm p-6 hover:shadow-md transition-all duration-200"
            >
              <div className="flex gap-6 items-start">
                {/* Icon */}
                <div className="w-28 h-28 flex-shrink-0 bg-gray-50 rounded-2xl border-2 border-gray-100 flex items-center justify-center">
                  {service.icon ? (
                    <span className="text-4xl">{service.icon}</span>
                  ) : (
                    <div className="text-center">
                      <Image size={24} className="text-gray-200 mx-auto mb-1" />
                      <span className="text-xs text-gray-300 italic">icon</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-dark">{service.title}</h3>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed line-clamp-2">
                    {service.description}
                  </p>
                  {service.price && (
                    <p className="text-sm font-semibold text-primary mt-2">{service.price}</p>
                  )}
                </div>

                {/* Status + Actions */}
                <div className="flex flex-col items-end gap-3 flex-shrink-0">
                  <span
                    className={`px-4 py-1.5 rounded-full text-xs font-medium border ${
                      service.isActive
                        ? 'bg-green-50 text-green-600 border-green-200'
                        : 'bg-gray-100 text-gray-500 border-gray-200'
                    }`}
                  >
                    {service.isActive ? 'Published' : 'Draft'}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDeleteModal({ open: true, id: service._id, loading: false })}
                      className="w-10 h-10 border-2 border-gray-100 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-50 hover:border-red-200 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                    <button
                      onClick={() => openForm(service)}
                      className="w-10 h-10 border-2 border-gray-100 rounded-xl flex items-center justify-center text-primary hover:bg-primary/10 hover:border-primary/30 transition-colors"
                    >
                      <Edit2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Slide Panel */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-end">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setFormOpen(false)} />
          <div className="relative bg-white h-full w-full max-w-xl overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-xl font-display font-bold text-dark">Services</h2>
                <p className="text-xs text-gray-400 italic">Manage Winosa services content</p>
              </div>
              <button
                onClick={() => setFormOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-dark hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Service Title :</label>
                <input
                  type="text"
                  placeholder="e.g. UI/UX Design"
                  value={form.title}
                  onChange={e => setForm(p => ({
                    ...p,
                    title: e.target.value,
                    slug: !editService ? e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') : p.slug,
                  }))}
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-primary bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Slug :</label>
                <input
                  type="text"
                  placeholder="service-slug"
                  value={form.slug}
                  onChange={e => setForm(p => ({ ...p, slug: e.target.value }))}
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-primary bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Service Description :</label>
                <textarea
                  placeholder="Brief description of the service"
                  value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  rows={5}
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-primary bg-gray-50 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Icon (emoji or text) :</label>
                <input
                  type="text"
                  placeholder="e.g. 💻 or code"
                  value={form.icon}
                  onChange={e => setForm(p => ({ ...p, icon: e.target.value }))}
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-primary bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Price :</label>
                <input
                  type="text"
                  placeholder="e.g. Starting from $999"
                  value={form.price}
                  onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-primary bg-gray-50"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => handleSubmit(false)}
                  disabled={saving}
                  className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-2xl text-sm font-semibold italic hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Draft
                </button>
                <button
                  onClick={() => handleSubmit(true)}
                  disabled={saving}
                  className="flex-1 py-3 bg-green-500 text-white rounded-2xl text-sm font-semibold italic hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Published'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModal.open}
        title="Delete Service"
        message="Are you sure you want to delete this service?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false, id: null, loading: false })}
        loading={deleteModal.loading}
      />

    </div>
  );
};

export default ServicesPage;