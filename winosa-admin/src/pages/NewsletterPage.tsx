import React, { useEffect, useState } from 'react';
import { Search, Trash2, Download, Mail, Send, X, ChevronDown } from 'lucide-react';
import { subscriberService } from '../services/subscriberService';
import { Subscriber } from '../types';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
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

// ─── Email Compose Modal ─────────────────────────────────────────────────────

interface ModalProps {
  isOpen: boolean;
  subscriber: Subscriber | null;
  onClose: () => void;
}

const EmailComposeModal: React.FC<ModalProps> = ({ isOpen, subscriber, onClose }) => {
  const { t } = useTranslation();

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
    if (!subject.trim()) {
      toast.error(t('email_subject_required'));
      return;
    }

    if (!body.trim()) {
      toast.error(t('email_body_required'));
      return;
    }

    if (!subscriber) return;

    setSending(true);

    try {
      await subscriberService.sendEmail(subscriber._id, { subject, body });

      toast.success(t('email_send_success'));
      onClose();
    } catch {
      toast.error(t('email_send_error'));
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
            <h2 className="text-base sm:text-lg font-display font-bold text-dark">
              {t('compose_email')}
            </h2>

            <p className="text-xs text-gray-400 mt-0.5 truncate">
              {t('to')}:{' '}
              <span className="text-primary font-medium">
                {subscriber?.email}
              </span>
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

          {/* Template */}
          <div className="relative">
            <label className="block text-[10px] sm:text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              {t('template')}
            </label>

            <button
              onClick={() => setShowTemplates(v => !v)}
              className="w-full flex items-center justify-between px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-dark bg-white hover:border-gray-300 transition-colors"
            >
              <span>{TEMPLATES[selectedTemplate].label}</span>

              <ChevronDown
                size={14}
                className={`text-gray-400 transition-transform flex-shrink-0 ${
                  showTemplates ? 'rotate-180' : ''
                }`}
              />
            </button>

            {showTemplates && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg z-10 overflow-hidden">
                {TEMPLATES.map((template, i) => (
                  <button
                    key={i}
                    onClick={() => applyTemplate(i)}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 ${
                      selectedTemplate === i
                        ? 'text-primary font-medium bg-primary/5'
                        : 'text-dark'
                    }`}
                  >
                    {template.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Subject */}
          <div>
            <label className="block text-[10px] sm:text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              {t('subject')}
            </label>

            <input
              type="text"
              placeholder={t('email_subject_placeholder')}
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary bg-white transition-colors"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-[10px] sm:text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              {t('message')}
            </label>

            <textarea
              placeholder={t('email_message_placeholder')}
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
            {t('discard')}
          </button>

          <button
            onClick={handleSend}
            disabled={sending}
            className="flex items-center gap-2 bg-dark text-white font-semibold px-5 sm:px-6 py-2.5 rounded-full text-sm transition-all duration-200 hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {sending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="hidden sm:inline">{t('sending')}</span>
              </>
            ) : (
              <>
                <Send size={14} />
                <span>{t('send_email')}</span>
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
  const { t } = useTranslation();

  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    id: string | null;
    loading: boolean;
  }>({
    open: false,
    id: null,
    loading: false,
  });

  const [composeModal, setComposeModal] = useState<{
    open: boolean;
    subscriber: Subscriber | null;
  }>({
    open: false,
    subscriber: null,
  });

  const fetchSubscribers = async () => {
    setLoading(true);

    try {
      const data = await subscriberService.getAll();
      setSubscribers(data.data);
    } catch {
      toast.error(t('newsletter_load_error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleDelete = async () => {
    if (!deleteModal.id) return;

    setDeleteModal(prev => ({ ...prev, loading: true }));

    try {
      await subscriberService.delete(deleteModal.id);

      toast.success(t('newsletter_delete_success'));

      setDeleteModal({
        open: false,
        id: null,
        loading: false,
      });

      fetchSubscribers();
    } catch {
      toast.error(t('newsletter_delete_error'));

      setDeleteModal(prev => ({
        ...prev,
        loading: false,
      }));
    }
  };

  const handleExport = () => {
    if (!subscribers.length) return;

    subscriberService.exportFromData(subscribers);

    toast.success(t('newsletter_export_success'));
  };

  const filtered = subscribers.filter(s => {
    const matchSearch = s.email
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchFilter =
      filter === 'all'
        ? true
        : filter === 'active'
          ? s.isActive
          : !s.isActive;

    return matchSearch && matchFilter;
  });

  const activeCount = subscribers.filter(s => s.isActive).length;

  const filterLabels: Record<'all' | 'active' | 'inactive', string> = {
    all: t('all'),
    active: t('active'),
    inactive: t('inactive'),
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold text-dark">
            {t('newsletter_title')}
          </h1>

          <p className="text-gray-400 text-sm mt-1 italic">
            {t('newsletter_subtitle')}
          </p>
        </div>

        <button
          onClick={handleExport}
          disabled={subscribers.length === 0}
          className="flex items-center gap-2 bg-dark text-white font-semibold px-6 py-3 rounded-full transition-all duration-200 hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-md text-sm w-fit disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          <Download size={16} />
          {t('export_csv')}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">

        <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-gray-100 p-3 sm:p-5 shadow-sm">
          <p className="text-[10px] sm:text-sm text-gray-400 mb-1 sm:mb-2 leading-tight">
            {t('total_subscribers')}
          </p>

          <p className="text-2xl sm:text-3xl font-display font-bold text-dark">
            {subscribers.length}
          </p>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-gray-100 p-3 sm:p-5 shadow-sm">
          <p className="text-[10px] sm:text-sm text-gray-400 mb-1 sm:mb-2 leading-tight">
            {t('active')}
          </p>

          <p className="text-2xl sm:text-3xl font-display font-bold text-green-500">
            {activeCount}
          </p>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-gray-100 p-3 sm:p-5 shadow-sm">
          <p className="text-[10px] sm:text-sm text-gray-400 mb-1 sm:mb-2 leading-tight">
            {t('inactive')}
          </p>

          <p className="text-2xl sm:text-3xl font-display font-bold text-gray-400">
            {subscribers.length - activeCount}
          </p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">

        <div className="relative flex-1 max-w-sm">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />

          <input
            type="text"
            placeholder={t('newsletter_search_placeholder')}
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
    </div>
  );
};

export default NewsletterPage;