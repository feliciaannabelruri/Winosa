import React from 'react';
import { SectionCard, Label, TagListEditor, inputCls } from './shared/FormShared';
import ImageUpload from './shared/ImageUpload';
import PricingSection from './PricingSection';
import { ServiceFormState, PricingPlan } from './types';

interface Props {
  form: Pick<
    ServiceFormState,
    | 'ctaText' | 'heroLeftImage' | 'heroRightImage'
    | 'techTitle' | 'techDescription' | 'tools'
    | 'uiuxPricingPlans' | 'whatsappNumber'
  >;
  set: (key: any, val: any) => void;
  onAddTool: (val: string) => void;
  onRemoveTool: (idx: number) => void;
  pricing: {
    addPlan: () => void;
    updatePlan: (idx: number, field: keyof PricingPlan, val: any) => void;
    addPlanFeature: (idx: number, val: string) => void;
    removePlanFeature: (idx: number, fIdx: number) => void;
    removePlan: (idx: number) => void;
    reorderPlan: (from: number, to: number) => void;
  };
}

const UiUxSection: React.FC<Props> = ({
  form, set, onAddTool, onRemoveTool, pricing,
}) => (
  <>
    {/* Hero */}
    <SectionCard
      title="Hero Section"
      subtitle="fullscreen dengan 2 panel gambar"
      badge="UI/UX"
      badgeColor="bg-purple-100 text-purple-700"
    >
      <p className="text-xs text-gray-400">Title dan Description diambil dari Basic Info.</p>
      <div>
        <Label>CTA Text</Label>
        <input type="text" placeholder="Let's Design Together"
          value={form.ctaText}
          onChange={e => set('ctaText', e.target.value)}
          className={inputCls}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ImageUpload
          label="Panel Kiri"
          hint="Slide masuk dari kiri"
          value={form.heroLeftImage}
          onChange={val => set('heroLeftImage', val)}
          aspectRatio="3/4"
        />
        <ImageUpload
          label="Panel Kanan"
          hint="Slide masuk dari kanan"
          value={form.heroRightImage}
          onChange={val => set('heroRightImage', val)}
          aspectRatio="3/4"
        />
      </div>
    </SectionCard>

    {/* Features note */}
    <div className="px-5 py-4 bg-gray-50 rounded-2xl border border-gray-200 text-sm text-gray-500">
      <span className="font-semibold text-dark">Features Section</span> — Diambil dari daftar Features di Basic Info. Setiap item tampil sebagai baris timeline dengan icon.
    </div>

    {/* Tools / Tech (marquee) */}
    <SectionCard
      title="Tools & Technology"
      subtitle="marquee animasi bergerak horizontal"
      badge="UI/UX"
      badgeColor="bg-purple-100 text-purple-700"
    >
      <div>
        <Label>Section Title</Label>
        <input type="text" placeholder="Tools & Technology"
          value={form.techTitle}
          onChange={e => set('techTitle', e.target.value)}
          className={inputCls}
        />
      </div>
      <div>
        <Label>Section Description</Label>
        <textarea rows={2} placeholder="Modern design ecosystem that empowers structured, scalable, and collaborative workflows"
          value={form.techDescription}
          onChange={e => set('techDescription', e.target.value)}
          className={`${inputCls} resize-none`}
        />
      </div>
      <div>
        <Label>Tools</Label>
        <TagListEditor
          items={form.tools ?? []}
          placeholder="e.g. Figma"
          onAdd={onAddTool}
          onRemove={onRemoveTool}
        />
      </div>
    </SectionCard>

    {/* Pricing */}
    <PricingSection
      plans={form.uiuxPricingPlans ?? []}
      badge="UI/UX"
      badgeColor="bg-purple-100 text-purple-700"
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

export default UiUxSection;