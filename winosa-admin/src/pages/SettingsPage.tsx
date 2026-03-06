import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  Globe, Search, Share2, Phone,
  Upload, Image, Save, CheckCircle, AlertCircle,
  Instagram, Linkedin, Facebook, Twitter, Youtube,
  Mail, MapPin, MessageCircle, BarChart2, X,
  RefreshCw, WifiOff,
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

/* ─── Types — matches backend Settings model exactly ─── */
interface SiteSettings {
  _id?: string;
  // General
  siteName: string;
  siteTagline: string;
  siteEmail: string;
  sitePhone: string;
  siteAddress: string;
  logo?: string;
  // Social
  socialInstagram: string;
  socialFacebook: string;
  socialTwitter: string;
  socialLinkedin: string;
  socialYoutube: string;
  socialWhatsapp: string;
  // SEO
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
}

const DEFAULT: SiteSettings = {
  siteName: '',
  siteTagline: '',
  siteEmail: '',
  sitePhone: '',
  siteAddress: '',
  socialInstagram: '',
  socialFacebook: '',
  socialTwitter: '',
  socialLinkedin: '',
  socialYoutube: '',
  socialWhatsapp: '',
  metaTitle: '',
  metaDescription: '',
  metaKeywords: '',
};

type TabKey = 'general' | 'seo' | 'social' | 'contact';
const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: 'general', label: 'General',  icon: <Globe size={15} /> },
  { key: 'seo',     label: 'SEO',      icon: <Search size={15} /> },
  { key: 'social',  label: 'Social',   icon: <Share2 size={15} /> },
  { key: 'contact', label: 'Contact',  icon: <Phone size={15} /> },
];

