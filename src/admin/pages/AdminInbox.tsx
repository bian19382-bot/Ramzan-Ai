import React, { useState } from 'react';
import {
  Search,
  Mail,
  MessageSquare,
  Clock,
  Trash2,
  ExternalLink,
  Plus,
  Download,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { dataProvider } from '../../data/dataProvider';
import { Inquiry, InquiryStatus } from '../../types/portfolio';

export const AdminInbox: React.FC = () => {
  const db = dataProvider.getDatabase();
  const [inquiries, setInquiries] = useState(db.inquiries);
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(
    inquiries[0]?.id || null
  );
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [newNote, setNewNote] = useState('');

  const refreshList = () => {
    setInquiries([...dataProvider.getDatabase().inquiries]);
  };

  const selectedInquiry = inquiries.find((i) => i.id === selectedInquiryId);

  const handleStatusChange = (id: string, status: InquiryStatus) => {
    dataProvider.updateInquiryStatus(id, status);
    refreshList();
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !selectedInquiryId) return;
    dataProvider.addInquiryNote(selectedInquiryId, newNote.trim());
    setNewNote('');
    refreshList();
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this inquiry permanently?')) {
      dataProvider.deleteInquiry(id);
      refreshList();
      setSelectedInquiryId(null);
    }
  };

  const handleExportCsv = () => {
    const headers = ['ID', 'Date', 'Name', 'Email', 'Service', 'Budget', 'Timeline', 'Status', 'Message'];
    const rows = inquiries.map((i) => [
      i.id,
      i.created_at,
      `"${i.name.replace(/"/g, '""')}"`,
      i.email,
      `"${(i.service || '').replace(/"/g, '""')}"`,
      `"${(i.budget || '').replace(/"/g, '""')}"`,
      `"${(i.timeline || '').replace(/"/g, '""')}"`,
      i.status,
      `"${i.message.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `portfolio_inquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredInquiries = inquiries.filter((i) => {
    if (statusFilter !== 'all' && i.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        i.name.toLowerCase().includes(q) ||
        i.email.toLowerCase().includes(q) ||
        i.message.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <h1 className="text-2xl font-bold font-display text-[var(--text)]">
            Client Inquiries Inbox
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
            Review incoming project briefs, assign workflow statuses, log notes, and export CSVs.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-4 py-2.5 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--border)] border border-[var(--border)] text-xs font-semibold text-[var(--text)] transition flex items-center gap-2 cursor-pointer shadow-sm self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            value={search ?? ''}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search inquiries by name, email, or message..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-xs sm:text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['all', 'new', 'in_progress', 'replied', 'closed', 'spam'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase transition cursor-pointer ${
                statusFilter === st
                  ? 'bg-[var(--accent)] text-white font-bold'
                  : 'bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)] border border-[var(--border)]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Master-Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
        {/* Left List: Inquiries Table (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden shadow-sm flex flex-col">
          <div className="p-3 bg-[var(--surface-2)]/60 border-b border-[var(--border)] text-xs font-mono text-[var(--text-muted)] flex justify-between">
            <span>Inquiries ({filteredInquiries.length})</span>
            <span>Sorted by date</span>
          </div>

          <div className="divide-y divide-[var(--border)]/50 overflow-y-auto max-h-[550px] flex-1">
            {filteredInquiries.map((inq) => {
              const isSelected = selectedInquiryId === inq.id;
              return (
                <div
                  key={inq.id}
                  onClick={() => setSelectedInquiryId(inq.id)}
                  className={`p-4 transition cursor-pointer ${
                    isSelected ? 'bg-[var(--accent)]/10 border-l-4 border-l-[var(--accent)]' : 'hover:bg-[var(--surface-2)]/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs sm:text-sm text-[var(--text)] line-clamp-1">
                      {inq.name}
                    </span>
                    <span
                      className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full font-bold ${
                        inq.status === 'new'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-[var(--surface-2)] text-[var(--text-muted)]'
                      }`}
                    >
                      {inq.status}
                    </span>
                  </div>

                  <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed mb-2">
                    {inq.message}
                  </p>

                  <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)]">
                    <span>{inq.service || 'General Scoping'}</span>
                    <span>{new Date(inq.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}

            {filteredInquiries.length === 0 && (
              <div className="p-8 text-center text-xs text-[var(--text-muted)] font-mono">
                No inquiries matching filter.
              </div>
            )}
          </div>
        </div>

        {/* Right Detail Pane: Message Inspection (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 flex flex-col justify-between shadow-sm">
          {selectedInquiry ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
                <div>
                  <h3 className="text-lg font-bold font-display text-[var(--text)]">
                    {selectedInquiry.name}
                  </h3>
                  <a
                    href={`mailto:${selectedInquiry.email}`}
                    className="text-xs font-mono text-[var(--accent-text)] hover:underline flex items-center gap-1.5 mt-0.5"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{selectedInquiry.email}</span>
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedInquiry.status ?? 'new'}
                    onChange={(e) => handleStatusChange(selectedInquiry.id, e.target.value as InquiryStatus)}
                    className="px-3 py-1.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-xs text-[var(--text)] font-mono focus:outline-none focus:border-[var(--accent)] cursor-pointer"
                  >
                    <option value="new">New</option>
                    <option value="in_progress">In Progress</option>
                    <option value="replied">Replied</option>
                    <option value="closed">Closed</option>
                    <option value="spam">Spam</option>
                  </select>

                  <button
                    onClick={() => handleDelete(selectedInquiry.id)}
                    className="p-2 rounded-xl hover:bg-red-500/15 text-[var(--text-muted)] hover:text-red-400 transition"
                    title="Delete inquiry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Inquiry Meta Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[var(--surface-2)]/60 border border-[var(--border)] text-xs">
                <div>
                  <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Service Requested</span>
                  <p className="font-semibold text-[var(--text)] mt-0.5">{selectedInquiry.service || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Budget Range</span>
                  <p className="font-semibold text-[var(--text)] mt-0.5">{selectedInquiry.budget || 'Flexible'}</p>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Timeline</span>
                  <p className="font-semibold text-[var(--text)] mt-0.5">{selectedInquiry.timeline || 'Flexible'}</p>
                </div>
              </div>

              {/* Message Content */}
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] font-semibold block mb-2">
                  Inquiry Message:
                </span>
                <div className="p-4 rounded-xl bg-[var(--surface-2)]/40 border border-[var(--border)] text-sm text-[var(--text)] leading-relaxed whitespace-pre-wrap">
                  {selectedInquiry.message}
                </div>
              </div>

              {/* Quick Reply Links */}
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={`mailto:${selectedInquiry.email}?subject=Regarding Your Project Inquiry`}
                  className="px-4 py-2 rounded-xl bg-[var(--accent)] hover:brightness-110 text-white text-xs font-semibold flex items-center gap-2 transition shadow-md"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Reply via Email Client</span>
                </a>
              </div>

              {/* Internal Notes Section */}
              <div className="pt-4 border-t border-[var(--border)] space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] font-semibold block">
                  Internal Private Notes:
                </span>

                <div className="space-y-2 max-h-36 overflow-y-auto">
                  {selectedInquiry.notes && selectedInquiry.notes.length > 0 ? (
                    selectedInquiry.notes.map((n) => (
                      <div key={n.id} className="p-2.5 rounded-lg bg-[var(--surface-2)] text-xs text-[var(--text)]">
                        <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)] mb-1">
                          <span>{n.author}</span>
                          <span>{new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p>{n.note}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-[var(--text-muted)] font-mono">No internal notes yet.</p>
                  )}
                </div>

                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    value={newNote ?? ''}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add an internal note..."
                    className="flex-1 px-3 py-2 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--border)] text-xs font-semibold text-[var(--text)] transition cursor-pointer"
                  >
                    Add
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="py-24 text-center text-xs text-[var(--text-muted)] font-mono">
              Select an inquiry from the left to view details and reply.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
