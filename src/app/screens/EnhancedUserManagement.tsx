import { useState } from 'react';
import { Search, Plus, Edit2, Trash2, X, CheckCircle, Upload, FileText, Power } from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { useMasterData } from '../contexts/MasterDataContext';
import { MOCK_SERVICE_PROVIDERS } from '../data/mockServiceProviders';

interface ExecutionPartner {
  id: number;
  partnerType: 'Company' | 'Individual';
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  cityCoverage: string[];
  role: string;
  maxCaseload: number;
  turnAroundSLA: string;
  isEnabled: boolean;
  commercialSetup: {
    defaultPricing: string;
    commissionModel: string;
    revenueShare: string;
    payoutTerms: string;
  };
  documents: {
    gstPan?: string;
    agreements?: string;
    bankDetails?: string;
    licenses?: string;
  };
}

const commercialOptions = {
  defaultPricing: ['Fixed Fee', 'Hourly Rate', 'Project Based', 'Retainer'],
  commissionModel: ['Percentage Based', 'Flat Fee', 'Tiered Commission', 'Hybrid'],
  revenueShare: ['50-50', '60-40', '70-30', '80-20', 'Custom'],
  payoutTerms: ['Net 30', 'Net 45', 'Net 60', 'Upon Completion', 'Milestone Based'],
};

