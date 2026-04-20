import { useState } from 'react';
import { SideNav } from '../components/SideNav';
import { ThemeToggle } from '../components/ThemeToggle';
import { Search, TrendingUp, TrendingDown, Home, DollarSign, Activity, MapPin, Calendar, BarChart3, Users, Building } from 'lucide-react';

interface MarketReport {
  pincode: string;
  area: string;
  city: string;
  state: string;
  vybeScore: number;
  appreciationTrend: number;
  rentalYield: number;
  avgPropertyPrice: number;
  pricePerSqft: number;
  quarterlyGrowth: number;
  yearlyGrowth: number;
  demandIndex: number;
  supplyIndex: number;
  liquidityScore: number;
}

export function MarketIntelligence() {
  const [pincode, setPincode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<MarketReport | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.length < 6) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Mock data based on pincode
      const mockReport: MarketReport = {
        pincode: pincode,
        area: 'Koramangala',
        city: 'Bangalore',
        state: 'Karnataka',
        vybeScore: Math.floor(Math.random() * 20) + 75, // 75-95
        appreciationTrend: Math.floor(Math.random() * 10) + 8, // 8-18%
        rentalYield: Math.floor(Math.random() * 3) + 3, // 3-6%
        avgPropertyPrice: Math.floor(Math.random() * 5000000) + 8000000, // 80L-130L
        pricePerSqft: Math.floor(Math.random() * 3000) + 7000, // 7k-10k
        quarterlyGrowth: Math.floor(Math.random() * 4) + 2, // 2-6%
        yearlyGrowth: Math.floor(Math.random() * 12) + 10, // 10-22%
        demandIndex: Math.floor(Math.random() * 20) + 75, // 75-95
        supplyIndex: Math.floor(Math.random() * 20) + 60, // 60-80
        liquidityScore: Math.floor(Math.random() * 15) + 80, // 80-95
      };

      setReport(mockReport);
      setIsLoading(false);
    }, 1500);
  };

  const getVybeScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400';
    if (score >= 70) return 'text-blue-400';
    return 'text-amber-400';
  };

  const getVybeScoreBg = (score: number) => {
    if (score >= 85) return 'bg-emerald-500/10 border-emerald-500/20';
    if (score >= 70) return 'bg-blue-500/10 border-blue-500/20';
    return 'bg-amber-500/10 border-amber-500/20';
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2] dark:bg-[#0a0a0a] transition-colors duration-300">
      <SideNav />

      {/* Header - Full Width */}
      <div className="sticky top-0 z-30 bg-white/70 dark:bg-[#1A1A1A]/70 backdrop-blur-[30px] border-b border-black/5 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[12px] tracking-wider uppercase text-black/40 dark:text-white/50 mb-2">
                Intelligence
              </h1>
              <div className="text-[32px] tracking-tight text-black dark:text-white">
                Market Intelligence
              </div>
              <p className="text-[14px] text-black/50 dark:text-white/60 mt-1">
                Real-time market trends and investment insights
              </p>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Search Section */}
        <div className="bg-white/80 dark:bg-[#1A1A1A] backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] rounded-2xl p-10 mb-8 shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
          <div className="text-center mb-8">
            <h2 className="text-[28px] tracking-tight text-black dark:text-white/95 mb-3 font-light">
              Explore Real Estate Intelligence
            </h2>
            <p className="text-[15px] text-black/60 dark:text-white/60 leading-relaxed max-w-2xl mx-auto">
              Enter any pincode to explore appreciation trends, rental yields, and Vybe Scores to guide your next move
            </p>
          </div>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-black/40 dark:text-white/40" />
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit pincode (e.g., 560034)"
                className="w-full bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] rounded-xl pl-14 pr-36 py-5 text-[16px] text-black dark:text-white/95 placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none focus:border-black/20 dark:focus:border-white/20 focus:ring-4 focus:ring-black/[0.02] dark:focus:ring-white/[0.02] transition-all"
              />
              <button
                type="submit"
                disabled={isLoading || pincode.length < 6}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black dark:bg-white text-white dark:text-black px-7 py-3 rounded-lg hover:bg-black/90 dark:hover:bg-white/90 transition-all text-[14px] font-medium disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2.5 shadow-[0_4px_16px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_16px_rgba(255,255,255,0.1)]"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Get Report
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Report Results */}
        {report && (
          <div className="space-y-8 animate-fadeIn">
            {/* Location Header */}
            <div className="bg-white/80 dark:bg-[#1A1A1A] backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] rounded-2xl p-8 shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <MapPin className="w-5 h-5 text-black/40 dark:text-white/40" />
                    <h3 className="text-[24px] font-light tracking-tight text-black dark:text-white/95">
                      {report.area}, {report.city}
                    </h3>
                  </div>
                  <p className="text-[13px] text-black/50 dark:text-white/50">
                    Pincode: {report.pincode} • {report.state}
                  </p>
                </div>
                <div className={`px-6 py-4 rounded-xl border backdrop-blur-sm ${getVybeScoreBg(report.vybeScore)}`}>
                  <p className="text-[10px] text-black/50 dark:text-white/50 uppercase tracking-[0.12em] mb-2 font-medium">
                    VYBE SCORE
                  </p>
                  <p className={`text-[36px] font-light tracking-tight tabular-nums ${getVybeScoreColor(report.vybeScore)}`}>
                    {report.vybeScore}
                  </p>
                </div>
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Appreciation Trend */}
              <div className="bg-white/80 dark:bg-[#1A1A1A] backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] rounded-2xl p-8 shadow-[0_2px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_8px_40px_rgba(0,0,0,0.5)] transition-all duration-500 hover:-translate-y-0.5">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>
                <p className="text-[11px] text-black/50 dark:text-white/50 uppercase tracking-wider mb-2">
                  APPRECIATION TREND
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-[32px] font-bold tracking-tight text-black dark:text-white/95">
                    {report.appreciationTrend}%
                  </p>
                  <p className="text-[13px] text-emerald-400">YoY</p>
                </div>
                <p className="text-[12px] text-black/50 dark:text-white/50 mt-2">
                  Quarterly: +{report.quarterlyGrowth}%
                </p>
              </div>

              {/* Rental Yield */}
              <div className="bg-white/80 dark:bg-[#1A1A1A] backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] rounded-2xl p-8 shadow-[0_2px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_8px_40px_rgba(0,0,0,0.5)] transition-all duration-500 hover:-translate-y-0.5">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-blue-400" />
                  </div>
                </div>
                <p className="text-[11px] text-black/50 dark:text-white/50 uppercase tracking-wider mb-2">
                  RENTAL YIELD
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-[32px] font-bold tracking-tight text-black dark:text-white/95">
                    {report.rentalYield}%
                  </p>
                  <p className="text-[13px] text-blue-400">Annual</p>
                </div>
                <p className="text-[12px] text-black/50 dark:text-white/50 mt-2">
                  High rental demand area
                </p>
              </div>

              {/* Liquidity Score */}
              <div className="bg-white/80 dark:bg-[#1A1A1A] backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] rounded-2xl p-8 shadow-[0_2px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_8px_40px_rgba(0,0,0,0.5)] transition-all duration-500 hover:-translate-y-0.5">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-amber-400" />
                  </div>
                </div>
                <p className="text-[11px] text-black/50 dark:text-white/50 uppercase tracking-wider mb-2">
                  LIQUIDITY SCORE
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-[32px] font-bold tracking-tight text-black dark:text-white/95">
                    {report.liquidityScore}
                  </p>
                  <p className="text-[13px] text-amber-400">/100</p>
                </div>
                <p className="text-[12px] text-black/50 dark:text-white/50 mt-2">
                  Fast-moving market
                </p>
              </div>
            </div>

            {/* Market Overview */}
            <div className="bg-white/80 dark:bg-[#1A1A1A] backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] rounded-2xl p-8 shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
              <h3 className="text-[16px] font-semibold tracking-tight text-black dark:text-white/95 mb-6">
                Market Overview
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-black/5 dark:border-white/5">
                    <div className="flex items-center gap-3">
                      <Home className="w-4 h-4 text-black/40 dark:text-white/40" />
                      <span className="text-[13px] text-black/60 dark:text-white/60">Avg. Property Price</span>
                    </div>
                    <span className="text-[14px] font-medium text-black dark:text-white/95">
                      ₹{(report.avgPropertyPrice / 100000).toFixed(1)}L
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-black/5 dark:border-white/5">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="w-4 h-4 text-black/40 dark:text-white/40" />
                      <span className="text-[13px] text-black/60 dark:text-white/60">Price per Sq.ft</span>
                    </div>
                    <span className="text-[14px] font-medium text-black dark:text-white/95">
                      ₹{report.pricePerSqft.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-black/40 dark:text-white/40" />
                      <span className="text-[13px] text-black/60 dark:text-white/60">Yearly Growth</span>
                    </div>
                    <span className="text-[14px] font-medium text-emerald-400">
                      +{report.yearlyGrowth}%
                    </span>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-black/5 dark:border-white/5">
                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 text-black/40 dark:text-white/40" />
                      <span className="text-[13px] text-black/60 dark:text-white/60">Demand Index</span>
                    </div>
                    <span className="text-[14px] font-medium text-black dark:text-white/95">
                      {report.demandIndex}/100
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-black/5 dark:border-white/5">
                    <div className="flex items-center gap-3">
                      <Building className="w-4 h-4 text-black/40 dark:text-white/40" />
                      <span className="text-[13px] text-black/60 dark:text-white/60">Supply Index</span>
                    </div>
                    <span className="text-[14px] font-medium text-black dark:text-white/95">
                      {report.supplyIndex}/100
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-4 h-4 text-black/40 dark:text-white/40" />
                      <span className="text-[13px] text-black/60 dark:text-white/60">Market Status</span>
                    </div>
                    <span className="text-[14px] font-medium text-emerald-400">
                      {report.demandIndex > report.supplyIndex ? 'High Demand' : 'Balanced'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Insights */}
            <div className="bg-gradient-to-br from-blue-500/5 to-emerald-500/5 border border-blue-500/10 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Activity className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-[14px] font-semibold text-black dark:text-white/95 mb-2">
                    AI Market Insights
                  </h4>
                  <p className="text-[13px] text-black/70 dark:text-white/70 leading-relaxed">
                    This area shows strong investment potential with consistent year-over-year appreciation of {report.appreciationTrend}%. 
                    The high Vybe Score of {report.vybeScore} indicates excellent infrastructure, connectivity, and future growth prospects. 
                    Rental yields of {report.rentalYield}% make this attractive for both capital appreciation and rental income strategies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}