import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import { useServiceForm } from './service-form/useServiceForm';
import { DETAIL_SLUGS, DetailSlug } from './service-form/types';
import BasicInfoSection from './service-form/BasicInfoSection';
import WebDevSection    from './service-form/WebDevSection';
import MobileSection    from './service-form/MobileSection';
import UiUxSection      from './service-form/UiUxSection';

/* ─── Shared UI primitives (mirroring PortfolioFormPage) ─── */

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

/* ─── Page ─── */

const ServiceFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id }   = useParams<{ id: string }>();

  const {
    form, isEdit, loading, fetching,
    set, setTitle, handleSubmit,
    addFeature, removeFeature,
    addTool, removeTool,
    addProcessStep, updateProcessStep, removeProcessStep,
    addTechGroup, updateTechGroupCategory,
    addTechToGroup, removeTechFromGroup, removeTechGroup,
    addMobileFeature, updateMobileFeature, removeMobileFeature,
    addMobileTech, updateMobileTech,
    addMobileTechItem, removeMobileTechItem, removeMobileTech,
    webPricing, mobilePricing, uiuxPricing,
  } = useServiceForm(id);

  const slugType: DetailSlug | null =
    DETAIL_SLUGS.includes(form.slug as DetailSlug) ? (form.slug as DetailSlug) : null;

  /* ── Skeleton (matches PortfolioFormPage skeleton) ── */
  if (fetching) {
    return (
      <div className="space-y-5 animate-pulse">
        <div className="w-24 h-8 bg-gray-200 rounded-full" />
        <div className="w-1/2 h-10 bg-gray-200 rounded-full" />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-full h-14 bg-gray-100 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div>
        <button
          onClick={() => navigate('/services')}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-dark transition-colors group mb-4"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Services
        </button>
        <h1 className="text-4xl font-display font-bold text-dark">
          {isEdit ? 'Edit Service' : 'Add Service'}
        </h1>
        <p className="text-gray-400 text-sm mt-1 italic">Manage Winosa services content</p>
      </div>

      {/* ── 1. Basic Info ── */}
      <SectionCard title="Basic Info" subtitle="Title, slug, description, icon, price, and features">
        <BasicInfoSection
          form={form}
          isEdit={isEdit}
          onTitleChange={setTitle}
          onSlugChange={val => set('slug', val)}
          onDescChange={val => set('description', val)}
          onIconChange={val => set('icon', val)}
          onPriceChange={val => set('price', val)}
          onAddFeature={addFeature}
          onRemoveFeature={removeFeature}
          onWhatsappChange={val => set('whatsappNumber', val)}
        />
      </SectionCard>

      {/* ── 2. Web Development extras ── */}
      {slugType === 'web-development' && (
        <SectionCard title="Web Development Details" subtitle="Process steps, tech stack groups, and pricing">
          <WebDevSection
            form={form}
            set={set}
            onAddProcessStep={addProcessStep}
            onUpdateProcessStep={updateProcessStep}
            onRemoveProcessStep={removeProcessStep}
            onAddTechGroup={addTechGroup}
            onUpdateTechGroupCategory={updateTechGroupCategory}
            onAddTechToGroup={addTechToGroup}
            onRemoveTechFromGroup={removeTechFromGroup}
            onRemoveTechGroup={removeTechGroup}
            pricing={webPricing}
          />
        </SectionCard>
      )}

      {/* ── 3. Mobile App extras ── */}
      {slugType === 'mobile-app-development' && (
        <SectionCard title="Mobile App Details" subtitle="Features, tech stack, and pricing">
          <MobileSection
            form={form}
            set={set}
            onAddMobileFeature={addMobileFeature}
            onUpdateMobileFeature={updateMobileFeature}
            onRemoveMobileFeature={removeMobileFeature}
            onAddMobileTech={addMobileTech}
            onUpdateMobileTech={updateMobileTech}
            onAddMobileTechItem={addMobileTechItem}
            onRemoveMobileTechItem={removeMobileTechItem}
            onRemoveMobileTech={removeMobileTech}
            pricing={mobilePricing}
          />
        </SectionCard>
      )}

      {/* ── 4. UI/UX extras ── */}
      {slugType === 'ui-ux-design' && (
        <SectionCard title="UI/UX Design Details" subtitle="Tools and pricing">
          <UiUxSection
            form={form}
            set={set}
            onAddTool={addTool}
            onRemoveTool={removeTool}
            pricing={uiuxPricing}
          />
        </SectionCard>
      )}

      {/* ── Actions ── */}
      <div className="flex gap-3 pt-2 pb-10">
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
  );
};

export default ServiceFormPage;