import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
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
    <div className="min-h-screen w-full flex items-center justify-center p-8 bg-[#F2F2F2] dark:bg-[#0F0F0F] font-sans overflow-y-auto">
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
        </div>
        
        {/* The Glass Card */}
        <div 
          className="bg-white/90 dark:bg-[#1A1A1A]/90 backdrop-blur-xl rounded-2xl p-10 sm:p-12
                     shadow-lg dark:shadow-2xl
                     border border-black/5 dark:border-white/10 relative overflow-hidden transition-all duration-500"
        >
          {/* Top subtle highlight */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent" />
          
          <div className="min-h-[420px] flex flex-col">
            {/* Phase 1: Identity & Mandate */}
            <div className="flex-1 opacity-100 transition-opacity duration-500">
              <div className="mb-10">
                <h2 className="text-[32px] tracking-tight text-black dark:text-white leading-tight mb-2">Tell us about yourself</h2>
                <p className="text-[14px] text-black/50 dark:text-white/60">Define your profile to access institutional-grade real estate intelligence.</p>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[13px] text-black/60 dark:text-white/60 mb-3 tracking-wide">First Name</label>
                    <input
                      type="text"
                      value={data.firstName}
                      onChange={e => setData({...data, firstName: e.target.value})}
                      placeholder="John"
                      className="w-full bg-black/[0.02] dark:bg-black/30 border border-black/10 dark:border-white/10 rounded-xl px-5 py-4 text-black dark:text-white/95 text-[14px] placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 focus:bg-black/[0.04] dark:focus:bg-black/40 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] text-black/60 dark:text-white/60 mb-3 tracking-wide">Last Name</label>
                    <input
                      type="text"
                      value={data.lastName}
                      onChange={e => setData({...data, lastName: e.target.value})}
                      placeholder="Doe"
                      className="w-full bg-black/[0.02] dark:bg-black/30 border border-black/10 dark:border-white/10 rounded-xl px-5 py-4 text-black dark:text-white/95 text-[14px] placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 focus:bg-black/[0.04] dark:focus:bg-black/40 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[13px] text-black/60 dark:text-white/60 mb-3 tracking-wide">Email</label>
                    <input
                      type="email"
                      value={data.email}
                      onChange={e => setData({...data, email: e.target.value})}
                      placeholder="john.doe@example.com"
                      className="w-full bg-black/[0.02] dark:bg-black/30 border border-black/10 dark:border-white/10 rounded-xl px-5 py-4 text-black dark:text-white/95 text-[14px] placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 focus:bg-black/[0.04] dark:focus:bg-black/40 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] text-black/60 dark:text-white/60 mb-3 tracking-wide">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40 dark:text-white/40" />
                      <input
                        type="tel"
                        value={data.phone}
                        onChange={e => setData({...data, phone: e.target.value})}
                        placeholder="98765 43210"
                        className="w-full bg-black/[0.02] dark:bg-black/30 border border-black/10 dark:border-white/10 rounded-xl pl-11 pr-5 py-4 text-black dark:text-white/95 text-[14px] placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 focus:bg-black/[0.04] dark:focus:bg-black/40 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] text-black/60 dark:text-white/60 mb-4 tracking-wide">Operating Role</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { id: 'land-owner', label: 'Land Owner', icon: Building2, desc: 'Monetize existing prime assets' },
                      { id: 'strategic-investor', label: 'Strategic Investor', icon: TrendingUp, desc: 'Acquire & develop high-yield land' },
                      { id: 'both', label: 'Dual Mandate', icon: Briefcase, desc: 'Owner & opportunistic buyer' },
                    ].map((role) => (
                      <button
                        key={role.id}
                        onClick={() => setData({ ...data, primaryRole: role.id as any })}
                        className={`text-left p-4 rounded-xl border transition-all relative overflow-hidden group ${
                          data.primaryRole === role.id
                            ? 'border-emerald-500/50 bg-emerald-500/5 shadow-lg'
                            : 'border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] hover:border-emerald-500/30'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 relative ${
                          data.primaryRole === role.id ? 'text-emerald-400 bg-emerald-500/10' : 'text-black/40 dark:text-white/40 bg-black/5 dark:bg-white/5'
                        }`}>
                          {data.primaryRole === role.id && <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-lg" />}
                          <role.icon className="w-5 h-5 relative z-10" strokeWidth={1.5} />
                        </div>
                        <div className="text-[14px] text-black dark:text-white/95 mb-1">{role.label}</div>
                        <div className="text-[12px] text-black/40 dark:text-white/40 leading-snug">{role.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] text-black/60 dark:text-white/60 mb-4 tracking-wide">Portfolio Size</label>
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
                        className={`text-left p-4 rounded-xl border transition-all relative overflow-hidden group ${
                          data.portfolioSize === size.id
                            ? 'border-emerald-500/50 bg-emerald-500/5 shadow-lg'
                            : 'border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] hover:border-emerald-500/30'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 relative ${
                          data.portfolioSize === size.id ? 'text-emerald-400 bg-emerald-500/10' : 'text-black/40 dark:text-white/40 bg-black/5 dark:bg-white/5'
                        }`}>
                          {data.portfolioSize === size.id && <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-lg" />}
                          <Layers className="w-5 h-5 relative z-10" strokeWidth={1.5} />
                        </div>
                        <div className="text-[14px] text-black dark:text-white/95 mb-1">{size.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Document Verification Section */}
                <div>
                  <label className="block text-[13px] text-black/60 dark:text-white/60 mb-4 tracking-wide">Identity Verification (Optional)</label>
                  
                  {/* Document Type Selection */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <button
                      type="button"
                      onClick={() => setData({ ...data, documentType: 'aadhaar', documentNumber: '', documentVerified: false })}
                      className={`p-4 rounded-xl border transition-all text-left ${
                        data.documentType === 'aadhaar'
                          ? 'border-emerald-500/50 bg-emerald-500/5 shadow-lg'
                          : 'border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] hover:border-emerald-500/30'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                        data.documentType === 'aadhaar' ? 'text-emerald-400 bg-emerald-500/10' : 'text-black/40 dark:text-white/40 bg-black/5 dark:bg-white/5'
                      }`}>
                        <CreditCard className="w-5 h-5" strokeWidth={1.5} />
                      </div>
                      <div className="text-[14px] text-black dark:text-white/95 mb-1">Aadhaar Card</div>
                      <div className="text-[12px] text-black/40 dark:text-white/40">Upload Aadhaar document</div>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setData({ ...data, documentType: 'pan', documentNumber: '', documentVerified: false })}
                      className={`p-4 rounded-xl border transition-all text-left ${
                        data.documentType === 'pan'
                          ? 'border-emerald-500/50 bg-emerald-500/5 shadow-lg'
                          : 'border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] hover:border-emerald-500/30'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                        data.documentType === 'pan' ? 'text-emerald-400 bg-emerald-500/10' : 'text-black/40 dark:text-white/40 bg-black/5 dark:bg-white/5'
                      }`}>
                        <FileText className="w-5 h-5" strokeWidth={1.5} />
                      </div>
                      <div className="text-[14px] text-black dark:text-white/95 mb-1">PAN Card</div>
                      <div className="text-[12px] text-black/40 dark:text-white/40">Upload PAN document</div>
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
                          className={`flex items-center justify-center gap-3 w-full p-6 rounded-xl border-2 border-dashed transition-all cursor-pointer ${
                            uploadedFile
                              ? 'border-emerald-500/30 bg-emerald-500/5'
                              : 'border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] hover:border-emerald-500/30 hover:bg-emerald-500/5'
                          }`}
                        >
                          {isProcessing ? (
                            <>
                              <div className="w-5 h-5 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                              <span className="text-[14px] text-black dark:text-white/95">Processing document...</span>
                            </>
                          ) : uploadedFile ? (
                            <>
                              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                              <span className="text-[14px] text-black dark:text-white/95">{uploadedFile.name}</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-5 h-5 text-black/40 dark:text-white/40" />
                              <span className="text-[14px] text-black/60 dark:text-white/60">
                                Upload {data.documentType === 'aadhaar' ? 'Aadhaar' : 'PAN'} Card
                              </span>
                            </>
                          )}
                        </label>
                      </div>
                      
                      {/* Extracted Number - Editable */}
                      {data.documentVerified && (
                        <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <label className="block text-[12px] text-emerald-600 dark:text-emerald-400 mb-2 font-medium">
                                Extracted {data.documentType === 'aadhaar' ? 'Aadhaar' : 'PAN'} Number
                              </label>
                              <input
                                type="text"
                                value={data.documentNumber}
                                onChange={(e) => setData({ ...data, documentNumber: e.target.value })}
                                placeholder={data.documentType === 'aadhaar' ? '1234 5678 9012' : 'ABCDE1234F'}
                                className="w-full bg-white dark:bg-black/30 border border-emerald-500/30 rounded-lg px-4 py-3 text-black dark:text-white/95 text-[14px] font-medium placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 transition-all"
                              />
                              <p className="text-[11px] text-black/50 dark:text-white/50 mt-2">
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
                  <label className="block text-[13px] text-black/60 dark:text-white/60 mb-3 tracking-wide">Referral Code</label>
                  <div className="relative">
                    <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40 dark:text-white/40" />
                    <input
                      type="text"
                      value={data.referralCode}
                      onChange={e => setData({...data, referralCode: e.target.value})}
                      placeholder="Enter referral code (optional)"
                      className="w-full bg-black/[0.02] dark:bg-black/30 border border-black/10 dark:border-white/10 rounded-xl pl-11 pr-5 py-4 text-black dark:text-white/95 text-[14px] placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 focus:bg-black/[0.04] dark:focus:bg-black/40 transition-all"
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
                className="flex items-center gap-2 px-8 py-4 rounded-xl bg-black dark:bg-white text-white dark:text-black text-[15px] font-medium tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black/90 dark:hover:bg-white/90 shadow-lg"
              >
                Finish
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-6">
          <p className="text-[12px] text-black/40 dark:text-white/40 tracking-wide">
            End-to-End Encrypted • Institutional Grade Privacy
          </p>
        </div>
      </div>
    </div>
  );
}