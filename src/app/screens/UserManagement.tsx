import { useState } from 'react';
import { Search, Plus, Edit2, Trash2, X, CheckCircle, User, Power, PowerOff } from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { useMasterData } from '../contexts/MasterDataContext';

interface User {
  id: number;
  userType: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  enabled: boolean;
}

export function UserManagement() {
  const { userTypes } = useMasterData();
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState<Partial<User>>({
    userType: '',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    enabled: true,
  });

  const [formErrors, setFormErrors] = useState({
    userType: '',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
  });

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const validateForm = () => {
    const errors = {
      userType: '',
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
    };
    let isValid = true;

    if (!formData.userType) {
      errors.userType = 'User type is required';
      isValid = false;
    }
    if (!formData.firstName?.trim()) {
      errors.firstName = 'First name is required';
      isValid = false;
    }
    if (!formData.lastName?.trim()) {
      errors.lastName = 'Last name is required';
      isValid = false;
    }
    if (!formData.phone?.trim()) {
      errors.phone = 'Phone is required';
      isValid = false;
    }
    if (!formData.email?.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData(user);
    } else {
      setEditingUser(null);
      setFormData({
        userType: '',
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        enabled: true,
      });
    }
    setFormErrors({
      userType: '',
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({
      userType: '',
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      enabled: true,
    });
    setFormErrors({
      userType: '',
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
    });
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (editingUser) {
      setUsers(users.map(u =>
        u.id === editingUser.id ? { ...formData, id: editingUser.id } as User : u
      ));
      showSuccess('User updated!');
    } else {
      setUsers([...users, { ...formData, id: Date.now() } as User]);
      showSuccess('User created!');
    }
    handleCloseModal();
  };

  const handleToggleEnabled = (id: number) => {
    setUsers(users.map(u => u.id === id ? { ...u, enabled: !u.enabled } : u));
    const user = users.find(u => u.id === id);
    showSuccess(`User ${user?.enabled ? 'disabled' : 'enabled'}!`);
  };

  const handleDelete = (id: number) => {
    if (confirm('Delete this user?')) {
      setUsers(users.filter(u => u.id !== id));
      showSuccess('User deleted!');
    }
  };

  const filteredUsers = users.filter(u =>
    u.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.userType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      {successMessage && (
        <div className="fixed top-24 right-8 z-50 bg-emerald-500 text-white px-6 py-3 rounded-[12px] shadow-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span className="text-[14px] font-medium">{successMessage}</span>
        </div>
      )}

      <div className="vybe-page-header">
        <h1 className="vybe-page-title">User Management</h1>
        <p className="vybe-page-subtitle">Onboard users and manage their access.</p>
      </div>

      <div className="vybe-page-header-row mb-6">
        <div className="flex gap-4">
          <div className="vybe-kpi-card min-w-[200px]">
            <div className="vybe-kpi-label">TOTAL USERS</div>
            <div className="vybe-kpi-value">{users.length}</div>
          </div>
          <div className="vybe-kpi-card min-w-[200px]">
            <div className="vybe-kpi-label">ACTIVE USERS</div>
            <div className="vybe-kpi-value" style={{ color: '#10B981' }}>{users.filter(u => u.enabled).length}</div>
          </div>
        </div>
        <button onClick={() => handleOpenModal()} className="h-[var(--button-height-desktop)] px-[var(--space-5)] bg-primary hover:opacity-90 text-primary-foreground rounded-[var(--radius-button)] text-small font-medium transition-colors flex items-center gap-[var(--space-2)] shadow-sm">
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search users..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="vybe-search w-full pl-10" />
        </div>
      </div>

      <div className="vybe-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="vybe-table-head text-left px-6 py-4">Name</th>
                <th className="vybe-table-head text-left px-6 py-4">Email</th>
                <th className="vybe-table-head text-left px-6 py-4">Phone</th>
                <th className="vybe-table-head text-left px-6 py-4">User Type</th>
                <th className="vybe-table-head text-left px-6 py-4">Status</th>
                <th className="vybe-table-head text-left px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-border last:border-0 hover:bg-[var(--accent)] transition-colors">
                  <td className="px-6 py-4 text-small text-foreground">{user.firstName} {user.lastName}</td>
                  <td className="px-6 py-4 text-small text-foreground">{user.email}</td>
                  <td className="px-6 py-4 text-small text-foreground">{user.phone}</td>
                  <td className="px-6 py-4">
                    <span className="vybe-badge vybe-badge-purple">
                      {user.userType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`vybe-badge ${user.enabled ? 'vybe-badge-green' : 'vybe-badge-muted'}`}>
                      {user.enabled ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleToggleEnabled(user.id)} className={`p-2 rounded-lg transition-colors ${user.enabled ? 'bg-emerald-500/10 hover:bg-emerald-500/20' : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10'}`}>
                        {user.enabled ? <Power className="w-4 h-4 text-emerald-500" /> : <PowerOff className="w-4 h-4 text-black/40 dark:text-white/40" />}
                      </button>
                      <button onClick={() => handleOpenModal(user)} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4 text-black/40 dark:text-white/40" />
                      </button>
                      <button onClick={() => handleDelete(user.id)} className="p-2 hover:bg-red-500/10 rounded-lg transition-colors group">
                        <Trash2 className="w-4 h-4 text-black/40 dark:text-white/40 group-hover:text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="vybe-modal-overlay">
          <div className="vybe-modal">
            <div className="vybe-modal-header">
              <h2 className="text-[20px] font-semibold text-foreground">
                {editingUser ? 'Edit User' : 'Add User'}
              </h2>
              <button onClick={handleCloseModal} className="vybe-icon-btn">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="vybe-label">User Type *</label>
                <select value={formData.userType} onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                  className="vybe-input w-full">
                  <option value="">Select User Type</option>
                  {userTypes.map(type => (
                    <option key={type.id} value={type.name}>{type.name}</option>
                  ))}
                </select>
                {formErrors.userType && (
                  <p className="mt-1 text-[12px] text-red-500">{formErrors.userType}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="vybe-label">First Name *</label>
                  <input type="text" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="vybe-input w-full" />
                  {formErrors.firstName && (
                    <p className="mt-1 text-[12px] text-red-500">{formErrors.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="vybe-label">Last Name *</label>
                  <input type="text" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="vybe-input w-full" />
                  {formErrors.lastName && (
                    <p className="mt-1 text-[12px] text-red-500">{formErrors.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="vybe-label">Phone *</label>
                <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="vybe-input w-full"
                  placeholder="+91 9876543210" />
                {formErrors.phone && (
                  <p className="mt-1 text-[12px] text-red-500">{formErrors.phone}</p>
                )}
              </div>

              <div>
                <label className="vybe-label">Email *</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="vybe-input w-full"
                  placeholder="user@example.com" />
                {formErrors.email && (
                  <p className="mt-1 text-[12px] text-red-500">{formErrors.email}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button onClick={handleCloseModal} className="flex-1 px-4 py-2.5 bg-muted hover:bg-black/10 dark:hover:bg-white/10 text-foreground rounded-[var(--radius)] text-small font-medium transition-colors">
                Cancel
              </button>
              <button onClick={handleSubmit} className="flex-1 h-[var(--button-height-desktop)] px-4 bg-primary hover:opacity-90 text-primary-foreground rounded-[var(--radius)] text-small font-medium transition-colors shadow-sm">
                {editingUser ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}