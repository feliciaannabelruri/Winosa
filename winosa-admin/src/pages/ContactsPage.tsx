import React, { useEffect, useState } from 'react';
import {
  Mail, User, Clock, Inbox, Search,
  CheckCheck, Circle, Download, Send, ChevronLeft,
  Trash2, ChevronDown, ChevronUp,
} from 'lucide-react';
import { contactService } from '../services/analyticsService';
import api from '../services/api';
import { Contact } from '../types';
import toast from 'react-hot-toast';

/* ─── Types ─── */
interface Reply {
  _id:     string;
  message: string;
  sentAt:  string;
  sentBy?: string;
}

interface ContactWithReplies extends Contact {
  replies?: Reply[];
}

/* ─── Helpers ─── */
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

const fmtDateShort = (iso: string) =>
  new Date(iso).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

const snippet = (text: string, len = 80) =>
  text.length > len ? text.slice(0, len) + '…' : text;

/* ─── Thread Item Component ─── */
interface ThreadItemProps {
  avatarLabel: string;
  avatarBg:    string;
  senderName:  string;
  date:        string;
  body:        string;
  isAdmin?:    boolean;
  defaultOpen?: boolean;
  sentTo?:     string;
}

const ThreadItem: React.FC<ThreadItemProps> = ({
  avatarLabel, avatarBg, senderName, date, body,
  isAdmin = false, defaultOpen = false, sentTo,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors text-left"
      >
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${avatarBg}`}>
          {avatarLabel}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-dark">{senderName}</span>
            {isAdmin && (
              <span className="text-[10px] bg-dark text-white px-1.5 py-0.5 rounded-full font-medium leading-none">
                Admin
              </span>
            )}
          </div>
          {!open && (
            <p className="text-xs text-gray-400 truncate mt-0.5">{snippet(body)}</p>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-gray-400 hidden sm:block">{date}</span>
          {open
            ? <ChevronUp size={14} className="text-gray-400" />
            : <ChevronDown size={14} className="text-gray-400" />
          }
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 pt-0">
          <p className="text-xs text-gray-400 mb-3 sm:hidden">{date}</p>
          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{body}</p>
            {isAdmin && sentTo && (
              <p className="text-[10px] text-gray-400 mt-4 flex items-center gap-1">
                <CheckCheck size={11} className="text-green-400" />
                Terkirim ke {sentTo}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* ════════════════════════════════════════════════════════ */
const ContactsPage: React.FC = () => {
  const [contacts, setContacts]         = useState<ContactWithReplies[]>([]);
  const [loading, setLoading]           = useState(true);
  const [selected, setSelected]         = useState<ContactWithReplies | null>(null);
  const [search, setSearch]             = useState('');
  const [filterRead, setFilterRead]     = useState<'all' | 'read' | 'unread'>('all');
  const [replyText, setReplyText]       = useState('');
  const [replying, setReplying]         = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [deleting, setDeleting]         = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await contactService.getAll();
        setContacts(data.data);
      } catch {
        toast.error('Gagal memuat pesan masuk');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toggleRead = async (contactId: string) => {
    const contact = contacts.find(c => c._id === contactId);
    if (!contact) return;
    const newIsRead = !contact.isRead;
    setContacts(prev => prev.map(c => c._id === contactId ? { ...c, isRead: newIsRead } : c));
    if (selected?._id === contactId) setSelected(prev => prev ? { ...prev, isRead: newIsRead } : null);
    try {
      await api.patch(`/contact/${contactId}`, { isRead: newIsRead });
    } catch {
      setContacts(prev => prev.map(c => c._id === contactId ? { ...c, isRead: !newIsRead } : c));
      if (selected?._id === contactId) setSelected(prev => prev ? { ...prev, isRead: !newIsRead } : null);
      toast.error('Gagal memperbarui status');
    }
  };

  const handleSelect = async (contact: ContactWithReplies) => {
    setSelected(contact);
    setReplyText('');

    if (!contact.isRead) {
      setContacts(prev => prev.map(c => c._id === contact._id ? { ...c, isRead: true } : c));
      setSelected({ ...contact, isRead: true });
      api.patch(`/contact/${contact._id}`, { isRead: true }).catch(() => {});
    }

    setLoadingDetail(true);
    try {
      const res = await api.get(`/contact/${contact._id}`);
      if (res.data?.success && res.data?.data) {
        const full: ContactWithReplies = res.data.data;
        setSelected({ ...full, isRead: true });
        setContacts(prev => prev.map(c => c._id === full._id ? { ...c, replies: full.replies } : c));
      }
    } catch {
      // silent — tampilkan kontak tanpa balasan
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    if (!window.confirm(`Hapus pesan dari ${selected.name}? Tindakan ini tidak dapat dibatalkan.`)) return;
    setDeleting(true);
    try {
      await api.delete(`/contact/${selected._id}`);
      setContacts(prev => prev.filter(c => c._id !== selected._id));
      setSelected(null);
      toast.success('Pesan berhasil dihapus');
    } catch {
      toast.error('Gagal menghapus pesan');
    } finally {
      setDeleting(false);
    }
  };

  const handleReply = async () => {
    if (!replyText.trim() || !selected) return;
    setReplying(true);
    try {
      const res = await api.post(`/contact/${selected._id}/reply`, { message: replyText });

      const newReply: Reply = res.data?.data?.reply ?? {
        _id:     Date.now().toString(),
        message: replyText,
        sentAt:  new Date().toISOString(),
      };

      const updatedReplies = [...(selected.replies ?? []), newReply];
      setSelected(prev => prev ? { ...prev, isRead: true, replies: updatedReplies } : null);
      setContacts(prev => prev.map(c =>
        c._id === selected._id ? { ...c, isRead: true, replies: updatedReplies } : c
      ));

      setReplyText('');
      toast.success(`Balasan terkirim ke ${selected.email}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Gagal mengirim balasan');
    } finally {
      setReplying(false);
    }
  };

  const handleExport = () => {
    if (!contacts.length) return;
    contactService.exportFromData(contacts);
    toast.success(`${contacts.length} kontak berhasil diekspor ke CSV`);
  };

  const filtered = contacts.filter(c => {
    const q = search.toLowerCase();
    const matchSearch =
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.subject || '').toLowerCase().includes(q);
    const matchRead =
      filterRead === 'all'    ? true :
      filterRead === 'read'   ? c.isRead : !c.isRead;
    return matchSearch && matchRead;
  });

  const unreadCount  = contacts.filter(c => !c.isRead).length;
  const totalReplies = selected?.replies?.length ?? 0;

  const filterLabels: Record<'all' | 'read' | 'unread', string> = {
    all: 'All',
    unread: 'Unread',
    read: 'Read',
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold text-dark">
            Contact
            {unreadCount > 0 && (
              <span className="ml-3 text-base font-semibold bg-primary text-dark px-3 py-1 rounded-full align-middle">
                {unreadCount} Unread
              </span>
            )}
          </h1>
          <p className="text-gray-400 text-sm mt-1 italic">Lihat dan balas pesan dari pengunjung website</p>
        </div>
        <button
          onClick={handleExport}
          disabled={contacts.length === 0}
          className="flex items-center gap-2 bg-dark text-white font-semibold px-6 py-3 rounded-full transition-all duration-200 hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-md text-sm w-fit disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Cari nama, email, atau subjek..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-full text-sm outline-none focus:border-primary bg-white transition-colors"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(['all', 'unread', 'read'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilterRead(f)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                filterRead === f
                  ? 'bg-dark border-dark text-white'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
              }`}
            >
              {filterLabels[f]}
            </button>
          ))}
        </div>
      </div>

      {/* Konten */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-16 text-center">
          <Inbox size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Tidak ada pesan yang ditemukan</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ── Panel Daftar ── */}
          <div className={`lg:col-span-1 space-y-3 ${selected ? 'hidden lg:block' : ''}`}>
            {filtered.map(contact => (
              <div
                key={contact._id}
                onClick={() => handleSelect(contact)}
                className={`relative w-full text-left p-4 rounded-3xl border-2 transition-all duration-200 cursor-pointer hover:-translate-y-0.5 ${
                  selected?._id === contact._id
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : !contact.isRead
                    ? 'border-gray-200 bg-white hover:border-primary/40 hover:shadow-sm'
                    : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <p className={`text-sm truncate flex-1 mr-2 ${!contact.isRead ? 'font-bold text-dark' : 'font-semibold text-dark'}`}>
                    {contact.name}
                  </p>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {contact.replies && contact.replies.length > 0 && (
                      <span className="text-[10px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
                        {contact.replies.length}↩
                      </span>
                    )}
                    <button
                      onClick={e => { e.stopPropagation(); toggleRead(contact._id); }}
                      className="text-gray-300 hover:text-primary transition-colors"
                      title={contact.isRead ? 'Mark as unread' : 'Mark as read'}
                    >
                      {contact.isRead
                        ? <CheckCheck size={14} className="text-green-400" />
                        : <Circle size={12} className="text-primary fill-primary" />
                      }
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-400 truncate leading-relaxed">{contact.message}</p>
                <p className="text-xs text-gray-300 mt-2">{fmtDateShort(contact.createdAt)}</p>
              </div>
            ))}
          </div>

          {/* ── Panel Detail ── */}
          <div className={`lg:col-span-2 ${selected ? '' : 'hidden lg:block'}`}>
            {selected ? (
              <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-sm flex flex-col overflow-hidden">

                {/* Header thread */}
                <div className="px-6 pt-6 pb-5 border-b border-gray-100 flex-shrink-0">
                  <button
                    onClick={() => setSelected(null)}
                    className="lg:hidden flex items-center gap-1.5 text-sm text-gray-500 hover:text-dark transition-colors w-fit mb-4"
                  >
                    <ChevronLeft size={16} /> Back
                  </button>

                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold text-primary">
                        {selected.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-dark">{selected.name}</p>
                        <a
                          href={`mailto:${selected.email}`}
                          className="text-xs text-gray-400 hover:text-primary transition-colors"
                        >
                          {selected.email}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock size={11} /> {fmtDate(selected.createdAt)}
                      </span>
                      <button
                        onClick={() => toggleRead(selected._id)}
                        className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-colors ${
                          selected.isRead
                            ? 'border-gray-200 text-gray-500 hover:border-gray-300'
                            : 'border-green-200 bg-green-50 text-green-600 hover:bg-green-100'
                        }`}
                      >
                        <CheckCheck size={11} />
                        {selected.isRead ? 'Mark Unread' : 'Mark as Read'}
                      </button>
                      <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-red-200 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
                      >
                        {deleting
                          ? <div className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                          : <Trash2 size={11} />
                        }
                        Delete
                      </button>
                    </div>
                  </div>

                  {totalReplies > 0 && (
                    <p className="text-xs text-gray-400 mt-3">
                      {totalReplies + 1} pesan dalam percakapan ini
                    </p>
                  )}
                </div>

                {/* Thread pesan */}
                <div className="px-6 py-5 space-y-2.5 overflow-y-auto max-h-[420px]">

                  <ThreadItem
                    avatarLabel={selected.name.charAt(0).toUpperCase()}
                    avatarBg="bg-primary/15 text-primary"
                    senderName={selected.name}
                    date={fmtDate(selected.createdAt)}
                    body={selected.message}
                    defaultOpen={true}
                  />

                  {loadingDetail && (
                    <div className="flex justify-center py-4">
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}

                  {!loadingDetail && selected.replies?.map((reply, idx) => (
                    <ThreadItem
                      key={reply._id}
                      avatarLabel="A"
                      avatarBg="bg-dark text-white"
                      senderName={reply.sentBy || 'Admin'}
                      date={fmtDate(reply.sentAt)}
                      body={reply.message}
                      isAdmin={true}
                      sentTo={selected.email}
                      defaultOpen={idx === (selected.replies!.length - 1)}
                    />
                  ))}
                </div>

                {/* Formulir balasan */}
                <div className="px-6 pb-6 pt-4 border-t border-gray-100 space-y-3 flex-shrink-0">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Balas ke {selected.name}
                  </p>
                  <textarea
                    placeholder={`Tulis balasan untuk ${selected.email}…`}
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-primary bg-gray-50 resize-none transition-colors"
                  />
                  <div className="flex items-center justify-between gap-3">
                    <a
                      href={`mailto:${selected.email}`}
                      className="text-xs text-gray-400 hover:text-primary transition-colors"
                    >
                      Atau buka di aplikasi email →
                    </a>
                    <button
                      onClick={handleReply}
                      disabled={!replyText.trim() || replying}
                      className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-dark text-sm font-bold px-6 py-2.5 rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                      {replying
                        ? <><div className="w-3.5 h-3.5 border-2 border-dark border-t-transparent rounded-full animate-spin" />Mengirim...</>
                        : <><Send size={14} />Reply</>
                      }
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              <div className="h-64 lg:h-full bg-white rounded-3xl border-2 border-dashed border-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <Mail size={32} className="text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">Pilih pesan untuk melihat detailnya</p>
                </div>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default ContactsPage;