const Label: React.FC<{ children: React.ReactNode; hint?: string }> = ({ children, hint }) => (
  <div className="mb-2">
    <label className="block text-sm font-semibold text-dark">{children}</label>
    {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
  </div>
);

const inp     = 'w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-dark bg-gray-50 transition-colors placeholder:text-gray-300';
const inpErr  = 'w-full border border-red-300 rounded-2xl px-4 py-3 text-sm outline-none focus:border-red-400 bg-red-50/30 transition-colors placeholder:text-gray-300';
const inpIcon = 'w-full border border-gray-200 rounded-2xl pl-11 pr-4 py-3 text-sm outline-none focus:border-dark bg-gray-50 transition-colors placeholder:text-gray-300';
const txt     = 'w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-dark bg-gray-50 transition-colors resize-none placeholder:text-gray-300';

const Card: React.FC<{
  icon: React.ReactNode; iconBg: string;
  title: string; subtitle: string;
  children: React.ReactNode;
}> = ({ icon, iconBg, title, subtitle, children }) => (
  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-5">
    <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg}`}>{icon}</div>
      <div>
        <h2 className="font-bold text-dark text-base">{title}</h2>
        <p className="text-xs text-gray-400">{subtitle}</p>
      </div>
    </div>
    {children}
  </div>
);

const cc = (len: number, max: number) =>
  len > max ? 'text-red-500' : len > max * 0.85 ? 'text-yellow-500' : 'text-gray-400';

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-6 w-full">
    <div className="w-32 h-9 bg-gray-200 rounded-full animate-pulse" />
    <div className="flex gap-2 bg-white border border-gray-100 rounded-2xl p-1.5 w-fit">
      {[80, 60, 72, 76].map((w, i) => (
        <div key={i} style={{ width: w }} className="h-10 bg-gray-100 rounded-xl animate-pulse" />
      ))}
    </div>
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-5">
      <div className="w-full h-12 bg-gray-100 rounded-2xl animate-pulse" />
      <div className="w-full h-12 bg-gray-100 rounded-2xl animate-pulse" />
      <div className="w-full h-24 bg-gray-100 rounded-2xl animate-pulse" />
    </div>
  </div>
);

const ApiBanner: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <div className="flex items-start gap-3 bg-orange-50 border border-orange-200 rounded-2xl px-4 py-3">
    <WifiOff size={16} className="text-orange-400 flex-shrink-0 mt-0.5" />
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-orange-700">Backend not connected</p>
      <p className="text-xs text-orange-500 mt-0.5">Changes won't be saved until the server is running. You can still fill in the form.</p>
    </div>
    <button onClick={onRetry} className="flex-shrink-0 flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700 transition-colors">
      <RefreshCw size={12} /> Retry
    </button>
  </div>
);

/* ══════════════════════════════════════════════════════ */
const SettingsPage: React.FC = () => {
  const [form, setForm]           = useState<SiteSettings>(DEFAULT);
  const [savedForm, setSavedForm] = useState<SiteSettings>(DEFAULT);
  const [logoFile, setLogoFile]   = useState<File | null>(null);
  const [logoPreview, setLogoPrev] = useState<string | null>(null);
  const [logoRemoved, setLogoRemoved] = useState(false);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [apiError, setApiError]   = useState(false);
  const [tab, setTab]             = useState<TabKey>('general');
  const [errors, setErrors]       = useState<Partial<Record<keyof SiteSettings, string>>>({});
  const logoRef = useRef<HTMLInputElement>(null);

  const isDirty = JSON.stringify(form) !== JSON.stringify(savedForm) || !!logoFile || logoRemoved;

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setApiError(false);
    try {
      const res = await api.get('/admin/settings');
      if (res.data?.success && res.data?.data) {
        const data = res.data.data as SiteSettings;
        const merged: SiteSettings = { ...DEFAULT, ...data };
        setForm(merged);
        setSavedForm(merged);
        if (data.logo) setLogoPrev(data.logo);
      }
    } catch (err: any) {
      const status = err?.response?.status;
      if (status !== 401 && status !== 403) {
        setApiError(true);
        setForm(DEFAULT);
        setSavedForm(DEFAULT);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const set = (k: keyof SiteSettings) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm(p => ({ ...p, [k]: e.target.value }));
      if (errors[k]) setErrors(p => { const n = { ...p }; delete n[k]; return n; });
    };

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp'];
    if (!allowed.includes(f.type)) { toast.error('Logo must be PNG, JPG, SVG, or WebP'); return; }
    if (f.size > 2 * 1024 * 1024) { toast.error('Logo must be under 2MB'); return; }
    setLogoFile(f);
    setLogoPrev(URL.createObjectURL(f));
    setLogoRemoved(false);
    e.target.value = '';
  };

  const removeLogo = () => { setLogoFile(null); setLogoPrev(null); setLogoRemoved(true); };

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.siteName.trim()) e.siteName = 'Site name is required';
    if (form.metaTitle.length > 70) e.metaTitle = 'Keep meta title under 70 characters';
    if (form.metaDescription.length > 160) e.metaDescription = 'Keep meta description under 160 characters';
    if (form.siteEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.siteEmail)) e.siteEmail = 'Invalid email address';
    if (form.socialWhatsapp && !/^\d{8,15}$/.test(form.socialWhatsapp.replace(/\s/g, ''))) e.socialWhatsapp = 'Digits only, 8–15 characters';
    const urlFields: (keyof SiteSettings)[] = ['socialInstagram', 'socialLinkedin', 'socialFacebook', 'socialTwitter', 'socialYoutube'];
    urlFields.forEach(field => {
      const val = form[field] as string;
      if (val && !val.startsWith('http://') && !val.startsWith('https://')) e[field] = 'Must start with https://';
    });
    setErrors(e);
    if (Object.keys(e).length > 0) {
      const errorKeys = Object.keys(e) as (keyof SiteSettings)[];
      if (errorKeys.some(k => ['siteName', 'siteTagline'].includes(k))) setTab('general');
      else if (errorKeys.some(k => ['metaTitle', 'metaDescription', 'metaKeywords'].includes(k))) setTab('seo');
      else if (errorKeys.some(k => ['socialInstagram', 'socialLinkedin', 'socialFacebook', 'socialTwitter', 'socialYoutube'].includes(k))) setTab('social');
      else setTab('contact');
    }
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) { toast.error('Please fix the errors before saving'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      const skipKeys: (keyof SiteSettings)[] = ['_id', 'logo'];
      (Object.keys(form) as Array<keyof SiteSettings>).forEach(k => {
        if (skipKeys.includes(k)) return;
        fd.append(k, String(form[k] ?? ''));
      });
      if (logoFile) fd.append('logo', logoFile);
      else if (logoRemoved) fd.append('removeLogo', 'true');

      const res = await api.put('/admin/settings', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data?.success) {
        setSavedForm({ ...form });
        setLogoRemoved(false);
        setLogoFile(null);
        if (res.data?.data?.logo) setLogoPrev(res.data.data.logo);
        setApiError(false);
        toast.success('Settings saved!');
      } else {
        toast.error(res.data?.message || 'Save failed');
      }
    } catch (err: any) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message;
      if (status === 413) toast.error('File too large.');
      else if (status === 400 || status === 422) toast.error(msg || 'Validation error.');
      else toast.error(msg || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="space-y-6 w-full">

      {/* Header */}
      <div>
        <h1 className="text-4xl font-display font-bold text-dark">Settings</h1>
        <p className="text-gray-400 text-sm mt-1 italic">Configure Winosa website settings</p>
      </div>

      {/* API banner */}
      {apiError && <ApiBanner onRetry={fetchSettings} />}

      {/* Tabs */}
      <div className="flex gap-2 bg-white border border-gray-100 rounded-2xl p-1.5 shadow-sm overflow-x-auto w-full sm:w-fit">
        {TABS.map(t => {
          const tabFieldMap: Record<TabKey, (keyof SiteSettings)[]> = {
            general: ['siteName', 'siteTagline'],
            seo:     ['metaTitle', 'metaDescription', 'metaKeywords'],
            social:  ['socialInstagram', 'socialLinkedin', 'socialFacebook', 'socialTwitter', 'socialYoutube'],
            contact: ['siteEmail', 'sitePhone', 'socialWhatsapp', 'siteAddress'],
          };
          const hasError = tabFieldMap[t.key].some(k => !!errors[k]);
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                tab === t.key ? 'bg-dark text-white shadow-sm' : 'text-gray-500 hover:text-dark hover:bg-gray-50'
              }`}
            >
              {t.icon}{t.label}
              {hasError && <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />}
            </button>
          );
        })}
      </div>

      {/* ══ GENERAL ══ */}
      {tab === 'general' && (
        <Card icon={<Globe size={16} className="text-primary" />} iconBg="bg-primary/10" title="Site Identity" subtitle="Basic information about your website">
          {/* Logo */}
          <div>
            <Label hint="PNG, SVG, or WebP — transparent bg, min 200×200px — max 2MB">Logo</Label>
            <div className="flex items-start gap-4">
              <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {logoPreview
                  ? <img src={logoPreview} alt="logo" className="w-full h-full object-contain p-2" />
                  : <div className="text-center"><Image size={20} className="text-gray-300 mx-auto mb-1" /><p className="text-[10px] text-gray-300">No logo</p></div>
                }
              </div>
              <div className="flex-1">
                <div onClick={() => logoRef.current?.click()} className="border-2 border-dashed border-gray-200 rounded-2xl p-5 bg-gray-50 cursor-pointer hover:border-dark transition-colors group text-center">
                  <Upload size={20} className="text-gray-300 group-hover:text-dark mx-auto mb-2 transition-colors" />
                  <p className="text-xs text-gray-400 group-hover:text-dark transition-colors">Click to upload logo</p>
                  <p className="text-[10px] text-gray-300 mt-1">PNG, SVG, WebP, JPG — max 2 MB</p>
                </div>
                {logoPreview && (
                  <button onClick={removeLogo} className="mt-2 flex items-center gap-1 text-xs text-red-400 hover:text-red-500 transition-colors">
                    <X size={12} /> Remove logo
                  </button>
                )}
              </div>
              <input ref={logoRef} type="file" accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp" onChange={handleLogo} className="hidden" />
            </div>
          </div>

          {/* Site Name */}
          <div>
            <Label>Site Name <span className="text-red-400">*</span></Label>
            <input type="text" placeholder="e.g. PT. Winosa Mitra Bharatadjaya" value={form.siteName} onChange={set('siteName')} maxLength={100} className={errors.siteName ? inpErr : inp} />
            {errors.siteName
              ? <p className="flex items-center gap-1 mt-1.5 text-xs text-red-500"><AlertCircle size={11} />{errors.siteName}</p>
              : <p className={`text-[11px] mt-1 text-right ${cc(form.siteName.length, 80)}`}>{form.siteName.length}/100</p>
            }
          </div>

          {/* Site Tagline */}
          <div>
            <Label hint="Shown in website header/footer and fallback for SEO">Site Tagline</Label>
            <div className="relative">
              <textarea placeholder="Short description of your business..." value={form.siteTagline} onChange={set('siteTagline')} rows={3} maxLength={300} className={txt} />
              <span className={`absolute bottom-3 right-3 text-[11px] ${cc(form.siteTagline.length, 300)}`}>{form.siteTagline.length}/300</span>
            </div>
          </div>
        </Card>
      )}

      {/* ══ SEO ══ */}
      {tab === 'seo' && (
        <div className="space-y-5">
          <Card icon={<Search size={16} className="text-blue-500" />} iconBg="bg-blue-50" title="SEO Settings" subtitle="Optimize how your site appears in search engines">
            {/* SERP Preview */}
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4">
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-3">Search Result Preview</p>
              <p className="text-xs text-gray-400 font-medium">winosa.com</p>
              <p className="text-base text-blue-600 font-medium leading-tight truncate">{form.metaTitle || form.siteName || 'Your Site Title Here'}</p>
              <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mt-0.5">{form.metaDescription || form.siteTagline || 'Your meta description will appear here.'}</p>
            </div>

            <div>
              <Label hint="Ideal length: 50–60 characters">Meta Title</Label>
              <input type="text" placeholder="e.g. Winosa — Digital Solutions & IT Consulting" value={form.metaTitle} onChange={set('metaTitle')} maxLength={70} className={errors.metaTitle ? inpErr : inp} />
              <div className="flex items-center justify-between mt-1">
                {errors.metaTitle ? <p className="flex items-center gap-1 text-xs text-red-500"><AlertCircle size={11} />{errors.metaTitle}</p> : <span />}
                <span className={`text-[11px] ${cc(form.metaTitle.length, 60)}`}>{form.metaTitle.length}/60</span>
              </div>
            </div>

            <div>
              <Label hint="Ideal length: 120–160 characters">Meta Description</Label>
              <div className="relative">
                <textarea placeholder="Describe your website in 1–2 compelling sentences..." value={form.metaDescription} onChange={set('metaDescription')} rows={3} maxLength={200} className={errors.metaDescription ? `${inpErr} resize-none` : txt} />
                <span className={`absolute bottom-3 right-3 text-[11px] ${cc(form.metaDescription.length, 160)}`}>{form.metaDescription.length}/160</span>
              </div>
              {errors.metaDescription && <p className="flex items-center gap-1 mt-1 text-xs text-red-500"><AlertCircle size={11} />{errors.metaDescription}</p>}
            </div>

            <div>
              <Label hint="Comma-separated keywords">Meta Keywords</Label>
              <input type="text" placeholder="web development, digital agency, IT consulting" value={form.metaKeywords} onChange={set('metaKeywords')} className={inp} />
            </div>

            <div className="border-t border-gray-100 pt-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center"><BarChart2 size={16} className="text-orange-500" /></div>
                <div><h3 className="font-bold text-dark text-sm">Google Analytics</h3><p className="text-xs text-gray-400">Track your website traffic</p></div>
              </div>
              <Label hint='Starts with "G-", found in GA4 Admin → Property → Data Streams'>Measurement ID</Label>
              <input type="text" placeholder="G-XXXXXXXXXX" className={inp} />
            </div>
          </Card>

          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <CheckCircle size={16} className="text-primary mt-0.5 flex-shrink-0" />
              <div className="space-y-1.5">
                <p className="text-sm font-semibold text-dark">SEO Best Practices</p>
                <ul className="space-y-1 text-xs text-gray-500">
                  <li>• <strong>Meta title</strong>: 50–60 characters for best visibility</li>
                  <li>• <strong>Meta description</strong>: 120–160 chars, include a call to action</li>
                  <li>• Use natural keywords your target audience would search for</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ SOCIAL ══ */}
      {tab === 'social' && (
        <Card icon={<Share2 size={16} className="text-purple-500" />} iconBg="bg-purple-50" title="Social Media Links" subtitle="Paste the full URL for each platform (must start with https://)">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: <Instagram size={15} />, label: 'Instagram',   key: 'socialInstagram' as const, ph: 'https://instagram.com/winosa' },
              { icon: <Linkedin size={15} />,  label: 'LinkedIn',    key: 'socialLinkedin'  as const, ph: 'https://linkedin.com/company/winosa' },
              { icon: <Facebook size={15} />,  label: 'Facebook',    key: 'socialFacebook'  as const, ph: 'https://facebook.com/winosa' },
              { icon: <Twitter size={15} />,   label: 'Twitter / X', key: 'socialTwitter'   as const, ph: 'https://twitter.com/winosa' },
              { icon: <Youtube size={15} />,   label: 'YouTube',     key: 'socialYoutube'   as const, ph: 'https://youtube.com/@winosa' },
            ].map(({ icon, label, key, ph }) => (
              <div key={key}>
                <Label>{label}</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
                  <input type="url" placeholder={ph} value={form[key]} onChange={e => { setForm(p => ({ ...p, [key]: e.target.value })); if (errors[key]) setErrors(p => { const n = { ...p }; delete n[key]; return n; }); }} className={errors[key] ? `${inpErr} pl-11` : inpIcon} />
                </div>
                {errors[key] && <p className="flex items-center gap-1 mt-1 text-xs text-red-500"><AlertCircle size={11} />{errors[key]}</p>}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ══ CONTACT ══ */}
      {tab === 'contact' && (
        <Card icon={<Phone size={16} className="text-green-500" />} iconBg="bg-green-50" title="Contact Information" subtitle="Shown on your website's contact section and footer">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <Label>Email Address</Label>
              <div className="relative">
                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" placeholder="hello@winosa.com" value={form.siteEmail} onChange={set('siteEmail')} className={errors.siteEmail ? `${inpErr} pl-11` : inpIcon} />
              </div>
              {errors.siteEmail && <p className="flex items-center gap-1 mt-1 text-xs text-red-500"><AlertCircle size={11} />{errors.siteEmail}</p>}
            </div>

            <div>
              <Label>Phone Number</Label>
              <div className="relative">
                <Phone size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="tel" placeholder="+62 21 xxxx xxxx" value={form.sitePhone} onChange={set('sitePhone')} className={inpIcon} />
              </div>
            </div>

            <div>
              <Label hint="Digits only with country code — e.g. 628123456789">WhatsApp</Label>
              <div className="relative">
                <MessageCircle size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="tel" placeholder="628123456789" value={form.socialWhatsapp} onChange={e => { const cleaned = e.target.value.replace(/[^\d\s]/g, ''); setForm(p => ({ ...p, socialWhatsapp: cleaned })); if (errors.socialWhatsapp) setErrors(p => { const n = { ...p }; delete n.socialWhatsapp; return n; }); }} className={errors.socialWhatsapp ? `${inpErr} pl-11` : inpIcon} />
              </div>
              {errors.socialWhatsapp && <p className="flex items-center gap-1 mt-1 text-xs text-red-500"><AlertCircle size={11} />{errors.socialWhatsapp}</p>}
            </div>
          </div>

          <div>
            <Label>Office Address</Label>
            <div className="relative">
              <MapPin size={15} className="absolute left-4 top-4 text-gray-400" />
              <textarea placeholder="Jl. Sudirman No. 1, Jakarta Pusat, DKI Jakarta 10220" value={form.siteAddress} onChange={set('siteAddress')} rows={3} className="w-full border border-gray-200 rounded-2xl pl-11 pr-4 py-3 text-sm outline-none focus:border-dark bg-gray-50 transition-colors resize-none placeholder:text-gray-300" />
            </div>
          </div>
        </Card>
      )}

      {/* Save button — bottom right */}
      <div className="flex justify-end items-center gap-3 pt-2">
        {isDirty && !saving && (
          <span className="text-xs text-amber-500 font-medium">• Unsaved changes</span>
        )}
        <button
          onClick={handleSave}
          disabled={saving || !isDirty}
          className="flex items-center gap-2 bg-dark text-white font-semibold px-6 py-3 rounded-full transition-all duration-200 hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-md text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saving
            ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...</>
            : <><Save size={15} />Save Changes</>
          }
        </button>
      </div>

    </div>
  );
};

export default SettingsPage;