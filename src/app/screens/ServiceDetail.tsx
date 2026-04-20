import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import { 
  ArrowLeft, 
  Sparkles, 
  Home, 
  FileText, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  IndianRupee, 
  ArrowRight,
  Shield,
  Award,
  TrendingUp,
  Users,
  HeadphonesIcon,
  FileCheck,
  BarChart3,
  Target,
  Zap,
  Star,
  Building2,
  UserCheck,
  X
} from 'lucide-react';
import { SideNav } from '../components/SideNav';
import { ThemeToggle } from '../components/ThemeToggle';
import { NotificationDropdown } from '../components/NotificationDropdown';

interface ServiceData {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: any;
  color: string;
  gradient: string;
  pricing: {
    starting: string;
    plans: {
      name: string;
      price: string;
      duration: string;
      popular?: boolean;
      features: string[];
    }[];
  };
  eta: {
    min: string;
    max: string;
    description: string;
  };
  features: {
    icon: any;
    title: string;
    description: string;
  }[];
  benefits: string[];
  process: {
    step: string;
    title: string;
    description: string;
  }[];
  testimonial?: {
    quote: string;
    author: string;
    property: string;
    result: string;
  };
}

const servicesData: Record<string, ServiceData> = {
  'habu-report': {
    id: 'habu-report',
    name: 'HABU Report',
    tagline: 'AI-Powered Intelligence for Your Real Estate Assets',
    description: 'Get comprehensive, data-driven insights into your property with our proprietary HABU (Highest And Best Use) Engine. Combining AI analytics with expert validation to unlock hidden opportunities and mitigate risks.',
    icon: Sparkles,
    color: 'emerald-500',
    gradient: 'from-[#FFC700] to-amber-500',
    pricing: {
      starting: '₹49,999',
      plans: [
        {
          name: 'Essential',
          price: '₹49,999',
          duration: 'One-time',
          features: [
            'Comprehensive property analysis',
            'Market positioning report',
            'Legal compliance review',
            'Investment opportunity scoring',
            'Basic ROI projections',
            '30-day support access',
          ],
        },
        {
          name: 'Premium',
          price: '₹99,999',
          duration: 'One-time',
          popular: true,
          features: [
            'Everything in Essential',
            'Advanced AI analytics',
            'Multiple scenario planning',
            'Expert consultation (2 hours)',
            'Quarterly updates (1 year)',
            'Priority support',
            'Strategic action roadmap',
          ],
        },
        {
          name: 'Enterprise',
          price: 'Custom',
          duration: 'Portfolio-based',
          features: [
            'Everything in Premium',
            'Portfolio-wide analysis',
            'Dedicated account manager',
            'Monthly strategy sessions',
            'Unlimited revisions',
            'White-label reporting',
            'API access for integration',
          ],
        },
      ],
    },
    eta: {
      min: '5',
      max: '7',
      description: 'business days from document submission to final report delivery',
    },
    features: [
      {
        icon: BarChart3,
        title: 'Market Intelligence',
        description: 'Real-time market data, comparable sales analysis, and micro-market trends for precise property valuation.',
      },
      {
        icon: Target,
        title: 'Highest & Best Use Analysis',
        description: 'AI-powered recommendations on optimal property utilization for maximum returns based on 50+ parameters.',
      },
      {
        icon: Shield,
        title: 'Risk Assessment',
        description: 'Comprehensive legal, environmental, and financial risk evaluation with mitigation strategies.',
      },
      {
        icon: TrendingUp,
        title: 'ROI Projections',
        description: 'Multi-scenario financial modeling with 5-10 year projections and sensitivity analysis.',
      },
      {
        icon: FileCheck,
        title: 'Compliance Review',
        description: 'Detailed verification of legal documents, zoning regulations, and regulatory compliance status.',
      },
      {
        icon: Zap,
        title: 'Actionable Strategies',
        description: 'Prioritized action plan with implementation timeline and resource requirements.',
      },
    ],
    benefits: [
      'Make data-driven investment decisions with confidence',
      'Identify hidden opportunities in your property portfolio',
      'Reduce financial and legal risks before they become costly',
      'Optimize property usage for maximum returns',
      'Access institutional-grade analysis typically reserved for large portfolios',
      'Save 100+ hours of manual research and analysis',
    ],
    process: [
      {
        step: '01',
        title: 'Submit Property Details',
        description: 'Provide basic information and upload relevant documents through our secure platform.',
      },
      {
        step: '02',
        title: 'AI Analysis & Expert Review',
        description: 'Our HABU Engine processes your data while our experts validate findings and add contextual insights.',
      },
      {
        step: '03',
        title: 'Report Generation',
        description: 'Comprehensive report is compiled with visualizations, recommendations, and action plans.',
      },
      {
        step: '04',
        title: 'Consultation & Delivery',
        description: 'Receive your report along with a walkthrough session to discuss findings and next steps.',
      },
    ],
    testimonial: {
      quote: 'The HABU Report revealed a zoning opportunity we hadn\'t considered. We pivoted our strategy and increased our property\'s valuation by ₹2.3 Cr within 6 months.',
      author: 'Rajesh Malhotra',
      property: 'Commercial Plot, Whitefield',
      result: '+₹2.3Cr valuation increase',
    },
  },
  'property-service': {
    id: 'property-service',
    name: 'Property Service',
    tagline: 'Hassle-Free Property Management & Maintenance',
    description: 'Comprehensive property care solutions designed for UHNIs who demand excellence. From routine maintenance to emergency repairs, we ensure your assets are always in pristine condition.',
    icon: Home,
    color: 'emerald-500',
    gradient: 'from-emerald-500 to-green-500',
    pricing: {
      starting: '₹15,000',
      plans: [
        {
          name: 'Basic Care',
          price: '₹15,000',
          duration: 'per month',
          features: [
            'Monthly property inspection',
            'Basic maintenance & repairs',
            'Utility bill management',
            'Vendor coordination',
            'Monthly status reports',
            '24/7 emergency helpline',
          ],
        },
        {
          name: 'Premium Care',
          price: '₹35,000',
          duration: 'per month',
          popular: true,
          features: [
            'Everything in Basic Care',
            'Bi-weekly inspections',
            'Preventive maintenance planning',
            'Dedicated property manager',
            'Tenant management (if applicable)',
            'Landscaping & gardening',
            'Priority vendor network',
          ],
        },
        {
          name: 'Concierge',
          price: '₹75,000',
          duration: 'per month',
          features: [
            'Everything in Premium Care',
            'Weekly on-site visits',
            'Renovation project management',
            'White-glove service standards',
            'Smart home integration',
            'Lifestyle concierge services',
            'Annual deep cleaning included',
          ],
        },
      ],
    },
    eta: {
      min: '24',
      max: '48',
      description: 'hours for service activation and initial property assessment',
    },
    features: [
      {
        icon: Shield,
        title: 'Preventive Maintenance',
        description: 'Scheduled inspections and proactive repairs to prevent costly issues before they occur.',
      },
      {
        icon: Users,
        title: 'Verified Vendor Network',
        description: 'Access to our curated network of licensed, insured, and background-verified service professionals.',
      },
      {
        icon: HeadphonesIcon,
        title: '24/7 Emergency Response',
        description: 'Round-the-clock support for urgent issues with guaranteed 2-hour response time.',
      },
      {
        icon: FileCheck,
        title: 'Digital Documentation',
        description: 'Complete digital records of all maintenance activities, expenses, and warranty information.',
      },
      {
        icon: Award,
        title: 'Quality Assurance',
        description: 'Every service is inspected and rated to ensure it meets our high standards.',
      },
      {
        icon: BarChart3,
        title: 'Cost Optimization',
        description: 'Smart scheduling and vendor negotiation to reduce maintenance costs by up to 30%.',
      },
    ],
    benefits: [
      'Preserve and enhance property value through expert care',
      'Save 20+ hours per month on property management tasks',
      'Reduce emergency repair costs by up to 40% with preventive maintenance',
      'Access to verified professionals at pre-negotiated rates',
      'Complete peace of mind knowing your asset is professionally managed',
      'Detailed expense tracking and tax-ready reports',
    ],
    process: [
      {
        step: '01',
        title: 'Property Assessment',
        description: 'Our team conducts a comprehensive on-site evaluation to understand your property\'s unique needs.',
      },
      {
        step: '02',
        title: 'Custom Service Plan',
        description: 'We create a tailored maintenance schedule and assign a dedicated property manager.',
      },
      {
        step: '03',
        title: 'Ongoing Management',
        description: 'Regular inspections, proactive maintenance, and vendor coordination as per your plan.',
      },
      {
        step: '04',
        title: 'Transparent Reporting',
        description: 'Monthly reports with photos, expense breakdowns, and recommendations for your review.',
      },
    ],
    testimonial: {
      quote: 'As an NRI, managing my Bangalore property was a nightmare. VYBE\'s concierge service has been a game-changer - my property is better maintained now than when I lived there myself.',
      author: 'Priya Krishnan',
      property: 'Luxury Villa, Koramangala',
      result: '100% peace of mind',
    },
  },
  'lease-rent': {
    id: 'lease-rent',
    name: 'Lease & Rent',
    tagline: 'Maximize Rental Income with Zero Hassle',
    description: 'End-to-end rental management service that handles everything from tenant screening to lease renewal. Designed to maximize your rental income while minimizing your involvement.',
    icon: FileText,
    color: 'blue-500',
    gradient: 'from-blue-500 to-cyan-500',
    pricing: {
      starting: '₹9,999',
      plans: [
        {
          name: 'Lease Setup',
          price: '₹9,999',
          duration: 'One-time',
          features: [
            'Tenant screening (up to 5 candidates)',
            'Legal agreement drafting',
            'Police verification coordination',
            'Move-in inspection & documentation',
            'Security deposit management',
            '30-day post-lease support',
          ],
        },
        {
          name: 'Full Management',
          price: '8% of monthly rent',
          duration: 'Ongoing',
          popular: true,
          features: [
            'Everything in Lease Setup',
            'Monthly rent collection',
            'Tenant relationship management',
            'Maintenance coordination',
            'Rental market analysis',
            'Lease renewal handling',
            'Legal dispute support',
          ],
        },
        {
          name: 'Guaranteed Rent',
          price: '12% of monthly rent',
          duration: 'Annual contract',
          features: [
            'Everything in Full Management',
            'Guaranteed monthly rent (even if vacant)',
            'We handle all tenant issues',
            'Complete risk transfer',
            'Property refurbishment included',
            'Zero vacancy risk',
            'Annual rent escalation assured',
          ],
        },
      ],
    },
    eta: {
      min: '15',
      max: '30',
      description: 'days to find qualified tenants and complete lease formalities',
    },
    features: [
      {
        icon: Users,
        title: 'Premium Tenant Screening',
        description: 'Multi-layer verification including credit checks, employment verification, and background screening.',
      },
      {
        icon: FileCheck,
        title: 'Legal Compliance',
        description: 'Lawyer-vetted rental agreements that protect your interests and comply with local regulations.',
      },
      {
        icon: IndianRupee,
        title: 'Rent Optimization',
        description: 'Market analysis to set optimal rental rates that maximize income while minimizing vacancy.',
      },
      {
        icon: Shield,
        title: 'Damage Protection',
        description: 'Comprehensive security deposit management and optional damage insurance coverage.',
      },
      {
        icon: HeadphonesIcon,
        title: 'Tenant Support',
        description: 'Professional tenant relationship management to reduce turnover and maintain high satisfaction.',
      },
      {
        icon: BarChart3,
        title: 'Performance Analytics',
        description: 'Real-time dashboards showing rental income, occupancy rates, and market comparisons.',
      },
    ],
    benefits: [
      'Receive rent on time, every month, without chasing tenants',
      'Reduce tenant turnover by up to 60% with professional management',
      'Avoid bad tenants with our rigorous screening process',
      'Stay legally compliant with all rental regulations',
      'Increase rental income by 15-25% through optimal pricing',
      'Save 30+ hours per month on tenant management',
    ],
    process: [
      {
        step: '01',
        title: 'Property Evaluation',
        description: 'We assess your property and recommend optimal rental pricing based on market analysis.',
      },
      {
        step: '02',
        title: 'Marketing & Screening',
        description: 'Professional listing creation and multi-channel marketing to attract quality tenants.',
      },
      {
        step: '03',
        title: 'Lease Execution',
        description: 'Handle all legal formalities, documentation, and move-in coordination.',
      },
      {
        step: '04',
        title: 'Ongoing Management',
        description: 'Monthly rent collection, maintenance coordination, and tenant relationship management.',
      },
    ],
    testimonial: {
      quote: 'I was losing ₹40K monthly due to vacancy. VYBE found a premium tenant within 2 weeks and negotiated 18% higher rent than I was asking. Best decision ever.',
      author: 'Amit Desai',
      property: '3BHK Apartment, Indiranagar',
      result: '+18% rental income',
    },
  },
  'sell-liquidate': {
    id: 'sell-liquidate',
    name: 'Sell or Liquidate',
    tagline: 'Strategic Exit Planning for Maximum Returns',
    description: 'Sophisticated exit strategy service that combines market intelligence, buyer networking, and expert negotiation to help you liquidate real estate assets at optimal valuations.',
    icon: DollarSign,
    color: 'purple-500',
    gradient: 'from-purple-500 to-pink-500',
    pricing: {
      starting: '1.5%',
      plans: [
        {
          name: 'Market Analysis',
          price: '₹25,000',
          duration: 'One-time',
          features: [
            'Comprehensive property valuation',
            'Market positioning analysis',
            'Comparable sales research',
            'Optimal timing recommendation',
            'Buyer persona profiling',
            'Marketing strategy blueprint',
          ],
        },
        {
          name: 'Full Service',
          price: '1.5% of sale value',
          duration: 'Success-based',
          popular: true,
          features: [
            'Everything in Market Analysis',
            'Professional photography & staging',
            'Multi-channel marketing campaign',
            'Buyer screening & qualification',
            'Negotiation representation',
            'Due diligence coordination',
            'Legal & financial closure support',
          ],
        },
        {
          name: 'Premium Exit',
          price: '2% of sale value',
          duration: 'Success-based',
          features: [
            'Everything in Full Service',
            'Pre-emptive buyer outreach',
            'Auction management (if applicable)',
            'Tax optimization consulting',
            'Post-sale 1031 exchange support',
            'Dedicated transaction manager',
            'Guaranteed sale timeline (6 months)',
          ],
        },
      ],
    },
    eta: {
      min: '60',
      max: '120',
      description: 'days for complete transaction from listing to closing (market dependent)',
    },
    features: [
      {
        icon: BarChart3,
        title: 'Strategic Valuation',
        description: 'Data-driven pricing strategy that maximizes value while ensuring competitive market positioning.',
      },
      {
        icon: Users,
        title: 'Exclusive Buyer Network',
        description: 'Access to our curated network of pre-qualified UHNI buyers and institutional investors.',
      },
      {
        icon: Award,
        title: 'Expert Negotiation',
        description: 'Professional negotiators who have closed ₹500+ Cr in real estate transactions.',
      },
      {
        icon: Shield,
        title: 'Legal Protection',
        description: 'Comprehensive due diligence and legal support to ensure smooth, risk-free transactions.',
      },
      {
        icon: Target,
        title: 'Marketing Excellence',
        description: 'Premium marketing campaigns including professional staging, photography, and digital reach.',
      },
      {
        icon: Zap,
        title: 'Fast-Track Closing',
        description: 'Streamlined process and transaction management for 40% faster closings than market average.',
      },
    ],
    benefits: [
      'Achieve 8-15% higher sale prices through expert positioning',
      'Reduce time-to-sale by 40% with our buyer network',
      'Avoid costly mistakes with professional transaction management',
      'Maintain confidentiality with discreet marketing options',
      'Optimize tax implications with strategic exit planning',
      'Zero upfront costs with success-based pricing (select plans)',
    ],
    process: [
      {
        step: '01',
        title: 'Strategic Planning',
        description: 'Deep-dive analysis of your property, market conditions, and optimal exit strategy.',
      },
      {
        step: '02',
        title: 'Market Positioning',
        description: 'Professional staging, photography, and targeted marketing to qualified buyer segments.',
      },
      {
        step: '03',
        title: 'Buyer Engagement',
        description: 'Screening, qualification, and negotiation with potential buyers to secure best offers.',
      },
      {
        step: '04',
        title: 'Transaction Closure',
        description: 'End-to-end management of due diligence, legal formalities, and financial settlement.',
      },
    ],
    testimonial: {
      quote: 'VYBE\'s strategic approach helped us liquidate a distressed asset for ₹12.8 Cr when other brokers said ₹9-10 Cr was the ceiling. Their buyer network made all the difference.',
      author: 'Vikram Shetty',
      property: 'Commercial Complex, HSR Layout',
      result: '+₹2.8Cr over market',
    },
  },
};

