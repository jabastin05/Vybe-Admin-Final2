import { useParams, Link } from 'react-router';
import { ArrowLeft, MapPin, Calendar, FileText, CheckCircle2, AlertCircle, Download, Eye, Building2, Edit2, ExternalLink, Navigation, School, Bus, Building, Banknote, Church, ShoppingBag, TrendingUp, Award, Users, Lightbulb, Target, Info, IndianRupee, Clock, XCircle, AlertTriangle, Zap, Upload, X, Plus, ChevronDown } from 'lucide-react';
import { SideNav } from '../components/SideNav';
import { ThemeToggle } from '../components/ThemeToggle';
import { NotificationDropdown } from '../components/NotificationDropdown';
import { useProperties } from '../contexts/PropertiesContext';
import { getLocalityInsights } from '../data/localityData';
import { useState } from 'react';

export function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const { getProperty } = useProperties();
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedLandmarkCategory, setSelectedLandmarkCategory] = useState<'schools' | 'busStops' | 'hospitals' | 'banks' | 'temples' | 'shopping'>('schools');
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedLandmark, setSelectedLandmark] = useState<any>(null);
  const [activeDocCategory, setActiveDocCategory] = useState(0);
  const [expandedDocCategory, setExpandedDocCategory] = useState<string | null>('ownership');
  
  const property = getProperty(id || '');

  if (!property) {
    return (
      <div className="min-h-screen bg-background dark:bg-neutral-900 transition-colors duration-300">
        <SideNav />
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="bg-card/90 dark:bg-neutral-900/90 backdrop-blur-xl rounded-[var(--radius-card)] border border-black/5 dark:border-white/10 p-16 text-center shadow-lg">
            <div className="w-20 h-20 rounded-full bg-neutral-900/5 dark:bg-card/5 flex items-center justify-center mx-auto mb-6">
              <Building2 className="w-10 h-10 text-foreground/30 dark:text-neutral-0/30" />
            </div>
            <h2 className="text-h2 tracking-tight text-foreground dark:text-neutral-0/95 mb-3">
              Property Not Found
            </h2>
            <p className="text-small text-neutral-700/80 dark:text-neutral-300/80 max-w-md mx-auto mb-8">
              The property you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 bg-neutral-900 dark:bg-card text-neutral-0 dark:text-foreground px-6 py-3 rounded-[var(--radius-card)] transition-all text-small font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Case Management
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Create dummy documents if property doesn't have any (don't mutate the original property)
  const dummyDocuments = [
    // Ownership Documents
    { id: 'doc-1', name: 'Sale_Deed_2022.pdf', size: '2.4 MB', status: 'verified' as const, type: 'pdf', documentType: 'Sale Deed' },
    { id: 'doc-2', name: 'Khata_Certificate.pdf', size: '1.2 MB', status: 'verified' as const, type: 'pdf', documentType: 'Khata Certificate' },
    { id: 'doc-3', name: 'Khata_Extract.pdf', size: '856 KB', status: 'verified' as const, type: 'pdf', documentType: 'Khata Extract' },
    // Legal & Compliance
    { id: 'doc-4', name: 'Occupancy_Certificate.pdf', size: '1.8 MB', status: 'verified' as const, type: 'pdf', documentType: 'Occupancy Certificate' },
    { id: 'doc-5', name: 'Building_Plan_Approved.pdf', size: '3.2 MB', status: 'verified' as const, type: 'pdf', documentType: 'Building Plan' },
    { id: 'doc-6', name: 'Society_NOC.pdf', size: '624 KB', status: 'processing' as const, type: 'pdf', documentType: 'Society NOC' },
    { id: 'doc-7', name: 'Encumbrance_Certificate.pdf', size: '1.5 MB', status: 'verified' as const, type: 'pdf', documentType: 'Encumbrance Certificate' },
    // Land Records
    { id: 'doc-8', name: 'Survey_Sketch_2023.pdf', size: '2.8 MB', status: 'verified' as const, type: 'pdf', documentType: 'Survey Sketch' },
    { id: 'doc-9', name: 'Mutation_Certificate.pdf', size: '945 KB', status: 'verified' as const, type: 'pdf', documentType: 'Mutation Certificate' },
    { id: 'doc-10', name: 'Land_Conversion_Certificate.pdf', size: '1.1 MB', status: 'processing' as const, type: 'pdf', documentType: 'Land Conversion Certificate' },
    // Financial
    { id: 'doc-11', name: 'Property_Tax_Receipt_2025.pdf', size: '456 KB', status: 'verified' as const, type: 'pdf', documentType: 'Property Tax Receipt' },
    { id: 'doc-12', name: 'Maintenance_Bill_Q1_2026.pdf', size: '328 KB', status: 'verified' as const, type: 'pdf', documentType: 'Maintenance Bill' },
    // Utilities
    { id: 'doc-13', name: 'Electricity_Bill_Feb_2026.pdf', size: '245 KB', status: 'verified' as const, type: 'pdf', documentType: 'Electricity Bill' },
    { id: 'doc-14', name: 'Water_Bill_Feb_2026.pdf', size: '198 KB', status: 'verified' as const, type: 'pdf', documentType: 'Water Bill' },
    // Supporting
    { id: 'doc-15', name: 'Floor_Plan_Detailed.pdf', size: '4.2 MB', status: 'verified' as const, type: 'pdf', documentType: 'Floor Plan' },
    { id: 'doc-16', name: 'Property_Photos_Interior.zip', size: '12.5 MB', status: 'verified' as const, type: 'zip', documentType: 'Property Photos' }
  ];

  // TEMPORARY: Always use dummy documents for testing - this ensures documents are visible
  // Use documents from property if they exist, otherwise use dummy documents
  const propertyDocuments = dummyDocuments;  // Forcing dummy docs to show for debugging
  
  // Debug logging
  console.log('=== DOCUMENT DEBUG ===');
  console.log('Total property documents:', propertyDocuments?.length);
  console.log('Sample document:', propertyDocuments?.[0]);
  console.log('Property from context:', property);
  console.log('Property.documents:', property.documents);

  // Extract location info for dynamic display
  const locationCity = property.city || 'this area';
  const locationState = property.state || property.country || 'India';
  const locationDistrict = property.district || property.city || 'the area';

  // Get locality-specific insights
  const localityData = getLocalityInsights(property.city, property.state);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getStatusColor = (status: 'uploading' | 'verified' | 'processing' | 'error') => {
    switch (status) {
      case 'verified':
        return 'bg-primary-700/10 text-primary-700 dark:text-primary-400';
      case 'processing':
        return 'bg-yellow-500/10 text-yellow-500 dark:text-yellow-400';
      case 'error':
        return 'bg-red-500/10 text-red-500 dark:text-red-400';
      default:
        return 'bg-blue-500/10 text-blue-500 dark:text-blue-400';
    }
  };

  const getStatusIcon = (status: 'uploading' | 'verified' | 'processing' | 'error') => {
    switch (status) {
      case 'verified':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'error':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  // AI Insights Data - Property specific
  const aiOpportunities = [
    {
      id: 'opp-1',
      title: 'Optimal Exit Window Approaching',
      opportunityScore: 94,
      category: 'Exit Strategy',
      insight: `Market demand for ${property.buildingType || 'properties'} in ${property.city || 'this area'} has increased 23% in Q1 2026. Predictive model suggests peak pricing window in next 45-60 days.`,
      recommendedAction: 'Consider listing property for sale or JV partnership',
      potentialValue: '₹105 Cr',
      confidence: 'Very High',
      urgency: 'medium',
      reasoning: [
        `${property.buildingType || 'Real estate'} demand up 23% YoY in micro-market`,
        'Comparable sales showing 15-18% premium over current valuation',
        'Infrastructure projects (Metro Line 4) nearing completion',
        'Historical data shows Q2 peak pricing pattern for this zone',
      ],
    },
  ];

  const aiRisks = [
    {
      id: 'risk-1',
      severity: 'high' as const,
      category: 'Regulatory Risk',
      title: 'Environmental Clearance Delay Risk',
      description: `Predictive model flags 68% probability of EC delay beyond 90 days based on historical SEIAA processing times in ${property.state || 'this region'}.`,
      impact: 'Potential 3-4 month project delay, ₹8-12 Cr cost escalation',
      recommendation: 'Engage expeditor consultant and prepare contingency timeline',
      reasoning: [
        'SEIAA backlog at 145% of normal capacity',
        'Similar applications experiencing 90-120 day delays',
        'Monsoon season (June-Sept) typically adds 30-45 days',
        'Cost escalation averaging 4.5% per quarter delay',
      ],
    },
  ];

  const getOpportunityColor = (score: number) => {
    if (score >= 90) return { bg: 'bg-primary-700/10', text: 'text-primary-700 dark:text-primary-400', border: 'border-primary-700/20' };
    if (score >= 80) return { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500/20' };
    return { bg: 'bg-purple-500/10', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-500/20' };
  };

  const getRiskColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return { bg: 'bg-red-500/10', text: 'text-red-600 dark:text-red-400', border: 'border-red-500/20', icon: XCircle };
      case 'high':
        return { bg: 'bg-orange-500/10', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-500/20', icon: AlertTriangle };
      case 'medium':
        return { bg: 'bg-yellow-500/10', text: 'text-yellow-600 dark:text-yellow-400', border: 'border-yellow-500/20', icon: AlertCircle };
      default:
        return { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500/20', icon: Info };
    }
  };

  const getUrgencyLabel = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return { label: 'Act Within 14 Days', color: 'text-orange-600 dark:text-orange-400' };
      case 'medium':
        return { label: 'Act Within 45 Days', color: 'text-yellow-600 dark:text-yellow-400' };
      default:
        return { label: 'Monitor', color: 'text-blue-600 dark:text-blue-400' };
    }
  };

  // Document categories based on property type
  const getDocumentCategories = () => {
    const buildingType = property.buildingType;
    const propertyType = property.type;

    const categories = {
      mandatory: [] as string[],
      optional: [] as string[],
    };

    if (buildingType === 'residential') {
      if (propertyType === 'Apartment') {
        categories.mandatory = ['Sale Deed', 'Khata Certificate', 'Khata Extract', 'Occupancy Certificate (OC)', 'Latest Property Tax Receipt', 'Owner ID Proof'];
        categories.optional = ['Encumbrance Certificate (EC)', 'Floor Plan', 'Society NOC', 'Electricity Bill', 'Maintenance Bill'];
      } else if (propertyType === 'Villa') {
        categories.mandatory = ['Sale Deed', 'Khata Certificate', 'Khata Extract', 'Occupancy Certificate', 'Property Tax Receipt'];
        categories.optional = ['Approved Building Plan', 'Encumbrance Certificate', 'Borewell Permission', 'Electricity Bill'];
      } else if (propertyType === 'Plot') {
        categories.mandatory = ['Sale Deed', 'Khata Certificate', 'Khata Extract', 'Latest Property Tax Receipt'];
        categories.optional = ['Encumbrance Certificate', 'Layout Approval Plan (BDA/BMP/DTCP)', 'Survey Sketch'];
      } else {
        categories.mandatory = ['Sale Deed', 'Khata Certificate', 'Latest Property Tax Receipt'];
        categories.optional = ['Encumbrance Certificate'];
      }
    } else if (buildingType === 'commercial') {
      if (propertyType === 'Office Space') {
        categories.mandatory = ['Sale Deed / Lease Deed', 'Khata Certificate', 'Occupancy Certificate', 'Property Tax Receipt'];
        categories.optional = ['Encumbrance Certificate', 'Floor Plan', 'Tenant Lease Agreement'];
      } else if (propertyType === 'Shop') {
        categories.mandatory = ['Sale Deed', 'Khata Certificate', 'OC', 'Property Tax Receipt'];
        categories.optional = ['EC', 'Floor Plan', 'Shop License'];
      } else {
        categories.mandatory = ['Sale Deed', 'Khata Certificate', 'Property Tax Receipt'];
        categories.optional = ['Encumbrance Certificate'];
      }
    } else {
      categories.mandatory = ['Sale Deed', 'Khata Certificate'];
      categories.optional = ['Encumbrance Certificate'];
    }

    return categories;
  };

  const documentCategories = getDocumentCategories();

  // Group documents by category
  const groupedDocuments: Record<string, any[]> = {};
  
  if (propertyDocuments) {
    propertyDocuments.forEach((doc: any) => {
      const category = doc.documentType || 'Other Documents';
      if (!groupedDocuments[category]) {
        groupedDocuments[category] = [];
      }
      groupedDocuments[category].push(doc);
    });
  }

  // Document category tabs with weights for trust score calculation
  const docCategoryTabs = {
    ownership: {
      title: 'Ownership',
      documents: ['Sale Deed', 'Khata Certificate', 'Khata Extract'],
      weight: 0.30 // 30% weight
    },
    legalCompliance: {
      title: 'Legal & Compliance',
      documents: ['Occupancy Certificate', 'Building Plan', 'Society NOC', 'Encumbrance Certificate'],
      weight: 0.25 // 25% weight
    },
    landRecords: {
      title: 'Land Records',
      documents: ['Survey Sketch', 'Mutation Certificate', 'Land Conversion Certificate', '7/12 Extract'],
      weight: 0.20 // 20% weight
    },
    financial: {
      title: 'Financial',
      documents: ['Property Tax Receipt', 'Maintenance Bill', 'Bank Statement'],
      weight: 0.15 // 15% weight
    },
    utilities: {
      title: 'Utilities',
      documents: ['Electricity Bill', 'Water Bill', 'Gas Bill', 'Association Receipts'],
      weight: 0.10 // 10% weight
    },
    supporting: {
      title: 'Supporting',
      documents: ['Floor Plan', 'Property Photos', 'Inspection Report'],
      weight: 0.0 // Exceptional, doesn't count towards core score
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-neutral-900 transition-colors duration-300">
      <SideNav />
      
      {/* Header */}
      <div className="border-b border-black/5 dark:border-white/10 bg-card dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                to="/properties" 
                className="inline-flex items-center justify-center w-10 h-10 rounded-[var(--radius-card)] bg-neutral-900/5 dark:bg-card/5 hover:bg-neutral-900/10 dark:hover:bg-card/10 transition-colors text-neutral-700/80 dark:text-neutral-300/80"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div>
                <div className="text-caption font-medium tracking-[0.05em] uppercase text-muted-foreground dark:text-neutral-0/50 mb-2">
                  Property Details
                </div>
                <div className="text-h1 tracking-tight text-foreground dark:text-neutral-0">
                  {property.name}
                </div>
                <div className="flex items-center gap-4 mt-2 text-small text-muted-foreground dark:text-neutral-0/50">
                  <span className="inline-flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" />
                    {property.type}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Added {formatDate(property.dateAdded)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <NotificationDropdown />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Information Card */}
            <div className="bg-card/95 dark:bg-neutral-900/95 backdrop-blur-[40px] rounded-[var(--radius-card)] border border-white/40 dark:border-white/10 p-8 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_20px_40px_-5px_rgba(0,0,0,0.05)] relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent" />
              
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-h3 tracking-tight text-foreground dark:text-neutral-0/95">
                  Property Information
                </h2>
              </div>

              {/* Address Section */}
              <div className="mb-6">
                <div className="text-caption font-medium tracking-[0.05em] uppercase text-muted-foreground dark:text-neutral-300/60 mb-2">
                  Address
                </div>
                <div className="flex items-start gap-3 bg-neutral-900/[0.02] dark:bg-card/[0.02] border border-black/5 dark:border-white/5 rounded-[var(--radius-card)] p-4">
                  <MapPin className="w-5 h-5 text-muted-foreground dark:text-neutral-300/60 flex-shrink-0 mt-0.5" />
                  <div className="text-small text-foreground/70 dark:text-neutral-0/70">
                    {property.address}
                  </div>
                </div>
              </div>

              {/* Location Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {property.country && (
                  <div>
                    <div className="text-caption font-medium tracking-[0.05em] uppercase text-muted-foreground dark:text-neutral-300/60 mb-2">
                      Country
                    </div>
                    <div className="text-small text-foreground dark:text-neutral-0/95">
                      {property.country}
                    </div>
                  </div>
                )}
                {property.state && (
                  <div>
                    <div className="text-caption font-medium tracking-[0.05em] uppercase text-muted-foreground dark:text-neutral-300/60 mb-2">
                      State
                    </div>
                    <div className="text-small text-foreground dark:text-neutral-0/95">
                      {property.state}
                    </div>
                  </div>
                )}
                {property.city && (
                  <div>
                    <div className="text-caption font-medium tracking-[0.05em] uppercase text-muted-foreground dark:text-neutral-300/60 mb-2">
                      City
                    </div>
                    <div className="text-small text-foreground dark:text-neutral-0/95">
                      {property.city}
                    </div>
                  </div>
                )}
                {property.district && (
                  <div>
                    <div className="text-caption font-medium tracking-[0.05em] uppercase text-muted-foreground dark:text-neutral-300/60 mb-2">
                      District
                    </div>
                    <div className="text-small text-foreground dark:text-neutral-0/95">
                      {property.district}
                    </div>
                  </div>
                )}
                {property.latitude && (
                  <div>
                    <div className="text-caption font-medium tracking-[0.05em] uppercase text-muted-foreground dark:text-neutral-300/60 mb-2">
                      Latitude
                    </div>
                    <div className="text-small text-foreground dark:text-neutral-0/95">
                      {property.latitude}
                    </div>
                  </div>
                )}
                {property.longitude && (
                  <div>
                    <div className="text-caption font-medium tracking-[0.05em] uppercase text-muted-foreground dark:text-neutral-300/60 mb-2">
                      Longitude
                    </div>
                    <div className="text-small text-foreground dark:text-neutral-0/95">
                      {property.longitude}
                    </div>
                  </div>
                )}
              </div>

              {/* Zoning */}
              {property.zoning && (
                <div>
                  <div className="text-caption font-medium tracking-[0.05em] uppercase text-muted-foreground dark:text-neutral-300/60 mb-2">
                    Zoning
                  </div>
                  <div className="inline-flex items-center gap-2 bg-primary-700/10 text-primary-700 dark:text-primary-400 px-4 py-2 rounded-[var(--radius)] text-small font-medium">
                    {property.zoning}
                  </div>
                </div>
              )}
            </div>

            {/* Property Specifications Card */}
            <div className="bg-card/95 dark:bg-neutral-900/95 backdrop-blur-[40px] rounded-[var(--radius-card)] border border-white/40 dark:border-white/10 p-8 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_20px_40px_-5px_rgba(0,0,0,0.05)] relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent" />
              
              <h2 className="text-h3 tracking-tight text-foreground dark:text-neutral-0/95 mb-6">
                Property Specifications
              </h2>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-caption font-medium tracking-[0.05em] uppercase text-muted-foreground dark:text-neutral-300/60 mb-2">
                    Building Type
                  </div>
                  <div className="text-[16px] text-foreground dark:text-neutral-0/95 capitalize">
                    {property.buildingType || 'Not specified'}
                  </div>
                </div>
                <div>
                  <div className="text-caption font-medium tracking-[0.05em] uppercase text-muted-foreground dark:text-neutral-300/60 mb-2">
                    Property Type
                  </div>
                  <div className="text-[16px] text-foreground dark:text-neutral-0/95">
                    {property.type || 'Not specified'}
                  </div>
                </div>
                <div>
                  <div className="text-caption font-medium tracking-[0.05em] uppercase text-muted-foreground dark:text-neutral-300/60 mb-2">
                    Plot Size
                  </div>
                  <div className="text-[16px] text-foreground dark:text-neutral-0/95">
                    {property.plotSize || 'Not specified'}
                  </div>
                </div>
                <div>
                  <div className="text-caption font-medium tracking-[0.05em] uppercase text-muted-foreground dark:text-neutral-300/60 mb-2">
                    Built-up Area
                  </div>
                  <div className="text-[16px] text-foreground dark:text-neutral-0/95">
                    {property.builtUpArea || 'Not specified'}
                  </div>
                </div>
                <div>
                  <div className="text-caption font-medium tracking-[0.05em] uppercase text-muted-foreground dark:text-neutral-300/60 mb-2">
                    Year of Construction
                  </div>
                  <div className="text-[16px] text-foreground dark:text-neutral-0/95">
                    {property.yearOfConstruction || 'Not specified'}
                  </div>
                </div>
                <div>
                  <div className="text-caption font-medium tracking-[0.05em] uppercase text-muted-foreground dark:text-neutral-300/60 mb-2">
                    Number of Floors
                  </div>
                  <div className="text-[16px] text-foreground dark:text-neutral-0/95">
                    {property.numberOfFloors || 'Not specified'}
                  </div>
                </div>
                <div>
                  <div className="text-caption font-medium tracking-[0.05em] uppercase text-muted-foreground dark:text-neutral-300/60 mb-2">
                    Survey Number
                  </div>
                  <div className="text-[16px] text-foreground dark:text-neutral-0/95">
                    {property.surveyNumber || 'Not specified'}
                  </div>
                </div>
                <div>
                  <div className="text-caption font-medium tracking-[0.05em] uppercase text-muted-foreground dark:text-neutral-300/60 mb-2">
                    Current Usage
                  </div>
                  <div className="text-[16px] text-foreground dark:text-neutral-0/95">
                    {property.currentUsage || 'Not specified'}
                  </div>
                </div>
                {property.rentalIncome && (
                  <div className="col-span-2">
                    <div className="text-caption font-medium tracking-[0.05em] uppercase text-muted-foreground dark:text-neutral-300/60 mb-2">
                      Rental Income
                    </div>
                    <div className="text-[16px] text-foreground dark:text-neutral-0/95">
                      ₹{property.rentalIncome}/month
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Connectivity & Nearby Landmarks */}
            <div className="bg-card/95 dark:bg-neutral-900/95 backdrop-blur-[40px] rounded-[var(--radius-card)] border border-white/40 dark:border-white/10 p-8 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_20px_40px_-5px_rgba(0,0,0,0.05)] relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent" />
              
              <h2 className="text-h3 tracking-tight text-foreground dark:text-neutral-0/95 mb-6">
                Nearby Landmarks - {property.city || 'Area'}
              </h2>

              {/* Map Preview Placeholder */}
              <div 
                className="bg-neutral-900/5 dark:bg-card/5 rounded-[var(--radius-card)] h-48 mb-6 flex items-center justify-center relative overflow-hidden cursor-pointer group hover:bg-neutral-900/10 dark:hover:bg-card/10 transition-all"
                onClick={() => setShowMapModal(true)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-700/5 to-blue-500/5" />
                <button className="relative inline-flex items-center gap-2 bg-neutral-900 dark:bg-card text-neutral-0 dark:text-foreground px-6 py-3 rounded-[var(--radius-card)] text-small font-medium shadow-[0_2px_8px_rgba(0,0,0,0.15)] group-hover:shadow-[0_4px_16px_rgba(0,0,0,0.25)] group-hover:-translate-y-0.5 transition-all duration-300">
                  <MapPin className="w-4 h-4" />
                  View on Map
                </button>
              </div>

              {/* Category Filters */}
              <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                <button 
                  onClick={() => setSelectedLandmarkCategory('schools')}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-card)] text-caption font-medium whitespace-nowrap transition-all ${
                    selectedLandmarkCategory === 'schools'
                      ? 'bg-primary-700 hover:bg-primary-900 text-neutral-0 shadow-[0_4px_12px_rgba(28,117,188,0.25)]'
                      : 'bg-neutral-900/5 dark:bg-card/5 hover:bg-neutral-900/10 dark:hover:bg-card/10 text-foreground dark:text-neutral-0'
                  }`}
                >
                  <School className="w-4 h-4" />
                  Schools
                </button>
                <button 
                  onClick={() => setSelectedLandmarkCategory('busStops')}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-card)] text-caption font-medium whitespace-nowrap transition-all ${
                    selectedLandmarkCategory === 'busStops'
                      ? 'bg-primary-700 hover:bg-primary-900 text-neutral-0 shadow-[0_4px_12px_rgba(28,117,188,0.25)]'
                      : 'bg-neutral-900/5 dark:bg-card/5 hover:bg-neutral-900/10 dark:hover:bg-card/10 text-foreground dark:text-neutral-0'
                  }`}
                >
                  <Bus className="w-4 h-4" />
                  Bus Stops
                </button>
                <button 
                  onClick={() => setSelectedLandmarkCategory('hospitals')}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-card)] text-caption font-medium whitespace-nowrap transition-all ${
                    selectedLandmarkCategory === 'hospitals'
                      ? 'bg-primary-700 hover:bg-primary-900 text-neutral-0 shadow-[0_4px_12px_rgba(28,117,188,0.25)]'
                      : 'bg-neutral-900/5 dark:bg-card/5 hover:bg-neutral-900/10 dark:hover:bg-card/10 text-foreground dark:text-neutral-0'
                  }`}
                >
                  <Building className="w-4 h-4" />
                  Hospitals
                </button>
                <button 
                  onClick={() => setSelectedLandmarkCategory('banks')}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-card)] text-caption font-medium whitespace-nowrap transition-all ${
                    selectedLandmarkCategory === 'banks'
                      ? 'bg-primary-700 hover:bg-primary-900 text-neutral-0 shadow-[0_4px_12px_rgba(28,117,188,0.25)]'
                      : 'bg-neutral-900/5 dark:bg-card/5 hover:bg-neutral-900/10 dark:hover:bg-card/10 text-foreground dark:text-neutral-0'
                  }`}
                >
                  <Banknote className="w-4 h-4" />
                  Banks
                </button>
                <button 
                  onClick={() => setSelectedLandmarkCategory('temples')}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-card)] text-caption font-medium whitespace-nowrap transition-all ${
                    selectedLandmarkCategory === 'temples'
                      ? 'bg-primary-700 hover:bg-primary-900 text-neutral-0 shadow-[0_4px_12px_rgba(28,117,188,0.25)]'
                      : 'bg-neutral-900/5 dark:bg-card/5 hover:bg-neutral-900/10 dark:hover:bg-card/10 text-foreground dark:text-neutral-0'
                  }`}
                >
                  <Church className="w-4 h-4" />
                  Temples
                </button>
                <button 
                  onClick={() => setSelectedLandmarkCategory('shopping')}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-card)] text-caption font-medium whitespace-nowrap transition-all ${
                    selectedLandmarkCategory === 'shopping'
                      ? 'bg-primary-700 hover:bg-primary-900 text-neutral-0 shadow-[0_4px_12px_rgba(28,117,188,0.25)]'
                      : 'bg-neutral-900/5 dark:bg-card/5 hover:bg-neutral-900/10 dark:hover:bg-card/10 text-foreground dark:text-neutral-0'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  Shopping
                </button>
              </div>

              {/* Landmarks List */}
              <div className="space-y-3 mb-4">
                <h3 className="text-small font-medium tracking-tight text-foreground dark:text-neutral-0/95">
                  {selectedLandmarkCategory === 'schools' && 'Schools'}
                  {selectedLandmarkCategory === 'busStops' && 'Bus Stops'}
                  {selectedLandmarkCategory === 'hospitals' && 'Hospitals'}
                  {selectedLandmarkCategory === 'banks' && 'Banks'}
                  {selectedLandmarkCategory === 'temples' && 'Temples'}
                  {selectedLandmarkCategory === 'shopping' && 'Shopping Centers'}
                  {' '}Near {property.city || 'Area'}
                </h3>
                
                {localityData.nearbyLandmarks[selectedLandmarkCategory].map((landmark, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedLandmark(landmark);
                      setShowMapModal(true);
                    }}
                    className="w-full flex items-center justify-between py-3 border-b border-black/5 dark:border-white/5 hover:bg-neutral-900/[0.02] dark:hover:bg-card/[0.02] transition-all group"
                  >
                    <span className="text-small font-medium text-foreground dark:text-neutral-0/90 group-hover:text-primary-700 dark:group-hover:text-primary-600 transition-colors">
                      {landmark.name}
                    </span>
                    <div className="inline-flex items-center gap-1.5 text-small text-neutral-700/80 dark:text-neutral-300/80">
                      <Navigation className="w-3.5 h-3.5" />
                      {landmark.distance}
                    </div>
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setShowMapModal(true)}
                className="w-full bg-neutral-900/5 dark:bg-card/5 hover:bg-neutral-900/10 dark:hover:bg-card/10 text-foreground dark:text-neutral-0 px-6 py-3 rounded-[var(--radius-card)] text-small font-medium transition-all"
              >
                View All on Map
              </button>
            </div>

            {/* Locality Insights */}
            <div className="bg-card/95 dark:bg-neutral-900/95 backdrop-blur-[40px] rounded-[var(--radius-card)] border border-white/40 dark:border-white/10 p-6 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_20px_40px_-5px_rgba(0,0,0,0.05)] relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent" />
              
              <h2 className="text-[16px] tracking-tight text-foreground dark:text-neutral-0/95 mb-4">
                Locality Insights: {property.city || property.district || 'Area'}
              </h2>

              {/* Description */}
              <p className="text-caption text-foreground/70 dark:text-neutral-0/70 leading-relaxed mb-5">
                The upscale neighbourhood of {property.city || property.district || 'this area'} is located in {property.state || property.country}. There are more than {localityData.rentalCount} rental houses and over {localityData.saleCount} available for purchase in this area. Residents of {property.city || 'this area'} gave this area a safety rating of {localityData.safetyRating}{' '}
                <button className="text-primary-700 dark:text-primary-400 font-medium hover:underline text-caption">
                  Read More
                </button>
              </p>

              {/* Insights Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Price Insights */}
                <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/30 dark:from-blue-950/20 dark:to-indigo-950/10 border border-blue-500/20 rounded-[var(--radius-card)] p-4 relative overflow-hidden group hover:shadow-[0_8px_24px_rgba(59,130,246,0.15)] transition-all duration-300">
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
                  
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-[10px] bg-blue-500/15 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" strokeWidth={2} />
                    </div>
                    <h3 className="text-caption font-medium text-foreground dark:text-neutral-0/95">Price Insights</h3>
                  </div>
                  <div className="mb-1.5 text-caption font-medium tracking-[0.05em] uppercase text-muted-foreground dark:text-neutral-0/50">
                    Average Asking Price in {property.city || 'Area'}
                  </div>
                  <div className="text-h3 font-medium tracking-tight text-foreground dark:text-neutral-0/95 mb-1">
                    ₹{localityData.avgPrice}<span className="text-caption text-primary-700 dark:text-primary-400">{localityData.priceUnit}</span>
                  </div>
                  <div className="text-caption text-neutral-700/80 dark:text-neutral-300/80">
                    Based on active listings and recent trends
                  </div>
                </div>

                {/* Locality Rank */}
                <div className="bg-gradient-to-br from-pink-50/50 to-rose-50/30 dark:from-pink-950/20 dark:to-rose-950/10 border border-pink-500/20 rounded-[var(--radius-card)] p-4 relative overflow-hidden group hover:shadow-[0_8px_24px_rgba(236,72,153,0.15)] transition-all duration-300">
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-pink-500/30 to-transparent" />
                  
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-[10px] bg-pink-500/15 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Award className="w-4 h-4 text-pink-600 dark:text-pink-400" strokeWidth={2} />
                    </div>
                    <h3 className="text-caption font-medium text-foreground dark:text-neutral-0/95">Locality Rank</h3>
                  </div>
                  <div className="text-[16px] font-medium tracking-tight text-foreground dark:text-neutral-0/95 mb-1.5">
                    #{localityData.localityRank} in {localityData.state}
                  </div>
                  <div className="text-caption text-neutral-700/80 dark:text-neutral-300/80 mb-3">
                    Based on demand, livability, and activity
                  </div>
                  <button className="text-caption font-medium text-foreground dark:text-neutral-0/95 underline hover:text-primary-700 dark:hover:text-primary-600 transition-colors">
                    Know More About {property.city || 'Area'}
                  </button>
                </div>

                {/* Demographics */}
                <div className="bg-gradient-to-br from-purple-50/50 to-violet-50/30 dark:from-purple-950/20 dark:to-violet-950/10 border border-purple-500/20 rounded-[var(--radius-card)] p-4 relative overflow-hidden group hover:shadow-[0_8px_24px_rgba(168,85,247,0.15)] transition-all duration-300">
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
                  
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-[10px] bg-purple-500/15 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" strokeWidth={2} />
                    </div>
                    <h3 className="text-caption font-medium text-foreground dark:text-neutral-0/95">Demographics</h3>
                  </div>
                  <div className="text-h3 font-medium tracking-tight text-foreground dark:text-neutral-0/95 mb-1">
                    {localityData.demographicType}
                  </div>
                  <div className="text-caption text-neutral-700/80 dark:text-neutral-300/80 mb-2">
                    {localityData.demographicDesc}
                  </div>
                  <div className="text-caption font-medium text-primary-700 dark:text-primary-400">
                    Safety Rating: {localityData.safetyRating}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Insights */}
            <div className="bg-card/95 dark:bg-neutral-900/95 backdrop-blur-[40px] rounded-[var(--radius-card)] border border-white/40 dark:border-white/10 p-6 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_20px_40px_-5px_rgba(0,0,0,0.05)] relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent" />
              
              <h2 className="text-h3 font-normal tracking-[-0.01em] text-foreground dark:text-neutral-0/95 mb-5">
                AI Market Intelligence
              </h2>

              {/* Opportunities */}
              <div className="space-y-2.5">
                {aiOpportunities.map((opp) => (
                  <div key={opp.id} className="bg-gradient-to-br from-green-50/50 to-lime-50/30 dark:from-green-950/20 dark:to-lime-950/10 border border-green-500/20 rounded-[var(--radius-card)] p-4 relative overflow-hidden hover:shadow-[0_4px_16px_rgba(34,197,94,0.12)] transition-all">
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />
                    
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-9 h-9 rounded-[10px] bg-green-500/15 flex items-center justify-center flex-shrink-0">
                          <Lightbulb className="w-4.5 h-4.5 text-green-600 dark:text-green-400" strokeWidth={2} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-small font-medium text-foreground dark:text-neutral-0/95 mb-0.5">{opp.title}</h3>
                          <p className="text-caption font-medium uppercase tracking-[0.05em] text-muted-foreground dark:text-neutral-300/60">{opp.category}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-h3 font-medium text-green-600 dark:text-green-400 leading-none mb-1">{opp.opportunityScore}</div>
                        <div className="text-[8px] font-medium uppercase tracking-[0.05em] text-muted-foreground dark:text-neutral-300/60">Score</div>
                      </div>
                    </div>

                    <div className="text-caption leading-relaxed text-foreground/70 dark:text-neutral-0/70 mb-3">
                      {opp.insight}
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      <div className="inline-flex items-center gap-1.5 bg-primary-700/10 text-primary-700 dark:text-primary-400 px-2.5 py-1 rounded-[var(--radius)] text-caption font-medium">
                        <IndianRupee className="w-3 h-3" strokeWidth={2.5} />
                        {opp.potentialValue}
                      </div>
                      <div className="inline-flex items-center gap-1.5 bg-primary-700/10 text-primary-700 dark:text-primary-400 px-2.5 py-1 rounded-[var(--radius)] text-caption font-medium">
                        <Target className="w-3 h-3" strokeWidth={2.5} />
                        {opp.confidence}
                      </div>
                      <div className="inline-flex items-center gap-1.5 bg-primary-700/10 text-primary-700 dark:text-primary-400 px-2.5 py-1 rounded-[var(--radius)] text-caption font-medium">
                        <Clock className="w-3 h-3" strokeWidth={2.5} />
                        {getUrgencyLabel(opp.urgency).label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Risks */}
              <div className="space-y-2.5 mt-3">
                {aiRisks.map((risk) => (
                  <div key={risk.id} className="bg-gradient-to-br from-red-50/50 to-rose-50/30 dark:from-red-950/20 dark:to-rose-950/10 border border-red-500/20 rounded-[var(--radius-card)] p-4 relative overflow-hidden hover:shadow-[0_4px_16px_rgba(239,68,68,0.12)] transition-all">
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
                    
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-9 h-9 rounded-[10px] bg-red-500/15 flex items-center justify-center flex-shrink-0">
                          <AlertCircle className="w-4.5 h-4.5 text-red-600 dark:text-red-400" strokeWidth={2} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-small font-medium text-foreground dark:text-neutral-0/95 mb-0.5">{risk.title}</h3>
                          <p className="text-caption font-medium uppercase tracking-[0.05em] text-muted-foreground dark:text-neutral-300/60">{risk.category}</p>
                        </div>
                      </div>
                      <div className="px-2.5 py-1 rounded-[var(--radius)] bg-red-500/15 flex-shrink-0">
                        <div className="text-caption font-medium uppercase tracking-[0.05em] text-red-600 dark:text-red-400">{risk.severity}</div>
                      </div>
                    </div>

                    <div className="text-caption leading-relaxed text-foreground/70 dark:text-neutral-0/70 mb-3">
                      {risk.description}
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      <div className="inline-flex items-center gap-1.5 bg-red-500/10 text-red-600 dark:text-red-400 px-2.5 py-1 rounded-[var(--radius)] text-caption font-medium">
                        <AlertTriangle className="w-3 h-3" strokeWidth={2.5} />
                        {risk.impact}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Documents */}
          <div className="lg:col-span-1">
            <div className="bg-card/95 dark:bg-neutral-900/95 backdrop-blur-[40px] rounded-[var(--radius-card)] border border-white/40 dark:border-white/10 p-8 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_20px_40px_-5px_rgba(0,0,0,0.05)] relative overflow-hidden sticky top-8">
              {/* Subtle glass highlight */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent" />
              
              {/* Header with Trust Score */}
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h2 className="text-h2 font-normal tracking-[-0.01em] text-foreground dark:text-neutral-0/95 mb-2">
                    Document Vault
                  </h2>
                  <p className="text-caption text-muted-foreground dark:text-neutral-0/50">
                    {propertyDocuments?.length || 0} files • Bank-grade security
                  </p>
                </div>
                
                {/* Trust Score Ring */}
                {propertyDocuments && propertyDocuments.length > 0 && (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 rounded-full border-[3px] border-black/5 dark:border-white/5 flex items-center justify-center relative bg-gradient-to-br from-white/80 to-white/40 dark:from-white/[0.08] dark:to-white/[0.02] shadow-[inset_0_1px_2px_rgba(255,255,255,0.5),0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.05),0_4px_12px_rgba(0,0,0,0.15)]">
                      {(() => {
                        let totalScore = 0;
                        Object.entries(docCategoryTabs).forEach(([key, cat]) => {
                          const uploaded = cat.documents.filter(doc => 
                            propertyDocuments?.find((d: any) => d.documentType === doc && d.status === 'verified')
                          ).length;
                          const categoryCompletion = uploaded / cat.documents.length;
                          totalScore += categoryCompletion * (cat.weight * 100);
                        });
                        const currentScore = Math.round(totalScore);
                        return (
                          <>
                            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                              <circle cx="50" cy="50" r="44" className="stroke-primary-700 transition-all duration-1000" strokeWidth="5" fill="none" strokeDasharray="276.46" strokeDashoffset={276.46 - (276.46 * currentScore) / 100} strokeLinecap="round" />
                            </svg>
                            <div className="flex flex-col items-center">
                              <span className="text-[16px] font-medium text-primary-700 dark:text-primary-400">{currentScore}</span>
                              <span className="text-[8px] font-medium uppercase tracking-[0.05em] text-muted-foreground dark:text-neutral-300/60">Score</span>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                    <div className="text-center">
                      <div className="text-caption font-medium uppercase tracking-[0.05em] text-muted-foreground dark:text-neutral-300/60">Trust Level</div>
                      <div className="text-caption font-medium text-primary-700 dark:text-primary-400 mt-0.5">
                        {(() => {
                          let totalScore = 0;
                          Object.entries(docCategoryTabs).forEach(([key, cat]) => {
                            const uploaded = cat.documents.filter(doc => 
                              propertyDocuments?.find((d: any) => d.documentType === doc && d.status === 'verified')
                            ).length;
                            const categoryCompletion = uploaded / cat.documents.length;
                            totalScore += categoryCompletion * (cat.weight * 100);
                          });
                          const currentScore = Math.round(totalScore);
                          if (currentScore >= 90) return 'Excellent';
                          if (currentScore >= 75) return 'Very Good';
                          if (currentScore >= 60) return 'Good';
                          if (currentScore >= 40) return 'Fair';
                          return 'Needs Attention';
                        })()}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Add Documents CTA */}
              {/* Debug Banner - Remove after testing */}
              <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-[var(--radius-card)]">
                <p className="text-caption font-medium text-yellow-700 dark:text-yellow-400">
                  DEBUG: {propertyDocuments?.length || 0} documents loaded
                </p>
              </div>

              <Link
                to={`/property/${id}/documents/upload`}
                className="w-full mb-8 bg-primary-700 hover:bg-primary-900 text-neutral-0 px-6 py-4 rounded-[var(--radius-card)] text-small font-medium transition-all shadow-[0_4px_12px_rgba(28,117,188,0.25)] hover:shadow-[0_6px_20px_rgba(28,117,188,0.35)] hover:-translate-y-0.5 flex items-center justify-center gap-2.5"
              >
                <Plus className="w-5 h-5" strokeWidth={2.5} />
                Upload Documents
              </Link>

              {propertyDocuments && propertyDocuments.length > 0 ? (
                <div className="space-y-3">
                  {/* Accordion Categories */}
                  {Object.entries(docCategoryTabs).map(([key, cat]) => {
                    const uploaded = cat.documents.filter(doc => 
                      propertyDocuments?.find((d: any) => d.documentType === doc && d.status === 'verified')
                    ).length;
                    const isComplete = uploaded === cat.documents.length;
                    const isExpanded = expandedDocCategory === key;
                    const categoryDocs = propertyDocuments?.filter((doc: any) => 
                      cat.documents.includes(doc.documentType || '')
                    ) || [];
                    const percentage = Math.round((uploaded / cat.documents.length) * 100);
                    
                    // Debug logging
                    if (key === 'ownership') {
                      console.log('Ownership Category Debug:');
                      console.log('Expected docs:', cat.documents);
                      console.log('Category docs found:', categoryDocs);
                      console.log('Uploaded count:', uploaded);
                    }
                    
                    return (
                      <div key={key} className="bg-card/85 dark:bg-card/[0.03] backdrop-blur-[20px] border border-white/40 dark:border-white/[0.08] rounded-[var(--radius-card)] overflow-hidden transition-all">
                        {/* Accordion Header */}
                        <button
                          onClick={() => setExpandedDocCategory(isExpanded ? null : key)}
                          className="w-full p-4 flex items-center justify-between hover:bg-neutral-900/[0.02] dark:hover:bg-card/[0.02] transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-[10px] bg-gradient-to-br from-primary-700/15 to-primary-900/10 flex items-center justify-center">
                              <FileText className="w-5 h-5 text-primary-700 dark:text-primary-400" strokeWidth={2} />
                            </div>
                            <div className="text-left">
                              <div className="flex items-center gap-2">
                                <h3 className="text-small font-medium text-foreground dark:text-neutral-0/95">{cat.title}</h3>
                                {isComplete && <div className="w-1.5 h-1.5 rounded-full bg-primary-700 animate-pulse" />}
                              </div>
                              <p className="text-caption text-muted-foreground dark:text-neutral-0/50 mt-0.5">
                                {uploaded} of {cat.documents.length} uploaded
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="text-[16px] font-medium text-primary-700 dark:text-primary-400">
                                {percentage}%
                              </div>
                            </div>
                            <ChevronDown className={`w-5 h-5 text-muted-foreground dark:text-neutral-300/60 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          </div>
                        </button>

                        {/* Accordion Content */}
                        {isExpanded && (
                          <div className="border-t border-black/5 dark:border-white/10 p-4 pt-3 space-y-2">
                            {categoryDocs.length > 0 ? (
                              categoryDocs.map((doc: any) => (
                                <div
                                  key={doc.id}
                                  className="bg-card/50 dark:bg-card/[0.02] border border-black/5 dark:border-white/5 rounded-[10px] p-3 hover:bg-neutral-900/[0.02] dark:hover:bg-card/[0.04] transition-all group"
                                >
                                  <div className="flex items-center gap-2.5">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-[var(--radius)] bg-gradient-to-br from-primary-700/15 to-primary-900/10 flex items-center justify-center">
                                      <FileText className="w-4 h-4 text-primary-700 dark:text-primary-400" strokeWidth={2} />
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                      <div className="text-caption font-medium text-foreground dark:text-neutral-0/95 mb-0.5 truncate">
                                        {doc.name}
                                      </div>
                                      <div className="flex items-center gap-2 text-caption">
                                        <span className="text-muted-foreground dark:text-neutral-0/50">{doc.size}</span>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button className="w-7 h-7 rounded-[var(--radius)] hover:bg-neutral-900/5 dark:hover:bg-card/5 flex items-center justify-center text-neutral-700/80 dark:text-neutral-300/80">
                                        <Eye className="w-3.5 h-3.5" strokeWidth={2} />
                                      </button>
                                      <button className="w-7 h-7 rounded-[var(--radius)] hover:bg-neutral-900/5 dark:hover:bg-card/5 flex items-center justify-center text-neutral-700/80 dark:text-neutral-300/80">
                                        <Download className="w-3.5 h-3.5" strokeWidth={2} />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-8 bg-neutral-900/[0.01] dark:bg-card/[0.01] rounded-[10px] border border-dashed border-black/10 dark:border-white/10">
                                <div className="w-10 h-10 rounded-full bg-neutral-900/5 dark:bg-card/5 flex items-center justify-center mx-auto mb-2">
                                  <Upload className="w-5 h-5 text-foreground/30 dark:text-neutral-0/30" strokeWidth={2} />
                                </div>
                                <p className="text-caption text-muted-foreground dark:text-neutral-0/50">
                                  No documents uploaded
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-[var(--space-12)] px-6 bg-gradient-to-br from-black/[0.01] to-black/[0.02] dark:from-white/[0.01] dark:to-white/[0.02] rounded-[var(--radius-card)] border-2 border-dashed border-black/10 dark:border-white/10">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-black/5 to-black/10 dark:from-white/5 dark:to-white/10 flex items-center justify-center mx-auto mb-5 shadow-inner">
                    <Upload className="w-8 h-8 text-foreground/30 dark:text-neutral-0/30" strokeWidth={2} />
                  </div>
                  <h3 className="text-[16px] font-medium text-foreground dark:text-neutral-0/95 mb-2">
                    No Documents Yet
                  </h3>
                  <p className="text-caption text-muted-foreground dark:text-neutral-0/50 max-w-xs mx-auto">
                    Upload property documents to activate AI analysis and build your trust score
                  </p>
                </div>
              )}

              {/* Quick Actions */}
              <div className="mt-6 pt-6 border-t border-black/5 dark:border-white/10">
                <div className="text-caption font-medium tracking-[0.05em] uppercase text-muted-foreground dark:text-neutral-300/60 mb-3">
                  Quick Actions
                </div>
                <div className="space-y-2">
                  <Link
                    to={`/property/${property.id}/habu`}
                    className="flex items-center justify-between w-full bg-neutral-900/[0.02] dark:bg-card/[0.02] hover:bg-neutral-900/[0.04] dark:hover:bg-card/[0.04] border border-black/5 dark:border-white/5 rounded-[var(--radius)] px-4 py-3 text-small text-foreground dark:text-neutral-0/95 transition-all group"
                  >
                    <span>HABU Report</span>
                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                  <Link
                    to="/services?service=lease-rent"
                    className="flex items-center justify-between w-full bg-neutral-900/[0.02] dark:bg-card/[0.02] hover:bg-neutral-900/[0.04] dark:hover:bg-card/[0.04] border border-black/5 dark:border-white/5 rounded-[var(--radius)] px-4 py-3 text-small text-foreground dark:text-neutral-0/95 transition-all group"
                  >
                    <span>Lease & Rent</span>
                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                  <Link
                    to="/services?service=sell-liquidate"
                    className="flex items-center justify-between w-full bg-neutral-900/[0.02] dark:bg-card/[0.02] hover:bg-neutral-900/[0.04] dark:hover:bg-card/[0.04] border border-black/5 dark:border-white/5 rounded-[var(--radius)] px-4 py-3 text-small text-foreground dark:text-neutral-0/95 transition-all group"
                  >
                    <span>Sell or Liquidate</span>
                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                  <Link
                    to="/services?service=property-service"
                    className="flex items-center justify-between w-full bg-neutral-900/[0.02] dark:bg-card/[0.02] hover:bg-neutral-900/[0.04] dark:hover:bg-card/[0.04] border border-black/5 dark:border-white/5 rounded-[var(--radius)] px-4 py-3 text-small text-foreground dark:text-neutral-0/95 transition-all group"
                  >
                    <span>Property Service</span>
                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Document Upload Modal */}
      {showDocumentModal && (
        <div className="fixed inset-0 bg-neutral-900/60 dark:bg-neutral-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card dark:bg-neutral-900 rounded-[var(--radius-card)] border border-black/10 dark:border-white/10 max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
            {/* Modal Header */}
            <div className="border-b border-black/5 dark:border-white/10 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-h2 tracking-tight text-foreground dark:text-neutral-0/95 mb-1">
                  Upload Documents
                </h2>
                <p className="text-small text-neutral-700/80 dark:text-neutral-300/80">
                  Add required documents for {property.name}
                </p>
              </div>
              <button
                onClick={() => setShowDocumentModal(false)}
                className="w-10 h-10 rounded-[var(--radius-card)] bg-neutral-900/5 dark:bg-card/5 hover:bg-neutral-900/10 dark:hover:bg-card/10 flex items-center justify-center text-neutral-700/80 dark:text-neutral-300/80 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6">
              {/* Property Type Info */}
              <div className="bg-primary-700/10 border border-primary-700/20 rounded-[var(--radius-card)] p-4 mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <Building2 className="w-5 h-5 text-primary-700 dark:text-primary-400" />
                  <div className="text-small font-medium text-foreground dark:text-neutral-0/95">
                    {property.buildingType} - {property.type}
                  </div>
                </div>
                <div className="text-caption text-foreground/70 dark:text-neutral-0/70">
                  Document requirements are based on your property type
                </div>
              </div>

              {/* Mandatory Documents */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="text-small font-medium tracking-tight text-foreground dark:text-neutral-0/95">
                    Mandatory Documents
                  </div>
                  <div className="bg-red-500/10 text-red-600 dark:text-red-400 px-2 py-1 rounded-[var(--radius)] text-caption font-medium tracking-[0.05em] uppercase">
                    Required
                  </div>
                </div>
                <div className="space-y-3">
                  {documentCategories.mandatory.map((docType, index) => (
                    <div
                      key={index}
                      className="bg-card dark:bg-neutral-900 border-2 border-dashed border-black/10 dark:border-white/10 hover:border-primary-700/30 dark:hover:border-primary-700/30 rounded-[var(--radius-card)] p-4 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-[var(--radius)] bg-primary-700/10 flex items-center justify-center group-hover:bg-primary-700/20 transition-all">
                            <Upload className="w-5 h-5 text-primary-700 dark:text-primary-400" />
                          </div>
                          <div>
                            <div className="text-small font-medium text-foreground dark:text-neutral-0/95">
                              {docType}
                            </div>
                            <div className="text-caption text-muted-foreground dark:text-neutral-0/50">
                              Click to upload or drag and drop
                            </div>
                          </div>
                        </div>
                        <div className="text-caption text-red-600 dark:text-red-400 font-medium">
                          Required
                        </div>
                      </div>
                      
                      {/* Show uploaded files for this category */}
                      {groupedDocuments[docType] && groupedDocuments[docType].length > 0 && (
                        <div className="mt-3 pt-3 border-t border-black/5 dark:border-white/5 space-y-2">
                          {groupedDocuments[docType].map((doc) => (
                            <div key={doc.id} className="flex items-center gap-2 text-caption">
                              <CheckCircle2 className="w-4 h-4 text-primary-700" />
                              <span className="text-foreground/70 dark:text-neutral-0/70">{doc.name}</span>
                              <span className="text-muted-foreground dark:text-neutral-300/60">({doc.size})</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Optional Documents */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="text-small font-medium tracking-tight text-foreground dark:text-neutral-0/95">
                    Optional Documents
                  </div>
                  <div className="bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-[var(--radius)] text-caption font-medium tracking-[0.05em] uppercase">
                    Recommended
                  </div>
                </div>
                <div className="space-y-3">
                  {documentCategories.optional.map((docType, index) => (
                    <div
                      key={index}
                      className="bg-card dark:bg-neutral-900 border-2 border-dashed border-black/10 dark:border-white/10 hover:border-blue-500/30 dark:hover:border-blue-500/30 rounded-[var(--radius-card)] p-4 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-[var(--radius)] bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-all">
                            <Upload className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <div className="text-small font-medium text-foreground dark:text-neutral-0/95">
                              {docType}
                            </div>
                            <div className="text-caption text-muted-foreground dark:text-neutral-0/50">
                              Click to upload or drag and drop
                            </div>
                          </div>
                        </div>
                        <div className="text-caption text-blue-600 dark:text-blue-400 font-medium">
                          Optional
                        </div>
                      </div>
                      
                      {/* Show uploaded files for this category */}
                      {groupedDocuments[docType] && groupedDocuments[docType].length > 0 && (
                        <div className="mt-3 pt-3 border-t border-black/5 dark:border-white/5 space-y-2">
                          {groupedDocuments[docType].map((doc) => (
                            <div key={doc.id} className="flex items-center gap-2 text-caption">
                              <CheckCircle2 className="w-4 h-4 text-blue-500" />
                              <span className="text-foreground/70 dark:text-neutral-0/70">{doc.name}</span>
                              <span className="text-muted-foreground dark:text-neutral-300/60">({doc.size})</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-black/5 dark:border-white/10 p-6 flex items-center justify-between bg-neutral-900/[0.01] dark:bg-card/[0.01]">
              <div className="text-caption text-neutral-700/80 dark:text-neutral-300/80">
                Supported formats: PDF, JPG, PNG (Max 10MB per file)
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowDocumentModal(false)}
                  className="px-6 py-2.5 rounded-[var(--radius-card)] text-small font-medium text-foreground dark:text-neutral-0/95 bg-neutral-900/5 dark:bg-card/5 hover:bg-neutral-900/10 dark:hover:bg-card/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowDocumentModal(false)}
                  className="px-6 py-2.5 rounded-[var(--radius-card)] text-small font-medium text-neutral-0 bg-primary-700 hover:bg-primary-900 transition-all shadow-[0_4px_12px_rgba(28,117,188,0.25)]"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Map Modal */}
      {showMapModal && (
        <div className="fixed inset-0 bg-neutral-900/60 dark:bg-neutral-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card dark:bg-neutral-900 rounded-[var(--radius-card)] border border-black/10 dark:border-white/10 max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
            {/* Modal Header */}
            <div className="border-b border-black/5 dark:border-white/10 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-h2 tracking-tight text-foreground dark:text-neutral-0/95 mb-1">
                  Nearby Landmarks Map
                </h2>
                <p className="text-small text-neutral-700/80 dark:text-neutral-300/80">
                  {property.address}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowMapModal(false);
                  setSelectedLandmark(null);
                }}
                className="w-10 h-10 rounded-[var(--radius-card)] bg-neutral-900/5 dark:bg-card/5 hover:bg-neutral-900/10 dark:hover:bg-card/10 flex items-center justify-center text-neutral-700/80 dark:text-neutral-300/80 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Map Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 h-[calc(90vh-140px)]">
              {/* Landmarks List - Left Side */}
              <div className="lg:col-span-1 border-r border-black/5 dark:border-white/10 overflow-y-auto p-6">
                <div className="text-caption font-medium tracking-[0.05em] uppercase text-muted-foreground dark:text-neutral-300/60 mb-4">
                  Category
                </div>
                
                {/* Category Filters */}
                <div className="space-y-2 mb-6">
                  <button 
                    onClick={() => setSelectedLandmarkCategory('schools')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-[var(--radius-card)] text-small font-medium transition-all ${
                      selectedLandmarkCategory === 'schools'
                        ? 'bg-primary-700 text-neutral-0 shadow-[0_4px_12px_rgba(28,117,188,0.25)]'
                        : 'bg-neutral-900/5 dark:bg-card/5 hover:bg-neutral-900/10 dark:hover:bg-card/10 text-foreground dark:text-neutral-0'
                    }`}
                  >
                    <School className="w-5 h-5" />
                    <span>Schools</span>
                    <span className="ml-auto text-caption opacity-70">
                      {localityData.nearbyLandmarks.schools.length}
                    </span>
                  </button>
                  <button 
                    onClick={() => setSelectedLandmarkCategory('busStops')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-[var(--radius-card)] text-small font-medium transition-all ${
                      selectedLandmarkCategory === 'busStops'
                        ? 'bg-primary-700 text-neutral-0 shadow-[0_4px_12px_rgba(28,117,188,0.25)]'
                        : 'bg-neutral-900/5 dark:bg-card/5 hover:bg-neutral-900/10 dark:hover:bg-card/10 text-foreground dark:text-neutral-0'
                    }`}
                  >
                    <Bus className="w-5 h-5" />
                    <span>Bus Stops</span>
                    <span className="ml-auto text-caption opacity-70">
                      {localityData.nearbyLandmarks.busStops.length}
                    </span>
                  </button>
                  <button 
                    onClick={() => setSelectedLandmarkCategory('hospitals')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-[var(--radius-card)] text-small font-medium transition-all ${
                      selectedLandmarkCategory === 'hospitals'
                        ? 'bg-primary-700 text-neutral-0 shadow-[0_4px_12px_rgba(28,117,188,0.25)]'
                        : 'bg-neutral-900/5 dark:bg-card/5 hover:bg-neutral-900/10 dark:hover:bg-card/10 text-foreground dark:text-neutral-0'
                    }`}
                  >
                    <Building className="w-5 h-5" />
                    <span>Hospitals</span>
                    <span className="ml-auto text-caption opacity-70">
                      {localityData.nearbyLandmarks.hospitals.length}
                    </span>
                  </button>
                  <button 
                    onClick={() => setSelectedLandmarkCategory('banks')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-[var(--radius-card)] text-small font-medium transition-all ${
                      selectedLandmarkCategory === 'banks'
                        ? 'bg-primary-700 text-neutral-0 shadow-[0_4px_12px_rgba(28,117,188,0.25)]'
                        : 'bg-neutral-900/5 dark:bg-card/5 hover:bg-neutral-900/10 dark:hover:bg-card/10 text-foreground dark:text-neutral-0'
                    }`}
                  >
                    <Banknote className="w-5 h-5" />
                    <span>Banks</span>
                    <span className="ml-auto text-caption opacity-70">
                      {localityData.nearbyLandmarks.banks.length}
                    </span>
                  </button>
                  <button 
                    onClick={() => setSelectedLandmarkCategory('temples')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-[var(--radius-card)] text-small font-medium transition-all ${
                      selectedLandmarkCategory === 'temples'
                        ? 'bg-primary-700 text-neutral-0 shadow-[0_4px_12px_rgba(28,117,188,0.25)]'
                        : 'bg-neutral-900/5 dark:bg-card/5 hover:bg-neutral-900/10 dark:hover:bg-card/10 text-foreground dark:text-neutral-0'
                    }`}
                  >
                    <Church className="w-5 h-5" />
                    <span>Temples</span>
                    <span className="ml-auto text-caption opacity-70">
                      {localityData.nearbyLandmarks.temples.length}
                    </span>
                  </button>
                  <button 
                    onClick={() => setSelectedLandmarkCategory('shopping')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-[var(--radius-card)] text-small font-medium transition-all ${
                      selectedLandmarkCategory === 'shopping'
                        ? 'bg-primary-700 text-neutral-0 shadow-[0_4px_12px_rgba(28,117,188,0.25)]'
                        : 'bg-neutral-900/5 dark:bg-card/5 hover:bg-neutral-900/10 dark:hover:bg-card/10 text-foreground dark:text-neutral-0'
                    }`}
                  >
                    <ShoppingBag className="w-5 h-5" />
                    <span>Shopping</span>
                    <span className="ml-auto text-caption opacity-70">
                      {localityData.nearbyLandmarks.shopping.length}
                    </span>
                  </button>
                </div>

                {/* Landmarks in Selected Category */}
                <div className="text-caption font-medium tracking-[0.05em] uppercase text-muted-foreground dark:text-neutral-300/60 mb-4">
                  Nearby Locations
                </div>
                <div className="space-y-2">
                  {localityData.nearbyLandmarks[selectedLandmarkCategory].map((landmark, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedLandmark(landmark)}
                      className={`w-full text-left px-4 py-3 rounded-[var(--radius-card)] transition-all ${
                        selectedLandmark?.name === landmark.name
                          ? 'bg-primary-700/10 border-2 border-primary-700/30'
                          : 'bg-neutral-900/[0.02] dark:bg-card/[0.02] border-2 border-transparent hover:bg-neutral-900/[0.04] dark:hover:bg-card/[0.04]'
                      }`}
                    >
                      <div className="text-small font-medium text-foreground dark:text-neutral-0/95 mb-1">
                        {landmark.name}
                      </div>
                      <div className="flex items-center gap-2 text-caption text-neutral-700/80 dark:text-neutral-300/80">
                        <Navigation className="w-3 h-3" />
                        {landmark.distance}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Map Display - Right Side */}
              <div className="lg:col-span-2 relative bg-gradient-to-br from-primary-100/30 to-blue-50/20 dark:from-primary-900/10 dark:to-blue-950/5">
                {/* Map Placeholder with Property and Landmark Markers */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Grid Pattern Background */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="h-full w-full" style={{
                      backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
                      backgroundSize: '50px 50px'
                    }} />
                  </div>

                  {/* Map Content */}
                  <div className="relative z-10 w-full h-full p-8">
                    {/* Property Location (Center) */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="relative">
                        <div className="absolute inset-0 bg-primary-700 rounded-full blur-xl opacity-30 animate-pulse" />
                        <div className="relative bg-primary-700 text-neutral-0 p-4 rounded-[var(--radius-card)] shadow-[0_8px_24px_rgba(28,117,188,0.3)] border-4 border-white dark:border-neutral-900">
                          <Building2 className="w-8 h-8" />
                        </div>
                        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                          <div className="bg-card dark:bg-neutral-900 px-3 py-2 rounded-[var(--radius)] shadow-lg border border-black/10 dark:border-white/10">
                            <div className="text-caption font-medium text-foreground dark:text-neutral-0/95">
                              {property.name}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Selected Landmark Marker */}
                    {selectedLandmark && (
                      <div className="absolute top-1/4 right-1/4 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="relative">
                          <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-30 animate-pulse" />
                          <div className="relative bg-blue-500 text-neutral-0 p-3 rounded-[var(--radius-card)] shadow-[0_8px_24px_rgba(59,130,246,0.3)] border-4 border-white dark:border-neutral-900">
                            {selectedLandmarkCategory === 'schools' && <School className="w-6 h-6" />}
                            {selectedLandmarkCategory === 'busStops' && <Bus className="w-6 h-6" />}
                            {selectedLandmarkCategory === 'hospitals' && <Building className="w-6 h-6" />}
                            {selectedLandmarkCategory === 'banks' && <Banknote className="w-6 h-6" />}
                            {selectedLandmarkCategory === 'temples' && <Church className="w-6 h-6" />}
                            {selectedLandmarkCategory === 'shopping' && <ShoppingBag className="w-6 h-6" />}
                          </div>
                          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                            <div className="bg-card dark:bg-neutral-900 px-3 py-2 rounded-[var(--radius)] shadow-lg border border-black/10 dark:border-white/10">
                              <div className="text-caption font-medium text-foreground dark:text-neutral-0/95 mb-1">
                                {selectedLandmark.name}
                              </div>
                              <div className="text-caption text-neutral-700/80 dark:text-neutral-300/80 flex items-center gap-1">
                                <Navigation className="w-3 h-3" />
                                {selectedLandmark.distance}
                              </div>
                            </div>
                          </div>
                          {/* Connection Line */}
                          <svg className="absolute top-1/2 left-1/2 w-96 h-96 pointer-events-none" style={{ transform: 'translate(-50%, -50%)' }}>
                            <line
                              x1="192"
                              y1="192"
                              x2="320"
                              y2="320"
                              stroke="rgba(28,117,188,0.3)"
                              strokeWidth="2"
                              strokeDasharray="8 4"
                            />
                          </svg>
                        </div>
                      </div>
                    )}

                    {/* Info Box */}
                    <div className="absolute bottom-8 left-8 right-8">
                      <div className="bg-card/95 dark:bg-neutral-900/95 backdrop-blur-xl rounded-[var(--radius-card)] border border-black/10 dark:border-white/10 p-4 shadow-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-[var(--radius)] bg-primary-700/10 flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-primary-700" />
                          </div>
                          <div className="flex-1">
                            <div className="text-caption font-medium tracking-[0.05em] uppercase text-muted-foreground dark:text-neutral-300/60 mb-1">
                              Interactive Map Preview
                            </div>
                            <div className="text-small text-foreground/70 dark:text-neutral-0/70">
                              Select a landmark from the list to view its location relative to your property
                            </div>
                          </div>
                          <button className="px-4 py-2 bg-primary-700 hover:bg-primary-900 text-neutral-0 rounded-[var(--radius-card)] text-caption font-medium transition-all shadow-[0_4px_12px_rgba(28,117,188,0.25)]">
                            Get Directions
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}