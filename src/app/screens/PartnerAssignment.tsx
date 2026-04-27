import { ArrowLeft, CheckCircle2, Clock, ArrowRight, Briefcase, Star, Target } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router';
import { SideNav } from '../components/SideNav';
import { ThemeToggle } from '../components/ThemeToggle';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function PartnerAssignment() {
  const { id, strategyId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background dark:bg-neutral-900 transition-colors duration-300">
      <SideNav />
      
      {/* Main Content with responsive padding for side nav */}
      <div className="lg:pl-[88px]">
        {/* Header - Full Width */}
        <div className="border-b border-black/5 dark:border-white/5 bg-card dark:bg-neutral-900/40">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Left: Back Button + Page Title */}
              <div className="flex items-start md:items-center gap-3 md:gap-4">
                <Link 
                  to={`/property/${id}/habu`}
                  className="inline-flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-[var(--radius)] bg-neutral-900/5 dark:bg-card/5 hover:bg-neutral-900/10 dark:hover:bg-card/10 transition-colors text-neutral-700/80 dark:text-neutral-300/80 flex-shrink-0 touch-manipulation"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="text-caption md:text-caption tracking-wider uppercase text-muted-foreground dark:text-neutral-0/50 mb-1 md:mb-2">
                    Partner Assignment
                  </div>
                  <div className="text-h3 md:text-h1 lg:text-h1 tracking-tight text-foreground dark:text-neutral-0 leading-tight">
                    Your Execution Partner
                  </div>
                  <p className="text-small md:text-small text-muted-foreground dark:text-neutral-300/80 mt-1 hidden md:block">
                    AI-matched senior specialist for your strategy execution
                  </p>
                </div>
              </div>

              {/* Right: Theme Toggle */}
              <div className="flex items-center gap-3 md:self-start">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-12">
          {/* Intro Text */}
          <div className="mb-6 md:mb-8 lg:mb-[var(--space-10)]">
            <p className="text-small md:text-[15px] text-neutral-700/80 dark:text-neutral-300/80 leading-relaxed">
              Based on your strategy selection and property requirements, we've matched you with a senior execution specialist
            </p>
          </div>

          {/* Partner Card */}
          <div className="bg-card border border-black/5 dark:border-white/5 rounded-[var(--radius-card)] overflow-hidden mb-6 md:mb-8">
            <div className="p-4 md:p-6 lg:p-8">
              {/* Partner Profile */}
              <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6 mb-6 md:mb-8">
                {/* Profile Image */}
                <div className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-[var(--radius-card)] overflow-hidden bg-neutral-900/5 dark:bg-card/5 flex-shrink-0 mx-auto md:mx-0">
                  <ImageWithFallback 
                    src="https://images.unsplash.com/photo-1584940120505-117038d90b05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzc21hbiUyMGluZGlhbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MTkyMzg5OXww&ixlib=rb-4.1.0&q=80&w=1080" 
                    alt="Rajesh Malhotra"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Partner Info */}
                <div className="flex-1 w-full text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-h3 md:text-h2 lg:text-h2 tracking-tight text-foreground dark:text-neutral-0/95 font-medium mb-2">
                        Rajesh Malhotra
                      </h2>
                      <p className="text-small md:text-[15px] text-neutral-700/80 dark:text-neutral-300/80 mb-1">
                        Senior Real Estate Strategist
                      </p>
                      <p className="text-caption md:text-small text-muted-foreground dark:text-neutral-300/60">
                        18 years in commercial development
                      </p>
                    </div>
                    <div className="bg-primary-700/10 border border-primary-700/20 text-primary-700 dark:text-primary-400 px-3 md:px-4 py-2 rounded-[var(--radius)] text-caption md:text-caption font-medium tracking-wide mx-auto md:mx-0 inline-flex items-center justify-center">
                      Verified Expert
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid - Responsive: 1 col mobile, 3 cols tablet+ */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
                {/* Projects Led */}
                <div className="bg-neutral-900/[0.02] dark:bg-card/[0.02] border border-black/5 dark:border-white/5 rounded-[var(--radius-card)] p-4 md:p-5 lg:p-6">
                  <div className="flex items-center gap-2 mb-2 md:mb-3">
                    <Briefcase className="w-4 h-4 text-blue-500" />
                    <div className="text-caption md:text-caption tracking-widest uppercase text-muted-foreground dark:text-neutral-300/60 font-medium">
                      Projects Led
                    </div>
                  </div>
                  <div className="text-h1 md:text-[30px] lg:text-h1 tracking-tight text-foreground dark:text-neutral-0/95 font-normal">
                    42
                  </div>
                </div>

                {/* Client Rating */}
                <div className="bg-neutral-900/[0.02] dark:bg-card/[0.02] border border-black/5 dark:border-white/5 rounded-[var(--radius-card)] p-4 md:p-5 lg:p-6">
                  <div className="flex items-center gap-2 mb-2 md:mb-3">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <div className="text-caption md:text-caption tracking-widest uppercase text-muted-foreground dark:text-neutral-300/60 font-medium">
                      Client Rating
                    </div>
                  </div>
                  <div className="text-h1 md:text-[30px] lg:text-h1 tracking-tight text-foreground dark:text-neutral-0/95 font-normal">
                    4.9<span className="text-h3 md:text-h3 text-muted-foreground dark:text-neutral-300/60">/5</span>
                  </div>
                </div>

                {/* Success Rate */}
                <div className="bg-neutral-900/[0.02] dark:bg-card/[0.02] border border-black/5 dark:border-white/5 rounded-[var(--radius-card)] p-4 md:p-5 lg:p-6">
                  <div className="flex items-center gap-2 mb-2 md:mb-3">
                    <Target className="w-4 h-4 text-primary-700" />
                    <div className="text-caption md:text-caption tracking-widest uppercase text-muted-foreground dark:text-neutral-300/60 font-medium">
                      Success Rate
                    </div>
                  </div>
                  <div className="text-h1 md:text-[30px] lg:text-h1 tracking-tight text-foreground dark:text-neutral-0/95 font-normal">
                    96%
                  </div>
                </div>
              </div>

              {/* Service Level Agreement */}
              <div className="bg-blue-500/5 border border-blue-500/10 rounded-[var(--radius-card)] p-4 md:p-5 flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-[var(--radius-card)] bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-caption md:text-small text-foreground dark:text-neutral-0/95 font-medium mb-1">
                    Service Level Agreement
                  </div>
                  <div className="text-caption md:text-small text-neutral-700/80 dark:text-neutral-300/80">
                    72 hours for initial consultation
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Why This Match Section */}
          <div className="bg-card border border-black/5 dark:border-white/5 rounded-[var(--radius-card)] overflow-hidden mb-6 md:mb-8">
            <div className="px-4 md:px-6 lg:px-8 py-4 md:py-5 lg:py-6 border-b border-black/5 dark:border-white/5">
              <h3 className="text-caption md:text-caption tracking-widest uppercase text-muted-foreground dark:text-neutral-300/60 font-medium">
                Why This Match?
              </h3>
            </div>
            <div className="p-4 md:p-6 lg:p-8">
              <div className="space-y-5 md:space-y-6">
                {/* Relevant Expertise */}
                <div className="flex gap-3 md:gap-4">
                  <div className="w-6 h-6 rounded-full bg-primary-700/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-small md:text-[15px] text-foreground dark:text-neutral-0/95 font-medium mb-1.5 md:mb-2">
                      Relevant Expertise
                    </h4>
                    <p className="text-small md:text-small text-neutral-700/80 dark:text-neutral-300/80 leading-relaxed">
                      Specialized in commercial office developments with 15+ successful projects in similar markets
                    </p>
                  </div>
                </div>

                {/* Geographic Knowledge */}
                <div className="flex gap-3 md:gap-4">
                  <div className="w-6 h-6 rounded-full bg-primary-700/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-small md:text-[15px] text-foreground dark:text-neutral-0/95 font-medium mb-1.5 md:mb-2">
                      Geographic Knowledge
                    </h4>
                    <p className="text-small md:text-small text-neutral-700/80 dark:text-neutral-300/80 leading-relaxed">
                      Deep understanding of Mumbai, Maharashtra regulatory environment and market dynamics
                    </p>
                  </div>
                </div>

                {/* Track Record */}
                <div className="flex gap-3 md:gap-4">
                  <div className="w-6 h-6 rounded-full bg-primary-700/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-small md:text-[15px] text-foreground dark:text-neutral-0/95 font-medium mb-1.5 md:mb-2">
                      Track Record
                    </h4>
                    <p className="text-small md:text-small text-neutral-700/80 dark:text-neutral-300/80 leading-relaxed">
                      Consistently delivered projects on time and within budget, with average ROI exceeding projections by 8%
                    </p>
                  </div>
                </div>

                {/* Network Access */}
                <div className="flex gap-3 md:gap-4">
                  <div className="w-6 h-6 rounded-full bg-primary-700/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-small md:text-[15px] text-foreground dark:text-neutral-0/95 font-medium mb-1.5 md:mb-2">
                      Network Access
                    </h4>
                    <p className="text-small md:text-small text-neutral-700/80 dark:text-neutral-300/80 leading-relaxed">
                      Established relationships with key municipal authorities, contractors, and institutional investors in the region
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Execution Blueprint */}
          <div className="bg-card border border-black/5 dark:border-white/5 rounded-[var(--radius-card)] overflow-hidden mb-6 md:mb-8">
            <div className="px-4 md:px-6 lg:px-8 py-4 md:py-5 lg:py-6 border-b border-black/5 dark:border-white/5">
              <h3 className="text-small md:text-[15px] tracking-tight text-foreground dark:text-neutral-0/95 font-medium">
                Execution Blueprint
              </h3>
              <p className="text-caption md:text-small text-muted-foreground dark:text-neutral-300/60 mt-1">
                Structured phased execution program with milestone tracking
              </p>
            </div>
            <div className="p-4 md:p-6 lg:p-8">
              {/* Timeline Overview */}
              <div className="mb-6 md:mb-8">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-caption md:text-caption text-muted-foreground dark:text-neutral-300/60 uppercase tracking-wider font-medium">Total Timeline</div>
                  <div className="text-small md:text-[15px] font-medium text-foreground dark:text-neutral-0/95">30-42 Months</div>
                </div>
                <div className="h-2 bg-neutral-900/5 dark:bg-card/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 via-orange-500 via-primary-700 to-cyan-500 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>

              {/* Phase 1: Pre-Development */}
              <div className="mb-6">
                <div className="flex items-start gap-3 md:gap-4 mb-4">
                  <div className="w-10 h-10 rounded-[var(--radius-card)] bg-blue-500 text-neutral-0 flex items-center justify-center text-small font-medium flex-shrink-0">
                    1
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-2 mb-3 md:mb-2">
                      <h4 className="text-[15px] md:text-[16px] font-medium text-foreground dark:text-neutral-0/95">Phase 1: Pre-Development</h4>
                      <div className="text-caption md:text-small text-muted-foreground dark:text-neutral-300/60">0–4 Months</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                      <div className="bg-blue-500/5 border border-blue-500/20 rounded-[var(--radius)] p-3 md:p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                          <div className="text-caption md:text-small font-medium text-foreground dark:text-neutral-0/95">Legal Due Diligence</div>
                        </div>
                        <div className="text-caption md:text-caption text-muted-foreground dark:text-neutral-0/50">Title verification & clearances</div>
                      </div>
                      <div className="bg-blue-500/5 border border-blue-500/20 rounded-[var(--radius)] p-3 md:p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                          <div className="text-caption md:text-small font-medium text-foreground dark:text-neutral-0/95">Concept Design Freeze</div>
                        </div>
                        <div className="text-caption md:text-caption text-muted-foreground dark:text-neutral-0/50">Architectural plans & layouts</div>
                      </div>
                      <div className="bg-blue-500/5 border border-blue-500/20 rounded-[var(--radius)] p-3 md:p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                          <div className="text-caption md:text-small font-medium text-foreground dark:text-neutral-0/95">Financial Feasibility</div>
                        </div>
                        <div className="text-caption md:text-caption text-muted-foreground dark:text-neutral-0/50">Budget & funding structure</div>
                      </div>
                      <div className="bg-blue-500/5 border border-blue-500/20 rounded-[var(--radius)] p-3 md:p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                          <div className="text-caption md:text-small font-medium text-foreground dark:text-neutral-0/95">Partner Assignment</div>
                        </div>
                        <div className="text-caption md:text-caption text-muted-foreground dark:text-neutral-0/50">Core team & consultants</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phase 2: Regulatory Approvals */}
              <div className="mb-6">
                <div className="flex items-start gap-3 md:gap-4 mb-4">
                  <div className="w-10 h-10 rounded-[var(--radius-card)] bg-purple-500 text-neutral-0 flex items-center justify-center text-small font-medium flex-shrink-0">
                    2
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-2 mb-3 md:mb-2">
                      <h4 className="text-[15px] md:text-[16px] font-medium text-foreground dark:text-neutral-0/95">Phase 2: Regulatory Approvals</h4>
                      <div className="text-caption md:text-small text-muted-foreground dark:text-neutral-300/60">4–8 Months</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                      <div className="bg-purple-500/5 border border-purple-500/20 rounded-[var(--radius)] p-3 md:p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                          <div className="text-caption md:text-small font-medium text-foreground dark:text-neutral-0/95">Plan Submission</div>
                        </div>
                        <div className="text-caption md:text-caption text-muted-foreground dark:text-neutral-0/50">Municipal approval</div>
                      </div>
                      <div className="bg-purple-500/5 border border-purple-500/20 rounded-[var(--radius)] p-3 md:p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                          <div className="text-caption md:text-small font-medium text-foreground dark:text-neutral-0/95">Fire & Safety NOC</div>
                        </div>
                        <div className="text-caption md:text-caption text-muted-foreground dark:text-neutral-0/50">Fire department clearance</div>
                      </div>
                      <div className="bg-purple-500/5 border border-purple-500/20 rounded-[var(--radius)] p-3 md:p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                          <div className="text-caption md:text-small font-medium text-foreground dark:text-neutral-0/95">Environmental</div>
                        </div>
                        <div className="text-caption md:text-caption text-muted-foreground dark:text-neutral-0/50">EC if required</div>
                      </div>
                      <div className="bg-purple-500/5 border border-purple-500/20 rounded-[var(--radius)] p-3 md:p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                          <div className="text-caption md:text-small font-medium text-foreground dark:text-neutral-0/95">Utility Approvals</div>
                        </div>
                        <div className="text-caption md:text-caption text-muted-foreground dark:text-neutral-0/50">Water, power, sewage</div>
                      </div>
                      <div className="bg-purple-500/5 border border-purple-500/20 rounded-[var(--radius)] p-3 md:p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                          <div className="text-caption md:text-small font-medium text-foreground dark:text-neutral-0/95">Building Permit</div>
                        </div>
                        <div className="text-caption md:text-caption text-muted-foreground dark:text-neutral-0/50">Final construction approval</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phase 3: Construction */}
              <div className="mb-6">
                <div className="flex items-start gap-3 md:gap-4 mb-4">
                  <div className="w-10 h-10 rounded-[var(--radius-card)] bg-primary-700 text-neutral-0 flex items-center justify-center text-small font-medium flex-shrink-0">
                    3
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-2 mb-3 md:mb-2">
                      <h4 className="text-[15px] md:text-[16px] font-medium text-foreground dark:text-neutral-0/95">Phase 3: Construction</h4>
                      <div className="text-caption md:text-small text-muted-foreground dark:text-neutral-300/60">8–30 Months</div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                      <div>
                        <div className="text-caption md:text-caption text-muted-foreground dark:text-neutral-300/60 uppercase tracking-wider mb-3 font-medium">Key Milestones</div>
                        <div className="space-y-2">
                          <div className="bg-primary-700/5 border border-primary-700/20 rounded-[var(--radius)] p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary-700"></div>
                              <div className="text-caption md:text-small font-medium text-foreground dark:text-neutral-0/95">Site Mobilization</div>
                            </div>
                            <div className="text-caption md:text-caption text-muted-foreground dark:text-neutral-0/50">Month 1</div>
                          </div>
                          <div className="bg-primary-700/5 border border-primary-700/20 rounded-[var(--radius)] p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary-700"></div>
                              <div className="text-caption md:text-small font-medium text-foreground dark:text-neutral-0/95">Foundation Complete</div>
                            </div>
                            <div className="text-caption md:text-caption text-muted-foreground dark:text-neutral-0/50">Month 4</div>
                          </div>
                          <div className="bg-primary-700/5 border border-primary-700/20 rounded-[var(--radius)] p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary-700"></div>
                              <div className="text-caption md:text-small font-medium text-foreground dark:text-neutral-0/95">Structural Completion</div>
                            </div>
                            <div className="text-caption md:text-caption text-muted-foreground dark:text-neutral-0/50">Month 16</div>
                          </div>
                          <div className="bg-primary-700/5 border border-primary-700/20 rounded-[var(--radius)] p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary-700"></div>
                              <div className="text-caption md:text-small font-medium text-foreground dark:text-neutral-0/95">MEP & Finishing</div>
                            </div>
                            <div className="text-caption md:text-caption text-muted-foreground dark:text-neutral-0/50">Month 20-28</div>
                          </div>
                          <div className="bg-primary-700/5 border border-primary-700/20 rounded-[var(--radius)] p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary-700"></div>
                              <div className="text-caption md:text-small font-medium text-foreground dark:text-neutral-0/95">OC & Handover</div>
                            </div>
                            <div className="text-caption md:text-caption text-muted-foreground dark:text-neutral-0/50">Month 30</div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="text-caption md:text-caption text-muted-foreground dark:text-neutral-300/60 uppercase tracking-wider mb-3 font-medium">Monitoring KPIs</div>
                        <div className="space-y-3">
                          <div className="bg-neutral-900/[0.02] dark:bg-card/[0.02] border border-black/5 dark:border-white/5 rounded-[var(--radius)] p-4">
                            <div className="text-caption md:text-caption text-neutral-700/80 dark:text-neutral-300/80 mb-2">Budget Variance</div>
                            <div className="flex items-baseline gap-1">
                              <div className="text-h3 md:text-h3 font-normal text-primary-700 dark:text-primary-400">±3</div>
                              <div className="text-caption md:text-small text-muted-foreground dark:text-neutral-300/60">%</div>
                            </div>
                          </div>
                          <div className="bg-neutral-900/[0.02] dark:bg-card/[0.02] border border-black/5 dark:border-white/5 rounded-[var(--radius)] p-4">
                            <div className="text-caption md:text-caption text-neutral-700/80 dark:text-neutral-300/80 mb-2">Timeline Adherence</div>
                            <div className="flex items-baseline gap-1">
                              <div className="text-h3 md:text-h3 font-normal text-primary-700 dark:text-primary-400">95</div>
                              <div className="text-caption md:text-small text-muted-foreground dark:text-neutral-300/60">%</div>
                            </div>
                          </div>
                          <div className="bg-neutral-900/[0.02] dark:bg-card/[0.02] border border-black/5 dark:border-white/5 rounded-[var(--radius)] p-4">
                            <div className="text-caption md:text-caption text-neutral-700/80 dark:text-neutral-300/80 mb-2">Quality Score</div>
                            <div className="flex items-baseline gap-1">
                              <div className="text-h3 md:text-h3 font-normal text-primary-700 dark:text-primary-400">4.8</div>
                              <div className="text-caption md:text-small text-muted-foreground dark:text-neutral-300/60">/5</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phase 4: Monetization */}
              <div className="mb-6">
                <div className="flex items-start gap-3 md:gap-4 mb-4">
                  <div className="w-10 h-10 rounded-[var(--radius-card)] bg-cyan-500 text-neutral-0 flex items-center justify-center text-small font-medium flex-shrink-0">
                    4
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-2 mb-3 md:mb-2">
                      <h4 className="text-[15px] md:text-[16px] font-medium text-foreground dark:text-neutral-0/95">Phase 4: Monetization & Exit</h4>
                      <div className="text-caption md:text-small text-muted-foreground dark:text-neutral-300/60">Ongoing</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                      <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-[var(--radius)] p-3 md:p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div>
                          <div className="text-caption md:text-small font-medium text-foreground dark:text-neutral-0/95">Pre-Launch Marketing</div>
                        </div>
                        <div className="text-caption md:text-caption text-muted-foreground dark:text-neutral-0/50">Brand positioning</div>
                      </div>
                      <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-[var(--radius)] p-3 md:p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div>
                          <div className="text-caption md:text-small font-medium text-foreground dark:text-neutral-0/95">Sales/Leasing</div>
                        </div>
                        <div className="text-caption md:text-caption text-muted-foreground dark:text-neutral-0/50">Absorption targets</div>
                      </div>
                      <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-[var(--radius)] p-3 md:p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div>
                          <div className="text-caption md:text-small font-medium text-foreground dark:text-neutral-0/95">Revenue Realization</div>
                        </div>
                        <div className="text-caption md:text-caption text-muted-foreground dark:text-neutral-0/50">Exit execution</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons - Touch-friendly on mobile */}
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="flex-1 bg-neutral-900 dark:bg-card text-neutral-0 dark:text-foreground px-6 py-4 rounded-[var(--radius-card)] text-small md:text-small font-medium tracking-wide transition-all hover:bg-neutral-900/90 dark:hover:bg-card/90 text-center touch-manipulation active:scale-[0.98]"
            >
              Continue with the Blueprint
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
