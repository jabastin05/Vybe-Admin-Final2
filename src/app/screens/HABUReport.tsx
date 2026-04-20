import { ArrowLeft, TrendingUp, ArrowRight, Building2, DollarSign, Zap } from 'lucide-react';
import { Link, useParams } from 'react-router';
import { SideNav } from '../components/SideNav';
import { ThemeToggle } from '../components/ThemeToggle';
import { mockPropertyCases, mockStrategies } from '../data/mock-data';

export function HABUReport() {
  const { id } = useParams();
  const property = mockPropertyCases.find(p => p.id === id);

  if (!property) {
    return <div className="min-h-screen bg-[#F2F2F2] dark:bg-[#0a0a0a] flex items-center justify-center text-black/40 dark:text-white/40">Property not found</div>;
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' };
      case 'medium': return { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20' };
      case 'high': return { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' };
      default: return { bg: 'bg-black/5 dark:bg-white/5', text: 'text-black/40 dark:text-white/40', border: 'border-black/10 dark:border-white/10' };
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2] dark:bg-[#0a0a0a] transition-colors duration-300">
      <SideNav />
      
      {/* Header - Full Width */}
      <div className="border-b border-black/5 dark:border-white/5 bg-white dark:bg-black/40">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            {/* Left: Back Button + Page Title */}
            <div className="flex items-center gap-4">
              <Link 
                to={`/property/${id}`} 
                className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-black/60 dark:text-white/60"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div>
                <h1 className="text-[12px] tracking-wider uppercase text-black/40 dark:text-white/50 mb-2">
                  Intelligence Report
                </h1>
                <div className="text-[32px] tracking-tight text-black dark:text-white">
                  HABU Report
                </div>
                <p className="text-[14px] text-black/50 dark:text-white/60 mt-1">
                  High-value Analysis & Best-use Understanding
                </p>
              </div>
            </div>

            {/* Right: Theme Toggle */}
            <div className="flex items-center gap-3">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <h2 className="text-[24px] tracking-tight text-black dark:text-white/95 mb-2">
            Investment Strategy Comparison
          </h2>
          <p className="text-[14px] text-black/50 dark:text-white/50">
            Three optimized development pathways ranked by risk-adjusted returns
          </p>
        </div>

        {/* Strategy Cards - Side by Side */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {mockStrategies.map((strategy, index) => {
            const riskColors = getRiskColor(strategy.riskLevel);
            const isRecommended = strategy.id === '2'; // Premium Office Tower
            
            return (
              <div
                key={strategy.id}
                className={`relative bg-white dark:bg-[#111111] border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl ${
                  isRecommended 
                    ? 'border-blue-500/30 dark:border-blue-400/30 shadow-lg' 
                    : 'border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10'
                }`}
              >
                {/* Recommended Badge */}
                {isRecommended && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-[11px] font-medium tracking-wider uppercase">Vybe recommended</span>
                    </div>
                  </div>
                )}

                {/* Card Content */}
                <div className={`p-8 ${isRecommended ? 'pt-16' : ''}`}>
                  {/* Strategy Number & Name */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center text-[13px] font-medium text-black/60 dark:text-white/60">
                        {index + 1}
                      </div>
                      <div className={`inline-flex px-2.5 py-1 rounded-md text-[11px] tracking-wide font-medium ${riskColors.bg} ${riskColors.text} border ${riskColors.border} capitalize`}>
                        {strategy.riskLevel} Risk
                      </div>
                    </div>
                    <h3 className="text-[18px] tracking-tight text-black dark:text-white/95 font-medium mb-2">
                      {strategy.name}
                    </h3>
                    <p className="text-[13px] text-black/50 dark:text-white/50 leading-relaxed">
                      {strategy.description}
                    </p>
                  </div>

                  {/* ROI - Prominent Display */}
                  <div className="mb-6 pb-6 border-b border-black/5 dark:border-white/5">
                    <div className="text-[11px] text-black/40 dark:text-white/40 tracking-wider uppercase mb-2">
                      Expected ROI
                    </div>
                    <div className="flex items-baseline gap-2">
                      <div className="text-[42px] tracking-tight font-light text-emerald-500 dark:text-emerald-400">
                        {strategy.roi}
                      </div>
                      <div className="text-[24px] tracking-tight text-emerald-500/60 dark:text-emerald-400/60">
                        %
                      </div>
                    </div>
                    {/* ROI Progress Bar */}
                    <div className="mt-3 h-1.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                        style={{ width: `${Math.min(strategy.roi / 2, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="space-y-4 mb-6">
                    {/* Capital Required */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-black/40 dark:text-white/40" />
                        <span className="text-[12px] text-black/60 dark:text-white/60">Capital Required</span>
                      </div>
                      <span className="text-[13px] font-medium text-black dark:text-white/95">
                        {strategy.capitalRequired}
                      </span>
                    </div>

                    {/* Timeline */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-black/40 dark:text-white/40" />
                        <span className="text-[12px] text-black/60 dark:text-white/60">Timeline</span>
                      </div>
                      <span className="text-[13px] font-medium text-black dark:text-white/95">
                        {strategy.timeline}
                      </span>
                    </div>

                    {/* Effort Level */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-black/40 dark:text-white/40" />
                        <span className="text-[12px] text-black/60 dark:text-white/60">Management Effort</span>
                      </div>
                      <span className="text-[13px] font-medium text-black dark:text-white/95">
                        {strategy.effort}
                      </span>
                    </div>
                  </div>

                  {/* CTA */}
                  <Link
                    to={`/property/${id}/strategy/${strategy.id}/assignment`}
                    className={`w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-[13px] tracking-wide transition-all ${
                      isRecommended
                        ? 'bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 font-medium'
                        : 'bg-black/5 dark:bg-white/5 text-black dark:text-white/95 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10'
                    }`}
                  >
                    Proceed with Strategy
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Comparison Matrix */}
        <div className="bg-white dark:bg-[#111111] border border-black/5 dark:border-white/5 rounded-xl overflow-hidden">
          <div className="px-8 py-5 border-b border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01]">
            <h3 className="text-[15px] tracking-tight text-black dark:text-white/95 font-medium">
              Side-by-Side Comparison
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-black/5 dark:border-white/5">
                  <th className="text-left px-8 py-4 text-[12px] text-black/40 dark:text-white/40 tracking-wider uppercase font-medium">
                    Metric
                  </th>
                  {mockStrategies.map((strategy) => (
                    <th key={strategy.id} className="text-center px-6 py-4 text-[12px] text-black/60 dark:text-white/60 font-medium">
                      {strategy.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* ROI Row */}
                <tr className="border-b border-black/5 dark:border-white/5 hover:bg-black/[0.01] dark:hover:bg-white/[0.01]">
                  <td className="px-8 py-5 text-[13px] text-black/60 dark:text-white/60">
                    Expected ROI
                  </td>
                  {mockStrategies.map((strategy) => (
                    <td key={strategy.id} className="text-center px-6 py-5">
                      <span className="text-[18px] font-medium text-emerald-500 dark:text-emerald-400">
                        {strategy.roi}%
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Risk Row */}
                <tr className="border-b border-black/5 dark:border-white/5 hover:bg-black/[0.01] dark:hover:bg-white/[0.01]">
                  <td className="px-8 py-5 text-[13px] text-black/60 dark:text-white/60">
                    Risk Level
                  </td>
                  {mockStrategies.map((strategy) => {
                    const riskColors = getRiskColor(strategy.riskLevel);
                    return (
                      <td key={strategy.id} className="text-center px-6 py-5">
                        <span className={`inline-flex px-3 py-1.5 rounded-md text-[11px] tracking-wide font-medium ${riskColors.bg} ${riskColors.text} border ${riskColors.border} capitalize`}>
                          {strategy.riskLevel}
                        </span>
                      </td>
                    );
                  })}
                </tr>

                {/* Capital Row */}
                <tr className="border-b border-black/5 dark:border-white/5 hover:bg-black/[0.01] dark:hover:bg-white/[0.01]">
                  <td className="px-8 py-5 text-[13px] text-black/60 dark:text-white/60">
                    Capital Required
                  </td>
                  {mockStrategies.map((strategy) => (
                    <td key={strategy.id} className="text-center px-6 py-5 text-[13px] text-black dark:text-white/95">
                      {strategy.capitalRequired}
                    </td>
                  ))}
                </tr>

                {/* Timeline Row */}
                <tr className="border-b border-black/5 dark:border-white/5 hover:bg-black/[0.01] dark:hover:bg-white/[0.01]">
                  <td className="px-8 py-5 text-[13px] text-black/60 dark:text-white/60">
                    Development Timeline
                  </td>
                  {mockStrategies.map((strategy) => (
                    <td key={strategy.id} className="text-center px-6 py-5 text-[13px] text-black dark:text-white/95">
                      {strategy.timeline}
                    </td>
                  ))}
                </tr>

                {/* Effort Row */}
                <tr className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01]">
                  <td className="px-8 py-5 text-[13px] text-black/60 dark:text-white/60">
                    Management Effort
                  </td>
                  {mockStrategies.map((strategy) => (
                    <td key={strategy.id} className="text-center px-6 py-5 text-[13px] text-black dark:text-white/95">
                      {strategy.effort}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}