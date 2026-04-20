import { useState } from 'react';
import { Search, ChevronDown, X, CheckCircle } from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';

interface Invitation {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: 'INVITED' | 'COMPLETED';
  invitationLink: string;
}

const initialInvitations: Invitation[] = [
  {
    id: 1,
    firstName: 'Akash',
    lastName: 'V',
    email: 'akash@gmail.com',
    phone: '+919870910912',
    status: 'INVITED',
    invitationLink: 'https://vybe.com/invite?code=QvH817',
  },
  {
    id: 2,
    firstName: 'Jabastin',
    lastName: 'V',
    email: 'jabastin@gmail.com',
    phone: '+916380150549',
    status: 'COMPLETED',
    invitationLink: 'https://vybe.com/invite?code=AVF668',
  },
  {
    id: 3,
    firstName: 'Krishan',
    lastName: 'Test',
    email: 'krishan@gmail.com',
    phone: '+917879171813',
    status: 'COMPLETED',
    invitationLink: 'https://vybe.com/invite?code=DVFa82',
  },
];

type SortOption = 'name-asc' | 'name-desc' | 'status' | 'recent';

export function Invitations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [invitations, setInvitations] = useState<Invitation[]>(initialInvitations);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [formErrors, setFormErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const filteredInvitations = invitations.filter((inv) =>
    inv.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort invitations
  const sortedInvitations = [...filteredInvitations].sort((a, b) => {
    switch (sortBy) {
      case 'name-asc':
        return a.firstName.localeCompare(b.firstName);
      case 'name-desc':
        return b.firstName.localeCompare(a.firstName);
      case 'status':
        return a.status.localeCompare(b.status);
      case 'recent':
      default:
        return b.id - a.id;
    }
  });

  const generateInviteCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const validateForm = () => {
    const errors = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    };
    let isValid = true;

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Invalid email format';
      isValid = false;
    }

    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!formData.phone.trim()) {
      errors.phone = 'Phone is required';
      isValid = false;
    } else if (!phoneRegex.test(formData.phone.replace(/[\s-]/g, ''))) {
      errors.phone = 'Invalid phone format';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleCreateInvitation = () => {
    if (!validateForm()) {
      return;
    }

    const newInvitation: Invitation = {
      id: invitations.length + 1,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      status: 'INVITED',
      invitationLink: `https://vybe.com/invite?code=${generateInviteCode()}`,
    };

    setInvitations([newInvitation, ...invitations]);
    setIsCreateModalOpen(false);
    setFormData({ firstName: '', lastName: '', email: '', phone: '' });
    setFormErrors({ firstName: '', lastName: '', email: '', phone: '' });
    
    // Show success message
    setSuccessMessage('Invitation sent successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleResend = (invitation: Invitation) => {
    if (invitation.status === 'COMPLETED') return;

    // Show success message
    setSuccessMessage(`Invitation resent to ${invitation.firstName} ${invitation.lastName}`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleCancel = (id: number) => {
    if (confirm('Are you sure you want to cancel this invitation?')) {
      setInvitations(invitations.filter(inv => inv.id !== id));
      setSuccessMessage('Invitation cancelled successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleCopyLink = (link: string) => {
    try {
      const isIframe = window !== window.parent;
      if (!isIframe && navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(link).then(() => {
          setSuccessMessage('Link copied to clipboard!');
          setTimeout(() => setSuccessMessage(''), 3000);
        }).catch(() => {
          fallbackCopyTextToClipboard(link);
        });
      } else {
        fallbackCopyTextToClipboard(link);
      }
    } catch (err) {
      fallbackCopyTextToClipboard(link);
    }
  };

  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setSuccessMessage('Link copied to clipboard!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Unable to copy', err);
    }
    document.body.removeChild(textArea);
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case 'name-asc':
        return 'Name (A-Z)';
      case 'name-desc':
        return 'Name (Z-A)';
      case 'status':
        return 'Status';
      case 'recent':
      default:
        return 'Most Recent';
    }
  };

  return (
    <AdminLayout>
      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-24 right-8 z-50 bg-emerald-500 text-white px-6 py-3 rounded-[12px] shadow-lg flex items-center gap-2 animate-in slide-in-from-top">
          <CheckCircle className="w-4 h-4" />
          <span className="text-[14px] font-medium">{successMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="vybe-page-header">
        <h1 className="vybe-page-title mb-[var(--space-1)]">
          Invitations
        </h1>
        <p className="vybe-page-subtitle">
          Invite collaborators and track pending access requests.
        </p>
      </div>

      {/* Stats + Create Button */}
      <div className="flex items-start justify-between gap-[var(--space-4)] mb-[var(--space-6)]">
        <div className="grid grid-cols-3 gap-[var(--space-4)] flex-1">
          {[
            { label: 'Total Invitations', value: invitations.length,                                               valueStyle: { color: 'var(--foreground)' } },
            { label: 'Invited',           value: invitations.filter(i => i.status === 'INVITED').length,           valueStyle: { color: '#E49B0F' } },
            { label: 'Completed',         value: invitations.filter(i => i.status === 'COMPLETED').length,         valueStyle: { color: '#2A9D62' } },
          ].map(({ label, value, valueStyle }) => (
            <div key={label} className="vybe-kpi-card">
              <div className="vybe-kpi-label">{label}</div>
              <div className="vybe-kpi-value" style={valueStyle}>{value}</div>
            </div>
          ))}
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="vybe-btn-primary shrink-0"
        >
          + Create Invitation
        </button>
      </div>

      {/* Search and Sort Controls */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="vybe-search"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
            className="vybe-filter-btn flex items-center gap-2"
          >
            {getSortLabel()}
            <ChevronDown className="w-4 h-4" />
          </button>
          {isSortDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 bg-card border border-border rounded-[var(--radius)] shadow-lg min-w-[180px] overflow-hidden z-10">
              <button
                onClick={() => { setSortBy('recent'); setIsSortDropdownOpen(false); }}
                className="w-full text-left px-4 py-2.5 text-small text-foreground hover:bg-muted transition-colors"
              >
                Most Recent
              </button>
              <button
                onClick={() => { setSortBy('name-asc'); setIsSortDropdownOpen(false); }}
                className="w-full text-left px-4 py-2.5 text-small text-foreground hover:bg-muted transition-colors"
              >
                Name (A-Z)
              </button>
              <button
                onClick={() => { setSortBy('name-desc'); setIsSortDropdownOpen(false); }}
                className="w-full text-left px-4 py-2.5 text-small text-foreground hover:bg-muted transition-colors"
              >
                Name (Z-A)
              </button>
              <button
                onClick={() => { setSortBy('status'); setIsSortDropdownOpen(false); }}
                className="w-full text-left px-4 py-2.5 text-small text-foreground hover:bg-muted transition-colors"
              >
                Status
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Invitations Table */}
      <div className="vybe-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="vybe-table-head">
                  First Name
                </th>
                <th className="vybe-table-head">
                  Last Name
                </th>
                <th className="vybe-table-head">
                  Email
                </th>
                <th className="vybe-table-head">
                  Phone
                </th>
                <th className="vybe-table-head">
                  Status
                </th>
                <th className="vybe-table-head">
                  Invitation Link
                </th>
                <th className="vybe-table-head">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedInvitations.map((invitation) => (
                <tr
                  key={invitation.id}
                  className="border-b border-border transition-colors last:border-0 hover:bg-[var(--accent)]"
                >
                  <td className="px-6 py-4 text-small text-foreground">
                    {invitation.firstName}
                  </td>
                  <td className="px-6 py-4 text-small text-foreground">
                    {invitation.lastName}
                  </td>
                  <td className="px-6 py-4 text-small text-foreground">
                    {invitation.email}
                  </td>
                  <td className="px-6 py-4 text-small text-foreground">
                    {invitation.phone}
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className={`vybe-badge ${
                        invitation.status === 'INVITED'
                          ? 'vybe-badge-blue'
                          : 'vybe-badge-green'
                      }`}
                    >
                      {invitation.status}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleCopyLink(invitation.invitationLink)}
                      className="text-[14px] text-emerald-500 hover:text-emerald-600 transition-colors underline"
                    >
                      {invitation.invitationLink}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleResend(invitation)}
                        disabled={invitation.status === 'COMPLETED'}
                        className={`px-3 py-1.5 text-[12px] transition-colors ${
                          invitation.status === 'COMPLETED'
                            ? 'text-black/30 dark:text-white/30 cursor-not-allowed'
                            : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white'
                        }`}
                      >
                        Resend
                      </button>
                      <button 
                        onClick={() => handleCancel(invitation.id)}
                        className="px-3 py-1.5 text-[12px] text-black/60 dark:text-white/60 hover:text-red-500 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between">
          <div className="text-small text-muted-foreground">
            Showing {sortedInvitations.length} of {invitations.length} invitations
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors disabled:opacity-30" disabled>
              <ChevronDown className="w-4 h-4 rotate-90 text-black/60 dark:text-white/60" />
            </button>
            <button className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors disabled:opacity-30" disabled>
              <ChevronDown className="w-4 h-4 -rotate-90 text-black/60 dark:text-white/60" />
            </button>
          </div>
        </div>
      </div>

      {/* Create Invitation Modal */}
      {isCreateModalOpen && (
        <div className="vybe-modal-overlay">
          <div className="vybe-modal w-full">
            {/* Modal Header */}
            <div className="vybe-modal-header">
              <h2 className="text-[20px] font-semibold text-foreground">
                Create Invitation
              </h2>
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setFormData({ firstName: '', lastName: '', email: '', phone: '' });
                  setFormErrors({ firstName: '', lastName: '', email: '', phone: '' });
                }}
                className="vybe-icon-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-4">
              {/* First Name */}
              <div>
                <label className="vybe-label">
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="vybe-input"
                  placeholder="Enter first name"
                />
                {formErrors.firstName && (
                  <p className="mt-1 text-caption text-red-500">{formErrors.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="vybe-label">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="vybe-input"
                  placeholder="Enter last name"
                />
                {formErrors.lastName && (
                  <p className="mt-1 text-caption text-red-500">{formErrors.lastName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="vybe-label">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="vybe-input"
                  placeholder="email@example.com"
                />
                {formErrors.email && (
                  <p className="mt-1 text-caption text-red-500">{formErrors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="vybe-label">
                  Phone *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="vybe-input"
                  placeholder="+91 9876543210"
                />
                {formErrors.phone && (
                  <p className="mt-1 text-caption text-red-500">{formErrors.phone}</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setFormData({ firstName: '', lastName: '', email: '', phone: '' });
                  setFormErrors({ firstName: '', lastName: '', email: '', phone: '' });
                }}
                className="flex-1 px-4 h-[var(--button-height-desktop)] bg-muted hover:bg-black/10 dark:hover:bg-white/10 text-foreground rounded-[var(--radius)] text-small font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateInvitation}
                className="flex-1 px-4 h-[var(--button-height-desktop)] bg-primary hover:opacity-90 text-primary-foreground rounded-[var(--radius)] text-small font-medium transition-colors shadow-sm"
              >
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