export function EnhancedUserManagement() {
  const { partnerRoles } = useMasterData();
  
  const [partners, setPartners] = useState<ExecutionPartner[]>(MOCK_SERVICE_PROVIDERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [newCity, setNewCity] = useState('');

  const [formData, setFormData] = useState<Partial<ExecutionPartner>>({
    partnerType: 'Individual',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    cityCoverage: [],
    role: '',
    maxCaseload: 10,
    turnAroundSLA: '',
    isEnabled: true,
    commercialSetup: {
      defaultPricing: '',
      commissionModel: '',
      revenueShare: '',
      payoutTerms: '',
    },
    documents: {},
  });

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleAddCity = () => {
    if (newCity.trim() && formData.cityCoverage && !formData.cityCoverage.includes(newCity.trim())) {
      setFormData({
        ...formData,
        cityCoverage: [...formData.cityCoverage, newCity.trim()],
      });
      setNewCity('');
    }
  };

  const handleRemoveCity = (city: string) => {
    setFormData({
      ...formData,
      cityCoverage: formData.cityCoverage?.filter(c => c !== city),
    });
  };

  const handleFileUpload = (docType: keyof ExecutionPartner['documents'], event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        documents: {
          ...formData.documents,
          [docType]: file.name,
        },
      });
      showSuccess(`${file.name} uploaded!`);
    }
  };

  const handleSubmit = () => {
    const newPartner: ExecutionPartner = {
      id: Date.now(),
      partnerType: formData.partnerType!,
      firstName: formData.firstName!,
      lastName: formData.lastName!,
      phone: formData.phone!,
      email: formData.email!,
      cityCoverage: formData.cityCoverage!,
      role: formData.role!,
      maxCaseload: formData.maxCaseload!,
      turnAroundSLA: formData.turnAroundSLA!,
      isEnabled: formData.isEnabled!,
      commercialSetup: formData.commercialSetup!,
      documents: formData.documents!,
    };

    setPartners([...partners, newPartner]);
    setIsModalOpen(false);
    setFormData({
      partnerType: 'Individual',
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      cityCoverage: [],
      role: '',
      maxCaseload: 10,
      turnAroundSLA: '',
      isEnabled: true,
      commercialSetup: {
        defaultPricing: '',
        commissionModel: '',
        revenueShare: '',
        payoutTerms: '',
      },
      documents: {},
    });
    showSuccess('Execution Partner added!');
  };

  const handleDelete = (id: number) => {
    if (confirm('Delete this partner?')) {
      setPartners(partners.filter(p => p.id !== id));
      showSuccess('Partner deleted!');
    }
  };

  const handleToggleStatus = (id: number) => {
    setPartners(partners.map(p => 
      p.id === id ? { ...p, isEnabled: !p.isEnabled } : p
    ));
    const partner = partners.find(p => p.id === id);
    showSuccess(`Service Provider ${partner?.isEnabled ? 'disabled' : 'enabled'}!`);
  };

  const filteredPartners = partners.filter(p =>
    p.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      {successMessage && (
        <div className="fixed top-24 right-8 z-50 bg-primary-700 text-neutral-0 px-6 py-3 rounded-[var(--radius-card)] shadow-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span className="text-small font-medium">{successMessage}</span>
        </div>
      )}

      <div className="vybe-page-header">
        <h1 className="vybe-page-title mb-[var(--space-1)]">Service Provider Management</h1>
        <p className="vybe-page-subtitle">Manage service providers and their details.</p>
      </div>

      <div className="flex items-start justify-between gap-[var(--space-4)] mb-[var(--space-6)]">
        <div className="grid grid-cols-3 gap-[var(--space-4)] flex-1">
          {[
            { label: 'Total Providers', value: partners.length,                                      valueStyle: { color: 'var(--foreground)' } },
            { label: 'Enabled',         value: partners.filter(p => p.isEnabled).length,             valueStyle: { color: '#1C75BC' } },
            { label: 'Disabled',        value: partners.filter(p => !p.isEnabled).length,            valueStyle: { color: 'var(--muted-foreground)' } },
          ].map(({ label, value, valueStyle }) => (
            <div key={label} className="vybe-kpi-card">
              <div className="vybe-kpi-label">{label}</div>
              <div className="vybe-kpi-value" style={valueStyle}>{value}</div>
            </div>
          ))}
        </div>
        <button onClick={() => setIsModalOpen(true)} className="vybe-btn-primary shrink-0">
          <Plus className="w-4 h-4" />
          Add Service Provider
        </button>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search partners..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="vybe-search" />
        </div>
      </div>

      <div className="vybe-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="vybe-table-head">Provider / Type</th>
              <th className="vybe-table-head">Contact</th>
              <th className="vybe-table-head">Category / Coverage</th>
              <th className="vybe-table-head">Caseload / TAT</th>
              <th className="vybe-table-head">Status</th>
              <th className="vybe-table-head">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPartners.map((partner) => (
              <tr key={partner.id} className="border-b border-border transition-colors last:border-0 hover:bg-[var(--accent)]">
                {/* Provider / Type */}
                <td className="px-6 py-4">
                  <div className="text-small font-medium text-foreground">{partner.firstName} {partner.lastName}</div>
                  <div className="text-caption text-muted-foreground mt-0.5">{partner.partnerType}</div>
                </td>
                {/* Contact */}
                <td className="px-6 py-4">
                  <div className="text-small text-foreground">{partner.email}</div>
                  <div className="text-caption text-muted-foreground mt-0.5">{partner.phone}</div>
                </td>
                {/* Category / Coverage */}
                <td className="px-6 py-4">
                  <div className="text-small text-foreground mb-1">{partner.role}</div>
                  <div className="flex flex-wrap gap-1">
                    {partner.cityCoverage.slice(0, 2).map((city, idx) => (
                      <span key={idx} className="vybe-badge vybe-badge-blue">{city}</span>
                    ))}
                    {partner.cityCoverage.length > 2 && (
                      <span className="vybe-badge vybe-badge-muted">+{partner.cityCoverage.length - 2}</span>
                    )}
                  </div>
                </td>
                {/* Caseload / TAT */}
                <td className="px-6 py-4">
                  <div className="text-small text-foreground">{partner.maxCaseload} cases</div>
                  <div className="text-caption text-muted-foreground mt-0.5">{partner.turnAroundSLA}</div>
                </td>
                {/* Status */}
                <td className="px-6 py-4">
                  <span className={`vybe-badge ${partner.isEnabled ? 'vybe-badge-green' : 'vybe-badge-muted'}`}>
                    {partner.isEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </td>
                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="vybe-icon-btn">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(partner.id)} className="vybe-icon-btn hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleToggleStatus(partner.id)} className="vybe-icon-btn">
                      <Power className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Partner Modal */}
      {isModalOpen && (
        <div className="vybe-modal-overlay">
          <div className="vybe-modal vybe-modal-wide" style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Sticky header */}
            <div className="vybe-modal-header shrink-0" style={{ padding: 'var(--card-padding-desktop)', borderBottom: '1px solid var(--border)', marginBottom: 0 }}>
              <h2 className="text-h3 font-medium text-foreground">Add Service Provider</h2>
              <button onClick={() => setIsModalOpen(false)} className="vybe-icon-btn">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto flex-1" style={{ padding: 'var(--card-padding-desktop)' }}>
            <div className="space-y-6">
              {/* Partner Type */}
              <div>
                <label className="vybe-label">Partner Type *</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="Company" checked={formData.partnerType === 'Company'} onChange={(e) => setFormData({ ...formData, partnerType: e.target.value as any })}
                      className="w-4 h-4 text-primary-700 focus:ring-primary-700" />
                    <span className="text-small text-foreground">Company</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="Individual" checked={formData.partnerType === 'Individual'} onChange={(e) => setFormData({ ...formData, partnerType: e.target.value as any })}
                      className="w-4 h-4 text-primary-700 focus:ring-primary-700" />
                    <span className="text-small text-foreground">Individual</span>
                  </label>
                </div>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="vybe-label">First Name *</label>
                  <input type="text" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="vybe-input" />
                </div>
                <div>
                  <label className="vybe-label">Last Name *</label>
                  <input type="text" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="vybe-input" />
                </div>
              </div>

              {/* Contact Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="vybe-label">Phone *</label>
                  <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="vybe-input" placeholder="+91 9876543210" />
                </div>
                <div>
                  <label className="vybe-label">Email *</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="vybe-input" />
                </div>
              </div>

              {/* City Coverage */}
              <div>
                <label className="vybe-label">City Coverage *</label>
                <div className="flex gap-2 mb-2">
                  <input type="text" value={newCity} onChange={(e) => setNewCity(e.target.value)}
                    className="flex-1 vybe-input" placeholder="Add city" />
                  <button onClick={handleAddCity} className="px-4 h-[var(--input-height)] bg-primary-700/10 hover:bg-primary-700/20 text-primary-700 rounded-[var(--radius)] text-small font-medium transition-colors">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.cityCoverage?.map((city, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-700 text-neutral-0 rounded-[var(--radius)] text-small font-medium">
                      {city}
                      <button onClick={() => handleRemoveCity(city)} className="hover:bg-card/20 rounded-full p-0.5 transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Role and Capacity */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="vybe-label">Service Provider Category *</label>
                  <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="vybe-input">
                    <option value="">Select Category</option>
                    {partnerRoles.map(role => (
                      <option key={role.id} value={role.name}>{role.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="vybe-label">Max Caseload *</label>
                  <input type="number" value={formData.maxCaseload} onChange={(e) => setFormData({ ...formData, maxCaseload: parseInt(e.target.value) })}
                    className="vybe-input" />
                </div>
              </div>

              {/* Turn Around SLA */}
              <div>
                <label className="vybe-label">Turnaround Time (TAT) *</label>
                <input type="text" value={formData.turnAroundSLA} onChange={(e) => setFormData({ ...formData, turnAroundSLA: e.target.value })}
                  className="vybe-input" placeholder="e.g., 5 business days" />
              </div>

              {/* Documents - Working File Uploads */}
              <div className="space-y-3 p-4 bg-muted rounded-[var(--radius)] border border-border">
                <h3 className="text-small font-medium text-foreground mb-3">Documents</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: 'gstPan' as const, label: 'GST/PAN' },
                    { key: 'agreements' as const, label: 'Agreements' },
                    { key: 'bankDetails' as const, label: 'Bank Details' },
                    { key: 'licenses' as const, label: 'Licenses' },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center gap-3 p-3 bg-card rounded-[var(--radius)] border border-border">
                      <FileText className="w-4 h-4 text-purple-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-caption text-muted-foreground">{label}</p>
                        {formData.documents?.[key] && (
                          <p className="text-caption text-primary-700 truncate">{formData.documents[key]}</p>
                        )}
                      </div>
                      <label className="p-1.5 bg-primary-700/10 hover:bg-primary-700/20 rounded-[var(--radius)] transition-colors cursor-pointer">
                        <Upload className="w-3.5 h-3.5 text-primary-700" />
                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(key, e)} accept=".pdf,.jpg,.jpeg,.png" />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            </div>{/* end scrollable body */}

            <div className="flex items-center gap-3 shrink-0" style={{ padding: 'var(--card-padding-desktop)', borderTop: '1px solid var(--border)' }}>
              <button onClick={() => setIsModalOpen(false)} className="flex-1 px-4 h-[var(--button-height-desktop)] bg-muted hover:bg-neutral-900/10 dark:hover:bg-card/10 text-foreground rounded-[var(--radius)] text-small font-medium transition-colors">Cancel</button>
              <button onClick={handleSubmit} className="flex-1 px-4 h-[var(--button-height-desktop)] bg-primary hover:opacity-90 text-primary-foreground rounded-[var(--radius)] text-small font-medium transition-colors shadow-sm">Add Partner</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
