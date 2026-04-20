import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { ArrowLeft, FileText, Home, TrendingUp, IndianRupee, Sparkles, CheckCircle2, ArrowRight, Building2, MapPin, Upload, Navigation, Map as MapIcon, UserCheck, FileCheck, X, Clock } from 'lucide-react';
import { SideNav } from '../components/SideNav';
import { ThemeToggle } from '../components/ThemeToggle';
import { NotificationDropdown } from '../components/NotificationDropdown';
import { useCases, ServiceType as CaseServiceType, SubServiceType } from '../contexts/CasesContext';
import { useProperties } from '../contexts/PropertiesContext';
import { PropertyLocationMap } from '../components/PropertyLocationMap';

type ServiceType = 'habu-report' | 'property-service' | 'lease-rent' | 'sell-liquidate' | null;
type PropertyOwnership = 'own' | 'non-own' | null;
type FlowStep = 'service-selection' | 'sub-service-selection' | 'ownership-type' | 'property-selection' | 'property-details' | 'case-generated';

interface SubServiceDetail {
  name: string;
  description: string;
  eta: string;
  priceRange: string;
}

interface Service {
  id: ServiceType;
  name: string;
  description: string;
  icon: typeof FileText;
  color: string;
  features: string[];
  badge?: string;
  subServices?: string[]; // Sub-services for each main service
  subServicesDetails?: SubServiceDetail[]; // Detailed info for sub-services
}

interface Property {
  id: string;
  name: string;
  type: string;
  location: string;
}

interface NonOwnedPropertyData {
  relationship: string;
  ownerAuthorization: boolean;
  propertyName: string;
  propertyLocation: string;
  ownerName: string;
  supportingDocument: File | null;
  latitude: string;
  longitude: string;
}

// Mock properties for demonstration
const mockProperties: Property[] = [
  {
    id: 'prop-001',
    name: 'Whitefield Prime Land',
    type: 'Residential Land',
    location: 'Whitefield, Bangalore',
  },
  {
    id: 'prop-002',
    name: 'Prestige Villa Plot',
    type: 'Residential Villa',
    location: 'Indiranagar, Bangalore',
  },
  {
    id: 'prop-003',
    name: 'Commercial Hub Building',
    type: 'Commercial Building',
    location: 'MG Road, Bangalore',
  },
];

const services: Service[] = [
  {
    id: 'habu-report',
    name: 'HABU Report',
    description: 'AI-powered property analysis with investment strategies and risk assessment',
    icon: Sparkles,
    color: 'from-[#FFC700] to-amber-500',
    badge: 'Most Popular',
    features: [
      'Comprehensive property analysis',
      'Investment opportunity scoring',
      'Legal & compliance review',
      'Market positioning insights',
      'ROI projections & scenarios',
    ],
  },
  {
    id: 'property-service',
    name: 'Property Service',
    description: 'End-to-end property management and maintenance services',
    icon: Home,
    color: 'from-emerald-500 to-green-500',
    features: [
      'Property maintenance',
      'Tenant management',
      'Repairs & renovations',
      'Utility management',
      'Regular inspections',
    ],
    subServices: ['Property Tax Filing', 'Asset Valuation', 'Property Maintenance', 'Legal Documentation'],
    subServicesDetails: [
      {
        name: 'Property Tax Filing',
        description: 'Complete property tax assessment, filing, and compliance management with government authorities',
        eta: '7-14 days',
        priceRange: '₹5,000 - ₹15,000'
      },
      {
        name: 'Asset Valuation',
        description: 'Professional property valuation by certified valuers with comprehensive market analysis',
        eta: '3-5 days',
        priceRange: '₹10,000 - ₹30,000'
      },
      {
        name: 'Property Maintenance',
        description: 'Regular maintenance, repairs, and upkeep services for residential and commercial properties',
        eta: '1-2 days',
        priceRange: '₹3,000 - ₹25,000'
      },
      {
        name: 'Legal Documentation',
        description: 'Property document verification, legal review, and compliance documentation services',
        eta: '5-10 days',
        priceRange: '₹8,000 - ₹20,000'
      }
    ]
  },
  {
    id: 'lease-rent',
    name: 'Lease & Rent',
    description: 'Professional leasing services with tenant screening and agreement management',
    icon: FileText,
    color: 'from-blue-500 to-cyan-500',
    features: [
      'Tenant screening & verification',
      'Rental agreement drafting',
      'Rent collection management',
      'Lease renewal handling',
      'Legal compliance support',
    ],
    subServices: ['Tenant Screening', 'Rental Management & Asset Care', 'Lease Compliance & Documentation'],
    subServicesDetails: [
      {
        name: 'Tenant Screening',
        description: 'Comprehensive background verification, credit checks, and tenant reference validation',
        eta: '2-4 days',
        priceRange: '₹2,000 - ₹8,000'
      },
      {
        name: 'Rental Management & Asset Care',
        description: 'End-to-end rental property management including rent collection, maintenance coordination, and tenant relations',
        eta: 'Ongoing',
        priceRange: '₹5,000 - ₹20,000/month'
      },
      {
        name: 'Lease Compliance & Documentation',
        description: 'Legal lease agreement drafting, registration, and compliance with local rental laws',
        eta: '3-7 days',
        priceRange: '₹5,000 - ₹12,000'
      }
    ]
  },
  {
    id: 'sell-liquidate',
    name: 'Sell or Liquidate',
    description: 'Strategic exit planning with market analysis and buyer connections',
    icon: IndianRupee,
    color: 'from-purple-500 to-pink-500',
    features: [
      'Market valuation analysis',
      'Strategic exit planning',
      'Buyer network access',
      'Negotiation support',
      'Transaction management',
    ],
    subServices: ['Market Analysis', 'JV Partnership', 'Asset Liquidation'],
    subServicesDetails: [
      {
        name: 'Market Analysis',
        description: 'Comprehensive market research, competitive analysis, and optimal pricing strategy for your property',
        eta: '5-7 days',
        priceRange: '₹15,000 - ₹35,000'
      },
      {
        name: 'JV Partnership',
        description: 'Strategic joint venture partnership facilitation with verified investors and developers',
        eta: '14-30 days',
        priceRange: '₹25,000 - ₹75,000'
      },
      {
        name: 'Asset Liquidation',
        description: 'Complete asset sale management including buyer sourcing, negotiation, and transaction closure',
        eta: '30-90 days',
        priceRange: '₹30,000 - ₹1,00,000'
      }
    ]
  },
];

