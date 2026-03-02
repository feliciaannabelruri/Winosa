import React, { useEffect, useState, useRef } from 'react';
import {
  Globe, Search, Share2, Phone,
  Upload, Image, Save, CheckCircle, AlertCircle,
  Instagram, Linkedin, Facebook, Twitter, Youtube,
  Mail, MapPin, MessageCircle, BarChart2, X,
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

/* ─── Input style ─── */
const inp = 'w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-dark bg-gray-50 transition-colors placeholder:text-gray-300';
const inpIcon = 'w-full border border-gray-200 rounded-2xl pl-11 pr-4 py-3 text-sm outline-none focus:border-dark bg-gray-50 transition-colors placeholder:text-gray-300';
const txt = 'w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-dark bg-gray-50 transition-colors resize-none placeholder:text-gray-300';

/* ─── Section card wrapper ─── */
const Card: React.FC<{
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  subtitle: string;
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
      <input type="url" placeholder={placeholder} value={value}
        onChange={e => onChange(e.target.value)} className={inpIcon} />
    </div>
  </div>
);

/* ─── Char counter color ─── */
const cc = (len: number, max: number) =>
  len > max ? 'text-red-500' : len > max * 0.85 ? 'text-yellow-500' : 'text-gray-400';

/* ══════════════════════════════════════════════════════ */
const SettingsPage: React.FC = () => {
  const [form, setForm]           = useState<SiteSettings>(DEFAULT);
  const [logoFile, setLogoFile]   = useState<File | null>(null);
  const [logoPreview, setLogoPrev] = useState<string | null>(null);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [tab, setTab]             = useState<TabKey>('general');
  const [errors, setErrors]       = useState<Partial<Record<keyof SiteSettings, string>>>({});
  const logoRef = useRef<HTMLInputElement>(null);

  /* fetch */
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/admin/settings');
        if (res.data?.success && res.data?.data) {
          setForm(res.data.data);
          setLogoPrev(res.data.data.logo || null);
        }
      } catch {
        /* endpoint belum ada → pakai defaults, page tetap render */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* field helper */
  const set = (k: keyof SiteSettings) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(p => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors(p => { const n = { ...p }; delete n[k]; return n; });
  };

  /* logo */
  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 2 * 1024 * 1024) { toast.error('Logo max 2 MB'); return; }
    setLogoFile(f);
    setLogoPrev(URL.createObjectURL(f));
  };

  /* validate */
  const validate = () => {
    const e: typeof errors = {};
    if (!form.siteTitle.trim()) e.siteTitle = 'Site title is required';
    if (form.metaDescription.length > 160) e.metaDescription = 'Keep under 160 characters';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* save */
  const handleSave = async () => {
    if (!validate()) { toast.error('Fix errors before saving'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      (Object.keys(form) as Array<keyof SiteSettings>).forEach(k => {
        if (!['_id', 'logo', 'updatedAt'].includes(k) && form[k] !== undefined)
          fd.append(k, String(form[k]));
      });
      if (logoFile) fd.append('logo', logoFile);
      await api.put('/admin/settings', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Settings saved!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold text-dark">Settings</h1>
          <p className="text-gray-400 text-sm mt-1 italic">Configure Winosa website settings</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 bg-dark text-white font-semibold px-6 py-3 rounded-full transition-all duration-200 hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-md text-sm w-fit disabled:opacity-50 disabled:cursor-not-allowed">
          <Save size={15} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white border border-gray-100 rounded-2xl p-1.5 w-fit shadow-sm">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              tab === t.key ? 'bg-dark text-white shadow-sm' : 'text-gray-500 hover:text-dark hover:bg-gray-50'
            }`}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* ── GENERAL ── */}
      {tab === 'general' && (
        <Card icon={<Globe size={16} className="text-primary" />} iconBg="bg-primary/10"
          title="Site Identity" subtitle="Basic information about your website">

          {/* Logo */}
          <div>
            <Label hint="PNG/SVG recommended, transparent bg, min 200×200px">Logo</Label>
            <div className="flex items-start gap-4">
              <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {logoPreview
                  ? <img src={logoPreview} alt="logo" className="w-full h-full object-contain p-2" />
                  : <div className="text-center"><Image size={20} className="text-gray-300 mx-auto mb-1" /><p className="text-[10px] text-gray-300">No logo</p></div>
                }
              </div>
              <div className="flex-1">
                <div onClick={() => logoRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-2xl p-5 bg-gray-50 cursor-pointer hover:border-dark transition-colors group text-center">
                  <Upload size={20} className="text-gray-300 group-hover:text-dark mx-auto mb-2 transition-colors" />
                  <p className="text-xs text-gray-400 group-hover:text-dark transition-colors">Click to upload logo</p>
                  <p className="text-[10px] text-gray-300 mt-1">PNG, SVG, JPG — max 2 MB</p>
                </div>
                {logoPreview && (
                  <button onClick={() => { setLogoFile(null); setLogoPrev(null); }}
                    className="mt-2 flex items-center gap-1 text-xs text-red-400 hover:text-red-500 transition-colors">
                    <X size={12} /> Remove logo
                  </button>
                )}
              </div>
              <input ref={logoRef} type="file" accept="image/*" onChange={handleLogo} className="hidden" />
            </div>
          </div>

          {/* Site Title */}
          <div>
            <Label>Site Title <span className="text-red-400">*</span></Label>
            <input type="text" placeholder="e.g. PT. Winosa Mitra Bharatadjaya"
              value={form.siteTitle} onChange={set('siteTitle')}
              className={`${inp} ${errors.siteTitle ? 'border-red-300' : ''}`} />
            {errors.siteTitle && (
              <p className="flex items-center gap-1 mt-1 text-xs text-red-500">
                <AlertCircle size={11} />{errors.siteTitle}
              </p>
            )}
          </div>

          {/* Site Description */}
          <div>
            <Label hint="Shown in website header/footer">Site Description</Label>
            <div className="relative">
              <textarea placeholder="Short description of your business..."
                value={form.siteDescription} onChange={set('siteDescription')}
                rows={3} maxLength={300} className={txt} />
              <span className={`absolute bottom-3 right-3 text-[11px] ${cc(form.siteDescription.length, 300)}`}>
                {form.siteDescription.length}/300
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* ── SEO ── */}
      {tab === 'seo' && (
        <div className="space-y-5">
          <Card icon={<Search size={16} className="text-blue-500" />} iconBg="bg-blue-50"
            title="SEO Settings" subtitle="Optimize how your site appears in search engines">

            {/* SERP Preview */}
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4">
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-3">Search Result Preview</p>
              <p className="text-xs text-gray-400">winosa.com</p>
              <p className="text-base text-blue-600 font-medium leading-tight truncate">
                {form.metaTitle || form.siteTitle || 'Your Site Title'}
              </p>
              <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mt-0.5">
                {form.metaDescription || form.siteDescription || 'Your meta description will appear here.'}
              </p>
            </div>

            {/* Meta Title */}
            <div>
              <Label hint="Ideal: 50–60 characters">Meta Title</Label>
              <input type="text" placeholder="e.g. Winosa — Digital Solutions"
                value={form.metaTitle} onChange={set('metaTitle')} className={inp} maxLength={70} />
              <span className={`text-[11px] mt-1 block text-right ${cc(form.metaTitle.length, 60)}`}>
                {form.metaTitle.length}/60
              </span>
            </div>

            {/* Meta Description */}
            <div>
              <Label hint="Ideal: 120–160 characters">Meta Description</Label>
              <div className="relative">
                <textarea placeholder="Describe your website in 1–2 compelling sentences..."
                  value={form.metaDescription} onChange={set('metaDescription')}
                  rows={3} maxLength={200}
                  className={`${txt} ${errors.metaDescription ? 'border-red-300' : ''}`} />
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
              <Label hint="Comma-separated">Meta Keywords</Label>
              <input type="text" placeholder="web development, digital agency, UI/UX design"
                value={form.metaKeywords} onChange={set('metaKeywords')} className={inp} />
            </div>

            {/* GA */}
            <div className="border-t border-gray-100 pt-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center">
                  <BarChart2 size={16} className="text-orange-500" />
                </div>
                <div>
                  <h3 className="font-bold text-dark text-sm">Google Analytics</h3>
                  <p className="text-xs text-gray-400">Track your website traffic</p>
                </div>
              </div>
              <Label hint="From your GA property settings">Measurement ID</Label>
              <input type="text" placeholder="G-XXXXXXXXXX"
                value={form.googleAnalyticsId} onChange={set('googleAnalyticsId')} className={inp} />
            </div>
          </Card>

          {/* SEO Tips */}
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <CheckCircle size={16} className="text-primary mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-dark">SEO Best Practices</p>
                <ul className="space-y-1 text-xs text-gray-500">
                  <li>• Meta title: 50–60 characters for best visibility</li>
                  <li>• Meta description: 120–160 characters, include a call to action</li>
                  <li>• Use natural keywords your audience would search for</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SOCIAL ── */}
      {tab === 'social' && (
        <Card icon={<Share2 size={16} className="text-purple-500" />} iconBg="bg-purple-50"
          title="Social Media Links" subtitle="Paste full URLs for each platform">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SocialRow icon={<Instagram size={15} />} label="Instagram"
              placeholder="https://instagram.com/winosa" value={form.instagram}
              onChange={v => setForm(p => ({ ...p, instagram: v }))} />
            <SocialRow icon={<Linkedin size={15} />} label="LinkedIn"
              placeholder="https://linkedin.com/company/winosa" value={form.linkedin}
              onChange={v => setForm(p => ({ ...p, linkedin: v }))} />
            <SocialRow icon={<Facebook size={15} />} label="Facebook"
              placeholder="https://facebook.com/winosa" value={form.facebook}
              onChange={v => setForm(p => ({ ...p, facebook: v }))} />
            <SocialRow icon={<Twitter size={15} />} label="Twitter / X"
              placeholder="https://twitter.com/winosa" value={form.twitter}
              onChange={v => setForm(p => ({ ...p, twitter: v }))} />
            <SocialRow icon={<Youtube size={15} />} label="YouTube"
              placeholder="https://youtube.com/@winosa" value={form.youtube}
              onChange={v => setForm(p => ({ ...p, youtube: v }))} />
          </div>
        </Card>
      )}

      {/* ── CONTACT ── */}
      {tab === 'contact' && (
        <Card icon={<Phone size={16} className="text-green-500" />} iconBg="bg-green-50"
          title="Contact Information" subtitle="Shown on your website's contact section">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Email */}
            <div>
              <Label>Email Address</Label>
              <div className="relative">
                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" placeholder="hello@winosa.com"
                  value={form.email} onChange={set('email')}
                  className={`${inpIcon} ${errors.email ? 'border-red-300' : ''}`} />
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
                <input type="tel" placeholder="+62 21 xxxx xxxx"
                  value={form.phone} onChange={set('phone')} className={inpIcon} />
              </div>
            </div>

            {/* WhatsApp */}
            <div>
              <Label hint="Include country code, e.g. 628123456789">WhatsApp</Label>
              <div className="relative">
                <MessageCircle size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="tel" placeholder="628123456789"
                  value={form.whatsapp} onChange={set('whatsapp')} className={inpIcon} />
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <Label>Office Address</Label>
            <div className="relative">
              <MapPin size={15} className="absolute left-4 top-4 text-gray-400" />
              <textarea placeholder="Jl. Sudirman No. 1, Jakarta Pusat..."
                value={form.address} onChange={set('address')}
                rows={3} className="w-full border border-gray-200 rounded-2xl pl-11 pr-4 py-3 text-sm outline-none focus:border-dark bg-gray-50 transition-colors resize-none placeholder:text-gray-300" />
            </div>
          </div>
        </Card>
      )}

    </div>
  );
};

export default SettingsPage;