import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useServiceForm } from './service-form/useServiceForm';
import IconPicker from './service-form/shared/IconPicker';
import { inputCls } from './service-form/shared/FormShared';
import { useTranslation } from 'react-i18next'; 

const Card: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 space-y-5">
    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</p>
    {children}
  </div>
);

const Field: React.FC<{
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}> = ({ label, required, hint, children }) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-semibold text-dark">
      {label}
      {required && <span className="text-red-400 ml-1">*</span>}
    </label>
    {children}
    {hint && <p className="text-xs text-gray-400">{hint}</p>}
  </div>
);

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-5 animate-pulse">
    <div className="w-24 h-8 bg-gray-200 rounded-full" />
    <div className="w-1/2 h-10 bg-gray-200 rounded-full" />
    {[...Array(3)].map((_, i) => (
      <div key={i} className="w-full h-14 bg-gray-100 rounded-2xl" />
    ))}
  </div>
);

const ServiceFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id }   = useParams<{ id: string }>();
  const { t }    = useTranslation(); 

  const {
    form, isEdit, loading, fetching,
    set, setTitle, handleSubmit,
  } = useServiceForm(id);

  if (fetching) return <LoadingSkeleton />;

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/services')}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-dark transition-colors group mb-4"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          {t('service_back')} {/* ← GANTI */}
        </button>
        <h1 className="text-4xl font-display font-bold text-dark">
          {isEdit ? t('service_edit') : t('service_add')} {/* ← GANTI */}
        </h1>
        <p className="text-gray-400 text-sm mt-1 italic">
          {isEdit ? t('service_edit_subtitle') : t('service_add_subtitle')} {/* ← GANTI */}
        </p>
      </div>

      {/* Form Card */}
      <Card title={t('service_info')}> {/* ← GANTI */}

        <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-2.5">
          <span className="text-xs text-amber-600 font-medium">⚠ {t('blog_english_warning')}</span> {/* ← GANTI (reuse key) */}
        </div>

        <Field label={t('service_icon')} required> {/* ← GANTI */}
          <IconPicker value={form.icon} onChange={val => set('icon', val)} />
        </Field>

        <Field label={t('title')} required> {/* ← GANTI */}
          <input
            type="text"
            placeholder="e.g. Web Development"
            value={form.title}
            onChange={e => setTitle(e.target.value)}
            className={inputCls}
          />
        </Field>

        <Field
          label={t('description')} 
          hint={`${form.description.length} / 300 ${t('service_desc_hint')}`} 
        >
          <textarea
            placeholder={t('service_desc_placeholder')} 
            value={form.description}
            onChange={e => set('description', e.target.value)}
            rows={4}
            maxLength={300}
            className={`${inputCls} resize-none`}
          />
        </Field>

      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2 pb-10">
        <button
          onClick={() => handleSubmit(false)}
          disabled={loading}
          className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-2xl text-sm font-semibold italic hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          {t('draft')} {/* ← GANTI */}
        </button>
        <button
          onClick={() => handleSubmit(true)}
          disabled={loading}
          className="flex-1 py-3 bg-dark text-white rounded-2xl text-sm font-semibold italic hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {loading ? t('saving') : t('published')} {/* ← GANTI */}
        </button>
      </div>

    </div>
  );
};

export default ServiceFormPage;