import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { SideNav } from '../components/SideNav';
import { ThemeToggle } from '../components/ThemeToggle';
import { 
  FileText, 
  Search, 
  Filter,
  Download,
  Eye,
  Grid3x3,
  List,
  ChevronDown,
  Building2,
  Shield,
  Lock,
  CheckCircle2,
  Calendar,
  User,
  Upload,
  Star,
  X,
  FolderOpen,
  Clock,
  File,
  FileImage,
  FileSpreadsheet
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  propertyName: string;
  propertyLocation: string;
  category: 'Ownership' | 'Compliance' | 'Financial' | 'Land Records' | 'Utility' | 'Supporting';
  type: 'PDF' | 'DOC' | 'JPG' | 'PNG' | 'XLS';
  size: string;
  uploadDate: string;
  uploadedBy: string;
  verified: boolean;
  isStarred: boolean;
  lastAccessed?: string;
  isIndependent?: boolean; // New property to mark independent documents
}

export function DocumentVault() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [selectedProperty, setSelectedProperty] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showPropertyFilter, setShowPropertyFilter] = useState(false);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [viewingDocument, setViewingDocument] = useState<Document | null>(null);

  // Mock data for documents across all properties
  const documents: Document[] = [
    {
      id: '1',
      name: 'Sale Deed - Original Copy.pdf',
      propertyName: 'Sterling Heights, Sector 47',
      propertyLocation: 'Gurgaon, Haryana',
      category: 'Ownership',
      type: 'PDF',
      size: '2.4 MB',
      uploadDate: 'Mar 10, 2026',
      uploadedBy: 'You',
      verified: true,
      isStarred: true,
      lastAccessed: '2 hours ago'
    },
    {
      id: '2',
      name: 'Property Tax Receipt 2025-26.pdf',
      propertyName: 'Sterling Heights, Sector 47',
      propertyLocation: 'Gurgaon, Haryana',
      category: 'Compliance',
      type: 'PDF',
      size: '856 KB',
      uploadDate: 'Mar 12, 2026',
      uploadedBy: 'You',
      verified: true,
      isStarred: false,
      lastAccessed: 'Yesterday'
    },
    {
      id: '3',
      name: 'Land Registry Certificate.pdf',
      propertyName: 'Sterling Heights, Sector 47',
      propertyLocation: 'Gurgaon, Haryana',
      category: 'Land Records',
      type: 'PDF',
      size: '1.2 MB',
      uploadDate: 'Feb 28, 2026',
      uploadedBy: 'CA Priya Sharma',
      verified: true,
      isStarred: false,
      lastAccessed: '3 days ago'
    },
    {
      id: '4',
      name: 'Valuation Report Q1 2026.pdf',
      propertyName: 'Sterling Heights, Sector 47',
      propertyLocation: 'Gurgaon, Haryana',
      category: 'Financial',
      type: 'PDF',
      size: '3.8 MB',
      uploadDate: 'Mar 05, 2026',
      uploadedBy: 'Valuation Partner',
      verified: true,
      isStarred: true,
      lastAccessed: 'Today'
    },
    {
      id: '5',
      name: 'Electricity Bill - February 2026.pdf',
      propertyName: 'Sterling Heights, Sector 47',
      propertyLocation: 'Gurgaon, Haryana',
      category: 'Utility',
      type: 'PDF',
      size: '245 KB',
      uploadDate: 'Feb 15, 2026',
      uploadedBy: 'You',
      verified: false,
      isStarred: false,
      lastAccessed: '1 week ago'
    },
    {
      id: '6',
      name: 'Ownership Title Deed.pdf',
      propertyName: 'Golden Meadows Estate',
      propertyLocation: 'Bangalore, Karnataka',
      category: 'Ownership',
      type: 'PDF',
      size: '3.1 MB',
      uploadDate: 'Jan 20, 2026',
      uploadedBy: 'You',
      verified: true,
      isStarred: true,
      lastAccessed: '5 days ago'
    },
    {
      id: '7',
      name: 'Building Plan Approval.pdf',
      propertyName: 'Golden Meadows Estate',
      propertyLocation: 'Bangalore, Karnataka',
      category: 'Compliance',
      type: 'PDF',
      size: '4.2 MB',
      uploadDate: 'Jan 22, 2026',
      uploadedBy: 'Architect Team',
      verified: true,
      isStarred: false,
      lastAccessed: '2 weeks ago'
    },
    {
      id: '8',
      name: 'Annual Maintenance Statement.xlsx',
      propertyName: 'Golden Meadows Estate',
      propertyLocation: 'Bangalore, Karnataka',
      category: 'Financial',
      type: 'XLS',
      size: '1.8 MB',
      uploadDate: 'Feb 10, 2026',
      uploadedBy: 'You',
      verified: false,
      isStarred: false,
      lastAccessed: '4 days ago'
    },
    {
      id: '9',
      name: 'Purchase Agreement - Original.pdf',
      propertyName: 'Riverside Enclave',
      propertyLocation: 'Pune, Maharashtra',
      category: 'Ownership',
      type: 'PDF',
      size: '2.9 MB',
      uploadDate: 'Dec 15, 2025',
      uploadedBy: 'Legal Team',
      verified: true,
      isStarred: true,
      lastAccessed: '1 week ago'
    },
    {
      id: '10',
      name: 'Fire Safety Certificate.pdf',
      propertyName: 'Riverside Enclave',
      propertyLocation: 'Pune, Maharashtra',
      category: 'Compliance',
      type: 'PDF',
      size: '680 KB',
      uploadDate: 'Jan 05, 2026',
      uploadedBy: 'Safety Inspector',
      verified: true,
      isStarred: false,
      lastAccessed: '2 weeks ago'
    },
    {
      id: '11',
      name: 'Loan Sanction Letter.pdf',
      propertyName: 'Riverside Enclave',
      propertyLocation: 'Pune, Maharashtra',
      category: 'Financial',
      type: 'PDF',
      size: '520 KB',
      uploadDate: 'Dec 20, 2025',
      uploadedBy: 'HDFC Bank',
      verified: true,
      isStarred: false,
      lastAccessed: '10 days ago'
    },
    {
      id: '12',
      name: 'Property Insurance Policy.pdf',
      propertyName: 'Emerald Gardens Complex',
      propertyLocation: 'Noida, Uttar Pradesh',
      category: 'Supporting',
      type: 'PDF',
      size: '1.4 MB',
      uploadDate: 'Feb 25, 2026',
      uploadedBy: 'ICICI Lombard',
      verified: true,
      isStarred: false,
      lastAccessed: '6 days ago'
    },
    {
      id: '13',
      name: 'Khata Extract & Certificate.pdf',
      propertyName: 'Emerald Gardens Complex',
      propertyLocation: 'Noida, Uttar Pradesh',
      category: 'Land Records',
      type: 'PDF',
      size: '890 KB',
      uploadDate: 'Mar 01, 2026',
      uploadedBy: 'Revenue Officer',
      verified: true,
      isStarred: true,
      lastAccessed: 'Today'
    },
    {
      id: '14',
      name: 'Water Bill - March 2026.pdf',
      propertyName: 'Emerald Gardens Complex',
      propertyLocation: 'Noida, Uttar Pradesh',
      category: 'Utility',
      type: 'PDF',
      size: '180 KB',
      uploadDate: 'Mar 15, 2026',
      uploadedBy: 'You',
      verified: false,
      isStarred: false,
      lastAccessed: 'Yesterday'
    },
    {
      id: '15',
      name: 'Floor Plan - All Levels.jpg',
      propertyName: 'Emerald Gardens Complex',
      propertyLocation: 'Noida, Uttar Pradesh',
      category: 'Supporting',
      type: 'JPG',
      size: '5.2 MB',
      uploadDate: 'Feb 18, 2026',
      uploadedBy: 'Architect',
      verified: false,
      isStarred: false,
      lastAccessed: '1 week ago'
    },
    // Independent documents (not tied to any property)
    {
      id: '16',
      name: 'Personal Identity Proof - Aadhaar.pdf',
      propertyName: 'Independent',
      propertyLocation: '',
      category: 'Supporting',
      type: 'PDF',
      size: '420 KB',
      uploadDate: 'Mar 08, 2026',
      uploadedBy: 'You',
      verified: true,
      isStarred: false,
      lastAccessed: '3 days ago',
      isIndependent: true
    },
    {
      id: '17',
      name: 'PAN Card Copy.pdf',
      propertyName: 'Independent',
      propertyLocation: '',
      category: 'Supporting',
      type: 'PDF',
      size: '310 KB',
      uploadDate: 'Mar 08, 2026',
      uploadedBy: 'You',
      verified: true,
      isStarred: false,
      lastAccessed: '3 days ago',
      isIndependent: true
    },
    {
      id: '18',
      name: 'Investment Strategy Portfolio.pdf',
      propertyName: 'Independent',
      propertyLocation: '',
      category: 'Financial',
      type: 'PDF',
      size: '2.8 MB',
      uploadDate: 'Feb 22, 2026',
      uploadedBy: 'Financial Advisor',
      verified: false,
      isStarred: true,
      lastAccessed: '1 week ago',
      isIndependent: true
    },
  ];

  // Get unique properties
  const properties = Array.from(new Set(documents.map(doc => doc.propertyName))).map(name => {
    const doc = documents.find(d => d.propertyName === name);
    return {
      name,
      location: doc?.propertyLocation || '',
      count: documents.filter(d => d.propertyName === name).length
    };
  });

  // Categories
  const categories = [
    { id: 'Ownership', label: 'Ownership', color: 'primary', count: documents.filter(d => d.category === 'Ownership').length },
    { id: 'Compliance', label: 'Compliance', color: 'blue', count: documents.filter(d => d.category === 'Compliance').length },
    { id: 'Financial', label: 'Financial', color: 'purple', count: documents.filter(d => d.category === 'Financial').length },
    { id: 'Land Records', label: 'Land Records', color: 'orange', count: documents.filter(d => d.category === 'Land Records').length },
    { id: 'Utility', label: 'Utility', color: 'cyan', count: documents.filter(d => d.category === 'Utility').length },
    { id: 'Supporting', label: 'Supporting', color: 'gray', count: documents.filter(d => d.category === 'Supporting').length },
  ];

  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.propertyName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProperty = selectedProperty === 'all' || doc.propertyName === selectedProperty;
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    
    return matchesSearch && matchesProperty && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat?.color || 'gray';
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'PDF':
        return <FileText className="w-5 h-5 text-red-500" />;
      case 'DOC':
        return <File className="w-5 h-5 text-blue-500" />;
      case 'XLS':
        return <FileSpreadsheet className="w-5 h-5 text-primary-700" />;
      case 'JPG':
      case 'PNG':
        return <FileImage className="w-5 h-5 text-purple-500" />;
      default:
        return <FileText className="w-5 h-5 text-muted-foreground dark:text-neutral-300/60" />;
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-neutral-900">
      <SideNav />
      
      {/* Premium Vault Header with Security Indicators */}
      <div className="ml-[72px] border-b border-black/[0.06] dark:border-white/[0.08] bg-gradient-to-br from-white via-white to-primary-100/30 dark:from-[#0A0A0A] dark:via-[#0A0A0A] dark:to-primary-900/10 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-[var(--radius-card)] bg-primary-700/10 dark:bg-primary-700/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary-700 dark:text-primary-400" />
                </div>
                <h1 className="text-caption tracking-[0.15em] uppercase text-muted-foreground dark:text-neutral-300/60 font-medium">
                  Secure Document Vault
                </h1>
              </div>
              <div className="text-h1 tracking-tight text-foreground dark:text-neutral-0/95 mb-2">
                My Documents
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-700/10 dark:bg-primary-700/20 rounded-[var(--radius)]">
                  <Lock className="w-3.5 h-3.5 text-primary-700 dark:text-primary-400" />
                  <span className="text-caption font-medium tracking-wide text-primary-700 dark:text-primary-400">
                    BANK-GRADE ENCRYPTION
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900/5 dark:bg-card/5 rounded-[var(--radius)]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-neutral-700/80 dark:text-neutral-300/80" />
                  <span className="text-caption font-medium text-neutral-700/80 dark:text-neutral-300/80">
                    {documents.filter(d => d.verified).length} Verified Documents
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900/5 dark:bg-card/5 rounded-[var(--radius)]">
                  <Building2 className="w-3.5 h-3.5 text-neutral-700/80 dark:text-neutral-300/80" />
                  <span className="text-caption font-medium text-neutral-700/80 dark:text-neutral-300/80">
                    {properties.length} Properties
                  </span>
                </div>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-[72px]">
        <div className="max-w-[1600px] mx-auto px-8 py-8">
          
          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground dark:text-neutral-300/60 z-10" />
                <input
                  type="text"
                  placeholder="Search documents or properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-card/80 dark:bg-card/[0.03] border border-black/[0.08] dark:border-white/[0.08] rounded-[var(--radius-card)] text-small text-foreground dark:text-neutral-0 placeholder:text-muted-foreground dark:placeholder:text-neutral-300/60 focus:outline-none focus:ring-2 focus:ring-primary-700/20 focus:border-primary-700/30 backdrop-blur-xl transition-all"
                />
              </div>
              <button 
                onClick={() => navigate(id ? `/property/${id}/documents/upload` : '/documents/upload')}
                className="px-5 py-3.5 bg-primary-700 hover:bg-primary-900 text-neutral-0 rounded-[var(--radius-card)] transition-all shadow-[0_4px_16px_rgba(28,117,188,0.3)] hover:shadow-[0_8px_24px_rgba(28,117,188,0.4)] flex items-center gap-2 text-small font-medium"
              >
                <Upload className="w-4 h-4" />
                Upload Document
              </button>
            </div>

            {/* Filters and View Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Property Filter */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowPropertyFilter(!showPropertyFilter);
                      setShowCategoryFilter(false);
                    }}
                    className={`px-4 py-2.5 rounded-[var(--radius-card)] text-small font-medium transition-all flex items-center gap-2 ${
                      selectedProperty !== 'all'
                        ? 'bg-primary-700 text-neutral-0 shadow-[0_4px_12px_rgba(28,117,188,0.3)]'
                        : 'bg-card/80 dark:bg-card/[0.03] border border-black/[0.08] dark:border-white/[0.08] text-foreground dark:text-neutral-0 hover:bg-neutral-900/[0.02] dark:hover:bg-card/[0.05]'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    {selectedProperty === 'all' ? 'All Properties' : properties.find(p => p.name === selectedProperty)?.name.substring(0, 20) + '...'}
                    <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                  </button>

                  {showPropertyFilter && (
                    <div className="absolute top-full left-0 mt-2 w-80 bg-card/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.08] rounded-[var(--radius-card)] shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden z-50">
                      <div className="p-3 border-b border-black/5 dark:border-white/5">
                        <div className="text-caption tracking-[0.1em] uppercase text-muted-foreground dark:text-neutral-300/60 font-medium mb-3 px-2">
                          Filter by Property
                        </div>
                        <button
                          onClick={() => {
                            setSelectedProperty('all');
                            setShowPropertyFilter(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[var(--radius)] transition-all mb-1 ${
                            selectedProperty === 'all'
                              ? 'bg-primary-700/10 dark:bg-primary-700/20 text-primary-700 dark:text-primary-400'
                              : 'hover:bg-neutral-900/[0.02] dark:hover:bg-card/[0.02] text-foreground dark:text-neutral-0'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <FolderOpen className="w-4 h-4" />
                            <span className="text-small font-medium">All Properties</span>
                          </div>
                          <span className="text-caption text-muted-foreground dark:text-neutral-300/60">{documents.length}</span>
                        </button>
                        {/* Independent Documents Option */}
                        <button
                          onClick={() => {
                            setSelectedProperty('Independent');
                            setShowPropertyFilter(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[var(--radius)] transition-all ${
                            selectedProperty === 'Independent'
                              ? 'bg-primary-700/10 dark:bg-primary-700/20 text-primary-700 dark:text-primary-400'
                              : 'hover:bg-neutral-900/[0.02] dark:hover:bg-card/[0.02] text-foreground dark:text-neutral-0'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4" />
                            <span className="text-small font-medium">Independent</span>
                          </div>
                          <span className="text-caption text-muted-foreground dark:text-neutral-300/60">{documents.filter(d => d.isIndependent).length}</span>
                        </button>
                      </div>
                      <div className="p-3 max-h-80 overflow-y-auto">
                        {properties.filter(p => p.name !== 'Independent').map((property) => (
                          <button
                            key={property.name}
                            onClick={() => {
                              setSelectedProperty(property.name);
                              setShowPropertyFilter(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-3 rounded-[var(--radius)] transition-all mb-1 ${
                              selectedProperty === property.name
                                ? 'bg-primary-700/10 dark:bg-primary-700/20'
                                : 'hover:bg-neutral-900/[0.02] dark:hover:bg-card/[0.02]'
                            }`}
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className={`w-10 h-10 rounded-[var(--radius)] flex items-center justify-center flex-shrink-0 ${
                                selectedProperty === property.name
                                  ? 'bg-primary-700'
                                  : 'bg-neutral-900/[0.04] dark:bg-card/[0.04]'
                              }`}>
                                <Building2 className={`w-5 h-5 ${
                                  selectedProperty === property.name
                                    ? 'text-neutral-0'
                                    : 'text-neutral-700/80 dark:text-neutral-300/80'
                                }`} />
                              </div>
                              <div className="text-left min-w-0 flex-1">
                                <div className="text-small font-medium text-foreground dark:text-neutral-0 truncate">
                                  {property.name}
                                </div>
                                <div className="text-caption text-neutral-700/80 dark:text-neutral-300/80 truncate">
                                  {property.location}
                                </div>
                              </div>
                            </div>
                            <span className="text-caption text-muted-foreground dark:text-neutral-300/60 ml-2 flex-shrink-0">
                              {property.count}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Category Filter */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowCategoryFilter(!showCategoryFilter);
                      setShowPropertyFilter(false);
                    }}
                    className={`px-4 py-2.5 rounded-[var(--radius-card)] text-small font-medium transition-all flex items-center gap-2 ${
                      selectedCategory !== 'all'
                        ? 'bg-primary-700 text-neutral-0 shadow-[0_4px_12px_rgba(28,117,188,0.3)]'
                        : 'bg-card/80 dark:bg-card/[0.03] border border-black/[0.08] dark:border-white/[0.08] text-foreground dark:text-neutral-0 hover:bg-neutral-900/[0.02] dark:hover:bg-card/[0.05]'
                    }`}
                  >
                    <Filter className="w-4 h-4" />
                    {selectedCategory === 'all' ? 'All Categories' : selectedCategory}
                    <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                  </button>

                  {showCategoryFilter && (
                    <div className="absolute top-full left-0 mt-2 w-72 bg-card/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.08] rounded-[var(--radius-card)] shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden z-50">
                      <div className="p-3">
                        <div className="text-caption tracking-[0.1em] uppercase text-muted-foreground dark:text-neutral-300/60 font-medium mb-3 px-2">
                          Filter by Category
                        </div>
                        <button
                          onClick={() => {
                            setSelectedCategory('all');
                            setShowCategoryFilter(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[var(--radius)] transition-all mb-1 ${
                            selectedCategory === 'all'
                              ? 'bg-primary-700/10 dark:bg-primary-700/20 text-primary-700 dark:text-primary-400'
                              : 'hover:bg-neutral-900/[0.02] dark:hover:bg-card/[0.02] text-foreground dark:text-neutral-0'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4" />
                            <span className="text-small font-medium">All Categories</span>
                          </div>
                          <span className="text-caption text-muted-foreground dark:text-neutral-300/60">{documents.length}</span>
                        </button>
                        <div className="my-2 border-t border-black/5 dark:border-white/5" />
                        {categories.map((category) => (
                          <button
                            key={category.id}
                            onClick={() => {
                              setSelectedCategory(category.id);
                              setShowCategoryFilter(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[var(--radius)] transition-all mb-1 ${
                              selectedCategory === category.id
                                ? 'bg-primary-700/10 dark:bg-primary-700/20'
                                : 'hover:bg-neutral-900/[0.02] dark:hover:bg-card/[0.02]'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full bg-${category.color}-500`} />
                              <span className="text-small font-medium text-foreground dark:text-neutral-0">{category.label}</span>
                            </div>
                            <span className="text-caption text-muted-foreground dark:text-neutral-300/60">{category.count}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Active Filters Count */}
                {(selectedProperty !== 'all' || selectedCategory !== 'all') && (
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-px bg-neutral-900/10 dark:bg-card/10" />
                    <button
                      onClick={() => {
                        setSelectedProperty('all');
                        setSelectedCategory('all');
                      }}
                      className="text-caption text-primary-700 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-400 font-medium flex items-center gap-1.5"
                    >
                      <X className="w-3.5 h-3.5" />
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-4">
                <div className="text-small text-neutral-700/80 dark:text-neutral-300/80">
                  <span className="font-medium text-foreground dark:text-neutral-0">{filteredDocuments.length}</span> documents
                </div>
                <div className="flex items-center gap-2 bg-card/80 dark:bg-card/[0.03] border border-black/[0.08] dark:border-white/[0.08] rounded-[var(--radius)] p-1">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-2 rounded transition-all ${
                      viewMode === 'table'
                        ? 'bg-primary-700 text-neutral-0 shadow-sm'
                        : 'text-neutral-700/80 dark:text-neutral-300/80 hover:text-foreground dark:hover:text-neutral-0'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded transition-all ${
                      viewMode === 'grid'
                        ? 'bg-primary-700 text-neutral-0 shadow-sm'
                        : 'text-neutral-700/80 dark:text-neutral-300/80 hover:text-foreground dark:hover:text-neutral-0'
                    }`}
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Documents Display */}
          {viewMode === 'table' ? (
            /* Table View */
            <div className="bg-card/80 dark:bg-card/[0.03] backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] rounded-[var(--radius-card)] overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
              {/* Table Header */}
              <div className="bg-neutral-900/[0.02] dark:bg-card/[0.02] border-b border-black/5 dark:border-white/5 px-6 py-4">
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-4 text-caption tracking-[0.1em] uppercase font-medium text-neutral-500">
                    Document Name
                  </div>
                  <div className="col-span-3 text-caption tracking-[0.1em] uppercase font-medium text-neutral-500">
                    Property
                  </div>
                  <div className="col-span-2 text-caption tracking-[0.1em] uppercase font-medium text-neutral-500">
                    Category
                  </div>
                  <div className="col-span-1 text-caption tracking-[0.1em] uppercase font-medium text-neutral-500">
                    Type
                  </div>
                  <div className="col-span-1 text-caption tracking-[0.1em] uppercase font-medium text-neutral-500">
                    Upload Date
                  </div>
                  <div className="col-span-1 text-caption tracking-[0.1em] uppercase font-medium text-neutral-500 text-right">
                    Actions
                  </div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-black/5 dark:divide-white/5">
                {filteredDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="px-6 py-4 hover:bg-neutral-900/[0.01] dark:hover:bg-card/[0.01] transition-colors group"
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* Document Name */}
                      <div className="col-span-4 flex items-center gap-3 min-w-0">
                        <div className="flex-shrink-0">
                          {getFileIcon(doc.type)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <div className="text-small font-medium text-foreground dark:text-neutral-0 truncate">
                              {doc.name}
                            </div>
                            {doc.isStarred && (
                              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                            )}
                          </div>
                          <div className="text-caption text-neutral-700/80 dark:text-neutral-300/80">
                            {doc.size} • Uploaded by {doc.uploadedBy}
                          </div>
                        </div>
                      </div>

                      {/* Property */}
                      <div className="col-span-3 min-w-0">
                        <div className="text-small text-foreground dark:text-neutral-0 truncate font-medium">
                          {doc.propertyName}
                        </div>
                        <div className="text-caption text-neutral-700/80 dark:text-neutral-300/80 truncate">
                          {doc.propertyLocation}
                        </div>
                      </div>

                      {/* Category */}
                      <div className="col-span-2">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius)] text-caption font-medium tracking-wide uppercase bg-${getCategoryColor(doc.category)}-500/10 text-${getCategoryColor(doc.category)}-600 dark:text-${getCategoryColor(doc.category)}-400 border border-${getCategoryColor(doc.category)}-500/20`}>
                          <div className={`w-1.5 h-1.5 rounded-full bg-${getCategoryColor(doc.category)}-500`} />
                          {doc.category}
                        </span>
                      </div>

                      {/* Type */}
                      <div className="col-span-1">
                        <span className="text-caption font-mono text-neutral-700/80 dark:text-neutral-300/80">
                          {doc.type}
                        </span>
                      </div>

                      {/* Upload Date */}
                      <div className="col-span-1">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                          <span className="text-caption text-foreground dark:text-neutral-0">
                            {doc.uploadDate}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="col-span-1 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setViewingDocument(doc)}
                          className="p-2 hover:bg-primary-700/10 dark:hover:bg-primary-700/20 rounded-[var(--radius)] transition-all"
                        >
                          <Eye className="w-4 h-4 text-primary-700 dark:text-primary-400" />
                        </button>
                        <button className="p-2 hover:bg-primary-700/10 dark:hover:bg-primary-700/20 rounded-[var(--radius)] transition-all">
                          <Download className="w-4 h-4 text-primary-700 dark:text-primary-400" />
                        </button>
                      </div>
                    </div>

                    {/* Verification Badge */}
                    {doc.verified && (
                      <div className="mt-2 ml-8">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-primary-700/10 dark:bg-primary-700/20 rounded text-caption font-medium text-primary-700 dark:text-primary-400 tracking-wide">
                          <CheckCircle2 className="w-3 h-3" />
                          VERIFIED
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {filteredDocuments.length === 0 && (
                <div className="py-20 text-center">
                  <div className="w-16 h-16 rounded-[var(--radius-card)] bg-neutral-900/5 dark:bg-card/5 flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-muted-foreground dark:text-neutral-300/60" />
                  </div>
                  <p className="text-small text-neutral-700/80 dark:text-neutral-300/80 mb-1">
                    No documents found
                  </p>
                  <p className="text-caption text-neutral-500">
                    Try adjusting your filters or search query
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="group bg-card/80 dark:bg-card/[0.03] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.08] rounded-[var(--radius-card)] overflow-hidden hover:border-primary-700/30 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_12px_32px_rgba(0,0,0,0.6)] transition-all duration-300"
                >
                  {/* Document Preview */}
                  <div className="aspect-[4/3] bg-gradient-to-br from-black/[0.02] to-black/[0.04] dark:from-white/[0.02] dark:to-white/[0.04] relative flex items-center justify-center">
                    <div className="scale-150">
                      {getFileIcon(doc.type)}
                    </div>

                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-neutral-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button 
                        onClick={() => setViewingDocument(doc)}
                        className="w-10 h-10 rounded-[var(--radius-card)] bg-card/20 hover:bg-card/30 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110"
                      >
                        <Eye className="w-5 h-5 text-neutral-0" />
                      </button>
                      <button className="w-10 h-10 rounded-[var(--radius-card)] bg-card/20 hover:bg-card/30 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110">
                        <Download className="w-5 h-5 text-neutral-0" />
                      </button>
                    </div>

                    {/* Star Badge */}
                    {doc.isStarred && (
                      <div className="absolute top-3 right-3">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      </div>
                    )}

                    {/* Verified Badge */}
                    {doc.verified && (
                      <div className="absolute top-3 left-3">
                        <div className="w-6 h-6 rounded-full bg-primary-700 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-neutral-0" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Document Info */}
                  <div className="p-4">
                    <div className="text-small font-medium text-foreground dark:text-neutral-0 mb-2 truncate">
                      {doc.name}
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <Building2 className="w-3.5 h-3.5 text-muted-foreground dark:text-neutral-300/60 flex-shrink-0" />
                      <div className="text-caption text-neutral-700/80 dark:text-neutral-300/80 truncate">
                        {doc.propertyName}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-caption font-medium tracking-wide uppercase bg-${getCategoryColor(doc.category)}-500/10 text-${getCategoryColor(doc.category)}-600 dark:text-${getCategoryColor(doc.category)}-400`}>
                        <div className={`w-1 h-1 rounded-full bg-${getCategoryColor(doc.category)}-500`} />
                        {doc.category}
                      </span>
                      <span className="text-caption text-muted-foreground dark:text-neutral-300/60 font-mono">
                        {doc.type}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-caption text-neutral-700/80 dark:text-neutral-300/80 pt-3 border-t border-black/5 dark:border-white/5">
                      <span>{doc.size}</span>
                      <span>{doc.uploadDate}</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Empty State */}
              {filteredDocuments.length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <div className="w-16 h-16 rounded-[var(--radius-card)] bg-neutral-900/5 dark:bg-card/5 flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-muted-foreground dark:text-neutral-300/60" />
                  </div>
                  <p className="text-small text-neutral-700/80 dark:text-neutral-300/80 mb-1">
                    No documents found
                  </p>
                  <p className="text-caption text-neutral-500">
                    Try adjusting your filters or search query
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Close dropdowns when clicking outside */}
      {(showPropertyFilter || showCategoryFilter) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowPropertyFilter(false);
            setShowCategoryFilter(false);
          }}
        />
      )}

      {/* Document Viewer Modal */}
      {viewingDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-neutral-900/80 backdrop-blur-md">
          <div className="relative bg-card/95 dark:bg-neutral-900/95 backdrop-blur-xl rounded-[var(--radius-card)] max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.4)] border border-white/60 dark:border-white/10">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-black/5 dark:border-white/5">
              <div className="flex items-center gap-4">
                {getFileIcon(viewingDocument.type)}
                <div>
                  <div className="text-[16px] font-medium text-foreground dark:text-neutral-0">
                    {viewingDocument.name}
                  </div>
                  <div className="text-caption text-neutral-700/80 dark:text-neutral-300/80">
                    {viewingDocument.size} • {viewingDocument.uploadDate}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setViewingDocument(null)}
                className="w-10 h-10 rounded-full hover:bg-neutral-900/5 dark:hover:bg-card/5 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-neutral-700/80 dark:text-neutral-300/80" />
              </button>
            </div>

            {/* Document Preview */}
            <div className="p-8">
              <div className="w-full aspect-[1.414/1] bg-gradient-to-br from-black/[0.02] to-black/[0.04] dark:from-white/[0.02] dark:to-white/[0.04] rounded-[var(--radius-card)] flex items-center justify-center">
                <div className="text-center">
                  <div className="scale-[2.5] mb-8">
                    {getFileIcon(viewingDocument.type)}
                  </div>
                  <div className="text-small text-neutral-700/80 dark:text-neutral-300/80 mb-4">
                    Document Preview
                  </div>
                  <div className="text-caption text-muted-foreground dark:text-neutral-300/60">
                    Full preview available after download
                  </div>
                </div>
              </div>
            </div>

            {/* Footer with Actions */}
            <div className="flex items-center justify-between p-6 border-t border-black/5 dark:border-white/5 bg-neutral-900/[0.01] dark:bg-card/[0.01]">
              <div className="flex items-center gap-3">
                {viewingDocument.verified && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-700/10 dark:bg-primary-700/20 rounded-[var(--radius)]">
                    <CheckCircle2 className="w-4 h-4 text-primary-700 dark:text-primary-400" />
                    <span className="text-caption font-medium text-primary-700 dark:text-primary-400 tracking-wide">
                      VERIFIED
                    </span>
                  </div>
                )}
                <div className="text-caption text-neutral-700/80 dark:text-neutral-300/80">
                  <span className="font-medium text-foreground dark:text-neutral-0">{viewingDocument.propertyName}</span>
                  {viewingDocument.propertyLocation && <span> • {viewingDocument.propertyLocation}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 bg-neutral-900/5 dark:bg-card/5 hover:bg-neutral-900/10 dark:hover:bg-card/10 text-foreground dark:text-neutral-0 rounded-[var(--radius)] transition-all text-small font-medium flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={() => setViewingDocument(null)}
                  className="px-4 py-2 bg-primary-700 hover:bg-primary-900 text-neutral-0 rounded-[var(--radius)] transition-all text-small font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}