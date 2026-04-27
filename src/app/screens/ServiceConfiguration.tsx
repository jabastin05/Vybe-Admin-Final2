import { useState } from 'react';
import { Search, Plus, Edit2, Trash2, X, CheckCircle, Settings, ChevronDown, ChevronRight, Upload, Minus } from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';

interface SubService {
  id: number;
  name: string;
  description: string;
  eta: string;
  priceRange: string;
  enabled: boolean;
  role?: 'legal-partner' | 'survey-technician' | 'architect-planning' | 'developer-jv' | 'channel-field' | 'documentation-compliance';
}

interface Service {
  id: number;
  name: string;
  description: string;
  whatYouGet: string[];
  enabled: boolean;
  subServices: SubService[];
}

const mockServices: Service[] = [
  {
    id: 1,
    name: 'Legal Services',
    description: 'Comprehensive legal support for property transactions',
    whatYouGet: ['Title verification & clearance', 'Legal documentation support', 'NOC processing', 'Compliance assistance'],
    enabled: true,
    subServices: [
      { id: 101, name: 'Title Verification', description: 'Complete title deed verification and clearance', eta: '1-2 weeks', priceRange: '₹50,000 - ₹1,00,000', role: 'legal-partner', enabled: true },
      { id: 102, name: 'Legal Documentation', description: 'Preparation of sale deed and related documents', eta: '1-2 weeks', priceRange: '₹75,000 - ₹1,50,000', role: 'legal-partner', enabled: true },
      { id: 103, name: 'NOC Processing', description: 'No Objection Certificate processing', eta: '1-2 weeks', priceRange: '₹25,000 - ₹50,000', role: 'legal-partner', enabled: true },
    ],
  },
  {
    id: 2,
    name: 'Survey & Technical',
    description: 'Professional land survey and technical assessments',
    whatYouGet: ['Topographical land survey', 'Soil analysis', 'Boundary demarcation', 'Technical reports'],
    enabled: true,
    subServices: [
      { id: 201, name: 'Land Survey', description: 'Detailed topographical land survey', eta: '1-2 weeks', priceRange: '₹35,000 - ₹70,000', role: 'survey-technician', enabled: true },
      { id: 202, name: 'Soil Testing', description: 'Comprehensive soil analysis', eta: '1-2 weeks', priceRange: '₹20,000 - ₹40,000', role: 'survey-technician', enabled: true },
      { id: 203, name: 'Boundary Marking', description: 'Physical boundary demarcation', eta: '1-2 weeks', priceRange: '₹15,000 - ₹30,000', role: 'survey-technician', enabled: true },
    ],
  },
  {
    id: 3,
    name: 'Architecture & Planning',
    description: 'Design and architectural planning services',
    whatYouGet: ['Master site planning', 'Architectural design package', '3D photorealistic renders', 'Technical specifications'],
    enabled: true,
    subServices: [
      { id: 301, name: 'Site Planning', description: 'Master site layout and planning', eta: '1-2 weeks', priceRange: '₹1,50,000 - ₹3,00,000', role: 'architect-planning', enabled: true },
      { id: 302, name: 'Architectural Design', description: 'Complete architectural design package', eta: '1-2 weeks', priceRange: '₹3,00,000 - ₹6,00,000', role: 'architect-planning', enabled: true },
      { id: 303, name: '3D Visualization', description: 'Photorealistic 3D renders', eta: '1-2 weeks', priceRange: '₹80,000 - ₹1,60,000', role: 'architect-planning', enabled: true },
    ],
  },
  {
    id: 4,
    name: 'Development & JV',
    description: 'Joint venture and development partnership services',
    whatYouGet: ['JV structuring', 'Development management', 'Partnership advisory'],
    enabled: false,
    subServices: [
      { id: 401, name: 'JV Structuring', description: 'Joint venture agreement structuring', eta: '1-2 weeks', priceRange: '₹2,00,000 - ₹4,00,000', role: 'developer-jv', enabled: false },
      { id: 402, name: 'Development Management', description: 'End-to-end development management', eta: '1-2 weeks', priceRange: '₹5,00,000 - ₹10,00,000', role: 'developer-jv', enabled: false },
    ],
  },
];

