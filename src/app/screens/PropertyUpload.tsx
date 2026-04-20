import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Upload, FileText, CheckCircle2, AlertCircle, MapPin, Map as MapIcon, Info, Edit2, TrendingUp, Shield, Target, Navigation, Building2, Sparkles, Lock } from 'lucide-react';
import { Link } from 'react-router';
import { SideNav } from '../components/SideNav';
import { ThemeToggle } from '../components/ThemeToggle';
import { useProperties } from '../contexts/PropertiesContext';

type Step = 'details' | 'documents' | 'review';

interface UploadedDocument {
  id: string;
  name: string;
  size: string;
  status: 'uploading' | 'verified' | 'error';
  type: string;
  documentType?: string; // The type of document (e.g., "Sale Deed", "Khata Certificate")
}

interface PropertyData {
  name: string;
  buildingType: 'residential' | 'commercial' | 'industrial' | 'agricultural' | '';
  propertyType: string;
  plotSize: string;
  builtUpArea: string;
  yearOfConstruction: string;
  numberOfFloors: string;
  surveyNumber: string;
  currentUsage: string;
  rentalIncome: string;
  country: string;
  state: string;
  city: string;
  address: string;
  latitude: string;
  longitude: string;
  district: string;
  zoning: string;
}

interface ExtractedData {
  surveyNumber: string;
  landArea: string;
  landAreaUnit: string;
  ownershipType: string;
  zoningClassification: string;
  roadAccess: string;
  encumbranceStatus: string;
  utilitiesAvailability: string[];
  confidence: 'high' | 'medium' | 'needs-review';
}

