import { Link, useNavigate } from 'react-router';
import { useCases } from '../contexts/CasesContext';
import { Search, FileText, MapPin, Clock, CheckCircle2, XCircle, ArrowRight, Filter, Plus, Building2, MapPinned, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { SideNav } from '../components/SideNav';

export function CaseManagement() {
  const { cases } = useCases();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Open' | 'Closed'>('All');

  const filteredCases = cases.filter(c => {
    const matchesSearch = 
      c.caseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.serviceRequested.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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

  // Get current milestone status for display
  const getCurrentMilestone = (caseItem: any) => {
    if (!caseItem.milestones || caseItem.milestones.length === 0) {
      return { title: 'Case submitted', status: 'completed' };
    }
    
    // Find the last completed milestone or first pending one
    const lastCompleted = caseItem.milestones
      .filter((m: any) => m.status === 'completed')
      .pop();
    
    const firstPending = caseItem.milestones
      .find((m: any) => m.status === 'pending');
    
    // If all milestones are completed, show the last one (Case closed)
    if (!firstPending) {
      return lastCompleted || caseItem.milestones[caseItem.milestones.length - 1];
    }
    
    // Show the current active milestone (first pending)
    return firstPending;
  };

  // Get color based on milestone
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

  // Get icon based on milestone
  const getMilestoneIcon = (milestoneTitle: string, status: string) => {
    if (status === 'completed' && milestoneTitle.toLowerCase().includes('closed')) {
      return CheckCircle2;
    }
    return Clock;
  };

  // Check if HABU case is for own property or non-owned property
  const isOwnProperty = (caseItem: any) => {
    return caseItem.serviceRequested === 'HABU Report' && !!caseItem.propertyId;
  };

  const isNonOwnProperty = (caseItem: any) => {
    return caseItem.serviceRequested === 'HABU Report' && !caseItem.propertyId;
  };

  return (
    <div className="flex min-h-screen bg-background dark:bg-neutral-900">
      <SideNav />
      <div className="flex-1 pt-8 pb-24 px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-[var(--space-10)]">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="text-caption tracking-[0.05em] uppercase font-medium text-muted-foreground dark:text-neutral-300/60 mb-3">
                  Service Tracking
                </div>
                <h1 className="text-h1 tracking-tight text-foreground dark:text-neutral-0 leading-none mb-3">
                  Case Management
                </h1>
                <p className="text-small text-neutral-700/80 dark:text-neutral-300/80 max-w-2xl">
                  Track and manage all service requests across your property portfolio
                </p>
              </div>

              <Link
                to="/services"
                className="bg-primary-700 hover:bg-primary-600 text-neutral-0 px-6 py-3 rounded-[var(--radius-card)]
                           text-small font-medium transition-all hover:shadow-lg hover:-translate-y-0.5
                           flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Request Service
              </Link>
            </div>

            {/* Search & Filters */}
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground dark:text-neutral-300/60" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by case ID, property, or service..."
                  className="w-full bg-card border border-black/10 dark:border-white/10
                             rounded-[var(--radius-card)] pl-12 pr-4 py-3.5 text-small text-foreground dark:text-neutral-0
                             placeholder:text-muted-foreground dark:placeholder:text-neutral-300/60
                             focus:outline-none focus:border-primary-700/50 transition-all"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2 bg-card border border-black/10 dark:border-white/10 rounded-[var(--radius-card)] p-1.5">
                {(['All', 'Open', 'Closed'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-[var(--radius)] text-small font-medium transition-all ${
                      statusFilter === status
                        ? 'bg-primary-700 text-neutral-0 shadow-md'
                        : 'text-neutral-700/80 dark:text-neutral-300/80 hover:text-foreground dark:hover:text-neutral-0'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-card border border-black/5 dark:border-white/5 rounded-[var(--radius-card)] p-6">
                <div className="text-caption text-muted-foreground dark:text-neutral-300/60 uppercase tracking-wide mb-2">
                  Total Cases
                </div>
                <div className="text-h1 tracking-tight text-foreground dark:text-neutral-0">
                  {cases.length}
                </div>
              </div>
              <div className="bg-card border border-black/5 dark:border-white/5 rounded-[var(--radius-card)] p-6">
                <div className="text-caption text-muted-foreground dark:text-neutral-300/60 uppercase tracking-wide mb-2">
                  Open Cases
                </div>
                <div className="text-h1 tracking-tight text-primary-700">
                  {cases.filter(c => c.status === 'Open').length}
                </div>
              </div>
              <div className="bg-card border border-black/5 dark:border-white/5 rounded-[var(--radius-card)] p-6">
                <div className="text-caption text-muted-foreground dark:text-neutral-300/60 uppercase tracking-wide mb-2">
                  Closed Cases
                </div>
                <div className="text-h1 tracking-tight text-neutral-700/80 dark:text-neutral-300/80">
                  {cases.filter(c => c.status === 'Closed').length}
                </div>
              </div>
            </div>
          </div>

          {/* Cases Grid */}
          {filteredCases.length === 0 ? (
            <div className="bg-card border border-black/5 dark:border-white/5 rounded-[var(--radius-card)] p-16 text-center">
              <FileText className="w-16 h-16 text-foreground/20 dark:text-neutral-0/20 mx-auto mb-4" />
              <h3 className="text-h3 text-foreground dark:text-neutral-0 mb-2">
                {searchQuery || statusFilter !== 'All' ? 'No cases found' : 'No cases yet'}
              </h3>
              <p className="text-small text-neutral-700/80 dark:text-neutral-300/80 mb-6">
                {searchQuery || statusFilter !== 'All' 
                  ? 'Try adjusting your search or filters'
                  : 'Request a service to create your first case'}
              </p>
              {!searchQuery && statusFilter === 'All' && (
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 bg-primary-700 hover:bg-primary-600 text-neutral-0 px-6 py-3 rounded-[var(--radius-card)] text-small font-medium transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Request Service
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredCases.map((caseItem) => {
                const currentMilestone = getCurrentMilestone(caseItem);
                const MilestoneIcon = getMilestoneIcon(currentMilestone.title, currentMilestone.status);
                
                return (
                <div
                  key={caseItem.id}
                  className="group bg-card border border-black/5 dark:border-white/5
                             rounded-[var(--radius-card)] p-6 hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-caption text-muted-foreground dark:text-neutral-300/60 uppercase tracking-wide mb-1">
                        Case ID
                      </div>
                      <div className="text-h3 font-medium text-foreground dark:text-neutral-0 tracking-tight">
                        {caseItem.caseId}
                      </div>
                    </div>

                    {/* Current Milestone Badge */}
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius)] border text-caption font-medium ${
                      getMilestoneColor(currentMilestone.title)
                    }`}>
                      <MilestoneIcon className="w-3.5 h-3.5" />
                      {currentMilestone.title}
                    </div>
                  </div>

                  {/* Service Type */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius)] border text-caption font-medium ${
                      getServiceColor(caseItem.serviceRequested)
                    }`}>
                      <FileText className="w-3.5 h-3.5" />
                      {caseItem.subService || caseItem.serviceRequested}
                    </div>
                    
                    {/* Property Type Indicator for HABU Reports */}
                    {isOwnProperty(caseItem) && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[var(--radius)] border text-caption font-medium
                                      bg-primary-700/10 text-primary-700 dark:text-primary-400 border-primary-700/20">
                        <Building2 className="w-3 h-3" />
                        Own Property
                      </div>
                    )}
                    
                    {isNonOwnProperty(caseItem) && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[var(--radius)] border text-caption font-medium
                                      bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
                        <MapPinned className="w-3 h-3" />
                        Non-Owned Property
                      </div>
                    )}
                  </div>

                  {/* Property Info */}
                  <div className="space-y-2 mb-5 pb-5 border-b border-black/5 dark:border-white/5">
                    <div className="text-[16px] font-medium text-foreground dark:text-neutral-0">
                      {caseItem.propertyName}
                    </div>
                    <div className="flex items-center gap-2 text-small text-neutral-700/80 dark:text-neutral-300/80">
                      <MapPin className="w-4 h-4" />
                      {caseItem.propertyLocation}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="text-caption text-muted-foreground dark:text-neutral-300/60">
                      Created {new Date(caseItem.dateCreated).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Chat Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/case/${caseItem.id}/chat`);
                        }}
                        className="relative flex items-center gap-2 px-3 py-2 bg-primary-700/10 dark:bg-primary-700/20 
                                   text-primary-700 dark:text-primary-400 rounded-[var(--radius)] hover:bg-primary-700/20 
                                   dark:hover:bg-primary-700/30 transition-all text-small font-medium
                                   border border-primary-700/20"
                      >
                        {/* Notification Badge - showing for cases with new messages */}
                        {caseItem.status === 'Open' && caseItem.id % 3 === 0 && (
                          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-caption font-medium text-neutral-0">{Math.floor(Math.random() * 3) + 1}</span>
                          </div>
                        )}
                        <MessageCircle className="w-4 h-4" />
                        Chat
                      </button>
                      
                      {/* View Details Link */}
                      <Link
                        to={`/case/${caseItem.id}`}
                        className="flex items-center gap-2 text-small text-foreground dark:text-neutral-0 
                                   font-medium hover:gap-3 transition-all px-3 py-2 hover:bg-neutral-900/5 
                                   dark:hover:bg-card/5 rounded-[var(--radius)]"
                      >
                        View Details
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              )})}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}