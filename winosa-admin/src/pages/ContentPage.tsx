import React, { useEffect, useRef, useState } from 'react';
import {
  Users, Image as ImageIcon, Plus, Pencil, Trash2,
  X, Upload, Save, Loader2, ChevronUp, ChevronDown,
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';

/* ─────────────────── Types ─────────────────── */

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

type Tab = 'team' | 'glass';

/* ─────────────────── ImageUploadBox ─────────────────── */

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
      toast.success('Gambar berhasil diunggah');
    } catch {
      toast.error('Gagal mengunggah gambar');
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
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); inputRef.current?.click(); }}
                    className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
                    title="Ganti gambar"
                  >
                    <Upload size={16} className="text-dark" />
                  </button>
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); onChange(''); }}
                    className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm hover:bg-red-50 transition-colors"
                    title="Delete gambar"
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </>
              )}
            </div>
          </>
        ) : (
          <div
            className="flex flex-col items-center justify-center h-full gap-2 text-gray-400 cursor-pointer hover:text-dark transition-colors"
            onClick={() => inputRef.current?.click()}
          >
            {loading
              ? <Loader2 size={24} className="animate-spin text-primary" />
              : (
                <>
                  <Upload size={20} />
                  <span className="text-xs">Klik untuk mengunggah</span>
                </>
              )
            }
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
      />
    </div>
  );
}

/* MemberModal */

function MemberModal({ initial, onSave, onClose }: {
  initial?: TeamMember | null;
  onSave:   (data: Omit<TeamMember, '_id' | 'order'>) => Promise<void>;
  onClose:  () => void;
}) {
  const [form, setForm]     = useState({ name: initial?.name ?? '', role: initial?.role ?? '', image: initial?.image ?? '' });
  const [saving, setSaving] = useState(false);
  const set = (k: keyof typeof form) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.role.trim()) { toast.error('Nama dan jabatan wajib diisi'); return; }
    setSaving(true);
    try { await onSave(form); onClose(); } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-dark text-lg">{initial ? 'Edit Anggota' : 'Add Anggota'}</h3>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-gray-100 transition-colors">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <ImageUploadBox label="Foto" value={form.image} onChange={set('image')} aspect="portrait" />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Nama</label>
          <input
            value={form.name}
            onChange={e => set('name')(e.target.value)}
            placeholder="cth. Michael Anderson"
            className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Jabatan</label>
          <input
            value={form.role}
            onChange={e => set('role')(e.target.value)}
            placeholder="cth. CEO & Pendiri"
            className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="flex gap-3 pt-1">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-full border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full bg-dark text-white hover:bg-gray-800 transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* Main Page */

