import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Trash2, Edit2, Upload, X } from 'lucide-react';
import { serviceService } from '../services/serviceService';
import { Service } from '../types';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';

const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editService, setEditService] = useState<Service | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string | null; loading: boolean }>({
    open: false, id: null, loading: false
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
      setForm({ title: service.title, slug: service.slug, description: service.description, icon: service.icon || '', price: service.price || '', isActive: service.isActive });
    } else {
      setEditService(null);
      setForm({ title: '', slug: '', description: '', icon: '', price: '', isActive: true });
    }
    setFormOpen(true);
  };

  const handleSubmit = async (isActive: boolean) => {
    if (!form.title || !form.slug || !form.description) { toast.error('Title, slug and description required'); return; }
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

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-dark">Services</h1>
          <p className="text-gray-400 text-sm mt-1 italic">Manage Winosa services content</p>
        </div>
        <button
          onClick={() => openForm()}
          className="flex items-center gap-2 bg-primary text-dark font-semibold px-5 py-3 rounded-2xl hover:bg-primary-dark transition-colors shadow-sm text-sm"
        >
          <Plus size={16} /> Add Service
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map(service => (
            <div key={service._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary text-lg">
                  {service.icon || '⚙️'}
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${service.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                  {service.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <h3 className="font-semibold text-dark mb-1">{service.title}</h3>
              <p className="text-xs text-gray-400 line-clamp-2 mb-3">{service.description}</p>
              {service.price && <p className="text-xs font-medium text-primary mb-3">{service.price}</p>}
              <div className="flex gap-2">
                <button onClick={() => setDeleteModal({ open: true, id: service._id, loading: false })}
                  className="w-8 h-8 border border-red-200 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50">
                  <Trash2 size={13} />
                </button>
                <button onClick={() => openForm(service)}
                  className="w-8 h-8 border border-yellow-200 rounded-lg flex items-center justify-center text-yellow-500 hover:bg-yellow-50">
                  <Edit2 size={13} />
                </button>
              </div>
            </div>
          ))}
          {services.length === 0 && (
            <div className="col-span-3 text-center py-16 text-gray-400 text-sm">No services yet</div>
          )}
        </div>
      )}

      {/* Service Form Slide Panel */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-end">
          <div className="absolute inset-0 bg-black/30" onClick={() => setFormOpen(false)} />
          <div className="relative bg-white h-full w-full max-w-xl overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-xl font-display font-bold text-dark">Services</h2>
                <p className="text-xs text-gray-400 italic">Manage Winosa services content</p>
              </div>
              <button onClick={() => setFormOpen(false)} className="text-gray-400 hover:text-dark"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Service Title :</label>
                <input type="text" placeholder="e.g. UI/UX Design" value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value, slug: !editService ? e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') : p.slug }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Slug :</label>
                <input type="text" placeholder="service-slug" value={form.slug}
                  onChange={e => setForm(p => ({ ...p, slug: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Service Description :</label>
                <textarea placeholder="Brief description of the service" value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  rows={5}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary bg-gray-50 resize-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Icon (emoji or text) :</label>
                <input type="text" placeholder="e.g. 💻 or code" value={form.icon}
                  onChange={e => setForm(p => ({ ...p, icon: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Price :</label>
                <input type="text" placeholder="e.g. Starting from $999" value={form.price}
                  onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary bg-gray-50" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => handleSubmit(false)} disabled={saving}
                  className="flex-1 py-3 bg-gray-200 text-gray-600 rounded-xl text-sm font-medium italic hover:bg-gray-300 disabled:opacity-50">
                  Draft
                </button>
                <button onClick={() => handleSubmit(true)} disabled={saving}
                  className="flex-1 py-3 bg-green-500 text-white rounded-xl text-sm font-medium italic hover:bg-green-600 disabled:opacity-50">
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
