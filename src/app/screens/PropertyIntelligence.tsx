import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { ArrowLeft, MapPin, TrendingUp, User, Calendar, CheckCircle2, Circle, FileText, Activity, Building2, Maximize2, MapPinned, ChevronDown, Target, Shield, Download, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { mockPropertyCases, mockStrategies, mockPartner, mockMilestones } from '../data/mock-data';
import { SideNav } from '../components/SideNav';
import { ThemeToggle } from '../components/ThemeToggle';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function PropertyIntelligence() {
  const { id } = useParams();
  const property = mockPropertyCases.find(p => p.id === id);
  const [showReportModal, setShowReportModal] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState<{ [key: string]: boolean }>({
    infrastructure: false,
    riskBreakdown: false,
    constraints: false,
  });

  if (!property) {
    return <div className="min-h-screen bg-background dark:bg-neutral-900 flex items-center justify-center text-muted-foreground dark:text-neutral-300/60">Property not found</div>;
  }

  // Get selected strategy if available
  const selectedStrategy = property.selectedStrategyId 
    ? mockStrategies.find(s => s.id === property.selectedStrategyId)
    : null;

  // Get assigned partner if available
  const assignedPartner = property.assignedPartnerId 
    ? mockPartner
    : null;

  // Get milestones if available
  const milestones = property.hasMilestones ? mockMilestones : [];

  // Determine which use case to display
  // Use Case 1: Report in progress (no strategy selected yet)
  // Use Case 2: Strategy selected, partner assigned, but no milestones yet
  // Use Case 3: Strategy selected, partner assigned, and has milestones
  const useCase = !selectedStrategy 
    ? 1 
    : selectedStrategy && !property.hasMilestones
    ? 2
    : 3;

  const signals = [
    { label: 'Metro Station', distance: '800m', impact: 'positive' },
    { label: 'Major Highway', distance: '1.2km', impact: 'positive' },
    { label: 'Industrial Zone', distance: '3km', impact: 'neutral' },
    { label: 'Heritage Site', distance: '5km', impact: 'neutral' },
  ];

  const recentActivity = [
    { date: '2026-02-18', action: 'Site Assessment Completed', actor: 'Rajesh Malhotra' },
    { date: '2026-02-15', action: 'Documentation Reviewed', actor: 'Legal Team' },
    { date: '2026-02-11', action: 'Partner Assigned', actor: 'System' },
    { date: '2026-02-08', action: 'Strategy Selected', actor: 'You' },
  ];

  // Property images
  const propertyImages = [
    'https://images.unsplash.com/photo-1764222233275-87dc016c11dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2YWNhbnQlMjBsYW5kJTIwcHJvcGVydHklMjBhZXJpYWwlMjB2aWV3fGVufDF8fHx8MTc3MTU3Mjc1NXww&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1766595680974-e63877a2ab5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBzaXRlJTIwZ3JvdW5kJTIwZGV2ZWxvcG1lbnR8ZW58MXx8fHwxNzcxNTcyNzU3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1771068807150-2cab0734d25b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYW5kJTIwc3VydmV5JTIwbWVhc3VyZW1lbnQlMjBwcm9wZXJ0eXxlbnwxfHx8fDE3NzE1NzI3NTV8MA&ixlib=rb-4.1.0&q=80&w=1080'
  ];

  return (
    <div className="min-h-screen bg-background dark:bg-neutral-900 transition-colors duration-300">
      <SideNav />
      
      {/* Header - Full Width */}
      <div className="border-b border-black/5 dark:border-white/10 bg-card dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            {/* Left: Back Button + Property Name */}
            <div className="flex items-center gap-4">
              <Link 
                to="/properties" 
                className="inline-flex items-center justify-center w-10 h-10 rounded-[var(--radius-card)] bg-neutral-900/5 dark:bg-card/5 hover:bg-neutral-900/10 dark:hover:bg-card/10 transition-colors text-neutral-700/80 dark:text-neutral-300/80"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div>
                <h1 className="text-caption tracking-[0.05em] uppercase font-medium text-muted-foreground dark:text-neutral-0/50 mb-2">
                  Case {property.caseId}
                </h1>
                <div className="text-h1 tracking-tight text-foreground dark:text-neutral-0">
                  {property.location}
                </div>
                <p className="text-[16px] text-muted-foreground dark:text-neutral-300/80 mt-1">
                  {property.parcelSize} • Survey No. {property.surveyNumber}
                </p>
              </div>
            </div>

            {/* Right: Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Modal for HABU Report In Progress */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/80 backdrop-blur-sm">
          <div className="bg-card border border-black/10 dark:border-white/10 rounded-[var(--radius)] p-8 max-w-md mx-4">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-h3 tracking-tight text-foreground dark:text-neutral-0/95 mb-4">
                Report In Progress
              </h3>
              <p className="text-small text-neutral-700/80 dark:text-neutral-300/80 leading-relaxed mb-8">
                The HABU report is currently being generated. We will notify you once it is ready.
              </p>
              <button
                onClick={() => setShowReportModal(false)}
                className="w-full bg-neutral-900 dark:bg-card text-neutral-0 dark:text-foreground px-6 py-3 rounded-[var(--radius)] hover:bg-neutral-900/90 dark:hover:bg-card/90 transition-colors text-small tracking-wide font-medium"
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Analyzing Stage - Special Layout */}
        {property.status === 'analyzing' && (
          <div className="space-y-6">
            {/* VYBE Team Analysis Progress Section - Compact */}
            <div className="bg-gradient-to-br from-yellow-500/[0.03] to-amber-500/[0.03] dark:from-yellow-500/[0.05] dark:to-amber-500/[0.05] border border-yellow-500/20 dark:border-yellow-400/20 rounded-[var(--radius-card)] overflow-hidden">
              <div className="p-4 border-b border-yellow-500/10 dark:border-yellow-400/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-[var(--radius)] bg-yellow-500/20 flex items-center justify-center">
                      <Activity className="w-4 h-4 text-yellow-500" />
                    </div>
                    <div>
                      <h2 className="text-small tracking-tight text-foreground dark:text-neutral-0/95 font-medium">
                        VYBE Team Analysis
                      </h2>
                      <p className="text-caption text-muted-foreground dark:text-neutral-0/50">
                        Real-time AI-powered property assessment
                      </p>
                    </div>
                  </div>
                  <div className="text-caption tracking-widest uppercase text-yellow-500 bg-yellow-500/10 px-2.5 py-1 rounded-[var(--radius)] flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                    In Progress
                  </div>
                </div>
              </div>

              <div className="p-4 bg-card/60 dark:bg-neutral-900/30 backdrop-blur-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Documents Uploaded Card */}
                  <div className="bg-card/90 dark:bg-card/90 border border-black/5 dark:border-white/5 rounded-[var(--radius-card)] p-5 backdrop-blur-[20px] shadow-[0_2px_4px_rgba(0,0,0,0.02),0_20px_40px_rgba(0,0,0,0.05)]">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-[var(--radius)] bg-yellow-500/20 flex items-center justify-center">
                          <FileText className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <h3 className="text-small font-medium tracking-tight text-foreground dark:text-neutral-0/95">
                          Documents Uploaded
                        </h3>
                      </div>
                      <div className="text-h1 font-medium text-yellow-600 dark:text-yellow-400 leading-none">
                        {property.documentCount || 0}
                      </div>
                    </div>
                    
                    {/* Document Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {['Title Deed', 'Survey Plan', 'Tax Receipt', 'Encumbrance Cert', 'Building Plan', 'Approval Letter'].slice(0, Math.min(6, property.documentCount || 0)).map((doc, index) => (
                        <div 
                          key={index} 
                          className="bg-primary-700/10 border border-primary-700/20 rounded-[var(--radius)] px-2.5 py-1 flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3 h-3 text-primary-700 flex-shrink-0" />
                          <span className="text-caption font-medium text-foreground/70 dark:text-neutral-0/70 tracking-tight">{doc}</span>
                        </div>
                      ))}
                      {(property.documentCount || 0) > 6 && (
                        <div className="bg-neutral-900/5 dark:bg-card/5 rounded-[var(--radius)] px-2.5 py-1">
                          <span className="text-caption font-medium text-muted-foreground dark:text-neutral-0/50">+{(property.documentCount || 0) - 6} more</span>
                        </div>
                      )}
                    </div>

                    {/* Document Processing Status */}
                    

                    {/* Upload Info */}
                    <div className="pt-3 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-700"></div>
                        <span className="text-caption text-muted-foreground dark:text-neutral-0/50">Last uploaded Feb 18, 2026</span>
                      </div>
                      <span className="text-caption font-medium text-neutral-700/80 dark:text-neutral-300/80">Total: 24.3 MB</span>
                    </div>
                  </div>

                  {/* Analysis Progress & Timeline Card */}
                  <div className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-blue-500/10 border border-blue-500/20 dark:border-blue-400/20 rounded-[var(--radius-card)] p-5 backdrop-blur-[20px] shadow-[0_2px_4px_rgba(0,0,0,0.02),0_20px_40px_rgba(0,0,0,0.05)]">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-[var(--radius)] bg-blue-500/30 flex items-center justify-center">
                        <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="text-small font-medium tracking-tight text-foreground dark:text-neutral-0/95">
                        Analysis Progress
                      </h3>
                    </div>

                    {/* Overall Progress Bar */}
                    

                    {/* Analysis Stages */}
                    

                    {/* Timeline Info */}
                    <div className="pt-3 border-t border-black/10 dark:border-white/10 grid grid-cols-2 gap-3">
                      <div className="bg-card/60 dark:bg-neutral-900/30 rounded-[var(--radius)] p-2.5">
                        <div className="text-caption tracking-wider uppercase text-blue-600 dark:text-blue-400 mb-1">
                          Completion
                        </div>
                        <div className="text-[16px] font-medium text-foreground dark:text-neutral-0/95 leading-none mb-0.5">
                          2-3 Days
                        </div>
                        <div className="text-caption text-muted-foreground dark:text-neutral-0/50">
                          Mar 13-14, 2026
                        </div>
                      </div>
                      <div className="bg-card/60 dark:bg-neutral-900/30 rounded-[var(--radius)] p-2.5">
                        <div className="text-caption tracking-wider uppercase text-muted-foreground dark:text-neutral-300/60 mb-1">
                          Next Update
                        </div>
                        <div className="text-[16px] font-medium text-foreground dark:text-neutral-0/95 leading-none mb-0.5">
                          6 hours
                        </div>
                        <div className="text-caption text-muted-foreground dark:text-neutral-0/50">
                          Today, 8:00 PM
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Property Overview Grid - Location + Metadata Combined */}
            <div className="grid grid-cols-3 gap-4">
              {/* Location Card - Compact */}
              <div className="bg-card dark:bg-neutral-900 border border-black/5 dark:border-white/5 rounded-[var(--radius-card)] overflow-hidden">
                <div className="p-4 border-b border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-[var(--radius)] bg-primary-700/10 flex items-center justify-center">
                      <MapPinned className="w-3.5 h-3.5 text-primary-700" />
                    </div>
                    <h3 className="text-caption tracking-widest uppercase text-muted-foreground dark:text-neutral-300/60">
                      Location
                    </h3>
                  </div>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    <div>
                      <div className="text-caption tracking-wider uppercase text-muted-foreground dark:text-neutral-300/60 mb-1">Address</div>
                      <div className="text-caption text-foreground dark:text-neutral-0/95 font-medium leading-snug">{property.location}</div>
                    </div>
                    <div>
                      <div className="text-caption tracking-wider uppercase text-muted-foreground dark:text-neutral-300/60 mb-1">Coordinates</div>
                      <div className="text-caption text-neutral-700/80 dark:text-neutral-300/80 font-mono">12.9716° N, 77.5946° E</div>
                    </div>
                    <div className="pt-2 border-t border-black/5 dark:border-white/5">
                      <div className="flex items-center gap-1.5 text-caption text-primary-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-600"></div>
                        Verified from documents
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Property Details Card */}
              <div className="col-span-2 bg-gradient-to-br from-blue-500/[0.03] to-purple-500/[0.03] dark:from-blue-500/[0.05] dark:to-purple-500/[0.05] border border-blue-500/20 dark:border-blue-400/20 rounded-[var(--radius-card)] overflow-hidden">
                <div className="p-4 border-b border-blue-500/10 dark:border-blue-400/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-[var(--radius)] bg-blue-500/20 flex items-center justify-center">
                        <Building2 className="w-3.5 h-3.5 text-blue-500" />
                      </div>
                      <h3 className="text-caption tracking-widest uppercase text-muted-foreground dark:text-neutral-300/60">
                        Property Details
                      </h3>
                    </div>
                    <div className="text-caption tracking-widest uppercase text-blue-500 bg-blue-500/10 px-2 py-1 rounded">
                      AI Verified
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-card/60 dark:bg-neutral-900/30 backdrop-blur-sm">
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className="bg-card border border-black/5 dark:border-white/5 rounded-[var(--radius)] p-3">
                      <div className="text-caption tracking-wider uppercase text-muted-foreground dark:text-neutral-300/60 mb-1">Survey No.</div>
                      <div className="text-small text-foreground dark:text-neutral-0/95 font-medium">{property.surveyNumber}</div>
                    </div>
                    <div className="bg-card border border-black/5 dark:border-white/5 rounded-[var(--radius)] p-3">
                      <div className="text-caption tracking-wider uppercase text-muted-foreground dark:text-neutral-300/60 mb-1">Land Area</div>
                      <div className="text-small text-foreground dark:text-neutral-0/95 font-medium">{property.parcelSize}</div>
                    </div>
                    <div className="bg-card border border-black/5 dark:border-white/5 rounded-[var(--radius)] p-3">
                      <div className="text-caption tracking-wider uppercase text-muted-foreground dark:text-neutral-300/60 mb-1">Ownership</div>
                      <div className="text-small text-foreground dark:text-neutral-0/95 font-medium">Freehold</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    <div className="bg-card border border-black/5 dark:border-white/5 rounded-[var(--radius)] p-3">
                      <div className="text-caption tracking-wider uppercase text-muted-foreground dark:text-neutral-300/60 mb-1">District</div>
                      <div className="text-caption text-foreground dark:text-neutral-0/95 font-medium">Bangalore Urban</div>
                    </div>
                    <div className="bg-card border border-black/5 dark:border-white/5 rounded-[var(--radius)] p-3">
                      <div className="text-caption tracking-wider uppercase text-muted-foreground dark:text-neutral-300/60 mb-1">State</div>
                      <div className="text-caption text-foreground dark:text-neutral-0/95 font-medium">Karnataka</div>
                    </div>
                    <div className="bg-card border border-black/5 dark:border-white/5 rounded-[var(--radius)] p-3">
                      <div className="text-caption tracking-wider uppercase text-muted-foreground dark:text-neutral-300/60 mb-1">Zoning</div>
                      <div className="text-caption text-foreground dark:text-neutral-0/95 font-medium">Residential</div>
                    </div>
                    <div className="bg-card border border-black/5 dark:border-white/5 rounded-[var(--radius)] p-3">
                      <div className="text-caption tracking-wider uppercase text-muted-foreground dark:text-neutral-300/60 mb-1">Road Access</div>
                      <div className="text-caption text-foreground dark:text-neutral-0/95 font-medium">30ft Arterial</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Grid - Legal, Development, Infrastructure */}
            <div className="grid grid-cols-3 gap-4">
              {/* Legal Status - Compact */}
              <div className="bg-card border border-black/5 dark:border-white/5 rounded-[var(--radius-card)] overflow-hidden">
                <div className="p-4 border-b border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-[var(--radius)] bg-primary-700/10 flex items-center justify-center">
                      <Shield className="w-3.5 h-3.5 text-primary-700" />
                    </div>
                    <h3 className="text-caption tracking-widest uppercase text-muted-foreground dark:text-neutral-300/60">
                      Legal Status
                    </h3>
                  </div>
                </div>
                <div className="p-4">
                  <div className="bg-primary-700/10 border border-primary-700/20 rounded-[var(--radius-card)] p-3 mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="w-4 h-4 text-primary-700" />
                      <span className="text-caption text-primary-700 dark:text-primary-400 font-medium">Clear Title</span>
                    </div>
                    <div className="text-caption text-muted-foreground dark:text-neutral-0/50">Verified Feb 18, 2026</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between py-1.5 border-b border-black/5 dark:border-white/5">
                      <span className="text-caption text-muted-foreground dark:text-neutral-0/50">Registry</span>
                      <span className="text-caption text-primary-700 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        Verified
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 border-b border-black/5 dark:border-white/5">
                      <span className="text-caption text-muted-foreground dark:text-neutral-0/50">Marketability</span>
                      <span className="text-caption text-foreground dark:text-neutral-0/95 font-medium">Transferable</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5">
                      <span className="text-caption text-muted-foreground dark:text-neutral-0/50">Encumbrances</span>
                      <span className="text-caption text-primary-700 font-medium">None</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Development Potential - Compact */}
              <div className="bg-card border border-black/5 dark:border-white/5 rounded-[var(--radius-card)] overflow-hidden">
                <div className="p-4 border-b border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-[var(--radius)] bg-blue-500/10 flex items-center justify-center">
                      <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                    </div>
                    <h3 className="text-caption tracking-widest uppercase text-muted-foreground dark:text-neutral-300/60">
                      Development
                    </h3>
                  </div>
                </div>
                <div className="p-4">
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between py-1.5 border-b border-black/5 dark:border-white/5">
                      <span className="text-caption text-muted-foreground dark:text-neutral-0/50">FSI Available</span>
                      <span className="text-small text-foreground dark:text-neutral-0/95 font-medium">2.5x</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 border-b border-black/5 dark:border-white/5">
                      <span className="text-caption text-muted-foreground dark:text-neutral-0/50">Max Buildable</span>
                      <span className="text-caption text-foreground dark:text-neutral-0/95 font-medium">12,500 sq ft</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5">
                      <span className="text-caption text-muted-foreground dark:text-neutral-0/50">Approval Status</span>
                      <span className="text-caption text-primary-700 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        Ready
                      </span>
                    </div>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-[var(--radius)] p-2.5">
                    <div className="text-caption tracking-wider uppercase text-blue-600 dark:text-blue-400 mb-0.5">Utilities</div>
                    <div className="flex flex-wrap gap-1">
                      {['Water', 'Electricity', 'Sewage', 'Gas'].map((utility, index) => (
                        <div key={index} className="bg-primary-700/20 rounded px-1.5 py-0.5 flex items-center gap-1">
                          <CheckCircle2 className="w-2 h-2 text-primary-700" />
                          <span className="text-caption text-primary-700 dark:text-primary-400 font-medium">{utility}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Infrastructure Proximity - Compact */}
              <div className="bg-card border border-black/5 dark:border-white/5 rounded-[var(--radius-card)] overflow-hidden">
                <div className="p-4 border-b border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-[var(--radius)] bg-purple-500/10 flex items-center justify-center">
                      <Activity className="w-3.5 h-3.5 text-purple-500" />
                    </div>
                    <h3 className="text-caption tracking-widest uppercase text-muted-foreground dark:text-neutral-300/60">
                      Infrastructure
                    </h3>
                  </div>
                </div>
                <div className="p-4">
                  <div className="space-y-2.5">
                    {signals.slice(0, 4).map((signal, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${
                              signal.impact === 'positive' ? 'bg-primary-700' : 'bg-neutral-900/20 dark:bg-card/20'
                            }`}></div>
                            <span className="text-caption text-foreground dark:text-neutral-0/95">{signal.label}</span>
                          </div>
                          <span className="text-caption font-medium text-muted-foreground dark:text-neutral-0/50">{signal.distance}</span>
                        </div>
                        <div className="h-0.5 rounded-full bg-neutral-900/5 dark:bg-card/5 overflow-hidden">
                          <div 
                            className={`h-full transition-all ${
                              signal.impact === 'positive' ? 'bg-primary-700/60' : 'bg-neutral-900/10 dark:bg-card/10'
                            }`}
                            style={{ width: `${Math.max(10, 100 - (parseFloat(signal.distance) * 15))}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-black/5 dark:border-white/5">
                    <div className="flex items-center gap-2 text-caption text-muted-foreground dark:text-neutral-300/60">
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-700"></div>
                        <span>Positive</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-neutral-900/20 dark:bg-card/20"></div>
                        <span>Neutral</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* HABU Report Preview Section - First */}
        {property.status !== 'analyzing' && (
          <div className="mb-8 bg-gradient-to-br from-blue-500/5 to-purple-500/5 border-2 border-blue-500/20 dark:border-blue-400/20 rounded-[var(--radius-card)] p-8">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-6 h-6 text-blue-500" />
              <h2 className="text-h2 tracking-tight text-foreground dark:text-neutral-0/95 font-medium">
                HABU Report Preview
              </h2>
              <div className="ml-auto flex items-center gap-3">
                <button
                  onClick={() => {/* Download handler */}}
                  className="bg-card dark:bg-neutral-900 text-foreground dark:text-neutral-0 border border-black/10 dark:border-white/10 px-4 py-2 rounded-[var(--radius)] text-small tracking-wide transition-all hover:bg-neutral-900/5 dark:hover:bg-card/5 inline-flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download HABU Report
                </button>
                <Link
                  to="/report/habu"
                  className="bg-neutral-900 dark:bg-card text-neutral-0 dark:text-foreground px-4 py-2 rounded-[var(--radius)] text-small tracking-wide transition-all hover:bg-neutral-900/90 dark:hover:bg-card/90 inline-flex items-center gap-2"
                >
                  View Full Report
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </Link>
              </div>
            </div>

            {/* 3 Strategy Options - Highlighted Section */}
            <div className="bg-card dark:bg-neutral-900 border border-blue-500/30 dark:border-blue-400/30 rounded-[var(--radius)] p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-h3 tracking-tight text-foreground dark:text-neutral-0/95 font-medium mb-2">
                    Strategic Investment Options
                  </h3>
                  <p className="text-small text-neutral-700/80 dark:text-neutral-300/80">
                    AI-powered analysis has identified 3 optimal monetization strategies for this property
                  </p>
                </div>
                <div className="text-caption text-blue-500 dark:text-blue-400 tracking-wider uppercase">
                  3 Options Available
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                {mockStrategies.map((strategy, index) => (
                  <div
                    key={strategy.id}
                    className={`relative bg-gradient-to-br ${
                      strategy.id === selectedStrategy?.id
                        ? 'from-blue-500/10 to-purple-500/10 border-2 border-blue-500/50 dark:border-blue-400/50'
                        : 'from-black/[0.02] to-black/[0.01] dark:from-white/[0.02] dark:to-white/[0.01] border border-black/10 dark:border-white/10'
                    } rounded-[var(--radius)] p-6 hover:border-blue-500/30 dark:hover:border-blue-400/30 transition-all`}
                  >
                    {strategy.id === selectedStrategy?.id && (
                      <div className="absolute top-4 right-4">
                        <div className="bg-blue-500 text-neutral-0 px-2 py-1 rounded text-caption tracking-wider uppercase">
                          Selected
                        </div>
                      </div>
                    )}
                    
                    <div className="mb-4">
                      <div className="text-caption text-muted-foreground dark:text-neutral-300/60 tracking-wider uppercase mb-2">
                        Option {index + 1}
                      </div>
                      <h4 className="text-[16px] tracking-tight text-foreground dark:text-neutral-0/95 font-medium mb-2">
                        {strategy.name}
                      </h4>
                      <p className="text-caption text-neutral-700/80 dark:text-neutral-300/80 leading-relaxed line-clamp-2">
                        {strategy.description}
                      </p>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-caption text-muted-foreground dark:text-neutral-300/60 uppercase tracking-wide">ROI</span>
                        <span className="text-h3 tracking-tight text-primary-600 font-medium">{strategy.roi}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-caption text-muted-foreground dark:text-neutral-300/60 uppercase tracking-wide">Capital</span>
                        <span className="text-small tracking-tight text-foreground dark:text-neutral-0/95">{strategy.capitalRequired}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-caption text-muted-foreground dark:text-neutral-300/60 uppercase tracking-wide">Timeline</span>
                        <span className="text-small tracking-tight text-foreground dark:text-neutral-0/95">{strategy.timeline}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-black/5 dark:border-white/5">
                      <div className={`px-2 py-1 rounded text-caption tracking-wider uppercase ${
                        strategy.riskLevel === 'low' ? 'bg-primary-700/10 text-primary-600' :
                        strategy.riskLevel === 'medium' ? 'bg-yellow-500/10 text-yellow-400' :
                        'bg-red-500/10 text-red-400'
                      }`}>
                        {strategy.riskLevel} Risk
                      </div>
                      <Link
                        to={`/property/${id}/habu`}
                        className="text-caption text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Exact Map Location - For Strategy Ready Status */}
        {property.status !== 'analyzing' && (
          <div className="mb-8 bg-card dark:bg-neutral-900 border border-black/5 dark:border-white/5 rounded-[var(--radius-card)] overflow-hidden">
            <div className="p-6 border-b border-black/5 dark:border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[var(--radius-card)] bg-primary-700/10 flex items-center justify-center">
                  <MapPinned className="w-5 h-5 text-primary-700" />
                </div>
                <div>
                  <h2 className="text-[16px] tracking-tight text-foreground dark:text-neutral-0/95 font-medium">
                    Exact Location
                  </h2>
                  <p className="text-small text-muted-foreground dark:text-neutral-0/50">
                    {property.location}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="relative bg-gradient-to-br from-primary-700/5 to-blue-500/5 h-[420px] flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-card border border-black/10 dark:border-white/10 flex items-center justify-center shadow-lg">
                  <MapPinned className="w-10 h-10 text-primary-700" />
                </div>
                <h3 className="text-h3 tracking-tight text-foreground dark:text-neutral-0/95 mb-2">
                  {property.location}
                </h3>
                <p className="text-small text-muted-foreground dark:text-neutral-300/60 mb-1">
                  Geographic Coordinates
                </p>
                <p className="text-[16px] font-medium text-neutral-700/80 dark:text-neutral-300/80 tracking-wider">
                  12.9716° N, 77.5946° E
                </p>
                <div className="mt-6 flex items-center justify-center gap-2 text-caption text-muted-foreground dark:text-neutral-0/50">
                  <div className="w-2 h-2 rounded-full bg-primary-600 animate-pulse"></div>
                  Location verified from document extraction
                </div>
              </div>
              
              <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: `
                  linear-gradient(to right, currentColor 1px, transparent 1px),
                  linear-gradient(to bottom, currentColor 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px'
              }}></div>
            </div>
          </div>
        )}

        {/* Property Metadata Section - For Strategy Ready Status */}
        {property.status !== 'analyzing' && (
          <div className="mb-8 bg-gradient-to-br from-blue-500/[0.03] to-purple-500/[0.03] dark:from-blue-500/[0.05] dark:to-purple-500/[0.05] border border-blue-500/20 dark:border-blue-400/20 rounded-[var(--radius-card)] overflow-hidden">
            <div className="p-6 border-b border-blue-500/10 dark:border-blue-400/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[var(--radius-card)] bg-blue-500/20 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-small tracking-tight text-foreground dark:text-neutral-0/95 font-medium">
                      Property Data Preview
                    </h2>
                    <p className="text-caption text-muted-foreground dark:text-neutral-0/50">
                      Extracted from uploaded documents
                    </p>
                  </div>
                </div>
                <div className="text-caption tracking-widest uppercase text-blue-500 bg-blue-500/10 px-3 py-1.5 rounded-[var(--radius)]">
                  AI Verified
                </div>
              </div>
            </div>

            <div className="p-6 bg-card/60 dark:bg-neutral-900/30 backdrop-blur-sm">
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="bg-card border border-black/5 dark:border-white/5 rounded-[var(--radius-card)] p-4">
                  <div className="text-caption tracking-widest uppercase text-muted-foreground dark:text-neutral-300/60 mb-2">District</div>
                  <div className="text-[15px] text-foreground dark:text-neutral-0/95 font-medium">Bangalore Urban</div>
                </div>

                <div className="bg-card border border-black/5 dark:border-white/5 rounded-[var(--radius-card)] p-4">
                  <div className="text-caption tracking-widest uppercase text-muted-foreground dark:text-neutral-300/60 mb-2">State</div>
                  <div className="text-[15px] text-foreground dark:text-neutral-0/95 font-medium">Karnataka</div>
                </div>

                <div className="bg-card border border-black/5 dark:border-white/5 rounded-[var(--radius-card)] p-4">
                  <div className="text-caption tracking-widest uppercase text-muted-foreground dark:text-neutral-300/60 mb-2">Survey No.</div>
                  <div className="text-[15px] text-foreground dark:text-neutral-0/95 font-medium">{property.surveyNumber}</div>
                </div>

                <div className="bg-card border border-black/5 dark:border-white/5 rounded-[var(--radius-card)] p-4">
                  <div className="text-caption tracking-widest uppercase text-muted-foreground dark:text-neutral-300/60 mb-2">Land Area</div>
                  <div className="text-[15px] text-foreground dark:text-neutral-0/95 font-medium">{property.parcelSize}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-card border border-black/5 dark:border-white/5 rounded-[var(--radius-card)] p-4">
                  <div className="text-caption tracking-widest uppercase text-muted-foreground dark:text-neutral-300/60 mb-2">Ownership</div>
                  <div className="text-small text-foreground dark:text-neutral-0/95">Freehold</div>
                </div>

                <div className="bg-card border border-black/5 dark:border-white/5 rounded-[var(--radius-card)] p-4">
                  <div className="text-caption tracking-widest uppercase text-muted-foreground dark:text-neutral-300/60 mb-2">Zoning</div>
                  <div className="text-small text-foreground dark:text-neutral-0/95">Residential</div>
                </div>

                <div className="bg-card border border-black/5 dark:border-white/5 rounded-[var(--radius-card)] p-4">
                  <div className="text-caption tracking-widest uppercase text-muted-foreground dark:text-neutral-300/60 mb-2">Road Access</div>
                  <div className="text-small text-foreground dark:text-neutral-0/95">30ft Arterial</div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-primary-700/10 border border-primary-700/20 rounded-[var(--radius-card)] flex items-center justify-between">
                <div>
                  <div className="text-caption tracking-widest uppercase text-primary-700 dark:text-primary-400 mb-1">Encumbrance Status</div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary-700" />
                    <span className="text-[16px] text-primary-700 font-medium">Clear Title</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  <div className="text-caption tracking-wider uppercase text-muted-foreground dark:text-neutral-300/60 mr-2">Utilities:</div>
                  {['Water', 'Electricity', 'Sewage', 'Gas'].map((utility, index) => (
                    <div 
                      key={index} 
                      className="bg-primary-700/20 border border-primary-700/30 rounded-[var(--radius)] px-3 py-1.5 flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3 h-3 text-primary-700" />
                      <span className="text-caption text-primary-700 dark:text-primary-400 font-medium">{utility}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Intelligence Metrics Section - For Strategy Ready Status */}
        {property.status !== 'analyzing' && (
          <div className="mb-8 grid grid-cols-3 gap-6">
            {/* Legal Status */}
            <div className="bg-card border border-black/5 dark:border-white/5 rounded-[var(--radius-card)] p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-[var(--radius)] bg-primary-700/10 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-primary-700" />
                </div>
                <h3 className="text-caption tracking-widest uppercase text-muted-foreground dark:text-neutral-300/60">
                  Legal Status
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-primary-700/5 border border-primary-700/10 rounded-[var(--radius-card)] p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-primary-700 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-small text-foreground dark:text-neutral-0/95 font-medium mb-1">Clear Title</div>
                      <p className="text-caption text-muted-foreground dark:text-neutral-0/50 leading-relaxed">
                        No encumbrances detected
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2.5 px-3 bg-neutral-900/[0.02] dark:bg-card/[0.02] rounded-[var(--radius)]">
                  <span className="text-caption text-muted-foreground dark:text-neutral-0/50 uppercase tracking-wider">Verification Date</span>
                  <span className="text-caption text-foreground dark:text-neutral-0/95 font-medium">Feb 20, 2026</span>
                </div>

                <div className="flex items-center justify-between py-2.5 px-3 bg-neutral-900/[0.02] dark:bg-card/[0.02] rounded-[var(--radius)]">
                  <span className="text-caption text-muted-foreground dark:text-neutral-0/50 uppercase tracking-wider">Registry Status</span>
                  <span className="inline-flex items-center gap-1.5 text-caption text-primary-700 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified
                  </span>
                </div>

                <div className="flex items-center justify-between py-2.5 px-3 bg-neutral-900/[0.02] dark:bg-card/[0.02] rounded-[var(--radius)]">
                  <span className="text-caption text-muted-foreground dark:text-neutral-0/50 uppercase tracking-wider">Marketability</span>
                  <span className="text-caption text-primary-700 font-medium">High</span>
                </div>
              </div>
            </div>

            {/* Development Potential */}
            <div className="bg-card border border-black/5 dark:border-white/5 rounded-[var(--radius-card)] p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-[var(--radius)] bg-blue-500/10 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                </div>
                <h3 className="text-caption tracking-widest uppercase text-muted-foreground dark:text-neutral-300/60">
                  Development Potential
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-black/5 dark:border-white/5">
                  <span className="text-caption text-muted-foreground dark:text-neutral-0/50">FSI Available</span>
                  <span className="text-[15px] text-foreground dark:text-neutral-0/95 font-medium">2.5x</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-black/5 dark:border-white/5">
                  <span className="text-caption text-muted-foreground dark:text-neutral-0/50">Max Buildable</span>
                  <span className="text-[15px] text-foreground dark:text-neutral-0/95 font-medium">12,500 sq ft</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-caption text-muted-foreground dark:text-neutral-0/50">Approval Status</span>
                  <span className="inline-flex items-center gap-1.5 text-small text-primary-700 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Ready
                  </span>
                </div>
              </div>
            </div>

            {/* Infrastructure Proximity */}
            <div className="bg-card border border-black/5 dark:border-white/5 rounded-[var(--radius-card)] p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-[var(--radius)] bg-purple-500/10 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-purple-500" />
                </div>
                <h3 className="text-caption tracking-widest uppercase text-muted-foreground dark:text-neutral-300/60">
                  Infrastructure Proximity
                </h3>
              </div>
              
              <div className="space-y-4">
                {signals.slice(0, 3).map((signal, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          signal.impact === 'positive' ? 'bg-primary-700' : 'bg-neutral-900/20 dark:bg-card/20'
                        }`}></div>
                        <span className="text-caption text-foreground dark:text-neutral-0/95">{signal.label}</span>
                      </div>
                      <span className="text-caption font-medium text-muted-foreground dark:text-neutral-0/50">{signal.distance}</span>
                    </div>
                    <div className="h-1 rounded-full bg-neutral-900/5 dark:bg-card/5 overflow-hidden">
                      <div 
                        className={`h-full transition-all ${
                          signal.impact === 'positive' ? 'bg-primary-700/60' : 'bg-neutral-900/10 dark:bg-card/10'
                        }`}
                        style={{ width: `${Math.max(10, 100 - (parseFloat(signal.distance) * 15))}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-black/5 dark:border-white/5">
                <div className="flex items-center gap-3 text-caption text-muted-foreground dark:text-neutral-300/60">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-primary-700"></div>
                    <span>Positive</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-neutral-900/20 dark:bg-card/20"></div>
                    <span>Neutral</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}