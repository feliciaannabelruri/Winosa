import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  Globe, Search, Share2, Phone,
  Upload, Save, AlertCircle,
  Instagram, Linkedin, Facebook, Youtube,
  Mail, MapPin, MessageCircle, BarChart2,
  X, RefreshCw, WifiOff, CheckCircle, Image,
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

/* Types */
export interface SiteSettings {
  _id?:       string;
  updatedAt?: string;
  // General
  siteName:    string;
  siteTagline: string;
  logo?:       string;
  // SEO
  metaTitle:         string;
  metaDescription:   string;
  metaKeywords:      string;
  googleAnalyticsId: string;
  // Social
  socialInstagram: string;
  socialFacebook:  string;
  socialLinkedin:  string;
  socialYoutube:   string;
  socialWhatsapp:  string;
  // Contact
  siteEmail:   string;
  sitePhone:   string;
  siteAddress: string;
}

const DEFAULT: SiteSettings = {
  siteName: '', siteTagline: '', logo: '',
  metaTitle: '', metaDescription: '', metaKeywords: '', googleAnalyticsId: '',
  socialInstagram: '', socialFacebook: '', socialLinkedin: '', socialYoutube: '', socialWhatsapp: '',
  siteEmail: '', sitePhone: '', siteAddress: '',
};

type TabKey = 'general' | 'seo' | 'social' | 'contact';

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: 'general', label: 'General', icon: <Globe  size={14} /> },
  { key: 'seo',     label: 'SEO',     icon: <Search size={14} /> },
  { key: 'social',  label: 'Social',  icon: <Share2 size={14} /> },
  { key: 'contact', label: 'Contact', icon: <Phone  size={14} /> },
];

const TAB_FIELDS: Record<TabKey, (keyof SiteSettings)[]> = {
  general: ['siteName', 'siteTagline'],
  seo:     ['metaTitle', 'metaDescription'],
  social:  ['socialInstagram', 'socialFacebook', 'socialLinkedin', 'socialYoutube'],
  contact: ['siteEmail', 'sitePhone', 'siteAddress', 'socialWhatsapp'],
};

/* Style tokens */
const inp     = 'w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-dark bg-gray-50 transition-colors placeholder:text-gray-300';
const inpErr  = 'w-full border border-red-300 rounded-2xl px-4 py-3 text-sm outline-none focus:border-red-400 bg-red-50/30 transition-colors placeholder:text-gray-300';
const inpIcon = 'w-full border border-gray-200 rounded-2xl pl-11 pr-4 py-3 text-sm outline-none focus:border-dark bg-gray-50 transition-colors placeholder:text-gray-300';
const txt     = 'w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-dark bg-gray-50 transition-colors resize-none placeholder:text-gray-300';
const cc      = (len: number, max: number) =>
  len > max ? 'text-red-500' : len > max * 0.85 ? 'text-yellow-500' : 'text-gray-400';

/* Atoms */
const FieldLabel: React.FC<{ children: React.ReactNode; hint?: string }> = ({ children, hint }) => (
  <div className="mb-2">
    <label className="block text-sm font-semibold text-dark">{children}</label>
    {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
  </div>
);

const ErrMsg: React.FC<{ msg: string }> = ({ msg }) => (
  <p className="flex items-center gap-1 mt-1.5 text-xs text-red-500"><AlertCircle size={11} />{msg}</p>
);

const Card: React.FC<{
  icon: React.ReactNode; iconBg: string;
  title: string; subtitle: string;
  children: React.ReactNode;
}> = ({ icon, iconBg, title, subtitle, children }) => (
  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-5">
    <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>{icon}</div>
      <div>
        <h2 className="font-bold text-dark text-base">{title}</h2>
        <p className="text-xs text-gray-400">{subtitle}</p>
      </div>
    </div>
    {children}
  </div>
);

/* Logo upload */
const LogoSlot: React.FC<{
  preview: string | null;
  onUpload: (f: File) => void;
  onRemove: () => void;
}> = ({ preview, onUpload, onRemove }) => {
  const ref = useRef<HTMLInputElement>(null);
  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!['image/png','image/jpeg','image/jpg','image/svg+xml','image/webp'].includes(f.type)) {
      toast.error('Must be PNG, JPG, SVG, or WebP'); return;
    }
    if (f.size > 2 * 1024 * 1024) { toast.error('Max 2 MB'); return; }
    onUpload(f);
    e.target.value = '';
  };
  return (
    <div>
      <FieldLabel hint="PNG, SVG, or WebP — transparent background — max 2 MB">Logo</FieldLabel>
      <div className="flex items-center gap-4">
        {/* Preview box */}
        <div
          onClick={() => ref.current?.click()}
          className="w-24 h-16 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center flex-shrink-0 cursor-pointer hover:border-dark transition-colors overflow-hidden group"
        >
          {preview
            ? <img src={preview} alt="logo" className="w-full h-full object-contain p-2" />
            : <div className="flex flex-col items-center gap-1">
                <Image size={18} className="text-gray-300 group-hover:text-dark transition-colors" />
                <p className="text-[10px] text-gray-300">No logo</p>
              </div>
          }
        </div>
        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => ref.current?.click()}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-dark transition-colors border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 hover:bg-gray-100"
          >
            <Upload size={12} /> Upload file
          </button>
          {preview && (
            <button
              type="button"
              onClick={onRemove}
              className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-500 transition-colors border border-red-100 rounded-xl px-3 py-2 hover:bg-red-50"
            >
              <X size={12} /> Remove
            </button>
          )}
        </div>
        <input ref={ref} type="file" accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp" onChange={handle} className="hidden" />
      </div>
    </div>
  );
};