const ContentPage: React.FC = () => {
  const [tab, setTab] = useState<Tab>('team');

  const [members, setMembers]         = useState<TeamMember[]>([]);
  const [loadingTeam, setLoadingTeam] = useState(true);
  const [modalOpen, setModalOpen]     = useState(false);
  const [editing, setEditing]         = useState<TeamMember | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean; id: string | null; name: string; loading: boolean;
  }>({ open: false, id: null, name: '', loading: false });

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
      .catch(() => toast.error('Gagal memuat data tim'))
      .finally(() => setLoadingTeam(false));
  }, []);

  useEffect(() => {
    api.get('/admin/content/glass')
      .then(r => setGlass(r.data.data ?? glass))
      .catch(() => toast.error('Gagal memuat gambar glass'))
      .finally(() => setLoadingGlass(false));
  }, []);

  const openAdd  = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (m: TeamMember) => { setEditing(m); setModalOpen(true); };

  const handleSave = async (form: Omit<TeamMember, '_id' | 'order'>) => {
    if (editing) {
      const res = await api.put(`/admin/content/team/${editing._id}`, form);
      setMembers(prev => prev.map(m => m._id === editing._id ? res.data.data : m));
      toast.success('Anggota tim berhasil diperbarui');
    } else {
      const res = await api.post('/admin/content/team', { ...form, order: members.length });
      setMembers(prev => [...prev, res.data.data]);
      toast.success('Anggota tim berhasil ditambahkan');
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.id) return;
    setDeleteModal(prev => ({ ...prev, loading: true }));
    try {
      await api.delete(`/admin/content/team/${deleteModal.id}`);
      setMembers(prev => prev.filter(m => m._id !== deleteModal.id));
      toast.success('Anggota tim berhasil dihapus');
      setDeleteModal({ open: false, id: null, name: '', loading: false });
    } catch {
      toast.error('Gagal menghapus anggota tim');
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
    } catch { toast.error('Gagal menyimpan urutan'); }
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
      toast.success('Gambar glass berhasil disimpan');
    } catch { toast.error('Gagal menyimpan gambar glass'); }
    finally { setSavingGlass(false); }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-4xl font-display font-bold text-dark">Content</h1>
        <p className="text-gray-400 text-sm mt-1 italic">Kelola anggota tim dan visual halaman utama</p>
      </div>

      {/* Tabs */}
      <div className="inline-flex items-center gap-1 bg-white border border-gray-200 rounded-full px-2 py-1.5 shadow-sm">
        {([
          { id: 'team',  label: 'Anggota Tim', icon: Users },
          { id: 'glass', label: 'Bagian Glass',  icon: ImageIcon },
        ] as const).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              tab === id
                ? 'bg-dark text-white shadow-sm'
                : 'text-gray-500 hover:text-dark'
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* ══ TIM ══ */}
      {tab === 'team' && (
        <div className="space-y-5">
          <div className="flex justify-end">
            <button
              onClick={openAdd}
              className="flex items-center gap-2 bg-primary text-dark font-bold px-6 py-3 rounded-full text-sm hover:bg-yellow-400 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
            >
              <Plus size={16} /> Add Anggota
            </button>
          </div>

          {loadingTeam ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : members.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-16 text-center">
              <Users size={40} className="text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Belum ada anggota tim</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {members.map((m, i) => (
                <div
                  key={m._id}
                  className="bg-white rounded-3xl border-2 border-gray-100 shadow-sm overflow-hidden group hover:border-primary/30 hover:shadow-md transition-all duration-200"
                >
                  <div className="relative h-52 bg-gray-50 overflow-hidden">
                    {m.image
                      ? <img src={m.image} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      : <div className="flex items-center justify-center h-full"><Users size={40} className="text-gray-200" /></div>
                    }
                    <div className="absolute top-2 left-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => moveOrder(i, -1)}
                        disabled={i === 0}
                        className="w-7 h-7 bg-white/90 rounded-xl flex items-center justify-center shadow disabled:opacity-30 hover:bg-white transition-colors"
                      >
                        <ChevronUp size={13} />
                      </button>
                      <button
                        onClick={() => moveOrder(i, 1)}
                        disabled={i === members.length - 1}
                        className="w-7 h-7 bg-white/90 rounded-xl flex items-center justify-center shadow disabled:opacity-30 hover:bg-white transition-colors"
                      >
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
                      <button
                        onClick={() => openEdit(m)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full border border-gray-200 text-xs font-semibold text-gray-600 hover:border-gray-400 transition-colors"
                      >
                        <Pencil size={12} /> Edit
                      </button>
                      <button
                        onClick={() => setDeleteModal({ open: true, id: m._id, name: m.name, loading: false })}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full border border-red-100 text-xs font-semibold text-red-400 hover:bg-red-50 transition-colors"
                      >
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

      {/* GLASS */}
      {tab === 'glass' && (
        <div className="space-y-5">
          {loadingGlass ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Siapa Kami */}
              <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <h3 className="font-bold text-dark">Siapa Kami</h3>
                  <span className="text-xs text-gray-400 ml-auto">2 gambar · pasangan oval</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <ImageUploadBox label="Gambar 1 (oval besar)" value={glass.whoWeAre.image1}
                    onChange={v => updateGlass(['whoWeAre', 'image1'], v)} aspect="landscape" />
                  <ImageUploadBox label="Gambar 2 (oval kecil)" value={glass.whoWeAre.image2}
                    onChange={v => updateGlass(['whoWeAre', 'image2'], v)} aspect="landscape" />
                </div>
              </div>

              {/* Apa yang Kami Lakukan */}
              <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <h3 className="font-bold text-dark">Apa yang Kami Lakukan</h3>
                  <span className="text-xs text-gray-400 ml-auto">2 gambar · pasangan oval</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <ImageUploadBox label="Gambar 1 (oval besar)" value={glass.whatWeDo.image1}
                    onChange={v => updateGlass(['whatWeDo', 'image1'], v)} aspect="landscape" />
                  <ImageUploadBox label="Gambar 2 (oval kecil)" value={glass.whatWeDo.image2}
                    onChange={v => updateGlass(['whatWeDo', 'image2'], v)} aspect="landscape" />
                </div>
              </div>

              {/* Visi */}
              <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <h3 className="font-bold text-dark">Visi Kami</h3>
                  <span className="text-xs text-gray-400 ml-auto">1 gambar · oval tunggal</span>
                </div>
                <div className="max-w-xs">
                  <ImageUploadBox label="Gambar visi" value={glass.vision.image}
                    onChange={v => updateGlass(['vision', 'image'], v)} aspect="landscape" />
                </div>
              </div>

              {/* Tombol Simpan */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={saveGlass}
                  disabled={savingGlass}
                  className="flex items-center gap-2 bg-dark text-white text-sm font-bold px-6 py-3 rounded-full hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {savingGlass
                    ? <><Loader2 size={14} className="animate-spin" /> Saving...</>
                    : <><Save size={14} /> Save Changes</>
                  }
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {modalOpen && (
        <MemberModal initial={editing} onSave={handleSave} onClose={() => setModalOpen(false)} />
      )}

      <ConfirmModal
        isOpen={deleteModal.open}
        title="Delete Anggota"
        message={`Apakah Anda yakin ingin menghapus ${deleteModal.name} dari tim? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false, id: null, name: '', loading: false })}
        loading={deleteModal.loading}
      />

    </div>
  );
};

export default ContentPage;