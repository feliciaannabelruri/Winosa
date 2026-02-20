import React, { useState, useEffect, useRef } from 'react';
import { X, Upload } from 'lucide-react';
import { Portfolio } from '../types';
import { portfolioService } from '../services/portfolioService';
import toast from 'react-hot-toast';

interface Props {
  isOpen: boolean;
  portfolio: Portfolio | null;
  onClose: () => void;
  onSuccess: () => void;
}

const generateSlug = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const PortfolioFormModal: React.FC<Props> = ({ isOpen, portfolio, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    title: '', slug: '', description: '', category: '', client: '', projectUrl: '', isActive: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (portfolio) {
      setForm({
        title: portfolio.title, slug: portfolio.slug, description: portfolio.description || '',
        category: portfolio.category || '', client: portfolio.client || '',
        projectUrl: portfolio.projectUrl || '', isActive: portfolio.isActive,
      });
      setImagePreview(portfolio.image || null);
    } else {
      setForm({ title: '', slug: '', description: '', category: '', client: '', projectUrl: '', isActive: true });
      setImagePreview(null);
    }
    setImageFile(null);
  }, [portfolio, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (isActive: boolean) => {
    if (!form.title || !form.slug) { toast.error('Title and slug are required'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('slug', form.slug);
      fd.append('description', form.description);
      fd.append('category', form.category);
      fd.append('client', form.client);
      fd.append('projectUrl', form.projectUrl);
      fd.append('isActive', String(isActive));
      if (imageFile) fd.append('image', imageFile);

      if (portfolio) {
        await portfolioService.update(portfolio._id, fd);
        toast.success('Portfolio updated!');
      } else {
        await portfolioService.create(fd);
        toast.success('Portfolio created!');
      }
      onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white h-full w-full max-w-xl overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-display font-bold text-dark">Portofolio</h2>
            <p className="text-xs text-gray-400 italic">Manage study case and project</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-dark"><X size={20} /></button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">Project Title :</label>
            <input
              type="text" placeholder="e.g. Prowerty" value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value, slug: !portfolio ? generateSlug(e.target.value) : p.slug }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">Slug :</label>
            <input
              type="text" placeholder="project-slug" value={form.slug}
              onChange={e => setForm(p => ({ ...p, slug: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">Short Description :</label>
            <input
              type="text" placeholder="Short description" value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">Category :</label>
            <select
              value={form.category}
              onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary bg-gray-50"
            >
              <option value="">Select Category</option>
              <option value="Web Application">Web Application</option>
              <option value="Mobile App">Mobile App</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="Branding">Branding</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">Thumbnail Image :</label>
            <div
              onClick={() => fileRef.current?.click()}
              className="border border-gray-200 rounded-xl p-6 bg-gray-50 cursor-pointer hover:border-primary transition-colors"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="preview" className="w-full h-32 object-cover rounded-lg" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <p className="text-xs italic">Displayed on portofolio card</p>
                  <button type="button" className="px-4 py-1.5 bg-white border border-gray-200 rounded-lg text-xs">
                    <Upload size={12} className="inline mr-1" /> Upload
                  </button>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">Client :</label>
            <input
              type="text" placeholder="Client name" value={form.client}
              onChange={e => setForm(p => ({ ...p, client: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">Project URL :</label>
            <input
              type="text" placeholder="https://..." value={form.projectUrl}
              onChange={e => setForm(p => ({ ...p, projectUrl: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary bg-gray-50"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => handleSubmit(false)} disabled={loading}
              className="flex-1 py-3 bg-gray-200 text-gray-600 rounded-xl text-sm font-medium italic hover:bg-gray-300 transition-colors disabled:opacity-50">
              Draft
            </button>
            <button onClick={() => handleSubmit(true)} disabled={loading}
              className="flex-1 py-3 bg-green-500 text-white rounded-xl text-sm font-medium italic hover:bg-green-600 transition-colors disabled:opacity-50">
              {loading ? 'Saving...' : 'Published'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioFormModal;
