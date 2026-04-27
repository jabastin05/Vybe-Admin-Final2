import { ArrowRight, ArrowLeft, Building2, FileText, TrendingUp, AlertCircle, Eye, PlayCircle, Plus, Zap, Shield, Target, Briefcase } from 'lucide-react';
import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import { mockPropertyCases } from '../data/mock-data';
import { PropertyCase } from '../types';
import { SideNav } from '../components/SideNav';
import { ThemeToggle } from '../components/ThemeToggle';

const statusConfig = {
  'analyzing': { label: 'Analyzing', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  'strategy-ready': { label: 'Strategy Ready', color: 'text-primary-600', bg: 'bg-primary-700/10' },
  'in-execution': { label: 'In Execution', color: 'text-purple-400', bg: 'bg-purple-500/10' },
};

function PropertyCard({ property }: { property: PropertyCase }) {
  const status = statusConfig[property.status];
  
  // Determine the CTA based on status
  const getCTA = () => {
    if (property.status === 'analyzing') {
      return {
        text: 'Track Analysis',
        icon: <Eye className="w-4 h-4" />,
        link: `/property/${property.id}`,
      };
    } else if (property.status === 'strategy-ready') {
      return {
        text: 'Review Strategy',
        icon: <Eye className="w-4 h-4" />,
        link: `/property/${property.id}`,
      };
    } else if (property.status === 'in-execution') {
      return {
        text: 'View Progress',
        icon: <PlayCircle className="w-4 h-4" />,
        link: `/property/${property.id}/execution-tracker`,
      };
    }
    return null;
  };

  const cta = getCTA();
  
  // Use CTA link for entire card
  const cardLink = cta?.link || `/property/${property.id}`;
  
  return (
    <Link 
      to={cardLink}
      className="block group bg-card/80 dark:bg-neutral-900 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] rounded-[var(--radius-card)] p-8 hover:border-black/[0.12] dark:hover:border-white/[0.12] transition-all duration-500 shadow-[0_2px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_8px_40px_rgba(0,0,0,0.5)] hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-caption text-muted-foreground dark:text-neutral-0/50 mb-3 tracking-[0.1em] uppercase font-medium">
            Case {property.caseId}
          </div>
          <p className="text-[15px] text-foreground/70 dark:text-neutral-0/80 mb-2 leading-relaxed font-normal">
            {property.location} • {property.parcelSize}
          </p>
          {property.surveyNumber && (
            <p className="text-small text-foreground/35 dark:text-neutral-0/50 font-normal">
              Survey No. {property.surveyNumber}
            </p>
          )}
        </div>
        <div className={`${status.bg} ${status.color} px-4 py-2.5 rounded-[var(--radius-card)] text-caption font-medium tracking-wide backdrop-blur-sm`}>
          {status.label}
        </div>
      </div>

      {/* Status-specific CTA */}
      {cta && (
        <div className="mt-6 pt-6 border-t border-black/[0.06] dark:border-white/[0.08]">
          <div className="group/cta inline-flex items-center gap-2.5 text-foreground/70 dark:text-neutral-0/90 group-hover:text-foreground dark:group-hover:text-neutral-0 text-small font-normal transition-all duration-300">
            {cta.icon}
            {cta.text}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </div>
      )}
    </Link>
  );
}

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<'all' | 'analyzing' | 'strategy-ready' | 'in-execution'>('all');
  const [hasProperties, setHasProperties] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Check if user has completed their first property upload
    const hasAdded = localStorage.getItem('vybeHasProperties') === 'true';
    setHasProperties(hasAdded);

    // Get user's name from onboarding data
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

  // Filter properties based on active tab
  const filteredProperties = activeTab === 'all' 
    ? mockPropertyCases 
    : mockPropertyCases.filter(p => p.status === activeTab);

  const tabs = [
    { id: 'all' as const, label: 'All Properties', count: mockPropertyCases.length },
    { id: 'analyzing' as const, label: 'Analyzing', count: mockPropertyCases.filter(p => p.status === 'analyzing').length },
    { id: 'strategy-ready' as const, label: 'Strategy Ready', count: mockPropertyCases.filter(p => p.status === 'strategy-ready').length },
    { id: 'in-execution' as const, label: 'In Execution', count: mockPropertyCases.filter(p => p.status === 'in-execution').length },
  ];
  
  return (
    <div className="min-h-screen bg-background dark:bg-neutral-900 transition-colors duration-300">
      <SideNav />
      
      {/* Header - Full Width */}
      <div className="border-b border-black/5 dark:border-white/10 bg-card dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            {hasProperties ? (
              <div>
                <h1 className="text-caption tracking-wider uppercase text-muted-foreground dark:text-neutral-0/50 mb-2">
                  Portfolio
                </h1>
                <div className="text-h1 tracking-tight text-foreground dark:text-neutral-0">
                  Case Management
                </div>
                <p className="text-small text-muted-foreground dark:text-neutral-300/80 mt-1">
                  Manage and track your real estate investments
                </p>
              </div>
            ) : (
              <div>
                <h1 className="text-caption tracking-wider uppercase text-primary-700 mb-2 font-medium">
                  Command Center
                </h1>
                <div className="text-h1 tracking-tight text-foreground dark:text-neutral-0 font-medium">
                  Welcome{userName ? `, ${userName}` : ''}
                </div>
                <p className="text-small text-muted-foreground dark:text-neutral-300/80 mt-1">
                  Your intelligence vectors are ready to be activated
                </p>
              </div>
            )}
            <div className="flex items-center gap-3">
              {hasProperties && (
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 bg-primary-700 hover:bg-primary-600 text-neutral-0 px-6 py-3 rounded-[var(--radius-card)] transition-all text-small font-medium shadow-lg hover:-translate-y-0.5"
                >
                  <Briefcase className="w-4 h-4" />
                  Request Service
                </Link>
              )}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        {!hasProperties ? (
          <div className="max-w-6xl mx-auto">
            {/* Hero Add Property CTA */}
            <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-primary-700/20 via-white/90 to-white/50 dark:from-primary-700/10 dark:via-[#1A1A1A]/90 dark:to-[#1A1A1A]/50 border-2 border-primary-700/30 dark:border-primary-700/20 p-16 text-center shadow-[0_20px_60px_rgba(28,117,188,0.25)] dark:shadow-[0_20px_60px_rgba(28,117,188,0.15)] backdrop-blur-xl mb-20">
              {/* Animated background accents */}
              <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-700/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
              <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-primary-600/15 rounded-full blur-[100px] pointer-events-none" />
              
              <div className="relative z-10">
                {/* Icon */}
                <div className="w-32 h-32 bg-gradient-to-br from-primary-700 to-primary-600 rounded-[28px] mx-auto flex items-center justify-center mb-8 shadow-[0_16px_48px_rgba(28,117,188,0.4)] dark:shadow-[0_16px_48px_rgba(28,117,188,0.3)] relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <Building2 className="w-16 h-16 text-neutral-0 relative z-10" strokeWidth={2} />
                </div>
                
                {/* Heading */}
                <h1 className="text-[48px] font-black tracking-tight text-foreground dark:text-neutral-0 mb-6 leading-tight">
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
                  <Zap className="w-4 h-4 text-primary-700" />
                  <span className="text-caption tracking-[0.15em] uppercase text-neutral-700/80 dark:text-neutral-300/80 font-medium">
                    Platform Capabilities
                  </span>
                </div>
                <h2 className="text-h1 tracking-tight text-foreground dark:text-neutral-0 font-medium leading-tight mb-4">
                  What You'll Unlock
                </h2>
                <p className="text-small text-neutral-700/80 dark:text-neutral-300/80 max-w-2xl mx-auto leading-relaxed">
                  Adding your first property activates VYBE's complete intelligence infrastructure
                </p>
              </div>

              {/* Capability Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-[var(--space-12)]">
                {/* HABU Feasibility Report */}
                <div className="group relative bg-card/80 dark:bg-neutral-900 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] rounded-[var(--radius-card)] p-10 shadow-[0_8px_32px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_12px_48px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all duration-500 overflow-hidden">
                  {/* Gradient accent */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-700 via-primary-600 to-primary-400" />
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-700/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
                  
                  <div className="relative z-10">
                    {/* Icon & Badge */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-16 h-16 rounded-[var(--radius-card)] bg-gradient-to-br from-primary-700 to-primary-600 flex items-center justify-center shadow-[0_8px_24px_rgba(28,117,188,0.3)]">
                        <FileText className="w-8 h-8 text-neutral-0" strokeWidth={2.5} />
                      </div>
                      <div className="px-3 py-1.5 rounded-[var(--radius)] bg-primary-700/10 border border-primary-700/20">
                        <span className="text-caption tracking-wider uppercase text-primary-700 font-medium">
                          AI-Powered
                        </span>
                      </div>
                    </div>
                    
                    {/* Title & Description */}
                    <h3 className="text-h3 font-medium text-foreground dark:text-neutral-0 mb-3 tracking-tight">
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
                          <div className="w-1 h-1 rounded-full bg-primary-700 mt-2 flex-shrink-0" />
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
                    <h3 className="text-h3 font-medium text-foreground dark:text-neutral-0 mb-3 tracking-tight">
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
                    <h3 className="text-h3 font-medium text-foreground dark:text-neutral-0 mb-3 tracking-tight">
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
                    <h3 className="text-h3 font-medium text-foreground dark:text-neutral-0 mb-3 tracking-tight">
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
                    <h3 className="text-h3 font-medium text-foreground dark:text-neutral-0 mb-3 tracking-tight">
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
                  className="inline-flex items-center gap-3 bg-primary-700 hover:bg-primary-600 text-neutral-0 px-10 py-4 rounded-[var(--radius-card)] transition-all text-[15px] font-medium shadow-[0_8px_24px_rgba(28,117,188,0.3)] hover:shadow-[0_12px_32px_rgba(28,117,188,0.4)] hover:-translate-y-0.5 group"
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
          <div>
            {/* Property Cases Grid */}
            <div>
              {/* Status Tabs */}
              <div className="bg-card/80 dark:bg-card/80 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.06] rounded-[var(--radius-card)] p-2 mb-[var(--space-10)] inline-flex gap-1.5 shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3.5 rounded-[var(--radius-card)] text-small font-medium tracking-wide transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-neutral-900 dark:bg-card text-neutral-0 dark:text-foreground shadow-[0_4px_16px_rgba(0,0,0,0.15)] dark:shadow-[0_4px_16px_rgba(255,255,255,0.15)] scale-[1.02]'
                        : 'text-muted-foreground dark:text-neutral-0/50 hover:text-foreground/80 dark:hover:text-neutral-0/80 hover:bg-neutral-900/[0.02] dark:hover:bg-card/[0.02]'
                    }`}
                  >
                    {tab.label}
                    <span className={`ml-2.5 px-2.5 py-0.5 rounded-[var(--radius)] text-caption font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-card/20 dark:bg-neutral-900/20'
                        : 'bg-neutral-900/[0.06] dark:bg-card/[0.06]'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              <h2 className="text-caption tracking-[0.12em] uppercase text-muted-foreground dark:text-neutral-0/50 mb-8 font-medium">
                {activeTab === 'all' ? 'All Property Cases' : `${tabs.find(t => t.id === activeTab)?.label} Cases`}
              </h2>
              <div className="grid grid-cols-2 gap-8">
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}