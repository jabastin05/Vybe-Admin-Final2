import { motion } from 'motion/react';
import { Link } from 'react-router';
import {
  MapPin,
  Flame,
  TrendingUp,
  Brain,
  Building2,
  ArrowRight
} from 'lucide-react';

interface LocationData {
  area: string;
  district: string;
  state: string;
  avgPrice: number;
  priceChange: string;
  priceChangeValue: number;
  vybeScore: number;
  rentalYield: string;
  demandIndex: string;
  supplyIndex: string;
  infrastructureScore: number;
  liquidityScore: number;
  keyHighlights: string[];
  nearbyAmenities: Array<{
    name: string;
    count: number;
    distance: string;
  }>;
  priceHistory: Array<{
    period: string;
    price: number;
  }>;
  futureProjects: string[];
}

interface MarketIntelligenceResultsProps {
  locationData: LocationData;
  pincode: string;
}

export function MarketIntelligenceResults({ locationData, pincode }: MarketIntelligenceResultsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-16"
    >
      {/* Location Header */}
      <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 dark:from-emerald-500/20 dark:to-blue-500/20 border border-emerald-500/30 dark:border-emerald-500/40 rounded-3xl p-8 mb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="w-6 h-6 text-emerald-500" />
              <h3 className="text-[32px] font-semibold text-black dark:text-white">
                {locationData.area}
              </h3>
            </div>
            <p className="text-[14px] text-black/60 dark:text-white/60">
              {locationData.district}, {locationData.state} • Pincode: {pincode}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 rounded-xl px-4 py-2">
            <Flame className="w-5 h-5 text-emerald-500" />
            <div>
              <div className="text-[10px] font-bold tracking-[0.05em] uppercase text-emerald-500/80">VYBE Score</div>
              <div className="text-[18px] font-bold text-emerald-500">{locationData.vybeScore}</div>
            </div>
          </div>
        </div>

        {/* Primary Metrics */}
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white/50 dark:bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-black/5 dark:border-white/10">
            <div className="text-[11px] font-bold tracking-[0.05em] uppercase text-black/40 dark:text-white/40 mb-2">
              Avg Market Rate
            </div>
            <div className="text-[32px] font-semibold tracking-tight text-black dark:text-white mb-1">
              ₹{locationData.avgPrice.toLocaleString()}
            </div>
            <div className="text-[13px] text-black/60 dark:text-white/60">per sq ft</div>
          </div>

          <div className="bg-white/50 dark:bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-black/5 dark:border-white/10">
            <div className="text-[11px] font-bold tracking-[0.05em] uppercase text-black/40 dark:text-white/40 mb-2">
              YoY Appreciation
            </div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              <div className="text-[32px] font-semibold tracking-tight text-emerald-500">
                {locationData.priceChange}
              </div>
            </div>
            <div className="text-[13px] text-black/60 dark:text-white/60">
              +₹{locationData.priceChangeValue}/sq ft
            </div>
          </div>

          <div className="bg-white/50 dark:bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-black/5 dark:border-white/10">
            <div className="text-[11px] font-bold tracking-[0.05em] uppercase text-black/40 dark:text-white/40 mb-2">
              Rental Yield
            </div>
            <div className="text-[32px] font-semibold tracking-tight text-black dark:text-white mb-1">
              {locationData.rentalYield}
            </div>
            <div className="text-[13px] text-black/60 dark:text-white/60">annual return</div>
          </div>

          <div className="bg-white/50 dark:bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-black/5 dark:border-white/10">
            <div className="text-[11px] font-bold tracking-[0.05em] uppercase text-black/40 dark:text-white/40 mb-2">
              Demand Index
            </div>
            <div className="text-[24px] font-semibold tracking-tight text-black dark:text-white mb-1">
              {locationData.demandIndex}
            </div>
            <div className="text-[13px] text-black/60 dark:text-white/60">
              Supply: {locationData.supplyIndex}
            </div>
          </div>
        </div>
      </div>

      {/* Price History & Scores Grid */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Price Trend History */}
        <div className="bg-[#F2F2F2] dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-3xl p-8">
          <h4 className="text-[18px] font-semibold text-black dark:text-white mb-6">
            12-Month Price Movement
          </h4>
          <div className="relative h-48">
            <div className="absolute inset-0 flex items-end justify-between gap-3">
              {locationData.priceHistory.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ height: 0 }}
                  animate={{ height: `${(item.price / locationData.avgPrice) * 100}%` }}
                  transition={{ delay: 0.8 + idx * 0.1, duration: 0.5 }}
                  className="flex-1 bg-gradient-to-t from-emerald-500 to-blue-500 rounded-t-lg relative group"
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black dark:bg-white text-white dark:text-black px-2 py-1 rounded text-[11px] font-medium whitespace-nowrap">
                    ₹{item.price.toLocaleString()}
                  </div>
                  <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[10px] text-black/60 dark:text-white/60 whitespace-nowrap">
                    {item.period}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Market Scores */}
        <div className="bg-[#F2F2F2] dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-3xl p-8">
          <h4 className="text-[18px] font-semibold text-black dark:text-white mb-6">
            Market Health Indicators
          </h4>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] text-black/60 dark:text-white/60">Infrastructure Score</span>
                <span className="text-[14px] font-semibold text-black dark:text-white">{locationData.infrastructureScore}/10</span>
              </div>
              <div className="h-2 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${locationData.infrastructureScore * 10}%` }}
                  transition={{ delay: 1, duration: 0.6 }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-blue-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] text-black/60 dark:text-white/60">Liquidity Score</span>
                <span className="text-[14px] font-semibold text-black dark:text-white">{locationData.liquidityScore}/10</span>
              </div>
              <div className="h-2 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${locationData.liquidityScore * 10}%` }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] text-black/60 dark:text-white/60">VYBE Score</span>
                <span className="text-[14px] font-semibold text-emerald-500">{locationData.vybeScore}/10</span>
              </div>
              <div className="h-2 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${locationData.vybeScore * 10}%` }}
                  transition={{ delay: 1.4, duration: 0.6 }}
                  className="h-full bg-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Highlights & Amenities */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Key Highlights */}
        <div className="bg-[#F2F2F2] dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-3xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <Brain className="w-5 h-5 text-emerald-500" />
            <h4 className="text-[18px] font-semibold text-black dark:text-white">
              Key Market Highlights
            </h4>
          </div>
          <ul className="space-y-3">
            {locationData.keyHighlights.map((highlight, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5 + idx * 0.1 }}
                className="flex items-start gap-3 text-[14px] text-black/80 dark:text-white/80"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                <span>{highlight}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Nearby Amenities */}
        <div className="bg-[#F2F2F2] dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-3xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <Building2 className="w-5 h-5 text-blue-500" />
            <h4 className="text-[18px] font-semibold text-black dark:text-white">
              Proximity Intelligence
            </h4>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {locationData.nearbyAmenities.map((amenity, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.6 + idx * 0.1 }}
                className="bg-white/50 dark:bg-black/20 rounded-xl p-4 border border-black/5 dark:border-white/10"
              >
                <div className="text-[24px] font-semibold text-black dark:text-white mb-1">
                  {amenity.count}
                </div>
                <div className="text-[12px] text-black/60 dark:text-white/60 mb-1">
                  {amenity.name}
                </div>
                <div className="text-[11px] text-black/40 dark:text-white/40">
                  {amenity.distance}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Future Projects */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 border border-blue-500/30 dark:border-blue-500/40 rounded-3xl p-8 mb-8">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          <h4 className="text-[18px] font-semibold text-black dark:text-white">
            Upcoming Infrastructure Projects
          </h4>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {locationData.futureProjects.map((project, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 + idx * 0.1 }}
              className="bg-white/50 dark:bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-blue-500/20"
            >
              <div className="text-[14px] font-medium text-black dark:text-white">
                {project}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2 }}
        className="text-center"
      >
        <Link to="/signin">
          <button className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl hover:bg-black/90 dark:hover:bg-white/90 transition-all text-[15px] font-medium inline-flex items-center gap-2">
            Get Full HABU Analysis Report
            <ArrowRight className="w-5 h-5" />
          </button>
        </Link>
        <p className="text-[13px] text-black/50 dark:text-white/50 mt-3">
          Unlock detailed monetization strategies and partner recommendations
        </p>
      </motion.div>
    </motion.div>
  );
}
