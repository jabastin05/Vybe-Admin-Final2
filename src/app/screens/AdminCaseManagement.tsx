import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Search, ChevronDown, FileText, MapPin, Clock, CheckCircle2, Building2, MapPinned, MessageCircle, Eye, X, Filter, User, Users, TrendingUp, UserPlus } from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { useCases } from '../contexts/CasesContext';
import { MOCK_SERVICE_PROVIDERS, getServiceProviderName, resolveServiceProviderIdentity } from '../data/mockServiceProviders';


type TabType = 'all' | 'open' | 'closed' | 'unassigned';
type SortOption = 'recent' | 'case-id-asc' | 'case-id-desc' | 'property-asc';

export function AdminCaseManagement() {
  const { cases, updateCase } = useCases();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [isServiceFilterOpen, setIsServiceFilterOpen] = useState(false);
  const [userNameFilter, setUserNameFilter] = useState<string>('all');
  const [isUserNameFilterOpen, setIsUserNameFilterOpen] = useState(false);
  const [partnerNameFilter, setPartnerNameFilter] = useState<string>('all');
  const [isPartnerNameFilterOpen, setIsPartnerNameFilterOpen] = useState(false);
  
  // Status change modal states
  const [isStatusChangeModalOpen, setIsStatusChangeModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusChangeComments, setStatusChangeComments] = useState('');
  
  // Partner assignment modal states
  const [isPartnerAssignmentModalOpen, setIsPartnerAssignmentModalOpen] = useState(false);
  const [newPartnerName, setNewPartnerName] = useState('');
  const [partnerSearchQuery, setPartnerSearchQuery] = useState('');
  
  const [successMessage, setSuccessMessage] = useState('');

  // Get current user role and details
  const getCurrentUser = () => {
    const userData = localStorage.getItem('vybeAdminUser');
    if (userData) {
      const user = JSON.parse(userData);
      const normalizedName = user.role === 'partner'
        ? resolveServiceProviderIdentity(user.email || '', user.name)
        : user.name || 'Admin User';
      return { 
        role: user.role || 'admin', 
        email: user.email || '',
        name: normalizedName
      };
    }
    return { role: 'admin', email: '', name: 'Admin User' };
  };

  const currentUser = getCurrentUser();

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'all' || tabParam === 'open' || tabParam === 'closed' || tabParam === 'unassigned') {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Reset partner filter if the current partner isn't available for the newly selected service
  useEffect(() => {
    const casesForService = serviceFilter === 'all' 
      ? cases 
      : cases.filter(c => c.serviceRequested === serviceFilter);
    const validPartners = new Set(casesForService.map(c => c.partnerName).filter(Boolean));
    
    if (partnerNameFilter !== 'all' && !validPartners.has(partnerNameFilter)) {
      setPartnerNameFilter('all');
    }
  }, [serviceFilter, cases, partnerNameFilter]);

  // Get unique service types, user names, and partner names
  const serviceTypes = ['all', ...Array.from(new Set(cases.map(c => c.serviceRequested)))];
  const userNames = ['all', ...Array.from(new Set(cases.map(c => c.userName).filter(Boolean)))];
  
  // Filter cases for partner extraction based on selected service
  const casesForPartnerFilter = serviceFilter === 'all' 
    ? cases 
    : cases.filter(c => c.serviceRequested === serviceFilter);
  const partnerNames = ['all', ...Array.from(new Set(casesForPartnerFilter.map(c => c.partnerName).filter(Boolean)))];

  // Available execution partners for assignment dropdown
  const availablePartners = MOCK_SERVICE_PROVIDERS.map(getServiceProviderName);

  const filteredCases = cases
    .filter((c) => {
      // Role-based filtering for RM: only show cases from their assigned clients
      if (currentUser.role === 'rm') {
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
        if (c.userName && !assignedClients.includes(c.userName)) {
          return false;
        }
      }

      // Role-based filtering for Service Provider: only show cases assigned to them
      if (currentUser.role === 'partner') {
        // Match by partner name (use currentUser.name or extract from email)
        const partnerName = currentUser.name;
        if (c.partnerName !== partnerName && c.partnerName !== 'Unassigned' && c.partnerName) {
          return false;
        }
      }

      // Filter by tab
      if (activeTab === 'open' && c.status !== 'Open') return false;
      if (activeTab === 'closed' && c.status !== 'Closed') return false;
      if (activeTab === 'unassigned' && c.partnerName && c.partnerName !== 'Unassigned') return false;

      // Filter by search query
      const matchesSearch =
        c.caseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.propertyLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.serviceRequested.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.userName && c.userName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (c.partnerName && c.partnerName.toLowerCase().includes(searchQuery.toLowerCase()));
      if (!matchesSearch) return false;

      // Filter by service type
      if (serviceFilter !== 'all' && c.serviceRequested !== serviceFilter) return false;

      // Filter by user name
      if (userNameFilter !== 'all' && c.userName !== userNameFilter) return false;

      // Filter by partner name
      if (currentUser.role !== 'partner' && partnerNameFilter !== 'all' && c.partnerName !== partnerNameFilter) return false;

      return true;
    });

  // Sort cases
  const sortedCases = [...filteredCases].sort((a, b) => {
    switch (sortBy) {
      case 'case-id-asc':
        return a.caseId.localeCompare(b.caseId);
      case 'case-id-desc':
        return b.caseId.localeCompare(a.caseId);
      case 'property-asc':
        return a.propertyName.localeCompare(b.propertyName);
      case 'recent':
      default:
        return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
    }
  });

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleStatusChange = (caseItem: any) => {
    setSelectedCase(caseItem);
    setNewStatus(caseItem.status);
    setStatusChangeComments('');
    setIsStatusChangeModalOpen(true);
  };

  const handleSaveStatusChange = () => {
    if (!selectedCase || !statusChangeComments.trim()) {
      alert('Please provide comments for the status change');
      return;
    }

    const statusUpdate = {
      id: `status-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: newStatus,
      comments: statusChangeComments,
      changedBy: 'admin' as const,
      changedByName: 'Admin Team',
      changeType: 'status' as const
    };

    updateCase(selectedCase.id, {
      status: newStatus as 'Open' | 'Closed',
      statusHistory: [...(selectedCase.statusHistory || []), statusUpdate]
    });

    setIsStatusChangeModalOpen(false);
    setSelectedCase(null);
    setNewStatus('');
    setStatusChangeComments('');
    showSuccess('Case status updated successfully');
  };

  const handlePartnerAssignment = (caseItem: any) => {
    setSelectedCase(caseItem);
    setNewPartnerName(caseItem.partnerName || '');
    setPartnerSearchQuery('');
    setIsPartnerAssignmentModalOpen(true);
  };

  const handleSavePartnerAssignment = () => {
    if (!selectedCase) {
      return;
    }

    const isUnassigning = newPartnerName === 'Unassigned' || !newPartnerName.trim();
    const partnerToSave = isUnassigning ? '' : newPartnerName;

    const partnerAssignmentUpdate = {
      id: `partner-${Date.now()}`,
      timestamp: new Date().toISOString(),
      partnerName: partnerToSave,
      comments: isUnassigning ? 'Partner unassigned' : `Partner assigned: ${partnerToSave}`,
      changedBy: 'admin' as const,
      changedByName: 'Admin Team',
      changeType: 'partner-assignment' as const
    };

    updateCase(selectedCase.id, {
      partnerName: partnerToSave,
      statusHistory: [...(selectedCase.statusHistory || []), partnerAssignmentUpdate]
    });

    setIsPartnerAssignmentModalOpen(false);
    setSelectedCase(null);
    setNewPartnerName('');
    setPartnerSearchQuery('');
    showSuccess(isUnassigning ? 'Partner unassigned successfully' : 'Partner assigned successfully');
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case 'case-id-asc':
        return 'Case ID (A-Z)';
      case 'case-id-desc':
        return 'Case ID (Z-A)';
      case 'property-asc':
        return 'Property (A-Z)';
      case 'recent':
      default:
        return 'Most Recent';
    }
  };

  const getServiceColor = (service: string) => {
    switch (service) {
      case 'HABU Report':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
      case 'Property Service':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'Lease & Rent':
        return 'bg-primary-700/10 text-primary-700 dark:text-primary-400 border-primary-700/20';
      case 'Sell or Liquidate':
        return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20';
      default:
        return 'bg-neutral-500/10 text-neutral-500 dark:text-neutral-300 border-gray-500/20';
    }
  };

  const getCurrentMilestone = (caseItem: any) => {
    if (!caseItem.milestones || caseItem.milestones.length === 0) {
      return { title: 'Case submitted', status: 'completed' };
    }

    const lastCompleted = caseItem.milestones
      .filter((m: any) => m.status === 'completed')
      .pop();

    const firstPending = caseItem.milestones
      .find((m: any) => m.status === 'pending');

    if (!firstPending) {
      return lastCompleted || caseItem.milestones[caseItem.milestones.length - 1];
    }

    return firstPending;
  };

  const getMilestoneColor = (milestoneTitle: string) => {
    const title = milestoneTitle.toLowerCase();
    if (title.includes('closed')) {
      return 'bg-primary-700/10 text-primary-700 dark:text-primary-400 border-primary-700/20';
    } else if (title.includes('submitted')) {
      return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
    } else if (title.includes('reviewed') || title.includes('filing')) {
      return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
    } else if (title.includes('assigned')) {
      return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20';
    } else if (title.includes('follow-up')) {
      return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20';
    }
    return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
  };

  const getMilestoneIcon = (milestoneTitle: string, status: string) => {
    if (status === 'completed' && milestoneTitle.toLowerCase().includes('closed')) {
      return CheckCircle2;
    }
    return Clock;
  };

  const isOwnProperty = (caseItem: any) => {
    return caseItem.serviceRequested === 'HABU Report' && !!caseItem.propertyId;
  };

  const isNonOwnProperty = (caseItem: any) => {
    return caseItem.serviceRequested === 'HABU Report' && !caseItem.propertyId;
  };

  /* Shared dropdown menu class */
  const dropdownCls = 'absolute right-0 top-full mt-1 min-w-[180px] bg-card border border-border rounded-[var(--radius-card)] shadow-lg z-20 overflow-hidden py-1';
  const dropdownItemCls = (active: boolean) =>
    `w-full text-left px-[var(--space-3)] py-[var(--space-2)] text-small transition-colors ${active ? 'font-medium' : ''}`;
  const filterBtnCls = 'h-[var(--input-height)] px-[var(--space-4)] bg-card border border-border rounded-[var(--radius)] text-small text-foreground hover:bg-accent transition-colors flex items-center gap-[var(--space-2)]';

  return (
    <AdminLayout>
      {/* ── Page header ── */}
      <div className="mb-[var(--space-6)]">
        <h1 className="text-h1 text-foreground mb-[var(--space-1)]">Case Management</h1>
        <p className="text-small text-muted-foreground">
          View and manage all service cases created by clients across the platform.
        </p>
      </div>

      {/* ── Stats strip ── */}
      <div className="grid grid-cols-3 gap-[var(--space-4)] mb-[var(--space-6)]">
        {[
          { label: 'Total Cases',  value: cases.length,                            valueStyle: { color: 'var(--foreground)' } },
          { label: 'Open Cases',   value: cases.filter(c => c.status === 'Open').length,   valueStyle: { color: '#1C75BC' } },
          { label: 'Closed Cases', value: cases.filter(c => c.status === 'Closed').length, valueStyle: { color: 'var(--muted-foreground)' } },
        ].map(({ label, value, valueStyle }) => (
          <div key={label} className="vybe-kpi-card">
            <div className="vybe-kpi-label">{label}</div>
            <div className="vybe-kpi-value" style={valueStyle}>{value}</div>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div className="flex items-center gap-[var(--space-6)] mb-[var(--space-6)]" style={{ borderBottom: '1px solid var(--border)' }}>
        {([
          { key: 'all',        label: 'All Cases' },
          { key: 'unassigned', label: 'New Cases' },
          { key: 'open',       label: 'Open Cases' },
          { key: 'closed',     label: 'Closed Cases' },
        ] as { key: TabType; label: string }[]).map(({ key, label }) => {
          const active = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className="pb-[var(--space-3)] text-small transition-colors"
              style={{
                color: active ? 'var(--foreground)' : 'var(--muted-foreground)',
                fontWeight: active ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)',
                borderBottom: active ? '2px solid var(--foreground)' : '2px solid transparent',
                marginBottom: '-1px',
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* ── Search & Filters ── */}
      <div className="flex items-center gap-[var(--space-3)] mb-[var(--space-6)]">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-[var(--space-3)] top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--muted-foreground)' }} />
          <input
            type="text"
            placeholder="Search by case ID, property, service, or user name…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[var(--input-height)] pl-10 pr-[var(--space-4)] bg-input-background border border-border rounded-[var(--radius)] text-small text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring/40 transition-all"
          />
        </div>

        {/* Service Filter */}
        <div className="relative">
          <button onClick={() => setIsServiceFilterOpen(!isServiceFilterOpen)} className={filterBtnCls}>
            <Filter className="w-4 h-4 text-muted-foreground" />
            {serviceFilter === 'all' ? 'All Services' : serviceFilter}
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>
          {isServiceFilterOpen && (
            <div className={dropdownCls}>
              {serviceTypes.map((service) => (
                <button
                  key={service}
                  onClick={() => { setServiceFilter(service); setIsServiceFilterOpen(false); }}
                  className={dropdownItemCls(serviceFilter === service)}
                  style={{ color: serviceFilter === service ? 'var(--foreground)' : 'var(--muted-foreground)', background: serviceFilter === service ? 'var(--accent)' : '' }}
                  onMouseEnter={e => { if (serviceFilter !== service) e.currentTarget.style.background = 'var(--accent)'; }}
                  onMouseLeave={e => { if (serviceFilter !== service) e.currentTarget.style.background = ''; }}
                >
                  {service === 'all' ? 'All Services' : service}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Name Filter */}
        <div className="relative">
          <button onClick={() => setIsUserNameFilterOpen(!isUserNameFilterOpen)} className={filterBtnCls}>
            <User className="w-4 h-4 text-muted-foreground" />
            {userNameFilter === 'all' ? 'All Users' : userNameFilter}
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>
          {isUserNameFilterOpen && (
            <div className={dropdownCls}>
              {userNames.map((userName) => (
                <button
                  key={userName}
                  onClick={() => { setUserNameFilter(userName); setIsUserNameFilterOpen(false); }}
                  className={dropdownItemCls(userNameFilter === userName)}
                  style={{ color: userNameFilter === userName ? 'var(--foreground)' : 'var(--muted-foreground)', background: userNameFilter === userName ? 'var(--accent)' : '' }}
                  onMouseEnter={e => { if (userNameFilter !== userName) e.currentTarget.style.background = 'var(--accent)'; }}
                  onMouseLeave={e => { if (userNameFilter !== userName) e.currentTarget.style.background = ''; }}
                >
                  {userName === 'all' ? 'All Users' : userName}
                </button>
              ))}
            </div>
          )}
        </div>

        {currentUser.role !== 'partner' && (
          <div className="relative">
            <button onClick={() => setIsPartnerNameFilterOpen(!isPartnerNameFilterOpen)} className={filterBtnCls}>
              <Users className="w-4 h-4 text-muted-foreground" />
              {partnerNameFilter === 'all' ? 'All Partners' : partnerNameFilter}
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>
            {isPartnerNameFilterOpen && (
              <div className={dropdownCls}>
                {partnerNames.map((partnerName) => (
                  <button
                    key={partnerName}
                    onClick={() => { setPartnerNameFilter(partnerName); setIsPartnerNameFilterOpen(false); }}
                    className={dropdownItemCls(partnerNameFilter === partnerName)}
                    style={{ color: partnerNameFilter === partnerName ? 'var(--foreground)' : 'var(--muted-foreground)', background: partnerNameFilter === partnerName ? 'var(--accent)' : '' }}
                    onMouseEnter={e => { if (partnerNameFilter !== partnerName) e.currentTarget.style.background = 'var(--accent)'; }}
                    onMouseLeave={e => { if (partnerNameFilter !== partnerName) e.currentTarget.style.background = ''; }}
                  >
                    {partnerName === 'all' ? 'All Partners' : partnerName}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Sort */}
        <div className="relative">
          <button onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)} className={filterBtnCls}>
            {getSortLabel()}
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>
          {isSortDropdownOpen && (
            <div className={dropdownCls}>
              {([
                { value: 'recent' as SortOption,       label: 'Most Recent' },
                { value: 'case-id-asc' as SortOption,  label: 'Case ID (A–Z)' },
                { value: 'case-id-desc' as SortOption, label: 'Case ID (Z–A)' },
                { value: 'property-asc' as SortOption, label: 'Property (A–Z)' },
              ]).map((option) => (
                <button
                  key={option.value}
                  onClick={() => { setSortBy(option.value); setIsSortDropdownOpen(false); }}
                  className={dropdownItemCls(sortBy === option.value)}
                  style={{ color: sortBy === option.value ? 'var(--foreground)' : 'var(--muted-foreground)', background: sortBy === option.value ? 'var(--accent)' : '' }}
                  onMouseEnter={e => { if (sortBy !== option.value) e.currentTarget.style.background = 'var(--accent)'; }}
                  onMouseLeave={e => { if (sortBy !== option.value) e.currentTarget.style.background = ''; }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Cases Table ── */}
      <div className="vybe-card overflow-hidden">
        {sortedCases.length > 0 ? (
          <>
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--muted)' }}>
                  <th className="vybe-table-head">Case / Service</th>
                  <th className="vybe-table-head">Client / ID</th>
                  <th className="vybe-table-head">Property / Location</th>
                  <th className="vybe-table-head">Status / Progress</th>
                  {currentUser.role !== 'partner' && (
                    <th className="vybe-table-head">Execution Partner</th>
                  )}
                  <th className="vybe-table-head">Milestone</th>
                  <th className="vybe-table-head">Created</th>
                  <th className="vybe-table-head">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedCases.map((caseItem) => {
                  const currentMilestone = getCurrentMilestone(caseItem);
                  const MilestoneIcon = getMilestoneIcon(currentMilestone.title, currentMilestone.status);

                  const getUserId = (userName?: string) => {
                    if (!userName) return '—';
                    const mockUserIds: Record<string, string> = {
                      'Vikram Malhotra': 'USR-0001',
                      'Ananya Iyer': 'USR-0002',
                      'Alexander Sterling': 'USR-0003',
                    };
                    return mockUserIds[userName] || 'USR-0000';
                  };

                  return (
                    <tr
                      key={caseItem.id}
                      style={{ borderBottom: '1px solid var(--border)' }}
                      className="last:border-b-0 transition-colors"
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent)')}
                      onMouseLeave={e => (e.currentTarget.style.background = '')}
                    >
                      {/* Case / Service */}
                      <td className="px-[var(--space-4)] py-[var(--space-3)]">
                        <div className="text-small font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                          {caseItem.caseId}
                        </div>
                        <div className="flex flex-wrap items-center gap-1">
                          <div className={`inline-flex items-center gap-[var(--space-1)] px-[var(--space-2)] py-[var(--space-1)] rounded-[var(--radius-sm)] border text-caption font-medium ${getServiceColor(caseItem.serviceRequested)}`}>
                            <FileText className="w-3 h-3" />
                            {caseItem.subService || caseItem.serviceRequested}
                          </div>
                          {isOwnProperty(caseItem) && (
                            <div className="inline-flex items-center gap-1 px-[var(--space-2)] py-[var(--space-1)] rounded-[var(--radius-sm)] border text-caption font-medium bg-primary-700/10 text-primary-700 dark:text-primary-400 border-primary-700/20">
                              <Building2 className="w-3 h-3" />Own
                            </div>
                          )}
                          {isNonOwnProperty(caseItem) && (
                            <div className="inline-flex items-center gap-1 px-[var(--space-2)] py-[var(--space-1)] rounded-[var(--radius-sm)] border text-caption font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
                              <MapPinned className="w-3 h-3" />Non-Owned
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Client / ID */}
                      <td className="px-[var(--space-4)] py-[var(--space-3)]">
                        {caseItem.userName ? (
                          <>
                            <div className="text-small font-medium" style={{ color: 'var(--foreground)' }}>{caseItem.userName}</div>
                            <div className="text-caption mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{getUserId(caseItem.userName)}</div>
                          </>
                        ) : (
                          <span className="text-small" style={{ color: 'var(--muted-foreground)' }}>—</span>
                        )}
                      </td>

                      {/* Property / Location */}
                      <td className="px-[var(--space-4)] py-[var(--space-3)]">
                        <div className="text-small" style={{ color: 'var(--foreground)' }}>{caseItem.propertyName}</div>
                        <div className="flex items-center gap-[var(--space-1)] text-caption mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                          <MapPin className="w-3 h-3 shrink-0" />
                          {caseItem.propertyLocation}
                        </div>
                      </td>

                      {/* Status / Progress */}
                      <td className="px-[var(--space-4)] py-[var(--space-3)]">
                        <div className="mb-1.5">
                          <div className={`inline-flex items-center gap-[var(--space-1)] px-[var(--space-2)] py-[var(--space-1)] rounded-[var(--radius-sm)] border text-caption font-medium ${
                            caseItem.status === 'Open'
                              ? 'bg-primary-700/10 text-primary-700 dark:text-primary-400 border-primary-700/20'
                              : 'bg-muted text-muted-foreground border-border'
                          }`}>
                            {caseItem.status}
                          </div>
                        </div>
                        <div className="flex items-center gap-[var(--space-2)]">
                          <div className="relative w-5 h-5">
                            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 24 24">
                              <circle cx="12" cy="12" r="9" strokeWidth="3" fill="none" style={{ stroke: 'var(--border)' }} />
                              <circle
                                cx="12" cy="12" r="9"
                                strokeWidth="3" fill="none"
                                strokeDasharray="56.55"
                                strokeDashoffset={56.55 - ((caseItem.progress || 0) / 100) * 56.55}
                                strokeLinecap="round"
                                style={{ stroke: '#1C75BC', transition: 'stroke-dashoffset 0.5s' }}
                              />
                            </svg>
                          </div>
                          <span className="text-caption font-medium" style={{ color: 'var(--muted-foreground)' }}>
                            {caseItem.progress || 0}%
                          </span>
                        </div>
                      </td>

                      {/* Execution Partner */}
                      {currentUser.role !== 'partner' && (
                        <td className="px-[var(--space-4)] py-[var(--space-3)]">
                          <button
                            onClick={() => handlePartnerAssignment(caseItem)}
                            className="flex items-center gap-[var(--space-2)] w-full px-[var(--space-3)] py-[var(--space-1.5)] bg-muted hover:bg-accent rounded-[var(--radius)] border border-border transition-all"
                          >
                            <Users className="w-3 h-3 shrink-0" style={{ color: 'var(--muted-foreground)' }} />
                            <span className={`text-caption truncate flex-1 text-left ${caseItem.partnerName ? 'font-medium' : 'italic'}`}
                              style={{ color: caseItem.partnerName ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
                              {caseItem.partnerName || 'Unassigned'}
                            </span>
                            <ChevronDown className="w-3 h-3 shrink-0" style={{ color: 'var(--muted-foreground)' }} />
                          </button>
                        </td>
                      )}

                      {/* Milestone */}
                      <td className="px-[var(--space-4)] py-[var(--space-3)]">
                        <div className={`inline-flex items-center gap-[var(--space-1)] px-[var(--space-2)] py-[var(--space-1)] rounded-[var(--radius-sm)] border text-caption font-medium ${getMilestoneColor(currentMilestone.title)}`}>
                          <MilestoneIcon className="w-3 h-3" />
                          {currentMilestone.title}
                        </div>
                      </td>

                      {/* Created */}
                      <td className="px-[var(--space-4)] py-[var(--space-3)] text-caption" style={{ color: 'var(--muted-foreground)' }}>
                        {new Date(caseItem.dateCreated).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric'
                        })}
                      </td>

                      {/* Actions */}
                      <td className="px-[var(--space-4)] py-[var(--space-3)]">
                        <div className="flex items-center gap-[var(--space-1)]">
                          <Link
                            to={`/admin/cases/${caseItem.id}/chat`}
                            className="relative vybe-icon-btn"
                            style={{ color: 'var(--muted-foreground)' }}
                            title="View Chat"
                          >
                            {caseItem.status === 'Open' && caseItem.id.toString().includes('sample') && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                <span style={{ fontSize: '9px', fontWeight: 700, color: '#fff' }}>2</span>
                              </div>
                            )}
                            <MessageCircle className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/admin/cases/${caseItem.id}`}
                            className="vybe-icon-btn"
                            style={{ color: 'var(--muted-foreground)' }}
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        ) : (
          <div className="p-16 text-center">
            <FileText className="w-16 h-16 mx-auto mb-[var(--space-4)]" style={{ color: 'var(--border)' }} />
            <h3 className="text-h3 text-foreground mb-[var(--space-2)]">
              {searchQuery || serviceFilter !== 'all' ? 'No cases found' : 'No cases yet'}
            </h3>
            <p className="text-small" style={{ color: 'var(--muted-foreground)' }}>
              {searchQuery || serviceFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Cases will appear here when clients request services'}
            </p>
          </div>
        )}
      </div>

      {/* ── Status Change Modal ── */}
      {isStatusChangeModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-card border border-border rounded-[var(--radius-card)] p-[var(--card-padding-desktop)] w-[420px] max-h-[80vh] overflow-y-auto shadow-xl">

            {/* Modal header */}
            <div className="flex items-center justify-between mb-[var(--space-5)]">
              <h2 className="text-h3 text-foreground">Change Case Status</h2>
              <button
                onClick={() => setIsStatusChangeModalOpen(false)}
                className="p-[var(--space-2)] rounded-[var(--radius)] hover:bg-accent transition-colors"
              >
                <X className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
              </button>
            </div>

            {/* Fields */}
            {[
              { label: 'Case ID', value: selectedCase?.caseId, readOnly: true, type: 'input' },
              { label: 'Current Status', value: selectedCase?.status, readOnly: true, type: 'input' },
            ].map(({ label, value, readOnly }) => (
              <div key={label} className="mb-[var(--space-4)]">
                <label className="block text-caption text-muted-foreground uppercase tracking-wider mb-[var(--space-1)]">{label}</label>
                <input
                  type="text"
                  value={value}
                  readOnly={readOnly}
                  className="w-full h-[var(--input-height)] px-[var(--space-3)] bg-input-background border border-border rounded-[var(--radius)] text-small text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 disabled:opacity-60"
                />
              </div>
            ))}

            <div className="mb-[var(--space-4)]">
              <label className="block text-caption text-muted-foreground uppercase tracking-wider mb-[var(--space-1)]">New Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full h-[var(--input-height)] px-[var(--space-3)] bg-input-background border border-border rounded-[var(--radius)] text-small text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
              >
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div className="mb-[var(--space-5)]">
              <label className="block text-caption text-muted-foreground uppercase tracking-wider mb-[var(--space-1)]">Comments</label>
              <textarea
                value={statusChangeComments}
                onChange={(e) => setStatusChangeComments(e.target.value)}
                rows={4}
                placeholder="Provide reason for status change…"
                className="w-full px-[var(--space-3)] py-[var(--space-2)] bg-input-background border border-border rounded-[var(--radius)] text-small text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring/40 resize-none"
              />
            </div>

            {/* Success */}
            {successMessage && (
              <div className="mb-[var(--space-4)] text-small" style={{ color: '#1C75BC' }}>
                {successMessage}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-[var(--space-3)]">
              <button
                onClick={() => setIsStatusChangeModalOpen(false)}
                className="px-[var(--space-4)] h-[var(--button-height-desktop)] bg-muted hover:bg-accent border border-border rounded-[var(--radius-button)] text-small font-medium text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveStatusChange}
                className="px-[var(--space-4)] h-[var(--button-height-desktop)] rounded-[var(--radius-button)] text-small font-medium transition-colors"
                style={{ background: 'var(--primary)', color: 'var(--primary-foreground)', border: 'none' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.opacity = '0.85'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Partner Assignment Modal ── */}
      {isPartnerAssignmentModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-card border border-border rounded-[var(--radius-card)] p-[var(--card-padding-desktop)] w-[480px] max-h-[80vh] overflow-y-auto shadow-xl">

            {/* Modal header */}
            <div className="flex items-center justify-between mb-[var(--space-4)]">
              <h2 className="text-h3 text-foreground">Assign Service Provider</h2>
              <button
                onClick={() => { setIsPartnerAssignmentModalOpen(false); setPartnerSearchQuery(''); }}
                className="p-[var(--space-2)] rounded-[var(--radius)] hover:bg-accent transition-colors"
              >
                <X className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
              </button>
            </div>

            {/* Case ID read-only */}
            <div className="mb-[var(--space-4)]">
              <label className="block text-caption text-muted-foreground uppercase tracking-wider mb-[var(--space-1)]">Case ID</label>
              <input type="text" value={selectedCase?.caseId} readOnly
                className="w-full h-[var(--input-height)] px-[var(--space-3)] bg-input-background border border-border rounded-[var(--radius)] text-small text-foreground focus:outline-none disabled:opacity-60" />
            </div>

            {/* Search */}
            <div className="relative mb-[var(--space-3)]">
              <Search className="absolute left-[var(--space-3)] top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--muted-foreground)' }} />
              <input
                type="text"
                placeholder="Search service provider…"
                value={partnerSearchQuery}
                onChange={e => setPartnerSearchQuery(e.target.value)}
                className="w-full h-[var(--input-height)] pl-10 pr-[var(--space-4)] bg-input-background border border-border rounded-[var(--radius)] text-small text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring/40"
              />
            </div>

            {/* Provider cards */}
            <div className="space-y-2 max-h-[340px] overflow-y-auto mb-[var(--space-5)]">
              {/* Unassign option */}
              <button
                onClick={() => setNewPartnerName('')}
                className={`w-full text-left p-3 rounded-[var(--radius)] border transition-all ${newPartnerName === '' ? 'border-primary-700 bg-primary-700/5' : 'border-border hover:bg-accent'}`}
              >
                <span className="text-small italic" style={{ color: 'var(--muted-foreground)' }}>Unassigned (Remove Partner)</span>
              </button>

              {MOCK_SERVICE_PROVIDERS
                .filter(p => {
                  const name = getServiceProviderName(p);
                  return name.toLowerCase().includes(partnerSearchQuery.toLowerCase()) ||
                    p.role.toLowerCase().includes(partnerSearchQuery.toLowerCase());
                })
                .map(provider => {
                  const name = getServiceProviderName(provider);
                  const currentLoad = cases.filter(c => c.partnerName === name).length;
                  const isFull = currentLoad >= provider.maxCaseload;
                  return (
                    <button
                      key={provider.id}
                      onClick={() => setNewPartnerName(name)}
                      className={`w-full text-left p-4 rounded-[var(--radius)] border transition-all ${newPartnerName === name ? 'border-primary-700 bg-primary-700/5' : 'border-border hover:bg-accent'}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-small font-medium" style={{ color: 'var(--foreground)' }}>{name}</p>
                          <p className="text-caption mb-1.5" style={{ color: 'var(--muted-foreground)' }}>{provider.role}</p>

                          {/* City coverage chips */}
                          <div className="flex flex-wrap gap-1 mb-1.5">
                            {provider.cityCoverage.map(city => (
                              <span key={city} className="inline-flex items-center px-1.5 py-0.5 rounded text-caption font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                                {city}
                              </span>
                            ))}
                          </div>

                          {/* Case load bar */}
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 bg-neutral-900/10 dark:bg-card/10 rounded-full overflow-hidden" style={{ width: 80 }}>
                              <div
                                className={`h-full rounded-full transition-all ${isFull ? 'bg-red-500' : 'bg-primary-700'}`}
                                style={{ width: `${Math.min((currentLoad / provider.maxCaseload) * 100, 100)}%` }}
                              />
                            </div>
                            <span className={`text-caption font-medium ${isFull ? 'text-red-500' : ''}`}
                              style={!isFull ? { color: 'var(--muted-foreground)' } : undefined}>
                              {currentLoad}/{provider.maxCaseload} cases{isFull ? ' · Full' : ''}
                            </span>
                          </div>
                        </div>

                        {newPartnerName === name && (
                          <div className="w-5 h-5 rounded-full bg-primary-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle2 className="w-3 h-3 text-neutral-0" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
            </div>

            {/* Success */}
            {successMessage && (
              <div className="mb-[var(--space-4)] text-small" style={{ color: '#1C75BC' }}>
                {successMessage}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-[var(--space-3)]">
              <button
                onClick={() => setIsPartnerAssignmentModalOpen(false)}
                className="px-[var(--space-4)] h-[var(--button-height-desktop)] bg-muted hover:bg-accent border border-border rounded-[var(--radius-button)] text-small font-medium text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePartnerAssignment}
                className="px-[var(--space-4)] h-[var(--button-height-desktop)] rounded-[var(--radius-button)] text-small font-medium transition-colors"
                style={{ background: 'var(--primary)', color: 'var(--primary-foreground)', border: 'none' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.opacity = '0.85'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
              >
                Save Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