export function ServiceConfiguration() {
  const [services, setServices] = useState<Service[]>(mockServices);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedServices, setExpandedServices] = useState<number[]>([1, 2, 3]);
  const [successMessage, setSuccessMessage] = useState('');

  const getRoleLabel = (role?: SubService['role']) => {
    if (!role) return null;
    const roleMap = {
      'legal-partner': 'Legal Partner',
      'survey-technician': 'Survey Technician',
      'architect-planning': 'Architect & Planning',
      'developer-jv': 'Developer & JV',
      'channel-field': 'Channel & Field',
      'documentation-compliance': 'Documentation & Compliance'
    };
    return roleMap[role] || role;
  };
  
  // Modals
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
  const [isEditServiceModalOpen, setIsEditServiceModalOpen] = useState(false);
  const [isAddSubServiceModalOpen, setIsAddSubServiceModalOpen] = useState(false);
  const [isEditSubServiceModalOpen, setIsEditSubServiceModalOpen] = useState(false);
  
  // Form states
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedSubService, setSelectedSubService] = useState<SubService | null>(null);
  const [serviceName, setServiceName] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [serviceWhatYouGet, setServiceWhatYouGet] = useState<string[]>(['']);
  const [serviceEnabled, setServiceEnabled] = useState(true);
  
  const [subServiceName, setSubServiceName] = useState('');
  const [subServiceDescription, setSubServiceDescription] = useState('');
  const [subServiceEta, setSubServiceEta] = useState('');
  const [subServicePriceRange, setSubServicePriceRange] = useState('');
  const [subServiceRole, setSubServiceRole] = useState<SubService['role']>();
  const [subServiceEnabled, setSubServiceEnabled] = useState(true);

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const toggleServiceExpansion = (serviceId: number) => {
    setExpandedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const resetServiceForm = () => {
    setServiceName('');
    setServiceDescription('');
    setServiceWhatYouGet(['']);
    setServiceEnabled(true);
    setSelectedService(null);
  };

  const resetSubServiceForm = () => {
    setSubServiceName('');
    setSubServiceDescription('');
    setSubServiceEta('');
    setSubServicePriceRange('');
    setSubServiceRole(undefined);
    setSubServiceEnabled(true);
    setSelectedSubService(null);
  };

  const handleAddService = () => {
    if (!serviceName.trim()) return;

    const newService: Service = {
      id: Date.now(),
      name: serviceName,
      description: serviceDescription,
      whatYouGet: serviceWhatYouGet,
      enabled: serviceEnabled,
      subServices: [],
    };

    setServices([...services, newService]);
    setIsAddServiceModalOpen(false);
    resetServiceForm();
    showSuccess('Service added successfully');
  };

  const handleEditService = () => {
    if (!selectedService || !serviceName.trim()) return;

    setServices(services.map(s =>
      s.id === selectedService.id
        ? { ...s, name: serviceName, description: serviceDescription, whatYouGet: serviceWhatYouGet, enabled: serviceEnabled }
        : s
    ));

    setIsEditServiceModalOpen(false);
    resetServiceForm();
    showSuccess('Service updated successfully');
  };

  const handleDeleteService = (service: Service) => {
    if (confirm(`Are you sure you want to delete "${service.name}"?`)) {
      setServices(services.filter(s => s.id !== service.id));
      showSuccess('Service deleted successfully');
    }
  };

  const handleToggleService = (serviceId: number) => {
    setServices(services.map(s =>
      s.id === serviceId ? { ...s, enabled: !s.enabled } : s
    ));
    showSuccess('Service status updated');
  };

  const openEditServiceModal = (service: Service) => {
    setSelectedService(service);
    setServiceName(service.name);
    setServiceDescription(service.description);
    setServiceWhatYouGet(service.whatYouGet);
    setServiceEnabled(service.enabled);
    setIsEditServiceModalOpen(true);
  };

  const openAddSubServiceModal = (service: Service) => {
    setSelectedService(service);
    resetSubServiceForm();
    setIsAddSubServiceModalOpen(true);
  };

  const handleAddSubService = () => {
    if (!selectedService || !subServiceName.trim()) return;

    const newSubService: SubService = {
      id: Date.now(),
      name: subServiceName,
      description: subServiceDescription,
      eta: subServiceEta,
      priceRange: subServicePriceRange,
      role: subServiceRole,
      enabled: subServiceEnabled,
    };

    setServices(services.map(s =>
      s.id === selectedService.id
        ? { ...s, subServices: [...s.subServices, newSubService] }
        : s
    ));

    setIsAddSubServiceModalOpen(false);
    resetSubServiceForm();
    showSuccess('Service added successfully');
  };

  const openEditSubServiceModal = (service: Service, subService: SubService) => {
    setSelectedService(service);
    setSelectedSubService(subService);
    setSubServiceName(subService.name);
    setSubServiceDescription(subService.description);
    setSubServiceEta(subService.eta);
    setSubServicePriceRange(subService.priceRange);
    setSubServiceRole(subService.role);
    setSubServiceEnabled(subService.enabled);
    setIsEditSubServiceModalOpen(true);
  };

  const handleEditSubService = () => {
    if (!selectedService || !selectedSubService || !subServiceName.trim()) return;

    setServices(services.map(s =>
      s.id === selectedService.id
        ? {
            ...s,
            subServices: s.subServices.map(ss =>
              ss.id === selectedSubService.id
                ? { ...ss, name: subServiceName, description: subServiceDescription, eta: subServiceEta, priceRange: subServicePriceRange, role: subServiceRole, enabled: subServiceEnabled }
                : ss
            ),
          }
        : s
    ));

    setIsEditSubServiceModalOpen(false);
    resetSubServiceForm();
    showSuccess('Service updated successfully');
  };

  const handleDeleteSubService = (serviceId: number, subServiceId: number) => {
    if (confirm('Are you sure you want to delete this service?')) {
      setServices(services.map(s =>
        s.id === serviceId
          ? { ...s, subServices: s.subServices.filter(ss => ss.id !== subServiceId) }
          : s
      ));
      showSuccess('Service deleted successfully');
    }
  };

  const handleToggleSubService = (serviceId: number, subServiceId: number) => {
    setServices(services.map(s =>
      s.id === serviceId
        ? {
            ...s,
            subServices: s.subServices.map(ss =>
              ss.id === subServiceId ? { ...ss, enabled: !ss.enabled } : ss
            ),
          }
        : s
    ));
    showSuccess('Service status updated');
  };

  return (
    <AdminLayout>
      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-24 right-8 z-50 bg-primary-700 text-neutral-0 px-6 py-3 rounded-[var(--radius-card)] shadow-lg flex items-center gap-2 animate-in slide-in-from-top">
          <CheckCircle className="w-4 h-4" />
          <span className="text-small font-medium">{successMessage}</span>
        </div>
      )}

      {/* Add Service Category Modal */}
      {isAddServiceModalOpen && (
        <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card dark:bg-neutral-900 rounded-[var(--radius-card)] border border-black/10 dark:border-white/10 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-black/5 dark:border-white/5">
              <h2 className="text-h3 font-medium text-foreground dark:text-neutral-0">Add New Service Category</h2>
              <button
                onClick={() => {
                  setIsAddServiceModalOpen(false);
                  resetServiceForm();
                }}
                className="p-2 hover:bg-neutral-900/5 dark:hover:bg-card/5 rounded-[var(--radius)] transition-colors"
              >
                <X className="w-5 h-5 text-neutral-700/80 dark:text-neutral-300/80" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-caption font-medium text-neutral-700/80 dark:text-neutral-300/80 mb-2 uppercase tracking-wide">
                  Service Name *
                </label>
                <input
                  type="text"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="e.g., Legal Services"
                  className="w-full px-4 py-2.5 bg-card dark:bg-card/5 border border-black/10 dark:border-white/10 rounded-[var(--radius-card)] text-small text-foreground dark:text-neutral-0 placeholder:text-muted-foreground dark:placeholder:text-neutral-300/60 focus:outline-none focus:border-primary-700/50"
                />
              </div>

              <div>
                <label className="block text-caption font-medium text-neutral-700/80 dark:text-neutral-300/80 mb-2 uppercase tracking-wide">
                  Description
                </label>
                <textarea
                  value={serviceDescription}
                  onChange={(e) => setServiceDescription(e.target.value)}
                  placeholder="Brief description of the service"
                  rows={3}
                  className="w-full px-4 py-2.5 bg-card dark:bg-card/5 border border-black/10 dark:border-white/10 rounded-[var(--radius-card)] text-small text-foreground dark:text-neutral-0 placeholder:text-muted-foreground dark:placeholder:text-neutral-300/60 focus:outline-none focus:border-primary-700/50 resize-none"
                />
              </div>

              <div>
                <label className="block text-caption font-medium text-neutral-700/80 dark:text-neutral-300/80 mb-2 uppercase tracking-wide">
                  What You Get
                </label>
                <div className="space-y-2">
                  {serviceWhatYouGet.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const newItems = [...serviceWhatYouGet];
                          newItems[index] = e.target.value;
                          setServiceWhatYouGet(newItems);
                        }}
                        placeholder="e.g., Comprehensive legal support"
                        className="w-full px-4 py-2.5 bg-card dark:bg-card/5 border border-black/10 dark:border-white/10 rounded-[var(--radius-card)] text-small text-foreground dark:text-neutral-0 placeholder:text-muted-foreground dark:placeholder:text-neutral-300/60 focus:outline-none focus:border-primary-700/50"
                      />
                      {index > 0 && (
                        <button
                          onClick={() => {
                            const newItems = [...serviceWhatYouGet];
                            newItems.splice(index, 1);
                            setServiceWhatYouGet(newItems);
                          }}
                          className="ml-2 p-2 hover:bg-neutral-900/5 dark:hover:bg-card/5 rounded-[var(--radius)] transition-colors"
                        >
                          <Minus className="w-4 h-4 text-neutral-700/80 dark:text-neutral-300/80" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => setServiceWhatYouGet([...serviceWhatYouGet, ''])}
                    className="px-4 py-2.5 bg-primary hover:opacity-90 text-primary-foreground rounded-[var(--radius-card)] text-small font-medium transition-all shadow-sm"
                  >
                    Add Item
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-neutral-900/[0.02] dark:bg-card/[0.02] rounded-[var(--radius-card)]">
                <div>
                  <p className="text-small font-medium text-foreground dark:text-neutral-0">Enable Service</p>
                  <p className="text-caption text-neutral-700/80 dark:text-neutral-300/80">Make service available to clients</p>
                </div>
                <button
                  onClick={() => setServiceEnabled(!serviceEnabled)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    serviceEnabled ? 'bg-primary-700' : 'bg-neutral-900/20 dark:bg-card/20'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-card rounded-full shadow-sm transition-transform ${
                      serviceEnabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-black/5 dark:border-white/5">
              <button
                onClick={() => {
                  setIsAddServiceModalOpen(false);
                  resetServiceForm();
                }}
                className="px-6 py-2.5 bg-card dark:bg-card/5 border border-black/10 dark:border-white/10 rounded-[var(--radius-card)] text-small font-medium text-foreground dark:text-neutral-0 hover:bg-neutral-900/5 dark:hover:bg-card/10 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAddService}
                disabled={!serviceName.trim()}
                className="px-6 py-2.5 bg-primary hover:opacity-90 text-primary-foreground rounded-[var(--radius-card)] text-small font-medium transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Service Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Service Modal */}
      {isEditServiceModalOpen && selectedService && (
        <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card dark:bg-neutral-900 rounded-[var(--radius-card)] border border-black/10 dark:border-white/10 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-black/5 dark:border-white/5">
              <h2 className="text-h3 font-medium text-foreground dark:text-neutral-0">Edit Service Category</h2>
              <button
                onClick={() => {
                  setIsEditServiceModalOpen(false);
                  resetServiceForm();
                }}
                className="p-2 hover:bg-neutral-900/5 dark:hover:bg-card/5 rounded-[var(--radius)] transition-colors"
              >
                <X className="w-5 h-5 text-neutral-700/80 dark:text-neutral-300/80" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-caption font-medium text-neutral-700/80 dark:text-neutral-300/80 mb-2 uppercase tracking-wide">
                  Service Name *
                </label>
                <input
                  type="text"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-card dark:bg-card/5 border border-black/10 dark:border-white/10 rounded-[var(--radius-card)] text-small text-foreground dark:text-neutral-0 focus:outline-none focus:border-primary-700/50"
                />
              </div>

              <div>
                <label className="block text-caption font-medium text-neutral-700/80 dark:text-neutral-300/80 mb-2 uppercase tracking-wide">
                  Description
                </label>
                <textarea
                  value={serviceDescription}
                  onChange={(e) => setServiceDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-card dark:bg-card/5 border border-black/10 dark:border-white/10 rounded-[var(--radius-card)] text-small text-foreground dark:text-neutral-0 focus:outline-none focus:border-primary-700/50 resize-none"
                />
              </div>

              <div>
                <label className="block text-caption font-medium text-neutral-700/80 dark:text-neutral-300/80 mb-2 uppercase tracking-wide">
                  What You Get
                </label>
                <div className="space-y-2">
                  {serviceWhatYouGet.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const newItems = [...serviceWhatYouGet];
                          newItems[index] = e.target.value;
                          setServiceWhatYouGet(newItems);
                        }}
                        placeholder="e.g., Comprehensive legal support"
                        className="w-full px-4 py-2.5 bg-card dark:bg-card/5 border border-black/10 dark:border-white/10 rounded-[var(--radius-card)] text-small text-foreground dark:text-neutral-0 placeholder:text-muted-foreground dark:placeholder:text-neutral-300/60 focus:outline-none focus:border-primary-700/50"
                      />
                      {index > 0 && (
                        <button
                          onClick={() => {
                            const newItems = [...serviceWhatYouGet];
                            newItems.splice(index, 1);
                            setServiceWhatYouGet(newItems);
                          }}
                          className="ml-2 p-2 hover:bg-neutral-900/5 dark:hover:bg-card/5 rounded-[var(--radius)] transition-colors"
                        >
                          <Minus className="w-4 h-4 text-neutral-700/80 dark:text-neutral-300/80" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => setServiceWhatYouGet([...serviceWhatYouGet, ''])}
                    className="px-4 py-2.5 bg-primary hover:opacity-90 text-primary-foreground rounded-[var(--radius-card)] text-small font-medium transition-all shadow-sm"
                  >
                    Add Item
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-neutral-900/[0.02] dark:bg-card/[0.02] rounded-[var(--radius-card)]">
                <div>
                  <p className="text-small font-medium text-foreground dark:text-neutral-0">Enable Service</p>
                  <p className="text-caption text-neutral-700/80 dark:text-neutral-300/80">Make service available to clients</p>
                </div>
                <button
                  onClick={() => setServiceEnabled(!serviceEnabled)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    serviceEnabled ? 'bg-primary-700' : 'bg-neutral-900/20 dark:bg-card/20'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-card rounded-full shadow-sm transition-transform ${
                      serviceEnabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-black/5 dark:border-white/5">
              <button
                onClick={() => {
                  setIsEditServiceModalOpen(false);
                  resetServiceForm();
                }}
                className="px-6 py-2.5 bg-card dark:bg-card/5 border border-black/10 dark:border-white/10 rounded-[var(--radius-card)] text-small font-medium text-foreground dark:text-neutral-0 hover:bg-neutral-900/5 dark:hover:bg-card/10 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleEditService}
                disabled={!serviceName.trim()}
                className="px-6 py-2.5 bg-primary hover:opacity-90 text-primary-foreground rounded-[var(--radius-card)] text-small font-medium transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update Service Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Sub-Service Modal */}
      {isAddSubServiceModalOpen && selectedService && (
        <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card dark:bg-neutral-900 rounded-[var(--radius-card)] border border-black/10 dark:border-white/10 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-black/5 dark:border-white/5">
              <div>
                <h2 className="text-h3 font-medium text-foreground dark:text-neutral-0">Add Service</h2>
                <p className="text-caption text-neutral-700/80 dark:text-neutral-300/80 mt-1">to {selectedService.name}</p>
              </div>
              <button
                onClick={() => {
                  setIsAddSubServiceModalOpen(false);
                  resetSubServiceForm();
                }}
                className="p-2 hover:bg-neutral-900/5 dark:hover:bg-card/5 rounded-[var(--radius)] transition-colors"
              >
                <X className="w-5 h-5 text-neutral-700/80 dark:text-neutral-300/80" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-caption font-medium text-neutral-700/80 dark:text-neutral-300/80 mb-2 uppercase tracking-wide">
                  Service Name *
                </label>
                <input
                  type="text"
                  value={subServiceName}
                  onChange={(e) => setSubServiceName(e.target.value)}
                  placeholder="e.g., Title Verification"
                  className="w-full px-4 py-2.5 bg-card dark:bg-card/5 border border-black/10 dark:border-white/10 rounded-[var(--radius-card)] text-small text-foreground dark:text-neutral-0 placeholder:text-muted-foreground dark:placeholder:text-neutral-300/60 focus:outline-none focus:border-primary-700/50"
                />
              </div>

              <div>
                <label className="block text-caption font-medium text-neutral-700/80 dark:text-neutral-300/80 mb-2 uppercase tracking-wide">
                  Description
                </label>
                <textarea
                  value={subServiceDescription}
                  onChange={(e) => setSubServiceDescription(e.target.value)}
                  placeholder="Brief description"
                  rows={3}
                  className="w-full px-4 py-2.5 bg-card dark:bg-card/5 border border-black/10 dark:border-white/10 rounded-[var(--radius-card)] text-small text-foreground dark:text-neutral-0 placeholder:text-muted-foreground dark:placeholder:text-neutral-300/60 focus:outline-none focus:border-primary-700/50 resize-none"
                />
              </div>

              <div>
                <label className="block text-caption font-medium text-neutral-700/80 dark:text-neutral-300/80 mb-2 uppercase tracking-wide">
                  ETA
                </label>
                <input
                  type="text"
                  value={subServiceEta}
                  onChange={(e) => setSubServiceEta(e.target.value)}
                  placeholder="e.g., 1-2 weeks"
                  className="w-full px-4 py-2.5 bg-card dark:bg-card/5 border border-black/10 dark:border-white/10 rounded-[var(--radius-card)] text-small text-foreground dark:text-neutral-0 placeholder:text-muted-foreground dark:placeholder:text-neutral-300/60 focus:outline-none focus:border-primary-700/50"
                />
              </div>

              <div>
                <label className="block text-caption font-medium text-neutral-700/80 dark:text-neutral-300/80 mb-2 uppercase tracking-wide">
                  Price Range
                </label>
                <input
                  type="text"
                  value={subServicePriceRange}
                  onChange={(e) => setSubServicePriceRange(e.target.value)}
                  placeholder="e.g., ₹50,000 - ₹1,00,000"
                  className="w-full px-4 py-2.5 bg-card dark:bg-card/5 border border-black/10 dark:border-white/10 rounded-[var(--radius-card)] text-small text-foreground dark:text-neutral-0 placeholder:text-muted-foreground dark:placeholder:text-neutral-300/60 focus:outline-none focus:border-primary-700/50"
                />
              </div>

              <div>
                <label className="block text-caption font-medium text-neutral-700/80 dark:text-neutral-300/80 mb-2 uppercase tracking-wide">
                  Role
                </label>
                <select
                  value={subServiceRole || ''}
                  onChange={(e) => setSubServiceRole(e.target.value as SubService['role'])}
                  className="w-full px-4 py-2.5 bg-card dark:bg-card/5 border border-black/10 dark:border-white/10 rounded-[var(--radius-card)] text-small text-foreground dark:text-neutral-0 placeholder:text-muted-foreground dark:placeholder:text-neutral-300/60 focus:outline-none focus:border-primary-700/50"
                >
                  <option value="">Select Role</option>
                  <option value="legal-partner">Legal Partner</option>
                  <option value="survey-technician">Survey Technician</option>
                  <option value="architect-planning">Architect Planning</option>
                  <option value="developer-jv">Developer JV</option>
                  <option value="channel-field">Channel Field</option>
                  <option value="documentation-compliance">Documentation Compliance</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 bg-neutral-900/[0.02] dark:bg-card/[0.02] rounded-[var(--radius-card)]">
                <div>
                  <p className="text-small font-medium text-foreground dark:text-neutral-0">Enable Service</p>
                  <p className="text-caption text-neutral-700/80 dark:text-neutral-300/80">Make available to clients</p>
                </div>
                <button
                  onClick={() => setSubServiceEnabled(!subServiceEnabled)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    subServiceEnabled ? 'bg-primary-700' : 'bg-neutral-900/20 dark:bg-card/20'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-card rounded-full shadow-sm transition-transform ${
                      subServiceEnabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-black/5 dark:border-white/5">
              <button
                onClick={() => {
                  setIsAddSubServiceModalOpen(false);
                  resetSubServiceForm();
                }}
                className="px-6 py-2.5 bg-card dark:bg-card/5 border border-black/10 dark:border-white/10 rounded-[var(--radius-card)] text-small font-medium text-foreground dark:text-neutral-0 hover:bg-neutral-900/5 dark:hover:bg-card/10 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSubService}
                disabled={!subServiceName.trim()}
                className="px-6 py-2.5 bg-primary hover:opacity-90 text-primary-foreground rounded-[var(--radius-card)] text-small font-medium transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Service
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Sub-Service Modal */}
      {isEditSubServiceModalOpen && selectedService && selectedSubService && (
        <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card dark:bg-neutral-900 rounded-[var(--radius-card)] border border-black/10 dark:border-white/10 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-black/5 dark:border-white/5">
              <div>
                <h2 className="text-h3 font-medium text-foreground dark:text-neutral-0">Edit Service</h2>
                <p className="text-caption text-neutral-700/80 dark:text-neutral-300/80 mt-1">under {selectedService.name}</p>
              </div>
              <button
                onClick={() => {
                  setIsEditSubServiceModalOpen(false);
                  resetSubServiceForm();
                }}
                className="p-2 hover:bg-neutral-900/5 dark:hover:bg-card/5 rounded-[var(--radius)] transition-colors"
              >
                <X className="w-5 h-5 text-neutral-700/80 dark:text-neutral-300/80" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-caption font-medium text-neutral-700/80 dark:text-neutral-300/80 mb-2 uppercase tracking-wide">
                  Service Name *
                </label>
                <input
                  type="text"
                  value={subServiceName}
                  onChange={(e) => setSubServiceName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-card dark:bg-card/5 border border-black/10 dark:border-white/10 rounded-[var(--radius-card)] text-small text-foreground dark:text-neutral-0 focus:outline-none focus:border-primary-700/50"
                />
              </div>

              <div>
                <label className="block text-caption font-medium text-neutral-700/80 dark:text-neutral-300/80 mb-2 uppercase tracking-wide">
                  Description
                </label>
                <textarea
                  value={subServiceDescription}
                  onChange={(e) => setSubServiceDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-card dark:bg-card/5 border border-black/10 dark:border-white/10 rounded-[var(--radius-card)] text-small text-foreground dark:text-neutral-0 focus:outline-none focus:border-primary-700/50 resize-none"
                />
              </div>

              <div>
                <label className="block text-caption font-medium text-neutral-700/80 dark:text-neutral-300/80 mb-2 uppercase tracking-wide">
                  ETA
                </label>
                <input
                  type="text"
                  value={subServiceEta}
                  onChange={(e) => setSubServiceEta(e.target.value)}
                  className="w-full px-4 py-2.5 bg-card dark:bg-card/5 border border-black/10 dark:border-white/10 rounded-[var(--radius-card)] text-small text-foreground dark:text-neutral-0 focus:outline-none focus:border-primary-700/50"
                />
              </div>

              <div>
                <label className="block text-caption font-medium text-neutral-700/80 dark:text-neutral-300/80 mb-2 uppercase tracking-wide">
                  Price Range
                </label>
                <input
                  type="text"
                  value={subServicePriceRange}
                  onChange={(e) => setSubServicePriceRange(e.target.value)}
                  className="w-full px-4 py-2.5 bg-card dark:bg-card/5 border border-black/10 dark:border-white/10 rounded-[var(--radius-card)] text-small text-foreground dark:text-neutral-0 focus:outline-none focus:border-primary-700/50"
                />
              </div>

              <div>
                <label className="block text-caption font-medium text-neutral-700/80 dark:text-neutral-300/80 mb-2 uppercase tracking-wide">
                  Role
                </label>
                <select
                  value={subServiceRole || ''}
                  onChange={(e) => setSubServiceRole(e.target.value as SubService['role'])}
                  className="w-full px-4 py-2.5 bg-card dark:bg-card/5 border border-black/10 dark:border-white/10 rounded-[var(--radius-card)] text-small text-foreground dark:text-neutral-0 placeholder:text-muted-foreground dark:placeholder:text-neutral-300/60 focus:outline-none focus:border-primary-700/50"
                >
                  <option value="">Select Role</option>
                  <option value="legal-partner">Legal Partner</option>
                  <option value="survey-technician">Survey Technician</option>
                  <option value="architect-planning">Architect Planning</option>
                  <option value="developer-jv">Developer JV</option>
                  <option value="channel-field">Channel Field</option>
                  <option value="documentation-compliance">Documentation Compliance</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 bg-neutral-900/[0.02] dark:bg-card/[0.02] rounded-[var(--radius-card)]">
                <div>
                  <p className="text-small font-medium text-foreground dark:text-neutral-0">Enable Service</p>
                  <p className="text-caption text-neutral-700/80 dark:text-neutral-300/80">Make available to clients</p>
                </div>
                <button
                  onClick={() => setSubServiceEnabled(!subServiceEnabled)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    subServiceEnabled ? 'bg-primary-700' : 'bg-neutral-900/20 dark:bg-card/20'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-card rounded-full shadow-sm transition-transform ${
                      subServiceEnabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-black/5 dark:border-white/5">
              <button
                onClick={() => {
                  setIsEditSubServiceModalOpen(false);
                  resetSubServiceForm();
                }}
                className="px-6 py-2.5 bg-card dark:bg-card/5 border border-black/10 dark:border-white/10 rounded-[var(--radius-card)] text-small font-medium text-foreground dark:text-neutral-0 hover:bg-neutral-900/5 dark:hover:bg-card/10 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubService}
                disabled={!subServiceName.trim()}
                className="px-6 py-2.5 bg-primary hover:opacity-90 text-primary-foreground rounded-[var(--radius-card)] text-small font-medium transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update Service
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-h2 tracking-tight text-foreground dark:text-neutral-0/95 mb-1">
          Service Configuration
        </h1>
        <p className="text-small text-neutral-700/80 dark:text-neutral-300/80">
          Manage service categories, services, pricing, and availability for the VYBE platform.
        </p>
      </div>

      {/* Search and Add Controls */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground dark:text-neutral-300/60" />
          <input
            type="text"
            placeholder="Search service categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card dark:bg-card/5 border border-black/10 dark:border-white/10 rounded-[var(--radius-card)] text-small text-foreground dark:text-neutral-0 placeholder:text-muted-foreground dark:placeholder:text-neutral-300/60 focus:outline-none focus:border-primary-700/50"
          />
        </div>
        <button
          onClick={() => setIsAddServiceModalOpen(true)}
          className="px-4 py-2.5 bg-primary hover:opacity-90 text-primary-foreground rounded-[var(--radius-card)] text-small font-medium transition-all flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Service Category
        </button>
      </div>

      {/* Services List */}
      <div className="space-y-4">
        {filteredServices.map((service) => {
          const isExpanded = expandedServices.includes(service.id);
          return (
            <div
              key={service.id}
              className="bg-card/85 dark:bg-card/[0.02] backdrop-blur-[40px] border border-black/5 dark:border-white/5 rounded-[var(--radius-card)] overflow-hidden"
            >
              {/* Service Header */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="text-h1 w-12 h-12 flex items-center justify-center">
                      {service.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-h3 font-medium text-foreground dark:text-neutral-0">
                          {service.name}
                        </h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-caption font-medium uppercase tracking-wide ${
                            service.enabled
                              ? 'bg-primary-700/10 text-primary-700'
                              : 'bg-neutral-900/10 dark:bg-card/10 text-muted-foreground dark:text-neutral-300/60'
                          }`}
                        >
                          {service.enabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                      <p className="text-small text-neutral-700/80 dark:text-neutral-300/80">
                        {service.description}
                      </p>
                      <p className="text-caption text-muted-foreground dark:text-neutral-300/60 mt-2">
                        {service.subServices.length} service{service.subServices.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleService(service.id)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        service.enabled ? 'bg-primary-700' : 'bg-neutral-900/20 dark:bg-card/20'
                      }`}
                      title={service.enabled ? 'Disable service' : 'Enable service'}
                    >
                      <div
                        className={`absolute top-0.5 w-5 h-5 bg-card rounded-full shadow-sm transition-transform ${
                          service.enabled ? 'translate-x-6' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                    <button
                      onClick={() => openEditServiceModal(service)}
                      className="p-2 hover:bg-neutral-900/5 dark:hover:bg-card/5 rounded-[var(--radius)] transition-colors"
                      title="Edit service"
                    >
                      <Edit2 className="w-4 h-4 text-neutral-700/80 dark:text-neutral-300/80" />
                    </button>
                    <button
                      onClick={() => handleDeleteService(service)}
                      className="p-2 hover:bg-neutral-900/5 dark:hover:bg-card/5 rounded-[var(--radius)] transition-colors group"
                      title="Delete service"
                    >
                      <Trash2 className="w-4 h-4 text-muted-foreground dark:text-neutral-300/60 group-hover:text-red-500" />
                    </button>
                    <button
                      onClick={() => toggleServiceExpansion(service.id)}
                      className="p-2 hover:bg-neutral-900/5 dark:hover:bg-card/5 rounded-[var(--radius)] transition-colors"
                      title={isExpanded ? 'Collapse' : 'Expand'}
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-neutral-700/80 dark:text-neutral-300/80" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-neutral-700/80 dark:text-neutral-300/80" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Sub-Services */}
              {isExpanded && (
                <div className="border-t border-black/5 dark:border-white/5">
                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-small font-medium text-neutral-700/80 dark:text-neutral-300/80 uppercase tracking-wide">
                        Services
                      </h4>
                      <button
                        onClick={() => openAddSubServiceModal(service)}
                        className="px-3 py-1.5 bg-primary-700/10 text-primary-700 hover:bg-primary-700/20 rounded-[var(--radius)] text-caption font-medium transition-colors flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        Add Service
                      </button>
                    </div>

                    {service.subServices.length > 0 ? (
                      <div className="space-y-2">
                        {service.subServices.map((subService) => (
                          <div
                            key={subService.id}
                            className="flex items-center justify-between p-4 bg-card dark:bg-card/5 border border-black/5 dark:border-white/5 rounded-[var(--radius-card)] hover:bg-neutral-900/[0.02] dark:hover:bg-card/[0.03] transition-colors"
                          >
                            <div className="flex-1 min-w-0 pr-4">
                              <div className="flex items-center gap-2 mb-1">
                                <h5 className="text-small font-medium text-foreground dark:text-neutral-0">
                                  {subService.name}
                                </h5>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-caption font-medium uppercase tracking-wide ${
                                    subService.enabled
                                      ? 'bg-primary-700/10 text-primary-700'
                                      : 'bg-neutral-900/10 dark:bg-card/10 text-muted-foreground dark:text-neutral-300/60'
                                  }`}
                                >
                                  {subService.enabled ? 'Active' : 'Inactive'}
                                </span>
                                {subService.role && (
                                  <span className="px-2 py-0.5 rounded-full text-caption font-medium uppercase tracking-wide bg-purple-500/10 text-purple-500">
                                    {getRoleLabel(subService.role)}
                                  </span>
                                )}
                              </div>
                              <p className="text-caption text-neutral-700/80 dark:text-neutral-300/80 mb-1">
                                {subService.description}
                              </p>
                              <p className="text-small font-medium text-primary-700">
                                {subService.priceRange}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleToggleSubService(service.id, subService.id)}
                                className={`relative w-10 h-5 rounded-full transition-colors ${
                                  subService.enabled ? 'bg-primary-700' : 'bg-neutral-900/20 dark:bg-card/20'
                                }`}
                                title={subService.enabled ? 'Disable' : 'Enable'}
                              >
                                <div
                                  className={`absolute top-0.5 w-4 h-4 bg-card rounded-full shadow-sm transition-transform ${
                                    subService.enabled ? 'translate-x-5' : 'translate-x-0.5'
                                  }`}
                                />
                              </button>
                              <button
                                onClick={() => openEditSubServiceModal(service, subService)}
                                className="p-2 hover:bg-neutral-900/5 dark:hover:bg-card/5 rounded-[var(--radius)] transition-colors"
                                title="Edit sub-service"
                              >
                                <Edit2 className="w-3.5 h-3.5 text-neutral-700/80 dark:text-neutral-300/80" />
                              </button>
                              <button
                                onClick={() => handleDeleteSubService(service.id, subService.id)}
                                className="p-2 hover:bg-neutral-900/5 dark:hover:bg-card/5 rounded-[var(--radius)] transition-colors group"
                                title="Delete sub-service"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-muted-foreground dark:text-neutral-300/60 group-hover:text-red-500" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-small text-muted-foreground dark:text-neutral-300/60">
                          No services yet. Click "Add Service" to get started.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredServices.length === 0 && (
          <div className="bg-card/85 dark:bg-card/[0.02] backdrop-blur-[40px] border border-black/5 dark:border-white/5 rounded-[var(--radius-card)] p-12 text-center">
            <Settings className="w-12 h-12 text-foreground/20 dark:text-neutral-0/20 mx-auto mb-4" />
            <p className="text-small text-muted-foreground dark:text-neutral-300/60">
              No services found. Click "Add Service" to create your first service.
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}