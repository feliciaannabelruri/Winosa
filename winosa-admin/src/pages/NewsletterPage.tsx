import React, { useEffect, useState } from 'react';
import { Search, Trash2, Download, Mail, Send, X, ChevronDown } from 'lucide-react';
import { subscriberService } from '../services/subscriberService';
import { Subscriber } from '../types';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';

// ─── Templates ───────────────────────────────────────────────────────────────

const TEMPLATES = [
  { label: 'None', subject: '', body: '' },
  {
    label: 'Welcome',
    subject: 'Welcome to our newsletter! 🎉',
    body: `Hi there,\n\nThank you for subscribing to our newsletter. We're thrilled to have you on board!\n\nExpect regular updates, insights, and exclusive content delivered straight to your inbox.\n\nWarm regards,\nThe Team`,
  },
  {
    label: 'Re-engagement',
    subject: "We miss you — here's what's new",
    body: `Hi there,\n\nWe noticed it's been a while. We've been busy creating content we think you'll love.\n\nHere's a quick look at what you've missed...\n\nHope to reconnect soon,\nThe Team`,
  },
  {
    label: 'Announcement',
    subject: 'Big news from us 📢',
    body: `Hi there,\n\nWe have an exciting announcement to share with you.\n\n[Write your announcement here]\n\nThank you for being part of our community.\n\nBest,\nThe Team`,
  },
];

// ─── Email Compose Modal (Popup) ─────────────────────────────────────────────

interface ModalProps {
  isOpen: boolean;
  subscriber: Subscriber | null;
  onClose: () => void;
}

