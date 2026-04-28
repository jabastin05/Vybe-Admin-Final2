import { Building2, TrendingUp, Clock, CheckCircle2, AlertCircle, ArrowRight, BarChart3, Calendar, IndianRupee, Plus, Zap, Shield, Target, FileText } from 'lucide-react';
import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import { SideNav } from '../components/SideNav';
import { ThemeToggle } from '../components/ThemeToggle';
import { NotificationDropdown } from '../components/NotificationDropdown';

export function PortfolioDashboard() {
  const [hasProperties, setHasProperties] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const hasAdded = localStorage.getItem('vybeHasProperties') === 'true';
    setHasProperties(hasAdded);

    const data = localStorage.getItem('vybeOnboardingData');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (parsed.fullName) {
          setUserName(parsed.fullName.split(' ')[0]);
        }
      } catch (e) {}
    }
  }, []);
  // Mock portfolio data
  const portfolioMetrics = {
    totalProjects: 8,
    activeProjects: 3,
    totalValue: '₹245 Cr',
    completedMilestones: 47,
    totalMilestones: 120,
    avgProgress: 42,
  };

  const activeProjects = [
    {
      id: 'prop-001',
      caseId: 'VYBE-2024-001',
      location: 'Whitefield, Bangalore',
      parcelSize: '2.4 acres',
      phase: 'Regulatory Approvals',
      phaseNumber: 2,
      progress: 60,
      status: 'on-track',
      daysElapsed: 178,
      totalDays: 1260,
      nextMilestone: 'Environmental Clearance',
      estimatedValue: '₹85 Cr',
      timeline: 'Aug 2024',
    },
    {
      id: 'prop-002',
      caseId: 'VYBE-2024-002',
      location: 'Baner, Pune',
      parcelSize: '1.8 acres',
      phase: 'Construction',
      phaseNumber: 3,
      progress: 25,
      status: 'at-risk',
      daysElapsed: 245,
      totalDays: 980,
      nextMilestone: 'Foundation Complete',
      estimatedValue: '₹62 Cr',
      timeline: 'Feb 2025',
    },
    {
      id: 'prop-003',
      caseId: 'VYBE-2024-003',
      location: 'Gachibowli, Hyderabad',
      parcelSize: '3.1 acres',
      phase: 'Pre-Development',
      phaseNumber: 1,
      progress: 85,
      status: 'delayed',
      daysElapsed: 120,
      totalDays: 140,
      nextMilestone: 'Partner Assignment',
      estimatedValue: '₹98 Cr',
      timeline: 'Delayed 12 days',
    },
  ];

  const recentActivity = [
    { type: 'milestone', project: 'VYBE-2024-001', action: 'Fire & Safety NOC approved', time: '2 hours ago', status: 'completed' },
    { type: 'alert', project: 'VYBE-2024-003', action: 'Legal due diligence delayed', time: '5 hours ago', status: 'delayed' },
    { type: 'milestone', project: 'VYBE-2024-002', action: 'Site mobilization completed', time: '1 day ago', status: 'completed' },
    { type: 'update', project: 'VYBE-2024-001', action: 'Environmental clearance in progress', time: '2 days ago', status: 'active' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return { bg: 'bg-primary-700/10', text: 'text-primary-700 dark:text-primary-400', border: 'border-primary-700/20', dot: 'bg-primary-700' };
      case 'delayed':
        return { bg: 'bg-orange-500/10', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-500/20', dot: 'bg-orange-500' };
      case 'at-risk':
        return { bg: 'bg-red-500/10', text: 'text-red-600 dark:text-red-400', border: 'border-red-500/20', dot: 'bg-red-500' };
      default:
        return { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500/20', dot: 'bg-blue-500' };
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-neutral-900 transition-colors duration-300">
      <SideNav />
      
      {/* Header - Full Width */}
      <div className="border-b border-black/5 dark:border-white/10 bg-card dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            {/* Left: Page Title */}
            {hasProperties ? (
              <div>
                <div className="text-caption tracking-wider uppercase text-muted-foreground dark:text-neutral-0/50 mb-2">
                  Portfolio Overview
                </div>
                <div className="text-h1 tracking-tight text-foreground dark:text-neutral-0">
                  Dashboard
                </div>
                <p className="text-small text-muted-foreground dark:text-neutral-300/80 mt-1">
                  Comprehensive view of all property investments and performance
                </p>
              </div>
            ) : (
              <div>
                <div className="text-caption tracking-wider uppercase text-[#B45309] mb-2 font-medium">
                  Command Center
                </div>
                <div className="text-h1 tracking-tight text-foreground dark:text-neutral-0 font-medium">
                  Welcome{userName ? `, ${userName}` : ''}
                </div>
                <p className="text-small text-muted-foreground dark:text-neutral-300/80 mt-1">
                  Your intelligence vectors are ready to be activated
                </p>
              </div>
            )}

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              <NotificationDropdown />
              {hasProperties && (
                <Link
                  to="/upload"
                  className="inline-flex items-center gap-2 bg-neutral-900 dark:bg-card text-neutral-0 dark:text-foreground px-6 py-3 rounded-[var(--radius-card)] hover:bg-neutral-900/90 dark:hover:bg-card/90 transition-all text-small font-medium shadow-[0_4px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_20px_rgba(255,255,255,0.1)]"
                >
                  <Building2 className="w-4 h-4" />
                  Add Property
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {!hasProperties ? (
          <div className="max-w-6xl mx-auto">
            {/* Hero Add Property CTA */}
            <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#FFC700]/20 via-white/90 to-white/50 dark:from-[#FFC700]/10 dark:via-[#1A1A1A]/90 dark:to-[#1A1A1A]/50 border-2 border-[#F59E0B]/30 dark:border-[#F59E0B]/20 p-16 text-center shadow-[0_20px_60px_rgba(255,199,0,0.25)] dark:shadow-[0_20px_60px_rgba(255,199,0,0.15)] backdrop-blur-xl mb-20">
              {/* Animated background accents */}
              <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#F59E0B]/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
              <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#FEF3C7]/15 rounded-full blur-[100px] pointer-events-none" />
              
              <div className="relative z-10">
                {/* Icon */}
                <div className="w-32 h-32 bg-gradient-to-br from-[#FFC700] to-[#FFD633] rounded-[28px] mx-auto flex items-center justify-center mb-8 shadow-[0_16px_48px_rgba(255,199,0,0.4)] dark:shadow-[0_16px_48px_rgba(255,199,0,0.3)] relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <Building2 className="w-16 h-16 text-foreground relative z-10" strokeWidth={2} />
                </div>
                
                {/* Heading */}
                <h1 className="font-black tracking-tight text-foreground dark:text-neutral-0 mb-6 leading-tight font-normal text-[40px]">
                  Start by adding your property.
                </h1>
                
                {/* Subheading */}
                <p className="text-h3 text-foreground/70 dark:text-neutral-0/70 max-w-2xl mx-auto mb-12 leading-relaxed font-normal">
                  VYBE analyzes your land and shows you what to build, what to do next, and how to create the most value from it.
                </p>
                
                {/* Primary CTA */}
                <Link
                  to="/upload"
                  className="inline-flex items-center gap-4 bg-neutral-900 dark:bg-card text-neutral-0 dark:text-foreground px-12 py-5 rounded-[var(--radius-card)] hover:bg-neutral-900/90 dark:hover:bg-card/90 transition-all text-[16px] font-medium shadow-[0_12px_32px_rgba(0,0,0,0.25)] dark:shadow-[0_12px_32px_rgba(255,255,255,0.25)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.35)] dark:hover:shadow-[0_16px_40px_rgba(255,255,255,0.35)] hover:-translate-y-1 hover:scale-105 group"
                >
                  <Plus className="w-6 h-6 transition-transform group-hover:rotate-90 duration-300" strokeWidth={3} />
                  <span>Add Property to VYBE</span>
                  <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-2 duration-300" strokeWidth={3} />
                </Link>
                
                {/* Trust Indicator */}
                <div className="mt-[var(--space-10)] flex items-center justify-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-primary-900 border-2 border-white dark:border-neutral-900" />
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white dark:border-neutral-900" />
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white dark:border-neutral-900" />
                  </div>
                  <p className="text-small text-neutral-700/80 dark:text-neutral-300/80 font-medium">
                    Join 500+ UHNIs managing ₹2,400+ Cr in assets
                  </p>
                </div>
              </div>
            </div>

            {/* Unlockable Capabilities Section */}
            <div>
              {/* Section Header */}
              <div className="text-center mb-[var(--space-12)]">
                <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-neutral-900/5 dark:bg-card/5 border border-black/10 dark:border-white/10 mb-6">
                  <Zap className="w-4 h-4 text-[#B45309]" />
                  <span className="text-caption tracking-[0.15em] uppercase text-neutral-700/80 dark:text-neutral-300/80 font-medium">
                    Platform Capabilities
                  </span>
                </div>
                <h2 className="text-[40px] tracking-tight text-foreground dark:text-neutral-0 font-medium leading-tight mb-4">
                  What You'll Unlock
                </h2>
                <p className="text-[16px] text-neutral-700/80 dark:text-neutral-300/80 max-w-2xl mx-auto leading-relaxed">
                  Adding your first property activates VYBE's complete intelligence infrastructure
                </p>
              </div>

              {/* Capability Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-[var(--space-12)]">
                {/* HABU Feasibility Report */}
                <div className="group relative bg-card/80 dark:bg-neutral-900 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] rounded-[var(--radius-card)] p-10 shadow-[0_8px_32px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_12px_48px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all duration-500 overflow-hidden">
                  {/* Gradient accent */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FFC700] via-amber-400 to-[#FFD633]" />
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#F59E0B]/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
                  
                  <div className="relative z-10">
                    {/* Icon & Badge */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-16 h-16 rounded-[var(--radius-card)] bg-gradient-to-br from-[#FFC700] to-[#FFD633] flex items-center justify-center shadow-[0_8px_24px_rgba(255,199,0,0.3)]">
                        <FileText className="w-8 h-8 text-foreground" strokeWidth={2.5} />
                      </div>
                      <div className="px-3 py-1.5 rounded-[var(--radius)] bg-[#F59E0B]/10 border border-[#F59E0B]/20">
                        <span className="text-caption tracking-wider uppercase text-[#B45309] font-medium">
                          AI-Powered
                        </span>
                      </div>
                    </div>
                    
                    {/* Title & Description */}
                    <h3 className="text-h2 font-medium text-foreground dark:text-neutral-0 mb-3 tracking-tight">
                      Generate HABU Feasibility Report
                    </h3>
                    <p className="text-small text-foreground/70 dark:text-neutral-0/70 leading-relaxed mb-6">
                      Get AI-generated Highest & Best Use analysis with detailed feasibility reports covering market dynamics, ROI projections, and regulatory pathways.
                    </p>
                    
                    {/* Features List */}
                    <div className="space-y-2.5">
                      {[
                        'Multi-scenario development analysis',
                        'Predictive ROI modeling & timelines',
                        'Regulatory compliance roadmap',
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <div className="w-1 h-1 rounded-full bg-[#F59E0B] mt-2 flex-shrink-0" />
                          <span className="text-small text-neutral-700/80 dark:text-neutral-300/80">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sell Property */}
                <div className="group relative bg-card/80 dark:bg-neutral-900 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] rounded-[var(--radius-card)] p-10 shadow-[0_8px_32px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_12px_48px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all duration-500 overflow-hidden">
                  {/* Gradient accent */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-700 via-primary-600 to-[#28FF6E]" />
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-700/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
                  
                  <div className="relative z-10">
                    {/* Icon & Badge */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-16 h-16 rounded-[var(--radius-card)] bg-gradient-to-br from-primary-700 to-[#28FF6E] flex items-center justify-center shadow-[0_8px_24px_rgba(40,255,110,0.3)]">
                        <TrendingUp className="w-8 h-8 text-foreground" strokeWidth={2.5} />
                      </div>
                      <div className="px-3 py-1.5 rounded-[var(--radius)] bg-primary-700/10 border border-primary-700/20">
                        <span className="text-caption tracking-wider uppercase text-primary-700 dark:text-primary-400 font-medium">
                          Premium
                        </span>
                      </div>
                    </div>
                    
                    {/* Title & Description */}
                    <h3 className="text-h2 font-medium text-foreground dark:text-neutral-0 mb-3 tracking-tight">
                      Sell Property
                    </h3>
                    <p className="text-small text-foreground/70 dark:text-neutral-0/70 leading-relaxed mb-6">
                      Access our network of verified institutional buyers and UHNIs. Get competitive valuations and execute transactions with complete legal support.
                    </p>
                    
                    {/* Features List */}
                    <div className="space-y-2.5">
                      {[
                        'Institutional buyer network access',
                        'AI-powered market valuation',
                        'End-to-end transaction management',
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <div className="w-1 h-1 rounded-full bg-primary-700 mt-2 flex-shrink-0" />
                          <span className="text-small text-neutral-700/80 dark:text-neutral-300/80">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Lease Property */}
                <div className="group relative bg-card/80 dark:bg-neutral-900 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] rounded-[var(--radius-card)] p-10 shadow-[0_8px_32px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_12px_48px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all duration-500 overflow-hidden">
                  {/* Gradient accent */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600" />
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
                  
                  <div className="relative z-10">
                    {/* Icon & Badge */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-16 h-16 rounded-[var(--radius-card)] bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-[0_8px_24px_rgba(99,102,241,0.3)]">
                        <Building2 className="w-8 h-8 text-neutral-0" strokeWidth={2.5} />
                      </div>
                      <div className="px-3 py-1.5 rounded-[var(--radius)] bg-blue-500/10 border border-blue-500/20">
                        <span className="text-caption tracking-wider uppercase text-blue-600 dark:text-blue-400 font-medium">
                          Recurring
                        </span>
                      </div>
                    </div>
                    
                    {/* Title & Description */}
                    <h3 className="text-h2 font-medium text-foreground dark:text-neutral-0 mb-3 tracking-tight">
                      Lease Property
                    </h3>
                    <p className="text-small text-foreground/70 dark:text-neutral-0/70 leading-relaxed mb-6">
                      Connect with verified tenants and corporate lessees. Automated rent collection, compliance tracking, and lease agreement management.
                    </p>
                    
                    {/* Features List */}
                    <div className="space-y-2.5">
                      {[
                        'Pre-screened tenant matching',
                        'Automated lease documentation',
                        'Revenue tracking & reporting',
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <div className="w-1 h-1 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                          <span className="text-small text-neutral-700/80 dark:text-neutral-300/80">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Legal Help */}
                <div className="group relative bg-card/80 dark:bg-neutral-900 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] rounded-[var(--radius-card)] p-10 shadow-[0_8px_32px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_12px_48px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all duration-500 overflow-hidden">
                  {/* Gradient accent */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-orange-500 to-amber-500" />
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-500/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
                  
                  <div className="relative z-10">
                    {/* Icon & Badge */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-16 h-16 rounded-[var(--radius-card)] bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-[0_8px_24px_rgba(239,68,68,0.3)]">
                        <Shield className="w-8 h-8 text-neutral-0" strokeWidth={2.5} />
                      </div>
                      <div className="px-3 py-1.5 rounded-[var(--radius)] bg-red-500/10 border border-red-500/20">
                        <span className="text-caption tracking-wider uppercase text-red-600 dark:text-red-400 font-medium">
                          Expert
                        </span>
                      </div>
                    </div>
                    
                    {/* Title & Description */}
                    <h3 className="text-h2 font-medium text-foreground dark:text-neutral-0 mb-3 tracking-tight">
                      Legal Help
                    </h3>
                    <p className="text-small text-foreground/70 dark:text-neutral-0/70 leading-relaxed mb-6">
                      On-demand access to real estate legal experts for title verification, contract review, dispute resolution, and regulatory compliance guidance.
                    </p>
                    
                    {/* Features List */}
                    <div className="space-y-2.5">
                      {[
                        'Title & encumbrance verification',
                        'Contract drafting & review',
                        '24/7 legal advisory access',
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <div className="w-1 h-1 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                          <span className="text-small text-neutral-700/80 dark:text-neutral-300/80">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Development Consultation */}
                <div className="group relative bg-card/80 dark:bg-neutral-900 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] rounded-[var(--radius-card)] p-10 shadow-[0_8px_32px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_12px_48px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all duration-500 overflow-hidden">
                  {/* Gradient accent */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500" />
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
                  
                  <div className="relative z-10">
                    {/* Icon & Badge */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-16 h-16 rounded-[var(--radius-card)] bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-[0_8px_24px_rgba(139,92,246,0.3)]">
                        <Target className="w-8 h-8 text-neutral-0" strokeWidth={2.5} />
                      </div>
                      <div className="px-3 py-1.5 rounded-[var(--radius)] bg-violet-500/10 border border-violet-500/20">
                        <span className="text-caption tracking-wider uppercase text-violet-600 dark:text-violet-400 font-medium">
                          Strategic
                        </span>
                      </div>
                    </div>
                    
                    {/* Title & Description */}
                    <h3 className="text-h2 font-medium text-foreground dark:text-neutral-0 mb-3 tracking-tight">
                      Development Consultation
                    </h3>
                    <p className="text-small text-foreground/70 dark:text-neutral-0/70 leading-relaxed mb-6">
                      Expert guidance from architects, engineers, and project managers to plan and execute development projects from concept to completion.
                    </p>
                    
                    {/* Features List */}
                    <div className="space-y-2.5">
                      {[
                        'Architectural design consultation',
                        'Project feasibility & planning',
                        'Contractor & vendor network',
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <div className="w-1 h-1 rounded-full bg-violet-500 mt-2 flex-shrink-0" />
                          <span className="text-small text-neutral-700/80 dark:text-neutral-300/80">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="text-center pt-12 border-t border-black/5 dark:border-white/10">
                <Link
                  to="/upload"
                  className="inline-flex items-center gap-3 bg-[#F59E0B] hover:bg-[#FEF3C7] text-foreground px-10 py-4 rounded-[var(--radius-card)] transition-all text-[15px] font-medium shadow-[0_8px_24px_rgba(255,199,0,0.3)] hover:shadow-[0_12px_32px_rgba(255,199,0,0.4)] hover:-translate-y-0.5 group"
                >
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" strokeWidth={3} />
                  <span>Get Started Now</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" strokeWidth={3} />
                </Link>
                <p className="text-small text-muted-foreground dark:text-neutral-0/50 mt-4">
                  Takes less than 5 minutes to add your first property
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-4 gap-4 mb-[var(--space-10)]">
          {/* Total Projects */}
          <div className="bg-card border border-black/5 dark:border-white/5 rounded-[var(--radius-card)] p-6">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-4 h-4 text-blue-500" />
              <div className="text-caption tracking-widest uppercase text-muted-foreground dark:text-neutral-300/60">
                Total Projects
              </div>
            </div>
            <div className="text-h1 tracking-tight text-foreground dark:text-neutral-0/95 font-normal mb-1">
              {portfolioMetrics.totalProjects}
            </div>
            <div className="text-caption text-primary-700 dark:text-primary-400">
              {portfolioMetrics.activeProjects} active
            </div>
          </div>

          {/* Portfolio Value */}
          

          {/* Overall Progress */}
          <div className="bg-card border border-black/5 dark:border-white/5 rounded-[var(--radius-card)] p-6">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-primary-700" />
              <div className="text-caption tracking-widest uppercase text-muted-foreground dark:text-neutral-300/60">
                Avg Progress
              </div>
            </div>
            <div className="text-h1 tracking-tight text-foreground dark:text-neutral-0/95 font-normal mb-3">
              {portfolioMetrics.avgProgress}%
            </div>
            <div className="h-2 bg-neutral-900/5 dark:bg-card/5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-primary-700 rounded-full" style={{ width: `${portfolioMetrics.avgProgress}%` }}></div>
            </div>
          </div>

          {/* Milestones */}
          <div className="bg-card border border-black/5 dark:border-white/5 rounded-[var(--radius-card)] p-6">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-orange-500" />
              <div className="text-caption tracking-widest uppercase text-muted-foreground dark:text-neutral-300/60">
                Milestones
              </div>
            </div>
            <div className="flex items-baseline gap-1 mb-1">
              <div className="text-h1 tracking-tight text-foreground dark:text-neutral-0/95 font-normal">
                {portfolioMetrics.completedMilestones}
              </div>
              <div className="text-[16px] text-muted-foreground dark:text-neutral-300/60">
                / {portfolioMetrics.totalMilestones}
              </div>
            </div>
            <div className="text-caption text-muted-foreground dark:text-neutral-0/50">
              Completed
            </div>
          </div>
        </div>

        {/* Active Projects Section */}
        <div className="mb-[var(--space-10)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[16px] tracking-tight text-foreground dark:text-neutral-0/95 font-medium mb-1">
                Active Projects
              </h2>
              <p className="text-small text-muted-foreground dark:text-neutral-300/60">
                Real-time execution tracking across all phases
              </p>
            </div>
            <Link 
              to="/properties"
              className="inline-flex items-center gap-2 text-small text-neutral-700/80 dark:text-neutral-300/80 hover:text-foreground dark:hover:text-neutral-0 transition-colors"
            >
              View all properties
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {activeProjects.map((project) => {
              const statusColors = getStatusColor(project.status);
              
              // Determine the CTA based on status - all active projects go to execution tracker
              const cta = {
                text: 'View Progress',
                link: `/property/${project.id}/execution-tracker`,
              };
              
              return (
                <Link 
                  key={project.id}
                  to={cta.link}
                  className="block group bg-card/80 dark:bg-neutral-900 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] rounded-[var(--radius-card)] p-8 hover:border-black/[0.12] dark:hover:border-white/[0.12] transition-all duration-500 shadow-[0_2px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_8px_40px_rgba(0,0,0,0.5)] hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-caption text-muted-foreground dark:text-neutral-0/50 mb-3 tracking-[0.1em] uppercase font-medium">
                        Case {project.caseId}
                      </div>
                      <p className="text-[15px] text-foreground/70 dark:text-neutral-0/80 mb-2 leading-relaxed font-normal">
                        {project.location} • {project.parcelSize}
                      </p>
                      <p className="text-small text-foreground/35 dark:text-neutral-0/50 font-normal">
                        Phase {project.phaseNumber}: {project.phase}
                      </p>
                    </div>
                    <div className={`${statusColors.bg} ${statusColors.text} px-4 py-2.5 rounded-[var(--radius-card)] text-caption font-medium tracking-wide backdrop-blur-sm border ${statusColors.border} capitalize`}>
                      {project.status.replace('-', ' ')}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-8 pt-6 border-t border-black/[0.06] dark:border-white/[0.08]">
                    <div className="group/cta inline-flex items-center gap-2.5 text-foreground/70 dark:text-neutral-0/90 group-hover:text-foreground dark:group-hover:text-neutral-0 text-small font-normal transition-all duration-300">
                      <TrendingUp className="w-4 h-4" />
                      {cta.text}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom Grid: Recent Activity & Quick Actions */}
        <div className="grid grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-card border border-black/5 dark:border-white/5 rounded-[var(--radius-card)] overflow-hidden">
            <div className="px-8 py-6 border-b border-black/5 dark:border-white/5">
              <h3 className="text-[15px] tracking-tight text-foreground dark:text-neutral-0/95 font-medium">
                Recent Activity
              </h3>
              <p className="text-small text-muted-foreground dark:text-neutral-300/60 mt-1">
                Latest updates across all projects
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity, index) => {
                  const statusColors = activity.status === 'completed' 
                    ? { dot: 'bg-primary-700', text: 'text-primary-700 dark:text-primary-400' }
                    : activity.status === 'delayed'
                    ? { dot: 'bg-orange-500', text: 'text-orange-600 dark:text-orange-400' }
                    : { dot: 'bg-blue-500', text: 'text-blue-600 dark:text-blue-400' };

                  return (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full ${statusColors.dot} mt-2 flex-shrink-0`}></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="text-small text-foreground dark:text-neutral-0/95">
                            {activity.action}
                          </div>
                          <div className="text-caption text-muted-foreground dark:text-neutral-300/60 whitespace-nowrap">
                            {activity.time}
                          </div>
                        </div>
                        <div className="text-caption text-muted-foreground dark:text-neutral-0/50">
                          {activity.project}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-card border border-black/5 dark:border-white/5 rounded-[var(--radius-card)] overflow-hidden">
            <div className="px-8 py-6 border-b border-black/5 dark:border-white/5">
              <h3 className="text-[15px] tracking-tight text-foreground dark:text-neutral-0/95 font-medium">
                Quick Actions
              </h3>
              <p className="text-small text-muted-foreground dark:text-neutral-300/60 mt-1">
                Common tasks and workflows
              </p>
            </div>
            <div className="p-6 space-y-3">
              <Link
                to="/upload"
                className="flex items-center gap-4 p-4 rounded-[var(--radius-card)] bg-neutral-900/5 dark:bg-card/5 hover:bg-neutral-900/10 dark:hover:bg-card/10 transition-colors group"
              >
                <div className="w-10 h-10 rounded-[var(--radius)] bg-primary-700/10 text-primary-700 dark:text-primary-400 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-small font-medium text-foreground dark:text-neutral-0/95">
                    Add New Property
                  </div>
                  <div className="text-caption text-muted-foreground dark:text-neutral-0/50">
                    Upload documents & start analysis
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-foreground/20 dark:text-neutral-0/20 group-hover:text-neutral-700/80 dark:group-hover:text-neutral-300/80 group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                to="/market-intelligence"
                className="flex items-center gap-4 p-4 rounded-[var(--radius-card)] bg-neutral-900/5 dark:bg-card/5 hover:bg-neutral-900/10 dark:hover:bg-card/10 transition-colors group"
              >
                <div className="w-10 h-10 rounded-[var(--radius)] bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-small font-medium text-foreground dark:text-neutral-0/95">
                    Market Intelligence
                  </div>
                  <div className="text-caption text-muted-foreground dark:text-neutral-0/50">
                    View market trends & insights
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-foreground/20 dark:text-neutral-0/20 group-hover:text-neutral-700/80 dark:group-hover:text-neutral-300/80 group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                to="/properties"
                className="flex items-center gap-4 p-4 rounded-[var(--radius-card)] bg-neutral-900/5 dark:bg-card/5 hover:bg-neutral-900/10 dark:hover:bg-card/10 transition-colors group"
              >
                <div className="w-10 h-10 rounded-[var(--radius)] bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-small font-medium text-foreground dark:text-neutral-0/95">
                    All Properties
                  </div>
                  <div className="text-caption text-muted-foreground dark:text-neutral-0/50">
                    View complete portfolio list
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-foreground/20 dark:text-neutral-0/20 group-hover:text-neutral-700/80 dark:group-hover:text-neutral-300/80 group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </div>
        </div>
        </>
        )}
      </div>
    </div>
  );
}