export function PropertyUpload() {
  const navigate = useNavigate();
  const { addProperty } = useProperties();
  
  const [step, setStep] = useState<Step>('details');
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [reviewCategoryIndex, setReviewCategoryIndex] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDocument[]>([]);
  const [showMap, setShowMap] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);

  const [propertyData, setPropertyData] = useState<PropertyData>({
    name: '',
    buildingType: '',
    propertyType: '',
    plotSize: '',
    builtUpArea: '',
    yearOfConstruction: '',
    numberOfFloors: '',
    surveyNumber: '',
    currentUsage: '',
    rentalIncome: '',
    country: '',
    state: '',
    city: '',
    address: '',
    latitude: '',
    longitude: '',
    district: '',
    zoning: '',
  });

  const [extractedData, setExtractedData] = useState<ExtractedData>({
    surveyNumber: '42',
    landArea: '5000',
    landAreaUnit: 'sq ft',
    ownershipType: 'Freehold',
    zoningClassification: 'Residential',
    roadAccess: '30ft Arterial Road',
    encumbranceStatus: 'Clear',
    utilitiesAvailability: ['Water', 'Electricity', 'Sewage'],
    confidence: 'high',
  });

  // Property type options based on building type
  const propertyTypeOptions = {
    residential: [
      'Apartment',
      'Villa',
      'Plot',
      'Builder Floor',
      'Penthouse',
      'Independent House'
    ],
    commercial: [
      'Office Space',
      'Shop',
      'Land',
      'Office in IT/SEZ',
      'Showroom',
      'Warehouse',
      'Co-Working Space'
    ],
    industrial: [
      'Factory',
      'Warehouse',
      'Industrial Plot',
      'Manufacturing Unit'
    ],
    agricultural: [
      'Farmland',
      'Plantation',
      'Agricultural Land'
    ]
  };

  // Dynamic field configuration based on building type and property type
  const getFieldConfiguration = () => {
    const { buildingType, propertyType } = propertyData;
    
    // Default configuration
    const config = {
      plotSizeLabel: 'Plot Size',
      showBuiltUpArea: true,
      yearLabel: 'Year of Construction',
      showNumberOfFloors: true,
      currentUsageLabel: 'Current Usage',
      currentUsageOptions: [
        { value: 'Self-Occupied', label: 'Self-Occupied' },
        { value: 'Rented Out', label: 'Rented Out' },
        { value: 'Vacant', label: 'Vacant' }
      ]
    };

    // Plot/Land types (no construction, no floors, no built-up area)
    const isPlotType = propertyType === 'Plot' || propertyType === 'Land' || propertyType === 'Industrial Plot';
    
    // Agricultural properties
    const isAgricultural = buildingType === 'agricultural';
    
    // Warehouse (no floors)
    const isWarehouse = propertyType === 'Warehouse';

    if (isAgricultural) {
      config.plotSizeLabel = 'Land Area';
      config.showBuiltUpArea = false;
      config.yearLabel = 'Year of Acquisition';
      config.showNumberOfFloors = false;
      config.currentUsageLabel = 'Cultivation Type';
      config.currentUsageOptions = [
        { value: 'Cultivated', label: 'Cultivated' },
        { value: 'Fallow', label: 'Fallow' },
        { value: 'Plantation', label: 'Plantation' },
        { value: 'Mixed Cropping', label: 'Mixed Cropping' },
        { value: 'Vacant', label: 'Vacant' }
      ];
    } else if (isPlotType) {
      config.showBuiltUpArea = false;
      config.yearLabel = 'Year of Purchase';
      config.showNumberOfFloors = false;
      config.currentUsageOptions = [
        { value: 'Vacant', label: 'Vacant' },
        { value: 'Under Development', label: 'Under Development' },
        { value: 'Leased Out', label: 'Leased Out' }
      ];
    } else if (isWarehouse) {
      config.showNumberOfFloors = false;
      if (buildingType === 'commercial' || buildingType === 'industrial') {
        config.currentUsageOptions = [
          { value: 'Owner-Occupied', label: 'Owner-Occupied' },
          { value: 'Rented Out', label: 'Rented Out' },
          { value: 'Vacant', label: 'Vacant' }
        ];
      }
    } else if (buildingType === 'commercial' || buildingType === 'industrial') {
      config.currentUsageOptions = [
        { value: 'Owner-Occupied', label: 'Owner-Occupied' },
        { value: 'Rented Out', label: 'Rented Out' },
        { value: 'Vacant', label: 'Vacant' }
      ];
    } else if (buildingType === 'residential') {
      config.currentUsageOptions = [
        { value: 'Self-Occupied', label: 'Self-Occupied' },
        { value: 'Rented Out', label: 'Rented Out' },
        { value: 'Vacant', label: 'Vacant' }
      ];
    }

    return config;
  };

  // Document requirements - Categorized structure for all properties
  const getDocumentRequirements = () => {
    return {
      categories: {
        ownership: {
          title: 'Ownership',
          documents: ['Sale Deed', 'Khata Certificate', 'Khata Extract'],
          weight: 0.40 // 40% weight for scoring
        },
        legalCompliance: {
          title: 'Legal & Compliance',
          documents: ['Occupancy Certificate', 'Building Plan', 'Society NOC'],
          weight: 0.30 // 30% weight for scoring
        },
        landRecords: {
          title: 'Land Records',
          documents: ['Survey Sketch', 'Layout Plan', 'Conversion Certificate'],
          weight: 0.15 // 15% weight for scoring
        },
        financial: {
          title: 'Financial',
          documents: ['Property Tax Receipt', 'Lease Agreement'],
          weight: 0.15 // 15% weight for scoring
        },
        utilities: {
          title: 'Utilities (Exceptional)',
          documents: ['Electricity Bill', 'Water Bill'],
          weight: 0.0 // Exceptional, doesn't count towards core 100% score
        },
        supporting: {
          title: 'Supporting (Exceptional)',
          documents: ['Floor Plan', 'Property Photos'],
          weight: 0.0 // Exceptional, doesn't count towards core 100% score
        }
      },
      notes: 'Upload core documents to reach 100%. Utility and supporting documents are optional but recommended.'
    };
  };

  const documentRequirements = getDocumentRequirements();

  const requiredDocuments = [
    { type: 'sale-deed', label: 'Sale Deed', required: true },
    { type: 'khata-patta', label: 'Khata / Patta', required: true },
    { type: 'encumbrance', label: 'Encumbrance Certificate', required: true },
    { type: 'tax-receipts', label: 'Tax Receipts', required: false },
    { type: 'survey-sketch', label: 'Survey Sketch', required: false },
    { type: 'approved-layout', label: 'Approved Layout / Plan', required: false },
  ];

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFiles = (files: FileList, documentType?: string) => {
    // For demo purposes: Upload ALL documents at once when any file is selected
    const allDocuments: string[] = [];
    Object.values(documentRequirements.categories).forEach(category => {
      allDocuments.push(...category.documents);
    });
    
    const demoFilenames: Record<string, string> = {
      'Sale Deed': 'sale-deed-2024.pdf',
      'Khata Certificate': 'khata-certificate.pdf',
      'Khata Extract': 'khata-extract.pdf',
      'Occupancy Certificate': 'occupancy-certificate.pdf',
      'Building Plan': 'building-plan.pdf',
      'Society NOC': 'society-noc.pdf',
      'Survey Sketch': 'survey-sketch.pdf',
      'Layout Plan': 'layout-plan.pdf',
      'Conversion Certificate': 'conversion-certificate.pdf',
      'Property Tax Receipt': 'property-tax-receipt-2024.pdf',
      'Lease Agreement': 'lease-agreement.pdf',
      'Electricity Bill': 'electricity-bill.pdf',
      'Water Bill': 'water-bill.pdf',
      'Floor Plan': 'floor-plan.pdf',
      'Property Photos': 'property-photos.pdf',
    };
    
    const newDocs: UploadedDocument[] = allDocuments.map((doc, index) => ({
      id: `demo-${Date.now()}-${index}`,
      name: demoFilenames[doc] || `${doc.toLowerCase().replace(/\s+/g, '-')}.pdf`,
      size: `${(Math.random() * 3 + 1).toFixed(2)} MB`,
      status: 'uploading' as const,
      type: '',
      documentType: doc,
    }));

    setUploadedDocs(newDocs);

    // Simulate upload and verification for all documents
    newDocs.forEach((doc, index) => {
      setTimeout(() => {
        setUploadedDocs(prev => 
          prev.map(d => d.id === doc.id ? { ...d, status: 'verified' } : d)
        );
      }, 800 + index * 150);
    });
  };

  const handleExtractData = () => {
    // Skip extraction step and go directly to review
    setStep('review');
  };

  const handleLocationContinue = () => {
    // Simulate auto-detection of location details
    if (propertyData.address) {
      setPropertyData({
        ...propertyData,
        district: propertyData.district || 'Bangalore Urban',
        state: propertyData.state || 'Karnataka',
        zoning: propertyData.zoning || 'Residential',
      });
    }
    setStep('documents');
  };

  const handlePinOnMap = () => {
    setShowMap(true);
  };

  const handleMapClick = () => {
    // Simulate reverse geocoding from map coordinates
    setPropertyData({
      ...propertyData,
      latitude: '12.9716',
      longitude: '77.5946',
      country: 'India',
      state: 'Karnataka',
      city: 'Bangalore',
      address: 'Survey No. 42, Whitefield Main Road, Bangalore',
      district: 'Bangalore Urban',
    });
  };

  const getStepNumber = (stepName: Step): number => {
    const steps: Step[] = ['details', 'documents', 'review'];
    return steps.indexOf(stepName) + 1;
  };

  const currentStepNumber = getStepNumber(step);

  return (
    <div className="min-h-screen bg-[#F2F2F2] dark:bg-[#0F0F0F] transition-colors duration-300">
      <SideNav />
      
      {/* Header - Full Width */}
      <div className="border-b border-black/5 dark:border-white/10 bg-white dark:bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                to="/dashboard" 
                className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-black/60 dark:text-white/60"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div>
                <h1 className="text-[12px] tracking-wider uppercase text-black/40 dark:text-white/50 mb-2">
                  Upload
                </h1>
                <div className="text-[32px] tracking-tight text-black dark:text-white">
                  New Property Case
                </div>
                <p className="text-[14px] text-black/50 dark:text-white/60 mt-1">
                  Submit property details and documents for intelligent HABU analysis
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-[12px] text-black/40 dark:text-white/50 mb-1 tracking-wider uppercase">Step</div>
                <div className="text-[32px] tracking-tight text-black dark:text-white">{currentStepNumber}/3</div>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Progress Indicator */}
        <div className="mb-16">
          <div className="flex items-center gap-3">
            {(['details', 'documents', 'review'] as Step[]).map((stepName, index) => {
              const stepNum = index + 1;
              const isActive = stepNum === currentStepNumber;
              const isCompleted = stepNum < currentStepNumber;
              
              return (
                <div key={stepName} className="flex items-center flex-1">
                  <div className={`flex items-center gap-3 flex-1 ${
                    isActive ? 'opacity-100' : isCompleted ? 'opacity-60' : 'opacity-30'
                  }`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-medium transition-all ${
                      isActive 
                        ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg' 
                        : isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-black/5 dark:bg-white/5 text-black/40 dark:text-white/40'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : stepNum}
                    </div>
                    <div className="flex-1">
                      <div className={`text-[13px] tracking-wide ${isActive ? 'text-black dark:text-white/95' : 'text-black/50 dark:text-white/50'}`}>
                        {stepName === 'details' && 'Details'}
                        {stepName === 'documents' && 'Documents'}
                        {stepName === 'review' && 'Review'}
                      </div>
                    </div>
                  </div>
                  {index < 2 && (
                    <div className={`w-full h-px mx-3 ${
                      isCompleted ? 'bg-emerald-500/30' : 'bg-black/10 dark:bg-white/5'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 1: Location Details */}
        {step === 'details' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#1A1A1A] backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-2xl p-10 shadow-lg">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 dark:bg-gradient-to-br dark:from-emerald-500/20 dark:to-blue-500/20 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-[20px] tracking-tight text-black dark:text-white/95">
                    Property Details
                  </h2>
                  <p className="text-[13px] text-black/40 dark:text-white/40">
                    Provide essential property information to begin analysis
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                {/* Building Type - Card Selection */}
                <div>
                  <label className="block text-[13px] text-black/60 dark:text-white/60 mb-3 tracking-wide">
                    Building Type <span className="text-red-400">*</span>
                  </label>
                  <div className="flex gap-4 max-w-xl">
                    {/* Residential Card */}
                    <button
                      type="button"
                      onClick={() => setPropertyData({ ...propertyData, buildingType: 'residential', propertyType: '' })}
                      className={`relative p-6 rounded-[20px] border transition-all duration-300 group overflow-hidden w-64 ${
                        propertyData.buildingType === 'residential'
                          ? 'border-emerald-500/50 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/40 dark:to-emerald-900/20 shadow-xl shadow-emerald-500/20'
                          : 'border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5 hover:border-emerald-500/30 hover:bg-white/80 dark:hover:bg-white/10 hover:shadow-lg'
                      }`}
                    >
                      {/* Background Gradient Orb */}
                      <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl transition-opacity duration-300 ${
                        propertyData.buildingType === 'residential' ? 'opacity-30' : 'opacity-0 group-hover:opacity-10'
                      }`} style={{ background: 'radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, transparent 70%)' }} />
                      
                      {/* Selection Indicator */}
                      {propertyData.buildingType === 'residential' && (
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
                      )}
                      
                      <div className="relative z-10 flex flex-col items-start gap-5">
                        {/* Icon Container */}
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                          propertyData.buildingType === 'residential' 
                            ? 'bg-emerald-500/20 shadow-lg shadow-emerald-500/20' 
                            : 'bg-black/5 dark:bg-white/5 group-hover:bg-emerald-500/10'
                        }`}>
                          <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
                            <path 
                              d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" 
                              stroke={propertyData.buildingType === 'residential' ? '#10b981' : '#6b7280'}
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                              className="transition-colors duration-300"
                            />
                            <path 
                              d="M9 22V12H15V22" 
                              stroke={propertyData.buildingType === 'residential' ? '#10b981' : '#6b7280'}
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                              className="transition-colors duration-300"
                            />
                          </svg>
                        </div>
                        
                        {/* Text Content */}
                        <div className="text-left">
                          <h3 className={`text-[16px] font-semibold mb-2 transition-colors duration-300 ${
                            propertyData.buildingType === 'residential' 
                              ? 'text-emerald-700 dark:text-emerald-400' 
                              : 'text-black/80 dark:text-white/80 group-hover:text-black dark:group-hover:text-white'
                          }`}>
                            Residential
                          </h3>
                          <p className={`text-[12px] leading-relaxed transition-colors duration-300 ${
                            propertyData.buildingType === 'residential' 
                              ? 'text-emerald-600/80 dark:text-emerald-500/70' 
                              : 'text-black/50 dark:text-white/50 group-hover:text-black/70 dark:group-hover:text-white/70'
                          }`}>
                            Apartments, villas, houses & residential plots
                          </p>
                        </div>
                      </div>
                    </button>

                    {/* Commercial Card */}
                    <button
                      type="button"
                      onClick={() => setPropertyData({ ...propertyData, buildingType: 'commercial', propertyType: '' })}
                      className={`relative p-6 rounded-[20px] border transition-all duration-300 group overflow-hidden w-64 ${
                        propertyData.buildingType === 'commercial'
                          ? 'border-emerald-500/50 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/40 dark:to-emerald-900/20 shadow-xl shadow-emerald-500/20'
                          : 'border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5 hover:border-emerald-500/30 hover:bg-white/80 dark:hover:bg-white/10 hover:shadow-lg'
                      }`}
                    >
                      {/* Background Gradient Orb */}
                      <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl transition-opacity duration-300 ${
                        propertyData.buildingType === 'commercial' ? 'opacity-30' : 'opacity-0 group-hover:opacity-10'
                      }`} style={{ background: 'radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, transparent 70%)' }} />
                      
                      {/* Selection Indicator */}
                      {propertyData.buildingType === 'commercial' && (
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
                      )}

                      <div className="relative z-10 flex flex-col items-start gap-5">
                        {/* Icon Container */}
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                          propertyData.buildingType === 'commercial' 
                            ? 'bg-emerald-500/20 shadow-lg shadow-emerald-500/20' 
                            : 'bg-black/5 dark:bg-white/5 group-hover:bg-emerald-500/10'
                        }`}>
                          <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
                            <path 
                              d="M3 21H21M3 7V21M21 7V21M5 3H19L21 7H3L5 3Z" 
                              stroke={propertyData.buildingType === 'commercial' ? '#10b981' : '#6b7280'}
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                              className="transition-colors duration-300"
                            />
                            <path 
                              d="M9 11V17M12 11V17M15 11V17" 
                              stroke={propertyData.buildingType === 'commercial' ? '#10b981' : '#6b7280'}
                              strokeWidth="2" 
                              strokeLinecap="round"
                              className="transition-colors duration-300"
                            />
                          </svg>
                        </div>
                        
                        {/* Text Content */}
                        <div className="text-left">
                          <h3 className={`text-[16px] font-semibold mb-2 transition-colors duration-300 ${
                            propertyData.buildingType === 'commercial' 
                              ? 'text-emerald-700 dark:text-emerald-400' 
                              : 'text-black/80 dark:text-white/80 group-hover:text-black dark:group-hover:text-white'
                          }`}>
                            Commercial
                          </h3>
                          <p className={`text-[12px] leading-relaxed transition-colors duration-300 ${
                            propertyData.buildingType === 'commercial' 
                              ? 'text-emerald-600/80 dark:text-emerald-500/70' 
                              : 'text-black/50 dark:text-white/50 group-hover:text-black/70 dark:group-hover:text-white/70'
                          }`}>
                            Offices, retail spaces, warehouses & plots
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Property Type - Card Selection */}
                <div>
                  <label className="block text-[13px] text-black/60 dark:text-white/60 mb-3 tracking-wide">
                    Property Type <span className="text-red-400">*</span>
                  </label>
                  {!propertyData.buildingType ? (
                    <div className="w-full bg-black/[0.02] dark:bg-black/30 border border-black/10 dark:border-white/10 rounded-xl px-5 py-12 text-center">
                      <p className="text-[14px] text-black/30 dark:text-white/30">
                        Please select a building type first
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-4">
                      {propertyTypeOptions[propertyData.buildingType]?.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setPropertyData({ ...propertyData, propertyType: type })}
                          className={`relative p-5 rounded-[16px] border transition-all duration-300 group overflow-hidden text-left ${ 
                            propertyData.propertyType === type
                              ? 'border-emerald-500/50 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/40 dark:to-emerald-900/20 shadow-lg shadow-emerald-500/10'
                              : 'border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5 hover:border-emerald-500/30 hover:bg-white/80 dark:hover:bg-white/10 hover:shadow-md'
                          }`}
                        >
                          {/* Background Gradient Orb */}
                          <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl transition-opacity duration-300 ${ 
                            propertyData.propertyType === type ? 'opacity-30' : 'opacity-0 group-hover:opacity-10'
                          }`} style={{ background: 'radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, transparent 70%)' }} />
                          
                          {/* Selection Indicator */}
                          {propertyData.propertyType === type && (
                            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
                          )}
                          
                          <div className="relative z-10">
                            {/* Icon Container */}
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-all duration-300 ${ 
                              propertyData.propertyType === type
                                ? 'bg-emerald-500/20 shadow-md shadow-emerald-500/20'
                                : 'bg-black/5 dark:bg-white/5 group-hover:bg-emerald-500/10'
                            }`}>
                              <Building2 className={`w-5 h-5 transition-colors duration-300 ${ 
                                propertyData.propertyType === type
                                  ? 'text-emerald-500'
                                  : 'text-black/40 dark:text-white/40 group-hover:text-emerald-500/60'
                              }`} />
                            </div>
                            
                            {/* Text Content */}
                            <h3 className={`text-[14px] font-medium transition-colors duration-300 ${ 
                              propertyData.propertyType === type
                                ? 'text-emerald-700 dark:text-emerald-400'
                                : 'text-black/80 dark:text-white/80 group-hover:text-black dark:group-hover:text-white'
                            }`}>
                              {type}
                            </h3>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Property Name - Full Width */}
                <div>
                  <label className="block text-[13px] text-black/60 dark:text-white/60 mb-3 tracking-wide">
                    Property Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={propertyData.name}
                    onChange={(e) => setPropertyData({ ...propertyData, name: e.target.value })}
                    placeholder="e.g., Whitefield Prime Land"
                    className="w-full bg-black/[0.02] dark:bg-black/30 border border-black/10 dark:border-white/10 rounded-xl px-5 py-4 text-black dark:text-white/95 text-[14px] placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 focus:bg-black/[0.04] dark:focus:bg-black/40 transition-all"
                  />
                  <p className="text-[12px] text-black/30 dark:text-white/30 mt-2">
                    Give your property a memorable name for easy identification
                  </p>
                </div>

                {/* Additional Property Details - 2 Column Grid */}
                <div className="grid grid-cols-2 gap-6">
                  {(() => {
                    const fieldConfig = getFieldConfiguration();
                    
                    return (
                      <>
                        {/* Plot Size / Land Area */}
                        <div>
                          <label className="block text-[13px] text-black/60 dark:text-white/60 mb-3 tracking-wide">
                            {fieldConfig.plotSizeLabel}
                          </label>
                          <input
                            type="text"
                            value={propertyData.plotSize}
                            onChange={(e) => setPropertyData({ ...propertyData, plotSize: e.target.value })}
                            placeholder="e.g., 5000 sq ft"
                            className="w-full bg-black/[0.02] dark:bg-black/30 border border-black/10 dark:border-white/10 rounded-xl px-5 py-4 text-black dark:text-white/95 text-[14px] placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 focus:bg-black/[0.04] dark:focus:bg-black/40 transition-all"
                          />
                          <p className="text-[11px] text-black/30 dark:text-white/30 mt-2">
                            Purpose: HABU calculation
                          </p>
                        </div>

                        {/* Built-up Area - Conditionally rendered */}
                        {fieldConfig.showBuiltUpArea && (
                          <div>
                            <label className="block text-[13px] text-black/60 dark:text-white/60 mb-3 tracking-wide">
                              Built-up Area
                            </label>
                            <input
                              type="text"
                              value={propertyData.builtUpArea}
                              onChange={(e) => setPropertyData({ ...propertyData, builtUpArea: e.target.value })}
                              placeholder="e.g., 3000 sq ft"
                              className="w-full bg-black/[0.02] dark:bg-black/30 border border-black/10 dark:border-white/10 rounded-xl px-5 py-4 text-black dark:text-white/95 text-[14px] placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 focus:bg-black/[0.04] dark:focus:bg-black/40 transition-all"
                            />
                            <p className="text-[11px] text-black/30 dark:text-white/30 mt-2">
                              Purpose: Development potential
                            </p>
                          </div>
                        )}

                        {/* Year of Construction / Purchase / Acquisition */}
                        <div>
                          <label className="block text-[13px] text-black/60 dark:text-white/60 mb-3 tracking-wide">
                            {fieldConfig.yearLabel}
                          </label>
                          <select
                            value={propertyData.yearOfConstruction}
                            onChange={(e) => setPropertyData({ ...propertyData, yearOfConstruction: e.target.value })}
                            className="w-full bg-black/[0.02] dark:bg-black/30 border border-black/10 dark:border-white/10 rounded-xl px-5 py-4 text-black dark:text-white/95 text-[14px] focus:outline-none focus:border-emerald-500/50 focus:bg-black/[0.04] dark:focus:bg-black/40 transition-all appearance-none cursor-pointer"
                            style={{
                              backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%238E8E93' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                              backgroundRepeat: 'no-repeat',
                              backgroundPosition: 'right 1.25rem center'
                            }}
                          >
                            <option value="" disabled>Select year</option>
                            {Array.from({ length: new Date().getFullYear() - 1899 }, (_, i) => new Date().getFullYear() - i).map(year => (
                              <option key={year} value={year}>{year}</option>
                            ))}
                          </select>
                          <p className="text-[11px] text-black/30 dark:text-white/30 mt-2">
                            Purpose: {fieldConfig.yearLabel === 'Year of Construction' ? 'Redevelopment feasibility' : 'Ownership history'}
                          </p>
                        </div>

                        {/* Number of Floors - Conditionally rendered */}
                        {fieldConfig.showNumberOfFloors && (
                          <div>
                            <label className="block text-[13px] text-black/60 dark:text-white/60 mb-3 tracking-wide">
                              Number of Floors
                            </label>
                            <input
                              type="text"
                              value={propertyData.numberOfFloors}
                              onChange={(e) => setPropertyData({ ...propertyData, numberOfFloors: e.target.value })}
                              placeholder="e.g., G+2"
                              className="w-full bg-black/[0.02] dark:bg-black/30 border border-black/10 dark:border-white/10 rounded-xl px-5 py-4 text-black dark:text-white/95 text-[14px] placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 focus:bg-black/[0.04] dark:focus:bg-black/40 transition-all"
                            />
                            <p className="text-[11px] text-black/30 dark:text-white/30 mt-2">
                              Purpose: Density evaluation
                            </p>
                          </div>
                        )}

                        {/* Survey Number */}
                        <div>
                          <label className="block text-[13px] text-black/60 dark:text-white/60 mb-3 tracking-wide">
                            Survey Number
                          </label>
                          <input
                            type="text"
                            value={propertyData.surveyNumber}
                            onChange={(e) => setPropertyData({ ...propertyData, surveyNumber: e.target.value })}
                            placeholder="e.g., 42/1A"
                            className="w-full bg-black/[0.02] dark:bg-black/30 border border-black/10 dark:border-white/10 rounded-xl px-5 py-4 text-black dark:text-white/95 text-[14px] placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 focus:bg-black/[0.04] dark:focus:bg-black/40 transition-all"
                          />
                          <p className="text-[11px] text-black/30 dark:text-white/30 mt-2">
                            Purpose: Land registry lookup
                          </p>
                        </div>

                        {/* Current Usage / Cultivation Type */}
                        <div>
                          <label className="block text-[13px] text-black/60 dark:text-white/60 mb-3 tracking-wide">
                            {fieldConfig.currentUsageLabel}
                          </label>
                          <select
                            value={propertyData.currentUsage}
                            onChange={(e) => setPropertyData({ ...propertyData, currentUsage: e.target.value })}
                            className="w-full bg-black/[0.02] dark:bg-black/30 border border-black/10 dark:border-white/10 rounded-xl px-5 py-4 text-black dark:text-white/95 text-[14px] focus:outline-none focus:border-emerald-500/50 focus:bg-black/[0.04] dark:focus:bg-black/40 transition-all appearance-none cursor-pointer"
                            style={{
                              backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%238E8E93' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                              backgroundRepeat: 'no-repeat',
                              backgroundPosition: 'right 1.25rem center'
                            }}
                          >
                            <option value="" disabled>Select {fieldConfig.currentUsageLabel.toLowerCase()}</option>
                            {fieldConfig.currentUsageOptions.map((option) => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                          <p className="text-[11px] text-black/30 dark:text-white/30 mt-2">
                            Purpose: {fieldConfig.currentUsageLabel === 'Cultivation Type' ? 'Agricultural classification' : 'Usage classification'}
                          </p>
                        </div>

                        {/* Rental Income */}
                        <div>
                          <label className="block text-[13px] text-black/60 dark:text-white/60 mb-3 tracking-wide">
                            Rental Income
                          </label>
                          <input
                            type="text"
                            value={propertyData.rentalIncome}
                            onChange={(e) => setPropertyData({ ...propertyData, rentalIncome: e.target.value })}
                            placeholder="e.g., ₹50,000/month"
                            className="w-full bg-black/[0.02] dark:bg-black/30 border border-black/10 dark:border-white/10 rounded-xl px-5 py-4 text-black dark:text-white/95 text-[14px] placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 focus:bg-black/[0.04] dark:focus:bg-black/40 transition-all"
                          />
                          <p className="text-[11px] text-black/30 dark:text-white/30 mt-2">
                            Purpose: Yield estimation
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </div>



                {/* Pin on Map */}
                <div>
                  <button
                    onClick={handlePinOnMap}
                    className="flex items-center gap-2 bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 rounded-lg px-4 py-3 text-[14px] text-black/80 dark:text-white/80 transition-all"
                  >
                    <Navigation className="w-4 h-4" />
                    Pin on Interactive Map
                  </button>
                  
                  {showMap && (
                    <div 
                      onClick={handleMapClick}
                      className="mt-4 bg-black/5 dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-xl overflow-hidden h-64 flex items-center justify-center cursor-pointer hover:border-emerald-500/30 transition-all group"
                    >
                      <div className="text-center">
                        <MapIcon className="w-12 h-12 text-black/20 dark:text-white/20 group-hover:text-emerald-400 mx-auto mb-3 transition-colors" />
                        <p className="text-[13px] text-black/40 dark:text-white/40 group-hover:text-emerald-400 transition-colors">Interactive map will load here</p>
                        <p className="text-[11px] text-emerald-400 mt-2">📍 Click anywhere on the map to set location</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Country, State, City - 3 Column Grid */}
                <div className="grid grid-cols-3 gap-6">
                  {/* Country */}
                  <div>
                    <label className="block text-[13px] text-black/60 dark:text-white/60 mb-3 tracking-wide">
                      Country <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={propertyData.country}
                      onChange={(e) => setPropertyData({ ...propertyData, country: e.target.value })}
                      placeholder="e.g., India"
                      className="w-full bg-black/[0.02] dark:bg-black/30 border border-black/10 dark:border-white/10 rounded-xl px-5 py-4 text-black dark:text-white/95 text-[14px] placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 focus:bg-black/[0.04] dark:focus:bg-black/40 transition-all"
                    />
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-[13px] text-black/60 dark:text-white/60 mb-3 tracking-wide">
                      State <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={propertyData.state}
                      onChange={(e) => setPropertyData({ ...propertyData, state: e.target.value })}
                      placeholder="e.g., Karnataka"
                      className="w-full bg-black/[0.02] dark:bg-black/30 border border-black/10 dark:border-white/10 rounded-xl px-5 py-4 text-black dark:text-white/95 text-[14px] placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 focus:bg-black/[0.04] dark:focus:bg-black/40 transition-all"
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-[13px] text-black/60 dark:text-white/60 mb-3 tracking-wide">
                      City <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={propertyData.city}
                      onChange={(e) => setPropertyData({ ...propertyData, city: e.target.value })}
                      placeholder="e.g., Bangalore"
                      className="w-full bg-black/[0.02] dark:bg-black/30 border border-black/10 dark:border-white/10 rounded-xl px-5 py-4 text-black dark:text-white/95 text-[14px] placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 focus:bg-black/[0.04] dark:focus:bg-black/40 transition-all"
                    />
                  </div>
                </div>

                {/* Address Search */}
                <div>
                  <label className="block text-[13px] text-black/60 dark:text-white/60 mb-3 tracking-wide">
                    Property Address <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={propertyData.address}
                      onChange={(e) => setPropertyData({ ...propertyData, address: e.target.value })}
                      placeholder="e.g., Survey No. 42, Whitefield Main Road"
                      className="w-full bg-black/[0.02] dark:bg-black/30 border border-black/10 dark:border-white/10 rounded-xl px-5 py-4 text-black dark:text-white/95 text-[14px] placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 focus:bg-black/[0.04] dark:focus:bg-black/40 transition-all"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <MapPin className="w-5 h-5 text-black/30 dark:text-white/30" />
                    </div>
                  </div>
                  <p className="text-[12px] text-black/30 dark:text-white/30 mt-2">
                    Street address, survey number, or landmark
                  </p>
                </div>

                {/* Coordinates (Optional) */}
                <div>
                  <label className="block text-[13px] text-black/60 dark:text-white/60 mb-3 tracking-wide">
                    Have coordinates? Enter here (optional)
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={propertyData.latitude}
                      onChange={(e) => setPropertyData({ ...propertyData, latitude: e.target.value })}
                      placeholder="Latitude (e.g., 12.9716)"
                      className="bg-black/[0.02] dark:bg-black/30 border border-black/10 dark:border-white/10 rounded-xl px-5 py-4 text-black dark:text-white/95 text-[14px] placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 transition-all"
                    />
                    <input
                      type="text"
                      value={propertyData.longitude}
                      onChange={(e) => setPropertyData({ ...propertyData, longitude: e.target.value })}
                      placeholder="Longitude (e.g., 77.5946)"
                      className="bg-black/[0.02] dark:bg-black/30 border border-black/10 dark:border-white/10 rounded-xl px-5 py-4 text-black dark:text-white/95 text-[14px] placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 transition-all"
                    />
                  </div>
                </div>

                {/* Auto-detected Info */}
                {(propertyData.latitude && propertyData.longitude) && (
                  <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[13px] text-black dark:text-white/95 mb-1">Location Pinned Successfully</div>
                        <p className="text-[12px] text-black/50 dark:text-white/50">
                          Address details auto-populated from map coordinates
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <div className="text-[11px] text-black/40 dark:text-white/40 mb-1 tracking-wider uppercase">Country</div>
                        <div className="text-[14px] text-black dark:text-white/95">{propertyData.country}</div>
                      </div>
                      <div>
                        <div className="text-[11px] text-black/40 dark:text-white/40 mb-1 tracking-wider uppercase">State</div>
                        <div className="text-[14px] text-black dark:text-white/95">{propertyData.state}</div>
                      </div>
                      <div>
                        <div className="text-[11px] text-black/40 dark:text-white/40 mb-1 tracking-wider uppercase">City</div>
                        <div className="text-[14px] text-black dark:text-white/95">{propertyData.city}</div>
                      </div>
                      <div>
                        <div className="text-[11px] text-black/40 dark:text-white/40 mb-1 tracking-wider uppercase">District</div>
                        <div className="text-[14px] text-black dark:text-white/95">{propertyData.district}</div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-emerald-500/10">
                      <div className="text-[11px] text-black/40 dark:text-white/40 mb-1 tracking-wider uppercase">Coordinates</div>
                      <div className="text-[13px] text-black/70 dark:text-white/70 font-mono">
                        {propertyData.latitude}, {propertyData.longitude}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-8 border-t border-black/5 dark:border-white/5 flex justify-end">
                <button
                  onClick={handleLocationContinue}
                  disabled={!propertyData.name || !propertyData.propertyType || !propertyData.country || !propertyData.state || !propertyData.city || !propertyData.address}
                  className="bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 px-8 py-4 rounded-xl text-[14px] font-medium tracking-wide disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg disabled:shadow-none"
                >
                  Continue to Documents
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Upload Documents */}
        {step === 'documents' && (
          <div className="space-y-6">
            {/* Document Requirements - Compact */}
            <div className="bg-white/85 dark:bg-[#1A1A1A]/85 backdrop-blur-[30px] border border-black/5 dark:border-white/10 rounded-[24px] p-8 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_20px_40px_-5px_rgba(0,0,0,0.05)] relative overflow-hidden">
              {/* Subtle glass highlight */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent" />
              
              {/* Header with Integrated Score Ring */}
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-[12px] bg-blue-500/10 flex items-center justify-center flex-shrink-0 shadow-inner">
                    <FileText className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    {/* Property Type Header */}
                    <div className="mb-4">
                      <h3 className="text-[24px] font-normal tracking-[-0.01em] text-black dark:text-white/95 mb-2">
                        {propertyData.buildingType === 'residential' ? 'Residential' : 'Commercial'} {propertyData.propertyType}
                      </h3>
                      <p className="text-[14px] font-normal text-black/60 dark:text-white/60 leading-relaxed">
                        Submit documentation for comprehensive due diligence and institutional-grade analysis. 
                        All files are encrypted and securely stored in your AI Vault with automatic backup.
                      </p>
                    </div>

                    {/* Security Features Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div className="flex items-center gap-2 bg-white/85 dark:bg-white/[0.03] backdrop-blur-[20px] border border-white/40 dark:border-white/[0.08] rounded-[12px] px-3 py-2.5 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_20px_40px_-5px_rgba(0,0,0,0.05)]">
                        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500/10">
                          <Shield className="w-3.5 h-3.5 text-emerald-500" strokeWidth={2} />
                        </div>
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-[0.05em] text-black/40 dark:text-white/40">Security</div>
                          <div className="text-[12px] font-medium text-black dark:text-white/90">Bank-Grade</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 bg-white/85 dark:bg-white/[0.03] backdrop-blur-[20px] border border-white/40 dark:border-white/[0.08] rounded-[12px] px-3 py-2.5 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_20px_40px_-5px_rgba(0,0,0,0.05)]">
                        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-purple-500/10">
                          <Sparkles className="w-3.5 h-3.5 text-purple-500" strokeWidth={2} />
                        </div>
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-[0.05em] text-black/40 dark:text-white/40">Storage</div>
                          <div className="text-[12px] font-medium text-black dark:text-white/90">AI Vault</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 bg-white/85 dark:bg-white/[0.03] backdrop-blur-[20px] border border-white/40 dark:border-white/[0.08] rounded-[12px] px-3 py-2.5 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_20px_40px_-5px_rgba(0,0,0,0.05)]">
                        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-500/10">
                          <Lock className="w-3.5 h-3.5 text-blue-500" strokeWidth={2} />
                        </div>
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-[0.05em] text-black/40 dark:text-white/40">Privacy</div>
                          <div className="text-[12px] font-medium text-black dark:text-white/90">Encrypted</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 bg-white/85 dark:bg-white/[0.03] backdrop-blur-[20px] border border-white/40 dark:border-white/[0.08] rounded-[12px] px-3 py-2.5 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_20px_40px_-5px_rgba(0,0,0,0.05)]">
                        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-indigo-500/10">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" strokeWidth={2} />
                        </div>
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-[0.05em] text-black/40 dark:text-white/40">Backup</div>
                          <div className="text-[12px] font-medium text-black dark:text-white/90">Automatic</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Score Ring moved to top right */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-full border-[3px] border-black/5 dark:border-white/5 flex items-center justify-center relative shadow-inner bg-white/50 dark:bg-black/50">
                    {(() => {
                      let totalScore = 0;
                      Object.entries(documentRequirements.categories).forEach(([key, cat]) => {
                        const uploaded = cat.documents.filter(doc => 
                          uploadedDocs.find(d => d.documentType === doc && d.status === 'verified')
                        ).length;
                        const categoryCompletion = uploaded / cat.documents.length;
                        totalScore += categoryCompletion * (cat.weight * 100);
                      });
                      const currentScore = Math.round(totalScore);
                      return (
                        <>
                          <svg className="absolute inset-0 w-full h-full -rotate-90 scale-[1.05]" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="46" className="stroke-emerald-500 transition-all duration-1000" strokeWidth="6" fill="none" strokeDasharray="289.02" strokeDashoffset={289.02 - (289.02 * currentScore) / 100} strokeLinecap="round" />
                          </svg>
                          <span className="text-[13px] font-bold text-emerald-600 dark:text-emerald-400">{currentScore}%</span>
                        </>
                      );
                    })()}
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-[0.05em] text-black/40 dark:text-white/40">Document Score</span>
                </div>
              </div>

              {/* Stepper Navigation */}
              <div className="flex items-center gap-6 mb-8 border-b border-black/5 dark:border-white/10 overflow-x-auto scrollbar-hide">
                {Object.entries(documentRequirements.categories).map(([key, cat], idx) => {
                  const uploaded = cat.documents.filter(doc => 
                    uploadedDocs.find(d => d.documentType === doc && d.status === 'verified')
                  ).length;
                  const isComplete = uploaded === cat.documents.length;
                  const isActive = activeCategoryIndex === idx;
                  
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveCategoryIndex(idx)}
                      className={`flex items-center gap-2 pb-3 border-b-2 transition-colors whitespace-nowrap relative top-[1px] ${
                        isActive 
                          ? 'border-emerald-500 text-black dark:text-white' 
                          : isComplete
                            ? 'border-transparent text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white'
                            : 'border-transparent text-black/40 dark:text-white/40 hover:text-black/70 dark:hover:text-white/70'
                      }`}
                    >
                      <span className={`text-[13px] tracking-wide ${isActive ? 'font-semibold' : 'font-medium'}`}>
                        {cat.title}
                      </span>
                      {isComplete && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                    </button>
                  );
                })}
              </div>

              {/* Active Category Content */}
              <div className="space-y-6">
                {(() => {
                  const [categoryKey, category] = Object.entries(documentRequirements.categories)[activeCategoryIndex];
                  const totalDocs = category.documents.length;
                  const uploadedCount = category.documents.filter(doc => 
                    uploadedDocs.find(d => d.documentType === doc && d.status === 'verified')
                  ).length;
                  const completionPercentage = Math.round((uploadedCount / totalDocs) * 100);
                  const isComplete = completionPercentage === 100;
                  
                  // Category colors
                  const categoryColors: Record<string, { bg: string; text: string; border: string; dot: string }> = {
                    ownership: { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/20', dot: 'bg-emerald-500' },
                    legalCompliance: { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500/20', dot: 'bg-blue-500' },
                    landRecords: { bg: 'bg-purple-500/10', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-500/20', dot: 'bg-purple-500' },
                    financial: { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/20', dot: 'bg-amber-500' },
                    utilities: { bg: 'bg-cyan-500/10', text: 'text-cyan-600 dark:text-cyan-400', border: 'border-cyan-500/20', dot: 'bg-cyan-500' },
                    supporting: { bg: 'bg-pink-500/10', text: 'text-pink-600 dark:text-pink-400', border: 'border-pink-500/20', dot: 'bg-pink-500' },
                  };
                  
                  const colors = categoryColors[categoryKey] || categoryColors.ownership;
                  
                  return (
                    <div key={categoryKey} className="p-6 rounded-[16px] bg-white/40 dark:bg-black/20 border border-white/60 dark:border-white/5 shadow-sm relative overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
                      {isComplete && <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />}
                      
                      {/* Section Header */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${colors.dot} shadow-[0_0_8px_currentColor]`} />
                          <span className={`text-[12px] uppercase tracking-[0.05em] font-bold text-black dark:text-white`}>
                            {category.title} Documents
                          </span>
                          <div className="flex-1 w-12 h-px bg-gradient-to-r from-black/5 to-transparent dark:from-white/5" />
                        </div>
                        {/* Completion Badge */}
                        <div className={`px-2.5 py-1 rounded-[4px] text-[10px] font-bold uppercase tracking-[0.05em] ${
                          isComplete 
                            ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                            : `${colors.bg} ${colors.text} border ${colors.border}`
                        }`}>
                          {isComplete ? '✔ Complete' : `${completionPercentage}%`}
                        </div>
                      </div>
                      
                      {/* Documents */}
                      <div className="space-y-4">
                        {category.documents.map((doc, index) => {
                          const uploadedDoc = uploadedDocs.find(d => d.documentType === doc && d.status === 'verified');
                          const uploaded = !!uploadedDoc;
                          return (
                            <div key={index}>
                              <label className="block text-[13px] font-medium text-black/80 dark:text-white/80 mb-2 tracking-wide">
                                {doc}
                              </label>
                              <div className={`relative border rounded-[12px] transition-all duration-300 overflow-hidden ${
                                uploaded 
                                  ? 'border-solid border-emerald-500/30 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.05)]' 
                                  : 'border-dashed border-black/15 dark:border-white/15 bg-white/50 dark:bg-black/20 hover:border-emerald-500/40 hover:bg-emerald-500/5 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                              }`}>
                                <label className="flex items-center justify-between p-4 cursor-pointer group">
                                  <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-[8px] flex items-center justify-center transition-all duration-300 ${
                                      uploaded 
                                        ? 'bg-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.2)]' 
                                        : 'bg-black/5 dark:bg-white/5 group-hover:bg-emerald-500/10'
                                    }`}>
                                      {uploaded ? (
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500" strokeWidth={2.5} />
                                      ) : (
                                        <Upload className="w-5 h-5 text-black/40 dark:text-white/40 group-hover:text-emerald-500/70 transition-colors" />
                                      )}
                                    </div>
                                    <div>
                                      <p className={`text-[14px] font-semibold mb-0.5 transition-colors ${
                                        uploaded 
                                          ? 'text-emerald-600 dark:text-emerald-400' 
                                          : 'text-black/80 dark:text-white/80 group-hover:text-black dark:group-hover:text-white'
                                      }`}>
                                        {uploaded ? '✓ Document uploaded successfully' : 'Upload document'}
                                      </p>
                                      <p className="text-[12px] text-black/50 dark:text-white/50">
                                        {uploaded && uploadedDoc ? uploadedDoc.name + ' • ' + uploadedDoc.size : 'PDF, JPG, PNG • Max 10MB'}
                                      </p>
                                    </div>
                                  </div>
                                  {!uploaded && (
                                    <div className="px-3.5 py-1.5 rounded-[6px] bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-all duration-300">
                                      <span className="text-[12px] font-medium text-black/70 dark:text-white/70 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                        Choose file
                                      </span>
                                    </div>
                                  )}
                                  <input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={(e) => e.target.files && handleFiles(e.target.files, doc)}
                                    className="hidden"
                                  />
                                </label>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </div>
              
              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/10 flex items-center justify-between">
                {activeCategoryIndex > 0 ? (
                  <button
                    onClick={() => setActiveCategoryIndex(prev => prev - 1)}
                    className="text-black/60 dark:text-white/60 hover:text-black/90 dark:hover:text-white/90 text-[13px] font-medium tracking-wide transition-colors flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous Section
                  </button>
                ) : (
                  <button
                    onClick={() => setStep('details')}
                    className="text-black/60 dark:text-white/60 hover:text-black/90 dark:hover:text-white/90 text-[13px] font-medium tracking-wide transition-colors flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Details
                  </button>
                )}
                
                {activeCategoryIndex < Object.keys(documentRequirements.categories).length - 1 ? (
                  <button
                    onClick={() => setActiveCategoryIndex(prev => prev + 1)}
                    className="bg-black/5 dark:bg-white/10 text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/20 px-6 py-2.5 rounded-[10px] text-[13px] font-semibold tracking-wide transition-all flex items-center gap-2"
                  >
                    Next Section
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </button>
                ) : (
                  <button
                    onClick={handleExtractData}
                    disabled={uploadedDocs.filter(d => d.status === 'verified' && documentRequirements.categories.ownership.documents.includes(d.documentType || '')).length < documentRequirements.categories.ownership.documents.length}
                    className="bg-emerald-500 text-white hover:bg-emerald-400 px-8 py-3.5 rounded-[12px] text-[14px] font-semibold tracking-wide disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.3)] disabled:shadow-none flex items-center gap-2 group"
                  >
                    Continue to Review
                    <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Investment Review Summary */}
        {step === 'review' && (
          <div className="space-y-8">
            {/* Hero Header */}


            {/* Main Content - Single Column Layout */}
            <div className="space-y-6">
              {/* Property Overview Card */}
              <div className="bg-white/90 dark:bg-[#1A1A1A]/90 backdrop-blur-[40px] rounded-[24px] border border-white/40 dark:border-white/10 p-8 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_20px_40px_-5px_rgba(0,0,0,0.05)] relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h3 className="text-[16px] tracking-tight text-black dark:text-white/95">Location Snapshot</h3>
                  </div>

                  {/* Mini Map Preview */}
                  <div className="bg-black/5 dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-xl overflow-hidden h-48 mb-6 flex items-center justify-center">
                    <div className="text-center">
                      <MapIcon className="w-10 h-10 text-black/20 dark:text-white/20 mx-auto mb-2" />
                      <p className="text-[12px] text-black/30 dark:text-white/30">Map Preview: {propertyData.address || 'Whitefield, Bangalore'}</p>
                      {propertyData.latitude && propertyData.longitude && (
                        <p className="text-[11px] text-black/20 dark:text-white/20 mt-1">
                          {propertyData.latitude}, {propertyData.longitude}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 rounded-xl p-4">
                      <div className="text-[11px] text-black/40 dark:text-white/40 mb-1 tracking-wider uppercase">Country</div>
                      <div className="text-[15px] text-black dark:text-white/95">{propertyData.country || 'India'}</div>
                    </div>
                    <div className="bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 rounded-xl p-4">
                      <div className="text-[11px] text-black/40 dark:text-white/40 mb-1 tracking-wider uppercase">State</div>
                      <div className="text-[15px] text-black dark:text-white/95">{propertyData.state || 'Karnataka'}</div>
                    </div>
                    <div className="bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 rounded-xl p-4">
                      <div className="text-[11px] text-black/40 dark:text-white/40 mb-1 tracking-wider uppercase">City</div>
                      <div className="text-[15px] text-black dark:text-white/95">{propertyData.city || 'Bangalore'}</div>
                    </div>
                  </div>
              </div>

              {/* Property Details */}
              <div className="bg-white dark:bg-[#1A1A1A] backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-2xl p-8 shadow-lg dark:shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-blue-400" />
                      </div>
                      <h3 className="text-[16px] tracking-tight text-black dark:text-white/95">Property Details</h3>
                    </div>
                    <button
                      onClick={() => setStep('details')}
                      className="text-[13px] text-emerald-400 hover:text-emerald-300 flex items-center gap-2 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Property Name */}
                    <div>
                      <label className="block text-[12px] text-black/50 dark:text-white/50 mb-2 tracking-wide uppercase">Property Name</label>
                      <div className="text-[15px] text-black dark:text-white/95 font-medium">
                        {propertyData.name || 'Not provided'}
                      </div>
                    </div>

                    {/* Building Type & Property Type */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[12px] text-black/50 dark:text-white/50 mb-2 tracking-wide uppercase">Building Type</label>
                        <div className="text-[14px] text-black dark:text-white/95 capitalize">
                          {propertyData.buildingType || 'Not specified'}
                        </div>
                      </div>
                      <div>
                        <label className="block text-[12px] text-black/50 dark:text-white/50 mb-2 tracking-wide uppercase">Property Type</label>
                        <div className="text-[14px] text-black dark:text-white/95">
                          {propertyData.propertyType || 'Not specified'}
                        </div>
                      </div>
                    </div>

                    {/* Plot Size & Built-up Area */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[12px] text-black/50 dark:text-white/50 mb-2 tracking-wide uppercase">Plot Size</label>
                        <div className="text-[14px] text-black dark:text-white/95">
                          {propertyData.plotSize ? `${propertyData.plotSize} sq ft` : 'Not provided'}
                        </div>
                      </div>
                      <div>
                        <label className="block text-[12px] text-black/50 dark:text-white/50 mb-2 tracking-wide uppercase">Built-up Area</label>
                        <div className="text-[14px] text-black dark:text-white/95">
                          {propertyData.builtUpArea ? `${propertyData.builtUpArea} sq ft` : 'Not provided'}
                        </div>
                      </div>
                    </div>

                    {/* Year of Construction & Number of Floors */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[12px] text-black/50 dark:text-white/50 mb-2 tracking-wide uppercase">Year of Construction</label>
                        <div className="text-[14px] text-black dark:text-white/95">
                          {propertyData.yearOfConstruction || 'Not provided'}
                        </div>
                      </div>
                      <div>
                        <label className="block text-[12px] text-black/50 dark:text-white/50 mb-2 tracking-wide uppercase">Number of Floors</label>
                        <div className="text-[14px] text-black dark:text-white/95">
                          {propertyData.numberOfFloors || 'Not provided'}
                        </div>
                      </div>
                    </div>

                    {/* Survey Number */}
                    <div>
                      <label className="block text-[12px] text-black/50 dark:text-white/50 mb-2 tracking-wide uppercase">Survey Number</label>
                      <div className="text-[14px] text-black dark:text-white/95">
                        {propertyData.surveyNumber || 'Not provided'}
                      </div>
                    </div>

                    {/* Current Usage & Rental Income */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[12px] text-black/50 dark:text-white/50 mb-2 tracking-wide uppercase">Current Usage</label>
                        <div className="text-[14px] text-black dark:text-white/95">
                          {propertyData.currentUsage || 'Not specified'}
                        </div>
                      </div>
                      <div>
                        <label className="block text-[12px] text-black/50 dark:text-white/50 mb-2 tracking-wide uppercase">Rental Income</label>
                        <div className="text-[14px] text-black dark:text-white/95">
                          {propertyData.rentalIncome ? `₹${propertyData.rentalIncome}/month` : 'Not provided'}
                        </div>
                      </div>
                    </div>

                    {/* Full Address */}
                    <div>
                      <label className="block text-[12px] text-black/50 dark:text-white/50 mb-2 tracking-wide uppercase">Property Address</label>
                      <div className="text-[14px] text-black dark:text-white/95">
                        {propertyData.address || 'Not provided'}
                      </div>
                    </div>

                    {/* Coordinates (if provided) */}
                    {propertyData.latitude && propertyData.longitude && (
                      <div>
                        <label className="block text-[12px] text-black/50 dark:text-white/50 mb-2 tracking-wide uppercase">Coordinates</label>
                        <div className="text-[13px] text-black/60 dark:text-white/60 font-mono">
                          {propertyData.latitude}, {propertyData.longitude}
                        </div>
                      </div>
                    )}

                    {/* District (if provided) */}
                    {propertyData.district && (
                      <div>
                        <label className="block text-[12px] text-black/50 dark:text-white/50 mb-2 tracking-wide uppercase">District</label>
                        <div className="text-[14px] text-black dark:text-white/95">
                          {propertyData.district}
                        </div>
                      </div>
                    )}
                  </div>
              </div>

              {/* Uploaded Documents */}
              <div className="bg-white dark:bg-[#1A1A1A] backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-2xl p-8 shadow-lg dark:shadow-2xl">
                  <div className="flex items-center justify-between gap-3 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-purple-400" />
                      </div>
                      <h3 className="text-[16px] tracking-tight text-black dark:text-white/95">Uploaded Documents</h3>
                    </div>
                    {/* Score display */}
                    {(() => {
                      let totalScore = 0;
                      Object.entries(documentRequirements.categories).forEach(([key, cat]) => {
                        const uploaded = cat.documents.filter(doc => 
                          uploadedDocs.find(d => d.documentType === doc && d.status === 'verified')
                        ).length;
                        const categoryCompletion = uploaded / cat.documents.length;
                        totalScore += categoryCompletion * (cat.weight * 100);
                      });
                      const currentScore = Math.round(totalScore);
                      
                      return (
                        <div className="flex flex-col items-end">
                          <span className="text-[12px] text-black/40 dark:text-white/40 mb-1 font-medium tracking-wide uppercase">Trust Score</span>
                          <div className="flex items-end gap-1">
                            <span className="text-2xl font-bold leading-none text-black dark:text-white">{currentScore}</span>
                            <span className="text-[14px] text-black/60 dark:text-white/60 mb-0.5">/ 100</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {uploadedDocs.length > 0 ? (
                    <div className="flex flex-col gap-6">
                      {/* Tabs */}
                      <div className="flex items-center gap-6 border-b border-black/5 dark:border-white/10 overflow-x-auto scrollbar-hide">
                        {Object.entries(documentRequirements.categories).map(([key, cat], idx) => {
                          const isActive = reviewCategoryIndex === idx;
                          
                          return (
                            <button
                              key={key}
                              onClick={() => setReviewCategoryIndex(idx)}
                              className={`flex items-center gap-2 pb-3 border-b-2 transition-colors whitespace-nowrap relative top-[1px] ${
                                isActive 
                                  ? 'border-emerald-500 text-emerald-500' 
                                  : 'border-transparent text-black/40 dark:text-white/40 hover:text-black/60 dark:hover:text-white/60'
                              }`}
                            >
                              <span className="text-[13px] font-medium tracking-wide">
                                {cat.title}
                              </span>
                            </button>
                          );
                        })}
                        
                        {/* Other Documents Tab */}
                        {(() => {
                          const categorizedIds = new Set(
                            Object.values(documentRequirements.categories).flatMap(cat => 
                              uploadedDocs.filter(doc => doc.documentType && cat.documents.includes(doc.documentType)).map(d => d.id)
                            )
                          );
                          const uncategorized = uploadedDocs.filter(doc => !categorizedIds.has(doc.id));
                          
                          if (uncategorized.length === 0) return null;
                          
                          const idx = Object.keys(documentRequirements.categories).length;
                          const isActive = reviewCategoryIndex === idx;

                          return (
                            <button
                              onClick={() => setReviewCategoryIndex(idx)}
                              className={`flex items-center gap-2 pb-3 border-b-2 transition-colors whitespace-nowrap relative top-[1px] ${
                                isActive 
                                  ? 'border-emerald-500 text-emerald-500' 
                                  : 'border-transparent text-black/40 dark:text-white/40 hover:text-black/60 dark:hover:text-white/60'
                              }`}
                            >
                              <span className="text-[13px] font-medium tracking-wide">
                                Other
                              </span>
                            </button>
                          );
                        })()}
                      </div>

                      {/* Tab Content */}
                      <div className="space-y-4">
                        {(() => {
                          const categoriesList = Object.entries(documentRequirements.categories);
                          let docsToShow: any[] = [];
                          let tabTitle = '';

                          if (reviewCategoryIndex < categoriesList.length) {
                            // Show standard category docs
                            const [key, category] = categoriesList[reviewCategoryIndex];
                            tabTitle = category.title;
                            docsToShow = uploadedDocs.filter(doc => 
                              doc.documentType && category.documents.includes(doc.documentType)
                            );
                          } else {
                            // Show "Other" docs
                            const categorizedIds = new Set(
                              Object.values(documentRequirements.categories).flatMap(cat => 
                                uploadedDocs.filter(doc => doc.documentType && cat.documents.includes(doc.documentType)).map(d => d.id)
                              )
                            );
                            tabTitle = 'Other Documents';
                            docsToShow = uploadedDocs.filter(doc => !categorizedIds.has(doc.id));
                          }

                          if (docsToShow.length === 0) {
                            return (
                              <div className="text-center py-8">
                                <FileText className="w-12 h-12 text-black/20 dark:text-white/20 mx-auto mb-3" />
                                <p className="text-[14px] text-black/40 dark:text-white/40">No documents uploaded for this category</p>
                              </div>
                            );
                          }

                          return (
                            <div className="space-y-3">
                              {docsToShow.map((doc) => (
                                <div 
                                  key={doc.id}
                                  className="flex items-center justify-between bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 rounded-xl p-4 hover:bg-black/[0.04] dark:hover:bg-white/[0.05] transition-all"
                                >
                                  <div className="flex items-center gap-3 flex-1">
                                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                                      <FileText className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="text-[14px] text-black dark:text-white/95 truncate">
                                        {doc.documentType || doc.name}
                                      </div>
                                      <div className="text-[12px] text-black/40 dark:text-white/40 mt-0.5">
                                        {doc.documentType ? `${doc.name} • ${doc.size}` : doc.size}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className={`px-3 py-1 rounded-lg text-[11px] tracking-wide uppercase ${
                                      doc.status === 'verified' 
                                        ? 'bg-emerald-500/10 text-emerald-400' 
                                        : doc.status === 'processing'
                                        ? 'bg-yellow-500/10 text-yellow-400'
                                        : 'bg-blue-500/10 text-blue-400'
                                    }`}>
                                      {doc.status}
                                    </div>
                                    {doc.status === 'verified' && (
                                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-black/20 dark:text-white/20 mx-auto mb-3" />
                      <p className="text-[14px] text-black/40 dark:text-white/40">No documents uploaded yet</p>
                    </div>
                  )}
                </div>
            </div>

            {/* Action Footer */}
            <div className="bg-white dark:bg-[#1A1A1A] backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-2xl p-6 shadow-lg dark:shadow-2xl">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setStep('documents')}
                  className="text-black/60 dark:text-white/60 hover:text-black/90 dark:hover:text-white/90 text-[14px] tracking-wide transition-colors"
                >
                  ← Back to Documents
                </button>
                
                {/* VYBE Logo */}
                <div className="flex-shrink-0">
                  
                </div>

                <button
                  onClick={() => {
                    // Create property object with proper structure
                    const newProperty = {
                      id: `prop-${Date.now()}`,
                      name: propertyData.name,
                      type: propertyData.propertyType,
                      buildingType: propertyData.buildingType,
                      plotSize: propertyData.plotSize,
                      builtUpArea: propertyData.builtUpArea,
                      yearOfConstruction: propertyData.yearOfConstruction,
                      numberOfFloors: propertyData.numberOfFloors,
                      surveyNumber: propertyData.surveyNumber,
                      currentUsage: propertyData.currentUsage,
                      rentalIncome: propertyData.rentalIncome,
                      address: propertyData.address,
                      country: propertyData.country,
                      state: propertyData.state,
                      city: propertyData.city,
                      district: propertyData.district,
                      latitude: propertyData.latitude,
                      longitude: propertyData.longitude,
                      zoning: propertyData.zoning,
                      dateAdded: new Date().toISOString(),
                      documents: uploadedDocs.map(doc => ({
                        id: doc.id,
                        name: doc.name,
                        size: doc.size,
                        status: doc.status,
                        type: doc.type,
                      })),
                      extractedData: {
                        surveyNumber: extractedData.surveyNumber,
                        landArea: extractedData.landArea,
                        landAreaUnit: extractedData.landAreaUnit,
                        ownershipType: extractedData.ownershipType,
                        zoningClassification: extractedData.zoningClassification,
                        roadAccess: extractedData.roadAccess,
                        encumbranceStatus: extractedData.encumbranceStatus,
                        utilitiesAvailability: extractedData.utilitiesAvailability,
                      },
                    };
                    
                    addProperty(newProperty);
                    localStorage.setItem('vybeHasProperties', 'true');
                    navigate('/my-properties');
                  }}
                  className="bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 px-10 py-4 rounded-xl text-[15px] font-medium tracking-wide transition-all shadow-lg"
                >
                  Finish
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}