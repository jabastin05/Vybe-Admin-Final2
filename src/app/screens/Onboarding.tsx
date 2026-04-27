import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import vybeLogoImage from '../../assets/vybe-logo.svg';
import { Building2, TrendingUp, Briefcase, ArrowRight, Phone, Mail, User, Globe, Home, Layers, Link as LinkIcon, Ticket, Upload, CheckCircle2, CreditCard, FileText } from 'lucide-react';

interface OnboardingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  primaryRole: 'land-owner' | 'strategic-investor' | 'both' | null;
  portfolioSize: '1' | '2-5' | '6-20' | '20+' | null;
  referralCode: string;
  country: string;
  documentType: 'aadhaar' | 'pan' | null;
  documentNumber: string;
  documentVerified: boolean;
}

export function Onboarding() {
  const navigate = useNavigate();
  const [data, setData] = useState<OnboardingData>({
    firstName: 'Alexander',
    lastName: 'Sterling',
    email: '',
    phone: '',
    primaryRole: null,
    portfolioSize: null,
    referralCode: '',
    country: 'IN',
    documentType: null,
    documentNumber: '',
    documentVerified: false,
  });
  
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Auto-fill user data from Sign Up / Sign In
    const savedUser = localStorage.getItem('vybeUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setData(prev => ({
        ...prev,
        firstName: userData.name || prev.firstName,
        lastName: userData.lastName || prev.lastName,
        email: userData.email || prev.email,
        phone: userData.phone || prev.phone,
        country: userData.country || prev.country,
      }));
    } else {
      // Fallback: Try to get individual items from localStorage
      const savedName = localStorage.getItem('vybeUserName');
      const savedPhone = localStorage.getItem('vybeUserPhone');
      
      setData(prev => ({
        ...prev,
        firstName: savedName || prev.firstName,
        phone: savedPhone || prev.phone,
      }));
    }
  }, []);
  
  // Simulate OCR/document extraction
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadedFile(file);
    setIsProcessing(true);
    
    // Simulate OCR processing delay
    setTimeout(() => {
      // Simulate extracted number based on document type
      let extractedNumber = '';
      if (data.documentType === 'aadhaar') {
        extractedNumber = '1234 5678 9012'; // Mock Aadhaar number
      } else if (data.documentType === 'pan') {
        extractedNumber = 'ABCDE1234F'; // Mock PAN number
      }
      
      setData(prev => ({
        ...prev,
        documentNumber: extractedNumber,
        documentVerified: true,
      }));
      setIsProcessing(false);
    }, 2000);
  };

  const isFormValid = 
    data.firstName.trim() !== '' && 
    data.lastName.trim() !== '' && 
    data.email.trim() !== '' &&
    data.phone.trim() !== '' &&
    data.primaryRole !== null &&
    data.portfolioSize !== null;

  const handleComplete = () => {
    localStorage.setItem('vybeOnboardingComplete', 'true');
    localStorage.setItem('vybeOnboardingData', JSON.stringify(data));
    navigate('/waitlist');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-8 bg-background dark:bg-neutral-900 font-sans overflow-y-auto">
      {/* Background Image & Overlay */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1640109229792-a26a0ee366ff?auto=format&fit=crop&q=80&w=2000" 
          alt="Premium Architecture" 
          className="w-full h-full object-cover opacity-20 dark:opacity-30" 
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-[#F2F2F2]/90 dark:from-black/80 dark:to-[#0F0F0F]/95 backdrop-blur-2xl" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-3xl my-auto">
        {/* Header / Logo */}
        <div className="flex justify-between items-center mb-8">
          <img src={vybeLogoImage} alt="VYBE" className="h-8 w-auto object-contain" />
        </div>
        
        {/* The Glass Card */}
        <div 
          className="bg-card/90 dark:bg-neutral-900/90 backdrop-blur-xl rounded-[var(--radius-card)] p-10 sm:p-12
                     shadow-lg dark:shadow-2xl
                     border border-black/5 dark:border-white/10 relative overflow-hidden transition-all duration-500"
        >
          {/* Top subtle highlight */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent" />
          
          <div className="min-h-[420px] flex flex-col">
            {/* Phase 1: Identity & Mandate */}
            <div className="flex-1 opacity-100 transition-opacity duration-500">
              <div className="mb-[var(--space-10)]">
                <h2 className="text-h1 tracking-tight text-foreground dark:text-neutral-0 leading-tight mb-2">Tell us about yourself</h2>
                <p className="text-small text-muted-foreground dark:text-neutral-300/80">Define your profile to access institutional-grade real estate intelligence.</p>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-small text-neutral-700/80 dark:text-neutral-300/80 mb-3 tracking-wide">First Name</label>
                    <input
                      type="text"
                      value={data.firstName}
                      onChange={e => setData({...data, firstName: e.target.value})}
                      placeholder="John"
                      className="w-full bg-neutral-900/[0.02] dark:bg-neutral-900/30 border border-black/10 dark:border-white/10 rounded-[var(--radius-card)] px-5 py-4 text-foreground dark:text-neutral-0/95 text-small placeholder:text-foreground/30 dark:placeholder:text-neutral-0/30 focus:outline-none focus:border-primary-700/50 focus:bg-neutral-900/[0.04] dark:focus:bg-neutral-900/40 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-small text-neutral-700/80 dark:text-neutral-300/80 mb-3 tracking-wide">Last Name</label>
                    <input
                      type="text"
                      value={data.lastName}
                      onChange={e => setData({...data, lastName: e.target.value})}
                      placeholder="Doe"
                      className="w-full bg-neutral-900/[0.02] dark:bg-neutral-900/30 border border-black/10 dark:border-white/10 rounded-[var(--radius-card)] px-5 py-4 text-foreground dark:text-neutral-0/95 text-small placeholder:text-foreground/30 dark:placeholder:text-neutral-0/30 focus:outline-none focus:border-primary-700/50 focus:bg-neutral-900/[0.04] dark:focus:bg-neutral-900/40 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-small text-neutral-700/80 dark:text-neutral-300/80 mb-3 tracking-wide">Email</label>
                    <input
                      type="email"
                      value={data.email}
                      onChange={e => setData({...data, email: e.target.value})}
                      placeholder="john.doe@example.com"
                      className="w-full bg-neutral-900/[0.02] dark:bg-neutral-900/30 border border-black/10 dark:border-white/10 rounded-[var(--radius-card)] px-5 py-4 text-foreground dark:text-neutral-0/95 text-small placeholder:text-foreground/30 dark:placeholder:text-neutral-0/30 focus:outline-none focus:border-primary-700/50 focus:bg-neutral-900/[0.04] dark:focus:bg-neutral-900/40 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-small text-neutral-700/80 dark:text-neutral-300/80 mb-3 tracking-wide">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground dark:text-neutral-300/60" />
                      <input
                        type="tel"
                        value={data.phone}
                        onChange={e => setData({...data, phone: e.target.value})}
                        placeholder="98765 43210"
                        className="w-full bg-neutral-900/[0.02] dark:bg-neutral-900/30 border border-black/10 dark:border-white/10 rounded-[var(--radius-card)] pl-11 pr-5 py-4 text-foreground dark:text-neutral-0/95 text-small placeholder:text-foreground/30 dark:placeholder:text-neutral-0/30 focus:outline-none focus:border-primary-700/50 focus:bg-neutral-900/[0.04] dark:focus:bg-neutral-900/40 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-small text-neutral-700/80 dark:text-neutral-300/80 mb-4 tracking-wide">Operating Role</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { id: 'land-owner', label: 'Land Owner', icon: Building2, desc: 'Monetize existing prime assets' },
                      { id: 'strategic-investor', label: 'Strategic Investor', icon: TrendingUp, desc: 'Acquire & develop high-yield land' },
                      { id: 'both', label: 'Dual Mandate', icon: Briefcase, desc: 'Owner & opportunistic buyer' },
                    ].map((role) => (
                      <button
                        key={role.id}
                        onClick={() => setData({ ...data, primaryRole: role.id as any })}
                        className={`text-left p-4 rounded-[var(--radius-card)] border transition-all relative overflow-hidden group ${
                          data.primaryRole === role.id
                            ? 'border-primary-700/50 bg-primary-700/5 shadow-lg'
                            : 'border-black/10 dark:border-white/10 bg-neutral-900/[0.02] dark:bg-card/[0.02] hover:border-primary-700/30'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-[var(--radius)] flex items-center justify-center mb-3 relative ${
                          data.primaryRole === role.id ? 'text-primary-600 bg-primary-700/10' : 'text-muted-foreground dark:text-neutral-300/60 bg-neutral-900/5 dark:bg-card/5'
                        }`}>
                          {data.primaryRole === role.id && <div className="absolute inset-0 bg-primary-700/20 rounded-full blur-lg" />}
                          <role.icon className="w-5 h-5 relative z-10" strokeWidth={1.5} />
                        </div>
                        <div className="text-small text-foreground dark:text-neutral-0/95 mb-1">{role.label}</div>
                        <div className="text-caption text-muted-foreground dark:text-neutral-300/60 leading-snug">{role.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-small text-neutral-700/80 dark:text-neutral-300/80 mb-4 tracking-wide">Portfolio Size</label>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    {[
                      { id: '1', label: '1 Property' },
                      { id: '2-5', label: '2-5 Properties' },
                      { id: '6-20', label: '6-20 Properties' },
                      { id: '20+', label: '20+ Properties' },
                    ].map((size) => (
                      <button
                        key={size.id}
                        onClick={() => setData({ ...data, portfolioSize: size.id as any })}
                        className={`text-left p-4 rounded-[var(--radius-card)] border transition-all relative overflow-hidden group ${
                          data.portfolioSize === size.id
                            ? 'border-primary-700/50 bg-primary-700/5 shadow-lg'
                            : 'border-black/10 dark:border-white/10 bg-neutral-900/[0.02] dark:bg-card/[0.02] hover:border-primary-700/30'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-[var(--radius)] flex items-center justify-center mb-3 relative ${
                          data.portfolioSize === size.id ? 'text-primary-600 bg-primary-700/10' : 'text-muted-foreground dark:text-neutral-300/60 bg-neutral-900/5 dark:bg-card/5'
                        }`}>
                          {data.portfolioSize === size.id && <div className="absolute inset-0 bg-primary-700/20 rounded-full blur-lg" />}
                          <Layers className="w-5 h-5 relative z-10" strokeWidth={1.5} />
                        </div>
                        <div className="text-small text-foreground dark:text-neutral-0/95 mb-1">{size.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Document Verification Section */}
                <div>
                  <label className="block text-small text-neutral-700/80 dark:text-neutral-300/80 mb-4 tracking-wide">Identity Verification (Optional)</label>
                  
                  {/* Document Type Selection */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <button
                      type="button"
                      onClick={() => setData({ ...data, documentType: 'aadhaar', documentNumber: '', documentVerified: false })}
                      className={`p-4 rounded-[var(--radius-card)] border transition-all text-left ${
                        data.documentType === 'aadhaar'
                          ? 'border-primary-700/50 bg-primary-700/5 shadow-lg'
                          : 'border-black/10 dark:border-white/10 bg-neutral-900/[0.02] dark:bg-card/[0.02] hover:border-primary-700/30'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-[var(--radius)] flex items-center justify-center mb-3 ${
                        data.documentType === 'aadhaar' ? 'text-primary-600 bg-primary-700/10' : 'text-muted-foreground dark:text-neutral-300/60 bg-neutral-900/5 dark:bg-card/5'
                      }`}>
                        <CreditCard className="w-5 h-5" strokeWidth={1.5} />
                      </div>
                      <div className="text-small text-foreground dark:text-neutral-0/95 mb-1">Aadhaar Card</div>
                      <div className="text-caption text-muted-foreground dark:text-neutral-300/60">Upload Aadhaar document</div>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setData({ ...data, documentType: 'pan', documentNumber: '', documentVerified: false })}
                      className={`p-4 rounded-[var(--radius-card)] border transition-all text-left ${
                        data.documentType === 'pan'
                          ? 'border-primary-700/50 bg-primary-700/5 shadow-lg'
                          : 'border-black/10 dark:border-white/10 bg-neutral-900/[0.02] dark:bg-card/[0.02] hover:border-primary-700/30'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-[var(--radius)] flex items-center justify-center mb-3 ${
                        data.documentType === 'pan' ? 'text-primary-600 bg-primary-700/10' : 'text-muted-foreground dark:text-neutral-300/60 bg-neutral-900/5 dark:bg-card/5'
                      }`}>
                        <FileText className="w-5 h-5" strokeWidth={1.5} />
                      </div>
                      <div className="text-small text-foreground dark:text-neutral-0/95 mb-1">PAN Card</div>
                      <div className="text-caption text-muted-foreground dark:text-neutral-300/60">Upload PAN document</div>
                    </button>
                  </div>
                  
                  {/* File Upload & Extracted Number */}
                  {data.documentType && (
                    <div className="space-y-4">
                      {/* Upload Button */}
                      <div>
                        <input
                          type="file"
                          id="document-upload"
                          accept="image/*,.pdf"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <label
                          htmlFor="document-upload"
                          className={`flex items-center justify-center gap-3 w-full p-6 rounded-[var(--radius-card)] border-2 border-dashed transition-all cursor-pointer ${
                            uploadedFile
                              ? 'border-primary-700/30 bg-primary-700/5'
                              : 'border-black/10 dark:border-white/10 bg-neutral-900/[0.02] dark:bg-card/[0.02] hover:border-primary-700/30 hover:bg-primary-700/5'
                          }`}
                        >
                          {isProcessing ? (
                            <>
                              <div className="w-5 h-5 border-2 border-primary-700/30 border-t-primary-700 rounded-full animate-spin" />
                              <span className="text-small text-foreground dark:text-neutral-0/95">Processing document...</span>
                            </>
                          ) : uploadedFile ? (
                            <>
                              <CheckCircle2 className="w-5 h-5 text-primary-700" />
                              <span className="text-small text-foreground dark:text-neutral-0/95">{uploadedFile.name}</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-5 h-5 text-muted-foreground dark:text-neutral-300/60" />
                              <span className="text-small text-neutral-700/80 dark:text-neutral-300/80">
                                Upload {data.documentType === 'aadhaar' ? 'Aadhaar' : 'PAN'} Card
                              </span>
                            </>
                          )}
                        </label>
                      </div>
                      
                      {/* Extracted Number - Editable */}
                      {data.documentVerified && (
                        <div className="p-4 rounded-[var(--radius-card)] bg-primary-700/5 border border-primary-700/20">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-[var(--radius)] bg-primary-700/10 flex items-center justify-center flex-shrink-0">
                              <CheckCircle2 className="w-4 h-4 text-primary-700" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <label className="block text-caption text-primary-700 dark:text-primary-400 mb-2 font-medium">
                                Extracted {data.documentType === 'aadhaar' ? 'Aadhaar' : 'PAN'} Number
                              </label>
                              <input
                                type="text"
                                value={data.documentNumber}
                                onChange={(e) => setData({ ...data, documentNumber: e.target.value })}
                                placeholder={data.documentType === 'aadhaar' ? '1234 5678 9012' : 'ABCDE1234F'}
                                className="w-full bg-card dark:bg-neutral-900/30 border border-primary-700/30 rounded-[var(--radius)] px-4 py-3 text-foreground dark:text-neutral-0/95 text-small font-medium placeholder:text-foreground/30 dark:placeholder:text-neutral-0/30 focus:outline-none focus:border-primary-700/50 transition-all"
                              />
                              <p className="text-caption text-muted-foreground dark:text-neutral-0/50 mt-2">
                                Auto-extracted • You can edit if needed
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-small text-neutral-700/80 dark:text-neutral-300/80 mb-3 tracking-wide">Referral Code</label>
                  <div className="relative">
                    <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground dark:text-neutral-300/60" />
                    <input
                      type="text"
                      value={data.referralCode}
                      onChange={e => setData({...data, referralCode: e.target.value})}
                      placeholder="Enter referral code (optional)"
                      className="w-full bg-neutral-900/[0.02] dark:bg-neutral-900/30 border border-black/10 dark:border-white/10 rounded-[var(--radius-card)] pl-11 pr-5 py-4 text-foreground dark:text-neutral-0/95 text-small placeholder:text-foreground/30 dark:placeholder:text-neutral-0/30 focus:outline-none focus:border-primary-700/50 focus:bg-neutral-900/[0.04] dark:focus:bg-neutral-900/40 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Footer */}
            <div className="mt-auto pt-8 flex items-center justify-end border-t border-black/5 dark:border-white/10">
              <button
                onClick={handleComplete}
                disabled={!isFormValid}
                className="flex items-center gap-2 px-8 py-4 rounded-[var(--radius-card)] bg-neutral-900 dark:bg-card text-neutral-0 dark:text-foreground text-[15px] font-medium tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-900/90 dark:hover:bg-card/90 shadow-lg"
              >
                Finish
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-6">
          <p className="text-caption text-muted-foreground dark:text-neutral-300/60 tracking-wide">
            End-to-End Encrypted • Institutional Grade Privacy
          </p>
        </div>
      </div>
    </div>
  );
}