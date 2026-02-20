import React, { useEffect, useState } from 'react';
import { Mail, User, Clock } from 'lucide-react';
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
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-dark">Contacts</h1>
        <p className="text-gray-400 text-sm mt-1 italic">View messages from website visitors</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : contacts.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">No contacts yet</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* List */}
          <div className="lg:col-span-1 space-y-3">
            {contacts.map(contact => (
              <button
                key={contact._id}
                onClick={() => setSelected(contact)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  selected?._id === contact._id
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-100 bg-white hover:border-gray-200'
                } shadow-sm`}
              >
                <div className="flex items-start justify-between mb-1">
                  <p className="font-medium text-dark text-sm">{contact.name}</p>
                  {!contact.isRead && (
                    <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />
                  )}
                </div>
                <p className="text-xs text-gray-400 truncate">{contact.subject || contact.message}</p>
                <p className="text-xs text-gray-300 mt-1">
                  {new Date(contact.createdAt).toLocaleDateString('id-ID')}
                </p>
              </button>
            ))}
          </div>

          {/* Detail */}
          <div className="lg:col-span-2">
            {selected ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-start gap-4 mb-6 pb-6 border-b border-gray-100">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User size={18} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark">{selected.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Mail size={12} className="text-gray-400" />
                      <a href={`mailto:${selected.email}`} className="text-xs text-gray-400 hover:text-primary">
                        {selected.email}
                      </a>
                    </div>
                  </div>
                  <div className="ml-auto flex items-center gap-1 text-xs text-gray-400">
                    <Clock size={12} />
                    {new Date(selected.createdAt).toLocaleString('id-ID')}
                  </div>
                </div>
                {selected.subject && (
                  <p className="font-semibold text-dark mb-3">{selected.subject}</p>
                )}
                <p className="text-sm text-gray-600 leading-relaxed">{selected.message}</p>
                <div className="mt-6">
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Your inquiry'}`}
                    className="inline-flex items-center gap-2 bg-primary text-dark text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-primary-dark transition-colors"
                  >
                    <Mail size={14} /> Reply via Email
                  </a>
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
                Select a message to view details
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactsPage;
