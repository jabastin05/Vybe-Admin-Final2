import { Link, useParams, useNavigate } from 'react-router';
import { useCases } from '../contexts/CasesContext';
import { useProperties } from '../contexts/PropertiesContext';
import { ArrowLeft, FileText, MapPin, Calendar, CheckCircle2, Clock, Users, MessageCircle, X, Search, ChevronDown, Download, Upload, Eye } from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { useState, useEffect } from 'react';
import { MOCK_SERVICE_PROVIDERS, getServiceProviderName, resolveServiceProviderIdentity } from '../data/mockServiceProviders';

const CASE_STATUSES = [
  'Case submitted',
  'Document reviewed',
  'Partner assigned',
  'Application filling',
  'Authority follow-up',
  'Case closed'
] as const;

const SERVICE_PROVIDERS = MOCK_SERVICE_PROVIDERS.map((provider) => ({
  id: provider.id,
  name: getServiceProviderName(provider),
  role: provider.role,
}));

export function AdminCaseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cases, getCase, updateCase } = useCases();
  const { getProperty } = useProperties();
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Status change modal states
  const [isStatusChangeModalOpen, setIsStatusChangeModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusChangeComments, setStatusChangeComments] = useState('');
  
  // Partner assignment modal states
  const [isPartnerAssignmentModalOpen, setIsPartnerAssignmentModalOpen] = useState(false);
  const [newPartnerName, setNewPartnerName] = useState('');
  const [partnerSearchQuery, setPartnerSearchQuery] = useState('');

  
  // Document section states
  const [isUploadDocumentModalOpen, setIsUploadDocumentModalOpen] = useState(false);
  const [selectedUploadFile, setSelectedUploadFile] = useState<File | null>(null);
  const [uploadDocumentLabel, setUploadDocumentLabel] = useState('');
  
  const [successMessage, setSuccessMessage] = useState('');

  // Get current user role and details
  const getCurrentUser = () => {
    const userData = localStorage.getItem('vybeAdminUser');
    if (userData) {
      const user = JSON.parse(userData);
      const normalizedName = user.role === 'partner'
        ? resolveServiceProviderIdentity(user.email || '', user.name)
        : user.name || 'Admin User';
      return { 
        role: user.role || 'admin', 
        email: user.email || '',
        name: normalizedName
      };
    }
    return { role: 'admin', email: '', name: 'Admin User' };
  };

  const currentUser = getCurrentUser();

  const caseItem = getCase(id || '');

  // Auto-migrate old cases without milestones - convert to new status-based system
  useEffect(() => {
    if (caseItem && (!caseItem.milestones || caseItem.milestones.length === 0)) {
      console.log('Migrating case to new status system:', caseItem.caseId);
      const defaultMilestones = CASE_STATUSES.map((status, index) => ({
        id: `${index + 1}`,
        title: status,
        status: (index === 0 ? 'completed' : 'pending') as const,
        date: index === 0 ? new Date(caseItem.dateCreated).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : undefined
      }));

      const completedCount = defaultMilestones.filter(m => m.status === 'completed').length;
      const progress = Math.round((completedCount / defaultMilestones.length) * 100);

      updateCase(caseItem.id, {
        milestones: defaultMilestones,
        progress,
      });
    }
  }, [caseItem?.id]);

  if (!caseItem) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-[24px] text-black dark:text-white mb-4">Case not found</h2>
            <Link 
              to="/admin/cases"
              className="text-emerald-500 hover:text-emerald-400 text-[14px] font-medium"
            >
              Back to Case Management
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const property = caseItem.propertyId ? getProperty(caseItem.propertyId) : null;
  const caseDocuments = caseItem.documents || [];

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const readFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });

  const handleDocumentDownload = (documentName: string, dataUrl?: string) => {
    if (!dataUrl) {
      showSuccess('Preview file not available for this mock document yet');
      return;
    }

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = documentName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleStatusChange = () => {
    setNewStatus(getCurrentStatus());
    setStatusChangeComments('');
    setIsStatusChangeModalOpen(true);
  };

  const handleSaveStatusChange = () => {
    if (!caseItem || !statusChangeComments.trim()) {
      alert('Please provide comments for the status change');
      return;
    }

    const statusUpdate = {
      id: `status-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: newStatus,
      comments: statusChangeComments,
      changedBy: 'admin' as const,
      changedByName: 'Admin Team',
      changeType: 'status' as const
    };

    // Update milestones based on status
    const statusIndex = CASE_STATUSES.indexOf(newStatus as any);
    const updatedMilestones = caseItem.milestones?.map((milestone, index) => ({
      ...milestone,
      status: (index <= statusIndex ? 'completed' : 'pending') as const,
      date: index === statusIndex ? new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : milestone.date
    })) || [];

    const completedCount = updatedMilestones.filter(m => m.status === 'completed').length;
    const progress = Math.round((completedCount / updatedMilestones.length) * 100);
    const newCaseStatus = newStatus === 'Case closed' ? 'Closed' : 'Open';
    const dateClosed = newCaseStatus === 'Closed' ? new Date().toISOString() : undefined;

    updateCase(caseItem.id, {
      status: newCaseStatus as 'Open' | 'Closed',
      milestones: updatedMilestones,
      progress,
      dateClosed,
      statusHistory: [...(caseItem.statusHistory || []), statusUpdate]
    });

    setIsStatusChangeModalOpen(false);
    setNewStatus('');
    setStatusChangeComments('');
    showSuccess('Case status updated successfully');
  };

  const handlePartnerAssignment = () => {
    setNewPartnerName(caseItem.partnerName || '');
    setPartnerSearchQuery('');
    setIsPartnerAssignmentModalOpen(true);
  };

  const handleSavePartnerAssignment = () => {
    if (!caseItem || !newPartnerName.trim()) {
      alert('Please select a partner');
      return;
    }

    const partnerAssignmentUpdate = {
      id: `partner-${Date.now()}`,
      timestamp: new Date().toISOString(),
      partnerName: newPartnerName,
      comments: `Service Provider assigned: ${newPartnerName}`,
      changedBy: 'admin' as const,
      changedByName: 'Admin Team',
      changeType: 'partner-assignment' as const
    };

    // Auto-update status to "Partner assigned" when a partner is assigned
    const statusIndex = CASE_STATUSES.indexOf('Partner assigned');
    const updatedMilestones = caseItem.milestones?.map((milestone, index) => ({
      ...milestone,
      status: (index <= statusIndex ? 'completed' : 'pending') as const,
      date: index === statusIndex ? new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : milestone.date
    })) || [];

    const completedCount = updatedMilestones.filter(m => m.status === 'completed').length;
    const progress = Math.round((completedCount / updatedMilestones.length) * 100);

    updateCase(caseItem.id, {
      partnerName: newPartnerName,
      milestones: updatedMilestones,
      progress,
      statusHistory: [...(caseItem.statusHistory || []), partnerAssignmentUpdate]
    });

    setIsPartnerAssignmentModalOpen(false);
    setNewPartnerName('');
    setPartnerSearchQuery('');
    showSuccess('Service Provider assigned successfully');
  };

  const handleUploadDocument = async () => {
    if (!selectedUploadFile) {
      alert('Please choose a file to upload');
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(selectedUploadFile);
      const uploadName = uploadDocumentLabel.trim() || selectedUploadFile.name;
      const uploadedDate = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      const newDoc = {
        id: `doc-upload-${Date.now()}`,
        name: uploadName,
        size: `${(selectedUploadFile.size / 1024 / 1024).toFixed(2)} MB`,
        uploadedDate,
        type: selectedUploadFile.type || 'application/octet-stream',
        status: 'uploaded' as const,
        uploadedByName: currentUser.name,
        uploadedByRole: 'partner' as const,
        dataUrl,
      };

      const uploadUpdate = {
        id: `timeline-upload-${Date.now()}`,
        timestamp: new Date().toISOString(),
        comments: `Document uploaded: ${uploadName}`,
        changedBy: 'partner' as const,
        changedByName: currentUser.name,
        changeType: 'document-upload' as const,
      };

      updateCase(caseItem.id, {
        documents: [...caseDocuments.filter((doc) => doc.name !== uploadName || doc.status !== 'requested'), newDoc],
        statusHistory: [...(caseItem.statusHistory || []), uploadUpdate],
      });

      setIsUploadDocumentModalOpen(false);
      setSelectedUploadFile(null);
      setUploadDocumentLabel('');
      showSuccess('Document uploaded successfully');
    } catch (error) {
      console.error('Error uploading document', error);
      alert('Unable to process this file. Please try another file.');
    }
  };

  const getCurrentStatus = () => {
    const currentMilestone = caseItem.milestones?.find(m => m.status === 'pending');
    return currentMilestone?.title || CASE_STATUSES[CASE_STATUSES.length - 1];
  };

  const getServiceColor = (service: string) => {
    switch (service) {
      case 'HABU Report':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
      case 'Property Service':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'Lease & Rent':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'Sell or Liquidate':
        return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20';
    }
  };

  return (
    <AdminLayout>
      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5" />
          {successMessage}
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <Link
          to="/admin/cases"
          className="inline-flex items-center gap-2 text-[14px] text-black/60 dark:text-white/60
                     hover:text-black dark:hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Case Management
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <div className="text-caption text-muted-foreground uppercase tracking-wider mb-2">
              Case Details
            </div>
            <h1 className="text-h1 text-foreground leading-none mb-3">
              {caseItem.caseId}
            </h1>
            
            {/* Service Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius-sm)] border text-caption font-medium ${
              getServiceColor(caseItem.serviceRequested)
            }`}>
              <FileText className="w-4 h-4" />
              {caseItem.subService || caseItem.serviceRequested}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Chat Button */}
            <button
              onClick={() => navigate(`/admin/cases/${id}/chat`)}
              className="flex items-center gap-2 h-[var(--button-height-desktop)] px-[var(--space-5)] bg-emerald-500 hover:opacity-90
                         text-white rounded-[var(--radius-button)] transition-all text-small font-medium
                         shadow-[0_4px_12px_rgba(16,185,129,0.3)] hover:shadow-[0_6px_16px_rgba(16,185,129,0.4)]
                         relative"
            >
              <MessageCircle className="w-4 h-4" />
              Chat
              {caseItem.unreadMessages && caseItem.unreadMessages > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold 
                               rounded-full w-5 h-5 flex items-center justify-center
                               shadow-lg animate-pulse">
                  {caseItem.unreadMessages}
                </span>
              )}
            </button>

            {/* Status Badge */}
            <div className={`vybe-badge flex items-center gap-2 px-[var(--space-5)] rounded-[var(--radius-sm)] border ${
              caseItem.status === 'Open'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                : 'bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60 border-black/10 dark:border-white/10'
            }`}>
              {caseItem.status === 'Open' ? (
                <Clock className="w-5 h-5" />
              ) : (
                <CheckCircle2 className="w-5 h-5" />
              )}
              <span className="text-small font-medium">{caseItem.status}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Actions - Hidden for Service Providers */}
      {currentUser.role !== 'partner' && (
        <div className="grid grid-cols-2 gap-[var(--space-4)] mb-[var(--space-6)]">
          <button
            onClick={handleStatusChange}
            className="px-[var(--space-6)] py-[var(--space-4)] vybe-card hover:bg-emerald-500/5 hover:border-emerald-500/20 transition-all"
          >
            <div className="flex items-center gap-[var(--space-3)]">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="text-left">
                <div className="text-caption text-muted-foreground uppercase tracking-wide">
                  Change Status
                </div>
                <div className="text-small font-medium text-foreground">
                  Update Case Status
                </div>
              </div>
            </div>
          </button>

          <button
            onClick={handlePartnerAssignment}
            className="px-[var(--space-6)] py-[var(--space-4)] vybe-card hover:bg-purple-500/5 hover:border-purple-500/20 transition-all"
          >
            <div className="flex items-center gap-[var(--space-3)]">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-500" />
              </div>
              <div className="text-left">
                <div className="text-caption text-muted-foreground uppercase tracking-wide">
                  {caseItem.partnerName ? 'Change Service Provider' : 'Assign Service Provider'}
                </div>
                <div className="text-small font-medium text-foreground">
                  {caseItem.partnerName || 'No Service Provider Assigned'}
                </div>
              </div>
            </div>
          </button>

        </div>
      )}

      {/* Case Progress */}
      {caseItem.milestones && caseItem.milestones.length > 0 && (
        <div className="vybe-card-padded mb-[var(--space-6)]">
          <div className="flex items-center justify-between mb-[var(--space-8)]">
            <h2 className="text-small font-medium text-foreground">
              Case Progress
            </h2>
            <div className="text-small text-muted-foreground">
              {caseItem.progress || 0}% complete
            </div>
          </div>

          {/* Horizontal Progress Tracker */}
          <div className="relative">
            {/* Desktop: Horizontal Layout */}
            <div className="hidden lg:block">
              <div className="relative flex items-start justify-between mb-4">
                {/* Background Line */}
                <div className="absolute top-[12px] left-0 right-0 h-[2px] bg-black/5 dark:bg-white/5" />
                
                {/* Progress Line */}
                <div 
                  className="absolute top-[12px] left-0 h-[2px] bg-black dark:bg-white transition-all duration-500"
                  style={{ width: `${caseItem.progress || 0}%` }}
                />

                {/* Milestones */}
                {caseItem.milestones.map((milestone, index) => (
                  <div 
                    key={milestone.id} 
                    className="relative flex flex-col items-center"
                    style={{ width: `${100 / caseItem.milestones!.length}%` }}
                  >
                    {/* Status Circle */}
                    <div
                      className={`
                        relative z-10 w-6 h-6 rounded-full flex-shrink-0 transition-all duration-300 mb-3
                        ${milestone.status === 'completed'
                          ? 'bg-black dark:bg-white shadow-lg'
                          : 'bg-white dark:bg-[#111111] border-2 border-black/10 dark:border-white/10'
                        }
                      `}
                    >
                      {milestone.status === 'completed' && (
                        <CheckCircle2 className="w-full h-full p-1 text-white dark:text-black" />
                      )}
                    </div>

                    {/* Label */}
                    <div className="text-center px-2">
                      <div className={`text-[12px] font-medium mb-1 ${
                        milestone.status === 'completed'
                          ? 'text-black dark:text-white'
                          : 'text-black/40 dark:text-white/40'
                      }`}>
                        {milestone.title}
                      </div>
                      {milestone.date && (
                        <div className="text-[10px] text-black/40 dark:text-white/40">
                          {milestone.date}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile: Vertical Layout */}
            <div className="lg:hidden space-y-4">
              {caseItem.milestones.map((milestone, index) => (
                <div key={milestone.id} className="relative flex items-start gap-4">
                  {/* Timeline Line */}
                  {index !== caseItem.milestones!.length - 1 && (
                    <div className="absolute left-[11px] top-[28px] bottom-[-16px] w-[2px] bg-black/5 dark:bg-white/5" />
                  )}

                  {/* Status Circle */}
                  <div
                    className={`
                      relative z-10 w-6 h-6 rounded-full flex-shrink-0 transition-all duration-300
                      ${milestone.status === 'completed'
                        ? 'bg-black dark:bg-white shadow-lg'
                        : 'bg-white dark:bg-[#111111] border-2 border-black/10 dark:border-white/10'
                      }
                    `}
                  >
                    {milestone.status === 'completed' && (
                      <CheckCircle2 className="w-full h-full p-1 text-white dark:text-black" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-4">
                    <div className={`text-[13px] font-medium mb-1 ${
                      milestone.status === 'completed'
                        ? 'text-black dark:text-white'
                        : 'text-black/40 dark:text-white/40'
                    }`}>
                      {milestone.title}
                    </div>
                    {milestone.date && (
                      <div className="text-[11px] text-black/40 dark:text-white/40">
                        {milestone.date}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Combined Case Timeline - All Changes */}
      <div className="vybe-card-padded mb-[var(--space-6)]">
        <h2 className="text-small font-medium text-foreground mb-[var(--space-6)]">
          Case Timeline
        </h2>
        
        <div className="space-y-[var(--space-4)]">
          {/* Show status history if available */}
          {caseItem.statusHistory && caseItem.statusHistory.length > 0 ? (
            caseItem.statusHistory
              .slice()
              .reverse()
              .map((change, index) => (
                <div key={change.id} className="relative flex gap-4">
                  {/* Timeline Line */}
                  {index !== caseItem.statusHistory!.length - 1 && (
                    <div className="absolute left-[11px] top-[28px] bottom-[-16px] w-[2px] bg-black/5 dark:bg-white/5" />
                  )}
                  
                  {/* Icon */}
                  <div className="relative z-10 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {change.changeType === 'status' && (
                      <Clock className="w-3 h-3 text-white" />
                    )}
                    {change.changeType === 'partner-assignment' && (
                      <Users className="w-3 h-3 text-white" />
                    )}
                    {change.changeType === 'document-upload' && (
                      <Upload className="w-3 h-3 text-white" />
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 pb-[var(--space-4)]">
                    <div className="bg-muted border border-border rounded-xl p-[var(--space-4)]">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          {change.changeType === 'status' && (
                            <div className="text-small font-medium text-foreground">
                              Status changed to {change.status}
                            </div>
                          )}
                          {change.changeType === 'partner-assignment' && (
                            <div className="text-small font-medium text-foreground">
                              Partner {change.partnerName ? `assigned: ${change.partnerName}` : 'assignment updated'}
                            </div>
                          )}
                          {change.changeType === 'document-upload' && (
                            <div className="text-small font-medium text-foreground">
                              Document uploaded
                            </div>
                          )}
                          <div className="text-caption text-muted-foreground mt-1">
                            {new Date(change.timestamp).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                        
                        <div className={`px-[var(--space-3)] py-1 rounded-lg text-caption font-medium ${
                          change.changedBy === 'admin'
                            ? 'vybe-badge-purple'
                            : 'vybe-badge-blue'
                        }`}>
                          {change.changedBy === 'admin' ? 'Admin' : 'Partner'}
                        </div>
                      </div>

                      <div className="text-small text-muted-foreground mt-[var(--space-3)]">
                        {change.comments}
                      </div>

                      <div className="text-caption text-muted-foreground mt-2">
                        Changed by: {change.changedByName}
                      </div>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <div className="flex items-start gap-[var(--space-3)]">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4 text-emerald-500" />
              </div>
              <div>
                <div className="text-small text-foreground font-medium mb-1">
                  Case Created
                </div>
                <div className="text-caption text-muted-foreground">
                  {new Date(caseItem.dateCreated).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Show case closed if applicable */}
          {caseItem.dateClosed && (
            <div className="relative flex gap-[var(--space-4)]">
              <div className="relative z-10 w-6 h-6 rounded-full bg-black dark:bg-white flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle2 className="w-3 h-3 text-white dark:text-black" />
              </div>

              <div className="flex-1">
                <div className="bg-muted border border-border rounded-xl p-[var(--space-4)]">
                  <div className="text-small font-medium text-foreground mb-1">
                    Case Closed
                  </div>
                  <div className="text-caption text-muted-foreground">
                    {new Date(caseItem.dateClosed).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Property Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--space-6)]">
        {/* Left Column - Property Details */}
        <div className="vybe-card-padded">
          <h2 className="vybe-meta-label mb-[var(--space-6)]">
            Property Information
          </h2>

          <div className="space-y-[var(--space-6)]">
            <div>
              <div className="vybe-label mb-2">
                Property Name
              </div>
              <div className="text-small text-foreground font-medium">
                {caseItem.propertyName}
              </div>
            </div>

            <div>
              <div className="vybe-label mb-2">
                Location
              </div>
              <div className="flex items-center gap-2 text-small text-foreground">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                {caseItem.propertyLocation}
              </div>
            </div>

            {caseItem.userName && (
              <div>
                <div className="vybe-label mb-2">
                  Client Name
                </div>
                <div className="text-small text-foreground font-medium">
                  {caseItem.userName}
                </div>
              </div>
            )}

            {caseItem.partnerName && (
              <div>
                <div className="vybe-label mb-2">
                  Assigned Service Provider
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <Users className="w-4 h-4 text-purple-500" />
                  </div>
                  <div className="text-small text-foreground font-medium">
                    {caseItem.partnerName}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Case Metadata */}
        <div className="vybe-card-padded">
          <h2 className="vybe-meta-label mb-[var(--space-6)]">
            Case Information
          </h2>

          <div className="space-y-[var(--space-6)]">
            <div>
              <div className="vybe-label mb-2">
                Service Type
              </div>
              <div className="text-small text-foreground font-medium">
                {caseItem.subService || caseItem.serviceRequested}
              </div>
            </div>

            <div>
              <div className="vybe-label mb-2">
                Date Created
              </div>
              <div className="flex items-center gap-2 text-small text-foreground">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                {new Date(caseItem.dateCreated).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
            </div>

            {caseItem.dateClosed && (
              <div>
                <div className="vybe-label mb-2">
                  Date Closed
                </div>
                <div className="flex items-center gap-2 text-small text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                  {new Date(caseItem.dateClosed).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Case Documents Section */}
      <div className="vybe-card-padded mt-[var(--space-6)] mb-[var(--space-6)]">
        <div className="flex items-center justify-between mb-[var(--space-6)]">
          <h2 className="text-small font-medium text-foreground">
            Case Documents
          </h2>
          {currentUser.role === 'partner' && (
            <div className="flex items-center gap-[var(--space-3)]">
              <button
                onClick={() => setIsUploadDocumentModalOpen(true)}
                className="h-[var(--button-height-desktop)] px-[var(--space-4)] bg-primary hover:opacity-90 text-primary-foreground rounded-[var(--radius-button)] transition-all text-small font-medium flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload Document
              </button>
            </div>
          )}
        </div>

        {caseDocuments.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-border rounded-[var(--radius-card)]">
            <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-small text-muted-foreground">
              No case documents have been added yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--space-4)]">
            {caseDocuments.map((doc) => (
              <div key={doc.id} className="relative group bg-muted border border-border rounded-[var(--radius)] p-[var(--space-4)] hover:border-emerald-500/30 transition-all">
                <div className="flex items-start gap-[var(--space-3)]">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    doc.status === 'requested'
                      ? 'bg-amber-500/10 text-amber-500'
                      : 'bg-emerald-500/10 text-emerald-500'
                  }`}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-small font-medium text-foreground mb-1 pr-6">
                      {doc.name}
                    </div>
                    <div className="text-caption text-muted-foreground">
                      {doc.uploadedDate} • {doc.size}
                    </div>
                    {(doc.uploadedByName || doc.uploadedByRole) && (
                      <div className="text-caption text-muted-foreground mt-1">
                        Uploaded by {doc.uploadedByName || 'Team'}{doc.uploadedByRole ? ` (${doc.uploadedByRole})` : ''}
                      </div>
                    )}
                    <div className="mt-[var(--space-3)] flex items-center justify-between gap-2">
                      <span className="vybe-badge vybe-badge-green inline-flex items-center px-2 py-0.5 rounded-[var(--radius-sm)] text-caption font-bold uppercase tracking-wider">
                        {doc.status || 'uploaded'}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => doc.dataUrl && window.open(doc.dataUrl, '_blank')}
                          disabled={!doc.dataUrl}
                          className="p-2 rounded-lg border border-border text-muted-foreground hover:text-emerald-500 hover:border-emerald-500/30 disabled:opacity-40 disabled:cursor-not-allowed"
                          aria-label={`Preview ${doc.name}`}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDocumentDownload(doc.name, doc.dataUrl)}
                          disabled={!doc.dataUrl}
                          className="p-2 rounded-lg border border-border text-muted-foreground hover:text-emerald-500 hover:border-emerald-500/30 disabled:opacity-40 disabled:cursor-not-allowed"
                          aria-label={`Download ${doc.name}`}
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Document Modal */}
      {isUploadDocumentModalOpen && (
        <div className="vybe-modal-overlay flex items-center justify-center p-4 z-50">
          <div className="vybe-modal w-full overflow-hidden">
            <div className="vybe-modal-header border-b border-border p-[var(--space-6)]">
              <div className="flex items-center justify-between">
                <h3 className="text-h3 font-medium text-foreground">
                  Upload Case Document
                </h3>
                <button
                  onClick={() => setIsUploadDocumentModalOpen(false)}
                  className="vybe-icon-btn p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-[var(--space-6)] space-y-[var(--space-4)]">
              <div>
                <label className="vybe-label mb-2">
                  Document Label
                </label>
                <input
                  type="text"
                  value={uploadDocumentLabel}
                  onChange={(e) => setUploadDocumentLabel(e.target.value)}
                  placeholder="Defaults to the selected file name"
                  className="vybe-input w-full"
                />
              </div>

              <div>
                <label className="vybe-label mb-2">
                  Select File *
                </label>
                <input
                  type="file"
                  onChange={(e) => setSelectedUploadFile(e.target.files?.[0] || null)}
                  className="vybe-input w-full"
                />
                {selectedUploadFile && (
                  <div className="text-caption text-muted-foreground mt-2">
                    {selectedUploadFile.name} • {(selectedUploadFile.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                )}
              </div>
            </div>

            <div className="p-[var(--space-6)] border-t border-border flex gap-[var(--space-3)]">
              <button
                onClick={() => setIsUploadDocumentModalOpen(false)}
                className="flex-1 h-[var(--button-height-desktop)] bg-muted hover:bg-accent text-foreground rounded-[var(--radius-button)] text-small font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadDocument}
                className="flex-1 h-[var(--button-height-desktop)] bg-primary hover:opacity-90 text-primary-foreground rounded-[var(--radius-button)] text-small font-medium transition-all"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Change Modal */}
      {isStatusChangeModalOpen && (
        <div className="vybe-modal-overlay">
          <div className="vybe-modal vybe-modal-wide" style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div className="vybe-modal-header shrink-0" style={{ padding: 'var(--card-padding-desktop)', borderBottom: '1px solid var(--border)', marginBottom: 0 }}>
              <h3 className="text-h3 font-medium text-foreground">
                Change Case Status
              </h3>
              <button
                onClick={() => setIsStatusChangeModalOpen(false)}
                className="vybe-icon-btn p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1" style={{ padding: 'var(--card-padding-desktop)' }}>
            <div className="space-y-[var(--space-4)]">
              <div>
                <label className="vybe-label mb-2">
                  Select Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="vybe-input w-full"
                >
                  {CASE_STATUSES.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="vybe-label mb-2">
                  Comments *
                </label>
                <textarea
                  value={statusChangeComments}
                  onChange={(e) => setStatusChangeComments(e.target.value)}
                  placeholder="Provide details about this status change..."
                  rows={4}
                  className="vybe-textarea w-full resize-none"
                />
              </div>
            </div>
            </div>{/* end scrollable body */}

            <div className="flex items-center gap-[var(--space-3)] shrink-0" style={{ padding: 'var(--card-padding-desktop)', borderTop: '1px solid var(--border)' }}>
              <button
                onClick={() => setIsStatusChangeModalOpen(false)}
                className="flex-1 h-[var(--button-height-desktop)] bg-muted hover:bg-accent text-foreground rounded-[var(--radius-button)] text-small font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveStatusChange}
                className="flex-1 h-[var(--button-height-desktop)] bg-primary hover:opacity-90 text-primary-foreground rounded-[var(--radius-button)] text-small font-medium transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Partner Assignment Modal */}
      {isPartnerAssignmentModalOpen && (
        <div className="vybe-modal-overlay">
          <div className="vybe-modal vybe-modal-wide" style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div className="vybe-modal-header shrink-0" style={{ padding: 'var(--card-padding-desktop)', borderBottom: '1px solid var(--border)', marginBottom: 0 }}>
              <h3 className="text-h3 font-medium text-foreground">
                {caseItem.partnerName ? 'Change Service Provider' : 'Assign Service Provider'}
              </h3>
              <button
                onClick={() => setIsPartnerAssignmentModalOpen(false)}
                className="vybe-icon-btn p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1" style={{ padding: 'var(--card-padding-desktop)' }}>
            <div className="space-y-[var(--space-4)]">

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-[var(--space-3)] top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={partnerSearchQuery}
                  onChange={(e) => setPartnerSearchQuery(e.target.value)}
                  placeholder="Search by name or role…"
                  className="w-full h-[var(--input-height)] pl-10 pr-[var(--space-4)] bg-input-background border border-border rounded-[var(--radius)] text-small text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring/40"
                />
              </div>

              {/* Provider cards */}
              <div className="space-y-2 max-h-[380px] overflow-y-auto">
                {MOCK_SERVICE_PROVIDERS
                  .filter(p => {
                    const name = getServiceProviderName(p);
                    return name.toLowerCase().includes(partnerSearchQuery.toLowerCase()) ||
                      p.role.toLowerCase().includes(partnerSearchQuery.toLowerCase());
                  })
                  .map(provider => {
                    const name = getServiceProviderName(provider);
                    const currentLoad = cases.filter(c => c.partnerName === name).length;
                    const isFull = currentLoad >= provider.maxCaseload;
                    return (
                      <button
                        key={provider.id}
                        onClick={() => setNewPartnerName(name)}
                        className={`w-full text-left p-4 rounded-[var(--radius)] border transition-all ${
                          newPartnerName === name
                            ? 'border-emerald-500 bg-emerald-500/5'
                            : 'border-border hover:bg-accent'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-small font-medium text-foreground">{name}</p>
                            <p className="text-caption text-muted-foreground mb-1.5">{provider.role}</p>

                            {/* City coverage chips */}
                            <div className="flex flex-wrap gap-1 mb-1.5">
                              {provider.cityCoverage.map(city => (
                                <span key={city} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                                  {city}
                                </span>
                              ))}
                            </div>

                            {/* Case load bar */}
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden" style={{ width: 80 }}>
                                <div
                                  className={`h-full rounded-full transition-all ${isFull ? 'bg-red-500' : 'bg-emerald-500'}`}
                                  style={{ width: `${Math.min((currentLoad / provider.maxCaseload) * 100, 100)}%` }}
                                />
                              </div>
                              <span className={`text-[10px] font-medium ${isFull ? 'text-red-500' : 'text-muted-foreground'}`}>
                                {currentLoad}/{provider.maxCaseload} cases{isFull ? ' · Full' : ''}
                              </span>
                            </div>
                          </div>

                          {newPartnerName === name && (
                            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <CheckCircle2 className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
              </div>

              <div className="p-[var(--space-4)] bg-emerald-500/5 border border-emerald-500/20 rounded-[var(--radius)]">
                <p className="text-caption text-emerald-600 dark:text-emerald-400">
                  Note: Assigning a service provider will automatically update the case status to &quot;Partner assigned&quot;
                </p>
              </div>
            </div>
            </div>{/* end scrollable body */}

            <div className="flex items-center gap-[var(--space-3)] shrink-0" style={{ padding: 'var(--card-padding-desktop)', borderTop: '1px solid var(--border)' }}>
              <button
                onClick={() => setIsPartnerAssignmentModalOpen(false)}
                className="flex-1 h-[var(--button-height-desktop)] bg-muted hover:bg-accent text-foreground rounded-[var(--radius-button)] text-small font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePartnerAssignment}
                className="flex-1 h-[var(--button-height-desktop)] bg-primary hover:opacity-90 text-primary-foreground rounded-[var(--radius-button)] text-small font-medium transition-all"
              >
                {caseItem.partnerName ? 'Update Service Provider' : 'Assign Service Provider'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