const generateCaseId = () => {
  const prefix = 'VYBE';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

export function ServiceManagement() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addCase } = useCases();
  const { properties } = useProperties();
  const [selectedService, setSelectedService] = useState<ServiceType>(null);
  const [selectedSubService, setSelectedSubService] = useState<string | null>(null);
  const [hoveredService, setHoveredService] = useState<ServiceType>(null);
  const [propertyOwnership, setPropertyOwnership] = useState<PropertyOwnership>(null);
  const [flowStep, setFlowStep] = useState<FlowStep>('service-selection');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [caseId, setCaseId] = useState<string>('');
  const [showMap, setShowMap] = useState(false);
  const [nonOwnedPropertyData, setNonOwnedPropertyData] = useState<NonOwnedPropertyData>({
    relationship: '',
    ownerAuthorization: false,
    propertyName: '',
    propertyLocation: '',
    ownerName: '',
    supportingDocument: null,
    latitude: '',
    longitude: '',
  });

  // Convert properties from PropertiesContext to match the Property interface
  const userProperties: Property[] = properties.map(p => ({
    id: p.id,
    name: p.name,
    type: p.type,
    location: p.address,
  }));

  useEffect(() => {
    // Check if navigation state contains service selection info from ServiceDetail
    if (location.state) {
      const { selectedService: navService, ownershipType, skipOwnershipModal } = location.state as any;
      
      if (navService) {
        setSelectedService(navService as ServiceType);
        
        if (ownershipType === 'own') {
          // HABU with own property selected
          setPropertyOwnership('own');
          setFlowStep('property-selection');
        } else if (ownershipType === 'non-own') {
          // HABU with non-own property selected
          setPropertyOwnership('non-own');
          setFlowStep('property-details');
        } else if (skipOwnershipModal) {
          // Other services (skip ownership modal, go straight to sub-service or property selection)
          setPropertyOwnership('own');
          // Check if service has sub-services
          const service = services.find(s => s.id === navService);
          if (service?.subServices && service.subServices.length > 0) {
            setFlowStep('sub-service-selection');
          } else {
            setFlowStep('property-selection');
          }
        }
        
        // Clear the navigation state
        navigate(location.pathname, { replace: true, state: {} });
      }
    }
  }, [location.state]);

  const handleServiceSelect = (serviceId: ServiceType) => {
    setSelectedService(serviceId);
    
    // Only ask for ownership type for HABU Report
    if (serviceId === 'habu-report') {
      setFlowStep('ownership-type');
    } else {
      // For all other services, check if they have sub-services
      const service = services.find(s => s.id === serviceId);
      setPropertyOwnership('own');
      if (service?.subServices && service.subServices.length > 0) {
        setFlowStep('sub-service-selection');
      } else {
        setFlowStep('property-selection');
      }
    }
  };

  const handleSubServiceSelect = (subService: string) => {
    setSelectedSubService(subService);
  };

  const handleSubServiceContinue = () => {
    if (selectedSubService) {
      setFlowStep('property-selection');
    }
  };

  const handleOwnershipTypeSelect = (ownershipType: PropertyOwnership) => {
    setPropertyOwnership(ownershipType);
    if (ownershipType === 'own') {
      setFlowStep('property-selection');
    } else {
      setFlowStep('property-details');
    }
  };

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
  };

  const handleOwnPropertyContinue = () => {
    if (selectedProperty && selectedService) {
      const newCaseId = generateCaseId();
      setCaseId(newCaseId);
      
      // Create default milestones
      const defaultMilestones = [
        { id: '1', title: 'Case submitted', status: 'completed' as const, date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) },
        { id: '2', title: 'Documents reviewed', status: 'pending' as const },
        { id: '3', title: 'Partner assigned', status: 'pending' as const },
        { id: '4', title: 'Application filing', status: 'pending' as const },
        { id: '5', title: 'Authority follow-up', status: 'pending' as const },
        { id: '6', title: 'Case closed', status: 'pending' as const },
      ];
      
      // Create actual case in CasesContext
      addCase({
        serviceRequested: getServiceTypeName(selectedService),
        subService: selectedSubService as SubServiceType,
        propertyId: selectedProperty.id,
        propertyName: selectedProperty.name,
        propertyLocation: selectedProperty.location,
        status: 'Open',
        progress: 16, // 1 out of 6 milestones completed
        milestones: defaultMilestones,
      });
      
      setFlowStep('case-generated');
    }
  };

  const handleNonOwnPropertySubmit = () => {
    if (selectedService) {
      const newCaseId = generateCaseId();
      setCaseId(newCaseId);
      
      // Create default milestones
      const defaultMilestones = [
        { id: '1', title: 'Case submitted', status: 'completed' as const, date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) },
        { id: '2', title: 'Documents reviewed', status: 'pending' as const },
        { id: '3', title: 'Partner assigned', status: 'pending' as const },
        { id: '4', title: 'Application filing', status: 'pending' as const },
        { id: '5', title: 'Authority follow-up', status: 'pending' as const },
        { id: '6', title: 'Case closed', status: 'pending' as const },
      ];
      
      // Create actual case in CasesContext (without propertyId for non-owned properties)
      addCase({
        serviceRequested: getServiceTypeName(selectedService),
        subService: selectedSubService as SubServiceType,
        propertyName: nonOwnedPropertyData.propertyName,
        propertyLocation: nonOwnedPropertyData.propertyLocation,
        relationshipToProperty: nonOwnedPropertyData.relationship,
        status: 'Open',
        progress: 16, // 1 out of 6 milestones completed
        milestones: defaultMilestones,
      });
      
      setFlowStep('case-generated');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNonOwnedPropertyData({ ...nonOwnedPropertyData, supportingDocument: e.target.files[0] });
    }
  };

  const handleBackToServices = () => {
    setFlowStep('service-selection');
    setSelectedService(null);
    setPropertyOwnership(null);
    setSelectedProperty(null);
    setCaseId('');
    setNonOwnedPropertyData({
      relationship: '',
      ownerAuthorization: false,
      propertyName: '',
      propertyLocation: '',
      ownerName: '',
      supportingDocument: null,
      latitude: '',
      longitude: '',
    });
  };

  // Helper function to convert service ID to service type name
  const getServiceTypeName = (serviceId: ServiceType): CaseServiceType => {
    const serviceMap: Record<string, CaseServiceType> = {
      'habu-report': 'HABU Report',
      'property-service': 'Property Service',
      'lease-rent': 'Lease & Rent',
      'sell-liquidate': 'Sell or Liquidate',
    };
    return serviceMap[serviceId || ''] || 'Property Service';
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2] dark:bg-[#0a0a0a] transition-colors duration-300">
      <SideNav />
      
      {/* Header */}
      <div className="border-b border-black/5 dark:border-white/10 bg-white dark:bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {flowStep !== 'service-selection' && (
                <button 
                  onClick={handleBackToServices}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-black/60 dark:text-white/60"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <div>
                <div className="text-[10px] font-bold tracking-[0.05em] uppercase text-black/40 dark:text-white/50 mb-2">
                  Service Management
                </div>
                <div className="text-[24px] tracking-[-0.01em] text-black dark:text-white">
                  {flowStep === 'service-selection' && 'Select a Service'}
                  {flowStep === 'sub-service-selection' && 'Select a Sub-Service'}
                  {flowStep === 'ownership-type' && services.find(s => s.id === selectedService)?.name}
                  {flowStep === 'property-selection' && 'Choose Property'}
                  {flowStep === 'property-details' && 'Property Details'}
                  {flowStep === 'case-generated' && 'Request Submitted'}
                </div>
                <p className="text-[13px] text-black/60 dark:text-white/60 mt-0.5">
                  {flowStep === 'service-selection' && 'Choose the service that best fits your property needs'}
                  {flowStep === 'sub-service-selection' && 'Select a sub-service for detailed analysis'}
                  {flowStep === 'ownership-type' && 'Is this service for your own property or for a non-owned property?'}
                  {flowStep === 'property-selection' && 'Select which property you want to request this service for'}
                  {flowStep === 'property-details' && 'Provide the required information for service request'}
                  {flowStep === 'case-generated' && 'Your service request has been successfully created'}
                </p>
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
        
        {/* Service Selection */}
        {flowStep === 'service-selection' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {services.map((service) => {
                const Icon = service.icon;
                const isHovered = hoveredService === service.id;
                
                return (
                  <div
                    key={service.id}
                    onMouseEnter={() => setHoveredService(service.id)}
                    onMouseLeave={() => setHoveredService(null)}
                    onClick={() => navigate(`/service/${service.id}`)}
                    className="relative bg-white/90 dark:bg-[#111111]/90 backdrop-blur-[40px] rounded-[24px] p-8 cursor-pointer
                               shadow-[0_2px_4px_rgba(0,0,0,0.02),0_20px_40px_-5px_rgba(0,0,0,0.05)]
                               border border-white/60 dark:border-white/10
                               hover:shadow-[0_2px_4px_rgba(0,0,0,0.02),0_20px_60px_-5px_rgba(0,0,0,0.1)]
                               transition-all duration-300 hover:-translate-y-1 overflow-hidden group"
                  >
                    {/* Top subtle highlight */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent" />
                    
                    {/* Badge */}
                    {service.badge && (
                      <div className="absolute top-6 right-6">
                        <div className="px-3 py-1.5 bg-[#FFC700]/20 rounded-full border border-[#FFC700]/30">
                          <span className="text-[10px] font-bold tracking-[0.05em] uppercase text-[#FFC700]">
                            {service.badge}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-6 mb-6">
                      {/* Icon */}
                      <div className={`
                        w-16 h-16 rounded-[16px] flex items-center justify-center flex-shrink-0
                        bg-gradient-to-br ${service.color}
                        shadow-[0_8px_24px_rgba(0,0,0,0.15)]
                        ${isHovered ? 'scale-110' : 'scale-100'}
                        transition-transform duration-300
                      `}>
                        <Icon className="w-8 h-8 text-white" strokeWidth={1.5} />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="text-[18px] tracking-[-0.01em] text-black dark:text-white/95 mb-2">
                          {service.name}
                        </h3>
                        <p className="text-[14px] text-black/60 dark:text-white/60 leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="space-y-3">
                      {service.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-1 h-1 rounded-full bg-black/30 dark:bg-white/30 mt-2 flex-shrink-0" />
                          <span className="text-[13px] text-black/70 dark:text-white/70 leading-relaxed">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* View Details Button */}
                    <div className="mt-6 pt-6 border-t border-black/5 dark:border-white/10">
                      <div className="flex items-center justify-between gap-4">
                        <Link
                          to={`/service/${service.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-2 text-[13px] font-bold text-emerald-500 dark:text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors"
                        >
                          View Details
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                        <div className="text-[11px] text-black/40 dark:text-white/40">
                          Click card to request
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Info Card */}
            <div className="bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-blue-500/20 dark:border-blue-500/15 backdrop-blur-xl rounded-[24px] p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h4 className="text-[14px] text-black dark:text-white/95 mb-1">
                    Need help choosing?
                  </h4>
                  <p className="text-[13px] text-black/60 dark:text-white/60 leading-relaxed">
                    Our AI can recommend the best service based on your property details and investment goals. 
                    Contact our team for a personalized consultation.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Sub-Service Selection */}
        {flowStep === 'sub-service-selection' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="space-y-4">
              {services.find(s => s.id === selectedService)?.subServicesDetails?.map((subServiceDetail) => (
                <div
                  key={subServiceDetail.name}
                  onClick={() => handleSubServiceSelect(subServiceDetail.name)}
                  className={`
                    relative bg-white/90 dark:bg-[#111111]/90 backdrop-blur-[40px] rounded-[24px] p-6 cursor-pointer
                    shadow-[0_2px_4px_rgba(0,0,0,0.02),0_20px_40px_-5px_rgba(0,0,0,0.05)]
                    transition-all duration-300 overflow-hidden
                    ${selectedSubService === subServiceDetail.name
                      ? 'border-2 border-emerald-500 shadow-[0_8px_32px_rgba(16,185,129,0.2)]'
                      : 'border border-white/60 dark:border-white/10 hover:shadow-[0_2px_4px_rgba(0,0,0,0.02),0_20px_60px_-5px_rgba(0,0,0,0.1)] hover:-translate-y-0.5'
                    }
                  `}
                >
                  {/* Top subtle highlight */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent" />
                  
                  {selectedSubService === subServiceDetail.name && (
                    <div className="absolute top-6 right-6">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-[0_4px_12px_rgba(16,185,129,0.3)]">
                        <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={2.5} />
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 rounded-[14px] bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center flex-shrink-0 shadow-[0_8px_24px_rgba(16,185,129,0.2)]">
                      <Building2 className="w-7 h-7 text-white" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[16px] tracking-[-0.01em] text-black dark:text-white/95 mb-2 font-medium">
                        {subServiceDetail.name}
                      </div>
                      <div className="text-[13px] text-black/60 dark:text-white/60 mb-4 leading-relaxed">
                        {subServiceDetail.description}
                      </div>
                      
                      {/* ETA and Price Range */}
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 dark:bg-blue-500/20 rounded-lg border border-blue-500/20">
                          <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                          <span className="text-[11px] font-bold tracking-wider uppercase text-blue-700 dark:text-blue-400">
                            {subServiceDetail.eta}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-lg border border-emerald-500/20">
                          <IndianRupee className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-700 dark:text-emerald-400">
                            {subServiceDetail.priceRange}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button
                onClick={handleSubServiceContinue}
                disabled={!selectedSubService}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-[12px]
                           transition-all duration-300 text-[14px] font-bold tracking-tight
                           shadow-[0_8px_24px_rgba(16,185,129,0.25)] hover:shadow-[0_8px_32px_rgba(16,185,129,0.4)]
                           hover:-translate-y-0.5 active:translate-y-0
                           disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none
                           flex items-center justify-center gap-2"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Ownership Type Modal */}
        {flowStep === 'ownership-type' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={handleBackToServices}
            />
            
            {/* Modal */}
            <div className="relative bg-white/95 dark:bg-[#111111]/95 backdrop-blur-[60px] rounded-[24px] p-8 max-w-3xl w-full
                           shadow-[0_20px_80px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_80px_rgba(0,0,0,0.6)]
                           border border-white/60 dark:border-white/10 overflow-hidden
                           animate-in fade-in zoom-in-95 duration-300">
              {/* Top subtle highlight */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent" />
              
              {/* Close Button */}
              <button
                onClick={handleBackToServices}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10
                           flex items-center justify-center transition-all group"
              >
                <X className="w-5 h-5 text-black/40 dark:text-white/40 group-hover:text-black/70 dark:group-hover:text-white/70" />
              </button>

              {/* Header */}
              <div className="mb-8 text-center">
                <div className="text-[10px] font-bold tracking-[0.05em] uppercase text-black/40 dark:text-white/50 mb-3">
                  {services.find(s => s.id === selectedService)?.name}
                </div>
                <h2 className="text-[24px] tracking-[-0.01em] text-black dark:text-white/95 mb-2">
                  Select Property Type
                </h2>
                <p className="text-[13px] text-black/60 dark:text-white/60 leading-relaxed">
                  Is this service for your own property or for a non-owned property?
                </p>
              </div>

              {/* Options */}
              <div className="grid grid-cols-2 gap-6">
                <button
                  onClick={() => handleOwnershipTypeSelect('own')}
                  className="relative bg-white/90 dark:bg-[#0F0F0F]/90 backdrop-blur-[40px] rounded-[20px] p-8 text-left
                             shadow-[0_2px_4px_rgba(0,0,0,0.02),0_20px_40px_-5px_rgba(0,0,0,0.05)]
                             border border-white/60 dark:border-white/10
                             hover:shadow-[0_2px_4px_rgba(0,0,0,0.02),0_20px_60px_-5px_rgba(0,0,0,0.1)]
                             hover:border-[#FFC700]/30
                             transition-all duration-300 hover:-translate-y-1 overflow-hidden group"
                >
                  {/* Top subtle highlight */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent" />
                  
                  <div className="w-14 h-14 rounded-[14px] bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center mb-5 shadow-[0_8px_24px_rgba(16,185,129,0.2)] group-hover:scale-110 transition-transform">
                    <Building2 className="w-7 h-7 text-white" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-[18px] tracking-[-0.01em] text-black dark:text-white/95 mb-2">
                    Own Property
                  </h3>
                  <p className="text-[13px] text-black/60 dark:text-white/60 leading-relaxed">
                    Select from your existing properties
                  </p>
                </button>

                <button
                  onClick={() => handleOwnershipTypeSelect('non-own')}
                  className="relative bg-white/90 dark:bg-[#0F0F0F]/90 backdrop-blur-[40px] rounded-[20px] p-8 text-left
                             shadow-[0_2px_4px_rgba(0,0,0,0.02),0_20px_40px_-5px_rgba(0,0,0,0.05)]
                             border border-white/60 dark:border-white/10
                             hover:shadow-[0_2px_4px_rgba(0,0,0,0.02),0_20px_60px_-5px_rgba(0,0,0,0.1)]
                             hover:border-[#FFC700]/30
                             transition-all duration-300 hover:-translate-y-1 overflow-hidden group"
                >
                  {/* Top subtle highlight */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent" />
                  
                  <div className="w-14 h-14 rounded-[14px] bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-5 shadow-[0_8px_24px_rgba(59,130,246,0.2)] group-hover:scale-110 transition-transform">
                    <UserCheck className="w-7 h-7 text-white" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-[18px] tracking-[-0.01em] text-black dark:text-white/95 mb-2">
                    Non-Owned Property
                  </h3>
                  <p className="text-[13px] text-black/60 dark:text-white/60 leading-relaxed">
                    Provide property details and authorization
                  </p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Property Selection (Own Property) */}
        {flowStep === 'property-selection' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="space-y-4">
              {userProperties.map((property) => (
                <div
                  key={property.id}
                  onClick={() => handlePropertySelect(property)}
                  className={`
                    relative bg-white/90 dark:bg-[#111111]/90 backdrop-blur-[40px] rounded-[24px] p-6 cursor-pointer
                    shadow-[0_2px_4px_rgba(0,0,0,0.02),0_20px_40px_-5px_rgba(0,0,0,0.05)]
                    transition-all duration-300 overflow-hidden
                    ${selectedProperty?.id === property.id
                      ? 'border-2 border-[#FFC700] shadow-[0_8px_32px_rgba(255,199,0,0.2)]'
                      : 'border border-white/60 dark:border-white/10 hover:shadow-[0_2px_4px_rgba(0,0,0,0.02),0_20px_60px_-5px_rgba(0,0,0,0.1)] hover:-translate-y-0.5'
                    }
                  `}
                >
                  {/* Top subtle highlight */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent" />
                  
                  {selectedProperty?.id === property.id && (
                    <div className="absolute top-6 right-6">
                      <div className="w-8 h-8 rounded-full bg-[#FFC700] flex items-center justify-center shadow-[0_4px_12px_rgba(255,199,0,0.3)]">
                        <CheckCircle2 className="w-5 h-5 text-black" strokeWidth={2.5} />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-[14px] bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center flex-shrink-0 shadow-[0_8px_24px_rgba(16,185,129,0.2)]">
                      <Building2 className="w-7 h-7 text-white" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <div className="text-[16px] tracking-[-0.01em] text-black dark:text-white/95 mb-1">
                        {property.name}
                      </div>
                      <div className="text-[13px] text-black/50 dark:text-white/50">
                        {property.type} • {property.location}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button
                onClick={handleOwnPropertyContinue}
                disabled={!selectedProperty}
                className="w-full bg-[#FFC700] hover:bg-[#F2BD00] text-black py-4 rounded-[12px]
                           transition-all duration-300 text-[14px] font-bold tracking-tight
                           shadow-[0_8px_24px_rgba(255,199,0,0.25)] hover:shadow-[0_8px_32px_rgba(255,199,0,0.4)]
                           hover:-translate-y-0.5 active:translate-y-0
                           disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none
                           flex items-center justify-center gap-2"
              >
                Generate Case ID
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Property Details (Non-Owned Property) */}
        {flowStep === 'property-details' && propertyOwnership === 'non-own' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/90 dark:bg-[#111111]/90 backdrop-blur-[40px] rounded-[24px] p-8
                           shadow-[0_2px_4px_rgba(0,0,0,0.02),0_20px_40px_-5px_rgba(0,0,0,0.05)]
                           border border-white/60 dark:border-white/10 overflow-hidden">
              {/* Top subtle highlight */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent" />
              
              <div className="space-y-6">
                {/* Relationship to Property */}
                <div>
                  <label className="block text-[10px] font-bold tracking-[0.05em] uppercase text-black/40 dark:text-white/50 mb-3">
                    Relationship to Property <span className="text-[#FFC700]">*</span>
                  </label>
                  <select
                    value={nonOwnedPropertyData.relationship}
                    onChange={(e) => setNonOwnedPropertyData({ ...nonOwnedPropertyData, relationship: e.target.value })}
                    className="w-full bg-black/[0.02] dark:bg-black/30 border border-black/10 dark:border-white/10 
                               rounded-[12px] px-5 py-4 text-black dark:text-white/95 text-[14px] 
                               focus:outline-none focus:border-[#FFC700]/50 transition-all appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%238E8E93' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 1.25rem center'
                    }}
                  >
                    <option value="">Select relationship</option>
                    <option value="Family Member">Family Member</option>
                    <option value="Friend">Friend</option>
                    <option value="Business Associate">Business Associate</option>
                    <option value="Legal Representative">Legal Representative</option>
                    <option value="Property Manager">Property Manager</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Owner Authorization */}
                <div className="bg-blue-500/5 border border-blue-500/20 dark:border-blue-500/15 rounded-[16px] p-6">
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      id="ownerAuthorization"
                      checked={nonOwnedPropertyData.ownerAuthorization}
                      onChange={(e) => setNonOwnedPropertyData({ ...nonOwnedPropertyData, ownerAuthorization: e.target.checked })}
                      className="mt-0.5 w-5 h-5 rounded border-2 border-blue-500/30 text-[#FFC700] focus:ring-[#FFC700] focus:ring-offset-0 cursor-pointer"
                    />
                    <label htmlFor="ownerAuthorization" className="flex-1 cursor-pointer">
                      <div className="text-[14px] text-black dark:text-white/95 mb-1">
                        Owner Authorization Confirmation <span className="text-[#FFC700]">*</span>
                      </div>
                      <p className="text-[13px] text-black/60 dark:text-white/60 leading-relaxed">
                        I confirm that I have authorization from the property owner to request this service on their behalf
                      </p>
                    </label>
                  </div>
                </div>

                {/* Property Name */}
                <div>
                  <label className="block text-[10px] font-bold tracking-[0.05em] uppercase text-black/40 dark:text-white/50 mb-3">
                    Property Name <span className="text-[#FFC700]">*</span>
                  </label>
                  <input
                    type="text"
                    value={nonOwnedPropertyData.propertyName}
                    onChange={(e) => setNonOwnedPropertyData({ ...nonOwnedPropertyData, propertyName: e.target.value })}
                    placeholder="e.g., Skyline Apartments, Block B"
                    className="w-full bg-black/[0.02] dark:bg-black/30 border border-black/10 dark:border-white/10 
                               rounded-[12px] px-5 py-4 text-black dark:text-white/95 text-[14px] 
                               placeholder:text-black/30 dark:placeholder:text-white/30 
                               focus:outline-none focus:border-[#FFC700]/50 transition-all"
                  />
                </div>

                {/* Property Location */}
                <div>
                  <label className="block text-[10px] font-bold tracking-[0.05em] uppercase text-black/40 dark:text-white/50 mb-3">
                    Property Location <span className="text-[#FFC700]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={nonOwnedPropertyData.propertyLocation}
                      onChange={(e) => setNonOwnedPropertyData({ ...nonOwnedPropertyData, propertyLocation: e.target.value })}
                      placeholder="e.g., Koramangala, Bangalore"
                      className="w-full bg-black/[0.02] dark:bg-black/30 border border-black/10 dark:border-white/10 
                                 rounded-[12px] px-5 py-4 pr-12 text-black dark:text-white/95 text-[14px] 
                                 placeholder:text-black/30 dark:placeholder:text-white/30 
                                 focus:outline-none focus:border-[#FFC700]/50 transition-all"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <MapPin className="w-5 h-5 text-black/30 dark:text-white/30" />
                    </div>
                  </div>
                </div>

                {/* Map Pin Toggle */}
                <div>
                  <button
                    onClick={() => setShowMap(!showMap)}
                    className="flex items-center gap-2 bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 
                               border border-black/10 dark:border-white/10 rounded-[12px] px-4 py-3 text-[13px] 
                               text-black/70 dark:text-white/70 transition-all"
                  >
                    <Navigation className="w-4 h-4" />
                    {showMap ? 'Hide Map' : 'Pin on Map (Optional)'}
                  </button>
                  
                  {showMap && (
                    <div className="mt-4 bg-black/5 dark:bg-black/40 border border-black/10 dark:border-white/10 
                                   rounded-[16px] overflow-hidden flex items-center justify-center">
                      <PropertyLocationMap
                        latitude={nonOwnedPropertyData.latitude}
                        longitude={nonOwnedPropertyData.longitude}
                        onLocationSelect={(lat, lng) => setNonOwnedPropertyData({ 
                          ...nonOwnedPropertyData, 
                          latitude: lat.toFixed(6), 
                          longitude: lng.toFixed(6) 
                        })}
                      />
                    </div>
                  )}
                </div>

                {/* Owner Name */}
                <div>
                  <label className="block text-[10px] font-bold tracking-[0.05em] uppercase text-black/40 dark:text-white/50 mb-3">
                    Owner Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={nonOwnedPropertyData.ownerName}
                    onChange={(e) => setNonOwnedPropertyData({ ...nonOwnedPropertyData, ownerName: e.target.value })}
                    placeholder="e.g., Rajesh Kumar"
                    className="w-full bg-black/[0.02] dark:bg-black/30 border border-black/10 dark:border-white/10 
                               rounded-[12px] px-5 py-4 text-black dark:text-white/95 text-[14px] 
                               placeholder:text-black/30 dark:placeholder:text-white/30 
                               focus:outline-none focus:border-[#FFC700]/50 transition-all"
                  />
                </div>

                {/* Supporting Document */}
                <div>
                  <label className="block text-[10px] font-bold tracking-[0.05em] uppercase text-black/40 dark:text-white/50 mb-3">
                    Supporting Document (Optional)
                  </label>
                  <div className="border-2 border-dashed border-black/10 dark:border-white/10 rounded-[16px] p-8 text-center transition-colors hover:border-black/20 dark:hover:border-white/20">
                    <div className="w-12 h-12 rounded-[12px] bg-black/5 dark:bg-white/5 flex items-center justify-center mx-auto mb-3">
                      <Upload className="w-6 h-6 text-black/40 dark:text-white/40" />
                    </div>
                    <p className="text-[14px] text-black/70 dark:text-white/70 mb-2">
                      Upload authorization letter or proof of relationship
                    </p>
                    <label className="inline-block text-[13px] text-[#FFC700] cursor-pointer hover:text-[#F2BD00] transition-colors">
                      Browse files
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                    </label>
                    {nonOwnedPropertyData.supportingDocument && (
                      <div className="mt-3 flex items-center justify-center gap-2">
                        <FileCheck className="w-4 h-4 text-emerald-500" />
                        <span className="text-[12px] text-black/60 dark:text-white/60">
                          {nonOwnedPropertyData.supportingDocument.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/5">
                <button
                  onClick={handleNonOwnPropertySubmit}
                  disabled={!nonOwnedPropertyData.relationship || !nonOwnedPropertyData.ownerAuthorization || !nonOwnedPropertyData.propertyName || !nonOwnedPropertyData.propertyLocation}
                  className="w-full bg-[#FFC700] hover:bg-[#F2BD00] text-black py-4 rounded-[12px]
                             transition-all duration-300 text-[14px] font-bold tracking-tight
                             shadow-[0_8px_24px_rgba(255,199,0,0.25)] hover:shadow-[0_8px_32px_rgba(255,199,0,0.4)]
                             hover:-translate-y-0.5 active:translate-y-0
                             disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none
                             flex items-center justify-center gap-2"
                >
                  Generate Case ID
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Case Generated Success */}
        {flowStep === 'case-generated' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/90 dark:bg-[#111111]/90 backdrop-blur-[40px] rounded-[24px] p-12 text-center
                           shadow-[0_2px_4px_rgba(0,0,0,0.02),0_20px_40px_-5px_rgba(0,0,0,0.05)]
                           border border-white/60 dark:border-white/10 relative overflow-hidden">
              {/* Top subtle highlight */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent" />
              
              {/* Success Icon */}
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6
                             shadow-[0_8px_24px_rgba(16,185,129,0.15)]">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" strokeWidth={2} />
              </div>

              <h2 className="text-[24px] tracking-tight text-black dark:text-white mb-3">
                Case ID Generated
              </h2>
              <p className="text-[14px] text-black/60 dark:text-white/60 max-w-lg mx-auto leading-relaxed mb-8">
                Your service request has been created successfully. Our team will review and contact you shortly.
              </p>

              {/* Case ID Display */}
              <div className="bg-gradient-to-br from-emerald-500/5 to-green-500/5 border border-emerald-500/20 dark:border-emerald-500/15 rounded-[20px] p-8 mb-8">
                <div className="text-[10px] font-bold tracking-[0.05em] uppercase text-black/40 dark:text-white/40 mb-3">
                  Case ID
                </div>
                <div className="text-[32px] font-semibold tracking-tight text-black dark:text-white mb-6 font-mono">
                  {caseId}
                </div>
                <div className="grid grid-cols-2 gap-6 text-left">
                  <div>
                    <div className="text-[10px] font-bold tracking-[0.05em] uppercase text-black/40 dark:text-white/40 mb-2">
                      Service
                    </div>
                    <div className="text-[14px] text-black dark:text-white/95">
                      {services.find(s => s.id === selectedService)?.name}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold tracking-[0.05em] uppercase text-black/40 dark:text-white/40 mb-2">
                      Property Type
                    </div>
                    <div className="text-[14px] text-black dark:text-white/95">
                      {propertyOwnership === 'own' ? 'Own Property' : 'Non-Owned Property'}
                    </div>
                  </div>
                  {selectedProperty && (
                    <div className="col-span-2">
                      <div className="text-[10px] font-bold tracking-[0.05em] uppercase text-black/40 dark:text-white/40 mb-2">
                        Property
                      </div>
                      <div className="text-[14px] text-black dark:text-white/95">
                        {selectedProperty.name}
                      </div>
                    </div>
                  )}
                  {nonOwnedPropertyData.propertyName && (
                    <div className="col-span-2">
                      <div className="text-[10px] font-bold tracking-[0.05em] uppercase text-black/40 dark:text-white/40 mb-2">
                        Property
                      </div>
                      <div className="text-[14px] text-black dark:text-white/95">
                        {nonOwnedPropertyData.propertyName}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleBackToServices}
                  className="flex-1 bg-black/5 dark:bg-white/5 text-black/70 dark:text-white/70 
                             hover:bg-black/10 dark:hover:bg-white/10 px-8 py-4 rounded-[12px] 
                             text-[14px] font-bold tracking-tight transition-all"
                >
                  Request Another Service
                </button>
                <button
                  onClick={() => navigate('/properties')}
                  className="flex-1 bg-[#FFC700] hover:bg-[#F2BD00] text-black px-8 py-4 rounded-[12px]
                             transition-all duration-300 text-[14px] font-bold tracking-tight
                             shadow-[0_8px_24px_rgba(255,199,0,0.25)] hover:shadow-[0_8px_32px_rgba(255,199,0,0.4)]
                             hover:-translate-y-0.5 active:translate-y-0
                             flex items-center justify-center gap-2"
                >
                  Go to Case Management
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}