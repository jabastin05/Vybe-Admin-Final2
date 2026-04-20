import { useState } from 'react';
import { Search, Plus, Edit2, Trash2, X, CheckCircle, Settings as SettingsIcon, Power, PowerOff } from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { useMasterData } from '../contexts/MasterDataContext';

interface ServiceConfig {
  id: number;
  name: string;
  description: string;
  serviceCategory: string;
  applicableBuilding: string[];
  propertyTypes: string[];
  geographyApplicability: string[];
  pricingModel: 'fixed' | 'variable' | 'starting-from' | 'quote-based';
  pricingAmount?: string;
  expectedTAT: string;
  requiredDocumentsAndInputs: string[];
  outputArtifacts: ('PDF report' | 'Checklist' | 'Advisory note' | 'Feasibility sheet')[];
  assignedPartnerRole: string;
  linkedWorkflowTemplate: string;
  enabled: boolean;
}

const mockServices: ServiceConfig[] = [
  {
    id: 1,
    name: 'Property Tax Filing',
    description: 'Complete property tax filing and compliance service',
    serviceCategory: 'Legal Services',
    applicableBuilding: ['Residential', 'Commercial'],
    propertyTypes: ['Apartment', 'Villa', 'Office'],
    geographyApplicability: ['Bangalore', 'Mumbai', 'Delhi'],
    pricingModel: 'fixed',
    pricingAmount: '₹25,000',
    expectedTAT: '5 business days',
    requiredDocumentsAndInputs: ['Property Deed', 'Previous Tax Receipts', 'Owner ID Proof'],
    outputArtifacts: ['PDF report', 'Checklist'],
    assignedPartnerRole: 'Legal Advisor',
    linkedWorkflowTemplate: 'Standard Legal Workflow',
    enabled: true,
  },
];

