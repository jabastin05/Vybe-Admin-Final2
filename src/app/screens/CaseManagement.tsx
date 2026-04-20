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
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'Sell or Liquidate':
        return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20';
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
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
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
    <div className="flex min-h-screen bg-[#F2F2F2] dark:bg-[#0F0F0F]">
      <SideNav />
      <div className="flex-1 pt-8 pb-24 px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="text-[10px] tracking-[0.05em] uppercase font-bold text-black/40 dark:text-white/40 mb-3">
                  Service Tracking
                </div>
                <h1 className="text-[32px] tracking-tight text-black dark:text-white leading-none mb-3">
                  Case Management
                </h1>
                <p className="text-[14px] text-black/60 dark:text-white/60 max-w-2xl">
                  Track and manage all service requests across your property portfolio
                </p>
              </div>

              <Link
                to="/services"
                className="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-3 rounded-xl
                           text-[14px] font-medium transition-all hover:shadow-lg hover:-translate-y-0.5
                           flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Request Service
              </Link>
            </div>

            {/* Search & Filters */}
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/40 dark:text-white/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by case ID, property, or service..."
                  className="w-full bg-white dark:bg-[#111111] border border-black/10 dark:border-white/10
                             rounded-xl pl-12 pr-4 py-3.5 text-[14px] text-black dark:text-white
                             placeholder:text-black/40 dark:placeholder:text-white/40
                             focus:outline-none focus:border-emerald-500/50 transition-all"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2 bg-white dark:bg-[#111111] border border-black/10 dark:border-white/10 rounded-xl p-1.5">
                {(['All', 'Open', 'Closed'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all ${
                      statusFilter === status
                        ? 'bg-emerald-500 text-white shadow-md'
                        : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-white dark:bg-[#111111] border border-black/5 dark:border-white/5 rounded-xl p-6">
                <div className="text-[12px] text-black/40 dark:text-white/40 uppercase tracking-wide mb-2">
                  Total Cases
                </div>
                <div className="text-[32px] tracking-tight text-black dark:text-white">
                  {cases.length}
                </div>
              </div>
              <div className="bg-white dark:bg-[#111111] border border-black/5 dark:border-white/5 rounded-xl p-6">
                <div className="text-[12px] text-black/40 dark:text-white/40 uppercase tracking-wide mb-2">
                  Open Cases
                </div>
                <div className="text-[32px] tracking-tight text-emerald-500">
                  {cases.filter(c => c.status === 'Open').length}
                </div>
              </div>
              <div className="bg-white dark:bg-[#111111] border border-black/5 dark:border-white/5 rounded-xl p-6">
                <div className="text-[12px] text-black/40 dark:text-white/40 uppercase tracking-wide mb-2">
                  Closed Cases
                </div>
                <div className="text-[32px] tracking-tight text-black/60 dark:text-white/60">
                  {cases.filter(c => c.status === 'Closed').length}
                </div>
              </div>
            </div>
          </div>

          {/* Cases Grid */}
          {filteredCases.length === 0 ? (
            <div className="bg-white dark:bg-[#111111] border border-black/5 dark:border-white/5 rounded-2xl p-16 text-center">
              <FileText className="w-16 h-16 text-black/20 dark:text-white/20 mx-auto mb-4" />
              <h3 className="text-[20px] text-black dark:text-white mb-2">
                {searchQuery || statusFilter !== 'All' ? 'No cases found' : 'No cases yet'}
              </h3>
              <p className="text-[14px] text-black/60 dark:text-white/60 mb-6">
                {searchQuery || statusFilter !== 'All' 
                  ? 'Try adjusting your search or filters'
                  : 'Request a service to create your first case'}
              </p>
              {!searchQuery && statusFilter === 'All' && (
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-3 rounded-xl text-[14px] font-medium transition-all"
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
                  className="group bg-white dark:bg-[#111111] border border-black/5 dark:border-white/5
                             rounded-2xl p-6 hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-[12px] text-black/40 dark:text-white/40 uppercase tracking-wide mb-1">
                        Case ID
                      </div>
                      <div className="text-[18px] font-medium text-black dark:text-white tracking-tight">
                        {caseItem.caseId}
                      </div>
                    </div>

                    {/* Current Milestone Badge */}
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[12px] font-medium ${
                      getMilestoneColor(currentMilestone.title)
                    }`}>
                      <MilestoneIcon className="w-3.5 h-3.5" />
                      {currentMilestone.title}
                    </div>
                  </div>

                  {/* Service Type */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[12px] font-medium ${
                      getServiceColor(caseItem.serviceRequested)
                    }`}>
                      <FileText className="w-3.5 h-3.5" />
                      {caseItem.subService || caseItem.serviceRequested}
                    </div>
                    
                    {/* Property Type Indicator for HABU Reports */}
                    {isOwnProperty(caseItem) && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-medium
                                      bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                        <Building2 className="w-3 h-3" />
                        Own Property
                      </div>
                    )}
                    
                    {isNonOwnProperty(caseItem) && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-medium
                                      bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
                        <MapPinned className="w-3 h-3" />
                        Non-Owned Property
                      </div>
                    )}
                  </div>

                  {/* Property Info */}
                  <div className="space-y-2 mb-5 pb-5 border-b border-black/5 dark:border-white/5">
                    <div className="text-[16px] font-medium text-black dark:text-white">
                      {caseItem.propertyName}
                    </div>
                    <div className="flex items-center gap-2 text-[13px] text-black/60 dark:text-white/60">
                      <MapPin className="w-4 h-4" />
                      {caseItem.propertyLocation}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="text-[12px] text-black/40 dark:text-white/40">
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
                        className="relative flex items-center gap-2 px-3 py-2 bg-emerald-500/10 dark:bg-emerald-500/20 
                                   text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-500/20 
                                   dark:hover:bg-emerald-500/30 transition-all text-[13px] font-medium
                                   border border-emerald-500/20"
                      >
                        {/* Notification Badge - showing for cases with new messages */}
                        {caseItem.status === 'Open' && caseItem.id % 3 === 0 && (
                          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-[10px] font-bold text-white">{Math.floor(Math.random() * 3) + 1}</span>
                          </div>
                        )}
                        <MessageCircle className="w-4 h-4" />
                        Chat
                      </button>
                      
                      {/* View Details Link */}
                      <Link
                        to={`/case/${caseItem.id}`}
                        className="flex items-center gap-2 text-[13px] text-black dark:text-white 
                                   font-medium hover:gap-3 transition-all px-3 py-2 hover:bg-black/5 
                                   dark:hover:bg-white/5 rounded-lg"
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