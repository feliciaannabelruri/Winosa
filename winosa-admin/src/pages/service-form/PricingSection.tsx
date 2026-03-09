import React, { useState } from 'react';
import { Plus, X, ChevronDown } from 'lucide-react';
import { SectionCard, Label, TagListEditor, inputCls } from './shared/FormShared';
import { PricingPlan } from './types';

interface Props {
  plans: PricingPlan[];
  badge: string;
  badgeColor: string;
  whatsappNumber: string;
  onWhatsappChange: (val: string) => void;
  onAdd: () => void;
  onUpdate: (idx: number, field: keyof PricingPlan, val: any) => void;
  onAddFeature: (idx: number, val: string) => void;
  onRemoveFeature: (idx: number, fIdx: number) => void;
  onRemove: (idx: number) => void;
  onReorder: (from: number, to: number) => void;
}

const PlanCard: React.FC<{
  plan: PricingPlan;
  index: number;
  total: number;
  onUpdate: (field: keyof PricingPlan, val: any) => void;
  onAddFeature: (val: string) => void;
  onRemoveFeature: (fIdx: number) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}> = ({ plan, index, total, onUpdate, onAddFeature, onRemoveFeature, onRemove, onMoveUp, onMoveDown }) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
      {/* Plan header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
        <div className="flex items-center gap-3">
          {/* Reorder */}
          <div className="flex flex-col gap-0.5">
            <button
              type="button"
              onClick={onMoveUp}
              disabled={index === 0}
              className="text-gray-300 hover:text-dark disabled:opacity-20 transition-colors leading-none"
            >
              ▲
            </button>
            <button
              type="button"
              onClick={onMoveDown}
              disabled={index === total - 1}
              className="text-gray-300 hover:text-dark disabled:opacity-20 transition-colors leading-none"
            >
              ▼
            </button>
          </div>
          <div>
            <span className="text-sm font-semibold text-dark">{plan.name || `Plan ${index + 1}`}</span>
            {plan.price && (
              <span className="ml-2 text-xs text-gray-400">
                {plan.type === 'custom' ? 'Custom' : plan.price}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOpen(v => !v)}
            className="text-gray-400 hover:text-dark transition-colors"
          >
            <ChevronDown size={15} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="text-gray-300 hover:text-red-400 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {open && (
        <div className="p-4 space-y-3">
          {/* Type toggle */}
          <div>
            <Label>Tipe Plan</Label>
            <div className="flex gap-2">
              {(['normal', 'custom'] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => onUpdate('type', t)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors capitalize ${
                    plan.type === t
                      ? 'bg-dark text-white border-dark'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {t === 'normal' ? 'Dengan Harga' : 'Custom / Contact'}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <Label>Nama Plan</Label>
            <input
              type="text"
              placeholder="e.g. Starter, Business, Enterprise"
              value={plan.name}
              onChange={e => onUpdate('name', e.target.value)}
              className={inputCls}
            />
          </div>

          {/* Description */}
          <div>
            <Label>Deskripsi Singkat</Label>
            <input
              type="text"
              placeholder="e.g. Best for startup and growing business"
              value={plan.desc}
              onChange={e => onUpdate('desc', e.target.value)}
              className={inputCls}
            />
          </div>

          {/* Price — only for normal type */}
          {plan.type === 'normal' && (
            <div>
              <Label>Harga</Label>
              <input
                type="text"
                placeholder="e.g. $999"
                value={plan.price}
                onChange={e => onUpdate('price', e.target.value)}
                className={inputCls}
              />
            </div>
          )}

          {/* CTA Link — for custom type */}
          {plan.type === 'custom' && (
            <div>
              <Label hint="Halaman yang dituju tombol Custom (e.g. /Services/customWeb)">
                CTA Link
              </Label>
              <input
                type="text"
                placeholder="/Services/customWeb"
                value={plan.ctaLink || ''}
                onChange={e => onUpdate('ctaLink', e.target.value)}
                className={inputCls}
              />
            </div>
          )}

          {/* Features */}
          <div>
            <Label>Features</Label>
            <TagListEditor
              items={plan.features ?? []}
              placeholder="e.g. Responsive Design"
              onAdd={onAddFeature}
              onRemove={onRemoveFeature}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const PricingSection: React.FC<Props> = ({
  plans, badge, badgeColor,
  whatsappNumber, onWhatsappChange,
  onAdd, onUpdate, onAddFeature, onRemoveFeature, onRemove, onReorder,
}) => (
  <SectionCard
    title="Pricing Plans"
    subtitle="semua paket harga bisa diedit"
    badge={badge}
    badgeColor={badgeColor}
  >
    {/* WhatsApp number — shared for all normal plan buttons */}
    <div>
      <Label hint='Nomor WA untuk tombol "Get Started" (tanpa +, contoh: 6281234567890)'>
        WhatsApp Number
      </Label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-mono">
          wa.me/
        </span>
        <input
          type="text"
          placeholder="6281234567890"
          value={whatsappNumber}
          onChange={e => onWhatsappChange(e.target.value.replace(/\D/g, ''))}
          className={`${inputCls} pl-16 font-mono`}
        />
      </div>
      <p className="text-xs text-gray-400 mt-1">
        Preview: <span className="font-mono text-dark">https://wa.me/{whatsappNumber || '...'}</span>
      </p>
    </div>

    <div className="space-y-3">
      {(plans ?? []).map((plan, idx) => (
        <PlanCard
          key={idx}
          plan={plan}
          index={idx}
          total={plans.length}
          onUpdate={(field, val) => onUpdate(idx, field, val)}
          onAddFeature={val => onAddFeature(idx, val)}
          onRemoveFeature={fIdx => onRemoveFeature(idx, fIdx)}
          onRemove={() => onRemove(idx)}
          onMoveUp={() => onReorder(idx, idx - 1)}
          onMoveDown={() => onReorder(idx, idx + 1)}
        />
      ))}

      <button
        type="button"
        onClick={onAdd}
        className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-gray-300 rounded-2xl text-sm text-gray-400 hover:border-dark hover:text-dark transition-colors"
      >
        <Plus size={14} />
        Add Plan
      </button>
    </div>
  </SectionCard>
);

export default PricingSection;