const EmailComposeModal: React.FC<ModalProps> = ({ isOpen, subscriber, onClose }) => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [sending, setSending] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSubject('');
      setBody('');
      setSelectedTemplate(0);
      setShowTemplates(false);
    }
  }, [isOpen, subscriber]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const applyTemplate = (idx: number) => {
    setSelectedTemplate(idx);
    setSubject(TEMPLATES[idx].subject);
    setBody(TEMPLATES[idx].body);
    setShowTemplates(false);
  };

  const handleSend = async () => {
    if (!subject.trim()) { toast.error('Subject is required'); return; }
    if (!body.trim()) { toast.error('Message body is required'); return; }
    if (!subscriber) return;

    setSending(true);
    try {
      await subscriberService.sendEmail(subscriber._id, { subject, body });
      toast.success(`Email sent to ${subscriber.email}`);
      onClose();
    } catch {
      toast.error('Failed to send email');
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 border-b border-gray-100 flex-shrink-0">
          <div className="min-w-0 flex-1 pr-3">
            <h2 className="text-base sm:text-lg font-display font-bold text-dark">Compose Email</h2>
            <p className="text-xs text-gray-400 mt-0.5 truncate">
              To: <span className="text-primary font-medium">{subscriber?.email}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors flex-shrink-0"
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 sm:py-5 space-y-4">
          {/* Template picker */}
          <div className="relative">
            <label className="block text-[10px] sm:text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              Template
            </label>
            <button
              onClick={() => setShowTemplates(v => !v)}
              className="w-full flex items-center justify-between px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-dark bg-white hover:border-gray-300 transition-colors"
            >
              <span>{TEMPLATES[selectedTemplate].label}</span>
              <ChevronDown
                size={14}
                className={`text-gray-400 transition-transform flex-shrink-0 ${showTemplates ? 'rotate-180' : ''}`}
              />
            </button>
            {showTemplates && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg z-10 overflow-hidden">
                {TEMPLATES.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => applyTemplate(i)}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 ${
                      selectedTemplate === i ? 'text-primary font-medium bg-primary/5' : 'text-dark'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Subject */}
          <div>
            <label className="block text-[10px] sm:text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              Subject
            </label>
            <input
              type="text"
              placeholder="Enter email subject..."
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary bg-white transition-colors"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-[10px] sm:text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              Message
            </label>
            <textarea
              placeholder="Write your message here..."
              value={body}
              onChange={e => setBody(e.target.value)}
              rows={8}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary bg-white transition-colors resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 sm:px-5 py-2.5 rounded-full text-sm font-medium border border-gray-200 text-gray-600 hover:border-gray-400 transition-all"
          >
            Discard
          </button>
          <button
            onClick={handleSend}
            disabled={sending}
            className="flex items-center gap-2 bg-dark text-white font-semibold px-5 sm:px-6 py-2.5 rounded-full text-sm transition-all duration-200 hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {sending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="hidden sm:inline">Sending...</span>
              </>
            ) : (
              <>
                <Send size={14} />
                <span>Send Email</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Newsletter Page ──────────────────────────────────────────────────────────

const NewsletterPage: React.FC = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string | null; loading: boolean }>({
    open: false, id: null, loading: false,
  });
  const [composeModal, setComposeModal] = useState<{ open: boolean; subscriber: Subscriber | null }>({
    open: false, subscriber: null,
  });

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const data = await subscriberService.getAll();
      setSubscribers(data.data);
    } catch {
      toast.error('Failed to load subscriber data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSubscribers(); }, []);

  const handleDelete = async () => {
    if (!deleteModal.id) return;
    setDeleteModal(prev => ({ ...prev, loading: true }));
    try {
      await subscriberService.delete(deleteModal.id);
      toast.success('Subscriber deleted successfully');
      setDeleteModal({ open: false, id: null, loading: false });
      fetchSubscribers();
    } catch {
      toast.error('Failed to delete subscriber');
      setDeleteModal(prev => ({ ...prev, loading: false }));
    }
  };

  const handleExport = () => {
    if (!subscribers.length) return;
    subscriberService.exportFromData(subscribers);
    toast.success(`${subscribers.length} subscribers exported to CSV successfully`);
  };

  const filtered = subscribers.filter(s => {
    const matchSearch = s.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'all'    ? true :
      filter === 'active' ? s.isActive :
      !s.isActive;
    return matchSearch && matchFilter;
  });

  const activeCount = subscribers.filter(s => s.isActive).length;

  const filterLabels: Record<'all' | 'active' | 'inactive', string> = {
    all: 'All',
    active: 'Active',
    inactive: 'Inactive',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold text-dark">Newsletter</h1>
          <p className="text-gray-400 text-sm mt-1 italic">Manage email subscriber list</p>
        </div>
        <button
          onClick={handleExport}
          disabled={subscribers.length === 0}
          className="flex items-center gap-2 bg-dark text-white font-semibold px-6 py-3 rounded-full transition-all duration-200 hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-md text-sm w-fit disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-gray-100 p-3 sm:p-5 shadow-sm">
          <p className="text-[10px] sm:text-sm text-gray-400 mb-1 sm:mb-2 leading-tight">Total Subscribers</p>
          <p className="text-2xl sm:text-3xl font-display font-bold text-dark">{subscribers.length}</p>
        </div>
        <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-gray-100 p-3 sm:p-5 shadow-sm">
          <p className="text-[10px] sm:text-sm text-gray-400 mb-1 sm:mb-2 leading-tight">Active</p>
          <p className="text-2xl sm:text-3xl font-display font-bold text-green-500">{activeCount}</p>
        </div>
        <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-gray-100 p-3 sm:p-5 shadow-sm">
          <p className="text-[10px] sm:text-sm text-gray-400 mb-1 sm:mb-2 leading-tight">Inactive</p>
          <p className="text-2xl sm:text-3xl font-display font-bold text-gray-400">{subscribers.length - activeCount}</p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-full text-sm outline-none focus:border-primary bg-white transition-colors"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(['all', 'active', 'inactive'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                filter === f
                  ? 'bg-dark border-dark text-white'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
              }`}
            >
              {filterLabels[f]}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left text-sm font-semibold text-dark py-4 px-4 pl-6 w-12">No.</th>
                <th className="text-left text-sm font-semibold text-dark py-4 px-4">Email</th>
                <th className="text-left text-sm font-semibold text-dark py-4 px-4">Status</th>
                <th className="text-left text-sm font-semibold text-dark py-4 px-4">Join Date</th>
                <th className="text-left text-sm font-semibold text-dark py-4 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-16">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <Mail size={32} className="text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">No subscribers found</p>
                  </td>
                </tr>
              ) : (
                filtered.map((sub, idx) => (
                  <tr
                    key={sub._id}
                    className={`border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                    }`}
                  >
                    <td className="py-4 px-4 pl-6 text-sm text-gray-500">{idx + 1}.</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Mail size={13} className="text-primary" />
                        </div>
                        <span className="text-sm text-dark font-medium truncate max-w-[180px] sm:max-w-none">
                          {sub.email}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ${
                        sub.isActive
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {sub.isActive ? 'Active' : 'Unsubscribed'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(sub.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit', month: 'short', year: 'numeric',
                      })}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setComposeModal({ open: true, subscriber: sub })}
                          className="w-9 h-9 border border-gray-200 rounded-xl flex items-center justify-center text-blue-400 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                          title="Compose Email"
                        >
                          <Send size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ open: true, id: sub._id, loading: false })}
                          className="w-9 h-9 border border-gray-200 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-50 hover:border-red-200 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <EmailComposeModal
        isOpen={composeModal.open}
        subscriber={composeModal.subscriber}
        onClose={() => setComposeModal({ open: false, subscriber: null })}
      />

      <ConfirmModal
        isOpen={deleteModal.open}
        title="Delete Subscriber"
        message="Are you sure you want to delete this subscriber? They will no longer receive newsletters."
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false, id: null, loading: false })}
        loading={deleteModal.loading}
      />
    </div>
  );
};

export default NewsletterPage;