import { useState, useEffect } from 'react';
import { SideNav } from '../components/SideNav';
import { ThemeToggle } from '../components/ThemeToggle';
import { Link } from 'react-router';
import { 
  User, 
  Mail, 
  Building2, 
  Bell, 
  Lock, 
  Globe, 
  Shield,
  CheckCircle2,
  ArrowRight,
  Phone,
  Loader2,
  FileText,
  Calendar,
  Briefcase,
  Layers,
  Ticket,
  HeadphonesIcon,
  Share2,
  Copy,
  MessageCircle
} from 'lucide-react';

export function Settings() {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'order-history'>('profile');
  const [showSaved, setShowSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [tempProfileData, setTempProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    primaryRole: '',
    portfolioSize: '',
    referralCode: '',
    country: '',
  });

  const [profileData, setProfileData] = useState({
    firstName: 'Alexander',
    lastName: 'Sterling',
    email: 'alexander.sterling@example.com',
    phone: '+91 98765 43210',
    primaryRole: 'both',
    portfolioSize: '6-20',
    referralCode: 'VYBEALEX',
    country: 'IN',
    avatarUrl: '', // Add avatarUrl to store the profile picture URL
    documentType: null as 'aadhaar' | 'pan' | null,
    documentNumber: '',
    documentVerified: false,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailReports: true,
    smsAlerts: true,
    partnerUpdates: true,
    marketInsights: false,
    weeklyDigest: true,
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('vybeOnboardingData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setProfileData(prev => ({
          ...prev,
          firstName: parsed.firstName || prev.firstName,
          lastName: parsed.lastName || prev.lastName,
          email: parsed.email || prev.email,
          phone: parsed.phone || prev.phone,
          primaryRole: parsed.primaryRole || prev.primaryRole,
          portfolioSize: parsed.portfolioSize || prev.portfolioSize,
          referralCode: parsed.referralCode || prev.referralCode,
          country: parsed.country || prev.country,
          documentType: parsed.documentType || prev.documentType,
          documentNumber: parsed.documentNumber || prev.documentNumber,
          documentVerified: parsed.documentVerified || prev.documentVerified,
        }));
      } catch (e) {
        console.error('Failed to parse onboarding data:', e);
      }
    }
  }, []);

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setValidationErrors({ ...validationErrors, avatar: 'Image size must be less than 5MB' });
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setValidationErrors({ ...validationErrors, avatar: 'Please upload a valid image file' });
        return;
      }

      // Simulate upload progress
      setImageUploadProgress(0);
      const interval = setInterval(() => {
        setImageUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 100);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setTimeout(() => {
          setProfileData({ ...profileData, avatarUrl: reader.result as string });
          setImageUploadProgress(0);
        }, 1200);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    // Validate all fields
    const errors: Record<string, string> = {};
    
    if (!tempProfileData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!tempProfileData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!validateEmail(tempProfileData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (tempProfileData.phone && !validatePhone(tempProfileData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setProfileData({
        ...profileData,
        firstName: tempProfileData.firstName,
        lastName: tempProfileData.lastName,
        email: tempProfileData.email,
        phone: tempProfileData.phone,
        primaryRole: tempProfileData.primaryRole,
        portfolioSize: tempProfileData.portfolioSize,
        referralCode: tempProfileData.referralCode,
        country: tempProfileData.country,
      });
      
      // Update localStorage
      localStorage.setItem('vybeOnboardingData', JSON.stringify({
        firstName: tempProfileData.firstName,
        lastName: tempProfileData.lastName,
        email: tempProfileData.email,
        phone: tempProfileData.phone,
        primaryRole: tempProfileData.primaryRole,
        portfolioSize: tempProfileData.portfolioSize,
        referralCode: tempProfileData.referralCode,
        country: tempProfileData.country,
      }));
      
      setIsEditingPersonalInfo(false);
      setIsSaving(false);
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 3000);
    }, 1000);
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'land-owner':
        return 'Land Owner';
      case 'strategic-investor':
        return 'Strategic Investor';
      case 'both':
        return 'Dual Mandate';
      default:
        return 'Not set';
    }
  };

  const getPortfolioSizeLabel = (size: string) => {
    switch (size) {
      case '1':
        return '1 Property';
      case '2-5':
        return '2-5 Properties';
      case '6-20':
        return '6-20 Properties';
      case '20+':
        return '20+ Properties';
      default:
        return 'Not set';
    }
  };

  // Copy to clipboard function with fallback
  const copyToClipboard = (text: string) => {
    try {
      // Try modern clipboard API first if not in an iframe
      const isIframe = window !== window.parent;
      if (!isIframe && navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
        }).catch(() => {
          // Fallback to older method silently
          fallbackCopyTextToClipboard(text);
        });
      } else {
        // Use fallback
        fallbackCopyTextToClipboard(text);
      }
    } catch (err) {
      fallbackCopyTextToClipboard(text);
    }
  };

  // Fallback copy method
  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
    
    document.body.removeChild(textArea);
  };

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'order-history' as const, label: 'Order History', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-background dark:bg-neutral-900 transition-colors duration-300">
      <SideNav />
      
      {/* Header */}
      <div className="border-b border-black/5 dark:border-white/10 bg-card dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-caption tracking-wider uppercase text-muted-foreground dark:text-neutral-300/60 mb-2">
                Account
              </h1>
              <div className="text-h1 tracking-tight text-foreground dark:text-neutral-0/95">
                My Profile
              </div>
              <p className="text-small text-muted-foreground dark:text-neutral-0/50 mt-1">
                Manage your profile and account preferences
              </p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Settings Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="flex gap-8">
          {/* Sidebar Tabs */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-card/80 dark:bg-neutral-900 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] rounded-[var(--radius-card)] p-2 shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-5 py-4 rounded-[var(--radius-card)] text-left transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-neutral-900/[0.06] dark:bg-card/[0.06] text-foreground dark:text-neutral-0 shadow-sm'
                      : 'text-neutral-700/80 dark:text-neutral-300/80 hover:bg-neutral-900/[0.02] dark:hover:bg-card/[0.02] hover:text-foreground/80 dark:hover:text-neutral-0/80'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="text-small font-medium">{tab.label}</span>
                </button>
              ))}
              
              {/* Divider */}
              <div className="my-2 border-t border-black/5 dark:border-white/5" />
              
              {/* Help & Support Link */}
              <Link
                to="/help-support"
                className="w-full flex items-center gap-3 px-5 py-4 rounded-[var(--radius-card)] text-left transition-all duration-300 text-neutral-700/80 dark:text-neutral-300/80 hover:bg-neutral-900/[0.02] dark:hover:bg-card/[0.02] hover:text-foreground/80 dark:hover:text-neutral-0/80"
              >
                <HeadphonesIcon className="w-4 h-4" />
                <span className="text-small font-medium">Help & Support</span>
              </Link>
              
              {/* Divider */}
              <div className="my-2 border-t border-black/5 dark:border-white/5" />
              
              {/* Sign Out Button */}
              <button
                onClick={() => {
                  // Handle sign out logic
                  console.log('Signing out...');
                }}
                className="w-full flex items-center gap-3 px-5 py-4 rounded-[var(--radius-card)] text-left transition-all duration-300 text-red-600 dark:text-red-400 hover:bg-red-500/10 hover:text-red-700 dark:hover:text-red-300"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="text-small font-medium">Sign Out</span>
              </button>

              {/* Legal Links Divider */}
              <div className="my-2 border-t border-black/5 dark:border-white/5" />

              {/* Terms & Privacy Links */}
              <div className="px-3 py-2 space-y-1">
                <Link 
                  to="/terms-and-conditions"
                  className="block text-caption text-muted-foreground dark:text-neutral-0/50 hover:text-foreground dark:hover:text-neutral-0 transition-colors py-1"
                >
                  Terms & Conditions
                </Link>
                <Link 
                  to="/privacy-policy"
                  className="block text-caption text-muted-foreground dark:text-neutral-0/50 hover:text-foreground dark:hover:text-neutral-0 transition-colors py-1"
                >
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="bg-card/80 dark:bg-neutral-900 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] rounded-[var(--radius-card)] p-10 shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
              {/* Success Message */}
              {showSaved && (
                <div className="mb-8 p-5 bg-primary-700/10 border border-primary-700/20 rounded-[var(--radius-card)] flex items-center gap-3 backdrop-blur-sm">
                  <CheckCircle2 className="w-5 h-5 text-primary-700" />
                  <span className="text-small text-primary-700 dark:text-primary-400 font-medium">Settings saved successfully</span>
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  {/* Profile Header - Compact */}
                  <div className="mb-8 p-8 rounded-[var(--radius-card)] bg-card/50 dark:bg-card/[0.02] border border-black/5 dark:border-white/5 backdrop-blur-xl">
                    <div className="flex items-center gap-6">
                      {/* Profile Picture - Circular */}
                      <div className="relative group">
                        <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-primary-700/20 shadow-lg">
                          {profileData.avatarUrl ? (
                            <img 
                              src={profileData.avatarUrl} 
                              alt="Profile" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary-700 to-primary-900 flex items-center justify-center">
                              <span className="text-h1 font-medium text-neutral-0">
                                {profileData.firstName.charAt(0).toUpperCase() || 'U'}
                              </span>
                            </div>
                          )}
                          
                          {/* Upload Progress Overlay */}
                          {imageUploadProgress > 0 && imageUploadProgress < 100 && (
                            <div className="absolute inset-0 bg-neutral-900/80 backdrop-blur-sm flex items-center justify-center">
                              <div className="text-center">
                                <Loader2 className="w-6 h-6 text-neutral-0 animate-spin mx-auto mb-1" />
                                <div className="text-caption text-neutral-0 font-medium">{imageUploadProgress}%</div>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Camera Icon Button - Small */}
                        <label className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary-700 hover:bg-primary-900 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <svg className="w-4 h-4 text-neutral-0 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </label>
                      </div>

                      {/* Profile Info - Simple */}
                      <div className="flex-1">
                        <h3 className="text-h3 font-medium text-foreground dark:text-neutral-0 mb-1">
                          {profileData.firstName} {profileData.lastName}
                        </h3>
                        
                        <p className="text-small text-neutral-500 mb-1.5">
                          {profileData.country === 'IN' ? 'India' : profileData.country}
                        </p>
                        
                        <p className="text-caption text-muted-foreground dark:text-neutral-0/30 font-mono tracking-wide">
                          ID: VYBE-{profileData.firstName.substring(0, 2).toUpperCase()}2024
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Relationship Manager Section */}
                  <div className="mb-8 rounded-[var(--radius-card)] bg-card/85 dark:bg-card/[0.03] border border-black/[0.08] dark:border-white/[0.08] p-7 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                    <div className="flex items-center gap-2 mb-6">
                      <User className="w-5 h-5 text-primary-700 dark:text-primary-400" />
                      <div className="text-h3 tracking-tight font-normal text-foreground dark:text-neutral-0">
                        Relationship Manager
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* RM Avatar */}
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-700 to-primary-900 flex items-center justify-center flex-shrink-0">
                        <span className="text-h3 font-medium text-neutral-0">
                          PS
                        </span>
                      </div>

                      {/* RM Info */}
                      <div className="flex-1">
                        <div className="text-[16px] font-medium text-foreground dark:text-neutral-0 mb-1">
                          Priya Sharma
                        </div>
                        <div className="text-caption text-neutral-500 mb-2">
                          Senior Relationship Manager
                        </div>
                        <div className="flex items-center gap-2 text-caption text-neutral-700/80 dark:text-neutral-300/80">
                          <Mail className="w-3.5 h-3.5" />
                          priya.sharma@vybe.app
                        </div>
                      </div>

                      {/* Reach Out Button */}
                      <button className="px-4 py-2.5 bg-primary-700 hover:bg-primary-900 text-neutral-0 rounded-[var(--radius)] transition-all text-small font-medium flex items-center gap-2 shadow-[0_4px_12px_rgba(28,117,188,0.3)] hover:shadow-[0_6px_16px_rgba(28,117,188,0.4)]">
                        <MessageCircle className="w-4 h-4" />
                        Reach Out
                      </button>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-black/5 dark:border-white/5">
                      <div className="text-center">
                        <div className="text-h3 tracking-tight font-normal text-foreground dark:text-neutral-0 mb-1">
                          48h
                        </div>
                        <div className="text-caption tracking-[0.05em] uppercase font-medium text-neutral-500">
                          Avg Response Time
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-h3 tracking-tight font-normal text-foreground dark:text-neutral-0 mb-1">
                          24/7
                        </div>
                        <div className="text-caption tracking-[0.05em] uppercase font-medium text-neutral-500">
                          Support Available
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Personal Information Section */}
                  <div className="mb-8 p-8 rounded-[var(--radius-card)] bg-card/50 dark:bg-card/[0.02] border border-black/5 dark:border-white/5 backdrop-blur-xl">
                    {/* Section Header with Edit/Save Button */}
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-h3 font-medium text-foreground dark:text-neutral-0">
                        Personal Information
                      </h2>
                      {!isEditingPersonalInfo ? (
                        <button 
                          onClick={() => {
                            setIsEditingPersonalInfo(true);
                            setTempProfileData({
                              firstName: profileData.firstName,
                              lastName: profileData.lastName,
                              email: profileData.email,
                              phone: profileData.phone,
                              primaryRole: profileData.primaryRole,
                              portfolioSize: profileData.portfolioSize,
                              referralCode: profileData.referralCode,
                              country: profileData.country,
                            });
                          }}
                          className="px-4 py-2 bg-primary-700 hover:bg-primary-900 text-neutral-0 rounded-[var(--radius)] transition-all text-small font-medium flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <button 
                            onClick={handleSaveProfile}
                            disabled={isSaving}
                            className="px-4 py-2 bg-primary-700 hover:bg-primary-900 text-neutral-0 rounded-[var(--radius)] transition-all text-small font-medium flex items-center gap-2 disabled:opacity-50"
                          >
                            {isSaving ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <CheckCircle2 className="w-4 h-4" />
                            )}
                            {isSaving ? 'Saving...' : 'Save'}
                          </button>
                          <button 
                            onClick={() => {
                              setIsEditingPersonalInfo(false);
                              setValidationErrors({});
                            }}
                            className="px-4 py-2 bg-neutral-900/5 dark:bg-card/5 hover:bg-neutral-900/10 dark:hover:bg-card/10 text-foreground dark:text-neutral-0 rounded-[var(--radius)] transition-all text-small font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Information Grid - 3 Columns */}
                    <div className="grid grid-cols-3 gap-x-8 gap-y-6">
                      {/* First Name */}
                      <div>
                        <div className="text-caption text-neutral-500 mb-2">
                          First Name
                        </div>
                        {isEditingPersonalInfo ? (
                          <div>
                            <input
                              type="text"
                              value={tempProfileData.firstName}
                              onChange={(e) => setTempProfileData({ ...tempProfileData, firstName: e.target.value })}
                              className="w-full bg-neutral-900/[0.02] dark:bg-card/[0.02] border border-black/[0.08] dark:border-white/[0.08] rounded-[var(--radius)] px-3 py-2 text-[15px] text-foreground dark:text-neutral-0 focus:outline-none focus:border-primary-700 transition-all"
                            />
                            {validationErrors.firstName && (
                              <p className="text-caption text-red-500 mt-1">{validationErrors.firstName}</p>
                            )}
                          </div>
                        ) : (
                          <div className="text-[15px] text-foreground dark:text-neutral-0 font-medium">
                            {profileData.firstName || 'Not set'}
                          </div>
                        )}
                      </div>

                      {/* Last Name */}
                      <div>
                        <div className="text-caption text-neutral-500 mb-2">
                          Last Name
                        </div>
                        {isEditingPersonalInfo ? (
                          <div>
                            <input
                              type="text"
                              value={tempProfileData.lastName}
                              onChange={(e) => setTempProfileData({ ...tempProfileData, lastName: e.target.value })}
                              className="w-full bg-neutral-900/[0.02] dark:bg-card/[0.02] border border-black/[0.08] dark:border-white/[0.08] rounded-[var(--radius)] px-3 py-2 text-[15px] text-foreground dark:text-neutral-0 focus:outline-none focus:border-primary-700 transition-all"
                            />
                            {validationErrors.lastName && (
                              <p className="text-caption text-red-500 mt-1">{validationErrors.lastName}</p>
                            )}
                          </div>
                        ) : (
                          <div className="text-[15px] text-foreground dark:text-neutral-0 font-medium">
                            {profileData.lastName || 'Not set'}
                          </div>
                        )}
                      </div>

                      {/* Email Address */}
                      <div>
                        <div className="text-caption text-neutral-500 mb-2">
                          Email Address
                        </div>
                        {isEditingPersonalInfo ? (
                          <div>
                            <input
                              type="email"
                              value={tempProfileData.email}
                              onChange={(e) => setTempProfileData({ ...tempProfileData, email: e.target.value })}
                              className="w-full bg-neutral-900/[0.02] dark:bg-card/[0.02] border border-black/[0.08] dark:border-white/[0.08] rounded-[var(--radius)] px-3 py-2 text-[15px] text-foreground dark:text-neutral-0 focus:outline-none focus:border-primary-700 transition-all"
                            />
                            {validationErrors.email && (
                              <p className="text-caption text-red-500 mt-1">{validationErrors.email}</p>
                            )}
                          </div>
                        ) : (
                          <div className="text-[15px] text-foreground dark:text-neutral-0 font-medium">
                            {profileData.email}
                          </div>
                        )}
                      </div>

                      {/* Phone Number */}
                      <div>
                        <div className="text-caption text-neutral-500 mb-2">
                          Phone Number
                        </div>
                        {isEditingPersonalInfo ? (
                          <div>
                            <input
                              type="tel"
                              value={tempProfileData.phone}
                              onChange={(e) => setTempProfileData({ ...tempProfileData, phone: e.target.value })}
                              className="w-full bg-neutral-900/[0.02] dark:bg-card/[0.02] border border-black/[0.08] dark:border-white/[0.08] rounded-[var(--radius)] px-3 py-2 text-[15px] text-foreground dark:text-neutral-0 focus:outline-none focus:border-primary-700 transition-all"
                            />
                            {validationErrors.phone && (
                              <p className="text-caption text-red-500 mt-1">{validationErrors.phone}</p>
                            )}
                          </div>
                        ) : (
                          <div className="text-[15px] text-foreground dark:text-neutral-0 font-medium">
                            {profileData.phone || 'Not set'}
                          </div>
                        )}
                      </div>

                      {/* Operating Role */}
                      <div>
                        <div className="text-caption text-neutral-500 mb-2">
                          Operating Role
                        </div>
                        {isEditingPersonalInfo ? (
                          <select
                            value={tempProfileData.primaryRole}
                            onChange={(e) => setTempProfileData({ ...tempProfileData, primaryRole: e.target.value })}
                            className="w-full bg-neutral-900/[0.02] dark:bg-card/[0.02] border border-black/[0.08] dark:border-white/[0.08] rounded-[var(--radius)] px-3 py-2 text-[15px] text-foreground dark:text-neutral-0 focus:outline-none focus:border-primary-700 transition-all"
                          >
                            <option value="land-owner">Land Owner</option>
                            <option value="strategic-investor">Strategic Investor</option>
                            <option value="both">Dual Mandate</option>
                          </select>
                        ) : (
                          <div className="text-[15px] text-foreground dark:text-neutral-0 font-medium">
                            {getRoleLabel(profileData.primaryRole)}
                          </div>
                        )}
                      </div>

                      {/* Portfolio Size */}
                      <div>
                        <div className="text-caption text-neutral-500 mb-2">
                          Portfolio Size
                        </div>
                        {isEditingPersonalInfo ? (
                          <select
                            value={tempProfileData.portfolioSize}
                            onChange={(e) => setTempProfileData({ ...tempProfileData, portfolioSize: e.target.value })}
                            className="w-full bg-neutral-900/[0.02] dark:bg-card/[0.02] border border-black/[0.08] dark:border-white/[0.08] rounded-[var(--radius)] px-3 py-2 text-[15px] text-foreground dark:text-neutral-0 focus:outline-none focus:border-primary-700 transition-all"
                          >
                            <option value="1">1 Property</option>
                            <option value="2-5">2-5 Properties</option>
                            <option value="6-20">6-20 Properties</option>
                            <option value="20+">20+ Properties</option>
                          </select>
                        ) : (
                          <div className="text-[15px] text-foreground dark:text-neutral-0 font-medium">
                            {getPortfolioSizeLabel(profileData.portfolioSize)}
                          </div>
                        )}
                      </div>

                      {/* Referral Code */}
                      <div>
                        <div className="text-caption text-neutral-500 mb-2">
                          Referral Code
                        </div>
                        {isEditingPersonalInfo ? (
                          <input
                            type="text"
                            value={tempProfileData.referralCode}
                            onChange={(e) => setTempProfileData({ ...tempProfileData, referralCode: e.target.value })}
                            placeholder="Optional"
                            className="w-full bg-neutral-900/[0.02] dark:bg-card/[0.02] border border-black/[0.08] dark:border-white/[0.08] rounded-[var(--radius)] px-3 py-2 text-[15px] text-foreground dark:text-neutral-0 focus:outline-none focus:border-primary-700 transition-all"
                          />
                        ) : (
                          <div className="text-[15px] text-foreground dark:text-neutral-0 font-medium">
                            {profileData.referralCode || 'Not set'}
                          </div>
                        )}
                      </div>

                      {/* Country */}
                      <div>
                        <div className="text-caption text-neutral-500 mb-2">
                          Country
                        </div>
                        {isEditingPersonalInfo ? (
                          <select
                            value={tempProfileData.country}
                            onChange={(e) => setTempProfileData({ ...tempProfileData, country: e.target.value })}
                            className="w-full bg-neutral-900/[0.02] dark:bg-card/[0.02] border border-black/[0.08] dark:border-white/[0.08] rounded-[var(--radius)] px-3 py-2 text-[15px] text-foreground dark:text-neutral-0 focus:outline-none focus:border-primary-700 transition-all"
                          >
                            <option value="IN">India</option>
                            <option value="US">United States</option>
                            <option value="UK">United Kingdom</option>
                            <option value="SG">Singapore</option>
                            <option value="AE">UAE</option>
                          </select>
                        ) : (
                          <div className="text-[15px] text-foreground dark:text-neutral-0 font-medium">
                            {profileData.country === 'IN' ? 'India' : profileData.country}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Identity Verification Section */}
                  <div className="mb-8 p-8 rounded-[var(--radius-card)] bg-card/50 dark:bg-card/[0.02] border border-black/5 dark:border-white/5 backdrop-blur-xl">
                    <h2 className="text-h3 font-medium text-foreground dark:text-neutral-0 mb-6">
                      Identity Verification
                    </h2>

                    {profileData.documentType ? (
                      <div className="space-y-4">
                        {/* Verification Status Badge */}
                        <div className="flex items-center gap-3 mb-4">
                          {profileData.documentVerified ? (
                            <>
                              <div className="w-10 h-10 rounded-full bg-primary-700/10 flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5 text-primary-700" />
                              </div>
                              <div>
                                <div className="text-small font-medium text-primary-700 dark:text-primary-400">
                                  Verified
                                </div>
                                <div className="text-caption text-neutral-500">
                                  Your identity has been verified
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                                <Shield className="w-5 h-5 text-yellow-500" />
                              </div>
                              <div>
                                <div className="text-small font-medium text-yellow-600 dark:text-yellow-400">
                                  Pending Verification
                                </div>
                                <div className="text-caption text-neutral-500">
                                  Your documents are under review
                                </div>
                              </div>
                            </>
                          )}
                        </div>

                        {/* Document Details Grid */}
                        <div className="grid grid-cols-2 gap-6 mt-6">
                          <div>
                            <div className="text-caption text-neutral-500 mb-2">
                              Document Type
                            </div>
                            <div className="text-[15px] text-foreground dark:text-neutral-0 font-medium">
                              {profileData.documentType === 'aadhaar' ? 'Aadhaar Card' : 'PAN Card'}
                            </div>
                          </div>

                          <div>
                            <div className="text-caption text-neutral-500 mb-2">
                              Document Number
                            </div>
                            <div className="text-[15px] text-foreground dark:text-neutral-0 font-medium font-mono">
                              {profileData.documentNumber || 'Not provided'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <div className="w-16 h-16 rounded-full bg-neutral-900/5 dark:bg-card/5 flex items-center justify-center mx-auto mb-4">
                          <Shield className="w-8 h-8 text-muted-foreground dark:text-neutral-300/60" />
                        </div>
                        <p className="text-small text-neutral-700/80 dark:text-neutral-300/80 mb-1">
                          No identity verification documents submitted
                        </p>
                        <p className="text-caption text-neutral-500">
                          Complete verification during onboarding to access all features
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Refer & Earn Card */}
                  <div className="mb-8 rounded-[var(--radius-card)] bg-card/85 dark:bg-card/[0.03] border border-black/[0.08] dark:border-white/[0.08] p-7 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)] transition-all duration-300">
                    {/* Header */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-h2">🎁</span>
                          <div className="text-h3 tracking-tight font-normal text-foreground dark:text-neutral-0">
                            Refer & Earn
                          </div>
                        </div>
                      </div>

                      {/* Referral Code */}
                      <div className="p-4 rounded-[var(--radius-card)] bg-gradient-to-br from-primary-100 to-primary-100/50 dark:from-primary-700/10 dark:to-primary-700/5 border border-primary-200/50 dark:border-primary-700/20">
                        <div className="flex items-center justify-between gap-4">
                          <div className="text-h2 font-medium tracking-wider text-primary-700 dark:text-primary-400 font-mono">
                            {profileData.referralCode || `VYBE${profileData.firstName.substring(0, 4).toUpperCase()}`}
                          </div>
                          <div className="relative">
                            <button 
                              onClick={() => setShowShareMenu(!showShareMenu)}
                              className="px-3.5 py-2 bg-primary-700 hover:bg-primary-900 text-neutral-0 rounded-[var(--radius)] transition-all duration-200 text-caption font-medium uppercase tracking-wider shadow-[0_4px_12px_rgba(28,117,188,0.3)] hover:shadow-[0_6px_16px_rgba(28,117,188,0.4)] hover:scale-105 flex items-center gap-2"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                              Share
                            </button>

                            {/* Share Menu Dropdown */}
                            {showShareMenu && (
                            <div className="absolute right-0 top-full mt-2 w-56 bg-card/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.08] rounded-[var(--radius-card)] shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden z-50">
                              <div className="p-2">
                                {/* WhatsApp */}
                                <button
                                  onClick={() => {
                                    const referralCode = profileData.referralCode || `VYBE${profileData.firstName.substring(0, 4).toUpperCase()}`;
                                    const message = `Join VYBE - Premium Real Estate Intelligence Platform! Use my referral code: ${referralCode}`;
                                    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
                                    setShowShareMenu(false);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-3 rounded-[var(--radius)] hover:bg-neutral-900/[0.02] dark:hover:bg-card/[0.02] transition-all text-left"
                                >
                                  <div className="w-10 h-10 rounded-[var(--radius)] bg-[#25D366]/10 flex items-center justify-center">
                                    <MessageCircle className="w-5 h-5 text-[#25D366]" />
                                  </div>
                                  <div>
                                    <div className="text-small font-medium text-foreground dark:text-neutral-0">
                                      WhatsApp
                                    </div>
                                    <div className="text-caption text-neutral-700/80 dark:text-neutral-300/80">
                                      Share via WhatsApp
                                    </div>
                                  </div>
                                </button>

                                {/* Email */}
                                <button
                                  onClick={() => {
                                    const referralCode = profileData.referralCode || `VYBE${profileData.firstName.substring(0, 4).toUpperCase()}`;
                                    const subject = 'Join VYBE - Premium Real Estate Platform';
                                    const body = `Hi,\n\nI'd like to invite you to join VYBE, a premium intelligence-first real estate platform for UHNIs.\n\nUse my referral code: ${referralCode}\n\nBest regards,\n${profileData.firstName}`;
                                    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
                                    setShowShareMenu(false);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-3 rounded-[var(--radius)] hover:bg-neutral-900/[0.02] dark:hover:bg-card/[0.02] transition-all text-left"
                                >
                                  <div className="w-10 h-10 rounded-[var(--radius)] bg-blue-500/10 flex items-center justify-center">
                                    <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                  </div>
                                  <div>
                                    <div className="text-small font-medium text-foreground dark:text-neutral-0">
                                      Email
                                    </div>
                                    <div className="text-caption text-neutral-700/80 dark:text-neutral-300/80">
                                      Share via email
                                    </div>
                                  </div>
                                </button>

                                {/* Copy Link */}
                                <button
                                  onClick={() => {
                                    const referralCode = profileData.referralCode || `VYBE${profileData.firstName.substring(0, 4).toUpperCase()}`;
                                    const referralLink = `https://vybe.app/signup?ref=${referralCode}`;
                                    copyToClipboard(referralLink);
                                    setShowShareMenu(false);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-3 rounded-[var(--radius)] hover:bg-neutral-900/[0.02] dark:hover:bg-card/[0.02] transition-all text-left"
                                >
                                  <div className="w-10 h-10 rounded-[var(--radius)] bg-primary-700/10 flex items-center justify-center">
                                    <Copy className="w-5 h-5 text-primary-700 dark:text-primary-400" />
                                  </div>
                                  <div>
                                    <div className="text-small font-medium text-foreground dark:text-neutral-0">
                                      Copy Link
                                    </div>
                                    <div className="text-caption text-neutral-700/80 dark:text-neutral-300/80">
                                      Copy referral link
                                    </div>
                                  </div>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                    {/* Stats */}
                    <div className="pt-6 border-t border-black/5 dark:border-white/5 text-center">
                      <div className="text-h1 tracking-tight font-normal text-foreground dark:text-neutral-0">
                        12
                      </div>
                      <div className="text-caption text-neutral-500 font-medium">
                        Total Referrals
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-h2 tracking-tight text-foreground dark:text-neutral-0 mb-2">
                    Notification Preferences
                  </h2>
                  <p className="text-small text-neutral-700/80 dark:text-neutral-300/80 mb-8">
                    Manage how you receive updates and alerts
                  </p>

                  <div className="space-y-5">
                    {[
                      { key: 'emailReports', label: 'Email Reports', desc: 'Receive detailed property analysis reports via email' },
                      { key: 'smsAlerts', label: 'SMS Alerts', desc: 'Get important updates via text message' },
                      { key: 'partnerUpdates', label: 'Partner Updates', desc: 'Notifications about partner milestones and activities' },
                      { key: 'marketInsights', label: 'Market Insights', desc: 'Weekly market trends and investment opportunities' },
                      { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Summary of your portfolio performance' },
                    ].map((item) => (
                      <div key={item.key} className="flex items-start justify-between p-5 rounded-[var(--radius-card)] bg-neutral-900/[0.02] dark:bg-card/[0.02] border border-black/5 dark:border-white/5">
                        <div className="flex-1">
                          <div className="text-small font-medium text-foreground dark:text-neutral-0 mb-1">
                            {item.label}
                          </div>
                          <div className="text-small text-neutral-700/80 dark:text-neutral-300/80">
                            {item.desc}
                          </div>
                        </div>
                        <label className="relative inline-block w-12 h-6 ml-4 flex-shrink-0">
                          <input
                            type="checkbox"
                            checked={notificationSettings[item.key as keyof typeof notificationSettings]}
                            onChange={(e) =>
                              setNotificationSettings({
                                ...notificationSettings,
                                [item.key]: e.target.checked,
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-12 h-6 bg-neutral-900/10 dark:bg-card/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-card dark:after:bg-neutral-900 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-700 dark:peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/5">
                    <button
                      onClick={() => {
                        setShowSaved(true);
                        setTimeout(() => setShowSaved(false), 3000);
                      }}
                      className="px-6 py-3 bg-neutral-900 dark:bg-card text-neutral-0 dark:text-foreground rounded-[var(--radius-card)] hover:bg-neutral-900/90 dark:hover:bg-card/90 transition-all text-small font-medium"
                    >
                      Save Preferences
                    </button>
                  </div>
                </div>
              )}

              {/* Order History Tab */}
              {activeTab === 'order-history' && (
                <div>
                  <h2 className="text-h2 tracking-tight text-foreground dark:text-neutral-0 mb-2 font-normal">
                    Order History
                  </h2>
                  <p className="text-small text-neutral-700/80 dark:text-neutral-300/80 mb-8">
                    View all your service orders and transactions
                  </p>

                  {/* Orders Table */}
                  <div className="rounded-[var(--radius-card)] border border-black/5 dark:border-white/5 overflow-hidden">
                    {/* Table Header */}
                    <div className="bg-neutral-900/[0.02] dark:bg-card/[0.02] border-b border-black/5 dark:border-white/5 px-6 py-4">
                      <div className="grid grid-cols-4 gap-4">
                        <div className="text-caption tracking-[0.1em] uppercase font-medium text-neutral-500">
                          Services
                        </div>
                        <div className="text-caption tracking-[0.1em] uppercase font-medium text-neutral-500">
                          Property
                        </div>
                        <div className="text-caption tracking-[0.1em] uppercase font-medium text-neutral-500">
                          Date
                        </div>
                        <div className="text-caption tracking-[0.1em] uppercase font-medium text-neutral-500">
                          Status
                        </div>
                      </div>
                    </div>

                    {/* Table Body */}
                    <div className="bg-card/50 dark:bg-card/[0.02] backdrop-blur-xl">
                      {[
                        {
                          id: 'ORD-2026-045',
                          service: 'Property Valuation Report',
                          property: 'Sterling Heights, Sector 47',
                          date: 'Mar 12, 2026',
                          status: 'Completed',
                          statusColor: 'primary'
                        },
                        {
                          id: 'ORD-2026-044',
                          service: 'Legal Document Review',
                          property: 'Sterling Heights, Sector 47',
                          date: 'Mar 08, 2026',
                          status: 'Completed',
                          statusColor: 'primary'
                        },
                        {
                          id: 'ORD-2026-043',
                          service: 'Property Tax Consultation',
                          property: 'Golden Meadows Estate',
                          date: 'Feb 28, 2026',
                          status: 'Completed',
                          statusColor: 'primary'
                        },
                        {
                          id: 'ORD-2026-042',
                          service: 'Site Inspection Service',
                          property: 'Sterling Heights, Sector 47',
                          date: 'Feb 22, 2026',
                          status: 'Processing',
                          statusColor: 'blue'
                        },
                        {
                          id: 'ORD-2026-041',
                          service: 'Architecture Consultation',
                          property: 'Riverside Enclave',
                          date: 'Feb 15, 2026',
                          status: 'Completed',
                          statusColor: 'primary'
                        },
                        {
                          id: 'ORD-2026-040',
                          service: 'Property Insurance Setup',
                          property: 'Sterling Heights, Sector 47',
                          date: 'Feb 10, 2026',
                          status: 'Completed',
                          statusColor: 'primary'
                        },
                        {
                          id: 'ORD-2026-039',
                          service: 'Market Analysis Report',
                          property: 'Emerald Gardens Complex',
                          date: 'Jan 28, 2026',
                          status: 'Pending',
                          statusColor: 'yellow'
                        },
                        {
                          id: 'ORD-2026-038',
                          service: 'Interior Design Consultation',
                          property: 'Golden Meadows Estate',
                          date: 'Jan 20, 2026',
                          status: 'Completed',
                          statusColor: 'primary'
                        },
                      ].map((order, idx) => (
                        <div
                          key={idx}
                          className="border-b border-black/5 dark:border-white/5 last:border-b-0 px-6 py-5 hover:bg-neutral-900/[0.01] dark:hover:bg-card/[0.01] transition-colors"
                        >
                          <div className="grid grid-cols-4 gap-4 items-center">
                            {/* Service */}
                            <div>
                              <div className="text-small font-medium text-foreground dark:text-neutral-0 mb-1">
                                {order.service}
                              </div>
                              <div className="text-caption text-neutral-500 font-mono">
                                {order.id}
                              </div>
                            </div>

                            {/* Property */}
                            <div>
                              <div className="text-small text-foreground dark:text-neutral-0">
                                {order.property}
                              </div>
                            </div>

                            {/* Date */}
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                              <span className="text-small text-foreground dark:text-neutral-0">
                                {order.date}
                              </span>
                            </div>

                            {/* Status */}
                            <div>
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius)] text-caption font-medium tracking-wider uppercase ${
                                order.statusColor === 'primary'
                                  ? 'bg-primary-700/10 text-primary-700 dark:text-primary-400 border border-primary-700/20'
                                  : order.statusColor === 'blue'
                                  ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                                  : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20'
                              }`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${
                                  order.statusColor === 'primary'
                                    ? 'bg-primary-700'
                                    : order.statusColor === 'blue'
                                    ? 'bg-blue-500 animate-pulse'
                                    : 'bg-yellow-500'
                                }`} />
                                {order.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary Stats */}
                  <div className="grid grid-cols-3 gap-6 mt-8">
                    <div className="p-6 rounded-[var(--radius-card)] bg-card/50 dark:bg-card/[0.02] border border-black/5 dark:border-white/5 backdrop-blur-xl">
                      <div className="text-caption tracking-[0.1em] uppercase font-medium text-neutral-500 mb-3">
                        Total Orders
                      </div>
                      <div className="text-h1 tracking-tight font-normal text-foreground dark:text-neutral-0 mb-1">
                        28
                      </div>
                      <div className="text-caption text-primary-700 dark:text-primary-400 font-medium">
                        +4 this month
                      </div>
                    </div>

                    <div className="p-6 rounded-[var(--radius-card)] bg-card/50 dark:bg-card/[0.02] border border-black/5 dark:border-white/5 backdrop-blur-xl">
                      <div className="text-caption tracking-[0.1em] uppercase font-medium text-neutral-500 mb-3">
                        Completed
                      </div>
                      <div className="text-h1 tracking-tight font-normal text-foreground dark:text-neutral-0 mb-1">
                        24
                      </div>
                      <div className="text-caption text-neutral-500">
                        86% success rate
                      </div>
                    </div>

                    <div className="p-6 rounded-[var(--radius-card)] bg-card/50 dark:bg-card/[0.02] border border-black/5 dark:border-white/5 backdrop-blur-xl">
                      <div className="text-caption tracking-[0.1em] uppercase font-medium text-neutral-500 mb-3">
                        In Progress
                      </div>
                      <div className="text-h1 tracking-tight font-normal text-foreground dark:text-neutral-0 mb-1">
                        4
                      </div>
                      <div className="text-caption text-neutral-500">
                        Active requests
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}