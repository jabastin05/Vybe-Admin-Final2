import { useParams, Link } from 'react-router';
import { ArrowLeft, Clock, CheckCircle2, User, Award, ArrowRight } from 'lucide-react';
import { mockPropertyCases, mockPartner } from '../data/mock-data';
import { SideNav } from '../components/SideNav';
import { ThemeToggle } from '../components/ThemeToggle';

export function PartnerRouting() {
  const { id } = useParams();
  const property = mockPropertyCases.find(p => p.id === id);

  if (!property) {
    return <div className="min-h-screen bg-background dark:bg-neutral-900 flex items-center justify-center text-muted-foreground dark:text-neutral-300/60">Property not found</div>;
  }

  return (
    <div className="min-h-screen bg-background dark:bg-neutral-900 transition-colors duration-300">
      <SideNav />
      
      {/* Main Content with equal padding for side nav */}
      <div className="px-8">
        {/* Header */}
        <div className="border-b border-black/5 dark:border-white/5 bg-card dark:bg-neutral-900/40">
          <div className="max-w-7xl mx-auto px-8 py-6">
            <Link to={`/property/${id}/habu`} className="inline-flex items-center gap-2 text-muted-foreground dark:text-neutral-300/60 hover:text-neutral-700/80 dark:hover:text-neutral-300/80 transition-colors text-small mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to HABU Report
            </Link>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-caption tracking-wider uppercase text-muted-foreground dark:text-neutral-300/60 mb-2">
                  Partner Assignment
                </div>
                <div className="text-h1 tracking-tight text-foreground dark:text-neutral-0/95 mb-2">
                  Your Execution Partner
                </div>
                <p className="text-small text-muted-foreground dark:text-neutral-0/50 max-w-2xl">
                  Based on your strategy selection and property requirements, we've matched you with a senior execution specialist
                </p>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-8 py-12">
          {/* Partner Card */}
          <div className="bg-card border border-black/5 dark:border-white/5 rounded-[var(--radius)] overflow-hidden mb-6">
            <div className="p-12">
              <div className="flex items-start gap-8">
                {/* Partner Photo */}
                <div className="flex-shrink-0">
                  <img
                    src={mockPartner.photo}
                    alt={mockPartner.name}
                    className="w-32 h-32 rounded-[var(--radius)] object-cover"
                  />
                </div>

                {/* Partner Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-h2 tracking-tight text-foreground dark:text-neutral-0/95 mb-2">
                        {mockPartner.name}
                      </h2>
                      <p className="text-small text-neutral-700/80 dark:text-neutral-300/80 mb-1">
                        {mockPartner.role}
                      </p>
                      <p className="text-small text-muted-foreground dark:text-neutral-300/60">
                        {mockPartner.experience}
                      </p>
                    </div>
                    <div className="bg-primary-700/10 text-primary-600 px-3 py-1.5 rounded-[var(--radius)] text-caption tracking-wide border border-primary-700/20">
                      Verified Expert
                    </div>
                  </div>

                  {/* Expertise Areas */}
                  <div className="grid grid-cols-3 gap-4 mt-8">
                    <div className="bg-neutral-900/[0.02] dark:bg-card/[0.02] border border-black/5 dark:border-white/5 rounded-[var(--radius)] p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="w-4 h-4 text-blue-400" />
                        <div className="text-caption text-muted-foreground dark:text-neutral-300/60 tracking-wide uppercase">Projects Led</div>
                      </div>
                      <div className="text-h3 tracking-tight text-foreground dark:text-neutral-0/95">42</div>
                    </div>

                    <div className="bg-neutral-900/[0.02] dark:bg-card/[0.02] border border-black/5 dark:border-white/5 rounded-[var(--radius)] p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-blue-400" />
                        <div className="text-caption text-muted-foreground dark:text-neutral-300/60 tracking-wide uppercase">Client Rating</div>
                      </div>
                      <div className="text-h3 tracking-tight text-foreground dark:text-neutral-0/95">4.9/5</div>
                    </div>

                    <div className="bg-neutral-900/[0.02] dark:bg-card/[0.02] border border-black/5 dark:border-white/5 rounded-[var(--radius)] p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-400" />
                        <div className="text-caption text-muted-foreground dark:text-neutral-300/60 tracking-wide uppercase">Success Rate</div>
                      </div>
                      <div className="text-h3 tracking-tight text-foreground dark:text-neutral-0/95">96%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SLA Information */}
            <div className="border-t border-black/5 dark:border-white/5 bg-neutral-900/[0.02] dark:bg-card/[0.02] p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[var(--radius)] bg-blue-500/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-small text-foreground dark:text-neutral-0/95 mb-1">Service Level Agreement</div>
                    <div className="text-caption text-muted-foreground dark:text-neutral-0/50">
                      {mockPartner.slaTimeline}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Why This Match */}
          <div className="bg-card border border-black/5 dark:border-white/5 rounded-[var(--radius)] p-10 mb-6">
            <h3 className="text-small tracking-wider uppercase text-muted-foreground dark:text-neutral-300/60 mb-6">
              Why This Match?
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-small text-foreground dark:text-neutral-0/95 mb-1">Relevant Expertise</div>
                  <div className="text-small text-neutral-700/80 dark:text-neutral-300/80">
                    Specialized in commercial office developments with 15+ successful projects in similar markets
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-small text-foreground dark:text-neutral-0/95 mb-1">Geographic Knowledge</div>
                  <div className="text-small text-neutral-700/80 dark:text-neutral-300/80">
                    Deep understanding of {property.location} regulatory environment and market dynamics
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-small text-foreground dark:text-neutral-0/95 mb-1">Track Record</div>
                  <div className="text-small text-neutral-700/80 dark:text-neutral-300/80">
                    Consistently delivered projects on time and within budget, with average ROI exceeding projections by 8%
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-small text-foreground dark:text-neutral-0/95 mb-1">Network Access</div>
                  <div className="text-small text-neutral-700/80 dark:text-neutral-300/80">
                    Strong relationships with local authorities, contractors, and institutional investors
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <Link
              to={`/property/${id}/execution`}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-neutral-900 dark:bg-card text-neutral-0 dark:text-foreground px-6 py-4 rounded-[var(--radius)] hover:bg-neutral-900/90 dark:hover:bg-card/90 transition-colors text-small tracking-wide"
            >
              Accept & Begin Execution
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button className="flex-1 inline-flex items-center justify-center gap-2 bg-neutral-900/5 dark:bg-card/5 text-foreground/95 dark:text-neutral-0/95 px-6 py-4 rounded-[var(--radius)] hover:bg-neutral-900/10 dark:hover:bg-card/10 transition-colors text-small tracking-wide border border-black/10 dark:border-white/10">
              Request Different Partner
            </button>
          </div>

          {/* Additional Information */}
          <div className="mt-8 bg-blue-500/5 border border-blue-500/10 rounded-[var(--radius)] p-6">
            <p className="text-caption text-neutral-700/80 dark:text-neutral-300/80 leading-relaxed">
              Partner assignments are made by our AI system based on expertise match, availability, and historical performance. 
              All partners are vetted professionals with verified credentials and track records.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}