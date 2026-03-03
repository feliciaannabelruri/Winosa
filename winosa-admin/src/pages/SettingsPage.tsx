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

/* ─── Types ─── */
interface SiteSettings {
  _id?: string;
  siteTitle: string;
  siteDescription: string;
  logo?: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  instagram: string;
  linkedin: string;
  facebook: string;
  twitter: string;
  youtube: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  googleAnalyticsId: string;
}

const DEFAULT: SiteSettings = {
  siteTitle: '',
  siteDescription: '',
  metaTitle: '',
  metaDescription: '',
  metaKeywords: '',
  instagram: '',
  linkedin: '',
  facebook: '',
  twitter: '',
  youtube: '',
  email: '',
  phone: '',
  whatsapp: '',
  address: '',
  googleAnalyticsId: '',
};

/* ─── Tab ─── */
type TabKey = 'general' | 'seo' | 'social' | 'contact';
const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: 'general', label: 'General',  icon: <Globe size={15} /> },
  { key: 'seo',     label: 'SEO',      icon: <Search size={15} /> },
  { key: 'social',  label: 'Social',   icon: <Share2 size={15} /> },
  { key: 'contact', label: 'Contact',  icon: <Phone size={15} /> },
];

/* ─── Reusable label ─── */
const Label: React.FC<{ children: React.ReactNode; hint?: string }> = ({ children, hint }) => (
  <div className="mb-2">
    <label className="block text-sm font-semibold text-dark">{children}</label>
    {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
  </div>
);

/* ─── Input styles ─── */
const inp     = 'w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-dark bg-gray-50 transition-colors placeholder:text-gray-300';
const inpErr  = 'w-full border border-red-300 rounded-2xl px-4 py-3 text-sm outline-none focus:border-red-400 bg-red-50/30 transition-colors placeholder:text-gray-300';
const inpIcon = 'w-full border border-gray-200 rounded-2xl pl-11 pr-4 py-3 text-sm outline-none focus:border-dark bg-gray-50 transition-colors placeholder:text-gray-300';
const txt     = 'w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-dark bg-gray-50 transition-colors resize-none placeholder:text-gray-300';

/* ─── Section card ─── */
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

/* ─── Social row ─── */
const SocialRow: React.FC<{
  icon: React.ReactNode; label: string; placeholder: string;
  value: string; onChange: (v: string) => void;
}> = ({ icon, label, placeholder, value, onChange }) => (
  <div>
    <Label>{label}</Label>
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
      <input
        type="url"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={inpIcon}
      />
    </div>
  </div>
);

/* ─── Char counter color ─── */
const cc = (len: number, max: number) =>
  len > max ? 'text-red-500' : len > max * 0.85 ? 'text-yellow-500' : 'text-gray-400';

/* ─── Skeleton loader ─── */
const SkeletonField: React.FC<{ rows?: number }> = ({ rows = 1 }) => (
  <div className="space-y-2">
    <div className="w-24 h-4 bg-gray-200 rounded-full animate-pulse" />
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="w-full h-12 bg-gray-100 rounded-2xl animate-pulse" />
    ))}
  </div>
);

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-6 max-w-4xl">
    {/* Header skeleton */}
    <div className="flex justify-between items-start">
      <div className="space-y-2">
        <div className="w-32 h-9 bg-gray-200 rounded-full animate-pulse" />
        <div className="w-52 h-4 bg-gray-100 rounded-full animate-pulse" />
      </div>
      <div className="w-36 h-12 bg-gray-200 rounded-full animate-pulse" />
    </div>
    {/* Tabs skeleton */}
    <div className="flex gap-2 bg-white border border-gray-100 rounded-2xl p-1.5 w-fit">
      {[80, 60, 72, 76].map((w, i) => (
        <div key={i} style={{ width: w }} className="h-10 bg-gray-100 rounded-xl animate-pulse" />
      ))}
    </div>
    {/* Card skeleton */}
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-5">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-9 h-9 bg-gray-200 rounded-xl animate-pulse" />
        <div className="space-y-1">
          <div className="w-28 h-4 bg-gray-200 rounded-full animate-pulse" />
          <div className="w-44 h-3 bg-gray-100 rounded-full animate-pulse" />
        </div>
      </div>
      <div className="flex gap-4 items-start">
        <div className="w-24 h-24 bg-gray-100 rounded-2xl animate-pulse flex-shrink-0" />
        <div className="flex-1 h-24 bg-gray-100 rounded-2xl animate-pulse" />
      </div>
      <SkeletonField />
      <SkeletonField rows={2} />
    </div>
  </div>
);

