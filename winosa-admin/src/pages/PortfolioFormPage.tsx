import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, X, Plus, Trash2 } from 'lucide-react';
import { portfolioService } from '../services/portfolioService';
import toast from 'react-hot-toast';
import { PORTFOLIO_CATEGORIES } from '../constants';
import ImageUpload from './service-form/shared/ImageUpload';

const generateSlug = (t: string) =>
  t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const inputCls = 'w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-dark bg-gray-50 transition-colors';
const textareaCls = `${inputCls} resize-none`;

const Label: React.FC<{ children: React.ReactNode; hint?: string }> = ({ children, hint }) => (
  <div className="mb-2">
    <label className="block text-sm font-semibold text-dark">{children}</label>
    {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
  </div>
);

const SectionCard: React.FC<{ title: string; subtitle?: string; children: React.ReactNode }> = ({
  title, subtitle, children,
}) => (
  <div className="bg-white border border-gray-100 rounded-3xl p-6 space-y-4 shadow-sm">
    <div>
      <h2 className="text-base font-bold text-dark">{title}</h2>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
    {children}
  </div>
);

interface Metric { value: string; label: string; }

interface PortfolioForm {
  title:      string;
  slug:       string;
  shortDesc:  string;
  longDesc:   string;
  category:   string;
  client:     string;
  year:       string;
  duration:   string;
  role:       string;
  projectUrl: string;
  thumbnail:  string;
  heroImage:  string;
  techStack:  string[];
  challenge:  string;
  solution:   string;
  result:     string;
  metrics:    Metric[];
  gallery:    string[];
  isActive:   boolean;
}

const DEFAULT_FORM: PortfolioForm = {
  title: '', slug: '', shortDesc: '', longDesc: '',
  category: '', client: '', year: new Date().getFullYear().toString(),
  duration: '', role: '', projectUrl: '',
  thumbnail: '', heroImage: '',
  techStack: [],
  challenge: '', solution: '', result: '',
  metrics: [],
  gallery: [],
  isActive: true,
};

const PortfolioFormPage: React.FC = () => {
  const navigate  = useNavigate();
  const { id }    = useParams<{ id: string }>();
  const isEdit    = !!id;

  const [form,     setForm]     = useState<PortfolioForm>(DEFAULT_FORM);
  const [loading,  setLoading]  = useState(false);
  const [fetching, setFetching] = useState(false);

  const [techInput,   setTechInput]   = useState('');
  const [metricInput, setMetricInput] = useState({ value: '', label: '' });

  const set = <K extends keyof PortfolioForm>(key: K, val: PortfolioForm[K]) =>
    setForm(p => ({ ...p, [key]: val }));

  // Load
  useEffect(() => {
    if (!isEdit) return;
    setFetching(true);
    portfolioService.getById(id!)
      .then(res => {
        const p = res.data!;
        setForm({
          title:      p.title       ?? '',
          slug:       p.slug        ?? '',
          shortDesc:  p.shortDesc   ?? (p as any).description ?? '',
          longDesc:   p.longDesc    ?? '',
          category:   p.category    ?? '',
          client:     p.client      ?? '',
          year:       p.year        ?? new Date().getFullYear().toString(),
          duration:   p.duration    ?? '',
          role:       p.role        ?? '',
          projectUrl: p.projectUrl  ?? '',
          thumbnail:  p.thumbnail   ?? p.image ?? '',
          heroImage:  p.heroImage   ?? '',
          techStack:  Array.isArray(p.techStack) ? p.techStack : [],
          challenge:  p.challenge   ?? '',
          solution:   p.solution    ?? '',
          result:     p.result      ?? '',
          metrics:    Array.isArray(p.metrics) ? p.metrics : [],
          gallery:    Array.isArray(p.gallery) ? p.gallery : [],
          isActive:   p.isActive    ?? true,
        });
      })
      .catch(() => { toast.error('Gagal memuat data portfolio'); navigate('/portfolio'); })
      .finally(() => setFetching(false));
  }, [id, isEdit, navigate]);

  // Submit
  const handleSubmit = async (isActive: boolean) => {
    if (!form.title.trim() || !form.slug.trim()) {
      toast.error('Judul dan slug wajib diisi');
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('title',       form.title.trim());
      fd.append('slug',        form.slug.trim());
      fd.append('shortDesc',   form.shortDesc);
      fd.append('description', form.shortDesc);
      fd.append('longDesc',    form.longDesc);
      fd.append('category',    form.category);
      fd.append('client',      form.client);
      fd.append('year',        form.year);
      fd.append('duration',    form.duration);
      fd.append('role',        form.role);
      fd.append('projectUrl',  form.projectUrl);
      fd.append('thumbnail',   form.thumbnail);
      fd.append('image',       form.thumbnail);
      fd.append('heroImage',   form.heroImage);
      fd.append('challenge',   form.challenge);
      fd.append('solution',    form.solution);
      fd.append('result',      form.result);
      fd.append('isActive',    String(isActive));
      fd.append('techStack', JSON.stringify(form.techStack));
      fd.append('metrics',   JSON.stringify(form.metrics));
      fd.append('gallery',   JSON.stringify(form.gallery));

      if (isEdit) {
        await portfolioService.update(id!, fd);
        toast.success('Portfolio berhasil diperbarui!');
      } else {
        await portfolioService.create(fd);
        toast.success('Portfolio berhasil dibuat!');
      }
      navigate('/portfolio');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Operasi gagal');
    } finally {
      setLoading(false);
    }
  };

  // Tech Stack
  const addTech = () => {
    const v = techInput.trim();
    if (!v) return;
    set('techStack', [...form.techStack, v]);
    setTechInput('');
  };
  const removeTech = (idx: number) =>
    set('techStack', form.techStack.filter((_, i) => i !== idx));

  // Metrik
  const addMetric = () => {
    if (!metricInput.value || !metricInput.label) return;
    set('metrics', [...form.metrics, { ...metricInput }]);
    setMetricInput({ value: '', label: '' });
  };
  const removeMetric = (idx: number) =>
    set('metrics', form.metrics.filter((_, i) => i !== idx));

  // Galeri
  const addGalleryImage = (url: string) =>
    set('gallery', [...form.gallery, url]);
  const removeGalleryImage = (idx: number) =>
    set('gallery', form.gallery.filter((_, i) => i !== idx));

  // Skeleton
  if (fetching) {
    return (
      <div className="space-y-5 animate-pulse">
        <div className="w-24 h-8 bg-gray-200 rounded-full" />
        <div className="w-1/2 h-10 bg-gray-200 rounded-full" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-full h-14 bg-gray-100 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <button onClick={() => navigate('/portfolio')}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-dark transition-colors group mb-4">
          <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Portfolio
        </button>
        <h1 className="text-4xl font-display font-bold text-dark">
          {isEdit ? 'Edit Portfolio' : 'Add Portfolio'}
        </h1>
        <p className="text-gray-400 text-sm mt-1 italic">Kelola studi kasus dan proyek</p>
      </div>

      {/* 1. Info Dasar */}
      <SectionCard title="Basic Info">
        <div>
          <Label>Project Title</Label>
          <input type="text" placeholder="cth. Prowerty"
            value={form.title}
            onChange={e => setForm(p => ({
              ...p, title: e.target.value,
              slug: !isEdit ? generateSlug(e.target.value) : p.slug,
            }))}
            className={inputCls}
          />
        </div>

        <div>
          <Label hint="Digunakan sebagai URL: /portofolio/[slug]">Slug</Label>
          <input type="text" placeholder="slug-proyek"
            value={form.slug}
            onChange={e => set('slug', e.target.value)}
            className={inputCls}
          />
        </div>

        <div>
          <Label>Category</Label>
          <select value={form.category}
            onChange={e => set('category', e.target.value)}
            className={inputCls}>
            <option value="">Select Category</option>
            {PORTFOLIO_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <Label hint="Tampil di kartu carousel halaman /portofolio">Deskripsi Singkat</Label>
          <textarea rows={2} placeholder="Ringkasan singkat proyek..."
            value={form.shortDesc}
            onChange={e => set('shortDesc', e.target.value)}
            className={textareaCls}
          />
        </div>

        <ImageUpload
          label="Thumbnail"
          hint="Gambar yang tampil di kartu carousel halaman /portofolio"
          value={form.thumbnail}
          onChange={val => set('thumbnail', val)}
          aspectRatio="4/3"
          folder="portfolio"
        />
      </SectionCard>

      {/* 2. Hero */}
      <SectionCard title="Hero Section" subtitle="Full-screen image at the top of the detail page">
        <ImageUpload
          label="Hero Image"
          hint="Berbeda dari thumbnail — biasanya landscape/wide shot"
          value={form.heroImage}
          onChange={val => set('heroImage', val)}
          aspectRatio="16/9"
          folder="portfolio"
        />
        <div>
          <Label hint="Tampil di halaman detail sebagai deskripsi panjang">Deskripsi Lengkap</Label>
          <textarea rows={4} placeholder="Deskripsi lengkap proyek..."
            value={form.longDesc}
            onChange={e => set('longDesc', e.target.value)}
            className={textareaCls}
          />
        </div>
      </SectionCard>

      {/* 3. Info Proyek */}
      <SectionCard title="Project Info" subtitle="Shown in the info section below hero">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Klien</Label>
            <input type="text" placeholder="Nama klien"
              value={form.client}
              onChange={e => set('client', e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <Label>Tahun</Label>
            <input type="text" placeholder="2024"
              value={form.year}
              onChange={e => set('year', e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <Label>Durasi</Label>
            <input type="text" placeholder="cth. 3 bulan"
              value={form.duration}
              onChange={e => set('duration', e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <Label>Peran</Label>
            <input type="text" placeholder="cth. Full-stack Developer"
              value={form.role}
              onChange={e => set('role', e.target.value)}
              className={inputCls}
            />
          </div>
        </div>

        <div>
          <Label>Tech Stack</Label>
          <div className="flex gap-2">
            <input type="text" placeholder="cth. React"
              value={techInput}
              onChange={e => setTechInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }}
              className={inputCls}
            />
            <button type="button" onClick={addTech}
              className="px-4 py-2 bg-dark text-white text-sm font-semibold rounded-2xl hover:bg-gray-800 transition-colors whitespace-nowrap">
              Tambah
            </button>
          </div>
          {form.techStack.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {form.techStack.map((tech, idx) => (
                <span key={idx}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-dark text-xs font-medium rounded-full">
                  {tech}
                  <button type="button" onClick={() => removeTech(idx)}
                    className="text-gray-400 hover:text-red-400 transition-colors">
                    <X size={11} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </SectionCard>

      {/* 4. Studi Kasus */}
      <SectionCard title="Case Study" subtitle="Challenge, Solution & Results">
        <div>
          <Label>Tantangan</Label>
          <textarea rows={4} placeholder="Apa masalah/tantangan yang dihadapi klien?"
            value={form.challenge}
            onChange={e => set('challenge', e.target.value)}
            className={textareaCls}
          />
        </div>
        <div>
          <Label>Solusi</Label>
          <textarea rows={4} placeholder="Solusi apa yang Winosa berikan?"
            value={form.solution}
            onChange={e => set('solution', e.target.value)}
            className={textareaCls}
          />
        </div>
        <div>
          <Label>Hasil</Label>
          <textarea rows={4} placeholder="Apa hasil yang dicapai setelah proyek selesai?"
            value={form.result}
            onChange={e => set('result', e.target.value)}
            className={textareaCls}
          />
        </div>
      </SectionCard>

      {/* 5. Metrik Utama */}
      <SectionCard title="Key Metrics" subtitle="Highlight numbers from project results (optional)">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Nilai</Label>
            <input type="text" placeholder="cth. +120%"
              value={metricInput.value}
              onChange={e => setMetricInput(p => ({ ...p, value: e.target.value }))}
              className={inputCls}
            />
          </div>
          <div>
            <Label>Keterangan</Label>
            <input type="text" placeholder="cth. Tingkat Konversi"
              value={metricInput.label}
              onChange={e => setMetricInput(p => ({ ...p, label: e.target.value }))}
              className={inputCls}
            />
          </div>
        </div>
        <button type="button" onClick={addMetric}
          className="flex items-center gap-2 px-4 py-2 bg-dark text-white text-sm font-semibold rounded-2xl hover:bg-gray-800 transition-colors">
          <Plus size={13} />
          Add Metric
        </button>

        {form.metrics.length > 0 && (
          <div className="grid grid-cols-2 gap-3 mt-2">
            {form.metrics.map((m, idx) => (
              <div key={idx}
                className="flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl">
                <div>
                  <p className="text-lg font-bold text-dark">{m.value}</p>
                  <p className="text-xs text-gray-400">{m.label}</p>
                </div>
                <button type="button" onClick={() => removeMetric(idx)}
                  className="text-gray-300 hover:text-red-400 transition-colors">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* 6. Galeri */}
      <SectionCard title="Project Gallery"
        subtitle="Opsional — seksi ini otomatis tersembunyi di website jika tidak diisi">
        <div className="grid grid-cols-2 gap-4">
          {form.gallery.map((url, idx) => (
            <div key={idx} className="relative rounded-2xl overflow-hidden border border-gray-200 group">
              <img src={url} alt={`galeri-${idx}`}
                className="w-full h-40 object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button type="button" onClick={() => removeGalleryImage(idx)}
                  className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm hover:bg-red-50 transition-colors">
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <ImageUpload
          label="Add Gallery Photo"
          hint="Klik untuk mengunggah, otomatis ditambahkan ke galeri"
          value=""
          onChange={url => { if (url) addGalleryImage(url); }}
          folder="portfolio"
        />
      </SectionCard>

      {/* 7. URL Proyek */}
      <SectionCard title="Project URL"
        subtitle="Opsional — jika diisi, tombol 'Kunjungi Website' muncul di halaman detail">
        <div>
          <Label hint="Kosongkan jika proyek bersifat privat">URL Website Proyek</Label>
          <input type="text" placeholder="https://..."
            value={form.projectUrl}
            onChange={e => set('projectUrl', e.target.value)}
            className={inputCls}
          />
        </div>
        {form.projectUrl ? (
          <p className="text-xs text-green-600 font-medium">
            ✓ Tombol "Kunjungi Website" akan tampil di halaman detail
          </p>
        ) : (
          <p className="text-xs text-gray-400">
            Tombol "Kunjungi Website" tidak akan ditampilkan
          </p>
        )}
      </SectionCard>

      {/* Aksi */}
      <div className="flex gap-3 pt-2 pb-10">
        <button onClick={() => handleSubmit(false)} disabled={loading}
          className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-2xl text-sm font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50">
          Save as Draft
        </button>
        <button onClick={() => handleSubmit(true)} disabled={loading}
          className="flex-1 py-3 bg-dark text-white rounded-2xl text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50">
          {loading ? 'Saving...' : 'Publish'}
        </button>
      </div>

    </div>
  );
};

export default PortfolioFormPage;