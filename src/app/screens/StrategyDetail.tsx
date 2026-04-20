import { useParams, Link } from 'react-router';
import { ArrowLeft, TrendingUp, AlertTriangle, Info, ArrowRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { mockPropertyCases, mockStrategies } from '../data/mock-data';
import { SideNav } from '../components/SideNav';
import { ThemeToggle } from '../components/ThemeToggle';

export function StrategyDetail() {
  const { id, strategyId } = useParams();
  const property = mockPropertyCases.find(p => p.id === id);
  const strategy = mockStrategies.find(s => s.id === strategyId);

  if (!property || !strategy) {
    return <div className="min-h-screen bg-[#F2F2F2] dark:bg-[#0a0a0a] flex items-center justify-center text-black/40 dark:text-white/40">Not found</div>;
  }

  const assumptions = [
    'Land acquisition at current market rates',
    'FSI utilization at 2.5x permitted ratio',
    'Construction cost: ₹8,500/sq ft',
    'Pre-lease commitment: 40% before completion',
    'Market appreciation: 6-8% annually',
    'Occupancy rate: 85% in Year 1, 95% by Year 2',
  ];

  const risks = [
    { category: 'Market Risk', score: 35, mitigation: 'Pre-sales strategy & flexible pricing' },
    { category: 'Regulatory Risk', score: 20, mitigation: 'All clearances secured upfront' },
    { category: 'Construction Risk', score: 28, mitigation: 'Tier-1 contractor with performance bonds' },
    { category: 'Financial Risk', score: 22, mitigation: 'Structured payment milestones' },
  ];

  const milestones = [
    { phase: 'Due Diligence', duration: '2 months', status: 'pending' },
    { phase: 'Approvals & Permits', duration: '4 months', status: 'pending' },
    { phase: 'Design & Planning', duration: '3 months', status: 'pending' },
    { phase: 'Construction Phase 1', duration: '12 months', status: 'pending' },
    { phase: 'Construction Phase 2', duration: '10 months', status: 'pending' },
    { phase: 'Handover & Leasing', duration: '5 months', status: 'pending' },
  ];

  const sensitivityData = [
    { scenario: 'Best Case', roi: strategy.roi + 8, revenue: 180 },
    { scenario: 'Base Case', roi: strategy.roi, revenue: 145 },
    { scenario: 'Worst Case', roi: strategy.roi - 12, revenue: 95 },
  ];

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
                  Strategy Analysis
                </div>
                <div className="text-[32px] tracking-tight text-black dark:text-white/95 mb-2">
                  {strategy.name}
                </div>
                <p className="text-[14px] text-black/50 dark:text-white/50 max-w-2xl">
                  {strategy.description}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <Link
                  to={`/property/${id}/partner`}
                  className="inline-flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-md hover:bg-black/90 dark:hover:bg-white/90 transition-colors text-[14px] tracking-wide"
                >
                  Proceed with Strategy
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8 py-12">
          {/* Financial Projections */}
          <div className="bg-white dark:bg-[#111111] border border-black/5 dark:border-white/5 rounded-lg p-10 mb-6">
            <h3 className="text-[14px] tracking-wider uppercase text-black/40 dark:text-white/40 mb-8">
              Financial Projections
            </h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={strategy.projections}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="year" 
                    stroke="rgba(255,255,255,0.3)"
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.3)"
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                    label={{ value: '₹ Crores', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.5)' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: 'rgba(255,255,255,0.95)',
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Revenue"
                    dot={{ fill: '#10b981', r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="cost" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    name="Cost"
                    dot={{ fill: '#ef4444', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sensitivity Analysis */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-white dark:bg-[#111111] border border-black/5 dark:border-white/5 rounded-lg p-10">
              <h3 className="text-[14px] tracking-wider uppercase text-black/40 dark:text-white/40 mb-8">
                Sensitivity Analysis
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sensitivityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis 
                      dataKey="scenario" 
                      stroke="rgba(255,255,255,0.3)"
                      tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.3)"
                      tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                      label={{ value: 'ROI %', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.5)' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a1a1a',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: 'rgba(255,255,255,0.95)',
                      }}
                    />
                    <Bar dataKey="roi" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Key Assumptions */}
            <div className="bg-white dark:bg-[#111111] border border-black/5 dark:border-white/5 rounded-lg p-10">
              <h3 className="text-[14px] tracking-wider uppercase text-black/40 dark:text-white/40 mb-8">
                Key Assumptions
              </h3>
              <div className="space-y-3">
                {assumptions.map((assumption, index) => (
                  <div key={index} className="flex items-start gap-3 py-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                    <p className="text-[13px] text-black/70 dark:text-white/70 leading-relaxed">{assumption}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Risk Breakdown */}
          <div className="bg-white dark:bg-[#111111] border border-black/5 dark:border-white/5 rounded-lg p-10 mb-6">
            <h3 className="text-[14px] tracking-wider uppercase text-black/40 dark:text-white/40 mb-8 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Risk Analysis & Mitigation
            </h3>
            <div className="space-y-6">
              {risks.map((risk, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-[14px] text-black/95 dark:text-white/95 mb-1">{risk.category}</div>
                      <div className="text-[12px] text-black/50 dark:text-white/50">{risk.mitigation}</div>
                    </div>
                    <div className="text-[14px] text-black/70 dark:text-white/70">{risk.score}%</div>
                  </div>
                  <div className="h-2 rounded-full bg-black/5 dark:bg-white/5 overflow-hidden">
                    <div
                      className={`h-full ${
                        risk.score < 25 ? 'bg-emerald-500' : 
                        risk.score < 40 ? 'bg-yellow-500' : 
                        'bg-red-500'
                      }`}
                      style={{ width: `${risk.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Execution Roadmap */}
          <div className="bg-white dark:bg-[#111111] border border-black/5 dark:border-white/5 rounded-lg p-10 mb-6">
            <h3 className="text-[14px] tracking-wider uppercase text-black/40 dark:text-white/40 mb-8">
              Execution Roadmap
            </h3>
            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-center gap-6 py-3">
                  <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-[12px] text-black/50 dark:text-white/50 flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-[14px] text-black/95 dark:text-white/95 mb-1">{milestone.phase}</div>
                    <div className="text-[12px] text-black/40 dark:text-white/40">{milestone.duration}</div>
                  </div>
                  <div className="h-1 w-32 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full ${milestone.status === 'completed' ? 'bg-emerald-500 w-full' : 'bg-blue-500 w-0'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Rationale */}
          <div className="bg-blue-500/5 border border-blue-500/10 rounded-lg p-10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-md bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <Info className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-[16px] tracking-tight text-black/95 dark:text-white/95 mb-3">
                  Why This Strategy?
                </h3>
                <p className="text-[13px] text-black/60 dark:text-white/60 leading-relaxed mb-4">
                  Our AI analysis identified this strategy as optimal based on several key factors:
                </p>
                <ul className="space-y-2">
                  <li className="text-[13px] text-black/60 dark:text-white/60 leading-relaxed flex items-start gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Strong market demand for Grade-A office space in this micro-market, with 92% occupancy rates</span>
                  </li>
                  <li className="text-[13px] text-black/60 dark:text-white/60 leading-relaxed flex items-start gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Favorable regulatory environment with fast-track approval process for commercial projects</span>
                  </li>
                  <li className="text-[13px] text-black/60 dark:text-white/60 leading-relaxed flex items-start gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Lower execution risk compared to mixed-use, with proven contractor track record</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}