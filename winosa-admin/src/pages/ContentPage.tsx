import React, { useEffect, useRef, useState } from 'react';
import {
  Users, Image as ImageIcon, Plus, Pencil, Trash2,
  X, Upload, Save, Loader2, ChevronUp, ChevronDown,
  FileText, ChevronDown as ChevronDownIcon,
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
interface TeamMember {
  _id:   string;
  name:  string;
  role:  string;
  image: string;
  order: number;
}

interface GlassImages {
  whoWeAre: { image1: string; image2: string };
  whatWeDo: { image1: string; image2: string };
  vision:   { image:  string };
}

interface StatItem   { value: string; label: string }
interface ValueItem  { key: string; title: string; desc: string }
interface WhyUsItem  { label: string; desc: string }

interface AboutContent {
  /* Hero */
  heroLabel:      string;
  heroTitle:      string;
  heroDesc:       string;
  scenario1Title: string;
  scenario1Desc:  string;
  scenario2Title: string;
  scenario2Desc:  string;
  /* Stats */
  stats: StatItem[];
  /* Story */
  ourStoryLabel: string;
  storyTitle:    string;
  storyP1:       string;
  storyP2:       string;
  storyP3:       string;
  serviceTags:   string[];
  clientFocus:   string;
  /* Values */
  whatDrivesUs:    string;
  ourCoreValues:   string;
  coreValuesDesc:  string;
  values: ValueItem[];
  /* Direction */
  directionLabel: string;
  missionTitle:   string;
  missionDesc:    string;
  visionTitle:    string;
  visionDesc:     string;
  whyUs: WhyUsItem[];
}

const DEFAULT_ABOUT: AboutContent = {
  heroLabel:      'Our Story',
  heroTitle:      'We Build Digital Products That Matter',
  heroDesc:       'A team of developers, designers, and strategists building impactful digital experiences.',
  scenario1Title: 'For Startups',
  scenario1Desc:  'We help early-stage companies move fast and build the right product.',
  scenario2Title: 'For Enterprises',
  scenario2Desc:  'We help established businesses modernize and scale their digital infrastructure.',
  stats: [
    { value: '50+', label: 'Projects Done' },
    { value: '30+', label: 'Happy Clients' },
    { value: '10+', label: 'Team Members' },
    { value: '3+',  label: 'Years Experience' },
  ],
  ourStoryLabel: 'Our Story',
  storyTitle:    'From Lampung to the World',
  storyP1:       'Winosa Mitra Bharatajaya was founded with a single purpose: to bridge the gap between innovative technology and real business impact.',
  storyP2:       'We specialize in custom web development, mobile applications, UI/UX design, and IT consulting.',
  storyP3:       'Our multilingual approach reflects our commitment to serving diverse clients and building bridges across cultures.',
  serviceTags:   ['Web Development', 'Mobile App', 'UI/UX Design', 'IT Consulting'],
  clientFocus:   'Client Focus',
  whatDrivesUs:   'What Drives Us',
  ourCoreValues:  'Our Core Values',
  coreValuesDesc: 'These are the principles that guide every decision, every line of code, and every client relationship.',
  values: [
    { key: 'innovation',  title: 'Innovation',  desc: 'We constantly push boundaries to deliver cutting-edge digital solutions.' },
    { key: 'integrity',   title: 'Integrity',   desc: 'Every commitment we make is backed by transparency, honesty, and accountability.' },
    { key: 'partnership', title: 'Partnership', desc: 'We believe in building long-term relationships with our clients.' },
    { key: 'impact',      title: 'Impact',      desc: 'Every solution we create is measured by real business value.' },
  ],
  directionLabel: 'Direction',
  missionTitle:   'Our Mission',
  missionDesc:    'To empower businesses — from startups to enterprises — with technology-driven solutions that accelerate growth.',
  visionTitle:    'Our Vision',
  visionDesc:     'To become a globally recognized IT consulting and development partner from Indonesia.',
  whyUs: [
    { label: 'Custom Built',          desc: 'Tailored digital solutions for every business.' },
    { label: 'Security First',        desc: 'We prioritize security in every system.' },
    { label: 'Multilingual Support',  desc: 'Support for multiple languages and regions.' },
  ],
};

type Tab = 'team' | 'about';

/* ─────────────────────────────────────────
   REUSABLE: Accordion Section
───────────────────────────────────────── */
function AccordionSection({ title, badge, children, defaultOpen = false }: {
  title: string; badge?: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-colors"
      >
        <span className="font-bold text-dark flex-1 text-left">{title}</span>
        {badge && <span className="text-xs text-gray-400 mr-2">{badge}</span>}
        <ChevronDownIcon
          size={16}
          className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <div className="px-6 pb-6 pt-1 border-t border-gray-100">{children}</div>}
    </div>
  );
}

