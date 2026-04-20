import { Link } from 'react-router';
import { Building2, MapPin, Calendar, Eye, FileText, Plus, TrendingUp, Layers, ExternalLink } from 'lucide-react';
import { SideNav } from '../components/SideNav';
import { ThemeToggle } from '../components/ThemeToggle';
import { NotificationDropdown } from '../components/NotificationDropdown';
import { useProperties } from '../contexts/PropertiesContext';

export function MyProperties() {
  const { properties } = useProperties();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2] dark:bg-[#0F0F0F] transition-colors duration-300">
      <SideNav />
      
      {/* Header */}
      <div className="border-b border-black/5 dark:border-white/10 bg-white dark:bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold tracking-[0.05em] uppercase text-black/40 dark:text-white/50 mb-2">
                Portfolio
              </div>
              <div className="text-[32px] tracking-tight text-black dark:text-white">
                My Properties
              </div>
              <p className="text-[14px] text-black/50 dark:text-white/60 mt-1">
                Manage all your properties in one place
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/upload"
                className="inline-flex items-center gap-2 bg-[#FFC700] hover:bg-[#F2BD00] text-black px-6 py-3 rounded-xl transition-all text-[14px] font-bold shadow-[0_8px_24px_rgba(255,199,0,0.25)] hover:shadow-[0_8px_32px_rgba(255,199,0,0.4)] hover:-translate-y-0.5"
              >
                <Plus className="w-4 h-4" />
                Add Property
              </Link>
              <NotificationDropdown />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        {properties.length === 0 ? (
          /* Empty State */
          <div className="bg-white/90 dark:bg-[#1A1A1A]/90 backdrop-blur-xl rounded-[24px] border border-black/5 dark:border-white/10 p-16 text-center shadow-lg">
            <div className="w-20 h-20 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center mx-auto mb-6">
              <Building2 className="w-10 h-10 text-black/30 dark:text-white/30" />
            </div>
            <h2 className="text-[24px] tracking-tight text-black dark:text-white/95 mb-3">
              No Properties Yet
            </h2>
            <p className="text-[14px] text-black/60 dark:text-white/60 max-w-md mx-auto leading-relaxed mb-8">
              Start building your property portfolio by adding your first property. Get comprehensive HABU analysis and unlock premium features.
            </p>
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 bg-[#FFC700] hover:bg-[#F2BD00] text-black px-8 py-4 rounded-[14px] transition-all text-[14px] font-bold shadow-[0_8px_24px_rgba(255,199,0,0.25)] hover:shadow-[0_8px_32px_rgba(255,199,0,0.4)] hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              Add Your First Property
            </Link>
          </div>
        ) : (
          /* Properties Grid */
          <div className="space-y-8">
            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white/90 dark:bg-[#1A1A1A]/90 backdrop-blur-[40px] rounded-[24px] border border-white/60 dark:border-white/10 p-6 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_20px_40px_-5px_rgba(0,0,0,0.05)] relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent" />
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-[12px] bg-[#FFC700]/10 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-[#FFC700]" strokeWidth={2} />
                  </div>
                </div>
                <div className="text-[10px] font-bold tracking-[0.05em] uppercase text-black/40 dark:text-white/50 mb-2">
                  Total Properties
                </div>
                <div className="text-[32px] font-bold tracking-[-0.02em] text-black dark:text-white">
                  {properties.length}
                </div>
              </div>
              
              <div className="bg-white/90 dark:bg-[#1A1A1A]/90 backdrop-blur-[40px] rounded-[24px] border border-white/60 dark:border-white/10 p-6 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_20px_40px_-5px_rgba(0,0,0,0.05)] relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent" />
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-[12px] bg-emerald-500/10 flex items-center justify-center">
                    <Layers className="w-6 h-6 text-emerald-500 dark:text-emerald-400" strokeWidth={2} />
                  </div>
                </div>
                <div className="text-[10px] font-bold tracking-[0.05em] uppercase text-black/40 dark:text-white/50 mb-2">
                  Property Types
                </div>
                <div className="text-[32px] font-bold tracking-[-0.02em] text-black dark:text-white">
                  {new Set(properties.map(p => p.type)).size}
                </div>
              </div>
              
              <div className="bg-white/90 dark:bg-[#1A1A1A]/90 backdrop-blur-[40px] rounded-[24px] border border-white/60 dark:border-white/10 p-6 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_20px_40px_-5px_rgba(0,0,0,0.05)] relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent" />
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-[12px] bg-blue-500/10 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-blue-500 dark:text-blue-400" strokeWidth={2} />
                  </div>
                </div>
                <div className="text-[10px] font-bold tracking-[0.05em] uppercase text-black/40 dark:text-white/50 mb-2">
                  Locations
                </div>
                <div className="text-[32px] font-bold tracking-[-0.02em] text-black dark:text-white">
                  {new Set(properties.map(p => p.city || p.district || p.state).filter(Boolean)).size}
                </div>
              </div>
            </div>

            {/* Properties List */}
            <div className="grid grid-cols-1 gap-6">
              {properties.map((property) => (
                <div
                  key={property.id}
                  className="bg-white/95 dark:bg-[#1A1A1A]/95 backdrop-blur-[40px] rounded-[24px] border border-white/40 dark:border-white/10 p-8 
                             shadow-[0_2px_4px_rgba(0,0,0,0.02),0_20px_40px_-5px_rgba(0,0,0,0.05)] 
                             hover:shadow-[0_2px_4px_rgba(0,0,0,0.03),0_24px_48px_-5px_rgba(0,0,0,0.1),0_40px_80px_-10px_rgba(0,0,0,0.08)] 
                             transition-all duration-500 group relative overflow-hidden
                             hover:border-emerald-500/20 dark:hover:border-emerald-500/30
                             hover:-translate-y-1"
                >
                  {/* Top highlight with gradient */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent" />
                  
                  {/* Subtle gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[24px]" />
                  
                  <div className="flex items-start gap-6 relative z-10">
                    {/* Enhanced Icon */}
                    <div className="relative flex-shrink-0">
                      {/* Glow effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-green-600 rounded-[16px] blur-xl opacity-0 group-hover:opacity-30 transition-all duration-500 scale-90 group-hover:scale-110" />
                      
                      <div className="relative w-16 h-16 rounded-[16px] bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center 
                                    shadow-[0_8px_24px_rgba(16,185,129,0.25)] 
                                    group-hover:shadow-[0_12px_32px_rgba(16,185,129,0.35)] 
                                    group-hover:scale-105 transition-all duration-500">
                        {/* Inner highlight */}
                        <div className="absolute inset-[1px] rounded-[15px] bg-gradient-to-b from-white/20 to-transparent" />
                        <Building2 className="w-8 h-8 text-white relative z-10" strokeWidth={2} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1 min-w-0 pr-4">
                          {/* Property ID */}
                          <div className="text-[10px] font-bold tracking-[0.05em] uppercase text-black/40 dark:text-white/40 mb-2">
                            Property ID: {property.id}
                          </div>
                          
                          {/* Property Name */}
                          <h3 className="text-[24px] font-bold tracking-tight text-black dark:text-white/95 mb-4 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                            {property.name}
                          </h3>
                          
                          {/* Property Info Grid */}
                          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                            {/* Building Type */}
                            <div>
                              <div className="text-[10px] font-bold tracking-[0.05em] uppercase text-black/40 dark:text-white/40 mb-1.5">
                                Building Type
                              </div>
                              <div className="text-[14px] font-semibold text-black dark:text-white/90 capitalize">
                                {property.buildingType || 'N/A'}
                              </div>
                            </div>
                            
                            {/* Property Type */}
                            <div>
                              <div className="text-[10px] font-bold tracking-[0.05em] uppercase text-black/40 dark:text-white/40 mb-1.5">
                                Property Type
                              </div>
                              <div className="text-[14px] font-semibold text-black dark:text-white/90">
                                {property.type}
                              </div>
                            </div>
                            
                            {/* Location */}
                            <div>
                              <div className="text-[10px] font-bold tracking-[0.05em] uppercase text-black/40 dark:text-white/40 mb-1.5">
                                Location
                              </div>
                              <div className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                                <span className="text-[14px] font-semibold text-black dark:text-white/90">
                                  {property.city && property.state 
                                    ? `${property.city}, ${property.state}` 
                                    : property.district && property.state
                                    ? `${property.district}, ${property.state}`
                                    : property.state || 'N/A'}
                                </span>
                              </div>
                            </div>
                            
                            {/* Added On */}
                            <div>
                              <div className="text-[10px] font-bold tracking-[0.05em] uppercase text-black/40 dark:text-white/40 mb-1.5">
                                Added On
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                                <span className="text-[14px] font-semibold text-black dark:text-white/90">
                                  {formatDate(property.dateAdded)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* CTA Button */}
                        <div className="flex-shrink-0">
                          <Link
                            to={`/property/${property.id}/detail`}
                            className="inline-flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-[12px] 
                                     hover:bg-black/90 dark:hover:bg-white/90 
                                     transition-all duration-300 text-[13px] font-bold 
                                     shadow-[0_2px_8px_rgba(0,0,0,0.15)] 
                                     hover:shadow-[0_4px_16px_rgba(0,0,0,0.25)]
                                     hover:-translate-y-0.5"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </Link>
                        </div>
                      </div>

                      {/* Documents Count */}
                      {property.documents && property.documents.length > 0 && (
                        <div className="pt-5 border-t border-black/[0.06] dark:border-white/[0.06]">
                          <div className="inline-flex items-center gap-2 bg-gradient-to-br from-emerald-500/15 to-emerald-500/5 
                                        text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-[10px] text-[12px] font-bold
                                        border border-emerald-500/20 shadow-[0_2px_8px_rgba(16,185,129,0.1)]">
                            <FileText className="w-4 h-4" />
                            {property.documents.length} {property.documents.length === 1 ? 'Document' : 'Documents'} Uploaded
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}