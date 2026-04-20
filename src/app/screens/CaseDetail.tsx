import { Link, useParams, useNavigate } from 'react-router';
import { useCases, CaseMilestone } from '../contexts/CasesContext';
import { useProperties } from '../contexts/PropertiesContext';
import { ArrowLeft, FileText, MapPin, Calendar, Download, ExternalLink, CheckCircle2, Clock, Building2, TrendingUp, Users, DollarSign, Eye, FileDown, MessageCircle } from 'lucide-react';
import { SideNav } from '../components/SideNav';
import { AdminLayout } from '../components/AdminLayout';
import { useState, useEffect } from 'react';

export function CaseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCase, updateCase } = useCases();
  const { getProperty } = useProperties();
  const [isUpdating, setIsUpdating] = useState(false);

  // Check if user is admin
  const isAdmin = !!localStorage.getItem('vybeAdminUser');
  const backUrl = isAdmin ? '/admin/cases' : '/properties';
  const backLabel = isAdmin ? 'Back to Admin Case Management' : 'Back to Case Management';

  const caseItem = getCase(id || '');

  // Auto-migrate old cases without milestones
  useEffect(() => {
    if (caseItem && (!caseItem.milestones || caseItem.milestones.length === 0)) {
      console.log('Migrating case to add milestones:', caseItem.caseId);
      const defaultMilestones = [
        { id: '1', title: 'Case submitted', status: 'completed' as const, date: new Date(caseItem.dateCreated).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) },
        { id: '2', title: 'Documents reviewed', status: 'pending' as const },
        { id: '3', title: 'Partner assigned', status: 'pending' as const },
        { id: '4', title: 'Application filing', status: 'pending' as const },
        { id: '5', title: 'Authority follow-up', status: 'pending' as const },
        { id: '6', title: 'Case closed', status: caseItem.status === 'Closed' ? 'completed' as const : 'pending' as const, date: caseItem.dateClosed ? new Date(caseItem.dateClosed).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : undefined },
      ];

      const completedCount = defaultMilestones.filter(m => m.status === 'completed').length;
      const progress = Math.round((completedCount / defaultMilestones.length) * 100);

      updateCase(caseItem.id, {
        milestones: defaultMilestones,
        progress,
      });
    }
  }, [caseItem?.id]);

  if (!caseItem) {
    return (
      <div className="flex min-h-screen bg-[#F2F2F2] dark:bg-[#0F0F0F]">
        <SideNav />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-[24px] text-black dark:text-white mb-4">Case not found</h2>
            <Link 
              to="/properties"
              className="text-emerald-500 hover:text-emerald-400 text-[14px] font-medium"
            >
              Back to Case Management
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get the actual property from PropertiesContext if propertyId exists
  const property = caseItem.propertyId ? getProperty(caseItem.propertyId) : null;
  const isHABU = caseItem.serviceRequested === 'HABU Report';
  const hasDocuments = property && property.documents && property.documents.length > 0;
  const caseDocuments = caseItem.documents || [];

  // Debug logging
  console.log('CaseDetail - Case:', caseItem);
  console.log('CaseDetail - Has milestones:', caseItem?.milestones);
  console.log('CaseDetail - Property:', property);
  console.log('CaseDetail - Has documents:', hasDocuments);

  const handleCaseDocumentDownload = (documentName: string, dataUrl?: string) => {
    if (!dataUrl) {
      return;
    }

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = documentName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleMilestoneToggle = async (milestoneId: string) => {
    if (!caseItem || isUpdating) return;
    
    setIsUpdating(true);
    
    const updatedMilestones = caseItem.milestones?.map(milestone => {
      if (milestone.id === milestoneId) {
        // Toggle the milestone status
        const newStatus = milestone.status === 'pending' ? 'completed' : 'pending';
        const newDate = newStatus === 'completed' 
          ? new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
          : undefined;
        
        return {
          ...milestone,
          status: newStatus,
          date: newDate,
        };
      }
      return milestone;
    }) || [];

    // Calculate new progress
    const completedCount = updatedMilestones.filter(m => m.status === 'completed').length;
    const totalCount = updatedMilestones.length;
    const newProgress = Math.round((completedCount / totalCount) * 100);

    // Check if "Case closed" milestone is completed
    const caseClosedMilestone = updatedMilestones.find(m => m.title === 'Case closed');
    const newStatus = caseClosedMilestone?.status === 'completed' ? 'Closed' : 'Open';
    const dateClosed = newStatus === 'Closed' ? new Date().toISOString() : undefined;

    // Update the case
    updateCase(caseItem.id, {
      milestones: updatedMilestones,
      progress: newProgress,
      status: newStatus as 'Open' | 'Closed',
      dateClosed,
    });

    setTimeout(() => setIsUpdating(false), 300);
  };

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

  return (
    <div className="flex min-h-screen bg-[#F2F2F2] dark:bg-[#0F0F0F]">
      <SideNav />
      <div className="flex-1 pt-8 pb-24 px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              to={backUrl}
              className="inline-flex items-center gap-2 text-[14px] text-black/60 dark:text-white/60
                         hover:text-black dark:hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              {backLabel}
            </Link>

            <div className="flex items-start justify-between">
              <div>
                <div className="text-[10px] tracking-[0.05em] uppercase font-bold text-black/40 dark:text-white/40 mb-2">
                  Case Details
                </div>
                <h1 className="text-[32px] tracking-tight text-black dark:text-white leading-none mb-3">
                  {caseItem.caseId}
                </h1>
                
                {/* Service Badge */}
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-[11px] font-medium ${
                  getServiceColor(caseItem.serviceRequested)
                }`}>
                  <FileText className="w-4 h-4" />
                  {caseItem.subService || caseItem.serviceRequested}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Chat Button */}
                <button
                  onClick={() => navigate(`/case/${id}/chat`)}
                  className="flex items-center gap-2 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 
                             text-white rounded-xl transition-all text-[13px] font-medium
                             shadow-[0_4px_12px_rgba(16,185,129,0.3)] hover:shadow-[0_6px_16px_rgba(16,185,129,0.4)]
                             relative"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat
                  {/* Notification Badge */}
                  {caseItem.unreadMessages && caseItem.unreadMessages > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold 
                                   rounded-full w-5 h-5 flex items-center justify-center
                                   shadow-lg animate-pulse">
                      {caseItem.unreadMessages}
                    </span>
                  )}
                </button>

                {/* Status Badge */}
                <div className={`flex items-center gap-2 px-5 py-3 rounded-xl border ${
                  caseItem.status === 'Open'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                    : 'bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60 border-black/10 dark:border-white/10'
                }`}>
                  {caseItem.status === 'Open' ? (
                    <Clock className="w-5 h-5" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5" />
                  )}
                  <span className="text-[14px] font-medium">{caseItem.status}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Case Progress */}
          {caseItem.milestones && caseItem.milestones.length > 0 && (
            <div className="bg-white dark:bg-[#111111] border border-black/5 dark:border-white/5 rounded-2xl p-8 mb-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-[14px] font-medium text-black dark:text-white">
                  Case progress
                </h2>
                <div className="text-[14px] text-black/60 dark:text-white/60">
                  {caseItem.progress || 0}% complete
                </div>
              </div>

              {/* Horizontal Progress Tracker */}
              <div className="relative">
                {/* Desktop: Horizontal Layout */}
                <div className="hidden lg:block">
                  <div className="relative flex items-start justify-between mb-4">
                    {/* Background Line */}
                    <div className="absolute top-[12px] left-0 right-0 h-[2px] bg-black/5 dark:bg-white/5" />
                    
                    {/* Progress Line */}
                    <div 
                      className="absolute top-[12px] left-0 h-[2px] bg-black dark:bg-white transition-all duration-500"
                      style={{ width: `${caseItem.progress || 0}%` }}
                    />

                    {/* Milestones */}
                    {caseItem.milestones.map((milestone, index) => (
                      <div 
                        key={milestone.id} 
                        className="relative flex flex-col items-center"
                        style={{ width: `${100 / caseItem.milestones!.length}%` }}
                      >
                        {/* Status Circle */}
                        <button
                          onClick={() => handleMilestoneToggle(milestone.id)}
                          disabled={isUpdating}
                          className={`
                            relative z-10 w-6 h-6 rounded-full flex-shrink-0 transition-all duration-300 mb-3
                            ${milestone.status === 'completed'
                              ? 'bg-black dark:bg-white cursor-pointer hover:scale-125 shadow-lg'
                              : 'bg-white dark:bg-[#111111] border-2 border-black/10 dark:border-white/10 cursor-pointer hover:border-black/30 dark:hover:border-white/30 hover:scale-110'
                            }
                            ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}
                          `}
                        >
                          {milestone.status === 'completed' && (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="w-2.5 h-2.5 bg-white dark:bg-black rounded-full" />
                            </div>
                          )}
                        </button>

                        {/* Milestone Info */}
                        <div className="text-center max-w-[120px]">
                          <div className={`text-[12px] mb-1 transition-colors leading-tight ${ 
                            milestone.status === 'completed'
                              ? 'text-black dark:text-white font-medium'
                              : 'text-black/40 dark:text-white/40'
                          }`}>
                            {milestone.title}
                          </div>
                          <div className="text-[10px] text-black/40 dark:text-white/40">
                            {milestone.date || 'Pending'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mobile/Tablet: Compact Grid */}
                <div className="lg:hidden">
                  {/* Progress Bar */}
                  <div className="relative w-full h-1 bg-black/5 dark:bg-white/5 rounded-full mb-6 overflow-hidden">
                    <div 
                      className="absolute top-0 left-0 h-full bg-black dark:bg-white rounded-full transition-all duration-500"
                      style={{ width: `${caseItem.progress || 0}%` }}
                    />
                  </div>

                  {/* Grid Layout */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {caseItem.milestones.map((milestone) => (
                      <button
                        key={milestone.id}
                        onClick={() => handleMilestoneToggle(milestone.id)}
                        disabled={isUpdating}
                        className={`
                          flex items-start gap-3 p-3 rounded-xl border transition-all
                          ${milestone.status === 'completed'
                            ? 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10'
                            : 'border-black/5 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20'
                          }
                          ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                        `}
                      >
                        <div className={`
                          w-5 h-5 rounded-full flex-shrink-0 transition-all mt-0.5
                          ${milestone.status === 'completed'
                            ? 'bg-black dark:bg-white'
                            : 'bg-white dark:bg-[#111111] border-2 border-black/10 dark:border-white/10'
                          }
                        `}>
                          {milestone.status === 'completed' && (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white dark:bg-black rounded-full" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 text-left">
                          <div className={`text-[12px] mb-0.5 transition-colors leading-tight ${
                            milestone.status === 'completed'
                              ? 'text-black dark:text-white font-medium'
                              : 'text-black/40 dark:text-white/40'
                          }`}>
                            {milestone.title}
                          </div>
                          <div className="text-[10px] text-black/40 dark:text-white/40">
                            {milestone.date || 'Pending'}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Info Message */}
              <div className="mt-6 pt-6 border-t border-black/5 dark:border-white/5">
                <p className="text-[12px] text-black/40 dark:text-white/40">
                  💡 Click on any milestone to update its status
                </p>
              </div>
            </div>
          )}

          {/* HABU Report Preview Section (Only for closed HABU cases) */}
          {isHABU && caseItem.status === 'Closed' && caseItem.habuPlans && caseItem.habuPlans.length > 0 && (
            <div className="bg-white dark:bg-[#111111] border border-black/5 dark:border-white/5 rounded-2xl p-8 mb-6">
              <div className="mb-8 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <h2 className="text-[18px] font-medium text-black dark:text-white mb-1">
                    HABU Report Ready
                  </h2>
                  <p className="text-[13px] text-black/50 dark:text-white/50">
                    Your High-value Analysis & Best-use Understanding report analysis is now available below
                  </p>
                </div>
                <Link
                  to="/report/habu"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-[13px] font-medium transition-all whitespace-nowrap shadow-[0_2px_4px_rgba(0,0,0,0.02),0_20px_40px_-5px_rgba(16,185,129,0.2)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.02),0_20px_40px_-5px_rgba(16,185,129,0.4)] relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none rounded-xl" />
                  <ExternalLink className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform" />
                  <span className="relative z-10">Open Full Report</span>
                </Link>
              </div>

              {/* HABU Plan Options */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {caseItem.habuPlans.map((plan) => {
                  const getThemeStyles = (theme: string) => {
                    switch (theme) {
                      case 'green':
                        return {
                          bg: 'bg-emerald-50/80 dark:bg-emerald-950/20',
                          border: 'border-emerald-200/50 dark:border-emerald-800/30',
                          iconBg: 'bg-emerald-500/10',
                          iconColor: 'text-emerald-600 dark:text-emerald-400',
                          insightBg: 'bg-emerald-100/80 dark:bg-emerald-900/20',
                          insightBorder: 'border-emerald-200/50 dark:border-emerald-800/30',
                          insightText: 'text-emerald-900 dark:text-emerald-100',
                          highlightBg: 'bg-emerald-500/10',
                          highlightText: 'text-emerald-700 dark:text-emerald-300'
                        };
                      case 'pink':
                        return {
                          bg: 'bg-pink-50/80 dark:bg-pink-950/20',
                          border: 'border-pink-200/50 dark:border-pink-800/30',
                          iconBg: 'bg-pink-500/10',
                          iconColor: 'text-pink-600 dark:text-pink-400',
                          insightBg: 'bg-pink-100/80 dark:bg-pink-900/20',
                          insightBorder: 'border-pink-200/50 dark:border-pink-800/30',
                          insightText: 'text-pink-900 dark:text-pink-100',
                          highlightBg: 'bg-pink-500/10',
                          highlightText: 'text-pink-700 dark:text-pink-300'
                        };
                      case 'yellow':
                        return {
                          bg: 'bg-yellow-50/80 dark:bg-yellow-950/20',
                          border: 'border-yellow-200/50 dark:border-yellow-800/30',
                          iconBg: 'bg-yellow-500/10',
                          iconColor: 'text-yellow-600 dark:text-yellow-400',
                          insightBg: 'bg-yellow-100/80 dark:bg-yellow-900/20',
                          insightBorder: 'border-yellow-200/50 dark:border-yellow-800/30',
                          insightText: 'text-yellow-900 dark:text-yellow-100',
                          highlightBg: 'bg-yellow-500/10',
                          highlightText: 'text-yellow-700 dark:text-yellow-300'
                        };
                      default:
                        return {
                          bg: 'bg-gray-50/80 dark:bg-gray-950/20',
                          border: 'border-gray-200/50 dark:border-gray-800/30',
                          iconBg: 'bg-gray-500/10',
                          iconColor: 'text-gray-600 dark:text-gray-400',
                          insightBg: 'bg-gray-100/80 dark:bg-gray-900/20',
                          insightBorder: 'border-gray-200/50 dark:border-gray-800/30',
                          insightText: 'text-gray-900 dark:text-gray-100',
                          highlightBg: 'bg-gray-500/10',
                          highlightText: 'text-gray-700 dark:text-gray-300'
                        };
                    }
                  };

                  const themeStyles = getThemeStyles(plan.theme);

                  const getIcon = (iconType: string) => {
                    switch (iconType) {
                      case 'clock':
                        return <Clock className={`w-5 h-5 ${themeStyles.iconColor}`} />;
                      case 'building':
                        return <Building2 className={`w-5 h-5 ${themeStyles.iconColor}`} />;
                      case 'trending':
                        return <TrendingUp className={`w-5 h-5 ${themeStyles.iconColor}`} />;
                      default:
                        return <FileText className={`w-5 h-5 ${themeStyles.iconColor}`} />;
                    }
                  };

                  return (
                    <div
                      key={plan.id}
                      className={`border rounded-[24px] p-5 ${themeStyles.bg} ${themeStyles.border} relative`}
                    >
                      {/* Header */}
                      <div className="flex items-start gap-3 mb-4">
                        <div className={`w-8 h-8 rounded-xl ${themeStyles.iconBg} flex items-center justify-center flex-shrink-0`}>
                          {getIcon(plan.icon)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[9px] tracking-[0.05em] uppercase font-bold text-black/40 dark:text-white/40">
                              OPTION {plan.optionNumber}
                            </span>
                            {plan.badge === 'recommended' && (
                              <span className="px-1.5 py-0.5 bg-emerald-500 text-white text-[9px] font-bold tracking-wider uppercase rounded">
                                RECOMMENDED
                              </span>
                            )}
                          </div>
                          <h3 className="text-[16px] font-semibold text-black dark:text-white leading-tight">
                            {plan.title}
                          </h3>
                        </div>
                      </div>

                      {/* Metrics Grid */}
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {plan.metrics?.map((metric, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-xl ${
                              metric.highlight 
                                ? `${themeStyles.highlightBg} border ${themeStyles.border}` 
                                : 'bg-white dark:bg-[#111111] border border-black/5 dark:border-white/5'
                            }`}
                          >
                            <div className="text-[9px] tracking-[0.05em] uppercase font-bold text-black/40 dark:text-white/40 mb-1">
                              {metric.label}
                            </div>
                            <div className={`text-[16px] font-bold tracking-tight ${
                              metric.highlight 
                                ? themeStyles.highlightText 
                                : 'text-black dark:text-white'
                            }`}>
                              {metric.value}
                            </div>
                            {metric.subtext && (
                              <div className="text-[11px] text-black/50 dark:text-white/50 mt-0.5">
                                {metric.subtext}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Insights Section */}
                      <div className={`rounded-xl p-4 border ${themeStyles.insightBg} ${themeStyles.insightBorder}`}>
                        <div className="text-[9px] tracking-[0.05em] uppercase font-bold mb-2"
                             style={{ color: plan.insights?.type === 'why' ? '#16a34a' : '#dc2626' }}>
                          {plan.insights?.type === 'why' ? 'WHY THIS WORKS' : 'FOR MORE DETAILS DOWNLOAD HABU REPORT'}
                        </div>
                        <ul className={`space-y-1.5 ${themeStyles.insightText}`}>
                          {plan.insights?.points?.map((point, index) => (
                            <li key={index} className="flex items-start gap-2 text-[12px]">
                              <span className="text-black/40 dark:text-white/40 mt-0.5">•</span>
                              <span className="flex-1">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Property Information */}
              <div className="bg-white dark:bg-[#111111] border border-black/5 dark:border-white/5 rounded-2xl p-8">
                <h2 className="text-[12px] uppercase tracking-wider text-black/40 dark:text-white/40 mb-6">
                  Property Information
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-[12px] text-black/40 dark:text-white/40 mb-1">Property Name</div>
                    <div className="text-[18px] font-medium text-black dark:text-white">
                      {caseItem.propertyName}
                    </div>
                  </div>

                  <div>
                    <div className="text-[12px] text-black/40 dark:text-white/40 mb-1">Location</div>
                    <div className="flex items-center gap-2 text-[14px] text-black/80 dark:text-white/80">
                      <MapPin className="w-4 h-4 text-black/40 dark:text-white/40" />
                      {caseItem.propertyLocation}
                    </div>
                  </div>

                  {property && (
                    <Link
                      to={`/property/${property.id}/detail`}
                      className="inline-flex items-center gap-2 text-[13px] text-emerald-500 hover:text-emerald-400
                                 font-medium transition-colors mt-2"
                    >
                      View Property Details
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>

              {/* Documents (Only for owned properties) */}
              {property && hasDocuments && (
                <div className="bg-white dark:bg-[#111111] border border-black/5 dark:border-white/5 rounded-2xl p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-[12px] uppercase tracking-wider text-black/40 dark:text-white/40">
                      Linked Documents
                    </h2>
                    <Link
                      to={`/property/${property.id}/documents`}
                      className="text-[13px] text-emerald-500 hover:text-emerald-400 font-medium"
                    >
                      View All
                    </Link>
                  </div>

                  <div className="space-y-3">
                    {property.documents?.slice(0, 5).map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-4 rounded-xl border border-black/5 dark:border-white/5
                                   hover:border-emerald-500/30 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-purple-500" />
                          </div>
                          <div>
                            <div className="text-[14px] font-medium text-black dark:text-white">
                              {doc.name}
                            </div>
                            <div className="text-[12px] text-black/40 dark:text-white/40">
                              {doc.size}
                            </div>
                          </div>
                        </div>

                        <div className={`px-3 py-1 rounded-lg text-[11px] font-medium ${
                          doc.status === 'verified'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                        }`}>
                          {doc.status === 'verified' ? 'Verified' : 'Processing'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Case Documents (Documents attached directly to the case) */}
              {caseDocuments.length > 0 && (
                <div className="bg-white dark:bg-[#111111] border border-black/5 dark:border-white/5 rounded-2xl p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-[12px] uppercase tracking-wider text-black/40 dark:text-white/40">
                      Case Documents
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {caseDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-4 rounded-xl border border-black/5 dark:border-white/5
                                   hover:border-emerald-500/30 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            doc.status === 'requested' ? 'bg-amber-500/10' : 'bg-purple-500/10'
                          }`}>
                            <FileText className="w-5 h-5 text-purple-500" />
                          </div>
                          <div>
                            <div className="text-[14px] font-medium text-black dark:text-white">
                              {doc.name}
                            </div>
                            <div className="text-[12px] text-black/40 dark:text-white/40">
                              {doc.size} • {doc.uploadedDate}
                            </div>
                            {(doc.uploadedByName || doc.uploadedByRole) && (
                              <div className="text-[12px] text-black/40 dark:text-white/40">
                                {doc.status === 'requested' ? 'Requested' : 'Uploaded'} by {doc.uploadedByName || 'Team'}{doc.uploadedByRole ? ` (${doc.uploadedByRole})` : ''}
                              </div>
                            )}
                          </div>
                        </div>

                        {doc.status === 'uploaded' && doc.dataUrl ? (
                          <button
                            onClick={() => handleCaseDocumentDownload(doc.name, doc.dataUrl)}
                            className="p-2 rounded-lg border border-black/10 dark:border-white/10 text-black/40 dark:text-white/40 group-hover:text-emerald-500 hover:border-emerald-500/30"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className={`px-3 py-1 rounded-lg text-[11px] font-medium ${
                            doc.status === 'requested'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                              : 'bg-black/5 dark:bg-white/5 text-black/40 dark:text-white/40'
                          }`}>
                            {doc.status === 'requested' ? 'Requested' : 'Unavailable'}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Message when documents not available */}
              {!property && (
                <div className="bg-white dark:bg-[#111111] border border-black/5 dark:border-white/5 rounded-2xl p-8">
                  <div className="text-center py-6">
                    <FileText className="w-12 h-12 text-black/20 dark:text-white/20 mx-auto mb-3" />
                    <p className="text-[14px] text-black/60 dark:text-white/40">
                      Documents not available for non-owned properties
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Timeline & Metadata */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white dark:bg-[#111111] border border-black/5 dark:border-white/5 rounded-2xl p-6">
                <h2 className="text-[12px] uppercase tracking-wider text-black/40 dark:text-white/40 mb-4">
                  Quick Actions
                </h2>

                <div className="space-y-2">
                  {property && (
                    <Link
                      to={`/property/${property.id}/detail`}
                      className="flex items-center justify-between p-3 rounded-lg border border-black/5 dark:border-white/5
                                 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <Building2 className="w-4 h-4 text-black/40 dark:text-white/40 group-hover:text-emerald-500" />
                        <span className="text-[13px] text-black dark:text-white">View Property</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-black/20 dark:text-white/20 group-hover:text-emerald-500" />
                    </Link>
                  )}

                  {property && (
                    <Link
                      to={`/property/${property.id}/documents`}
                      className="flex items-center justify-between p-3 rounded-lg border border-black/5 dark:border-white/5
                                 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-black/40 dark:text-white/40 group-hover:text-emerald-500" />
                        <span className="text-[13px] text-black dark:text-white">View Documents</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-black/20 dark:text-white/20 group-hover:text-emerald-500" />
                    </Link>
                  )}

                  <Link
                    to="/services"
                    className="flex items-center justify-between p-3 rounded-lg border border-black/5 dark:border-white/5
                              hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-black/40 dark:text-white/40 group-hover:text-emerald-500" />
                      <span className="text-[13px] text-black dark:text-white">Request New Service</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-black/20 dark:text-white/20 group-hover:text-emerald-500" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
