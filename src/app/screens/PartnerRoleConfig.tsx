import { useState } from 'react';
import { Search, Plus, Edit2, Trash2, X, CheckCircle, Shield, ArrowLeft } from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { useNavigate } from 'react-router';
import { useMasterData } from '../contexts/MasterDataContext';

export function PartnerRoleConfig() {
  const navigate = useNavigate();
  const { partnerRoles, addPartnerRole, updatePartnerRole, deletePartnerRole } = useMasterData();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<{ id: number; name: string; description: string } | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [formErrors, setFormErrors] = useState({ name: '', description: '' });

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const validateForm = () => {
    const errors = { name: '', description: '' };
    let isValid = true;
    if (!formData.name.trim()) { errors.name = 'Name is required'; isValid = false; }
    if (!formData.description.trim()) { errors.description = 'Description is required'; isValid = false; }
    setFormErrors(errors);
    return isValid;
  };

  const handleOpenModal = (role?: { id: number; name: string; description: string }) => {
    if (role) {
      setEditingRole(role);
      setFormData({ name: role.name, description: role.description });
    } else {
      setEditingRole(null);
      setFormData({ name: '', description: '' });
    }
    setFormErrors({ name: '', description: '' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRole(null);
    setFormData({ name: '', description: '' });
    setFormErrors({ name: '', description: '' });
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    if (editingRole) {
      updatePartnerRole(editingRole.id, { name: formData.name, description: formData.description });
      showSuccess('Category updated!');
    } else {
      addPartnerRole({ name: formData.name, description: formData.description });
      showSuccess('Category created!');
    }
    handleCloseModal();
  };

  const handleDelete = (id: number) => {
    if (confirm('Delete this category?')) {
      deletePartnerRole(id);
      showSuccess('Category deleted!');
    }
  };

  const filteredRoles = partnerRoles.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.description.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <AdminLayout>
      {successMessage && (
        <div className="fixed top-24 right-8 z-50 bg-emerald-500 text-white px-6 py-3 rounded-[12px] shadow-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span className="text-[14px] font-medium">{successMessage}</span>
        </div>
      )}
      <div className="mb-8">
        <button
          onClick={() => navigate('/admin/master-data')}
          className="flex items-center gap-2 text-[14px] text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Master Data Management
        </button>
        <h1 className="text-[24px] tracking-tight text-black dark:text-white/95 mb-1">Service Provider Category</h1>
        <p className="text-[14px] text-black/60 dark:text-white/60">Define categories for service providers.</p>
      </div>
      <div className="flex items-start justify-between mb-6">
        <div className="bg-white/85 dark:bg-white/[0.02] backdrop-blur-[40px] border border-black/5 dark:border-white/5 rounded-[24px] p-6 min-w-[200px]">
          <div className="text-[10px] font-bold tracking-[0.05em] text-black/40 dark:text-white/40 uppercase mb-2">TOTAL CATEGORIES</div>
          <div className="text-[32px] font-bold text-black dark:text-white/95 mb-1">{partnerRoles.length}</div>
        </div>
        <button onClick={() => handleOpenModal()} className="px-6 py-2.5 bg-primary hover:opacity-90 text-primary-foreground rounded-[12px] text-[14px] font-medium transition-all flex items-center gap-2 shadow-sm">
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40 dark:text-white/40" />
          <input type="text" placeholder="Search categories..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-[12px] text-[14px] text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 focus:outline-none focus:border-emerald-500/50" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRoles.map((role) => (
          <div key={role.id} className="bg-white/85 dark:bg-white/[0.02] backdrop-blur-[40px] border border-black/5 dark:border-white/5 rounded-[24px] p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-[12px]">
                  <Shield className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-[16px] font-medium text-black dark:text-white/95">{role.name}</h3>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => handleOpenModal(role)} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors">
                  <Edit2 className="w-4 h-4 text-black/40 dark:text-white/40" />
                </button>
                <button onClick={() => handleDelete(role.id)} className="p-2 hover:bg-red-500/10 rounded-lg transition-colors group">
                  <Trash2 className="w-4 h-4 text-black/40 dark:text-white/40 group-hover:text-red-500" />
                </button>
              </div>
            </div>
            <p className="text-[14px] text-black/60 dark:text-white/60">{role.description}</p>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-[24px] p-8 w-full max-w-md shadow-2xl border border-black/10 dark:border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[20px] font-semibold text-black dark:text-white">{editingRole ? 'Edit Category' : 'Add Category'}</h2>
              <button onClick={handleCloseModal} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors">
                <X className="w-5 h-5 text-black/60 dark:text-white/60" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-black/60 dark:text-white/60 mb-1.5">Category Name *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-[12px] text-[14px] text-black dark:text-white focus:outline-none focus:border-emerald-500/50" placeholder="e.g., Legal Advisor" />
                {formErrors.name && <p className="mt-1 text-[12px] text-red-500">{formErrors.name}</p>}
              </div>
              <div>
                <label className="block text-[12px] font-medium text-black/60 dark:text-white/60 mb-1.5">Description *</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-[12px] text-[14px] text-black dark:text-white focus:outline-none focus:border-emerald-500/50 resize-none" rows={4} />
                {formErrors.description && <p className="mt-1 text-[12px] text-red-500">{formErrors.description}</p>}
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <button onClick={handleCloseModal} className="flex-1 px-4 py-2.5 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-white rounded-[12px] text-[14px] font-medium transition-all">Cancel</button>
              <button onClick={handleSubmit} className="flex-1 px-4 py-2.5 bg-primary hover:opacity-90 text-primary-foreground rounded-[12px] text-[14px] font-medium transition-all shadow-sm">{editingRole ? 'Update' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}