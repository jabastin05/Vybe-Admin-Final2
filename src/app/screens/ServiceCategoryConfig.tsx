import { useState } from 'react';
import { Search, Plus, Edit2, Trash2, X, CheckCircle, Layers, ArrowLeft } from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { useNavigate } from 'react-router';
import { useMasterData } from '../contexts/MasterDataContext';

export function ServiceCategoryConfig() {
  const navigate = useNavigate();
  const { serviceCategories, addServiceCategory, updateServiceCategory, deleteServiceCategory } = useMasterData();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{ id: number; name: string; description: string; parentId: number | null } | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({ name: '', description: '', parentId: null as number | null });
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

  const handleOpenModal = (category?: { id: number; name: string; description: string; parentId: number | null }) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category.name, description: category.description, parentId: category.parentId });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', description: '', parentId: null });
    }
    setFormErrors({ name: '', description: '' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '', parentId: null });
    setFormErrors({ name: '', description: '' });
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    if (editingCategory) {
      updateServiceCategory(editingCategory.id, { name: formData.name, description: formData.description, parentId: formData.parentId });
      showSuccess('Category updated!');
    } else {
      addServiceCategory({ name: formData.name, description: formData.description, parentId: formData.parentId });
      showSuccess('Category created!');
    }
    handleCloseModal();
  };

  const handleDelete = (id: number) => {
    if (confirm('Delete this category?')) {
      deleteServiceCategory(id);
      showSuccess('Category deleted!');
    }
  };

  const filteredCategories = serviceCategories.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.description.toLowerCase().includes(searchQuery.toLowerCase()));

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
        <h1 className="text-h2 tracking-tight text-foreground dark:text-neutral-0/95 mb-1">Service Categories</h1>
        <p className="text-small text-neutral-700/80 dark:text-neutral-300/80">Organize services into categories.</p>
      </div>
      <div className="flex items-start justify-between mb-6">
        <div className="bg-card/85 dark:bg-card/[0.02] backdrop-blur-[40px] border border-black/5 dark:border-white/5 rounded-[var(--radius-card)] p-6 min-w-[200px]">
          <div className="text-caption font-medium tracking-[0.05em] text-muted-foreground dark:text-neutral-300/60 uppercase mb-2">CATEGORIES</div>
          <div className="text-h1 font-medium text-foreground dark:text-neutral-0/95 mb-1">{serviceCategories.length}</div>
        </div>
        <button onClick={() => handleOpenModal()} className="px-6 py-2.5 bg-primary-700 hover:bg-primary-900 text-neutral-0 rounded-[var(--radius-card)] text-small font-medium transition-all flex items-center gap-2 shadow-sm">
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground dark:text-neutral-300/60" />
          <input type="text" placeholder="Search categories..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card dark:bg-card/5 border border-black/10 dark:border-white/10 rounded-[var(--radius-card)] text-small text-foreground dark:text-neutral-0 placeholder:text-muted-foreground dark:placeholder:text-neutral-300/60 focus:outline-none focus:border-primary-700/50" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCategories.map((category) => (
          <div key={category.id} className="bg-card/85 dark:bg-card/[0.02] backdrop-blur-[40px] border border-black/5 dark:border-white/5 rounded-[var(--radius-card)] p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="p-2 bg-blue-500/10 rounded-[var(--radius-card)]">
                  <Layers className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-[16px] font-medium text-foreground dark:text-neutral-0/95 mb-1">{category.name}</h3>
                  <p className="text-small text-neutral-700/80 dark:text-neutral-300/80">{category.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => handleOpenModal(category)} className="p-2 hover:bg-neutral-900/5 dark:hover:bg-card/5 rounded-[var(--radius)] transition-colors">
                  <Edit2 className="w-4 h-4 text-muted-foreground dark:text-neutral-300/60" />
                </button>
                <button onClick={() => handleDelete(category.id)} className="p-2 hover:bg-red-500/10 rounded-[var(--radius)] transition-colors group">
                  <Trash2 className="w-4 h-4 text-muted-foreground dark:text-neutral-300/60 group-hover:text-red-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 backdrop-blur-sm">
          <div className="bg-card dark:bg-neutral-900 rounded-[var(--radius-card)] p-8 w-full max-w-md shadow-2xl border border-black/10 dark:border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-h3 font-medium text-foreground dark:text-neutral-0">{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
              <button onClick={handleCloseModal} className="p-2 hover:bg-neutral-900/5 dark:hover:bg-card/5 rounded-[var(--radius)] transition-colors">
                <X className="w-5 h-5 text-neutral-700/80 dark:text-neutral-300/80" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-caption font-medium text-neutral-700/80 dark:text-neutral-300/80 mb-1.5">Category Name *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-card dark:bg-card/5 border border-black/10 dark:border-white/10 rounded-[var(--radius-card)] text-small text-foreground dark:text-neutral-0 focus:outline-none focus:border-primary-700/50" placeholder="e.g., Legal Services" />
                {formErrors.name && <p className="mt-1 text-caption text-red-500">{formErrors.name}</p>}
              </div>
              <div>
                <label className="block text-caption font-medium text-neutral-700/80 dark:text-neutral-300/80 mb-1.5">Description *</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-card dark:bg-card/5 border border-black/10 dark:border-white/10 rounded-[var(--radius-card)] text-small text-foreground dark:text-neutral-0 focus:outline-none focus:border-primary-700/50 resize-none" rows={4} />
                {formErrors.description && <p className="mt-1 text-caption text-red-500">{formErrors.description}</p>}
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <button onClick={handleCloseModal} className="flex-1 px-4 py-2.5 bg-neutral-900/5 dark:bg-card/5 hover:bg-neutral-900/10 dark:hover:bg-card/10 text-foreground dark:text-neutral-0 rounded-[var(--radius-card)] text-small font-medium transition-all">Cancel</button>
              <button onClick={handleSubmit} className="flex-1 px-4 py-2.5 bg-primary-700 hover:bg-primary-900 text-neutral-0 rounded-[var(--radius-card)] text-small font-medium transition-all shadow-sm">{editingCategory ? 'Update' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}