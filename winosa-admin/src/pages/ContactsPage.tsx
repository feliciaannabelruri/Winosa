import React, { useEffect, useState } from 'react';
import { Mail, User, Clock, Inbox } from 'lucide-react';
import { contactService } from '../services/analyticsService';
import { Contact } from '../types';
import toast from 'react-hot-toast';

const ContactsPage: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Contact | null>(null);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-display font-bold text-dark">Contacts</h1>
        <p className="text-gray-400 text-sm mt-1 italic">View messages from website visitors</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : contacts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-16 text-center">
          <Inbox size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No contacts yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* List Panel */}
          <div className="lg:col-span-1 space-y-3">
            {contacts.map(contact => (
              <button
                key={contact._id}
                onClick={() => setSelected(contact)}
                className={`w-full text-left p-4 rounded-3xl border-2 transition-all duration-200 hover:-translate-y-0.5 ${
                  selected?._id === contact._id
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between mb-1.5">
                  <p className="font-semibold text-dark text-sm">{contact.name}</p>
                  {!contact.isRead && (
                    <span className="w-2.5 h-2.5 bg-primary rounded-full flex-shrink-0 mt-0.5" />
                  )}
                </div>
                <p className="text-xs text-gray-400 truncate leading-relaxed">
                  {contact.subject || contact.message}
                </p>
                <p className="text-xs text-gray-300 mt-2">
                  {new Date(contact.createdAt).toLocaleDateString('id-ID', {
                    day: '2-digit', month: 'short', year: 'numeric'
                  })}
                </p>
              </button>
            ))}
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-2">
            {selected ? (
              <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-sm p-6 h-full">
                {/* Sender Info */}
                <div className="flex items-start gap-4 mb-6 pb-6 border-b border-gray-100">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <User size={20} className="text-primary" />
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
                {selected.subject && (
                  <h4 className="font-bold text-dark mb-3 text-lg">{selected.subject}</h4>
                )}
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {selected.message}
                </p>

                {/* Reply Button */}
                <div className="mt-8">
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Your inquiry'}`}
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-dark text-sm font-bold px-6 py-3 rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <Mail size={15} />
                    Reply via Email
                  </a>
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