/* Skeleton */
const LoadingSkeleton: React.FC = () => (
  <div className="space-y-6 w-full animate-pulse">
    <div className="w-32 h-9 bg-gray-200 rounded-full" />
    <div className="flex gap-2 bg-white border border-gray-100 rounded-2xl p-1.5 w-fit">
      {[80,56,72,76].map((w,i) => <div key={i} style={{width:w}} className="h-10 bg-gray-100 rounded-xl" />)}
    </div>
    <div className="bg-white rounded-3xl border border-gray-100 p-6 space-y-4">
      {[1,2,3].map(i => <div key={i} className="h-12 bg-gray-100 rounded-2xl" />)}
    </div>
  </div>
);

/* API Error Banner */
const ApiBanner: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <div className="flex items-start gap-3 bg-orange-50 border border-orange-200 rounded-2xl px-4 py-3">
    <WifiOff size={15} className="text-orange-400 flex-shrink-0 mt-0.5" />
    <div className="flex-1">
      <p className="text-sm font-semibold text-orange-700">Backend not connected</p>
      <p className="text-xs text-orange-500 mt-0.5">Changes won't be saved until the server is running.</p>
    </div>
    <button onClick={onRetry} className="flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700 transition-colors flex-shrink-0">
      <RefreshCw size={12} /> Retry
    </button>
  </div>
);