export function ServiceDetail() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<number>(1); // Default to middle plan
  const [showOwnershipModal, setShowOwnershipModal] = useState(false);

  const service = serviceId ? servicesData[serviceId] : null;

  const handleGetStarted = () => {
    if (serviceId === 'habu-report') {
      // For HABU report, show ownership modal
      setShowOwnershipModal(true);
    } else {
      // For other services, navigate directly to property selection
      navigate('/services', { 
        state: { 
          selectedService: serviceId,
          skipOwnershipModal: true 
        } 
      });
    }
  };

  const handleOwnershipSelect = (ownershipType: 'own' | 'non-own') => {
    setShowOwnershipModal(false);
    navigate('/services', { 
      state: { 
        selectedService: serviceId,
        ownershipType: ownershipType
      } 
    });
  };

  if (!service) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] dark:bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-[32px] font-bold text-black dark:text-white mb-4">Service Not Found</h1>
          <Link to="/services" className="text-emerald-500 hover:text-emerald-600">
            Return to Services
          </Link>
        </div>
      </div>
    );
  }

  const ServiceIcon = service.icon;

  return (
    <div className="min-h-screen bg-[#F2F2F2] dark:bg-[#0A0A0A]">
      <SideNav />
      
      <div className="pl-[72px]">
        {/* Top Bar */}
        <div className="sticky top-0 z-30 bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-black/5 dark:border-white/10">
          <div className="max-w-7xl mx-auto px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link
                  to="/services"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-black/60 dark:text-white/60"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                <div>
                  <div className="text-[10px] font-bold tracking-[0.05em] uppercase text-black/40 dark:text-white/50 mb-2">
                    Service Details
                  </div>
                  <div className="text-[32px] tracking-tight text-black dark:text-white">
                    {service.name}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <NotificationDropdown />
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-[#0F0F0F] dark:to-[#0A0A0A] border-b border-black/5 dark:border-white/10">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5 dark:opacity-[0.02]">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }} />
          </div>

          <div className="relative max-w-7xl mx-auto px-8 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div>
                {/* Icon & Badge */}
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-16 h-16 rounded-[16px] bg-gradient-to-br ${service.gradient} flex items-center justify-center shadow-[0_8px_24px_rgba(16,185,129,0.25)]`}>
                    <ServiceIcon className="w-8 h-8 text-white" />
                  </div>
                  <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 fill-current" />
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        PREMIUM SERVICE
                      </span>
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-[48px] leading-[1.1] tracking-tight font-bold text-black dark:text-white mb-4">
                  {service.name}
                </h1>
                
                {/* Tagline */}
                <p className="text-[20px] text-black/70 dark:text-white/70 mb-6">
                  {service.tagline}
                </p>

                {/* Description */}
                <p className="text-[15px] leading-relaxed text-black/60 dark:text-white/60 mb-8">
                  {service.description}
                </p>

                {/* Quick Stats - Only ETA */}
                <div className="mb-8">
                  <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-[12px] border border-black/5 dark:border-white/10 p-4 inline-block">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-emerald-500" />
                      <div className="text-[10px] font-bold tracking-[0.05em] uppercase text-black/40 dark:text-white/40">
                        Estimated Timeline
                      </div>
                    </div>
                    <div className="text-[24px] font-bold text-black dark:text-white">
                      {service.eta.min}-{service.eta.max} days
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div>
                  <button 
                    onClick={handleGetStarted}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-[12px] text-[14px] font-bold transition-all shadow-[0_4px_12px_rgba(16,185,129,0.25)] hover:shadow-[0_8px_24px_rgba(16,185,129,0.35)] hover:-translate-y-0.5 flex items-center gap-2"
                  >
                    Get Started
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Right Visual */}
              <div className="relative">
                <div className="bg-white/95 dark:bg-[#1A1A1A]/95 backdrop-blur-[40px] rounded-[24px] border border-white/40 dark:border-white/10 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.1)]">
                  <div className="text-[10px] font-bold tracking-[0.05em] uppercase text-black/40 dark:text-white/40 mb-4">
                    What You'll Get
                  </div>
                  <div className="space-y-3">
                    {service.benefits.slice(0, 5).map((benefit, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-[14px] text-black dark:text-white/90">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-8 py-12">
          {/* Features Grid */}
          <div className="mb-16">
            <div className="mb-12">
              <h2 className="text-[32px] font-bold text-black dark:text-white mb-3">
                Key Features
              </h2>
              <p className="text-[15px] text-black/60 dark:text-white/60">
                Everything you need for {service.name.toLowerCase()}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.features.map((feature, index) => {
                const FeatureIcon = feature.icon;
                return (
                  <div
                    key={index}
                    className="bg-white/95 dark:bg-[#1A1A1A]/95 backdrop-blur-[40px] rounded-[24px] border border-white/40 dark:border-white/10 p-6 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_20px_40px_-5px_rgba(0,0,0,0.05)] hover:border-emerald-500/30 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-[12px] bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-all">
                      <FeatureIcon className="w-6 h-6 text-emerald-500" />
                    </div>
                    <h3 className="text-[16px] font-bold text-black dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-[13px] text-black/60 dark:text-white/60 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Process Timeline */}
          <div className="mb-16">
            <div className="mb-12">
              <h2 className="text-[32px] font-bold text-black dark:text-white mb-3">
                How It Works
              </h2>
              <p className="text-[15px] text-black/60 dark:text-white/60">
                Simple, transparent process from start to finish
              </p>
            </div>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 via-emerald-500/50 to-transparent hidden md:block" />

              <div className="space-y-8">
                {service.process.map((step, index) => (
                  <div key={index} className="relative flex items-start gap-6">
                    {/* Step Number */}
                    <div className="relative z-10 flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center text-white text-[18px] font-bold shadow-[0_4px_16px_rgba(16,185,129,0.3)]">
                      {step.step}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 bg-white/95 dark:bg-[#1A1A1A]/95 backdrop-blur-[40px] rounded-[24px] border border-white/40 dark:border-white/10 p-6 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_20px_40px_-5px_rgba(0,0,0,0.05)]">
                      <h3 className="text-[18px] font-bold text-black dark:text-white mb-2">
                        {step.title}
                      </h3>
                      <p className="text-[14px] text-black/60 dark:text-white/60 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Testimonial */}
          {service.testimonial && (
            <div className="mb-16">
              <div className="bg-gradient-to-br from-emerald-500 to-green-500 rounded-[24px] p-12 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                
                <div className="relative z-10 max-w-3xl mx-auto text-center">
                  <div className="mb-6">
                    <Star className="w-12 h-12 mx-auto mb-4 fill-current" />
                    <p className="text-[24px] leading-relaxed font-medium mb-6">
                      "{service.testimonial.quote}"
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-center gap-4">
                    <div>
                      <div className="text-[16px] font-bold">
                        {service.testimonial.author}
                      </div>
                      <div className="text-[13px] text-white/80">
                        {service.testimonial.property}
                      </div>
                    </div>
                    <div className="w-px h-12 bg-white/20" />
                    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                      <div className="text-[14px] font-bold">
                        {service.testimonial.result}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CTA Section */}
          <div className="bg-white/95 dark:bg-[#1A1A1A]/95 backdrop-blur-[40px] rounded-[24px] border border-white/40 dark:border-white/10 p-12 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_20px_40px_-5px_rgba(0,0,0,0.05)] text-center">
            <h2 className="text-[32px] font-bold text-black dark:text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-[15px] text-black/60 dark:text-white/60 mb-8 max-w-2xl mx-auto">
              Join hundreds of UHNIs who trust VYBE for their real estate needs. 
              Start your journey today with a complimentary consultation.
            </p>
            <div className="flex items-center justify-center gap-4">
              <button 
                onClick={() => navigate('/services')}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-[12px] text-[14px] font-bold transition-all shadow-[0_4px_12px_rgba(16,185,129,0.25)] hover:shadow-[0_8px_24px_rgba(16,185,129,0.35)] hover:-translate-y-0.5 flex items-center gap-2"
              >
                Start Your Case
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-white rounded-[12px] text-[14px] font-bold transition-all">
                Talk to Expert
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Ownership Modal for HABU Report */}
      {showOwnershipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowOwnershipModal(false)}
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
              onClick={() => setShowOwnershipModal(false)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10
                         flex items-center justify-center transition-all group"
            >
              <X className="w-5 h-5 text-black/40 dark:text-white/40 group-hover:text-black/70 dark:group-hover:text-white/70" />
            </button>

            {/* Header */}
            <div className="mb-8 text-center">
              <div className="text-[10px] font-bold tracking-[0.05em] uppercase text-black/40 dark:text-white/50 mb-3">
                HABU Report
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
                onClick={() => handleOwnershipSelect('own')}
                className="relative bg-white/90 dark:bg-[#0F0F0F]/90 backdrop-blur-[40px] rounded-[20px] p-8 text-left
                           shadow-[0_2px_4px_rgba(0,0,0,0.02),0_20px_40px_-5px_rgba(0,0,0,0.05)]
                           border border-white/60 dark:border-white/10
                           hover:shadow-[0_2px_4px_rgba(0,0,0,0.02),0_20px_60px_-5px_rgba(0,0,0,0.1)]
                           hover:border-emerald-500/30
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
                onClick={() => handleOwnershipSelect('non-own')}
                className="relative bg-white/90 dark:bg-[#0F0F0F]/90 backdrop-blur-[40px] rounded-[20px] p-8 text-left
                           shadow-[0_2px_4px_rgba(0,0,0,0.02),0_20px_40px_-5px_rgba(0,0,0,0.05)]
                           border border-white/60 dark:border-white/10
                           hover:shadow-[0_2px_4px_rgba(0,0,0,0.02),0_20px_60px_-5px_rgba(0,0,0,0.1)]
                           hover:border-emerald-500/30
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
    </div>
  );
}