export function EnhancedServiceConfiguration() {
  const { serviceCategories, partnerRoles, workflowTemplates } = useMasterData();
  const [services, setServices] = useState<ServiceConfig[]>(mockServices);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceConfig | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState<Partial<ServiceConfig>>({
    name: '',
    description: '',
    serviceCategory: '',
    applicableBuilding: [],
    propertyTypes: [],
    geographyApplicability: [],
    pricingModel: 'fixed',
    pricingAmount: '',
    expectedTAT: '',
    requiredDocumentsAndInputs: [],
    outputArtifacts: [],
    assignedPartnerRole: '',
    linkedWorkflowTemplate: '',
    enabled: true,
  });

  const [newItem, setNewItem] = useState('');
  const [newGeoItem, setNewGeoItem] = useState('');
  const [newDocItem, setNewDocItem] = useState('');

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleOpenModal = (service?: ServiceConfig) => {
    if (service) {
      setEditingService(service);
      setFormData(service);
    } else {
      setEditingService(null);
      setFormData({
        name: '',
        description: '',
        serviceCategory: '',
        applicableBuilding: [],
        propertyTypes: [],
        geographyApplicability: [],
        pricingModel: 'fixed',
        pricingAmount: '',
        expectedTAT: '',
        requiredDocumentsAndInputs: [],
        outputArtifacts: [],
        assignedPartnerRole: '',
        linkedWorkflowTemplate: '',
        enabled: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
  };

  const handleSubmit = () => {
    if (editingService) {
      setServices(services.map(s => s.id === editingService.id ? { ...formData, id: editingService.id } as ServiceConfig : s));
      showSuccess('Service updated!');
    } else {
      setServices([...services, { ...formData, id: Date.now() } as ServiceConfig]);
      showSuccess('Service created!');
    }
    handleCloseModal();
  };

  const handleToggleEnabled = (id: number) => {
    setServices(services.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
    const service = services.find(s => s.id === id);
    showSuccess(`Service ${service?.enabled ? 'disabled' : 'enabled'}!`);
  };

  const handleDelete = (id: number) => {
    if (confirm('Delete this service?')) {
      setServices(services.filter(s => s.id !== id));
      showSuccess('Service deleted!');
    }
  };

  const addBuildingType = () => {
    if (newItem.trim() && !formData.applicableBuilding?.includes(newItem.trim())) {
      setFormData({ ...formData, applicableBuilding: [...(formData.applicableBuilding || []), newItem.trim()] });
      setNewItem('');
    }
  };

  const addPropertyType = () => {
    if (newItem.trim() && !formData.propertyTypes?.includes(newItem.trim())) {
      setFormData({ ...formData, propertyTypes: [...(formData.propertyTypes || []), newItem.trim()] });
      setNewItem('');
    }
  };

  const addGeography = () => {
    if (newGeoItem.trim() && !formData.geographyApplicability?.includes(newGeoItem.trim())) {
      setFormData({ ...formData, geographyApplicability: [...(formData.geographyApplicability || []), newGeoItem.trim()] });
      setNewGeoItem('');
    }
  };

  const addDocument = () => {
    if (newDocItem.trim() && !formData.requiredDocumentsAndInputs?.includes(newDocItem.trim())) {
      setFormData({ ...formData, requiredDocumentsAndInputs: [...(formData.requiredDocumentsAndInputs || []), newDocItem.trim()] });
      setNewDocItem('');
    }
  };

  const toggleOutputArtifact = (artifact: ServiceConfig['outputArtifacts'][0]) => {
    const current = formData.outputArtifacts || [];
    if (current.includes(artifact)) {
      setFormData({ ...formData, outputArtifacts: current.filter(a => a !== artifact) });
    } else {
      setFormData({ ...formData, outputArtifacts: [...current, artifact] });
    }
  };

  const filteredServices = services.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description.toLowerCase().includes(searchQuery.toLowerCase())
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
        <h1 className="vybe-page-title">Service Configuration</h1>
        <p className="vybe-page-subtitle">Configure and manage services with detailed settings.</p>
      </div>

      <div className="vybe-page-header-row mb-6">
        <div className="flex gap-4">
          <div className="vybe-kpi-card min-w-[200px]">
            <div className="vybe-kpi-label">TOTAL SERVICES</div>
            <div className="vybe-kpi-value">{services.length}</div>
          </div>
          <div className="vybe-kpi-card min-w-[200px]">
            <div className="vybe-kpi-label">ENABLED</div>
            <div className="vybe-kpi-value" style={{ color: '#10B981' }}>{services.filter(s => s.enabled).length}</div>
          </div>
        </div>
        <button onClick={() => handleOpenModal()} className="h-[var(--button-height-desktop)] px-[var(--space-5)] bg-primary hover:opacity-90 text-primary-foreground rounded-[var(--radius-button)] text-small font-medium transition-colors flex items-center gap-[var(--space-2)] shadow-sm">
          <Plus className="w-4 h-4" />
          Add Service
        </button>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search services..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="vybe-search w-full pl-10" />
        </div>
      </div>

      <div className="space-y-4">
        {filteredServices.map((service) => (
          <div key={service.id} className="vybe-card-padded">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4 flex-1">
                <div className={`p-3 rounded-[12px] ${service.enabled ? 'bg-emerald-500/10' : 'bg-muted'}`}>
                  <SettingsIcon className={`w-5 h-5 ${service.enabled ? 'text-emerald-500' : 'text-muted-foreground'}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-small font-medium text-foreground">{service.name}</h3>
                    <span className={`vybe-badge ${service.enabled ? 'vybe-badge-green' : 'vybe-badge-muted'}`}>
                      {service.enabled ? 'ENABLED' : 'DISABLED'}
                    </span>
                  </div>
                  <p className="text-small text-muted-foreground mb-4">{service.description}</p>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-caption font-bold tracking-[0.05em] text-muted-foreground uppercase mb-1">Category</p>
                      <p className="text-small text-foreground">{service.serviceCategory}</p>
                    </div>
                    <div>
                      <p className="text-caption font-bold tracking-[0.05em] text-muted-foreground uppercase mb-1">Pricing</p>
                      <p className="text-small text-foreground">{service.pricingModel} {service.pricingAmount && `(${service.pricingAmount})`}</p>
                    </div>
                    <div>
                      <p className="text-caption font-bold tracking-[0.05em] text-muted-foreground uppercase mb-1">TAT</p>
                      <p className="text-small text-foreground">{service.expectedTAT}</p>
                    </div>
                    <div>
                      <p className="text-caption font-bold tracking-[0.05em] text-muted-foreground uppercase mb-1">Partner Role</p>
                      <p className="text-small text-foreground">{service.assignedPartnerRole}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {service.geographyApplicability.slice(0, 3).map((city, idx) => (
                      <span key={idx} className="vybe-badge vybe-badge-blue">{city}</span>
                    ))}
                    {service.geographyApplicability.length > 3 && (
                      <span className="vybe-badge vybe-badge-muted">+{service.geographyApplicability.length - 3}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => handleToggleEnabled(service.id)} className={`p-2 rounded-lg transition-colors ${service.enabled ? 'bg-emerald-500/10 hover:bg-emerald-500/20' : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10'}`}>
                  {service.enabled ? <Power className="w-4 h-4 text-emerald-500" /> : <PowerOff className="w-4 h-4 text-black/40 dark:text-white/40" />}
                </button>
                <button onClick={() => handleOpenModal(service)} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors">
                  <Edit2 className="w-4 h-4 text-black/40 dark:text-white/40" />
                </button>
                <button onClick={() => handleDelete(service.id)} className="p-2 hover:bg-red-500/10 rounded-lg transition-colors group">
                  <Trash2 className="w-4 h-4 text-black/40 dark:text-white/40 group-hover:text-red-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="vybe-modal-overlay">
          <div className="vybe-modal vybe-modal-xl" style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Sticky header */}
            <div className="vybe-modal-header shrink-0" style={{ padding: 'var(--card-padding-desktop)', borderBottom: '1px solid var(--border)', marginBottom: 0 }}>
              <h2 className="text-[20px] font-semibold text-foreground">{editingService ? 'Edit Service' : 'Add Service'}</h2>
              <button onClick={handleCloseModal} className="vybe-icon-btn">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto flex-1" style={{ padding: 'var(--card-padding-desktop)' }}>
            <div className="space-y-6">
              {/* 1. Name */}
              <div>
                <label className="vybe-label">Name *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="vybe-input w-full" />
              </div>

              {/* 2. Description */}
              <div>
                <label className="vybe-label">Description *</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="vybe-textarea w-full resize-none" rows={3} />
              </div>

              {/* 3. Service Category - DROPDOWN */}
              <div>
                <label className="vybe-label">Service Category *</label>
                <select value={formData.serviceCategory} onChange={(e) => setFormData({ ...formData, serviceCategory: e.target.value })}
                  className="vybe-input w-full">
                  <option value="">Select Category</option>
                  {serviceCategories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* 4. Applicable Building */}
              <div>
                <label className="vybe-label">Applicable Building Types</label>
                <div className="flex gap-2 mb-2">
                  <input type="text" value={newItem} onChange={(e) => setNewItem(e.target.value)}
                    className="vybe-input flex-1" placeholder="Add building type" />
                  <button onClick={addBuildingType} className="vybe-btn-primary text-emerald-500">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.applicableBuilding?.map((item, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-500 text-white rounded-[8px] text-[13px] font-medium">
                      {item}
                      <button onClick={() => setFormData({ ...formData, applicableBuilding: formData.applicableBuilding?.filter(i => i !== item) })} className="hover:bg-white/20 rounded-full p-0.5 transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* 5. Property Types */}
              <div>
                <label className="vybe-label">Property Types</label>
                <div className="flex gap-2 mb-2">
                  <input type="text" value={newItem} onChange={(e) => setNewItem(e.target.value)}
                    className="vybe-input flex-1" placeholder="Add property type" />
                  <button onClick={addPropertyType} className="vybe-btn-primary text-emerald-500">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.propertyTypes?.map((item, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded-[8px] text-[13px] font-medium">
                      {item}
                      <button onClick={() => setFormData({ ...formData, propertyTypes: formData.propertyTypes?.filter(i => i !== item) })} className="hover:bg-white/20 rounded-full p-0.5 transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* 6. Geography */}
              <div>
                <label className="vybe-label">Geography Applicability</label>
                <div className="flex gap-2 mb-2">
                  <input type="text" value={newGeoItem} onChange={(e) => setNewGeoItem(e.target.value)}
                    className="vybe-input flex-1" placeholder="Add city" />
                  <button onClick={addGeography} className="vybe-btn-primary text-emerald-500">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.geographyApplicability?.map((city, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white rounded-[8px] text-[13px] font-medium">
                      {city}
                      <button onClick={() => setFormData({ ...formData, geographyApplicability: formData.geographyApplicability?.filter(c => c !== city) })} className="hover:bg-white/20 rounded-full p-0.5 transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* 7. Pricing Model */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="vybe-label">Pricing Model *</label>
                  <select value={formData.pricingModel} onChange={(e) => setFormData({ ...formData, pricingModel: e.target.value as any })}
                    className="vybe-input w-full">
                    <option value="fixed">Fixed</option>
                    <option value="variable">Variable</option>
                    <option value="starting-from">Starting From</option>
                    <option value="quote-based">Quote Based</option>
                  </select>
                </div>
                <div>
                  <label className="vybe-label">Pricing Amount</label>
                  <input type="text" value={formData.pricingAmount} onChange={(e) => setFormData({ ...formData, pricingAmount: e.target.value })}
                    className="vybe-input w-full" placeholder="e.g., ₹25,000" />
                </div>
              </div>

              {/* 8. Expected TAT */}
              <div>
                <label className="vybe-label">Expected TAT *</label>
                <input type="text" value={formData.expectedTAT} onChange={(e) => setFormData({ ...formData, expectedTAT: e.target.value })}
                  className="vybe-input w-full" placeholder="e.g., 5 business days" />
              </div>

              {/* 9. Required Documents */}
              <div>
                <label className="vybe-label">Required Documents and Inputs</label>
                <div className="flex gap-2 mb-2">
                  <input type="text" value={newDocItem} onChange={(e) => setNewDocItem(e.target.value)}
                    className="vybe-input flex-1" placeholder="Add document" />
                  <button onClick={addDocument} className="vybe-btn-primary text-emerald-500">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.requiredDocumentsAndInputs?.map((doc, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 text-white rounded-[8px] text-[13px] font-medium">
                      {doc}
                      <button onClick={() => setFormData({ ...formData, requiredDocumentsAndInputs: formData.requiredDocumentsAndInputs?.filter(d => d !== doc) })} className="hover:bg-white/20 rounded-full p-0.5 transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* 10. Output Artifacts */}
              <div>
                <label className="vybe-label">Output Artifacts</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['PDF report', 'Checklist', 'Advisory note', 'Feasibility sheet'] as const).map((artifact) => (
                    <label key={artifact} className="flex items-center gap-2 cursor-pointer p-3 bg-muted rounded-[var(--radius)] border border-border hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors">
                      <input type="checkbox" checked={formData.outputArtifacts?.includes(artifact)} onChange={() => toggleOutputArtifact(artifact)}
                        className="w-4 h-4 rounded border-border text-emerald-500 focus:ring-emerald-500" />
                      <span className="text-small text-foreground">{artifact}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 11. Assigned Partner Role - DROPDOWN */}
              <div>
                <label className="vybe-label">Assigned Partner Role *</label>
                <select value={formData.assignedPartnerRole} onChange={(e) => setFormData({ ...formData, assignedPartnerRole: e.target.value })}
                  className="vybe-input w-full">
                  <option value="">Select Partner Role</option>
                  {partnerRoles.map(role => (
                    <option key={role.id} value={role.name}>{role.name}</option>
                  ))}
                </select>
              </div>

              {/* 12. Linked Workflow Template - DROPDOWN */}
              <div>
                <label className="vybe-label">Linked Workflow Template *</label>
                <select value={formData.linkedWorkflowTemplate} onChange={(e) => setFormData({ ...formData, linkedWorkflowTemplate: e.target.value })}
                  className="vybe-input w-full">
                  <option value="">Select Workflow Template</option>
                  {workflowTemplates.map(template => (
                    <option key={template.id} value={template.name}>{template.name}</option>
                  ))}
                </select>
              </div>
            </div>
            </div>{/* end scrollable body */}

            {/* Sticky footer */}
            <div className="flex items-center gap-3 shrink-0" style={{ padding: 'var(--card-padding-desktop)', borderTop: '1px solid var(--border)' }}>
              <button onClick={handleCloseModal} className="flex-1 px-4 py-2.5 bg-muted hover:bg-black/10 dark:hover:bg-white/10 text-foreground rounded-[var(--radius)] text-small font-medium transition-colors">Cancel</button>
              <button onClick={handleSubmit} className="flex-1 h-[var(--button-height-desktop)] px-4 bg-primary hover:opacity-90 text-primary-foreground rounded-[var(--radius)] text-small font-medium transition-colors shadow-sm">{editingService ? 'Update' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}