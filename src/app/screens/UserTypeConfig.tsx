import { useState } from 'react';
import { Search, Plus, Edit2, Trash2, X, CheckCircle, UserCog, ArrowLeft } from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { useNavigate } from 'react-router';
import { useMasterData, type PermissionValue } from '../contexts/MasterDataContext';

const MODULES = [
  { id: 'invitation', name: 'Invitation' },
  { id: 'user-management', name: 'User Management' },
  { id: 'client-management', name: 'Client Management' },
  { id: 'case-creation', name: 'Case Creation' },
  { id: 'case-assignment', name: 'Case Assignment' },
  { id: 'case-management', name: 'Case Management' },
  { id: 'case-status-update', name: 'Case Status Update' },
  { id: 'partner-task-update', name: 'Partner Task Update' },
  { id: 'execute-operations', name: 'Execute Operations' },
  { id: 'upload-reports', name: 'Upload Reports' },
  { id: 'document-access', name: 'Document Access' },
  { id: 'service-management', name: 'Service Management' },
  { id: 'workflow-config', name: 'Workflow Config' },
  { id: 'monitoring-reports', name: 'Monitoring / Reports' },
];

const PERMISSION_OPTIONS: { value: PermissionValue; label: string; color: string }[] = [
  { value: 'full', label: 'Full Access', color: 'bg-primary-700' },
  { value: 'denied', label: 'Denied', color: 'bg-red-500' },
  { value: 'assigned-clients', label: 'Assigned Clients', color: 'bg-blue-500' },
  { value: 'assigned-task-only', label: 'Assigned Task Only', color: 'bg-purple-500' },
];

