import { useParams, Link } from 'react-router';
import { ArrowLeft, Clock, CheckCircle2, User, Award, ArrowRight } from 'lucide-react';
import { mockPropertyCases, mockPartner } from '../data/mock-data';
import { SideNav } from '../components/SideNav';
import { ThemeToggle } from '../components/ThemeToggle';

export function PartnerRouting() {
  const { id } = useParams();
  const property = mockPropertyCases.find(p => p.id === id);

  if (!property) {
    return <div className="min-h-screen bg-[#F2F2F2] dark:bg-[#0a0a0a] flex items-center justify-center text-black/40 dark:text-white/40">Property not found</div>;
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] dark:bg-[#0a0a0a] transition-colors duration-300">
      <SideNav />
      
      {/* Main Content with equal padding for side nav */}
      <div className="px-8">
        {/* Header */}
        <div className="border-b border-black/5 dark:border-white/5 bg-white dark:bg-black/40">
          <div className="max-w-7xl mx-auto px-8 py-6">
            <Link to={`/property/${id}/habu`} className="inline-flex items-center gap-2 text-black/40 dark:text-white/40 hover:text-black/60 dark:hover:text-white/60 transition-colors text-[14px] mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to HABU Report
            </Link>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[12px] tracking-wider uppercase text-black/40 dark:text-white/40 mb-2">
                  Partner Assignment
                </div>
                <div className="text-[32px] tracking-tight text-black dark:text-white/95 mb-2">
                  Your Execution Partner
                </div>
                <p className="text-[14px] text-black/50 dark:text-white/50 max-w-2xl">
                  Based on your strategy selection and property requirements, we've matched you with a senior execution specialist
                </p>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-8 py-12">
          {/* Partner Card */}
          <div className="bg-white dark:bg-[#111111] border border-black/5 dark:border-white/5 rounded-lg overflow-hidden mb-6">
            <div className="p-12">
              <div className="flex items-start gap-8">
                {/* Partner Photo */}
                <div className="flex-shrink-0">
                  <img
                    src={mockPartner.photo}
                    alt={mockPartner.name}
                    className="w-32 h-32 rounded-lg object-cover"
                  />
                </div>

                {/* Partner Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-[24px] tracking-tight text-black dark:text-white/95 mb-2">
                        {mockPartner.name}
                      </h2>
                      <p className="text-[14px] text-black/60 dark:text-white/60 mb-1">
                        {mockPartner.role}
                      </p>
                      <p className="text-[13px] text-black/40 dark:text-white/40">
                        {mockPartner.experience}
                      </p>
                    </div>
                    <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-md text-[12px] tracking-wide border border-emerald-500/20">
                      Verified Expert
                    </div>
                  </div>

                  {/* Expertise Areas */}
                  <div className="grid grid-cols-3 gap-4 mt-8">
                    <div className="bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 rounded-lg p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="w-4 h-4 text-blue-400" />
                        <div className="text-[11px] text-black/40 dark:text-white/40 tracking-wide uppercase">Projects Led</div>
                      </div>
                      <div className="text-[20px] tracking-tight text-black dark:text-white/95">42</div>
                    </div>

                    <div className="bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 rounded-lg p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-blue-400" />
                        <div className="text-[11px] text-black/40 dark:text-white/40 tracking-wide uppercase">Client Rating</div>
                      </div>
                      <div className="text-[20px] tracking-tight text-black dark:text-white/95">4.9/5</div>
                    </div>

                    <div className="bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 rounded-lg p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-400" />
                        <div className="text-[11px] text-black/40 dark:text-white/40 tracking-wide uppercase">Success Rate</div>
                      </div>
                      <div className="text-[20px] tracking-tight text-black dark:text-white/95">96%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SLA Information */}
            <div className="border-t border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-blue-500/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-[13px] text-black dark:text-white/95 mb-1">Service Level Agreement</div>
                    <div className="text-[12px] text-black/50 dark:text-white/50">
                      {mockPartner.slaTimeline}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Why This Match */}
          <div className="bg-white dark:bg-[#111111] border border-black/5 dark:border-white/5 rounded-lg p-10 mb-6">
            <h3 className="text-[14px] tracking-wider uppercase text-black/40 dark:text-white/40 mb-6">
              Why This Match?
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-[14px] text-black dark:text-white/95 mb-1">Relevant Expertise</div>
                  <div className="text-[13px] text-black/60 dark:text-white/60">
                    Specialized in commercial office developments with 15+ successful projects in similar markets
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-[14px] text-black dark:text-white/95 mb-1">Geographic Knowledge</div>
                  <div className="text-[13px] text-black/60 dark:text-white/60">
                    Deep understanding of {property.location} regulatory environment and market dynamics
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-[14px] text-black dark:text-white/95 mb-1">Track Record</div>
                  <div className="text-[13px] text-black/60 dark:text-white/60">
                    Consistently delivered projects on time and within budget, with average ROI exceeding projections by 8%
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-[14px] text-black dark:text-white/95 mb-1">Network Access</div>
                  <div className="text-[13px] text-black/60 dark:text-white/60">
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
              className="flex-1 inline-flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black px-6 py-4 rounded-md hover:bg-black/90 dark:hover:bg-white/90 transition-colors text-[14px] tracking-wide"
            >
              Accept & Begin Execution
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button className="flex-1 inline-flex items-center justify-center gap-2 bg-black/5 dark:bg-white/5 text-black/95 dark:text-white/95 px-6 py-4 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-[14px] tracking-wide border border-black/10 dark:border-white/10">
              Request Different Partner
            </button>
          </div>

          {/* Additional Information */}
          <div className="mt-8 bg-blue-500/5 border border-blue-500/10 rounded-lg p-6">
            <p className="text-[12px] text-black/60 dark:text-white/60 leading-relaxed">
              Partner assignments are made by our AI system based on expertise match, availability, and historical performance. 
              All partners are vetted professionals with verified credentials and track records.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}