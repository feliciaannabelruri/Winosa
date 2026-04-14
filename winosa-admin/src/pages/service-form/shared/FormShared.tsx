import React, { useState } from 'react';
import { ChevronDown, Plus, X } from 'lucide-react';

export const inputCls =
  'w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-dark bg-gray-50 transition-colors';

// Label 
export const Label: React.FC<{ children: React.ReactNode; hint?: string }> = ({ children, hint }) => (
  <div className="mb-2">
    <label className="block text-sm font-semibold text-dark">{children}</label>
    {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
  </div>
);

// Section Card (collapsible) 
export const SectionCard: React.FC<{
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}> = ({ title, subtitle, badge, badgeColor = 'bg-primary/20 text-dark', children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold text-dark text-sm">{title}</span>
          {badge && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${badgeColor}`}>
              {badge}
            </span>
          )}
          {subtitle && (
            <span className="text-xs text-gray-400 hidden sm:block">{subtitle}</span>
          )}
        </div>
        <ChevronDown
          size={15}
          className={`text-gray-400 transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <div className="px-6 py-5 space-y-4">{children}</div>}
    </div>
  );
};

// Tag List Editor
export const TagListEditor: React.FC<{
  items: string[];
  placeholder: string;
  onAdd: (val: string) => void;
  onRemove: (idx: number) => void;
}> = ({ items, placeholder, onAdd, onRemove }) => {
  const [input, setInput] = useState('');
  const handleAdd = () => {
    const v = input.trim();
    if (!v) return;
    onAdd(v);
    setInput('');
  };
  return (
    <div className="space-y-3">
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {items.map((item, idx) => (
            <span
              key={idx}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-sm text-dark"
            >
              {item}
              <button
                type="button"
                onClick={() => onRemove(idx)}
                className="text-gray-400 hover:text-red-400 transition-colors"
              >
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder={placeholder}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAdd(); } }}
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-dark bg-gray-50 transition-colors"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!input.trim()}
          className="px-4 py-2.5 bg-dark text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Add
        </button>
      </div>
    </div>
  );
};

// Feature List Editor
export const FeatureListEditor: React.FC<{
  items: string[];
  placeholder?: string;
  onAdd: (val: string) => void;
  onRemove: (idx: number) => void;
}> = ({ items, placeholder = 'e.g. Responsive Design', onAdd, onRemove }) => {
  const [input, setInput] = useState('');
  const handleAdd = () => {
    const v = input.trim();
    if (!v) return;
    onAdd(v);
    setInput('');
  };
  return (
    <div className="space-y-3">
      {items.length > 0 && (
        <div className="space-y-2">
          {items.map((feat, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-3 bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-100"
            >
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                <span className="text-sm text-dark">{feat}</span>
              </div>
              <button
                type="button"
                onClick={() => onRemove(idx)}
                className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder={placeholder}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAdd(); } }}
          className="flex-1 border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-dark bg-gray-50 transition-colors"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!input.trim()}
          className="flex items-center gap-1.5 px-4 py-3 bg-dark text-white rounded-2xl text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus size={14} />
          Add
        </button>
      </div>
    </div>
  );
};

// Add More Button
export const AddMoreButton: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-gray-300 rounded-2xl text-sm text-gray-400 hover:border-dark hover:text-dark transition-colors"
  >
    <Plus size={14} />
    {label}
  </button>
);