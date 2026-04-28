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
    <div className="min-h-screen bg-background dark:bg-neutral-900 transition-colors duration-300">
      <SideNav />
      
      {/* Header */}
      <div className="border-b border-black/5 dark:border-white/10 bg-card dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-caption font-medium tracking-[0.05em] uppercase text-muted-foreground dark:text-neutral-0/50 mb-2">
                Portfolio
              </div>
              <div className="text-h1 tracking-tight text-foreground dark:text-neutral-0">
                My Properties
              </div>
              <p className="text-small text-muted-foreground dark:text-neutral-300/80 mt-1">
                Manage all your properties in one place
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/upload"
                className="inline-flex items-center gap-2 bg-[#F59E0B] hover:bg-[#F59E0B] text-foreground px-6 py-3 rounded-[var(--radius-card)] transition-all text-small font-medium shadow-[0_8px_24px_rgba(255,199,0,0.25)] hover:shadow-[0_8px_32px_rgba(255,199,0,0.4)] hover:-translate-y-0.5"
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
          <div className="bg-card/90 dark:bg-neutral-900/90 backdrop-blur-xl rounded-[var(--radius-card)] border border-black/5 dark:border-white/10 p-16 text-center shadow-lg">
            <div className="w-20 h-20 rounded-full bg-neutral-900/5 dark:bg-card/5 flex items-center justify-center mx-auto mb-6">
              <Building2 className="w-10 h-10 text-foreground/30 dark:text-neutral-0/30" />
            </div>
            <h2 className="text-h2 tracking-tight text-foreground dark:text-neutral-0/95 mb-3">
              No Properties Yet
            </h2>
            <p className="text-small text-neutral-700/80 dark:text-neutral-300/80 max-w-md mx-auto leading-relaxed mb-8">
              Start building your property portfolio by adding your first property. Get comprehensive HABU analysis and unlock premium features.
            </p>
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 bg-[#F59E0B] hover:bg-[#F59E0B] text-foreground px-8 py-4 rounded-[var(--radius-card)] transition-all text-small font-medium shadow-[0_8px_24px_rgba(255,199,0,0.25)] hover:shadow-[0_8px_32px_rgba(255,199,0,0.4)] hover:-translate-y-0.5"
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
              <div className="bg-card/90 dark:bg-neutral-900/90 backdrop-blur-[40px] rounded-[var(--radius-card)] border border-white/60 dark:border-white/10 p-6 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_20px_40px_-5px_rgba(0,0,0,0.05)] relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent" />
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-[var(--radius-card)] bg-[#F59E0B]/10 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-[#B45309]" strokeWidth={2} />
                  </div>
                </div>
                <div className="text-caption font-medium tracking-[0.05em] uppercase text-muted-foreground dark:text-neutral-0/50 mb-2">
                  Total Properties
                </div>
                <div className="text-h1 font-medium tracking-[-0.02em] text-foreground dark:text-neutral-0">
                  {properties.length}
                </div>
              </div>
              
              <div className="bg-card/90 dark:bg-neutral-900/90 backdrop-blur-[40px] rounded-[var(--radius-card)] border border-white/60 dark:border-white/10 p-6 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_20px_40px_-5px_rgba(0,0,0,0.05)] relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent" />
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-[var(--radius-card)] bg-primary-700/10 flex items-center justify-center">
                    <Layers className="w-6 h-6 text-primary-700 dark:text-primary-400" strokeWidth={2} />
                  </div>
                </div>
                <div className="text-caption font-medium tracking-[0.05em] uppercase text-muted-foreground dark:text-neutral-0/50 mb-2">
                  Property Types
                </div>
                <div className="text-h1 font-medium tracking-[-0.02em] text-foreground dark:text-neutral-0">
                  {new Set(properties.map(p => p.type)).size}
                </div>
              </div>
              
              <div className="bg-card/90 dark:bg-neutral-900/90 backdrop-blur-[40px] rounded-[var(--radius-card)] border border-white/60 dark:border-white/10 p-6 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_20px_40px_-5px_rgba(0,0,0,0.05)] relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent" />
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-[var(--radius-card)] bg-blue-500/10 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-blue-500 dark:text-blue-400" strokeWidth={2} />
                  </div>
                </div>
                <div className="text-caption font-medium tracking-[0.05em] uppercase text-muted-foreground dark:text-neutral-0/50 mb-2">
                  Locations
                </div>
                <div className="text-h1 font-medium tracking-[-0.02em] text-foreground dark:text-neutral-0">
                  {new Set(properties.map(p => p.city || p.district || p.state).filter(Boolean)).size}
                </div>
              </div>
            </div>

            {/* Properties List */}
            <div className="grid grid-cols-1 gap-6">
              {properties.map((property) => (
                <div
                  key={property.id}
                  className="bg-card/95 dark:bg-neutral-900/95 backdrop-blur-[40px] rounded-[var(--radius-card)] border border-white/40 dark:border-white/10 p-8 
                             shadow-[0_2px_4px_rgba(0,0,0,0.02),0_20px_40px_-5px_rgba(0,0,0,0.05)] 
                             hover:shadow-[0_2px_4px_rgba(0,0,0,0.03),0_24px_48px_-5px_rgba(0,0,0,0.1),0_40px_80px_-10px_rgba(0,0,0,0.08)] 
                             transition-all duration-500 group relative overflow-hidden
                             hover:border-primary-700/20 dark:hover:border-primary-700/30
                             hover:-translate-y-1"
                >
                  {/* Top highlight with gradient */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary-700/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent" />
                  
                  {/* Subtle gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-700/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[var(--radius-card)]" />
                  
                  <div className="flex items-start gap-6 relative z-10">
                    {/* Enhanced Icon */}
                    <div className="relative flex-shrink-0">
                      {/* Glow effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-700 to-green-600 rounded-[var(--radius-card)] blur-xl opacity-0 group-hover:opacity-30 transition-all duration-500 scale-90 group-hover:scale-110" />
                      
                      <div className="relative w-16 h-16 rounded-[var(--radius-card)] bg-gradient-to-br from-primary-700 to-green-600 flex items-center justify-center 
                                    shadow-[0_8px_24px_rgba(28,117,188,0.25)] 
                                    group-hover:shadow-[0_12px_32px_rgba(28,117,188,0.35)] 
                                    group-hover:scale-105 transition-all duration-500">
                        {/* Inner highlight */}
                        <div className="absolute inset-[1px] rounded-[15px] bg-gradient-to-b from-white/20 to-transparent" />
                        <Building2 className="w-8 h-8 text-neutral-0 relative z-10" strokeWidth={2} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1 min-w-0 pr-4">
                          {/* Property ID */}
                          <div className="text-caption font-medium tracking-[0.05em] uppercase text-muted-foreground dark:text-neutral-300/60 mb-2">
                            Property ID: {property.id}
                          </div>
                          
                          {/* Property Name */}
                          <h3 className="text-h2 font-medium tracking-tight text-foreground dark:text-neutral-0/95 mb-4 group-hover:text-primary-700 dark:group-hover:text-primary-600 transition-colors duration-300">
                            {property.name}
                          </h3>
                          
                          {/* Property Info Grid */}
                          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                            {/* Building Type */}
                            <div>
                              <div className="text-caption font-medium tracking-[0.05em] uppercase text-muted-foreground dark:text-neutral-300/60 mb-1.5">
                                Building Type
                              </div>
                              <div className="text-small font-medium text-foreground dark:text-neutral-0/90 capitalize">
                                {property.buildingType || 'N/A'}
                              </div>
                            </div>
                            
                            {/* Property Type */}
                            <div>
                              <div className="text-caption font-medium tracking-[0.05em] uppercase text-muted-foreground dark:text-neutral-300/60 mb-1.5">
                                Property Type
                              </div>
                              <div className="text-small font-medium text-foreground dark:text-neutral-0/90">
                                {property.type}
                              </div>
                            </div>
                            
                            {/* Location */}
                            <div>
                              <div className="text-caption font-medium tracking-[0.05em] uppercase text-muted-foreground dark:text-neutral-300/60 mb-1.5">
                                Location
                              </div>
                              <div className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-primary-700" />
                                <span className="text-small font-medium text-foreground dark:text-neutral-0/90">
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
                              <div className="text-caption font-medium tracking-[0.05em] uppercase text-muted-foreground dark:text-neutral-300/60 mb-1.5">
                                Added On
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                                <span className="text-small font-medium text-foreground dark:text-neutral-0/90">
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
                            className="inline-flex items-center gap-2 bg-neutral-900 dark:bg-card text-neutral-0 dark:text-foreground px-6 py-3 rounded-[var(--radius-card)] 
                                     hover:bg-neutral-900/90 dark:hover:bg-card/90 
                                     transition-all duration-300 text-small font-medium 
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
                          <div className="inline-flex items-center gap-2 bg-gradient-to-br from-primary-700/15 to-primary-700/5 
                                        text-primary-700 dark:text-primary-400 px-4 py-2 rounded-[10px] text-caption font-medium
                                        border border-primary-700/20 shadow-[0_2px_8px_rgba(28,117,188,0.1)]">
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