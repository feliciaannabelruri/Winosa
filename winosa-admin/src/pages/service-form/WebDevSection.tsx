import React from 'react';
import { X } from 'lucide-react';
import { SectionCard, Label, AddMoreButton, TagListEditor, inputCls } from './shared/FormShared';
import ImageUpload from './shared/ImageUpload';
import PricingSection from './PricingSection';
import { ServiceFormState, ProcessStep, PricingPlan } from './types';

interface Props {
  form: Pick<
    ServiceFormState,
    | 'heroImage' | 'subtitle'
    | 'process'
    | 'techStack'
    | 'webPricingPlans' | 'whatsappNumber'
  >;
  set: (key: any, val: any) => void;
  onAddProcessStep: () => void;
  onUpdateProcessStep: (idx: number, field: keyof ProcessStep, val: string) => void;
  onRemoveProcessStep: (idx: number) => void;
  onAddTechGroup: () => void;
  onUpdateTechGroupCategory: (gIdx: number, val: string) => void;
  onAddTechToGroup: (gIdx: number, val: string) => void;
  onRemoveTechFromGroup: (gIdx: number, tIdx: number) => void;
  onRemoveTechGroup: (idx: number) => void;
  pricing: {
    addPlan: () => void;
    updatePlan: (idx: number, field: keyof PricingPlan, val: any) => void;
    addPlanFeature: (idx: number, val: string) => void;
    removePlanFeature: (idx: number, fIdx: number) => void;
    removePlan: (idx: number) => void;
    reorderPlan: (from: number, to: number) => void;
  };
}

const WebDevSection: React.FC<Props> = ({
  form, set,
  onAddProcessStep, onUpdateProcessStep, onRemoveProcessStep,
  onAddTechGroup, onUpdateTechGroupCategory,
  onAddTechToGroup, onRemoveTechFromGroup, onRemoveTechGroup,
  pricing,
}) => (
  <>
    {/* ── Hero ── */}
    <SectionCard title="Hero Section" badge="Web Dev" badgeColor="bg-blue-100 text-blue-700">
      <p className="text-xs text-gray-400">
        Title, Description, dan tombol CTA sudah diatur dari sisi user — tidak perlu diubah di sini.
      </p>
      <ImageUpload
        label="Background Image"
        hint="Gambar full-screen di bagian atas halaman Web Dev"
        value={form.heroImage}
        onChange={val => set('heroImage', val)}
        aspectRatio="16/9"
      />
      <div>
        <Label>Subtitle</Label>
        <textarea
          rows={2}
          placeholder="Build fast, secure, and scalable websites for your business"
          value={form.subtitle}
          onChange={e => set('subtitle', e.target.value)}
          className={`${inputCls} resize-none`}
        />
      </div>
    </SectionCard>

    {/* ── Process Steps ── */}
    <SectionCard
      title="Process Steps"
      subtitle="scroll-animated numbered steps"
      badge="Web Dev"
      badgeColor="bg-blue-100 text-blue-700"
    >
      <div className="space-y-3">
        {(form.process ?? []).map((step, idx) => (
          <div key={idx} className="border border-gray-200 rounded-2xl p-4 space-y-3 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400">Step {idx + 1}</span>
              <button
                type="button"
                onClick={() => onRemoveProcessStep(idx)}
                className="text-gray-300 hover:text-red-400 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
            <input
              type="text"
              placeholder="Highlight label (e.g. We start with strategy)"
              value={step.highlight}
              onChange={e => onUpdateProcessStep(idx, 'highlight', e.target.value)}
              className={inputCls}
            />
            <input
              type="text"
              placeholder="Step title"
              value={step.title}
              onChange={e => onUpdateProcessStep(idx, 'title', e.target.value)}
              className={inputCls}
            />
            <textarea
              rows={2}
              placeholder="Step description"
              value={step.desc}
              onChange={e => onUpdateProcessStep(idx, 'desc', e.target.value)}
              className={`${inputCls} resize-none`}
            />
          </div>
        ))}
        <AddMoreButton label="Add Step" onClick={onAddProcessStep} />
      </div>
    </SectionCard>

    {/* ── Tech Stack ── */}
    <SectionCard
      title="Tech Stack"
      subtitle="expand-on-hover panels"
      badge="Web Dev"
      badgeColor="bg-blue-100 text-blue-700"
    >
      <div className="space-y-3">
        {(form.techStack ?? []).map((group, gIdx) => (
          <div key={gIdx} className="border border-gray-200 rounded-2xl p-4 space-y-3 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400">Group {gIdx + 1}</span>
              <button
                type="button"
                onClick={() => onRemoveTechGroup(gIdx)}
                className="text-gray-300 hover:text-red-400 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
            <input
              type="text"
              placeholder="Category (e.g. Frontend)"
              value={group.category}
              onChange={e => onUpdateTechGroupCategory(gIdx, e.target.value)}
              className={inputCls}
            />
            <TagListEditor
              items={group.tech ?? []}
              placeholder="Add tech (e.g. React)"
              onAdd={val => onAddTechToGroup(gIdx, val)}
              onRemove={tIdx => onRemoveTechFromGroup(gIdx, tIdx)}
            />
          </div>
        ))}
        <AddMoreButton label="Add Group (e.g. Frontend, Backend, Database)" onClick={onAddTechGroup} />
      </div>
    </SectionCard>

    {/* ── Pricing ── */}
    <PricingSection
      plans={form.webPricingPlans ?? []}
      badge="Web Dev"
      badgeColor="bg-blue-100 text-blue-700"
      whatsappNumber={form.whatsappNumber}
      onWhatsappChange={val => set('whatsappNumber', val)}
      onAdd={pricing.addPlan}
      onUpdate={pricing.updatePlan}
      onAddFeature={pricing.addPlanFeature}
      onRemoveFeature={pricing.removePlanFeature}
      onRemove={pricing.removePlan}
      onReorder={pricing.reorderPlan}
    />
  </>
);

export default WebDevSection;