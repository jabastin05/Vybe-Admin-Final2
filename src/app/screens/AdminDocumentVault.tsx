import { useState } from 'react';
import { useNavigate } from 'react-router';
import { AdminLayout } from '../components/AdminLayout';
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
  FileSpreadsheet,
  Users,
  AlertCircle
} from 'lucide-react';

interface Client {
  id: string;
  name: string;
  email: string;
}

interface Property {
  id: string;
  name: string;
  location: string;
  clientId: string;
}

interface Document {
  id: string;
  name: string;
  propertyId: string;
  category: 'Ownership' | 'Compliance' | 'Financial' | 'Land Records' | 'Utility' | 'Supporting';
  type: 'PDF' | 'DOC' | 'JPG' | 'PNG' | 'XLS';
  size: string;
  uploadDate: string;
  uploadedBy: string;
  verified: boolean;
  isInvalid: boolean; // New field to mark documents as invalid
  invalidReason?: string; // Optional reason for marking as invalid
  isStarred: boolean;
  lastAccessed?: string;
}

export function AdminDocumentVault() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [selectedClient, setSelectedClient] = useState<string>('all');
  const [selectedProperty, setSelectedProperty] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all'); // New: verification status filter
  const [showClientFilter, setShowClientFilter] = useState(false);
  const [showPropertyFilter, setShowPropertyFilter] = useState(false);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [showStatusFilter, setShowStatusFilter] = useState(false); // New: status filter dropdown
  const [viewingDocument, setViewingDocument] = useState<Document | null>(null);
  const [verifyingDocument, setVerifyingDocument] = useState<Document | null>(null);
  const [invalidatingDocument, setInvalidatingDocument] = useState<Document | null>(null); // New: for marking as invalid
  const [invalidReason, setInvalidReason] = useState(''); // New: reason for marking invalid

  // Get current user role and details
  const getCurrentUser = () => {
    const userData = localStorage.getItem('vybeAdminUser');
    if (userData) {
      const user = JSON.parse(userData);
      return { 
        role: user.role || 'admin', 
        email: user.email || '',
        name: user.name || 'Admin User'
      };
    }
    return { role: 'admin', email: '', name: 'Admin User' };
  };

  const currentUser = getCurrentUser();

  // Mock data for clients
  const clients: Client[] = [
    { id: 'CL001', name: 'Rajesh Kumar', email: 'rajesh.k@email.com' },
    { id: 'CL002', name: 'Alexander Sterling', email: 'alexander.s@email.com' },
    { id: 'CL003', name: 'Priya Sharma', email: 'priya.s@email.com' },
    { id: 'CL004', name: 'Vikram Malhotra', email: 'vikram.m@email.com' },
  ];

  // Mock data for properties linked to clients
  const properties: Property[] = [
    {
      id: 'P001',
      name: 'Sterling Heights, Sector 47',
      location: 'Gurgaon, Haryana',
      clientId: 'CL001'
    },
    {
      id: 'P002',
      name: 'Golden Meadows Estate',
      location: 'Bangalore, Karnataka',
      clientId: 'CL001'
    },
    {
      id: 'P003',
      name: 'Riverside Enclave',
      location: 'Pune, Maharashtra',
      clientId: 'CL002'
    },
    {
      id: 'P004',
      name: 'Emerald Gardens Complex',
      location: 'Noida, Uttar Pradesh',
      clientId: 'CL003'
    },
    {
      id: 'P005',
      name: 'Skyline Towers',
      location: 'Mumbai, Maharashtra',
      clientId: 'CL004'
    },
  ];

  // Mock data for documents
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Sale Deed - Original Copy.pdf',
      propertyId: 'P001',
      category: 'Ownership',
      type: 'PDF',
      size: '2.4 MB',
      uploadDate: 'Mar 10, 2026',
      uploadedBy: 'Rajesh Kumar',
      verified: true,
      isInvalid: false,
      isStarred: true,
      lastAccessed: '2 hours ago'
    },
    {
      id: '2',
      name: 'Property Tax Receipt 2025-26.pdf',
      propertyId: 'P001',
      category: 'Compliance',
      type: 'PDF',
      size: '856 KB',
      uploadDate: 'Mar 12, 2026',
      uploadedBy: 'Priya Sharma',
      verified: false,
      isInvalid: false,
      isStarred: false,
      lastAccessed: 'Yesterday'
    },
    {
      id: '3',
      name: 'Land Registry Certificate.pdf',
      propertyId: 'P001',
      category: 'Land Records',
      type: 'PDF',
      size: '1.2 MB',
      uploadDate: 'Feb 28, 2026',
      uploadedBy: 'CA Priya Sharma',
      verified: true,
      isInvalid: false,
      isStarred: false,
      lastAccessed: '3 days ago'
    },
    {
      id: '4',
      name: 'Valuation Report Q1 2026.pdf',
      propertyId: 'P002',
      category: 'Financial',
      type: 'PDF',
      size: '3.8 MB',
      uploadDate: 'Mar 05, 2026',
      uploadedBy: 'Valuation Partner',
      verified: false,
      isInvalid: false,
      isStarred: true,
      lastAccessed: 'Today'
    },
    {
      id: '5',
      name: 'Electricity Bill - February 2026.pdf',
      propertyId: 'P002',
      category: 'Utility',
      type: 'PDF',
      size: '245 KB',
      uploadDate: 'Feb 15, 2026',
      uploadedBy: 'Amit Singh',
      verified: false,
      isInvalid: false,
      isStarred: false,
      lastAccessed: '1 week ago'
    },
    {
      id: '6',
      name: 'Ownership Title Deed.pdf',
      propertyId: 'P003',
      category: 'Ownership',
      type: 'PDF',
      size: '3.1 MB',
      uploadDate: 'Jan 20, 2026',
      uploadedBy: 'Vikram Patel',
      verified: true,
      isInvalid: false,
      isStarred: true,
      lastAccessed: '5 days ago'
    },
    {
      id: '7',
      name: 'Building Plan Approval.pdf',
      propertyId: 'P003',
      category: 'Compliance',
      type: 'PDF',
      size: '4.2 MB',
      uploadDate: 'Jan 22, 2026',
      uploadedBy: 'Architect Team',
      verified: false,
      isInvalid: false,
      isStarred: false,
      lastAccessed: '2 weeks ago'
    },
    {
      id: '8',
      name: 'Annual Maintenance Statement.xlsx',
      propertyId: 'P004',
      category: 'Financial',
      type: 'XLS',
      size: '1.8 MB',
      uploadDate: 'Feb 10, 2026',
      uploadedBy: 'Neha Gupta',
      verified: false,
      isInvalid: false,
      isStarred: false,
      lastAccessed: '4 days ago'
    },
    {
      id: '9',
      name: 'Purchase Agreement - Original.pdf',
      propertyId: 'P004',
      category: 'Ownership',
      type: 'PDF',
      size: '2.9 MB',
      uploadDate: 'Dec 15, 2025',
      uploadedBy: 'Legal Team',
      verified: false,
      isInvalid: false,
      isStarred: true,
      lastAccessed: '1 week ago'
    },
    {
      id: '10',
      name: 'Fire Safety Certificate.pdf',
      propertyId: 'P005',
      category: 'Compliance',
      type: 'PDF',
      size: '680 KB',
      uploadDate: 'Jan 05, 2026',
      uploadedBy: 'Safety Inspector',
      verified: true,
      isInvalid: false,
      isStarred: false,
      lastAccessed: '2 weeks ago'
    },
    {
      id: '11',
      name: 'Loan Sanction Letter.pdf',
      propertyId: 'P005',
      category: 'Financial',
      type: 'PDF',
      size: '520 KB',
      uploadDate: 'Dec 20, 2025',
      uploadedBy: 'HDFC Bank',
      verified: false,
      isInvalid: false,
      isStarred: false,
      lastAccessed: '10 days ago'
    },
  ]);

  // Categories
  const categories = [
    { id: 'Ownership', label: 'Ownership', color: 'primary' },
    { id: 'Compliance', label: 'Compliance', color: 'blue' },
    { id: 'Financial', label: 'Financial', color: 'purple' },
    { id: 'Land Records', label: 'Land Records', color: 'orange' },
    { id: 'Utility', label: 'Utility', color: 'cyan' },
    { id: 'Supporting', label: 'Supporting', color: 'gray' },
  ];

  // Helper function to get property details
  const getPropertyDetails = (propertyId: string) => {
    return properties.find(p => p.id === propertyId);
  };

  // Helper function to get client details
  const getClientDetails = (clientId: string) => {
    return clients.find(c => c.id === clientId);
  };

  // Filter properties based on selected client
  const filteredProperties = selectedClient === 'all' 
    ? properties 
    : properties.filter(p => p.clientId === selectedClient);

  // Filter documents based on all criteria
  const filteredDocuments = documents.filter(doc => {
    const property = getPropertyDetails(doc.propertyId);
    if (!property) return false;

    // Role-based filtering for RM: only show documents from their assigned clients
    if (currentUser.role === 'rm') {
      const rmEmail = currentUser.email;
      // Mock RM to client mapping (in production, fetch from backend)
      const rmClientMap: Record<string, string[]> = {
        'rajesh.k@vybe.com': ['CL001'], // Rajesh Kumar
        'priya.s@vybe.com': ['CL004'], // Vikram Malhotra
        'aditya.p@vybe.com': ['CL002'], // Alexander Sterling
        'sneha.r@vybe.com': ['CL003']  // Priya Sharma
      };
      const assignedClients = rmClientMap[rmEmail] || [];
      if (!assignedClients.includes(property.clientId)) {
        return false;
      }
    }

    // Role-based filtering for Service Provider: show documents related to cases assigned to them
    if (currentUser.role === 'partner') {
      // For demo purposes, we filter by property client
      // In production, you'd check case assignments and related documents
      const partnerName = currentUser.name;
      // For simplicity, assuming partner can see documents from specific clients they work with
      // In real app, this would be based on case assignments
      const partnerClientMap: Record<string, string[]> = {
        'Aarav Mehta': ['CL001', 'CL002'],
        'Mervin Jacob': ['CL003', 'CL004']
      };
      const allowedClients = partnerClientMap[partnerName] || [];
      if (allowedClients.length > 0 && !allowedClients.includes(property.clientId)) {
        return false;
      }
    }

    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClient = selectedClient === 'all' || property.clientId === selectedClient;
    const matchesProperty = selectedProperty === 'all' || doc.propertyId === selectedProperty;
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    
    // Updated status filter to include invalid
    let matchesStatus = true;
    if (selectedStatus === 'verified') {
      matchesStatus = doc.verified && !doc.isInvalid;
    } else if (selectedStatus === 'pending') {
      matchesStatus = !doc.verified && !doc.isInvalid;
    } else if (selectedStatus === 'invalid') {
      matchesStatus = doc.isInvalid;
    }
    
    return matchesSearch && matchesClient && matchesProperty && matchesCategory && matchesStatus;
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

  const toggleStar = (docId: string) => {
    setDocuments(docs => 
      docs.map(doc => 
        doc.id === docId ? { ...doc, isStarred: !doc.isStarred } : doc
      )
    );
  };

  const handleVerifyDocument = (doc: Document) => {
    setVerifyingDocument(doc);
  };

  const confirmVerification = () => {
    if (verifyingDocument) {
      setDocuments(docs => 
        docs.map(doc => 
          doc.id === verifyingDocument.id ? { ...doc, verified: true } : doc
        )
      );
      setVerifyingDocument(null);
    }
  };

  const handleInvalidateDocument = (doc: Document) => {
    setInvalidatingDocument(doc);
    setInvalidReason(doc.invalidReason || '');
  };

  const confirmInvalidation = () => {
    if (invalidatingDocument) {
      setDocuments(docs => 
        docs.map(doc => 
          doc.id === invalidatingDocument.id ? { ...doc, isInvalid: true, invalidReason } : doc
        )
      );
      setInvalidatingDocument(null);
      setInvalidReason('');
    }
  };

  return (
    <AdminLayout>
      {/* Verification Confirmation Modal */}
      {verifyingDocument && (
        <div className="vybe-modal-overlay z-50 flex items-center justify-center p-4">
          <div className="vybe-modal w-full shadow-2xl">
            <div className="p-[var(--space-6)] border-b border-border">
              <div className="flex items-center gap-[var(--space-3)] mb-2">
                <div className="w-10 h-10 rounded-[var(--radius-card)] bg-primary-700/10 dark:bg-primary-700/20 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-primary-700 dark:text-primary-400" />
                </div>
                <h2 className="text-h3 font-medium text-foreground">Verify Document</h2>
              </div>
              <p className="text-small text-muted-foreground ml-13">
                Are you sure you want to verify this document?
              </p>
            </div>

            <div className="p-[var(--space-6)] bg-muted rounded-[var(--radius)] mx-[var(--space-6)] mt-[var(--space-4)]">
              <div className="flex items-start gap-[var(--space-3)] mb-[var(--space-3)]">
                {getFileIcon(verifyingDocument.type)}
                <div className="flex-1 min-w-0">
                  <div className="text-small font-medium text-foreground mb-1">
                    {verifyingDocument.name}
                  </div>
                  <div className="text-caption text-muted-foreground">
                    {getPropertyDetails(verifyingDocument.propertyId)?.name}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-[var(--space-3)] border-t border-border">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <span className="text-caption text-muted-foreground">
                  This action will mark the document as verified.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-[var(--space-3)] p-[var(--space-6)]">
              <button
                onClick={() => setVerifyingDocument(null)}
                className="px-[var(--space-6)] py-2.5 bg-muted hover:bg-accent border border-border rounded-[var(--radius)] text-small font-medium text-foreground transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmVerification}
                className="px-[var(--space-6)] py-2.5 bg-primary hover:opacity-90 text-primary-foreground rounded-[var(--radius)] text-small font-medium transition-all shadow-sm flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Verify Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {viewingDocument && (
        <div className="vybe-modal-overlay" style={{ zIndex: 50 }}>
          <div
            className="w-full flex flex-col"
            style={{
              maxWidth: '860px',
              maxHeight: '88vh',
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-card)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
              overflow: 'hidden',
            }}
          >
            {/* ── Modal header ── */}
            <div className="flex items-center justify-between px-[var(--space-6)] py-[var(--space-4)] border-b border-border shrink-0">
              <div className="flex items-center gap-[var(--space-3)] min-w-0">
                {/* File icon badge */}
                <div className="w-9 h-9 rounded-[var(--radius)] bg-muted border border-border flex items-center justify-center shrink-0">
                  {getFileIcon(viewingDocument.type)}
                </div>
                <div className="min-w-0">
                  <p className="text-small font-medium text-foreground truncate leading-tight">
                    {viewingDocument.name}
                  </p>
                  <p className="text-caption text-muted-foreground mt-0.5">
                    {getPropertyDetails(viewingDocument.propertyId)?.name} &nbsp;·&nbsp; Uploaded {viewingDocument.uploadDate}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingDocument(null)}
                className="vybe-icon-btn shrink-0 ml-[var(--space-4)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ── Preview area ── */}
            <div
              className="flex-1 overflow-auto flex items-center justify-center"
              style={{ background: 'var(--muted)', minHeight: '360px' }}
            >
              <div className="text-center py-[var(--space-12)]">
                {/* Large file icon */}
                <div
                  className="w-16 h-16 rounded-[var(--radius-card)] flex items-center justify-center mx-auto mb-[var(--space-4)]"
                  style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
                >
                  {getFileIcon(viewingDocument.type)}
                </div>
                <p className="text-small font-medium text-foreground mb-[var(--space-1)]">
                  {viewingDocument.name}
                </p>
                <p className="text-caption text-muted-foreground">
                  Preview not available in demo mode
                </p>
              </div>
            </div>

            {/* ── Footer ── */}
            <div className="flex items-center justify-between px-[var(--space-6)] py-[var(--space-4)] border-t border-border shrink-0">
              {/* Status */}
              <div>
                {viewingDocument.verified && !viewingDocument.isInvalid && (
                  <span className="vybe-badge vybe-badge-green">Verified</span>
                )}
                {viewingDocument.isInvalid && (
                  <span className="vybe-badge vybe-badge-red">Invalid</span>
                )}
                {!viewingDocument.verified && !viewingDocument.isInvalid && (
                  <span className="vybe-badge vybe-badge-muted">Pending Review</span>
                )}
              </div>
              {/* Actions */}
              <div className="flex items-center gap-[var(--space-3)]">
                <button
                  onClick={() => setViewingDocument(null)}
                  className="vybe-btn-secondary"
                >
                  Close
                </button>
                <button className="vybe-btn-primary">
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invalid Document Confirmation Modal */}
      {invalidatingDocument && (
        <div className="vybe-modal-overlay z-50 flex items-center justify-center p-4">
          <div className="vybe-modal w-full shadow-2xl">
            <div className="p-[var(--space-6)] border-b border-border">
              <div className="flex items-center gap-[var(--space-3)] mb-2">
                <div className="w-10 h-10 rounded-[var(--radius-card)] bg-red-500/10 dark:bg-red-500/20 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-h3 font-medium text-foreground">Mark Document as Invalid</h2>
              </div>
              <p className="text-small text-muted-foreground ml-13">
                Are you sure you want to mark this document as invalid?
              </p>
            </div>

            <div className="p-[var(--space-6)] bg-muted rounded-[var(--radius)] mx-[var(--space-6)] mt-[var(--space-4)]">
              <div className="flex items-start gap-[var(--space-3)] mb-[var(--space-3)]">
                {getFileIcon(invalidatingDocument.type)}
                <div className="flex-1 min-w-0">
                  <div className="text-small font-medium text-foreground mb-1">
                    {invalidatingDocument.name}
                  </div>
                  <div className="text-caption text-muted-foreground">
                    {getPropertyDetails(invalidatingDocument.propertyId)?.name}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-[var(--space-3)] border-t border-border">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <span className="text-caption text-muted-foreground">
                  This action will mark the document as invalid.
                </span>
              </div>
              <div className="mt-[var(--space-4)]">
                <label className="vybe-label block mb-2">Reason for Invalidating:</label>
                <textarea
                  value={invalidReason}
                  onChange={(e) => setInvalidReason(e.target.value)}
                  className="vybe-textarea w-full"
                  placeholder="Enter reason for invalidation..."
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-[var(--space-3)] p-[var(--space-6)]">
              <button
                onClick={() => setInvalidatingDocument(null)}
                className="px-[var(--space-6)] py-2.5 bg-muted hover:bg-accent border border-border rounded-[var(--radius)] text-small font-medium text-foreground transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmInvalidation}
                className="px-[var(--space-6)] py-2.5 bg-red-500 hover:bg-red-600 text-neutral-0 rounded-[var(--radius)] text-small font-medium transition-all shadow-sm flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4" />
                Mark as Invalid
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Page header ── */}
      <div className="vybe-page-header">
        <h1 className="vybe-page-title mb-[var(--space-1)]">Document Vault</h1>
        <p className="vybe-page-subtitle">Manage, verify and organise all client documents securely.</p>
      </div>

      <div className="grid grid-cols-4 gap-[var(--space-4)] mb-[var(--space-6)]">
        {[
          { label: 'Total Documents', value: documents.length,                                              valueStyle: { color: 'var(--foreground)' } },
          { label: 'Verified',        value: documents.filter(d => d.verified && !d.isInvalid).length,     valueStyle: { color: '#1C75BC' } },
          { label: 'Pending Review',  value: documents.filter(d => !d.verified && !d.isInvalid).length,    valueStyle: { color: '#E49B0F' } },
          { label: 'Invalid',         value: documents.filter(d => d.isInvalid).length,                    valueStyle: { color: '#E16A74' } },
        ].map(({ label, value, valueStyle }) => (
          <div key={label} className="vybe-kpi-card">
            <div className="vybe-kpi-label">{label}</div>
            <div className="vybe-kpi-value" style={valueStyle}>{value}</div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="mb-[var(--space-8)] space-y-[var(--space-4)]">
        {/* Search Bar */}
        <div className="flex items-center gap-[var(--space-4)]">
          <div className="flex-1 relative">
            <Search className="absolute left-[var(--space-4)] top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
            <input
              type="text"
              placeholder="Search documents or properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="vybe-search w-full pl-12"
            />
          </div>
        </div>

        {/* Filters and View Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[var(--space-3)]">
            {/* Client Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowClientFilter(!showClientFilter);
                  setShowPropertyFilter(false);
                  setShowCategoryFilter(false);
                  setShowStatusFilter(false);
                }}
                className={`vybe-filter-btn px-[var(--space-4)] py-2.5 rounded-[var(--radius)] text-small font-medium transition-all flex items-center gap-2 ${
                  selectedClient !== 'all'
                    ? 'bg-primary-700 text-neutral-0 shadow-[0_4px_12px_rgba(28,117,188,0.3)]'
                    : ''
                }`}
              >
                <Users className="w-4 h-4" />
                {selectedClient === 'all' ? 'All Clients' : getClientDetails(selectedClient)?.name}
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {showClientFilter && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-card border border-border rounded-[var(--radius)] shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden z-50">
                  <div className="p-3">
                    <div className="vybe-meta-label mb-[var(--space-3)] px-2">
                      Filter by Client
                    </div>
                    <button
                      onClick={() => {
                        setSelectedClient('all');
                        setSelectedProperty('all');
                        setShowClientFilter(false);
                      }}
                      className={`w-full flex items-center justify-between px-[var(--space-3)] py-2.5 rounded-[var(--radius)] transition-all mb-1 ${
                        selectedClient === 'all'
                          ? 'bg-primary-700/10 dark:bg-primary-700/20 text-primary-700 dark:text-primary-400'
                          : 'hover:bg-accent text-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-[var(--space-3)]">
                        <Users className="w-4 h-4" />
                        <span className="text-small font-medium">All Clients</span>
                      </div>
                      <span className="text-caption text-muted-foreground">{clients.length}</span>
                    </button>
                    <div className="my-2 border-t border-border" />
                    {clients.map((client) => {
                      const clientProperties = properties.filter(p => p.clientId === client.id);
                      const clientDocuments = documents.filter(doc => {
                        const property = getPropertyDetails(doc.propertyId);
                        return property && property.clientId === client.id;
                      });
                      
                      return (
                        <button
                          key={client.id}
                          onClick={() => {
                            setSelectedClient(client.id);
                            setSelectedProperty('all');
                            setShowClientFilter(false);
                          }}
                          className={`w-full flex items-center justify-between px-[var(--space-3)] py-[var(--space-3)] rounded-[var(--radius)] transition-all mb-1 ${
                            selectedClient === client.id
                              ? 'bg-primary-700/10 dark:bg-primary-700/20'
                              : 'hover:bg-accent'
                          }`}
                        >
                          <div className="flex items-center gap-[var(--space-3)] flex-1 min-w-0">
                            <div className={`w-10 h-10 rounded-[var(--radius)] flex items-center justify-center flex-shrink-0 ${
                              selectedClient === client.id
                                ? 'bg-primary-700'
                                : 'bg-muted'
                            }`}>
                              <User className={`w-5 h-5 ${
                                selectedClient === client.id
                                  ? 'text-neutral-0'
                                  : 'text-muted-foreground'
                              }`} />
                            </div>
                            <div className="text-left min-w-0 flex-1">
                              <div className="text-small font-medium text-foreground truncate">
                                {client.name}
                              </div>
                              <div className="text-caption text-muted-foreground truncate">
                                {client.id} • {clientProperties.length} {clientProperties.length === 1 ? 'Property' : 'Properties'}
                              </div>
                            </div>
                          </div>
                          <span className="text-caption text-muted-foreground ml-2 flex-shrink-0">
                            {clientDocuments.length}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Property Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowPropertyFilter(!showPropertyFilter);
                  setShowClientFilter(false);
                  setShowCategoryFilter(false);
                  setShowStatusFilter(false);
                }}
                className={`vybe-filter-btn px-[var(--space-4)] py-2.5 rounded-[var(--radius)] text-small font-medium transition-all flex items-center gap-2 ${
                  selectedProperty !== 'all'
                    ? 'bg-primary-700 text-neutral-0 shadow-[0_4px_12px_rgba(28,117,188,0.3)]'
                    : ''
                }`}
              >
                <Building2 className="w-4 h-4" />
                {selectedProperty === 'all'
                  ? 'All Properties'
                  : getPropertyDetails(selectedProperty)?.name.substring(0, 20) + '...'}
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {showPropertyFilter && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-card border border-border rounded-[var(--radius)] shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden z-50">
                  <div className="p-3 border-b border-border">
                    <div className="vybe-meta-label mb-[var(--space-3)] px-2">
                      Filter by Property
                    </div>
                    <button
                      onClick={() => {
                        setSelectedProperty('all');
                        setShowPropertyFilter(false);
                      }}
                      className={`w-full flex items-center justify-between px-[var(--space-3)] py-2.5 rounded-[var(--radius)] transition-all mb-1 ${
                        selectedProperty === 'all'
                          ? 'bg-primary-700/10 dark:bg-primary-700/20 text-primary-700 dark:text-primary-400'
                          : 'hover:bg-accent text-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-[var(--space-3)]">
                        <FolderOpen className="w-4 h-4" />
                        <span className="text-small font-medium">All Properties</span>
                      </div>
                      <span className="text-caption text-muted-foreground">
                        {selectedClient === 'all' ? properties.length : filteredProperties.length}
                      </span>
                    </button>
                  </div>
                  <div className="p-3 max-h-80 overflow-y-auto">
                    {filteredProperties.map((property) => {
                      const propertyDocuments = documents.filter(doc => doc.propertyId === property.id);
                      const client = getClientDetails(property.clientId);
                      
                      return (
                        <button
                          key={property.id}
                          onClick={() => {
                            setSelectedProperty(property.id);
                            setShowPropertyFilter(false);
                          }}
                          className={`w-full flex items-center justify-between px-[var(--space-3)] py-[var(--space-3)] rounded-[var(--radius)] transition-all mb-1 ${
                            selectedProperty === property.id
                              ? 'bg-primary-700/10 dark:bg-primary-700/20'
                              : 'hover:bg-accent'
                          }`}
                        >
                          <div className="flex items-center gap-[var(--space-3)] flex-1 min-w-0">
                            <div className={`w-10 h-10 rounded-[var(--radius)] flex items-center justify-center flex-shrink-0 ${
                              selectedProperty === property.id
                                ? 'bg-primary-700'
                                : 'bg-muted'
                            }`}>
                              <Building2 className={`w-5 h-5 ${
                                selectedProperty === property.id
                                  ? 'text-neutral-0'
                                  : 'text-muted-foreground'
                              }`} />
                            </div>
                            <div className="text-left min-w-0 flex-1">
                              <div className="text-small font-medium text-foreground truncate">
                                {property.name}
                              </div>
                              <div className="text-caption text-muted-foreground truncate">
                                {property.location} • {client?.name}
                              </div>
                            </div>
                          </div>
                          <span className="text-caption text-muted-foreground ml-2 flex-shrink-0">
                            {propertyDocuments.length}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Category Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowCategoryFilter(!showCategoryFilter);
                  setShowClientFilter(false);
                  setShowPropertyFilter(false);
                  setShowStatusFilter(false);
                }}
                className={`vybe-filter-btn px-[var(--space-4)] py-2.5 rounded-[var(--radius)] text-small font-medium transition-all flex items-center gap-2 ${
                  selectedCategory !== 'all'
                    ? 'bg-primary-700 text-neutral-0 shadow-[0_4px_12px_rgba(28,117,188,0.3)]'
                    : ''
                }`}
              >
                <Filter className="w-4 h-4" />
                {selectedCategory === 'all' ? 'All Categories' : selectedCategory}
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {showCategoryFilter && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-card border border-border rounded-[var(--radius)] shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden z-50">
                  <div className="p-3">
                    <div className="vybe-meta-label mb-[var(--space-3)] px-2">
                      Filter by Category
                    </div>
                    <button
                      onClick={() => {
                        setSelectedCategory('all');
                        setShowCategoryFilter(false);
                      }}
                      className={`w-full flex items-center justify-between px-[var(--space-3)] py-2.5 rounded-[var(--radius)] transition-all mb-1 ${
                        selectedCategory === 'all'
                          ? 'bg-primary-700/10 dark:bg-primary-700/20 text-primary-700 dark:text-primary-400'
                          : 'hover:bg-accent text-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-[var(--space-3)]">
                        <FileText className="w-4 h-4" />
                        <span className="text-small font-medium">All Categories</span>
                      </div>
                      <span className="text-caption text-muted-foreground">{documents.length}</span>
                    </button>
                    <div className="my-2 border-t border-border" />
                    {categories.map((category) => {
                      const count = documents.filter(d => d.category === category.id).length;
                      return (
                        <button
                          key={category.id}
                          onClick={() => {
                            setSelectedCategory(category.id);
                            setShowCategoryFilter(false);
                          }}
                          className={`w-full flex items-center justify-between px-[var(--space-3)] py-2.5 rounded-[var(--radius)] transition-all mb-1 ${
                            selectedCategory === category.id
                              ? 'bg-primary-700/10 dark:bg-primary-700/20'
                              : 'hover:bg-accent'
                          }`}
                        >
                          <div className="flex items-center gap-[var(--space-3)]">
                            <div className={`w-2 h-2 rounded-full bg-${category.color}-500`} />
                            <span className="text-small font-medium text-foreground">{category.label}</span>
                          </div>
                          <span className="text-caption text-muted-foreground">{count}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Status Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowStatusFilter(!showStatusFilter);
                  setShowClientFilter(false);
                  setShowPropertyFilter(false);
                  setShowCategoryFilter(false);
                }}
                className={`vybe-filter-btn px-[var(--space-4)] py-2.5 rounded-[var(--radius)] text-small font-medium transition-all flex items-center gap-2 ${
                  selectedStatus !== 'all'
                    ? 'bg-primary-700 text-neutral-0 shadow-[0_4px_12px_rgba(28,117,188,0.3)]'
                    : ''
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                {selectedStatus === 'all' ? 'All Statuses' : (selectedStatus === 'verified' ? 'Verified' : (selectedStatus === 'pending' ? 'Pending' : 'Invalid'))}
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {showStatusFilter && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-card border border-border rounded-[var(--radius)] shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden z-50">
                  <div className="p-3">
                    <div className="vybe-meta-label mb-[var(--space-3)] px-2">
                      Filter by Status
                    </div>
                    <button
                      onClick={() => {
                        setSelectedStatus('all');
                        setShowStatusFilter(false);
                      }}
                      className={`w-full flex items-center justify-between px-[var(--space-3)] py-2.5 rounded-[var(--radius)] transition-all mb-1 ${
                        selectedStatus === 'all'
                          ? 'bg-primary-700/10 dark:bg-primary-700/20 text-primary-700 dark:text-primary-400'
                          : 'hover:bg-accent text-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-[var(--space-3)]">
                        <FileText className="w-4 h-4" />
                        <span className="text-small font-medium">All Statuses</span>
                      </div>
                      <span className="text-caption text-muted-foreground">{documents.length}</span>
                    </button>
                    <div className="my-2 border-t border-border" />
                    <button
                      onClick={() => {
                        setSelectedStatus('verified');
                        setShowStatusFilter(false);
                      }}
                      className={`w-full flex items-center justify-between px-[var(--space-3)] py-2.5 rounded-[var(--radius)] transition-all mb-1 ${
                        selectedStatus === 'verified'
                          ? 'bg-primary-700/10 dark:bg-primary-700/20'
                          : 'hover:bg-accent'
                      }`}
                    >
                      <div className="flex items-center gap-[var(--space-3)]">
                        <CheckCircle2 className="w-4 h-4 text-primary-700 dark:text-primary-400" />
                        <span className="text-small font-medium">Verified</span>
                      </div>
                      <span className="text-caption text-muted-foreground">{documents.filter(d => d.verified && !d.isInvalid).length}</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedStatus('pending');
                        setShowStatusFilter(false);
                      }}
                      className={`w-full flex items-center justify-between px-[var(--space-3)] py-2.5 rounded-[var(--radius)] transition-all mb-1 ${
                        selectedStatus === 'pending'
                          ? 'bg-primary-700/10 dark:bg-primary-700/20'
                          : 'hover:bg-accent'
                      }`}
                    >
                      <div className="flex items-center gap-[var(--space-3)]">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-small font-medium">Pending</span>
                      </div>
                      <span className="text-caption text-muted-foreground">{documents.filter(d => !d.verified && !d.isInvalid).length}</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedStatus('invalid');
                        setShowStatusFilter(false);
                      }}
                      className={`w-full flex items-center justify-between px-[var(--space-3)] py-2.5 rounded-[var(--radius)] transition-all mb-1 ${
                        selectedStatus === 'invalid'
                          ? 'bg-primary-700/10 dark:bg-primary-700/20'
                          : 'hover:bg-accent'
                      }`}
                    >
                      <div className="flex items-center gap-[var(--space-3)]">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <span className="text-small font-medium">Invalid</span>
                      </div>
                      <span className="text-caption text-muted-foreground">{documents.filter(d => d.isInvalid).length}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Active Filters Count */}
            {(selectedClient !== 'all' || selectedProperty !== 'all' || selectedCategory !== 'all' || selectedStatus !== 'all') && (
              <div className="flex items-center gap-2">
                <div className="h-6 w-px bg-border" />
                <button
                  onClick={() => {
                    setSelectedClient('all');
                    setSelectedProperty('all');
                    setSelectedCategory('all');
                    setSelectedStatus('all');
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
          <div className="flex items-center gap-[var(--space-4)]">
            <div className="text-small text-muted-foreground">
              <span className="font-medium text-foreground">{filteredDocuments.length}</span> documents
            </div>
            <div className="flex items-center gap-2 bg-muted border border-border rounded-[var(--radius)] p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded transition-all ${
                  viewMode === 'table'
                    ? 'bg-primary-700 text-neutral-0 shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-all ${
                  viewMode === 'grid'
                    ? 'bg-primary-700 text-neutral-0 shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Documents List - Table View */}
      {viewMode === 'table' && (
        <div className="vybe-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="vybe-table-head text-left px-[var(--space-6)] py-[var(--space-4)]">Document</th>
                <th className="vybe-table-head text-left px-[var(--space-6)] py-[var(--space-4)]">Property / Client</th>
                <th className="vybe-table-head text-left px-[var(--space-6)] py-[var(--space-4)]">Category / Date</th>
                <th className="vybe-table-head text-left px-[var(--space-6)] py-[var(--space-4)]">Uploaded By / Status</th>
                <th className="vybe-table-head text-right px-[var(--space-6)] py-[var(--space-4)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.map((doc) => {
                const property = getPropertyDetails(doc.propertyId);
                const client = property ? getClientDetails(property.clientId) : null;

                return (
                  <tr
                    key={doc.id}
                    className="border-b border-border hover:bg-accent transition-colors"
                  >
                    {/* Document */}
                    <td className="px-[var(--space-6)] py-[var(--space-4)]">
                      <div className="flex items-center gap-[var(--space-3)]">
                        <button onClick={() => toggleStar(doc.id)} className="shrink-0">
                          <Star className={`w-4 h-4 ${doc.isStarred ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground hover:text-yellow-500'}`} />
                        </button>
                        {getFileIcon(doc.type)}
                        <div className="min-w-0">
                          <div className="text-small text-foreground font-medium truncate">{doc.name}</div>
                          <div className="text-caption text-muted-foreground">{doc.size}</div>
                        </div>
                      </div>
                    </td>
                    {/* Property / Client */}
                    <td className="px-[var(--space-6)] py-[var(--space-4)]">
                      <div className="text-small text-foreground">{property?.name}</div>
                      <div className="text-caption text-muted-foreground mt-0.5">{client?.name}</div>
                    </td>
                    {/* Category / Date */}
                    <td className="px-[var(--space-6)] py-[var(--space-4)]">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-caption font-medium bg-${getCategoryColor(doc.category)}-500/10 text-${getCategoryColor(doc.category)}-700 dark:text-${getCategoryColor(doc.category)}-400`}>
                        {doc.category}
                      </span>
                      <div className="flex items-center gap-1.5 mt-1.5 text-caption text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {doc.uploadDate}
                      </div>
                    </td>
                    {/* Uploaded By / Status */}
                    <td className="px-[var(--space-6)] py-[var(--space-4)]">
                      <div className="flex items-center gap-1.5 text-small text-foreground">
                        <User className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        {doc.uploadedBy}
                      </div>
                      <div className="mt-1.5">
                        {doc.isInvalid ? (
                          <span className="vybe-badge vybe-badge-red"><AlertCircle className="w-3 h-3" />Invalid</span>
                        ) : doc.verified ? (
                          <span className="vybe-badge vybe-badge-green"><CheckCircle2 className="w-3 h-3" />Verified</span>
                        ) : (
                          <span className="vybe-badge vybe-badge-muted"><Clock className="w-3 h-3" />Pending</span>
                        )}
                      </div>
                    </td>
                    {/* Actions */}
                    <td className="px-[var(--space-6)] py-[var(--space-4)]">
                      <div className="flex items-center justify-end gap-1.5">
                        {(currentUser.role === 'admin' || currentUser.role === 'operator') && !doc.isInvalid && !doc.verified && (
                          <button
                            onClick={() => handleVerifyDocument(doc)}
                            className="vybe-badge vybe-badge-green cursor-pointer hover:opacity-80 transition-opacity"
                            title="Verify document"
                          >
                            <CheckCircle2 className="w-3 h-3" />Verify
                          </button>
                        )}
                        {(currentUser.role === 'admin' || currentUser.role === 'operator') && !doc.isInvalid && (
                          <button
                            onClick={() => handleInvalidateDocument(doc)}
                            className="vybe-badge vybe-badge-red cursor-pointer hover:opacity-80 transition-opacity"
                            title="Mark as invalid"
                          >
                            <AlertCircle className="w-3 h-3" />Invalid
                          </button>
                        )}
                        <button onClick={() => setViewingDocument(doc)} className="vybe-icon-btn" title="View document">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="vybe-icon-btn" title="Download document">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredDocuments.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-[var(--space-4)]" />
              <p className="text-small text-muted-foreground">
                No documents found. Try adjusting your filters.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Documents List - Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[var(--space-4)]">
          {filteredDocuments.map((doc) => {
            const property = getPropertyDetails(doc.propertyId);
            const client = property ? getClientDetails(property.clientId) : null;

            return (
              <div
                key={doc.id}
                className="vybe-card-padded hover:border-primary-700/30 transition-all group"
              >
                <div className="flex items-start justify-between mb-[var(--space-4)]">
                  {getFileIcon(doc.type)}
                  <button
                    onClick={() => toggleStar(doc.id)}
                    className="flex-shrink-0"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        doc.isStarred
                          ? 'fill-yellow-500 text-yellow-500'
                          : 'text-muted-foreground hover:text-yellow-500'
                      }`}
                    />
                  </button>
                </div>

                <h3 className="text-small font-medium text-foreground mb-1 line-clamp-2">
                  {doc.name}
                </h3>

                <p className="text-caption text-muted-foreground mb-1 line-clamp-1">
                  {property?.name}
                </p>

                <p className="text-caption text-muted-foreground mb-[var(--space-3)]">
                  {client?.name} ({client?.id})
                </p>

                <div className="flex items-center justify-between mb-[var(--space-3)]">
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full text-caption font-medium bg-${getCategoryColor(doc.category)}-500/10 text-${getCategoryColor(doc.category)}-700 dark:text-${getCategoryColor(doc.category)}-400`}
                  >
                    {doc.category}
                  </span>
                  <span className="text-caption text-muted-foreground">{doc.size}</span>
                </div>

                <div className="flex items-center gap-2 mb-[var(--space-4)] pb-[var(--space-4)] border-b border-border">
                  {doc.isInvalid ? (
                    <>
                      <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                      <span className="text-caption text-red-500 font-medium">Invalid</span>
                    </>
                  ) : doc.verified ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary-700 dark:text-primary-400" />
                      <span className="text-caption text-primary-700 dark:text-primary-400 font-medium">Verified</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-caption text-muted-foreground">Pending</span>
                    </>
                  )}
                  <span className="text-caption text-muted-foreground ml-auto">
                    {doc.uploadDate}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Only Admin and Operations Manager can verify/invalidate */}
                  {(currentUser.role === 'admin' || currentUser.role === 'operator') && !doc.isInvalid && !doc.verified ? (
                    <>
                      <button
                        onClick={() => handleVerifyDocument(doc)}
                        className="flex-1 px-[var(--space-3)] py-2 bg-primary text-primary-foreground hover:opacity-90 rounded-[var(--radius)] text-caption font-medium transition-colors flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verify
                      </button>
                      <button
                        onClick={() => handleInvalidateDocument(doc)}
                        className="px-[var(--space-3)] py-2 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 rounded-[var(--radius)] transition-colors"
                        title="Mark as invalid"
                      >
                        <AlertCircle className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setViewingDocument(doc)}
                      className="flex-1 px-[var(--space-3)] py-2 bg-primary-700/10 text-primary-700 dark:text-primary-400 hover:bg-primary-700/20 rounded-[var(--radius)] text-caption font-medium transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>
                  )}
                  <button
                    className="px-[var(--space-3)] py-2 bg-muted hover:bg-accent rounded-[var(--radius)] transition-colors"
                    title="Download"
                  >
                    <Download className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {viewMode === 'grid' && filteredDocuments.length === 0 && (
        <div className="text-center py-12 vybe-card">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-[var(--space-4)]" />
          <p className="text-small text-muted-foreground">
            No documents found. Try adjusting your filters.
          </p>
        </div>
      )}
    </AdminLayout>
  );
}