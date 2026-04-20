import { useState } from 'react';
import { Search, ChevronDown, Trash2, UserCheck, UserX, RefreshCw, X, CheckCircle, Download } from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';

interface RM {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface Client {
  id: number;
  slNo: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  primaryRole: 'land-owner' | 'strategic-investor' | 'both';
  portfolioSize: '1' | '2-5' | '6-20' | '20+';
  preferredPropertyType: string;
  status: 'lead' | 'active' | 'deactivated';
  assignedRM?: RM;
  documentType?: 'aadhaar' | 'pan' | null;
  documentUrl?: string;
}

// Mock RMs
const mockRMs: RM[] = [
  { id: 1, firstName: 'Rajesh', lastName: 'Kumar', email: 'rajesh.k@vybe.com' },
  { id: 2, firstName: 'Priya', lastName: 'Sharma', email: 'priya.s@vybe.com' },
  { id: 3, firstName: 'Aditya', lastName: 'Patel', email: 'aditya.p@vybe.com' },
  { id: 4, firstName: 'Sneha', lastName: 'Reddy', email: 'sneha.r@vybe.com' },
];

const mockClients: Client[] = [
  {
    id: 1,
    slNo: 1,
    firstName: 'Sri Vidhya',
    lastName: 'P',
    phone: '+919445112712',
    email: 'srividhya.p@turbostart.co',
    primaryRole: 'strategic-investor',
    portfolioSize: '6-20',
    preferredPropertyType: 'Residential, Commercial, Land',
    status: 'lead',
  },
  {
    id: 2,
    slNo: 2,
    firstName: 'Alexander',
    lastName: 'Sterling',
    phone: '+919876543210',
    email: 'alexander.s@email.com',
    primaryRole: 'both',
    portfolioSize: '20+',
    preferredPropertyType: 'Luxury Residential, International',
    status: 'lead',
  },
  {
    id: 3,
    slNo: 3,
    firstName: 'Ananya',
    lastName: 'Iyer',
    phone: '+918765432109',
    email: 'ananya.i@email.com',
    primaryRole: 'land-owner',
    portfolioSize: '2-5',
    preferredPropertyType: 'Land, Holiday Homes',
    status: 'active',
    assignedRM: mockRMs[0],
    documentType: 'aadhaar',
    documentUrl: '/mock/documents/ananya-aadhaar.pdf',
  },
  {
    id: 4,
    slNo: 4,
    firstName: 'Vikram',
    lastName: 'Malhotra',
    phone: '+917654321098',
    email: 'vikram.m@email.com',
    primaryRole: 'strategic-investor',
    portfolioSize: '6-20',
    preferredPropertyType: 'Commercial, Residential',
    status: 'active',
    assignedRM: mockRMs[1],
    documentType: 'pan',
    documentUrl: '/mock/documents/vikram-pan.pdf',
  },
  {
    id: 5,
    slNo: 5,
    firstName: 'Kavita',
    lastName: 'Mehta',
    phone: '+919123456789',
    email: 'kavita.m@email.com',
    primaryRole: 'both',
    portfolioSize: '20+',
    preferredPropertyType: 'Ultra-Luxury Villas, Waterfront',
    status: 'lead',
  },
  {
    id: 6,
    slNo: 6,
    firstName: 'Rohan',
    lastName: 'Kapoor',
    phone: '+919234567890',
    email: 'rohan.k@email.com',
    primaryRole: 'strategic-investor',
    portfolioSize: '6-20',
    preferredPropertyType: 'Commercial, Mixed-Use',
    status: 'lead',
  },
  {
    id: 7,
    slNo: 7,
    firstName: 'Nisha',
    lastName: 'Gupta',
    phone: '+919345678901',
    email: 'nisha.g@email.com',
    primaryRole: 'land-owner',
    portfolioSize: '2-5',
    preferredPropertyType: 'Agricultural Land, Farmhouses',
    status: 'lead',
  },
  {
    id: 8,
    slNo: 8,
    firstName: 'Arjun',
    lastName: 'Sinha',
    phone: '+919456789012',
    email: 'arjun.s@email.com',
    primaryRole: 'both',
    portfolioSize: '20+',
    preferredPropertyType: 'Premium Residential, Golf Course Properties',
    status: 'lead',
  },
  {
    id: 9,
    slNo: 9,
    firstName: 'Deepa',
    lastName: 'Nair',
    phone: '+919567890123',
    email: 'deepa.n@email.com',
    primaryRole: 'strategic-investor',
    portfolioSize: '6-20',
    preferredPropertyType: 'Hospitality, Resorts',
    status: 'lead',
  },
];

type TabType = 'lead' | 'active' | 'deactivated';
type SortOption = 'name-asc' | 'name-desc' | 'recent';

export function ClientManagement() {
  // Get current user role and email
  const getCurrentUser = () => {
    const userData = localStorage.getItem('vybeAdminUser');
    if (userData) {
      const user = JSON.parse(userData);
      return { role: user.role || 'admin', email: user.email || '' };
    }
    return { role: 'admin', email: '' };
  };

  const currentUser = getCurrentUser();

  // For RM role, always start with 'active' tab
  const [activeTab, setActiveTab] = useState<TabType>(currentUser.role === 'rm' ? 'active' : 'lead');
  const [searchQuery, setSearchQuery] = useState('');
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Modals
  const [isAssignRMModalOpen, setIsAssignRMModalOpen] = useState(false);
  const [isChangeRMModalOpen, setIsChangeRMModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedRM, setSelectedRM] = useState<number | null>(null);
  const [rmSearchQuery, setRmSearchQuery] = useState('');

  const filteredClients = clients
    .filter((client) => client.status === activeTab)
    .filter((client) => {
      // For RM role, only show active clients assigned to them
      if (currentUser.role === 'rm') {
        // Only show active clients
        if (client.status !== 'active') {
          return false;
        }
        // In a real app, we'd fetch the client-RM mapping from the database
        // For demo, we check if case userName matches the RM's assigned clients
        const rmEmail = currentUser.email;
        // Mock RM to client mapping (in production, fetch from backend)
        const rmClientMap: Record<string, string[]> = {
          'rajesh.k@vybe.com': ['Ananya Iyer'],
          'priya.s@vybe.com': ['Vikram Malhotra'],
          'aditya.p@vybe.com': ['Alexander Sterling'],
          'sneha.r@vybe.com': ['Sri Vidhya P']
        };
        const assignedClients = rmClientMap[rmEmail] || [];
        if (client.assignedRM?.email !== currentUser.email) {
          return false;
        }
      }
      return (
        client.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

  // Sort clients
  const sortedClients = [...filteredClients].sort((a, b) => {
    switch (sortBy) {
      case 'name-asc':
        return a.firstName.localeCompare(b.firstName);
      case 'name-desc':
        return b.firstName.localeCompare(a.firstName);
      case 'recent':
      default:
        return b.id - a.id;
    }
  });

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleMoveToActive = (client: Client) => {
    setSelectedClient(client);
    setSelectedRM(null);
    setIsAssignRMModalOpen(true);
  };

  const handleAssignRM = () => {
    if (!selectedClient || !selectedRM) return;

    const rm = mockRMs.find(r => r.id === selectedRM);
    if (!rm) return;

    setClients(clients.map(c => 
      c.id === selectedClient.id 
        ? { ...c, status: 'active', assignedRM: rm }
        : c
    ));

    setIsAssignRMModalOpen(false);
    setSelectedClient(null);
    setSelectedRM(null);
    showSuccess(`${selectedClient.firstName} ${selectedClient.lastName} moved to Active Clients`);
  };

  const handleChangeRM = (client: Client) => {
    setSelectedClient(client);
    setSelectedRM(client.assignedRM?.id || null);
    setIsChangeRMModalOpen(true);
  };

  const handleUpdateRM = () => {
    if (!selectedClient || !selectedRM) return;

    const rm = mockRMs.find(r => r.id === selectedRM);
    if (!rm) return;

    setClients(clients.map(c => 
      c.id === selectedClient.id 
        ? { ...c, assignedRM: rm }
        : c
    ));

    setIsChangeRMModalOpen(false);
    setSelectedClient(null);
    setSelectedRM(null);
    showSuccess('RM updated successfully');
  };

  const handleMoveToDeactivated = (client: Client) => {
    if (confirm(`Are you sure you want to deactivate ${client.firstName} ${client.lastName}?`)) {
      setClients(clients.map(c => 
        c.id === client.id 
          ? { ...c, status: 'deactivated' }
          : c
      ));
      showSuccess('Client deactivated successfully');
    }
  };

  const handleReactivate = (client: Client) => {
    setSelectedClient(client);
    setSelectedRM(client.assignedRM?.id || null);
    setIsChangeRMModalOpen(true);
  };

  const handleReactivateWithRM = () => {
    if (!selectedClient || !selectedRM) return;

    const rm = mockRMs.find(r => r.id === selectedRM);
    if (!rm) return;

    setClients(clients.map(c => 
      c.id === selectedClient.id 
        ? { ...c, status: 'active', assignedRM: rm }
        : c
    ));

    setIsChangeRMModalOpen(false);
    setSelectedClient(null);
    setSelectedRM(null);
    showSuccess('Client reactivated successfully');
  };

  const handleDeleteClient = (client: Client) => {
    if (confirm(`Are you sure you want to delete ${client.firstName} ${client.lastName}?`)) {
      setClients(clients.filter(c => c.id !== client.id));
      showSuccess('Client deleted successfully');
    }
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case 'name-asc':
        return 'Name (A-Z)';
      case 'name-desc':
        return 'Name (Z-A)';
      case 'recent':
      default:
        return 'Most Recent';
    }
  };

  const getRoleLabel = (role: Client['primaryRole']) => {
    switch (role) {
      case 'land-owner':
        return 'Land Owner';
      case 'strategic-investor':
        return 'Strategic Investor';
      case 'both':
        return 'Both';
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

      {/* Assign RM Modal */}
      {isAssignRMModalOpen && selectedClient && (
        <div className="vybe-modal-overlay flex items-center justify-center p-4">
          <div className="vybe-modal w-full">
            <div className="vybe-modal-header">
              <h2 className="text-[20px] font-medium text-foreground">
                Assign Relationship Manager
              </h2>
              <button
                onClick={() => {
                  setIsAssignRMModalOpen(false);
                  setSelectedClient(null);
                  setSelectedRM(null);
                  setRmSearchQuery('');
                }}
                className="vybe-icon-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-small text-muted-foreground mb-4">
                  Select an RM to manage <span className="font-medium text-foreground">{selectedClient.firstName} {selectedClient.lastName}</span>
                </p>

                {/* Search Input */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search RM by name..."
                    value={rmSearchQuery}
                    onChange={(e) => setRmSearchQuery(e.target.value)}
                    className="vybe-input"
                  />
                </div>

                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {mockRMs
                    .filter(rm => rm.firstName.toLowerCase().includes(rmSearchQuery.toLowerCase()) || rm.lastName.toLowerCase().includes(rmSearchQuery.toLowerCase()))
                    .map((rm) => (
                      <button
                        key={rm.id}
                        onClick={() => setSelectedRM(rm.id)}
                        className={`w-full text-left p-4 rounded-[var(--radius)] border transition-all ${
                          selectedRM === rm.id
                            ? 'border-emerald-500 bg-emerald-500/5'
                            : 'border-border hover:bg-muted'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-small font-medium text-foreground">
                              {rm.firstName} {rm.lastName}
                            </p>
                            <p className="text-caption text-muted-foreground">
                              {rm.email}
                            </p>
                          </div>
                          {selectedRM === rm.id && (
                            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                              <CheckCircle className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
              <button
                onClick={() => {
                  setIsAssignRMModalOpen(false);
                  setSelectedClient(null);
                  setSelectedRM(null);
                  setRmSearchQuery('');
                }}
                className="px-6 h-[var(--button-height-desktop)] bg-card border border-border rounded-[var(--radius)] text-small font-medium text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignRM}
                disabled={!selectedRM}
                className="px-6 h-[var(--button-height-desktop)] bg-primary hover:opacity-90 text-primary-foreground rounded-[var(--radius)] text-small font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Assign RM
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change RM Modal */}
      {isChangeRMModalOpen && selectedClient && (
        <div className="vybe-modal-overlay flex items-center justify-center p-4">
          <div className="vybe-modal w-full">
            <div className="vybe-modal-header">
              <h2 className="text-[20px] font-medium text-foreground">
                {selectedClient.status === 'deactivated' ? 'Reactivate Client' : 'Change Relationship Manager'}
              </h2>
              <button
                onClick={() => {
                  setIsChangeRMModalOpen(false);
                  setSelectedClient(null);
                  setSelectedRM(null);
                  setRmSearchQuery('');
                }}
                className="vybe-icon-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-small text-muted-foreground mb-4">
                  {selectedClient.status === 'deactivated'
                    ? `Select an RM to manage ${selectedClient.firstName} ${selectedClient.lastName}`
                    : `Select a new RM for ${selectedClient.firstName} ${selectedClient.lastName}`
                  }
                </p>

                {/* Search Input */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search RM by name..."
                    value={rmSearchQuery}
                    onChange={(e) => setRmSearchQuery(e.target.value)}
                    className="vybe-input"
                  />
                </div>

                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {mockRMs
                    .filter(rm => rm.firstName.toLowerCase().includes(rmSearchQuery.toLowerCase()) || rm.lastName.toLowerCase().includes(rmSearchQuery.toLowerCase()))
                    .map((rm) => (
                      <button
                        key={rm.id}
                        onClick={() => setSelectedRM(rm.id)}
                        className={`w-full text-left p-4 rounded-[var(--radius)] border transition-all ${
                          selectedRM === rm.id
                            ? 'border-emerald-500 bg-emerald-500/5'
                            : 'border-border hover:bg-muted'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-small font-medium text-foreground">
                              {rm.firstName} {rm.lastName}
                            </p>
                            <p className="text-caption text-muted-foreground">
                              {rm.email}
                            </p>
                          </div>
                          {selectedRM === rm.id && (
                            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                              <CheckCircle className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
              <button
                onClick={() => {
                  setIsChangeRMModalOpen(false);
                  setSelectedClient(null);
                  setSelectedRM(null);
                  setRmSearchQuery('');
                }}
                className="px-6 h-[var(--button-height-desktop)] bg-card border border-border rounded-[var(--radius)] text-small font-medium text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={selectedClient.status === 'deactivated' ? handleReactivateWithRM : handleUpdateRM}
                disabled={!selectedRM}
                className="px-6 h-[var(--button-height-desktop)] bg-primary hover:opacity-90 text-primary-foreground rounded-[var(--radius)] text-small font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {selectedClient.status === 'deactivated' ? 'Reactivate' : 'Update RM'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="vybe-page-header">
        <h1 className="vybe-page-title mb-[var(--space-1)]">
          Clients
        </h1>
        <p className="vybe-page-subtitle">
          Manage leads and active clients across luxury property portfolios.
        </p>
      </div>

      {/* Tabs */}
      <div className="vybe-tabs">
        {currentUser.role !== 'rm' && (
          <button
            onClick={() => setActiveTab('lead')}
            className={`vybe-tab ${activeTab === 'lead' ? 'active' : ''}`}
          >
            Leads
          </button>
        )}
        <button
          onClick={() => setActiveTab('active')}
          className={`vybe-tab ${activeTab === 'active' ? 'active' : ''}`}
        >
          {currentUser.role === 'rm' ? 'My Active Clients' : 'Active Clients'}
        </button>
        {currentUser.role !== 'rm' && (
          <button
            onClick={() => setActiveTab('deactivated')}
            className={`vybe-tab ${activeTab === 'deactivated' ? 'active' : ''}`}
          >
            Deactivated Clients
          </button>
        )}
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
            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 rounded-[12px] shadow-lg z-10 overflow-hidden">
              {[
                { value: 'recent' as SortOption, label: 'Most Recent' },
                { value: 'name-asc' as SortOption, label: 'Name (A-Z)' },
                { value: 'name-desc' as SortOption, label: 'Name (Z-A)' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSortBy(option.value);
                    setIsSortDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-[14px] hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${
                    sortBy === option.value 
                      ? 'text-emerald-500 bg-emerald-500/5' 
                      : 'text-black dark:text-white'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Clients Table */}
      <div className="vybe-card overflow-hidden">
        {sortedClients.length > 0 ? (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="vybe-table-head">Client / ID</th>
                  <th className="vybe-table-head">Contact</th>
                  <th className="vybe-table-head">Role / Portfolio</th>
                  {activeTab === 'active' && (
                    <th className="vybe-table-head">RM / Identity</th>
                  )}
                  {activeTab !== 'active' && (
                    <th className="vybe-table-head">Identity Doc</th>
                  )}
                  <th className="vybe-table-head">Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedClients.map((client) => (
                  <tr
                    key={client.id}
                    className="border-b border-border transition-colors last:border-0 hover:bg-[var(--accent)]"
                  >
                    {/* Client / ID */}
                    <td className="px-4 py-4">
                      <div className="text-small font-medium text-foreground">
                        {client.firstName} {client.lastName}
                      </div>
                      <div className="text-caption text-muted-foreground mt-0.5">
                        CL-{String(client.id).padStart(4, '0')}
                      </div>
                    </td>
                    {/* Contact */}
                    <td className="px-4 py-4">
                      <div className="text-small text-foreground">{client.email}</div>
                      <div className="text-caption text-muted-foreground mt-0.5">{client.phone}</div>
                    </td>
                    {/* Role / Portfolio */}
                    <td className="px-4 py-4">
                      <div className="text-small text-foreground">{getRoleLabel(client.primaryRole)}</div>
                      <div className="text-caption text-muted-foreground mt-0.5">{client.portfolioSize}</div>
                    </td>
                    {/* RM / Identity (active tab) or Identity only */}
                    {activeTab === 'active' ? (
                      <td className="px-4 py-4">
                        <div className="text-small text-foreground">
                          {client.assignedRM
                            ? `${client.assignedRM.firstName} ${client.assignedRM.lastName}`
                            : '—'}
                        </div>
                        <div className="mt-1">
                          {client.documentType ? (
                            <span className="vybe-badge vybe-badge-green">
                              {client.documentType === 'aadhaar' ? 'Aadhaar' : 'PAN'}
                            </span>
                          ) : (
                            <span className="text-caption text-muted-foreground">No doc</span>
                          )}
                        </div>
                      </td>
                    ) : (
                      <td className="px-4 py-4">
                        {client.documentType ? (
                          <div className="flex items-center gap-2">
                            <span className="vybe-badge vybe-badge-green">
                              {client.documentType === 'aadhaar' ? 'Aadhaar' : 'PAN'}
                            </span>
                            {client.documentUrl && (
                              <button
                                onClick={() => showSuccess('Document download started')}
                                className="vybe-icon-btn"
                                title="Download document"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="text-caption text-muted-foreground">—</span>
                        )}
                      </td>
                    )}
                    {/* Action */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        {activeTab === 'lead' && (
                          <>
                            <button
                              onClick={() => handleMoveToActive(client)}
                              className="vybe-badge vybe-badge-green cursor-pointer hover:opacity-80 transition-opacity"
                              title="Move to Active Clients"
                            >
                              <UserCheck className="w-3 h-3" />
                              Activate
                            </button>
                            <button
                              onClick={() => handleMoveToDeactivated(client)}
                              className="vybe-badge vybe-badge-red cursor-pointer hover:opacity-80 transition-opacity"
                              title="Move to Deactivated"
                            >
                              <UserX className="w-3 h-3" />
                              Deactivate
                            </button>
                            <button
                              onClick={() => handleDeleteClient(client)}
                              className="vybe-icon-btn hover:text-red-500"
                              title="Delete client"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {activeTab === 'active' && (
                          <>
                            <button
                              onClick={() => handleChangeRM(client)}
                              className="vybe-badge vybe-badge-blue cursor-pointer hover:opacity-80 transition-opacity"
                              title="Change RM"
                            >
                              <RefreshCw className="w-3 h-3" />
                              Change RM
                            </button>
                            <button
                              onClick={() => handleMoveToDeactivated(client)}
                              className="vybe-badge vybe-badge-red cursor-pointer hover:opacity-80 transition-opacity"
                              title="Deactivate"
                            >
                              <UserX className="w-3 h-3" />
                              Deactivate
                            </button>
                          </>
                        )}
                        {activeTab === 'deactivated' && (
                          <button
                            onClick={() => handleReactivate(client)}
                            className="vybe-badge vybe-badge-green cursor-pointer hover:opacity-80 transition-opacity"
                            title="Reactivate Client"
                          >
                            <UserCheck className="w-3 h-3" />
                            Reactivate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-border flex items-center justify-between">
              <div className="text-[14px] text-black/60 dark:text-white/60">
                Page 1 of 1
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
          </>
        ) : (
          <div className="px-6 py-12 text-center">
            <p className="text-[14px] text-black/40 dark:text-white/40">
              No clients found in this category
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}