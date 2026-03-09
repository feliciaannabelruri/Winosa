import React from 'react';
import {
  Monitor, Briefcase, Smartphone, CloudCog, Palette, Shield, Code,
  TrendingUp, Globe, Layers, Zap, Settings, Database, Lock, BarChart,
  Mail, Search, Star, Cpu, Layout, PenTool, Camera, Video, Music,
  ShoppingCart, Users, Heart, MessageSquare, Map, Clock, Wifi, Terminal,
  Package, X,
} from 'lucide-react';

export const ICON_OPTIONS: { key: string; label: string; Icon: React.FC<any> }[] = [
  { key: 'monitor',        label: 'Monitor',      Icon: Monitor },
  { key: 'briefcase',      label: 'Briefcase',    Icon: Briefcase },
  { key: 'smartphone',     label: 'Smartphone',   Icon: Smartphone },
  { key: 'cloud',          label: 'Cloud',        Icon: CloudCog },
  { key: 'palette',        label: 'Palette',      Icon: Palette },
  { key: 'shield',         label: 'Shield',       Icon: Shield },
  { key: 'code',           label: 'Code',         Icon: Code },
  { key: 'trending-up',    label: 'Trending Up',  Icon: TrendingUp },
  { key: 'globe',          label: 'Globe',        Icon: Globe },
  { key: 'layers',         label: 'Layers',       Icon: Layers },
  { key: 'zap',            label: 'Zap',          Icon: Zap },
  { key: 'settings',       label: 'Settings',     Icon: Settings },
  { key: 'database',       label: 'Database',     Icon: Database },
  { key: 'lock',           label: 'Lock',         Icon: Lock },
  { key: 'bar-chart',      label: 'Bar Chart',    Icon: BarChart },
  { key: 'mail',           label: 'Mail',         Icon: Mail },
  { key: 'search',         label: 'Search',       Icon: Search },
  { key: 'star',           label: 'Star',         Icon: Star },
  { key: 'cpu',            label: 'CPU',          Icon: Cpu },
  { key: 'layout',         label: 'Layout',       Icon: Layout },
  { key: 'pen-tool',       label: 'Pen Tool',     Icon: PenTool },
  { key: 'camera',         label: 'Camera',       Icon: Camera },
  { key: 'video',          label: 'Video',        Icon: Video },
  { key: 'music',          label: 'Music',        Icon: Music },
  { key: 'shopping-cart',  label: 'Shopping Cart',Icon: ShoppingCart },
  { key: 'users',          label: 'Users',        Icon: Users },
  { key: 'heart',          label: 'Heart',        Icon: Heart },
  { key: 'message',        label: 'Message',      Icon: MessageSquare },
  { key: 'map',            label: 'Map',          Icon: Map },
  { key: 'clock',          label: 'Clock',        Icon: Clock },
  { key: 'wifi',           label: 'Wifi',         Icon: Wifi },
  { key: 'terminal',       label: 'Terminal',     Icon: Terminal },
  { key: 'package',        label: 'Package',      Icon: Package },
  { key: 'mobile',         label: 'Mobile',       Icon: Smartphone },
];

interface Props {
  value: string;
  onChange: (key: string) => void;
}

const IconPicker: React.FC<Props> = ({ value, onChange }) => {
  const [open, setOpen] = React.useState(false);
  const selected = ICON_OPTIONS.find(o => o.key === value);

  return (
    <div>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-3 w-full border border-gray-200 rounded-2xl px-4 py-3 bg-gray-50 hover:border-dark transition-colors text-left"
      >
        {selected ? (
          <>
            <div className="w-8 h-8 rounded-xl bg-dark flex items-center justify-center flex-shrink-0">
              <selected.Icon size={16} className="text-white" />
            </div>
            <span className="text-sm font-medium text-dark">{selected.label}</span>
            <span className="text-xs text-gray-400 ml-auto font-mono">{value}</span>
          </>
        ) : (
          <>
            <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
              <Layers size={14} className="text-gray-300" />
            </div>
            <span className="text-sm text-gray-400">Select an icon...</span>
          </>
        )}
      </button>

      {/* Grid */}
      {open && (
        <div className="mt-2 border border-gray-200 rounded-2xl bg-white p-4 shadow-sm">
          <div className="grid grid-cols-8 gap-1.5">
            {/* None */}
            <button
              type="button"
              onClick={() => { onChange(''); setOpen(false); }}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all ${
                value === '' ? 'border-dark bg-dark/5' : 'border-transparent hover:border-gray-200'
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center">
                <X size={11} className="text-gray-300" />
              </div>
              <span className="text-gray-400" style={{ fontSize: '8px' }}>None</span>
            </button>

            {ICON_OPTIONS.map(({ key, label, Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => { onChange(key); setOpen(false); }}
                title={label}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all ${
                  value === key
                    ? 'border-dark bg-dark text-white'
                    : 'border-transparent hover:border-gray-200 text-gray-600 hover:text-dark'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  value === key ? 'bg-white/10' : 'bg-gray-50'
                }`}>
                  <Icon size={14} />
                </div>
                <span className="leading-tight truncate w-full text-center" style={{ fontSize: '8px' }}>
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Preview */}
      {selected && (
        <div className="mt-2 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="w-12 h-12 rounded-full border border-black flex items-center justify-center bg-white flex-shrink-0">
            <selected.Icon size={22} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-xs font-semibold text-dark">{selected.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">Preview di website</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default IconPicker;