import React, { useEffect, useState } from 'react';
import { Mail, User, Clock, Inbox, Search, CheckCheck, Circle, Download, Send } from 'lucide-react';
import { contactService } from '../services/analyticsService';
import api from '../services/api';
import { Contact } from '../types';
import toast from 'react-hot-toast';

const ContactsPage: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [search, setSearch] = useState('');
  const [filterRead, setFilterRead] = useState<'all' | 'read' | 'unread'>('all');
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await contactService.getAll();
        setContacts(data.data);
      } catch {
        toast.error('Failed to fetch contacts');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // Persist read/unread to backend — optimistic update
  // FIX: path changed from /contacts/ to /contact/
  const toggleRead = async (contactId: string) => {
    const contact = contacts.find(c => c._id === contactId);
    if (!contact) return;

    const newIsRead = !contact.isRead;

    // Optimistic update
    setContacts(prev => prev.map(c => c._id === contactId ? { ...c, isRead: newIsRead } : c));
    if (selected?._id === contactId) {
      setSelected(prev => prev ? { ...prev, isRead: newIsRead } : null);
    }

    try {
      await api.patch(`/contact/${contactId}`, { isRead: newIsRead });
    } catch {
      // Revert on failure
      setContacts(prev => prev.map(c => c._id === contactId ? { ...c, isRead: !newIsRead } : c));
      if (selected?._id === contactId) {
        setSelected(prev => prev ? { ...prev, isRead: !newIsRead } : null);
      }
      toast.error('Failed to update status');
    }
  };

  const handleSelect = async (contact: Contact) => {
    setSelected(contact);
    setReplyText('');

    if (!contact.isRead) {
      // Optimistic update
      setContacts(prev => prev.map(c => c._id === contact._id ? { ...c, isRead: true } : c));
      setSelected({ ...contact, isRead: true });

      // FIX: path changed from /contacts/ to /contact/
      try {
        await api.patch(`/contact/${contact._id}`, { isRead: true });
      } catch {
        // silent — will show correct on next refresh
      }
    }
  };

  // FIX: path changed from /contacts/ to /contact/, no more 404 fallback to mailto
  const handleReply = async () => {
    if (!replyText.trim() || !selected) return;
    setReplying(true);
    try {
      await api.post(`/contact/${selected._id}/reply`, { message: replyText });
      toast.success('Reply sent to ' + selected.email);
      setReplyText('');
      // Mark as read in local state after reply
      setContacts(prev => prev.map(c => c._id === selected._id ? { ...c, isRead: true } : c));
      setSelected(prev => prev ? { ...prev, isRead: true } : null);
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      toast.error(msg || 'Failed to send reply');
    } finally {
      setReplying(false);
    }
  };

  const handleExport = () => {
    if (!contacts.length) return;
    contactService.exportFromData(contacts);
    toast.success(`Exported ${contacts.length} contacts to CSV`);
  };

  const filtered = contacts.filter(c => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.subject || '').toLowerCase().includes(search.toLowerCase());
    const matchRead =
      filterRead === 'all' ? true :
      filterRead === 'read' ? c.isRead :
      !c.isRead;
    return matchSearch && matchRead;
  });

  const unreadCount = contacts.filter(c => !c.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold text-dark">
            Contacts
            {unreadCount > 0 && (
              <span className="ml-3 text-base font-semibold bg-primary text-dark px-3 py-1 rounded-full align-middle">
                {unreadCount} unread
              </span>
            )}
          </h1>
          <p className="text-gray-400 text-sm mt-1 italic">View messages from website visitors</p>
        </div>
        <button
          onClick={handleExport}
          disabled={contacts.length === 0}
          className="flex items-center gap-2 bg-dark text-white font-semibold px-6 py-3 rounded-full transition-all duration-200 hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-md text-sm w-fit disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by name, email, or subject"
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
              className={`px-5 py-2.5 rounded-full text-sm font-medium border transition-all duration-200 capitalize ${
                filterRead === f
                  ? 'bg-dark border-dark text-white'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-16 text-center">
          <Inbox size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No contacts found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* List Panel */}
          <div className="lg:col-span-1 space-y-3">
            {filtered.map(contact => (
              <div
                key={contact._id}
                className={`relative w-full text-left p-4 rounded-3xl border-2 transition-all duration-200 cursor-pointer hover:-translate-y-0.5 ${
                  selected?._id === contact._id
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : !contact.isRead
                    ? 'border-gray-200 bg-white hover:border-primary/40 hover:shadow-sm'
                    : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
                }`}
                onClick={() => handleSelect(contact)}
              >
                <div className="flex items-start justify-between mb-1.5">
                  <p className={`text-sm truncate flex-1 mr-2 ${!contact.isRead ? 'font-bold text-dark' : 'font-semibold text-dark'}`}>
                    {contact.name}
                  </p>
                  <div className="flex items-center gap-2 flex-shrink-0">
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
                <p className="text-xs text-gray-400 truncate leading-relaxed">
                  {contact.subject || contact.message}
                </p>
                <p className="text-xs text-gray-300 mt-2">
                  {new Date(contact.createdAt).toLocaleDateString('id-ID', {
                    day: '2-digit', month: 'short', year: 'numeric'
                  })}
                </p>
              </div>
            ))}
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-2">
            {selected ? (
              <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-sm p-6 h-full flex flex-col">
                {/* Top action */}
                <div className="flex items-center justify-end mb-4">
                  <button
                    onClick={() => toggleRead(selected._id)}
                    className={`flex items-center gap-2 text-xs px-4 py-2 rounded-full border transition-colors ${
                      selected.isRead
                        ? 'border-gray-200 text-gray-500 hover:border-gray-300'
                        : 'border-green-200 bg-green-50 text-green-600 hover:bg-green-100'
                    }`}
                  >
                    <CheckCheck size={13} />
                    {selected.isRead ? 'Mark as Unread' : 'Mark as Read'}
                  </button>
                </div>

                {/* Sender info */}
                <div className="flex items-start gap-4 mb-6 pb-6 border-b border-gray-100">
                  <div className="w-11 h-11 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <User size={18} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-dark text-base">{selected.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail size={12} className="text-gray-400 flex-shrink-0" />
                      <a
                        href={`mailto:${selected.email}`}
                        className="text-xs text-gray-400 hover:text-primary transition-colors truncate"
                      >
                        {selected.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 flex-shrink-0">
                    <Clock size={12} />
                    <span>
                      {new Date(selected.createdAt).toLocaleString('id-ID', {
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                {/* Message */}
                <div className="flex-1">
                  {selected.subject && (
                    <h4 className="font-bold text-dark mb-3 text-base">{selected.subject}</h4>
                  )}
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {selected.message}
                  </p>
                </div>

                {/* Reply Form */}
                <div className="mt-6 pt-5 border-t border-gray-100 space-y-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Reply to {selected.name}
                  </p>
                  <textarea
                    placeholder={`Write your reply to ${selected.email}...`}
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    rows={4}
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-primary bg-gray-50 resize-none transition-colors"
                  />
                  <div className="flex items-center justify-between gap-3">
                    <a
                      href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Your inquiry'}`}
                      className="text-xs text-gray-400 hover:text-primary transition-colors"
                    >
                      Or open in email client →
                    </a>
                    <button
                      onClick={handleReply}
                      disabled={!replyText.trim() || replying}
                      className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-dark text-sm font-bold px-6 py-2.5 rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                      {replying
                        ? <><div className="w-3.5 h-3.5 border-2 border-dark border-t-transparent rounded-full animate-spin" />Sending...</>
                        : <><Send size={14} />Send Reply</>
                      }
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-64 lg:h-full bg-white rounded-3xl border-2 border-dashed border-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <Mail size={32} className="text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">Select a message to view details</p>
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