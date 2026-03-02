import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, Image } from 'lucide-react';
import { portfolioService } from '../services/portfolioService';
import { Portfolio } from '../types';
import toast from 'react-hot-toast';
import { PORTFOLIO_CATEGORIES } from '../constants'; // FIX: import dari constants

const generateSlug = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const PortfolioFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    category: '',
    client: '',
    projectUrl: '',
    isActive: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    const fetchPortfolio = async () => {
      setFetching(true);
      try {
        const data = await portfolioService.getById(id!);
        const p: Portfolio = data.data!;
        setForm({
          title:      p.title,
          slug:       p.slug,
          description: p.description || '',
          category:   p.category || '',
          client:     p.client || '',
          projectUrl: p.projectUrl || '',
          isActive:   p.isActive,
        });
        setImagePreview(p.image || null);
      } catch {
        toast.error('Failed to load portfolio');
        navigate('/portfolio');
      } finally {
        setFetching(false);
      }
    };
    fetchPortfolio();
  }, [id, isEdit, navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (isActive: boolean) => {
    if (!form.title || !form.slug) {
      toast.error('Title and slug are required');
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('title',      form.title);
      fd.append('slug',       form.slug);
      fd.append('description', form.description);
      fd.append('category',   form.category);
      fd.append('client',     form.client);
      fd.append('projectUrl', form.projectUrl);
      fd.append('isActive',   String(isActive));
      if (imageFile) fd.append('image', imageFile);

      if (isEdit) {
        await portfolioService.update(id!, fd);
        toast.success('Portfolio updated!');
      } else {
        await portfolioService.create(fd);
        toast.success('Portfolio created!');
      }
      navigate('/portfolio');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-dark bg-gray-50 transition-colors';

  if (fetching) {
    return (
      <div className="max-w-2xl space-y-6 animate-pulse">
        <div className="w-24 h-8 bg-gray-200 rounded-full" />
        <div className="w-1/2 h-10 bg-gray-200 rounded-full" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
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
          onClick={() => navigate('/portfolio')}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-dark transition-colors group mb-4"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Portfolio
        </button>
        {/* FIX: konsisten 'Portfolio' bukan 'Portofolio' */}
        <h1 className="text-4xl font-display font-bold text-dark">
          {isEdit ? 'Edit Portfolio' : 'Add Portfolio'}
        </h1>
        <p className="text-gray-400 text-sm mt-1 italic">Manage study case and project</p>
      </div>

      {/* Form */}
      <div className="space-y-5">

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-dark mb-2">Project Title :</label>
          <input
            type="text"
            placeholder="e.g. Prowerty"
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
            placeholder="project-slug"
            value={form.slug}
            onChange={e => setForm(p => ({ ...p, slug: e.target.value }))}
            className={inputClass}
          />
        </div>

        {/* Short Description */}
        <div>
          <label className="block text-sm font-semibold text-dark mb-2">Short Description :</label>
          <input
            type="text"
            placeholder="Short description"
            value={form.description}
            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            className={inputClass}
          />
        </div>

        {/* FIX: Category pakai PORTFOLIO_CATEGORIES dari constants */}
        <div>
          <label className="block text-sm font-semibold text-dark mb-2">Category :</label>
          <select
            value={form.category}
            onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
            className={inputClass}
          >
            <option value="">Select Category</option>
            {PORTFOLIO_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Thumbnail */}
        <div>
          <label className="block text-sm font-semibold text-dark mb-2">Thumbnail Image :</label>
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-gray-200 rounded-2xl p-6 bg-gray-50 cursor-pointer hover:border-dark transition-colors group"
          >
            {imagePreview ? (
              <div className="space-y-3">
                <img
                  src={imagePreview}
                  alt="preview"
                  className="w-full h-48 object-cover rounded-xl"
                />
                <p className="text-xs text-center text-gray-400 italic">Click to change image</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 text-gray-400 group-hover:text-dark transition-colors py-4">
                <Image size={32} />
                <p className="text-xs italic">Displayed on portfolio card</p>
                <span className="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-xs flex items-center gap-1.5">
                  <Upload size={11} />
                  Upload Image
                </span>
              </div>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Client */}
        <div>
          <label className="block text-sm font-semibold text-dark mb-2">Client :</label>
          <input
            type="text"
            placeholder="Client name"
            value={form.client}
            onChange={e => setForm(p => ({ ...p, client: e.target.value }))}
            className={inputClass}
          />
        </div>

        {/* Project URL */}
        <div>
          <label className="block text-sm font-semibold text-dark mb-2">Project URL :</label>
          <input
            type="text"
            placeholder="https://..."
            value={form.projectUrl}
            onChange={e => setForm(p => ({ ...p, projectUrl: e.target.value }))}
            className={inputClass}
          />
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

export default PortfolioFormPage;