const SettingsPage: React.FC = () => {
  const [form, setForm]         = useState<SiteSettings>(DEFAULT);
  const [saved, setSaved]       = useState<SiteSettings>(DEFAULT);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [apiError, setApiError] = useState(false);
  const [tab, setTab]           = useState<TabKey>('general');
  const [errors, setErrors]     = useState<Partial<Record<keyof SiteSettings, string>>>({});
  const [logoFile, setLogoFile]       = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoRemoved, setLogoRemoved] = useState(false);

  const isDirty = JSON.stringify(form) !== JSON.stringify(saved) || !!logoFile || logoRemoved;

  const fetchSettings = useCallback(async () => {
    setLoading(true); setApiError(false);
    try {
      const res = await api.get('/admin/settings');
      if (res.data?.success && res.data?.data) {
        const d: SiteSettings = { ...DEFAULT, ...res.data.data };
        setForm(d); setSaved(d);
        if (d.logo) setLogoPreview(d.logo);
      }
    } catch (err: any) {
      const s = err?.response?.status;
      if (s !== 401 && s !== 403) { setApiError(true); setForm(DEFAULT); setSaved(DEFAULT); }
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const set = (k: keyof SiteSettings) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm(p => ({ ...p, [k]: e.target.value }));
      if (errors[k]) setErrors(p => { const n={...p}; delete n[k]; return n; });
    };

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.siteName.trim())     e.siteName        = 'Site name is required';
    if (form.metaTitle.length > 70)       e.metaTitle       = 'Keep under 70 characters';
    if (form.metaDescription.length > 160) e.metaDescription = 'Keep under 160 characters';
    if (form.siteEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.siteEmail))
                                   e.siteEmail       = 'Invalid email address';
    if (form.socialWhatsapp && !/^\d{8,15}$/.test(form.socialWhatsapp.replace(/\s/g,'')))
                                   e.socialWhatsapp  = 'Digits only, 8–15 characters';
    (['socialInstagram','socialFacebook','socialLinkedin','socialYoutube'] as (keyof SiteSettings)[])
      .forEach(k => {
        const v = form[k] as string;
        if (v && !/^https?:\/\//.test(v)) e[k] = 'Must start with https://';
      });
    setErrors(e);
    if (Object.keys(e).length) {
      const found = TABS.find(t => TAB_FIELDS[t.key].some(k => (Object.keys(e) as (keyof SiteSettings)[]).includes(k)));
      if (found) setTab(found.key);
    }
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) { toast.error('Please fix the errors before saving'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      const skip: (keyof SiteSettings)[] = ['_id','updatedAt','logo'];
      (Object.keys(form) as (keyof SiteSettings)[]).forEach(k => {
        if (!skip.includes(k)) fd.append(k, String(form[k] ?? ''));
      });
      if (logoFile)         fd.append('logo', logoFile);
      else if (logoRemoved) fd.append('removeLogo', 'true');

      const res = await api.put('/admin/settings', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data?.success) {
        const d = res.data.data as SiteSettings;
        setSaved({ ...form });
        setLogoFile(null); setLogoRemoved(false);
        if (d.logo) setLogoPreview(d.logo);
        setApiError(false);
        toast.success('Settings saved!');
      } else toast.error(res.data?.message || 'Save failed');
    } catch (err: any) {
      const s = err?.response?.status;
      const m = err?.response?.data?.message;
      if (s === 413)            toast.error('File too large — max 2 MB');
      else if (s === 400 || s === 422) toast.error(m || 'Validation error');
      else                      toast.error(m || 'Failed to save settings');
    } finally { setSaving(false); }
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="space-y-6 w-full">

      <div>
        <h1 className="text-4xl font-display font-bold text-dark">Settings</h1>
        <p className="text-gray-400 text-sm mt-1 italic">Configure your Winosa website</p>
      </div>

      {apiError && <ApiBanner onRetry={fetchSettings} />}

      {/* Tabs */}
      <div className="flex gap-1.5 bg-white border border-gray-100 rounded-2xl p-1.5 shadow-sm overflow-x-auto w-full sm:w-fit">
        {TABS.map(t => {
          const hasErr = TAB_FIELDS[t.key].some(k => !!errors[k]);
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                tab === t.key ? 'bg-dark text-white shadow-sm' : 'text-gray-500 hover:text-dark hover:bg-gray-50'
              }`}
            >
              {t.icon}{t.label}
              {hasErr && <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />}
            </button>
          );
        })}
      </div>

      {/* GENERAL */}
      {tab === 'general' && (
        <Card icon={<Globe size={16} className="text-primary" />} iconBg="bg-primary/10" title="Site Settings" subtitle="Brand identity shown in navbar and footer">
          <LogoSlot
            preview={logoPreview}
            onUpload={f => { setLogoFile(f); setLogoPreview(URL.createObjectURL(f)); setLogoRemoved(false); }}
            onRemove={() => { setLogoFile(null); setLogoPreview(null); setLogoRemoved(true); }}
          />
          <div className="border-t border-gray-100 pt-5 space-y-5">
            <div>
              <FieldLabel>Site Name <span className="text-red-400">*</span></FieldLabel>
              <input type="text" placeholder="e.g. PT. Winosa Mitra Bharatadjaya" value={form.siteName} onChange={set('siteName')} maxLength={100} className={errors.siteName ? inpErr : inp} />
              {errors.siteName
                ? <ErrMsg msg={errors.siteName} />
                : <p className={`text-[11px] mt-1 text-right ${cc(form.siteName.length, 80)}`}>{form.siteName.length}/100</p>
              }
            </div>
            <div>
              <FieldLabel hint="Shown in footer and used as fallback SEO description">Site Tagline</FieldLabel>
              <div className="relative">
                <textarea placeholder="Short description of your business..." value={form.siteTagline} onChange={set('siteTagline')} rows={3} maxLength={300} className={txt} />
                <span className={`absolute bottom-3 right-3 text-[11px] ${cc(form.siteTagline.length, 300)}`}>{form.siteTagline.length}/300</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* SEO */}
      {tab === 'seo' && (
        <div className="space-y-4">
          <Card icon={<Search size={16} className="text-blue-500" />} iconBg="bg-blue-50" title="SEO Settings" subtitle="Controls how Winosa appears in Google search results">
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4 space-y-0.5">
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-3">Google Preview</p>
              <p className="text-xs text-gray-400">winosa.com</p>
              <p className="text-[15px] text-blue-600 font-medium leading-snug truncate">{form.metaTitle || form.siteName || 'Your page title here'}</p>
              <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{form.metaDescription || form.siteTagline || 'Your meta description will appear here.'}</p>
            </div>
            <div>
              <FieldLabel hint="Ideal: 50–60 characters. Shown as the blue link in Google.">Meta Title</FieldLabel>
              <input type="text" placeholder="e.g. Winosa — Digital Solutions & IT Consulting" value={form.metaTitle} onChange={set('metaTitle')} maxLength={70} className={errors.metaTitle ? inpErr : inp} />
              <div className="flex items-center justify-between mt-1">
                {errors.metaTitle ? <ErrMsg msg={errors.metaTitle} /> : <span />}
                <span className={`text-[11px] ${cc(form.metaTitle.length, 60)}`}>{form.metaTitle.length}/60</span>
              </div>
            </div>
            <div>
              <FieldLabel hint="Ideal: 120–160 characters. The grey text shown below the title in Google.">Meta Description</FieldLabel>
              <div className="relative">
                <textarea placeholder="Describe your website in 1–2 compelling sentences..." value={form.metaDescription} onChange={set('metaDescription')} rows={3} maxLength={200} className={errors.metaDescription ? `${inpErr} resize-none` : txt} />
                <span className={`absolute bottom-3 right-3 text-[11px] ${cc(form.metaDescription.length, 160)}`}>{form.metaDescription.length}/160</span>
              </div>
              {errors.metaDescription && <ErrMsg msg={errors.metaDescription} />}
            </div>
            <div>
              <FieldLabel hint="Comma-separated. Useful for search engines other than Google.">Meta Keywords</FieldLabel>
              <input type="text" placeholder="web development, digital agency, IT consulting, Lampung" value={form.metaKeywords} onChange={set('metaKeywords')} className={inp} />
            </div>
            <div className="border-t border-gray-100 pt-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <BarChart2 size={15} className="text-orange-500" />
                </div>
                <div>
                  <h3 className="font-bold text-dark text-sm">Google Analytics</h3>
                  <p className="text-xs text-gray-400">Track website traffic automatically</p>
                </div>
              </div>
              <FieldLabel hint='Starts with "G-" — find it in GA4 Admin → Property → Data Streams'>Measurement ID</FieldLabel>
              <input type="text" placeholder="G-XXXXXXXXXX" value={form.googleAnalyticsId} onChange={set('googleAnalyticsId')} className={inp} />
            </div>
          </Card>
          <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <CheckCircle size={15} className="text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-dark">Where does this appear?</p>
                <ul className="space-y-1 text-xs text-gray-500">
                  <li>• <strong>Meta Title</strong> → the clickable blue link in Google results</li>
                  <li>• <strong>Meta Description</strong> → the grey summary text below the link</li>
                  <li>• <strong>Meta Keywords</strong> → not shown publicly, only read by search engines</li>
                  <li>• <strong>GA ID</strong> → injected into <code className="bg-gray-100 px-1 rounded text-[11px]">&lt;head&gt;</code> automatically</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SOCIAL */}
      {tab === 'social' && (
        <Card icon={<Share2 size={16} className="text-purple-500" />} iconBg="bg-purple-50" title="Social Media" subtitle="Links shown in the footer social icons">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            {([
              { icon: <Instagram size={14}/>, label: 'Instagram', key: 'socialInstagram' as const, ph: 'https://instagram.com/winosa' },
              { icon: <Facebook  size={14}/>, label: 'Facebook',  key: 'socialFacebook'  as const, ph: 'https://facebook.com/winosa' },
              { icon: <Linkedin  size={14}/>, label: 'LinkedIn',  key: 'socialLinkedin'  as const, ph: 'https://linkedin.com/company/winosa' },
              { icon: <Youtube   size={14}/>, label: 'YouTube',   key: 'socialYoutube'   as const, ph: 'https://youtube.com/@winosa' },
            ] as const).map(({ icon, label, key, ph }) => (
              <div key={key}>
                <FieldLabel>{label}</FieldLabel>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
                  <input type="url" placeholder={ph} value={form[key]}
                    onChange={e => { setForm(p => ({ ...p, [key]: e.target.value })); if (errors[key]) setErrors(p => { const n={...p}; delete n[key]; return n; }); }}
                    className={errors[key] ? `${inpErr} pl-11` : inpIcon}
                  />
                </div>
                {errors[key] && <ErrMsg msg={errors[key]!} />}
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-5">
            <FieldLabel hint="Digits only with country code — drives the wa.me link in footer and contact page">WhatsApp Number</FieldLabel>
            <div className="relative max-w-xs">
              <MessageCircle size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="tel" placeholder="6281234567890" value={form.socialWhatsapp}
                onChange={e => { const c=e.target.value.replace(/[^\d]/g,''); setForm(p=>({...p,socialWhatsapp:c})); if(errors.socialWhatsapp) setErrors(p=>{const n={...p};delete n.socialWhatsapp;return n;}); }}
                className={errors.socialWhatsapp ? `${inpErr} pl-11` : inpIcon}
              />
            </div>
            {errors.socialWhatsapp && <ErrMsg msg={errors.socialWhatsapp} />}
            {form.socialWhatsapp && !errors.socialWhatsapp && (
              <p className="text-[11px] text-gray-400 mt-1.5">
                Link preview: <span className="text-dark font-medium">wa.me/{form.socialWhatsapp}</span>
              </p>
            )}
          </div>
        </Card>
      )}

      {/* ══ CONTACT ══ */}
      {tab === 'contact' && (
        <Card icon={<Phone size={16} className="text-green-500" />} iconBg="bg-green-50" title="Contact Information" subtitle="Shown in the Contact page and footer">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <FieldLabel>Email Address</FieldLabel>
              <div className="relative">
                <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" placeholder="hello@winosa.com" value={form.siteEmail} onChange={set('siteEmail')} className={errors.siteEmail ? `${inpErr} pl-11` : inpIcon} />
              </div>
              {errors.siteEmail && <ErrMsg msg={errors.siteEmail} />}
            </div>
            <div>
              <FieldLabel hint='Shown as "Call us" on the Contact page'>Phone Number</FieldLabel>
              <div className="relative">
                <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="tel" placeholder="+62 21 xxxx xxxx" value={form.sitePhone} onChange={set('sitePhone')} className={inpIcon} />
              </div>
            </div>
          </div>
          <div>
            <FieldLabel hint='Shown as "Visit us" on the Contact page'>Office Address</FieldLabel>
            <div className="relative">
              <MapPin size={14} className="absolute left-4 top-[14px] text-gray-400" />
              <textarea placeholder="Jl. Raya No. 1, Bandar Lampung, Indonesia" value={form.siteAddress} onChange={set('siteAddress')} rows={3} className="w-full border border-gray-200 rounded-2xl pl-11 pr-4 py-3 text-sm outline-none focus:border-dark bg-gray-50 transition-colors resize-none placeholder:text-gray-300" />
            </div>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-2xl px-4 py-3 flex items-start gap-3">
            <CheckCircle size={14} className="text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-green-700 leading-relaxed">
              <strong>WhatsApp</strong> number is managed under the <strong>Social</strong> tab —
              it drives the footer WhatsApp icon and "Live Chat" link on the Contact page.
            </p>
          </div>
        </Card>
      )}

      {/* Save bar */}
      <div className="flex justify-end items-center gap-3 pt-2 pb-4">
        {isDirty && !saving && <span className="text-xs text-amber-500 font-medium">• Unsaved changes</span>}
        <button
          onClick={handleSave}
          disabled={saving || !isDirty}
          className="flex items-center gap-2 bg-dark text-white font-semibold px-6 py-3 rounded-full transition-all duration-200 hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-md text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saving
            ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...</>
            : <><Save size={14} />Save Changes</>
          }
        </button>
      </div>

    </div>
  );
};

export default SettingsPage;