/* ─────────────────────────────────────────
   REUSABLE: Field components
───────────────────────────────────────── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, maxLength, hasError }: {
  value: string; onChange: (v: string) => void; placeholder?: string; maxLength?: number; hasError?: boolean;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = maxLength ? e.target.value.slice(0, maxLength) : e.target.value;
    onChange(val);
  };
  return (
    <div className="relative">
      <input
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        maxLength={maxLength}
        data-error={hasError || undefined}
        className={`w-full border rounded-2xl px-4 py-3 text-sm outline-none transition-colors ${hasError ? 'border-red-400 bg-red-50 focus:border-red-500' : 'border-gray-200 focus:border-primary'}`}
      />
      {hasError && <p className="text-red-400 text-[10px] mt-1 ml-1">This field is required.</p>}
      {maxLength && (
        <span className={`absolute right-3 bottom-3 text-[10px] ${value.length >= maxLength ? 'text-red-400' : 'text-gray-300'}`}>
          {value.length}/{maxLength}
        </span>
      )}
    </div>
  );
}

function TextArea({ value, onChange, placeholder, rows = 3, maxLength, hasError }: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number; maxLength?: number; hasError?: boolean;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = maxLength ? e.target.value.slice(0, maxLength) : e.target.value;
    onChange(val);
  };
  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        data-error={hasError || undefined}
        className={`w-full border rounded-2xl px-4 py-3 text-sm outline-none transition-colors resize-none ${hasError ? 'border-red-400 bg-red-50 focus:border-red-500' : 'border-gray-200 focus:border-primary'}`}
      />
      {hasError && <p className="text-red-400 text-[10px] mt-1 ml-1">This field is required.</p>}
      {maxLength && (
        <span className={`absolute right-3 bottom-3 text-[10px] ${value.length >= maxLength ? 'text-red-400' : 'text-gray-300'}`}>
          {value.length}/{maxLength}
        </span>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   ImageUploadBox (unchanged)
───────────────────────────────────────── */
function ImageUploadBox({
  label, value, onChange, aspect = 'portrait',
}: {
  label: string; value: string; onChange: (url: string) => void;
  aspect?: 'portrait' | 'landscape' | 'square';
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const heightClass =
    aspect === 'portrait'  ? 'h-52' :
    aspect === 'landscape' ? 'h-36' : 'h-44';

  const handleFile = async (file: File) => {
    if (!file) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await api.post('/admin/upload?folder=content', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onChange(res.data.data.url);
      toast.success('Image uploaded successfully');
    } catch {
      toast.error('Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
      <div className={`relative ${heightClass} rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden bg-gray-50 group transition-colors`}>
        {value ? (
          <>
            <img src={value} alt={label} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3">
              {loading ? (
                <Loader2 size={24} className="animate-spin text-white" />
              ) : (
                <>
                  <button type="button" onClick={e => { e.stopPropagation(); inputRef.current?.click(); }}
                    className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors" title="Replace image">
                    <Upload size={16} className="text-dark" />
                  </button>
                  <button type="button" onClick={e => { e.stopPropagation(); onChange(''); }}
                    className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm hover:bg-red-50 transition-colors" title="Delete image">
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400 cursor-pointer hover:text-dark transition-colors"
            onClick={() => inputRef.current?.click()}>
            {loading
              ? <Loader2 size={24} className="animate-spin text-primary" />
              : <><Upload size={20} /><span className="text-xs">Click to upload</span></>
            }
          </div>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
    </div>
  );
}

/* ─────────────────────────────────────────
   MemberModal (unchanged)
───────────────────────────────────────── */
function MemberModal({ initial, onSave, onClose }: {
  initial?: TeamMember | null;
  onSave:   (data: Omit<TeamMember, '_id' | 'order'>) => Promise<void>;
  onClose:  () => void;
}) {
  const [form, setForm]     = useState({ name: initial?.name ?? '', role: initial?.role ?? '', image: initial?.image ?? '' });
  const [saving, setSaving] = useState(false);
  const set = (k: keyof typeof form) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.role.trim()) { toast.error('Name and position are required'); return; }
    setSaving(true);
    try { await onSave(form); onClose(); } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-dark text-lg">{initial ? 'Edit Member' : 'Add Member'}</h3>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-gray-100 transition-colors">
            <X size={18} className="text-gray-500" />
          </button>
        </div>
        <ImageUploadBox label="Photo" value={form.image} onChange={set('image')} aspect="portrait" />
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</label>
          <input value={form.name} onChange={e => set('name')(e.target.value)} placeholder="e.g. Michael Anderson"
            className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Position</label>
          <input value={form.role} onChange={e => set('role')(e.target.value)} placeholder="e.g. CEO & Founder"
            className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors" />
        </div>
        <div className="flex gap-3 pt-1">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-full border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full bg-dark text-white hover:bg-gray-800 transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   ABOUT TAB
───────────────────────────────────────── */
function AboutTab({ glass, updateGlass, saveGlass, savingGlass }: {
  glass: GlassImages;
  updateGlass: (path: string[], value: string) => void;
  saveGlass: () => Promise<void>;
  savingGlass: boolean;
}) {
  const [about, setAbout]     = useState<AboutContent>(DEFAULT_ABOUT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [tagsStr, setTagsStr] = useState(about.serviceTags.join(', '));
  const [errors, setErrors]   = useState<Record<string, boolean>>({});
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setTagsStr(about.serviceTags.join(', '));
  }, [loading]);

  useEffect(() => {
    api.get('/admin/settings')
      .then(r => {
        const data = r.data?.data;
        if (data) setAbout({ ...DEFAULT_ABOUT, ...data });
      })
      .catch(() => toast.error('Failed to load About content'))
      .finally(() => setLoading(false));
  }, []);

  const set = <K extends keyof AboutContent>(key: K) => (val: AboutContent[K]) => {
    setAbout(prev => ({ ...prev, [key]: val }));
    setErrors(prev => ({ ...prev, [key as string]: false }));
    setIsDirty(true);
  };

  const setStat = (i: number, field: keyof StatItem, val: string) => {
    setAbout(prev => {
      const stats = [...prev.stats];
      stats[i] = { ...stats[i], [field]: val };
      return { ...prev, stats };
    });
    setErrors(prev => ({ ...prev, [`stat_${field}_${i}`]: false }));
    setIsDirty(true);
  };

  const setValue = (i: number, field: keyof ValueItem, val: string) => {
    setAbout(prev => {
      const values = [...prev.values];
      values[i] = { ...values[i], [field]: val };
      return { ...prev, values };
    });
    setErrors(prev => ({ ...prev, [`value_${field}_${i}`]: false }));
    setIsDirty(true);
  };

  const setWhyUs = (i: number, field: keyof WhyUsItem, val: string) => {
    setAbout(prev => {
      const whyUs = [...prev.whyUs];
      whyUs[i] = { ...whyUs[i], [field]: val };
      return { ...prev, whyUs };
    });
    setErrors(prev => ({ ...prev, [`whyus_${field}_${i}`]: false }));
    setIsDirty(true);
  };

  const setTagsFromStr = (str: string) =>
    set('serviceTags')(str.split(',').map(s => s.trim()).filter(Boolean));

  const handleSave = async () => {
    const newErrors: Record<string, boolean> = {};
    if (!about.heroLabel.trim())       newErrors.heroLabel = true;
    if (!about.heroTitle.trim())       newErrors.heroTitle = true;
    if (!about.heroDesc.trim())        newErrors.heroDesc = true;
    if (!about.clientFocus.trim())     newErrors.clientFocus = true;
    if (!about.scenario1Title.trim())  newErrors.scenario1Title = true;
    if (!about.scenario1Desc.trim())   newErrors.scenario1Desc = true;
    if (!about.scenario2Title.trim())  newErrors.scenario2Title = true;
    if (!about.scenario2Desc.trim())   newErrors.scenario2Desc = true;
    about.stats.forEach((s, i) => {
      if (!s.value.trim()) newErrors[`stat_value_${i}`] = true;
      if (!s.label.trim()) newErrors[`stat_label_${i}`] = true;
    });
    if (!about.ourStoryLabel.trim()) newErrors.ourStoryLabel = true;
    if (!about.storyTitle.trim())    newErrors.storyTitle = true;
    if (!about.storyP1.trim())       newErrors.storyP1 = true;
    if (!about.storyP2.trim())       newErrors.storyP2 = true;
    if (!about.storyP3.trim())       newErrors.storyP3 = true;
    if (!about.serviceTags.length)   newErrors.serviceTags = true;
    if (!about.whatDrivesUs.trim())   newErrors.whatDrivesUs = true;
    if (!about.ourCoreValues.trim())  newErrors.ourCoreValues = true;
    if (!about.coreValuesDesc.trim()) newErrors.coreValuesDesc = true;
    about.values.forEach((v, i) => {
      if (!v.title.trim()) newErrors[`value_title_${i}`] = true;
      if (!v.desc.trim())  newErrors[`value_desc_${i}`] = true;
    });
    if (!about.directionLabel.trim()) newErrors.directionLabel = true;
    if (!about.missionTitle.trim())   newErrors.missionTitle = true;
    if (!about.missionDesc.trim())    newErrors.missionDesc = true;
    if (!about.visionTitle.trim())    newErrors.visionTitle = true;
    if (!about.visionDesc.trim())     newErrors.visionDesc = true;
    about.whyUs.forEach((w, i) => {
      if (!w.label.trim()) newErrors[`whyus_label_${i}`] = true;
      if (!w.desc.trim())  newErrors[`whyus_desc_${i}`] = true;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fill in all required fields.');
      setTimeout(() => {
        const firstError = document.querySelector('[data-error="true"]');
        if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      return;
    }

    setErrors({});
    setSaving(true);
    try {
      await api.put('/admin/content/about', about);
      toast.success('About page saved successfully');
      setIsDirty(false);
    } catch {
      toast.error('Failed to save About page');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-48">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-4">

      {/* ── 1. Hero ── */}
      <AccordionSection title="Hero Section" badge="Label · Title · Description · 2 Scenario Cards" defaultOpen>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Field label="Hero Label">
            <TextInput value={about.heroLabel} onChange={set('heroLabel')} placeholder="Our Story" maxLength={30} hasError={errors.heroLabel} />
          </Field>
          <Field label="Client Focus Badge Text">
            <TextInput value={about.clientFocus} onChange={set('clientFocus')} placeholder="Client Focus" maxLength={30} hasError={errors.clientFocus} />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Hero Title">
            <TextInput value={about.heroTitle} onChange={set('heroTitle')} placeholder="We Build Digital Products That Matter" maxLength={80} hasError={errors.heroTitle} />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Hero Description">
            <TextArea value={about.heroDesc} onChange={set('heroDesc')} rows={2} maxLength={200} hasError={errors.heroDesc} />
          </Field>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="p-4 bg-gray-50 rounded-2xl space-y-3">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Scenario Card 1</p>
            <Field label="Title">
              <TextInput value={about.scenario1Title} onChange={set('scenario1Title')} placeholder="For Startups" maxLength={40} hasError={errors.scenario1Title} />
            </Field>
            <Field label="Description">
              <TextArea value={about.scenario1Desc} onChange={set('scenario1Desc')} rows={2} maxLength={120} hasError={errors.scenario1Desc} />
            </Field>
          </div>
          <div className="p-4 bg-gray-50 rounded-2xl space-y-3">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Scenario Card 2</p>
            <Field label="Title">
              <TextInput value={about.scenario2Title} onChange={set('scenario2Title')} placeholder="For Enterprises" maxLength={40} hasError={errors.scenario2Title} />
            </Field>
            <Field label="Description">
              <TextArea value={about.scenario2Desc} onChange={set('scenario2Desc')} rows={2} maxLength={120} hasError={errors.scenario2Desc} />
            </Field>
          </div>
        </div>
      </AccordionSection>

      {/* ── 2. Stats ── */}
      <AccordionSection title="Stats" badge="4 cards">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {about.stats.map((s, i) => (
            <div key={i} className="p-3 bg-gray-50 rounded-2xl space-y-2">
              <Field label={`Stat ${i + 1} Value`}>
                <TextInput value={s.value} onChange={v => setStat(i, 'value', v)} placeholder="50+" hasError={errors[`stat_value_${i}`]} />
              </Field>
              <Field label="Label">
                <TextInput value={s.label} onChange={v => setStat(i, 'label', v)} placeholder="Projects Done" hasError={errors[`stat_label_${i}`]} />
              </Field>
            </div>
          ))}
        </div>
      </AccordionSection>

      {/* ── 3. Our Story ── */}
      <AccordionSection title="Our Story" badge="Label · Title · 3 Paragraphs · Tags">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Field label="Section Label">
            <TextInput value={about.ourStoryLabel} onChange={set('ourStoryLabel')} placeholder="Our Story" maxLength={30} hasError={errors.ourStoryLabel} />
          </Field>
          <Field label="Story Title">
            <TextInput value={about.storyTitle} onChange={set('storyTitle')} placeholder="From Lampung to the World" maxLength={60} hasError={errors.storyTitle} />
          </Field>
        </div>
        <div className="space-y-3 mt-4">
          <Field label="Paragraph 1">
            <TextArea value={about.storyP1} onChange={set('storyP1')} rows={3} maxLength={300} hasError={errors.storyP1} />
          </Field>
          <Field label="Paragraph 2">
            <TextArea value={about.storyP2} onChange={set('storyP2')} rows={3} maxLength={300} hasError={errors.storyP2} />
          </Field>
          <Field label="Paragraph 3">
            <TextArea value={about.storyP3} onChange={set('storyP3')} rows={3} maxLength={300} hasError={errors.storyP3} />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Service Tags (comma-separated)">
            <input
              value={tagsStr}
              onChange={e => { setTagsStr(e.target.value); setIsDirty(true); setErrors(prev => ({ ...prev, serviceTags: false })); }}
              onBlur={() => setTagsFromStr(tagsStr)}
              placeholder="Web Development, Mobile App, UI/UX Design, IT Consulting"
              data-error={errors.serviceTags || undefined}
              className={`w-full border rounded-2xl px-4 py-3 text-sm outline-none transition-colors ${errors.serviceTags ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-primary'}`}
            />
          </Field>
          {errors.serviceTags && <p className="text-red-400 text-[10px] mt-1 ml-1">This field is required.</p>}
          <p className="text-xs text-gray-400 mt-1.5 ml-1">Separate with commas. Tags are processed when you click outside the field.</p>
        </div>
        <div className="mt-6 pt-5 border-t border-gray-100">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Story Photos</p>
          <p className="text-xs text-gray-400 mb-3">These photos appear on the About page alongside the story text.</p>
          <div className="grid grid-cols-2 gap-4">
            <ImageUploadBox label="Main Photo (large)" value={glass.whoWeAre.image1}
              onChange={v => updateGlass(['whoWeAre', 'image1'], v)} aspect="landscape" />
            <ImageUploadBox label="Secondary Photo (small overlay)" value={glass.whoWeAre.image2}
              onChange={v => updateGlass(['whoWeAre', 'image2'], v)} aspect="landscape" />
          </div>
          <div className="flex justify-end mt-3">
            <button onClick={saveGlass} disabled={savingGlass}
              className="flex items-center gap-2 bg-gray-800 text-white text-xs font-bold px-5 py-2.5 rounded-full hover:bg-gray-700 transition-all disabled:opacity-50">
              {savingGlass ? <><Loader2 size={12} className="animate-spin" /> Saving...</> : <><Save size={12} /> Save Photos</>}
            </button>
          </div>
        </div>
      </AccordionSection>

      {/* ── 4. Core Values ── */}
      <AccordionSection title="Core Values" badge="Label · Title · Desc · 4 Value Cards">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <Field label="What Drives Us Label">
            <TextInput value={about.whatDrivesUs} onChange={set('whatDrivesUs')} placeholder="What Drives Us" hasError={errors.whatDrivesUs} />
          </Field>
          <Field label="Section Title">
            <TextInput value={about.ourCoreValues} onChange={set('ourCoreValues')} placeholder="Our Core Values" hasError={errors.ourCoreValues} />
          </Field>
          <Field label="Section Description">
            <TextInput value={about.coreValuesDesc} onChange={set('coreValuesDesc')} maxLength={150} hasError={errors.coreValuesDesc} />
          </Field>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          {about.values.map((v, i) => (
            <div key={v.key} className="p-4 bg-gray-50 rounded-2xl space-y-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Value {i + 1}</p>
              <Field label="Title">
                <TextInput value={v.title} onChange={val => setValue(i, 'title', val)} maxLength={30} hasError={errors[`value_title_${i}`]} />
              </Field>
              <Field label="Description">
                <TextArea value={v.desc} onChange={val => setValue(i, 'desc', val)} rows={2} maxLength={150} hasError={errors[`value_desc_${i}`]} />
              </Field>
            </div>
          ))}
        </div>
      </AccordionSection>

      {/* ── 5. Direction (Mission & Vision) ── */}
      <AccordionSection title="Direction — Mission & Vision" badge="Label · Mission · Vision · 3 Why Us">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Field label="Direction Label">
            <TextInput value={about.directionLabel} onChange={set('directionLabel')} placeholder="Direction" hasError={errors.directionLabel} />
          </Field>
          <Field label="Section Title">
            <TextInput value={about.missionTitle} onChange={set('missionTitle')} placeholder="Our Mission" hasError={errors.missionTitle} />
          </Field>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="p-4 bg-gray-50 rounded-2xl space-y-3">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Mission Card</p>
            <Field label="Description">
              <TextArea value={about.missionDesc} onChange={set('missionDesc')} rows={4} maxLength={200} hasError={errors.missionDesc} />
            </Field>
          </div>
          <div className="p-4 bg-gray-50 rounded-2xl space-y-3">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Vision Card</p>
            <Field label="Title">
              <TextInput value={about.visionTitle} onChange={set('visionTitle')} placeholder="Our Vision" maxLength={40} hasError={errors.visionTitle} />
            </Field>
            <Field label="Description">
              <TextArea value={about.visionDesc} onChange={set('visionDesc')} rows={3} maxLength={200} hasError={errors.visionDesc} />
            </Field>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Why Us — 3 Items</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {about.whyUs.map((w, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-2xl space-y-3">
                <p className="text-xs font-bold text-gray-400">Item {i + 1}</p>
                <Field label="Label">
                  <TextInput value={w.label} onChange={val => setWhyUs(i, 'label', val)} maxLength={30} hasError={errors[`whyus_label_${i}`]} />
                </Field>
                <Field label="Description">
                  <TextArea value={w.desc} onChange={val => setWhyUs(i, 'desc', val)} rows={2} maxLength={80} hasError={errors[`whyus_desc_${i}`]} />
                </Field>
              </div>
            ))}
          </div>
        </div>
      </AccordionSection>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          disabled={saving || !isDirty}
          title={!isDirty ? 'No changes to save' : ''}
          className={`flex items-center gap-2 text-sm font-bold px-8 py-3 rounded-full transition-all duration-200 disabled:hover:translate-y-0 ${
            isDirty
              ? 'bg-dark text-white hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-md'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : <><Save size={14} /> Save About Page</>}
        </button>
      </div>

    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
const ContentPage: React.FC = () => {
  const [tab, setTab] = useState<Tab>('team');

  /* ── Team state ── */
  const [members, setMembers]         = useState<TeamMember[]>([]);
  const [loadingTeam, setLoadingTeam] = useState(true);
  const [modalOpen, setModalOpen]     = useState(false);
  const [editing, setEditing]         = useState<TeamMember | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean; id: string | null; name: string; loading: boolean;
  }>({ open: false, id: null, name: '', loading: false });

  /* ── Glass state ── */
  const [glass, setGlass] = useState<GlassImages>({
    whoWeAre: { image1: '', image2: '' },
    whatWeDo: { image1: '', image2: '' },
    vision:   { image: '' },
  });
  const [loadingGlass, setLoadingGlass] = useState(true);
  const [savingGlass,  setSavingGlass]  = useState(false);

  useEffect(() => {
    api.get('/admin/content/team')
      .then(r => setMembers(r.data.data ?? []))
      .catch(() => toast.error('Failed to load team data'))
      .finally(() => setLoadingTeam(false));
  }, []);

  useEffect(() => {
    api.get('/admin/content/glass')
      .then(r => setGlass(r.data.data ?? glass))
      .catch(() => toast.error('Failed to load story images'))
      .finally(() => setLoadingGlass(false));
  }, []);

  const openAdd  = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (m: TeamMember) => { setEditing(m); setModalOpen(true); };

  const handleSave = async (form: Omit<TeamMember, '_id' | 'order'>) => {
    if (editing) {
      const res = await api.put(`/admin/content/team/${editing._id}`, form);
      setMembers(prev => prev.map(m => m._id === editing._id ? res.data.data : m));
      toast.success('Team member updated successfully');
    } else {
      const res = await api.post('/admin/content/team', { ...form, order: members.length });
      setMembers(prev => [...prev, res.data.data]);
      toast.success('Team member added successfully');
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.id) return;
    setDeleteModal(prev => ({ ...prev, loading: true }));
    try {
      await api.delete(`/admin/content/team/${deleteModal.id}`);
      setMembers(prev => prev.filter(m => m._id !== deleteModal.id));
      toast.success('Team member deleted successfully');
      setDeleteModal({ open: false, id: null, name: '', loading: false });
    } catch {
      toast.error('Failed to delete team member');
      setDeleteModal(prev => ({ ...prev, loading: false }));
    }
  };

  const moveOrder = async (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= members.length) return;
    const next = [...members];
    [next[index], next[target]] = [next[target], next[index]];
    const reordered = next.map((m, i) => ({ ...m, order: i }));
    setMembers(reordered);
    try {
      await api.patch('/admin/content/team/reorder', {
        orders: reordered.map(m => ({ _id: m._id, order: m.order })),
      });
    } catch { toast.error('Failed to save order'); }
  };

  const updateGlass = (path: string[], value: string) => {
    setGlass(prev => {
      const next = { ...prev };
      let obj: any = next;
      path.slice(0, -1).forEach(k => { obj[k] = { ...obj[k] }; obj = obj[k]; });
      obj[path[path.length - 1]] = value;
      return next;
    });
  };

  const saveGlass = async () => {
    setSavingGlass(true);
    try {
      await api.put('/admin/content/glass', glass);
      toast.success('Story images saved successfully');
    } catch { toast.error('Failed to save story images'); }
    finally { setSavingGlass(false); }
  };

  /* ── Tab definitions ── */
  const TABS = [
    { id: 'team'  as const, label: 'Team Members', icon: Users },
    { id: 'about' as const, label: 'About Page',   icon: FileText },
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-4xl font-display font-bold text-dark">Content</h1>
        <p className="text-gray-400 text-sm mt-1 italic">Manage team members, homepage visuals, and about page</p>
      </div>

      {/* Tabs */}
      <div className="inline-flex items-center gap-1 bg-white border border-gray-200 rounded-full px-2 py-1.5 shadow-sm">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              tab === id ? 'bg-dark text-white shadow-sm' : 'text-gray-500 hover:text-dark'
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* ── Team Tab ── */}
      {tab === 'team' && (
        <div className="space-y-5">
          <div className="flex justify-end">
            <button onClick={openAdd}
              className="flex items-center gap-2 bg-primary text-dark font-bold px-6 py-3 rounded-full text-sm hover:bg-yellow-400 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
              <Plus size={16} /> Add Member
            </button>
          </div>
          {loadingTeam ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : members.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-16 text-center">
              <Users size={40} className="text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No team members yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {members.map((m, i) => (
                <div key={m._id}
                  className="bg-white rounded-3xl border-2 border-gray-100 shadow-sm overflow-hidden group hover:border-primary/30 hover:shadow-md transition-all duration-200">
                  <div className="relative h-52 bg-gray-50 overflow-hidden">
                    {m.image
                      ? <img src={m.image} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      : <div className="flex items-center justify-center h-full"><Users size={40} className="text-gray-200" /></div>
                    }
                    <div className="absolute top-2 left-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => moveOrder(i, -1)} disabled={i === 0}
                        className="w-7 h-7 bg-white/90 rounded-xl flex items-center justify-center shadow disabled:opacity-30 hover:bg-white transition-colors">
                        <ChevronUp size={13} />
                      </button>
                      <button onClick={() => moveOrder(i, 1)} disabled={i === members.length - 1}
                        className="w-7 h-7 bg-white/90 rounded-xl flex items-center justify-center shadow disabled:opacity-30 hover:bg-white transition-colors">
                        <ChevronDown size={13} />
                      </button>
                    </div>
                    <div className="absolute top-2 right-2 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold">{i + 1}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="font-bold text-dark text-sm">{m.name}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{m.role}</p>
                    <div className="flex gap-2 mt-4">
                      <button onClick={() => openEdit(m)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full border border-gray-200 text-xs font-semibold text-gray-600 hover:border-gray-400 transition-colors">
                        <Pencil size={12} /> Edit
                      </button>
                      <button onClick={() => setDeleteModal({ open: true, id: m._id, name: m.name, loading: false })}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full border border-red-100 text-xs font-semibold text-red-400 hover:bg-red-50 transition-colors">
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── About Tab ── */}
      {tab === 'about' && (
        <AboutTab
          glass={glass}
          updateGlass={updateGlass}
          saveGlass={saveGlass}
          savingGlass={savingGlass}
        />
      )}

      {/* Modals */}
      {modalOpen && (
        <MemberModal initial={editing} onSave={handleSave} onClose={() => setModalOpen(false)} />
      )}
      <ConfirmModal
        isOpen={deleteModal.open}
        title="Delete Member"
        message={`Are you sure you want to remove ${deleteModal.name} from the team? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false, id: null, name: '', loading: false })}
        loading={deleteModal.loading}
      />
    </div>
  );
};

export default ContentPage;