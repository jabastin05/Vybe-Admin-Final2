import { useState } from 'react';
import { Search, Plus, Edit2, Trash2, X, CheckCircle, GitBranch, GripVertical, ChevronDown, ChevronRight } from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { useMasterData } from '../contexts/MasterDataContext';

interface WorkflowStatus {
  id: number;
  name: string;
  description: string;
  color: string;
  order: number;
}

interface WorkflowTemplate {
  id: number;
  name: string;
  description: string;
  statuses: string[];
}

const colorOptions = [
  { name: 'Emerald', value: '#28FF6E' },
  { name: 'Gold', value: '#FFC700' },
  { name: 'Blue', value: '#2196F3' },
  { name: 'Purple', value: '#9C27B0' },
  { name: 'Red', value: '#FF6B6B' },
  { name: 'Orange', value: '#FF9800' },
  { name: 'Pink', value: '#E91E63' },
  { name: 'Teal', value: '#009688' },
];

export function WorkflowTemplateConfig() {
  const { workflowTemplates, addWorkflowTemplate, updateWorkflowTemplate, deleteWorkflowTemplate } = useMasterData();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTemplates, setExpandedTemplates] = useState<number[]>([]);
  
  // Template modals
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<WorkflowTemplate | null>(null);
  
  // Status modals
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [editingStatusIndex, setEditingStatusIndex] = useState<number | null>(null);
  const [activeTemplateId, setActiveTemplateId] = useState<number | null>(null);
  
  const [successMessage, setSuccessMessage] = useState('');
  
  const [templateFormData, setTemplateFormData] = useState({
    name: '',
    description: '',
    statuses: [] as string[],
  });
  
  const [statusFormData, setStatusFormData] = useState({
    name: '',
  });

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const toggleTemplate = (id: number) => {
    setExpandedTemplates(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  // Template CRUD
  const handleOpenTemplateModal = (template?: WorkflowTemplate) => {
    if (template) {
      setEditingTemplate(template);
      setTemplateFormData({
        name: template.name,
        description: template.description,
        statuses: template.statuses,
      });
    } else {
      setEditingTemplate(null);
      setTemplateFormData({
        name: '',
        description: '',
        statuses: [],
      });
    }
    setIsTemplateModalOpen(true);
  };

  const handleCloseTemplateModal = () => {
    setIsTemplateModalOpen(false);
    setEditingTemplate(null);
    setTemplateFormData({ name: '', description: '', statuses: [] });
  };

  const handleSubmitTemplate = () => {
    if (!templateFormData.name.trim()) {
      alert('Template name is required');
      return;
    }
    
    if (editingTemplate) {
      updateWorkflowTemplate(editingTemplate.id, {
        name: templateFormData.name,
        description: templateFormData.description,
        statuses: templateFormData.statuses,
      });
      showSuccess('Template updated!');
    } else {
      addWorkflowTemplate({
        name: templateFormData.name,
        description: templateFormData.description,
        statuses: templateFormData.statuses,
      });
      showSuccess('Template created!');
    }
    handleCloseTemplateModal();
  };

  const handleDeleteTemplate = (id: number) => {
    if (confirm('Delete this template and all its statuses?')) {
      deleteWorkflowTemplate(id);
      showSuccess('Template deleted!');
    }
  };

  // Status CRUD
  const handleOpenStatusModal = (templateId: number, statusIndex?: number) => {
    setActiveTemplateId(templateId);
    if (statusIndex !== undefined) {
      setEditingStatusIndex(statusIndex);
      setStatusFormData({
        name: workflowTemplates.find(t => t.id === templateId)?.statuses[statusIndex] || '',
      });
    } else {
      setEditingStatusIndex(null);
      setStatusFormData({
        name: '',
      });
    }
    setIsStatusModalOpen(true);
  };

  const handleCloseStatusModal = () => {
    setIsStatusModalOpen(false);
    setEditingStatusIndex(null);
    setActiveTemplateId(null);
    setStatusFormData({ name: '' });
  };

  const handleSubmitStatus = () => {
    if (!statusFormData.name.trim() || !activeTemplateId) return;
    
    const template = workflowTemplates.find(t => t.id === activeTemplateId);
    if (!template) return;
    
    if (editingStatusIndex !== null) {
      const newStatuses = [...template.statuses];
      newStatuses[editingStatusIndex] = statusFormData.name;
      updateWorkflowTemplate(activeTemplateId, {
        ...template,
        statuses: newStatuses,
      });
      showSuccess('Status updated!');
    } else {
      addWorkflowTemplate({
        ...template,
        statuses: [...template.statuses, statusFormData.name],
      });
      showSuccess('Status added!');
    }
    handleCloseStatusModal();
  };

  const handleDeleteStatus = (templateId: number, statusIndex: number) => {
    if (confirm('Delete this status?')) {
      const template = workflowTemplates.find(t => t.id === templateId);
      if (!template) return;
      
      const newStatuses = [...template.statuses];
      newStatuses.splice(statusIndex, 1);
      updateWorkflowTemplate(templateId, {
        ...template,
        statuses: newStatuses,
      });
      showSuccess('Status deleted!');
    }
  };

  const filteredTemplates = workflowTemplates.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
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
        <h1 className="vybe-page-title">
          Workflow / Case Templates
        </h1>
        <p className="vybe-page-subtitle">
          Create workflow templates and define custom case progress statuses.
        </p>
      </div>

      <div className="vybe-page-header-row mb-6">
        <div className="vybe-kpi-card min-w-[200px]">
          <div className="vybe-kpi-label">TOTAL TEMPLATES</div>
          <div className="vybe-kpi-value">{workflowTemplates.length}</div>
        </div>
        <button
          onClick={() => handleOpenTemplateModal()}
          className="h-[var(--button-height-desktop)] px-[var(--space-5)] bg-primary hover:opacity-90 text-primary-foreground rounded-[var(--radius-button)] text-small font-medium transition-colors flex items-center gap-[var(--space-2)] shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Template
        </button>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="vybe-search w-full pl-10"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="vybe-card-padded overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <button
                    onClick={() => toggleTemplate(template.id)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    {expandedTemplates.includes(template.id) ? (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>

                  <div className="p-3 bg-purple-500/10 rounded-[12px]">
                    <GitBranch className="w-5 h-5 text-purple-500" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-small font-medium text-foreground mb-1">
                      {template.name}
                    </h3>
                    <p className="text-small text-muted-foreground mb-2">
                      {template.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="vybe-badge vybe-badge-green">
                        {template.statuses.length} {template.statuses.length === 1 ? 'Status' : 'Statuses'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenStatusModal(template.id)}
                    className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-[8px] text-[13px] font-medium transition-all flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Status
                  </button>
                  <button
                    onClick={() => handleOpenTemplateModal(template)}
                    className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-black/40 dark:text-white/40" />
                  </button>
                  <button
                    onClick={() => handleDeleteTemplate(template.id)}
                    className="p-2 hover:bg-red-500/10 rounded-lg transition-colors group"
                  >
                    <Trash2 className="w-4 h-4 text-black/40 dark:text-white/40 group-hover:text-red-500" />
                  </button>
                </div>
              </div>
            </div>

            {/* Statuses List */}
            {expandedTemplates.includes(template.id) && template.statuses.length > 0 && (
              <div className="border-t border-border bg-muted">
                <div className="p-6 space-y-3">
                  {template.statuses
                    .map((status, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-4 bg-card rounded-[var(--radius)] hover:bg-card/80 transition-colors"
                      >
                        <div className="p-1 cursor-move">
                          <GripVertical className="w-4 h-4 text-muted-foreground" />
                        </div>

                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: colorOptions.find(c => c.name === status)?.value || '#28FF6E' }}
                        />

                        <div className="flex-1">
                          <h4 className="text-small font-medium text-foreground mb-0.5">
                            {status}
                          </h4>
                          <p className="text-small text-muted-foreground">
                            Description for {status}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenStatusModal(template.id, index)}
                            className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-black/40 dark:text-white/40" />
                          </button>
                          <button
                            onClick={() => handleDeleteStatus(template.id, index)}
                            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors group"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-black/40 dark:text-white/40 group-hover:text-red-500" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Template Modal */}
      {isTemplateModalOpen && (
        <div className="vybe-modal-overlay">
          <div className="vybe-modal">
            <div className="vybe-modal-header">
              <h2 className="text-[20px] font-semibold text-foreground">
                {editingTemplate ? 'Edit Template' : 'Add Template'}
              </h2>
              <button
                onClick={handleCloseTemplateModal}
                className="vybe-icon-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="vybe-label">
                  Template Name *
                </label>
                <input
                  type="text"
                  value={templateFormData.name}
                  onChange={(e) => setTemplateFormData({ ...templateFormData, name: e.target.value })}
                  className="vybe-input w-full"
                  placeholder="e.g., Standard Legal Workflow"
                />
              </div>

              <div>
                <label className="vybe-label">
                  Description *
                </label>
                <textarea
                  value={templateFormData.description}
                  onChange={(e) => setTemplateFormData({ ...templateFormData, description: e.target.value })}
                  className="vybe-textarea w-full resize-none"
                  rows={3}
                  placeholder="Describe when to use this workflow"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={handleCloseTemplateModal}
                className="flex-1 px-4 py-2.5 bg-muted hover:bg-black/10 dark:hover:bg-white/10 text-foreground rounded-[var(--radius)] text-small font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitTemplate}
                className="flex-1 h-[var(--button-height-desktop)] px-4 bg-primary hover:opacity-90 text-primary-foreground rounded-[var(--radius)] text-small font-medium transition-colors shadow-sm"
              >
                {editingTemplate ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Modal */}
      {isStatusModalOpen && (
        <div className="vybe-modal-overlay">
          <div className="vybe-modal">
            <div className="vybe-modal-header">
              <h2 className="text-[20px] font-semibold text-foreground">
                {editingStatusIndex !== null ? 'Edit Status' : 'Add Status'}
              </h2>
              <button
                onClick={handleCloseStatusModal}
                className="vybe-icon-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="vybe-label">
                  Status Name *
                </label>
                <input
                  type="text"
                  value={statusFormData.name}
                  onChange={(e) => setStatusFormData({ ...statusFormData, name: e.target.value })}
                  className="vybe-input w-full"
                  placeholder="e.g., In Progress"
                />
              </div>

              <div>
                <label className="vybe-label">
                  Description *
                </label>
                <textarea
                  value={statusFormData.name}
                  onChange={(e) => setStatusFormData({ ...statusFormData, name: e.target.value })}
                  className="vybe-textarea w-full resize-none"
                  rows={3}
                  placeholder="Describe when this status applies"
                />
              </div>

              <div>
                <label className="vybe-label">
                  Status Color *
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setStatusFormData({ ...statusFormData, name: color.name })}
                      className={`p-3 rounded-[var(--radius)] transition-all ${
                        statusFormData.name === color.name
                          ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900'
                          : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={handleCloseStatusModal}
                className="flex-1 px-4 py-2.5 bg-muted hover:bg-black/10 dark:hover:bg-white/10 text-foreground rounded-[var(--radius)] text-small font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitStatus}
                className="flex-1 h-[var(--button-height-desktop)] px-4 bg-primary hover:opacity-90 text-primary-foreground rounded-[var(--radius)] text-small font-medium transition-colors shadow-sm"
              >
                {editingStatusIndex !== null ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}