export function UserTypeConfig() {
  const navigate = useNavigate();
  const { userTypes, addUserType, updateUserType, deleteUserType, modulePermissions, updateModulePermission } = useMasterData();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserType, setEditingUserType] = useState<{ id: number; name: string; description: string } | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [modalStep, setModalStep] = useState<'details' | 'permissions'>('details');
  const [tempPermissions, setTempPermissions] = useState<Record<string, PermissionValue>>({});

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const [formErrors, setFormErrors] = useState({
    name: '',
    description: '',
  });

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const validateForm = () => {
    const errors = { name: '', description: '' };
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleOpenModal = (userType?: { id: number; name: string; description: string }) => {
    if (userType) {
      setEditingUserType(userType);
      setFormData({
        name: userType.name,
        description: userType.description,
      });
      setTempPermissions(modulePermissions.reduce((acc, module) => {
        acc[module.moduleId] = module.permissions[userType.id];
        return acc;
      }, {} as Record<string, PermissionValue>));
    } else {
      setEditingUserType(null);
      setFormData({
        name: '',
        description: '',
      });
      setTempPermissions({});
    }
    setFormErrors({ name: '', description: '' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUserType(null);
    setFormData({ name: '', description: '' });
    setFormErrors({ name: '', description: '' });
    setModalStep('details');
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (editingUserType) {
      updateUserType(editingUserType.id, {
        name: formData.name,
        description: formData.description,
      });
      Object.entries(tempPermissions).forEach(([moduleId, permission]) => {
        updateModulePermission(moduleId, editingUserType.id, permission);
      });
      showSuccess('User type updated!');
    } else {
      const newUserType = addUserType({
        name: formData.name,
        description: formData.description,
      });
      Object.entries(tempPermissions).forEach(([moduleId, permission]) => {
        updateModulePermission(moduleId, newUserType.id, permission);
      });
      showSuccess('User type created!');
    }
    handleCloseModal();
  };

  const handleDelete = (id: number) => {
    if (confirm('Delete this user type?')) {
      deleteUserType(id);
      showSuccess('User type deleted!');
    }
  };

  const filteredUserTypes = userTypes.filter(ut =>
    ut.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ut.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Access Control Functions
  const getPermission = (moduleId: string, userTypeId: number): PermissionValue => {
    const module = modulePermissions.find(m => m.moduleId === moduleId);
    return module?.permissions[userTypeId] || 'denied';
  };

  const handlePermissionChange = (moduleId: string, userTypeId: number, permission: PermissionValue) => {
    updateModulePermission(moduleId, userTypeId, permission);
    setEditingCell(null);
  };

  const renderPermissionCell = (moduleId: string, userTypeId: number) => {
    const permission = getPermission(moduleId, userTypeId);
    const isEditing = editingCell?.moduleId === moduleId && editingCell?.userTypeId === userTypeId;
    const option = PERMISSION_OPTIONS.find(opt => opt.value === permission);

    if (isEditing) {
      return (
        <div className="relative">
          <select
            value={permission}
            onChange={(e) => handlePermissionChange(moduleId, userTypeId, e.target.value as PermissionValue)}
            onBlur={() => setEditingCell(null)}
            autoFocus
            className="w-full px-3 py-2 bg-card dark:bg-card/5 border border-primary-700 rounded-[var(--radius)] text-small text-foreground dark:text-neutral-0 focus:outline-none"
          >
            {PERMISSION_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      );
    }

    return (
      <button
        onClick={() => setEditingCell({ moduleId, userTypeId })}
        className="w-full text-center py-3 px-2 hover:bg-neutral-900/5 dark:hover:bg-card/5 transition-colors rounded-[var(--radius)] group"
      >
        {permission === 'full' && (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 rounded-full bg-primary-700 flex items-center justify-center">
              <Check className="w-3 h-3 text-neutral-0" />
            </div>
          </div>
        )}
        {permission === 'denied' && (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
              <X className="w-3 h-3 text-neutral-0" />
            </div>
          </div>
        )}
        {permission !== 'full' && permission !== 'denied' && (
          <span className="text-small text-foreground/80 dark:text-neutral-0/80">
            {option?.label || permission}
          </span>
        )}
        <ChevronDown className="w-3 h-3 mx-auto mt-1 text-muted-foreground dark:text-neutral-300/60 opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>
    );
  };

  const copyColumnPermissions = (fromUserTypeId: number) => {
    MODULES.forEach(module => {
      const permission = getPermission(module.id, fromUserTypeId);
      userTypes.forEach(userType => {
        if (userType.id !== fromUserTypeId) {
          updateModulePermission(module.id, userType.id, permission);
        }
      });
    });
  };

  return (
    <AdminLayout>
      {successMessage && (
        <div className="fixed top-24 right-8 z-50 bg-primary-700 text-neutral-0 px-6 py-3 rounded-[var(--radius-card)] shadow-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span className="text-small font-medium">{successMessage}</span>
        </div>
      )}

      <div className="mb-8">
        <button
          onClick={() => navigate('/admin/master-data')}
          className="flex items-center gap-2 text-small text-neutral-700/80 dark:text-neutral-300/80 hover:text-foreground dark:hover:text-neutral-0 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Master Data Management
        </button>
        <h1 className="text-h2 tracking-tight text-foreground dark:text-neutral-0/95 mb-1">User Types</h1>
        <p className="text-small text-neutral-700/80 dark:text-neutral-300/80">Define user access types and configure module permissions.</p>
      </div>

      <div className="flex items-start justify-between mb-6">
        <div className="bg-card/85 dark:bg-card/[0.02] backdrop-blur-[40px] border border-black/5 dark:border-white/5 rounded-[var(--radius-card)] p-6 min-w-[200px]">
          <div className="text-caption font-medium tracking-[0.05em] text-muted-foreground dark:text-neutral-300/60 uppercase mb-2">
            TOTAL TYPES
          </div>
          <div className="text-h1 font-medium text-foreground dark:text-neutral-0/95 mb-1">
            {userTypes.length}
          </div>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-6 py-2.5 bg-primary-700 hover:bg-primary-900 text-neutral-0 rounded-[var(--radius-card)] text-small font-medium transition-all flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add User Type
        </button>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground dark:text-neutral-300/60" />
          <input
            type="text"
            placeholder="Search user types..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card dark:bg-card/5 border border-black/10 dark:border-white/10 rounded-[var(--radius-card)] text-small text-foreground dark:text-neutral-0 placeholder:text-muted-foreground dark:placeholder:text-neutral-300/60 focus:outline-none focus:border-primary-700/50"
          />
        </div>
      </div>

      <div className="bg-card/85 dark:bg-card/[0.02] backdrop-blur-[40px] border border-black/5 dark:border-white/5 rounded-[var(--radius-card)] overflow-hidden">
        <div className="divide-y divide-black/5 dark:divide-white/5">
          {filteredUserTypes.map((userType) => (
            <div
              key={userType.id}
              className="flex items-center gap-4 p-6 hover:bg-neutral-900/[0.02] dark:hover:bg-card/[0.02] transition-colors"
            >
              <div className="p-3 bg-indigo-500/10 rounded-[var(--radius-card)]">
                <UserCog className="w-5 h-5 text-indigo-500" />
              </div>

              <div className="flex-1">
                <h3 className="text-[16px] font-medium text-foreground dark:text-neutral-0/95 mb-0.5">
                  {userType.name}
                </h3>
                <p className="text-small text-neutral-700/80 dark:text-neutral-300/80">
                  {userType.description}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenModal(userType)}
                  className="p-2 hover:bg-neutral-900/5 dark:hover:bg-card/5 rounded-[var(--radius)] transition-colors"
                >
                  <Edit2 className="w-4 h-4 text-muted-foreground dark:text-neutral-300/60" />
                </button>
                <button
                  onClick={() => handleDelete(userType.id)}
                  className="p-2 hover:bg-red-500/10 rounded-[var(--radius)] transition-colors group"
                >
                  <Trash2 className="w-4 h-4 text-muted-foreground dark:text-neutral-300/60 group-hover:text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 backdrop-blur-sm p-4">
          <div className="bg-card dark:bg-neutral-900 rounded-[var(--radius-card)] p-8 w-full max-w-3xl shadow-2xl border border-black/10 dark:border-white/10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-h3 font-medium text-foreground dark:text-neutral-0">
                  {editingUserType ? 'Edit User Type' : 'Add User Type'}
                </h2>
                <p className="text-caption text-neutral-700/80 dark:text-neutral-300/80 mt-1">
                  {modalStep === 'details' ? 'Step 1 of 2: Basic Details' : 'Step 2 of 2: Access Control'}
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-neutral-900/5 dark:hover:bg-card/5 rounded-[var(--radius)] transition-colors"
              >
                <X className="w-5 h-5 text-neutral-700/80 dark:text-neutral-300/80" />
              </button>
            </div>

            {/* Step 1: Basic Details */}
            {modalStep === 'details' && (
              <>
                <div className="space-y-4">
                  <div>
                    <label className="block text-caption font-medium text-neutral-700/80 dark:text-neutral-300/80 mb-1.5">
                      User Type Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-card dark:bg-card/5 border border-black/10 dark:border-white/10 rounded-[var(--radius-card)] text-small text-foreground dark:text-neutral-0 focus:outline-none focus:border-primary-700/50"
                      placeholder="e.g., Admin"
                    />
                    {formErrors.name && (
                      <p className="mt-1 text-caption text-red-500">{formErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-caption font-medium text-neutral-700/80 dark:text-neutral-300/80 mb-1.5">
                      Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2.5 bg-card dark:bg-card/5 border border-black/10 dark:border-white/10 rounded-[var(--radius-card)] text-small text-foreground dark:text-neutral-0 focus:outline-none focus:border-primary-700/50 resize-none"
                      rows={3}
                      placeholder="Describe the permissions and access level"
                    />
                    {formErrors.description && (
                      <p className="mt-1 text-caption text-red-500">{formErrors.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-6">
                  <button
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2.5 bg-neutral-900/5 dark:bg-card/5 hover:bg-neutral-900/10 dark:hover:bg-card/10 text-foreground dark:text-neutral-0 rounded-[var(--radius-card)] text-small font-medium transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (validateForm()) {
                        setModalStep('permissions');
                      }
                    }}
                    className="flex-1 px-4 py-2.5 bg-primary-700 hover:bg-primary-900 text-neutral-0 rounded-[var(--radius-card)] text-small font-medium transition-all shadow-sm"
                  >
                    Next: Configure Permissions
                  </button>
                </div>
              </>
            )}

            {/* Step 2: Permissions */}
            {modalStep === 'permissions' && (
              <>
                <div className="space-y-4">
                  <div className="bg-neutral-900/5 dark:bg-card/5 rounded-[var(--radius-card)] p-4 mb-4">
                    <p className="text-small text-foreground/80 dark:text-neutral-0/80">
                      Configure access permissions for <span className="font-medium">{formData.name}</span>
                    </p>
                  </div>

                  <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
                    {MODULES.map(module => (
                      <div key={module.id} className="flex items-center justify-between gap-4 p-3 bg-neutral-900/[0.02] dark:bg-card/[0.02] rounded-[var(--radius)]">
                        <span className="text-small font-medium text-foreground dark:text-neutral-0">
                          {module.name}
                        </span>
                        <select
                          value={tempPermissions[module.id] || 'denied'}
                          onChange={(e) => setTempPermissions({
                            ...tempPermissions,
                            [module.id]: e.target.value as PermissionValue
                          })}
                          className="px-3 py-2 bg-card dark:bg-card/5 border border-black/10 dark:border-white/10 rounded-[var(--radius)] text-small text-foreground dark:text-neutral-0 focus:outline-none focus:border-primary-700/50"
                        >
                          {PERMISSION_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>

                  {/* Permission Legend */}
                  <div className="mt-4 p-4 bg-neutral-900/[0.02] dark:bg-card/[0.02] rounded-[var(--radius-card)]">
                    <h4 className="text-caption font-medium tracking-[0.05em] text-neutral-700/80 dark:text-neutral-300/80 uppercase mb-2">
                      Permission Types
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {PERMISSION_OPTIONS.map(option => (
                        <div key={option.value} className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${option.color}`}></div>
                          <span className="text-caption text-foreground/80 dark:text-neutral-0/80">{option.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-6">
                  <button
                    onClick={() => setModalStep('details')}
                    className="px-4 py-2.5 bg-neutral-900/5 dark:bg-card/5 hover:bg-neutral-900/10 dark:hover:bg-card/10 text-foreground dark:text-neutral-0 rounded-[var(--radius-card)] text-small font-medium transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 px-4 py-2.5 bg-primary-700 hover:bg-primary-900 text-neutral-0 rounded-[var(--radius-card)] text-small font-medium transition-all shadow-sm"
                  >
                    {editingUserType ? 'Update User Type' : 'Create User Type'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}