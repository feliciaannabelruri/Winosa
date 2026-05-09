import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, X, Plus, Trash2 } from 'lucide-react';
import { portfolioService } from '../services/portfolioService';
import toast from 'react-hot-toast';
import { PORTFOLIO_CATEGORIES } from '../constants';
import ImageUpload from './service-form/shared/ImageUpload';
import type { Testimony } from '../types';

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
  techStack:  string[];
  challenge:  string;
  solution:   string;
  result:     string;
  metrics:    Metric[];
  gallery:    string[];
  testimonials: Testimony[];
  isActive:   boolean;
}

const DEFAULT_FORM: PortfolioForm = {
  title: '', slug: '', shortDesc: '', longDesc: '',
  category: '', client: '', year: new Date().getFullYear().toString(),
  duration: '', role: '', projectUrl: '',
  thumbnail: '',
  techStack: [],
  challenge: '', solution: '', result: '',
  metrics: [],
  gallery: [],
  testimonials: [],
  isActive: true,
};

const PortfolioFormPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate  = useNavigate();
  const { id }    = useParams<{ id: string }>();
  const isEdit    = !!id;

  const [form,     setForm]     = useState<PortfolioForm>(DEFAULT_FORM);
  const [loading,  setLoading]  = useState(false);
  const [fetching, setFetching] = useState(false);

  const [techInput,   setTechInput]   = useState('');
  const [metricInput, setMetricInput] = useState({ value: '', label: '' });

  const [testimonyInput, setTestimonyInput] = useState<Testimony>({
      name: '', role: '', content: '', rating: 5,
  });

  const set = <K extends keyof PortfolioForm>(key: K, val: PortfolioForm[K]) =>
    setForm(p => ({ ...p, [key]: val }));

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
          techStack:  Array.isArray(p.techStack) ? p.techStack : [],
          challenge:  p.challenge   ?? '',
          solution:   p.solution    ?? '',
          result:     p.result      ?? '',
          metrics:    Array.isArray(p.metrics) ? p.metrics : [],
          gallery:    Array.isArray(p.gallery) ? p.gallery : [],
          testimonials: Array.isArray(p.testimonials) ? p.testimonials : [],
          isActive:   p.isActive    ?? true,
        });
      })
      .catch(() => { toast.error(t('portfolio.failedLoad')); navigate('/portfolio'); })
      .finally(() => setFetching(false));
  }, [id, isEdit, navigate]);

  // Submit
  const handleSubmit = async (isActive: boolean) => {
    if (!form.title.trim())     { toast.error(t('portfolio.validation.title')); return; }
    if (!form.slug.trim())      { toast.error(t('portfolio.validation.slug')); return; }
    if (!form.category)         { toast.error(t('portfolio.validation.category')); return; }
    if (!form.shortDesc.trim()) { toast.error(t('portfolio.validation.shortDesc')); return; }
    if (!form.thumbnail)        { toast.error(t('portfolio.validation.thumbnail')); return; }
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
      fd.append('challenge',   form.challenge);
      fd.append('solution',    form.solution);
      fd.append('result',      form.result);
      fd.append('isActive',    String(isActive));
      fd.append('techStack', JSON.stringify(form.techStack));
      fd.append('metrics',   JSON.stringify(form.metrics));
      fd.append('gallery',   JSON.stringify(form.gallery));
      fd.append('testimonials', JSON.stringify(form.testimonials));

      if (isEdit) {
        await portfolioService.update(id!, fd);
        toast.success(t('portfolio.successUpdate'));
      } else {
        await portfolioService.create(fd);
        toast.success(t('portfolio.successCreate'));
      }
      navigate('/portfolio');
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
        t('portfolio.failedOperation')
      );
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

 //Testimony handlers
  const addTestimony = () => {
    if (!testimonyInput.name.trim() || !testimonyInput.content.trim()) return;
    set('testimonials', [...form.testimonials, { ...testimonyInput }]);
    setTestimonyInput({ name: '', role: '', content: '', rating: 5 });
  };
  const removeTestimony = (idx: number) =>
    set('testimonials', form.testimonials.filter((_, i) => i !== idx));
 
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
          {t('portfolio.back')}
        </button>
        <h1 className="text-4xl font-display font-bold text-dark">
          {isEdit ? t('portfolio.editTitle'): t('portfolio.addTitle')}
        </h1>
        <p className="text-gray-400 text-sm mt-1 italic">{t('portfolio.subtitle')}</p>
      </div>

      <SectionCard title={t('portfolio.basicInfo')}>
        <div>
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-2.5">
            <span className="text-xs text-amber-600 font-medium">⚠ {t('portfolio.englishWarning')}</span>
          </div>
          <Label>{t('portfolio.projectTitle')}</Label>
          <input type="text" placeholder={t('portfolio.placeholder.projectTitle')}
            value={form.title}
            onChange={e => setForm(p => ({
              ...p, title: e.target.value,
              slug: !isEdit ? generateSlug(e.target.value) : p.slug,
            }))}
            className={inputCls}
          />
        </div>

        <div>
          <Label hint={t('portfolio.slugHint')}>{t('portfolio.slug')}</Label>
          <input type="text" placeholder={t('portfolio.placeholder.slug')}
            value={form.slug}
            onChange={e => set('slug', e.target.value)}
            className={inputCls}
          />
        </div>

        <div>
          <Label>{t('portfolio.category')}</Label>
          <select value={form.category}
            onChange={e => set('category', e.target.value)}
            className={inputCls}>
            <option value="">{t('portfolio.selectCategory')}</option>
            {PORTFOLIO_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <Label hint={t('portfolio.shortDescHint')}>{t('portfolio.shortDesc')}</Label>
          <textarea rows={2} placeholder={t('portfolio.placeholder.shortDesc')}
            value={form.shortDesc}
            onChange={e => set('shortDesc', e.target.value)}
            className={textareaCls}
          />
        </div>

        <ImageUpload
          label={t('portfolio.thumbnail')}
          hint={t('portfolio.thumbnailHint')}
          value={form.thumbnail}
          onChange={val => set('thumbnail', val)}
          aspectRatio="4/3"
          folder="portfolio"
        />
      </SectionCard>

      <SectionCard title={t('portfolio.detailPage')} subtitle={t('portfolio.detailSubtitle')}>
        <div>
          <Label hint={t('portfolio.longDescHint')}>
            {t('portfolio.longDesc')}
          </Label>
          <textarea rows={6} placeholder={t('portfolio.placeholder.longDesc')}
            value={form.longDesc}
            onChange={e => set('longDesc', e.target.value)}
            className={textareaCls}
          />
        </div>
      </SectionCard>

      <SectionCard title={t('portfolio.projectInfo')} subtitle={t('portfolio.projectInfoSubtitle')}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>{t('portfolio.client')}</Label>
            <input type="text" placeholder={t('portfolio.placeholder.client')}
              value={form.client}
              onChange={e => set('client', e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <Label>{t('portfolio.year')}</Label>
            <input type="text" placeholder="2024"
              value={form.year}
              onChange={e => set('year', e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <Label>{t('portfolio.duration')}</Label>
            <input type="text" placeholder={t('portfolio.placeholder.duration')}
              value={form.duration}
              onChange={e => set('duration', e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <Label>{t('portfolio.role')}</Label>
            <input type="text" placeholder={t('portfolio.placeholder.role')}
              value={form.role}
              onChange={e => set('role', e.target.value)}
              className={inputCls}
            />
          </div>
        </div>

        <div>
          <Label>{t('portfolio.techStack')}</Label>
          <div className="flex gap-2">
            <input type="text" placeholder={t('portfolio.placeholder.tech')}
              value={techInput}
              onChange={e => setTechInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }}
              className={inputCls}
            />
            <button type="button" onClick={addTech}
              className="px-4 py-2 bg-dark text-white text-sm font-semibold rounded-2xl hover:bg-gray-800 transition-colors whitespace-nowrap">
              {t('common.add')}
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

      <SectionCard title={t('portfolio.caseStudy')} subtitle={t('portfolio.caseStudySubtitle')}>
        <div>
          <Label>{t('portfolio.challenge')}</Label>
          <textarea rows={4} placeholder="What challenges or problems did the client face?"
            value={form.challenge}
            onChange={e => set('challenge', e.target.value)}
            className={textareaCls}
          />
        </div>
        <div>
          <Label>{t('portfolio.solution')}</Label>
          <textarea rows={4} placeholder="What solution was provided?"
            value={form.solution}
            onChange={e => set('solution', e.target.value)}
            className={textareaCls}
          />
        </div>
        <div>
          <Label>{t('portfolio.result')}</Label>
          <textarea rows={4} placeholder="What results were achieved after project completion?"
            value={form.result}
            onChange={e => set('result', e.target.value)}
            className={textareaCls}
          />
        </div>
      </SectionCard>

      <SectionCard title="Key Metrics" subtitle="Highlight numbers from project results (optional)">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Value</Label>
            <input type="text" placeholder="e.g. +120%"
              value={metricInput.value}
              onChange={e => setMetricInput(p => ({ ...p, value: e.target.value }))}
              className={inputCls}
            />
          </div>
          <div>
            <Label>Label</Label>
            <input type="text" placeholder="e.g. Conversion Rate"
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

      <SectionCard
        title="Client Testimonials"
        subtitle="Optional — this section will be hidden automatically if left empty">
 
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Client Name</Label>
            <input type="text" placeholder="e.g. Andi Pratama"
              value={testimonyInput.name}
              onChange={e => setTestimonyInput(p => ({ ...p, name: e.target.value }))}
              className={inputCls}
            />
          </div>
          <div>
            <Label>Role / Position</Label>
            <input type="text" placeholder="e.g. CEO of Prowerty"
              value={testimonyInput.role}
              onChange={e => setTestimonyInput(p => ({ ...p, role: e.target.value }))}
              className={inputCls}
            />
          </div>
        </div>
 
        <div>
          <Label>Testimony Content</Label>
          <textarea rows={3} placeholder="What did they say about the project?"
            value={testimonyInput.content}
            onChange={e => setTestimonyInput(p => ({ ...p, content: e.target.value }))}
            className={textareaCls}
          />
        </div>
 
        <div>
          <Label>Rating</Label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(star => (
              <button key={star} type="button"
                onClick={() => setTestimonyInput(p => ({ ...p, rating: star }))}
                className={`text-2xl transition-colors ${
                  star <= testimonyInput.rating ? 'text-amber-400' : 'text-gray-200'
                }`}>
                ★
              </button>
            ))}
          </div>
        </div>
 
        <button type="button" onClick={addTestimony}
          className="flex items-center gap-2 px-4 py-2 bg-dark text-white text-sm font-semibold rounded-2xl hover:bg-gray-800 transition-colors">
          <Plus size={13} />
          Add Testimony
        </button>
 
        {form.testimonials.length > 0 && (
          <div className="space-y-3 mt-2">
            {form.testimonials.map((t, idx) => (
              <div key={idx} className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-dark">{t.name}</p>
                    {t.role && (
                      <>
                        <span className="text-gray-300 text-xs">·</span>
                        <p className="text-xs text-gray-400">{t.role}</p>
                      </>
                    )}
                  </div>
                  <p className="text-amber-400 text-sm mb-1">
                    {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-2">"{t.content}"</p>
                </div>
                <button type="button" onClick={() => removeTestimony(idx)}
                  className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0 mt-0.5">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard title="Project Gallery"
        subtitle="Optional — this section will be hidden automatically if left empty">
        <div className="grid grid-cols-2 gap-4">
          {form.gallery.map((url, idx) => (
            <div key={idx} className="relative rounded-2xl overflow-hidden border border-gray-200 group">
              <img src={url} alt={`gallery-${idx}`}
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
          hint="Click to upload — image will be added automatically to gallery"
          value=""
          onChange={url => { if (url) addGalleryImage(url); }}
          folder="portfolio"
        />
      </SectionCard>

      <SectionCard title="Project URL"
        subtitle="Optional — if filled, the 'Visit Website' button will appear on the detail page">
        <div>
          <Label hint="Leave empty if the project is private">Project Website URL</Label>
          <input type="text" placeholder="https://..."
            value={form.projectUrl}
            onChange={e => set('projectUrl', e.target.value)}
            className={inputCls}
          />
        </div>
        {form.projectUrl ? (
          <p className="text-xs text-green-600 font-medium">
            ✓ "Visit Website" button will appear on the detail page
          </p>
        ) : (
          <p className="text-xs text-gray-400">
            The "Visit Website" button will not be displayed
          </p>
        )}
      </SectionCard>

      <div className="flex gap-3 pt-2 pb-10">
        <button onClick={() => handleSubmit(false)} disabled={loading}
          className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-2xl text-sm font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50">
          {t('portfolio.saveDraft')}
        </button>
        <button onClick={() => handleSubmit(true)} disabled={loading}
          className="flex-1 py-3 bg-dark text-white rounded-2xl text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50">
          {loading
            ? t('common.saving')
            : t('portfolio.publish')}
        </button>
      </div>

    </div>
  );
};

export default PortfolioFormPage;