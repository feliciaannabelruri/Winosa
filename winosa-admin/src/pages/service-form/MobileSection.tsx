import React from 'react';
import { X } from 'lucide-react';
import { SectionCard, AddMoreButton, TagListEditor, inputCls } from './shared/FormShared';
import ImageUpload from './shared/ImageUpload';
import PricingSection from './PricingSection';
import { ServiceFormState, MobileFeature, MobileTechItem, PricingPlan } from './types';

interface Props {
  form: Pick<
    ServiceFormState,
    | 'heroImagePrimary' | 'heroImageSecondary'
    | 'mobileFeatures'
    | 'mobileTech'
    | 'mobilePricingPlans' | 'whatsappNumber'
  >;
  set: (key: any, val: any) => void;
  onAddMobileFeature: () => void;
  onUpdateMobileFeature: (idx: number, field: keyof MobileFeature, val: string) => void;
  onRemoveMobileFeature: (idx: number) => void;
  onAddMobileTech: () => void;
  onUpdateMobileTech: (idx: number, field: 'title' | 'desc', val: string) => void;
  onAddMobileTechItem: (tIdx: number, val: string) => void;
  onRemoveMobileTechItem: (tIdx: number, iIdx: number) => void;
  onRemoveMobileTech: (idx: number) => void;
  pricing: {
    addPlan: () => void;
    updatePlan: (idx: number, field: keyof PricingPlan, val: any) => void;
    addPlanFeature: (idx: number, val: string) => void;
    removePlanFeature: (idx: number, fIdx: number) => void;
    removePlan: (idx: number) => void;
    reorderPlan: (from: number, to: number) => void;
  };
}

const MobileSection: React.FC<Props> = ({
  form, set,
  onAddMobileFeature, onUpdateMobileFeature, onRemoveMobileFeature,
  onAddMobileTech, onUpdateMobileTech,
  onAddMobileTechItem, onRemoveMobileTechItem, onRemoveMobileTech,
  pricing,
}) => (
  <>
    {/* ── Hero ── */}
    <SectionCard
      title="Hero Section"
      subtitle="split layout dengan 2 mockup smartphone"
      badge="Mobile"
      badgeColor="bg-green-100 text-green-700"
    >
      <p className="text-xs text-gray-400">
        Title, Description, dan tombol CTA sudah diatur dari sisi user — tidak perlu diubah di sini.
      </p>
      <ImageUpload
        label="App Screen — Belakang"
        hint="Gambar di belakang, rotasi -12°"
        value={form.heroImageSecondary}
        onChange={val => set('heroImageSecondary', val)}
        aspectRatio="9/16"
      />
      <ImageUpload
        label="App Screen — Depan"
        hint="Gambar di depan, rotasi 8°"
        value={form.heroImagePrimary}
        onChange={val => set('heroImagePrimary', val)}
        aspectRatio="9/16"
      />
    </SectionCard>

    {/* ── App Features ── */}
    <SectionCard
      title="App Features"
      subtitle="grid 3 kolom dengan hover glow"
      badge="Mobile"
      badgeColor="bg-green-100 text-green-700"
    >
      <div className="space-y-3">
        {(form.mobileFeatures ?? []).map((feat, idx) => (
          <div key={idx} className="border border-gray-200 rounded-2xl p-4 space-y-3 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400">Feature {idx + 1}</span>
              <button
                type="button"
                onClick={() => onRemoveMobileFeature(idx)}
                className="text-gray-300 hover:text-red-400 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
            <input
              type="text"
              placeholder="Feature title"
              value={feat.title}
              onChange={e => onUpdateMobileFeature(idx, 'title', e.target.value)}
              className={inputCls}
            />
            <textarea
              rows={2}
              placeholder="Feature description"
              value={feat.desc}
              onChange={e => onUpdateMobileFeature(idx, 'desc', e.target.value)}
              className={`${inputCls} resize-none`}
            />
          </div>
        ))}
        <AddMoreButton label="Add Feature (max 6)" onClick={onAddMobileFeature} />
      </div>
    </SectionCard>

    {/* ── Tech Stack ── */}
    <SectionCard
      title="Tech Stack"
      subtitle="list baris dengan badge teknologi"
      badge="Mobile"
      badgeColor="bg-green-100 text-green-700"
    >
      <div className="space-y-3">
        {(form.mobileTech ?? []).map((tech, tIdx) => (
          <div key={tIdx} className="border border-gray-200 rounded-2xl p-4 space-y-3 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400">Tech {tIdx + 1}</span>
              <button
                type="button"
                onClick={() => onRemoveMobileTech(tIdx)}
                className="text-gray-300 hover:text-red-400 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
            <input
              type="text"
              placeholder="Category title (e.g. Mobile Framework)"
              value={tech.title}
              onChange={e => onUpdateMobileTech(tIdx, 'title', e.target.value)}
              className={inputCls}
            />
            <textarea
              rows={2}
              placeholder="Short description"
              value={tech.desc}
              onChange={e => onUpdateMobileTech(tIdx, 'desc', e.target.value)}
              className={`${inputCls} resize-none`}
            />
            <TagListEditor
              items={tech.items ?? []}
              placeholder="Add item (e.g. Flutter)"
              onAdd={val => onAddMobileTechItem(tIdx, val)}
              onRemove={iIdx => onRemoveMobileTechItem(tIdx, iIdx)}
            />
          </div>
        ))}
        <AddMoreButton label="Add Tech Category" onClick={onAddMobileTech} />
      </div>
    </SectionCard>

    {/* ── Pricing ── */}
    <PricingSection
      plans={form.mobilePricingPlans ?? []}
      badge="Mobile"
      badgeColor="bg-green-100 text-green-700"
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

export default MobileSection;