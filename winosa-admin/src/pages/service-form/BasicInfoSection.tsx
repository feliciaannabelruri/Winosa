import React from 'react';
import { SectionCard, Label, FeatureListEditor, inputCls } from './shared/FormShared';
import IconPicker from './shared/IconPicker';
import { DETAIL_SLUGS, DetailSlug } from './types';

interface Props {
  form: {
    title: string;
    slug: string;
    description: string;
    icon: string;
    price: string;
    features: string[];
    whatsappNumber: string;
  };
  isEdit: boolean;
  onTitleChange: (val: string) => void;
  onSlugChange: (val: string) => void;
  onDescChange: (val: string) => void;
  onIconChange: (val: string) => void;
  onPriceChange: (val: string) => void;
  onAddFeature: (val: string) => void;
  onRemoveFeature: (idx: number) => void;
  onWhatsappChange: (val: string) => void;
}

const BasicInfoSection: React.FC<Props> = ({
  form, isEdit,
  onTitleChange, onSlugChange, onDescChange,
  onIconChange, onPriceChange,
  onAddFeature, onRemoveFeature,
  onWhatsappChange,
}) => {
  const isDetailSlug = DETAIL_SLUGS.includes(form.slug as DetailSlug);

  return (
    <SectionCard title="Basic Info">
      {/* Title */}
      <div>
        <Label>Service Title</Label>
        <input
          type="text"
          placeholder="e.g. Web Development"
          value={form.title}
          onChange={e => onTitleChange(e.target.value)}
          className={inputCls}
        />
      </div>

      {/* Slug */}
      <div>
        <Label hint="Slug menentukan URL halaman dan jenis tampilan di website">Slug</Label>
        <input
          type="text"
          placeholder="web-development"
          value={form.slug}
          onChange={e => onSlugChange(e.target.value)}
          className={inputCls}
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {DETAIL_SLUGS.map(s => (
            <button
              key={s}
              type="button"
              onClick={() => onSlugChange(s)}
              className={`px-3 py-1 rounded-full text-xs border font-medium transition-colors ${
                form.slug === s
                  ? 'bg-dark text-white border-dark'
                  : 'border-gray-200 text-gray-500 hover:border-gray-400'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        {isDetailSlug && (
          <p className="text-xs text-primary font-medium mt-2">
            Slug ini memiliki halaman detail — form tambahan tersedia di bawah.
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <Label>Description</Label>
        <textarea
          placeholder="Brief description of the service"
          value={form.description}
          onChange={e => onDescChange(e.target.value)}
          rows={3}
          className={`${inputCls} resize-none`}
        />
      </div>

      {/* Icon */}
      <div>
        <Label>Icon</Label>
        <IconPicker value={form.icon} onChange={onIconChange} />
      </div>

      {/* Price */}
      <div>
        <Label hint='Prefix "Starting from" otomatis dihapus saat ditampilkan. Dipakai di pricing card halaman /Services.'>
          Price
        </Label>
        <input
          type="text"
          placeholder="e.g. Starting from $999"
          value={form.price}
          onChange={e => onPriceChange(e.target.value)}
          className={inputCls}
        />
      </div>

      {/* Features */}
      <div>
        <Label hint="Tampil di pricing card /Services dan Features section UI/UX">Features</Label>
        <FeatureListEditor
          items={form.features ?? []}
          onAdd={onAddFeature}
          onRemove={onRemoveFeature}
        />
      </div>

      {/* WhatsApp Number — shown for all services */}
      <div>
        <Label hint='Nomor WA untuk tombol pricing di halaman /Services. Detail page punya setting WA sendiri di section Pricing.'>
          WhatsApp Number
        </Label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-mono">
            wa.me/
          </span>
          <input
            type="text"
            placeholder="6281234567890"
            value={form.whatsappNumber}
            onChange={e => onWhatsappChange(e.target.value.replace(/\D/g, ''))}
            className={`${inputCls} pl-16 font-mono`}
          />
        </div>
      </div>
    </SectionCard>
  );
};

export default BasicInfoSection;