/* ─── Error state (API unreachable) ─── */
const ApiErrorState: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <div className="max-w-4xl">
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center space-y-4">
      <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center mx-auto">
        <WifiOff size={24} className="text-orange-400" />
      </div>
      <div>
        <p className="font-bold text-dark text-lg">Settings Endpoint Not Found</p>
        <p className="text-sm text-gray-400 mt-1 max-w-sm mx-auto leading-relaxed">
          The settings API endpoint doesn't exist yet. You can still fill in the form —
          it will save once the backend is ready.
        </p>
      </div>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-dark transition-colors px-5 py-2.5 border border-gray-200 rounded-full hover:border-gray-300"
      >
        <RefreshCw size={14} />
        Retry Connection
      </button>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════ */
const SettingsPage: React.FC = () => {
  const [form, setForm]             = useState<SiteSettings>(DEFAULT);
  const [savedForm, setSavedForm]   = useState<SiteSettings>(DEFAULT); // track dirty state
  const [logoFile, setLogoFile]     = useState<File | null>(null);
  const [logoPreview, setLogoPrev]  = useState<string | null>(null);
  const [logoRemoved, setLogoRemoved] = useState(false);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [apiError, setApiError]     = useState(false);
  const [tab, setTab]               = useState<TabKey>('general');
  const [errors, setErrors]         = useState<Partial<Record<keyof SiteSettings, string>>>({});
  const logoRef = useRef<HTMLInputElement>(null);

  /* ── Check if form has unsaved changes ── */
  const isDirty = JSON.stringify(form) !== JSON.stringify(savedForm) || !!logoFile || logoRemoved;

  /* ── Fetch settings ── */
  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setApiError(false);
    try {
      const res = await api.get('/admin/settings');
      if (res.data?.success && res.data?.data) {
        const data = res.data.data as SiteSettings;
        // Merge with DEFAULT to ensure all keys exist even if backend omits some
        const merged: SiteSettings = { ...DEFAULT, ...data };
        setForm(merged);
        setSavedForm(merged);
        if (data.logo) setLogoPrev(data.logo);
      }
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 404) {
        // Endpoint doesn't exist yet — show empty form, NOT error state
        setForm(DEFAULT);
        setSavedForm(DEFAULT);
      } else if (status === 401 || status === 403) {
        // Auth error — interceptor handles redirect
      } else {
        // Network error or 500
        setApiError(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  /* ── Field helper ── */
  const set = (k: keyof SiteSettings) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm(p => ({ ...p, [k]: e.target.value }));
      if (errors[k]) setErrors(p => { const n = { ...p }; delete n[k]; return n; });
    };

  /* ── Logo upload ── */
  const ALLOWED_LOGO_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp'];
  const MAX_LOGO_SIZE_MB   = 2;

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (!ALLOWED_LOGO_TYPES.includes(f.type)) {
      toast.error('Logo must be PNG, JPG, SVG, or WebP');
      return;
    }
    if (f.size > MAX_LOGO_SIZE_MB * 1024 * 1024) {
      toast.error(`Logo must be under ${MAX_LOGO_SIZE_MB}MB`);
      return;
    }

    setLogoFile(f);
    setLogoPrev(URL.createObjectURL(f));
    setLogoRemoved(false);
    // Reset input so same file can be re-selected
    e.target.value = '';
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPrev(null);
    setLogoRemoved(true);
  };

  /* ── Validate ── */
  const validate = (): boolean => {
    const e: typeof errors = {};

    if (!form.siteTitle.trim()) {
      e.siteTitle = 'Site title is required';
    } else if (form.siteTitle.length > 100) {
      e.siteTitle = 'Site title too long (max 100 chars)';
    }

    if (form.metaTitle.length > 70) {
      e.metaTitle = 'Keep meta title under 70 characters';
    }

    if (form.metaDescription.length > 160) {
      e.metaDescription = 'Keep meta description under 160 characters';
    }

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Invalid email address';
    }

    if (form.whatsapp && !/^\d{8,15}$/.test(form.whatsapp.replace(/\s/g, ''))) {
      e.whatsapp = 'Enter digits only, 8–15 characters (e.g. 628123456789)';
    }

    // Validate social URLs if filled
    const urlFields: (keyof SiteSettings)[] = ['instagram', 'linkedin', 'facebook', 'twitter', 'youtube'];
    urlFields.forEach(field => {
      const val = form[field] as string;
      if (val && !val.startsWith('http://') && !val.startsWith('https://')) {
        e[field] = 'Must start with https://';
      }
    });

    setErrors(e);

    if (Object.keys(e).length > 0) {
      // Jump to first tab with error
      const errorKeys = Object.keys(e) as (keyof SiteSettings)[];
      const generalKeys: (keyof SiteSettings)[] = ['siteTitle', 'siteDescription'];
      const seoKeys: (keyof SiteSettings)[]     = ['metaTitle', 'metaDescription', 'metaKeywords', 'googleAnalyticsId'];
      const socialKeys: (keyof SiteSettings)[]  = ['instagram', 'linkedin', 'facebook', 'twitter', 'youtube'];
      const contactKeys: (keyof SiteSettings)[] = ['email', 'phone', 'whatsapp', 'address'];

      if (errorKeys.some(k => generalKeys.includes(k))) setTab('general');
      else if (errorKeys.some(k => seoKeys.includes(k))) setTab('seo');
      else if (errorKeys.some(k => socialKeys.includes(k))) setTab('social');
      else if (errorKeys.some(k => contactKeys.includes(k))) setTab('contact');
    }

    return Object.keys(e).length === 0;
  };

  /* ── Save ── */
  const handleSave = async () => {
    if (!validate()) {
      toast.error('Please fix the errors before saving');
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();

      // Append all string fields — skip undefined/null, send empty string for cleared fields
      const skipKeys: (keyof SiteSettings)[] = ['_id', 'logo'];
      (Object.keys(form) as Array<keyof SiteSettings>).forEach(k => {
        if (skipKeys.includes(k)) return;
        const val = form[k];
        fd.append(k, val !== undefined && val !== null ? String(val) : '');
      });

      // Logo handling
      if (logoFile) {
        fd.append('logo', logoFile);
      } else if (logoRemoved) {
        fd.append('removeLogo', 'true');
      }

      const res = await api.put('/admin/settings', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.success) {
        // Update saved snapshot
        setSavedForm({ ...form });
        setLogoRemoved(false);
        setLogoFile(null);
        // Update logo preview from response if server returns new URL
        if (res.data?.data?.logo) setLogoPrev(res.data.data.logo);
        toast.success('Settings saved successfully!');
      } else {
        toast.error(res.data?.message || 'Save failed — please try again');
      }
    } catch (err: any) {
      const status = err?.response?.status;
      const msg    = err?.response?.data?.message;

      if (status === 404) {
        // Backend endpoint not implemented yet
        toast.error('Settings endpoint not found on server. Please check the backend.');
      } else if (status === 413) {
        toast.error('File too large. Please use a smaller logo.');
      } else if (status === 422 || status === 400) {
        toast.error(msg || 'Validation error. Check your inputs.');
      } else if (status >= 500) {
        toast.error('Server error. Please try again later.');
      } else {
        toast.error(msg || 'Failed to save settings');
      }
    } finally {
      setSaving(false);
    }
  };

  /* ── Render states ── */
  if (loading) return <LoadingSkeleton />;
  if (apiError) return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-4xl font-display font-bold text-dark">Settings</h1>
        <p className="text-gray-400 text-sm mt-1 italic">Configure Winosa website settings</p>
      </div>
      <ApiErrorState onRetry={fetchSettings} />
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold text-dark">Settings</h1>
          <p className="text-gray-400 text-sm mt-1 italic">Configure Winosa website settings</p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <button
            onClick={handleSave}
            disabled={saving || !isDirty}
            className="flex items-center gap-2 bg-dark text-white font-semibold px-6 py-3 rounded-full transition-all duration-200 hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-md text-sm w-fit disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={15} />
                Save Changes
              </>
            )}
          </button>
          {isDirty && !saving && (
            <p className="text-xs text-amber-500 font-medium">• Unsaved changes</p>
          )}
          {!isDirty && !saving && (
            <p className="text-xs text-gray-300">All changes saved</p>
          )}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-2 bg-white border border-gray-100 rounded-2xl p-1.5 w-fit shadow-sm overflow-x-auto">
        {TABS.map(t => {
          // Show error dot on tab if has errors
          const tabFieldMap: Record<TabKey, (keyof SiteSettings)[]> = {
            general: ['siteTitle', 'siteDescription'],
            seo:     ['metaTitle', 'metaDescription', 'metaKeywords', 'googleAnalyticsId'],
            social:  ['instagram', 'linkedin', 'facebook', 'twitter', 'youtube'],
            contact: ['email', 'phone', 'whatsapp', 'address'],
          };
          const hasError = tabFieldMap[t.key].some(k => !!errors[k]);

          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                tab === t.key
                  ? 'bg-dark text-white shadow-sm'
                  : 'text-gray-500 hover:text-dark hover:bg-gray-50'
              }`}
            >
              {t.icon}{t.label}
              {hasError && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* ══════════ GENERAL ══════════ */}
      {tab === 'general' && (
        <Card
          icon={<Globe size={16} className="text-primary" />}
          iconBg="bg-primary/10"
          title="Site Identity"
          subtitle="Basic information about your website"
        >
          {/* Logo */}
          <div>
            <Label hint="PNG, SVG, or WebP recommended — transparent bg, min 200×200px — max 2MB">
              Logo
            </Label>
            <div className="flex items-start gap-4">
              {/* Preview */}
              <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {logoPreview
                  ? <img src={logoPreview} alt="logo" className="w-full h-full object-contain p-2" />
                  : (
                    <div className="text-center">
                      <Image size={20} className="text-gray-300 mx-auto mb-1" />
                      <p className="text-[10px] text-gray-300">No logo</p>
                    </div>
                  )
                }
              </div>

              {/* Upload zone */}
              <div className="flex-1">
                <div
                  onClick={() => logoRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-2xl p-5 bg-gray-50 cursor-pointer hover:border-dark transition-colors group text-center"
                >
                  <Upload size={20} className="text-gray-300 group-hover:text-dark mx-auto mb-2 transition-colors" />
                  <p className="text-xs text-gray-400 group-hover:text-dark transition-colors">
                    Click to upload logo
                  </p>
                  <p className="text-[10px] text-gray-300 mt-1">PNG, SVG, WebP, JPG — max 2 MB</p>
                </div>
                {logoPreview && (
                  <button
                    onClick={removeLogo}
                    className="mt-2 flex items-center gap-1 text-xs text-red-400 hover:text-red-500 transition-colors"
                  >
                    <X size={12} /> Remove logo
                  </button>
                )}
              </div>
              <input ref={logoRef} type="file" accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp" onChange={handleLogo} className="hidden" />
            </div>
          </div>

          {/* Site Title */}
          <div>
            <Label>
              Site Title <span className="text-red-400">*</span>
            </Label>
            <input
              type="text"
              placeholder="e.g. PT. Winosa Mitra Bharatadjaya"
              value={form.siteTitle}
              onChange={set('siteTitle')}
              maxLength={100}
              className={errors.siteTitle ? inpErr : inp}
            />
            {errors.siteTitle ? (
              <p className="flex items-center gap-1 mt-1.5 text-xs text-red-500">
                <AlertCircle size={11} />{errors.siteTitle}
              </p>
            ) : (
              <p className={`text-[11px] mt-1 text-right ${cc(form.siteTitle.length, 80)}`}>
                {form.siteTitle.length}/100
              </p>
            )}
          </div>

          {/* Site Description */}
          <div>
            <Label hint="Shown in website header/footer and fallback for SEO">
              Site Description
            </Label>
            <div className="relative">
              <textarea
                placeholder="Short description of your business..."
                value={form.siteDescription}
                onChange={set('siteDescription')}
                rows={3}
                maxLength={300}
                className={txt}
              />
              <span className={`absolute bottom-3 right-3 text-[11px] ${cc(form.siteDescription.length, 300)}`}>
                {form.siteDescription.length}/300
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* ══════════ SEO ══════════ */}
      {tab === 'seo' && (
        <div className="space-y-5">
          <Card
            icon={<Search size={16} className="text-blue-500" />}
            iconBg="bg-blue-50"
            title="SEO Settings"
            subtitle="Optimize how your site appears in search engines"
          >
            {/* SERP Preview */}
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4">
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-3">
                Search Result Preview
              </p>
              <p className="text-xs text-gray-400 font-medium">winosa.com</p>
              <p className="text-base text-blue-600 font-medium leading-tight truncate">
                {form.metaTitle || form.siteTitle || 'Your Site Title Here'}
              </p>
              <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mt-0.5">
                {form.metaDescription || form.siteDescription || 'Your meta description will appear here in search results.'}
              </p>
            </div>

            {/* Meta Title */}
            <div>
              <Label hint="Ideal length: 50–60 characters">Meta Title</Label>
              <input
                type="text"
                placeholder="e.g. Winosa — Digital Solutions & IT Consulting"
                value={form.metaTitle}
                onChange={set('metaTitle')}
                maxLength={70}
                className={errors.metaTitle ? inpErr : inp}
              />
              <div className="flex items-center justify-between mt-1">
                {errors.metaTitle ? (
                  <p className="flex items-center gap-1 text-xs text-red-500">
                    <AlertCircle size={11} />{errors.metaTitle}
                  </p>
                ) : <span />}
                <span className={`text-[11px] ${cc(form.metaTitle.length, 60)}`}>
                  {form.metaTitle.length}/60
                </span>
              </div>
            </div>

            {/* Meta Description */}
            <div>
              <Label hint="Ideal length: 120–160 characters">Meta Description</Label>
              <div className="relative">
                <textarea
                  placeholder="Describe your website in 1–2 compelling sentences..."
                  value={form.metaDescription}
                  onChange={set('metaDescription')}
                  rows={3}
                  maxLength={200}
                  className={errors.metaDescription ? `${inpErr} resize-none` : `${txt}`}
                />
                <span className={`absolute bottom-3 right-3 text-[11px] ${cc(form.metaDescription.length, 160)}`}>
                  {form.metaDescription.length}/160
                </span>
              </div>
              {errors.metaDescription && (
                <p className="flex items-center gap-1 mt-1 text-xs text-red-500">
                  <AlertCircle size={11} />{errors.metaDescription}
                </p>
              )}
            </div>

            {/* Keywords */}
            <div>
              <Label hint="Comma-separated keywords">Meta Keywords</Label>
              <input
                type="text"
                placeholder="web development, digital agency, UI/UX design, IT consulting"
                value={form.metaKeywords}
                onChange={set('metaKeywords')}
                className={inp}
              />
            </div>

            {/* Google Analytics */}
            <div className="border-t border-gray-100 pt-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center">
                  <BarChart2 size={16} className="text-orange-500" />
                </div>
                <div>
                  <h3 className="font-bold text-dark text-sm">Google Analytics</h3>
                  <p className="text-xs text-gray-400">Track your website traffic and user behavior</p>
                </div>
              </div>
              <Label hint='Found in GA4 Admin → Property → Data Streams. Starts with "G-"'>
                Measurement ID
              </Label>
              <input
                type="text"
                placeholder="G-XXXXXXXXXX"
                value={form.googleAnalyticsId}
                onChange={set('googleAnalyticsId')}
                className={inp}
              />
            </div>
          </Card>

          {/* SEO Tips */}
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <CheckCircle size={16} className="text-primary mt-0.5 flex-shrink-0" />
              <div className="space-y-1.5">
                <p className="text-sm font-semibold text-dark">SEO Best Practices</p>
                <ul className="space-y-1 text-xs text-gray-500">
                  <li>• <strong>Meta title</strong>: 50–60 characters for best visibility in search results</li>
                  <li>• <strong>Meta description</strong>: 120–160 chars, include a clear call to action</li>
                  <li>• Use natural keywords your target audience would actually search for</li>
                  <li>• Avoid keyword stuffing — focus on clarity and relevance</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ SOCIAL ══════════ */}
      {tab === 'social' && (
        <Card
          icon={<Share2 size={16} className="text-purple-500" />}
          iconBg="bg-purple-50"
          title="Social Media Links"
          subtitle="Paste the full URL for each platform (must start with https://)"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: <Instagram size={15} />, label: 'Instagram',    key: 'instagram' as const, ph: 'https://instagram.com/winosa' },
              { icon: <Linkedin size={15} />,  label: 'LinkedIn',     key: 'linkedin'  as const, ph: 'https://linkedin.com/company/winosa' },
              { icon: <Facebook size={15} />,  label: 'Facebook',     key: 'facebook'  as const, ph: 'https://facebook.com/winosa' },
              { icon: <Twitter size={15} />,   label: 'Twitter / X',  key: 'twitter'   as const, ph: 'https://twitter.com/winosa' },
              { icon: <Youtube size={15} />,   label: 'YouTube',      key: 'youtube'   as const, ph: 'https://youtube.com/@winosa' },
            ].map(({ icon, label, key, ph }) => (
              <div key={key}>
                <Label>{label}</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
                  <input
                    type="url"
                    placeholder={ph}
                    value={form[key]}
                    onChange={e => {
                      setForm(p => ({ ...p, [key]: e.target.value }));
                      if (errors[key]) setErrors(p => { const n = { ...p }; delete n[key]; return n; });
                    }}
                    className={errors[key] ? `${inpErr} pl-11` : `${inpIcon}`}
                  />
                </div>
                {errors[key] && (
                  <p className="flex items-center gap-1 mt-1 text-xs text-red-500">
                    <AlertCircle size={11} />{errors[key]}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ══════════ CONTACT ══════════ */}
      {tab === 'contact' && (
        <Card
          icon={<Phone size={16} className="text-green-500" />}
          iconBg="bg-green-50"
          title="Contact Information"
          subtitle="Shown on your website's contact section and footer"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Email */}
            <div>
              <Label>Email Address</Label>
              <div className="relative">
                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="hello@winosa.com"
                  value={form.email}
                  onChange={set('email')}
                  className={errors.email ? `${inpErr} pl-11` : `${inpIcon}`}
                />
              </div>
              {errors.email && (
                <p className="flex items-center gap-1 mt-1 text-xs text-red-500">
                  <AlertCircle size={11} />{errors.email}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <Label>Phone Number</Label>
              <div className="relative">
                <Phone size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  placeholder="+62 21 xxxx xxxx"
                  value={form.phone}
                  onChange={set('phone')}
                  className={inpIcon}
                />
              </div>
            </div>

            {/* WhatsApp */}
            <div>
              <Label hint="Digits only with country code — e.g. 628123456789">WhatsApp</Label>
              <div className="relative">
                <MessageCircle size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  placeholder="628123456789"
                  value={form.whatsapp}
                  onChange={e => {
                    // Only allow digits and spaces
                    const cleaned = e.target.value.replace(/[^\d\s]/g, '');
                    setForm(p => ({ ...p, whatsapp: cleaned }));
                    if (errors.whatsapp) setErrors(p => { const n = { ...p }; delete n.whatsapp; return n; });
                  }}
                  className={errors.whatsapp ? `${inpErr} pl-11` : `${inpIcon}`}
                />
              </div>
              {errors.whatsapp && (
                <p className="flex items-center gap-1 mt-1 text-xs text-red-500">
                  <AlertCircle size={11} />{errors.whatsapp}
                </p>
              )}
            </div>
          </div>

          {/* Address — full width */}
          <div>
            <Label>Office Address</Label>
            <div className="relative">
              <MapPin size={15} className="absolute left-4 top-4 text-gray-400" />
              <textarea
                placeholder="Jl. Sudirman No. 1, Jakarta Pusat, DKI Jakarta 10220"
                value={form.address}
                onChange={set('address')}
                rows={3}
                className="w-full border border-gray-200 rounded-2xl pl-11 pr-4 py-3 text-sm outline-none focus:border-dark bg-gray-50 transition-colors resize-none placeholder:text-gray-300"
              />
            </div>
          </div>
        </Card>
      )}

    </div>
  );
};

export default SettingsPage;