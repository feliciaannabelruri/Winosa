import React from 'react';
import { SectionCard, Label, FeatureListEditor, inputCls } from './shared/FormShared';
import IconPicker from './shared/IconPicker';

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
  return (
    <SectionCard title="Service Info">
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
        <Label hint="Digunakan sebagai URL: /services/[slug]">Slug</Label>
        <input
          type="text"
          placeholder="web-development"
          value={form.slug}
          onChange={e => onSlugChange(e.target.value)}
          className={inputCls}
        />
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
        <Label hint='Ditampilkan di pricing card halaman /Services'>
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
        <Label hint="Tampil di pricing card halaman /Services">Features</Label>
        <FeatureListEditor
          items={form.features ?? []}
          onAdd={onAddFeature}
          onRemove={onRemoveFeature}
        />
      </div>

      {/* WhatsApp Number */}
      <div>
        <Label hint="Nomor WA untuk tombol pricing di halaman /Services">
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