import { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import { SideNav } from '../components/SideNav';
import { ThemeToggle } from '../components/ThemeToggle';
import { useProperties } from '../contexts/PropertiesContext';
import { 
  Shield, 
  ArrowLeft,
  UploadCloud,
  FileText,
  Building2,
  FolderOpen,
  CheckCircle2,
  X,
  File
} from 'lucide-react';
import { toast } from 'sonner';

export function DocumentUpload() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { properties } = useProperties();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  
  const [uploadType, setUploadType] = useState<'property' | 'independent'>(id ? 'property' : 'property');
  const [selectedProperty, setSelectedProperty] = useState(id || '');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [notes, setNotes] = useState('');

  const categories = [
    'Ownership',
    'Compliance',
    'Financial',
    'Land Records',
    'Utility',
    'Supporting'
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(prev => [...prev, ...Array.from(e.target.files)]);
    }
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (files.length === 0) {
      toast.error('Please select at least one file to upload');
      return;
    }
    
    if (uploadType === 'property') {
      if (!selectedProperty) {
        toast.error('Please select a property');
        return;
      }
      if (!selectedCategory) {
        toast.error('Please select a document category');
        return;
      }
    }

    // Simulate upload process
    toast.success(`${files.length > 1 ? 'Documents' : 'Document'} uploaded successfully!`, {
      description: `Your ${files.length > 1 ? 'documents have' : 'document has'} been securely stored in the vault.`
    });
    
    setTimeout(() => {
      if (id) {
        navigate(`/property/${id}/documents`);
      } else {
        navigate('/documents');
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background dark:bg-neutral-900">
      <SideNav />
      
      {/* Header */}
      <div className="ml-[72px] border-b border-black/[0.06] dark:border-white/[0.08] bg-gradient-to-br from-white via-white to-primary-100/30 dark:from-[#0A0A0A] dark:via-[#0A0A0A] dark:to-primary-900/10 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-[1000px] mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => navigate(id ? `/property/${id}/documents` : '/documents')}
                className="w-10 h-10 rounded-[var(--radius-card)] bg-card dark:bg-neutral-900 border border-black/[0.08] dark:border-white/[0.08] flex items-center justify-center hover:bg-neutral-900/[0.02] dark:hover:bg-card/[0.05] transition-colors shadow-sm"
              >
                <ArrowLeft className="w-5 h-5 text-neutral-700/80 dark:text-neutral-300/80" />
              </button>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <Shield className="w-4 h-4 text-primary-700 dark:text-primary-400" />
                  <h1 className="text-caption tracking-[0.15em] uppercase text-primary-700 dark:text-primary-400 font-medium">
                    Secure Upload
                  </h1>
                </div>
                <div className="text-h2 tracking-tight text-foreground dark:text-neutral-0/95 font-medium">
                  Upload Document
                </div>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-[72px] pb-24">
        <div className="max-w-[1000px] mx-auto px-8 py-8">
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Upload Type Toggle */}
            <div className="flex bg-neutral-900/[0.04] dark:bg-card/[0.04] p-1 rounded-[var(--radius-card)] w-fit mb-8">
              <button
                type="button"
                onClick={() => setUploadType('property')}
                className={`px-6 py-2.5 rounded-[var(--radius)] text-small font-medium transition-all flex items-center gap-2 ${
                  uploadType === 'property' 
                    ? 'bg-card dark:bg-neutral-700 text-foreground dark:text-neutral-0 shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)]' 
                    : 'text-neutral-700/80 dark:text-neutral-300/80 hover:text-foreground dark:hover:text-neutral-0'
                }`}
              >
                <Building2 className="w-4 h-4" />
                Property Specific
              </button>
              <button
                type="button"
                onClick={() => setUploadType('independent')}
                className={`px-6 py-2.5 rounded-[var(--radius)] text-small font-medium transition-all flex items-center gap-2 ${
                  uploadType === 'independent' 
                    ? 'bg-card dark:bg-neutral-700 text-foreground dark:text-neutral-0 shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)]' 
                    : 'text-neutral-700/80 dark:text-neutral-300/80 hover:text-foreground dark:hover:text-neutral-0'
                }`}
              >
                <FolderOpen className="w-4 h-4" />
                Independent
              </button>
            </div>

            {/* File Upload Area */}
            <div className="bg-card/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.08] rounded-[var(--radius-card)] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <h2 className="text-[16px] font-medium text-foreground dark:text-neutral-0 mb-6">File Selection</h2>
              
              <div 
                className={`border-2 border-dashed rounded-[var(--radius-card)] p-12 text-center transition-all ${
                  isDragging 
                    ? 'border-primary-700 bg-primary-700/5 dark:bg-primary-700/10' 
                    : 'border-black/[0.08] dark:border-white/[0.08] hover:border-primary-700/50 hover:bg-neutral-900/[0.02] dark:hover:bg-card/[0.02]'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                  multiple
                />
                <div className="w-16 h-16 rounded-[var(--radius-card)] bg-neutral-900/5 dark:bg-card/5 flex items-center justify-center mx-auto mb-4">
                  <UploadCloud className="w-8 h-8 text-muted-foreground dark:text-neutral-300/60" />
                </div>
                <h3 className="text-[16px] font-medium text-foreground dark:text-neutral-0 mb-2">
                  Click or drag files to upload
                </h3>
                <p className="text-small text-muted-foreground dark:text-neutral-300/60 max-w-sm mx-auto">
                  Supported formats: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG. Multiple files allowed. Maximum file size 50MB per file.
                </p>
              </div>

              {files.length > 0 && (
                <div className="space-y-3 mt-6">
                  {files.map((f, idx) => (
                    <div key={`${f.name}-${idx}`} className="bg-primary-700/5 dark:bg-primary-700/10 border border-primary-700/20 dark:border-primary-700/20 rounded-[var(--radius-card)] p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-[var(--radius-card)] bg-primary-700/20 dark:bg-primary-700/30 flex items-center justify-center">
                          <File className="w-5 h-5 text-primary-700 dark:text-primary-400" />
                        </div>
                        <div>
                          <h4 className="text-small font-medium text-foreground dark:text-neutral-0 mb-0.5 truncate max-w-[200px] md:max-w-xs">
                            {f.name}
                          </h4>
                          <p className="text-caption text-muted-foreground dark:text-neutral-300/60">
                            {(f.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile(idx);
                        }}
                        className="w-8 h-8 rounded-[var(--radius)] hover:bg-neutral-900/5 dark:hover:bg-card/5 flex items-center justify-center transition-colors text-muted-foreground dark:text-neutral-300/60 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Document Details */}
            {uploadType === 'property' && (
              <div className="bg-card/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.08] rounded-[var(--radius-card)] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                <h2 className="text-[16px] font-medium text-foreground dark:text-neutral-0 mb-6">Document Details</h2>
                
                <div className="space-y-6">
                  {/* Property Selection */}
                  <div>
                    <label className="block text-small font-medium text-neutral-700/80 dark:text-neutral-300/80 mb-2">
                      Select Property
                    </label>
                    <select 
                      value={selectedProperty}
                      onChange={(e) => setSelectedProperty(e.target.value)}
                      className="w-full px-4 py-3.5 bg-card/50 dark:bg-neutral-900/20 border border-black/[0.08] dark:border-white/[0.08] rounded-[var(--radius-card)] text-small text-foreground dark:text-neutral-0 focus:outline-none focus:ring-2 focus:ring-primary-700/20 focus:border-primary-700/30 transition-all appearance-none"
                    >
                      <option value="" disabled>Choose a property...</option>
                      {properties.map(prop => (
                        <option key={prop.id} value={prop.id}>
                          {prop.name} {prop.address ? `- ${prop.address}` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Category Selection */}
                <div>
                  <label className="block text-small font-medium text-neutral-700/80 dark:text-neutral-300/80 mb-2">
                    Document Category
                  </label>
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3.5 bg-card/50 dark:bg-neutral-900/20 border border-black/[0.08] dark:border-white/[0.08] rounded-[var(--radius-card)] text-small text-foreground dark:text-neutral-0 focus:outline-none focus:ring-2 focus:ring-primary-700/20 focus:border-primary-700/30 transition-all appearance-none"
                  >
                    <option value="" disabled>Select category...</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-small font-medium text-neutral-700/80 dark:text-neutral-300/80 mb-2">
                    Remarks / Notes (Optional)
                  </label>
                  <textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any additional context or details about this document..."
                    rows={4}
                    className="w-full px-4 py-3.5 bg-card/50 dark:bg-neutral-900/20 border border-black/[0.08] dark:border-white/[0.08] rounded-[var(--radius-card)] text-small text-foreground dark:text-neutral-0 placeholder:text-foreground/30 dark:placeholder:text-neutral-0/30 focus:outline-none focus:ring-2 focus:ring-primary-700/20 focus:border-primary-700/30 transition-all resize-none"
                  />
                </div>
              </div>
            </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-4">
              <button 
                type="button"
                onClick={() => navigate(id ? `/property/${id}/documents` : '/documents')}
                className="px-6 py-3.5 rounded-[var(--radius-card)] border border-black/[0.08] dark:border-white/[0.08] text-small font-medium text-foreground dark:text-neutral-0 hover:bg-neutral-900/5 dark:hover:bg-card/5 transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-8 py-3.5 bg-primary-700 hover:bg-primary-900 text-neutral-0 rounded-[var(--radius-card)] transition-all shadow-[0_4px_16px_rgba(28,117,188,0.3)] hover:shadow-[0_8px_24px_rgba(28,117,188,0.4)] flex items-center gap-2 text-small font-medium"
              >
                <Shield className="w-4 h-4" />
                Upload Securely
              </button>
            </div>
            
            {/* Secure Upload Footer Note */}
            <div className="flex items-center justify-center gap-2 mt-8 text-caption text-muted-foreground dark:text-neutral-300/60">
              <Shield className="w-3.5 h-3.5" />
              <span>All documents are encrypted with bank-grade security before storage.</span>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}