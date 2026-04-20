import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowRight, Mail, AlertCircle } from 'lucide-react';
import vybeLogoImage from '../../assets/34582dcf9f86202dc7291352c31dcbccf4aff8ac.png';
import { ThemeToggle } from '../components/ThemeToggle';

export function SignIn() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'email' | 'verification'>('email');
  const [email, setEmail] = useState('arjun.mehta@mehtacapital.com');
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [canResend, setCanResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

  // Start resend timer
  const startResendTimer = () => {
    setCanResend(false);
    setResendTimer(30);
    
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle Send Code
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep('verification');
      startResendTimer();
    }, 1000);
  };

  // Handle verification code input
  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Handle verification
  const handleVerify = () => {
    setIsLoading(true);
    
    // Simulate verification
    setTimeout(() => {
      // Extract name from email for demo
      const emailName = email.split('@')[0];
      const userName = emailName.split('.').map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' ');
      
      // Store user data
      const userData = {
        name: userName,
        email: email,
        createdAt: new Date().toISOString(),
        signupMethod: 'email',
      };
      localStorage.setItem('vybeUser', JSON.stringify(userData));
      localStorage.setItem('vybeUserName', userName);
      
      setIsLoading(false);
      
      // Check if user has completed onboarding
      const hasCompletedOnboarding = localStorage.getItem('vybeOnboardingComplete') === 'true';
      
      if (hasCompletedOnboarding) {
        // Existing user - go to dashboard
        navigate('/dashboard');
      } else {
        // User hasn't completed onboarding - go to onboarding
        navigate('/onboarding');
      }
    }, 1000);
  };

  // Handle Resend Code
  const handleResendCode = () => {
    setVerificationCode(['', '', '', '', '', '']);
    startResendTimer();
  };

  const handleSSOSignIn = (provider: 'google' | 'microsoft' | 'linkedin') => {
    // Simulate SSO signin
    const userName = `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`;
    localStorage.setItem('vybeUserName', userName);
    
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem('vybeOnboardingComplete') === 'true';
    
    if (hasCompletedOnboarding) {
      // Existing user - go to dashboard
      navigate('/dashboard');
    } else {
      // User hasn't completed onboarding - go to onboarding
      navigate('/onboarding');
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2] dark:bg-[#0a0a0a] transition-colors duration-300">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-black/70 backdrop-blur-[30px] border-b border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img src={vybeLogoImage} alt="VYBE" className="w-10 h-10 object-contain" />
              <span className="text-[16px] font-semibold tracking-tight text-black dark:text-white">VYBE</span>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Sign In Form */}
      <div className="flex items-center justify-center min-h-screen p-8 pt-24">
        <div className="w-full max-w-md">
          {/* Email Step */}
          {step === 'email' && (
            <>
              {/* Form Card */}
              <div className="bg-white dark:bg-[#111111] border border-black/5 dark:border-white/5 rounded-2xl p-6">
                <div className="text-center mb-6">
                  <h1 className="text-[24px] tracking-tight text-black dark:text-white/95 mb-1">
                    Welcome Back
                  </h1>
                  <p className="text-[13px] text-black/60 dark:text-white/60">
                    Sign in to your VYBE account
                  </p>
                </div>

                {/* SSO Options */}
                <div className="space-y-2 mb-6">
                  <button
                    type="button"
                    onClick={() => handleSSOSignIn('google')}
                    className="w-full bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg px-4 py-2.5 text-[13px] text-black dark:text-white hover:bg-black/[0.02] dark:hover:bg-white/[0.05] transition-all flex items-center justify-center gap-2 group"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Continue with Google</span>
                  </button>
                </div>

                {/* Divider */}
                <div className="relative mb-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-black/10 dark:border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-[10px] tracking-wider uppercase">
                    <span className="bg-white dark:bg-[#111111] px-3 text-black/40 dark:text-white/40">Or continue with email</span>
                  </div>
                </div>

                <form onSubmit={handleSendCode} className="space-y-3">
                  {/* Email Input */}
                  <div>
                    <label htmlFor="email" className="block text-[10px] text-black/60 dark:text-white/60 mb-1.5 tracking-wider uppercase">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40 dark:text-white/40" />
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full bg-black/[0.02] dark:bg-white/[0.02] border border-black/10 dark:border-white/10 rounded-lg pl-10 pr-3 py-2.5 text-[13px] text-black dark:text-white/95 placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none focus:border-black/20 dark:focus:border-white/20 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-3 flex items-start gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />
                      <p className="text-[12px] text-red-400">{error}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-black dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-lg hover:bg-black/90 dark:hover:bg-white/90 transition-all text-[13px] font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin" />
                        Sending Code...
                      </>
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Sign Up Link */}
                <div className="mt-5 pt-4 border-t border-black/5 dark:border-white/5 text-center">
                  <p className="text-[12px] text-black/60 dark:text-white/60">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-black dark:text-white/95 hover:underline font-medium">
                      Sign Up
                    </Link>
                  </p>
                </div>
              </div>

              {/* Info Note */}
              <div className="mt-6 bg-blue-500/5 border border-blue-500/10 rounded-lg p-4">
                <p className="text-[12px] text-black/60 dark:text-white/60 text-center leading-relaxed">
                  <strong className="text-black dark:text-white/95">Demo Mode:</strong> This is a frontend demonstration. 
                  For production use, integrate with a secure authentication provider.
                </p>
              </div>

              {/* Admin Portal Access */}
              <div className="mt-4 text-center">
                <Link 
                  to="/admin/signin" 
                  className="text-[11px] text-black/40 dark:text-white/40 hover:text-black/60 dark:hover:text-white/60 transition-colors tracking-wide"
                >
                  Admin Portal →
                </Link>
              </div>
            </>
          )}

          {/* Verification Step */}
          {step === 'verification' && (
            <>
              <div className="bg-white dark:bg-[#111111] border border-black/5 dark:border-white/5 rounded-2xl p-6">
                {/* Back Button */}
                <button
                  onClick={() => setStep('email')}
                  className="mb-6 text-[13px] text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors flex items-center gap-1"
                >
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  Change Email
                </button>

                <div className="text-center mb-6">
                  <h1 className="text-[24px] tracking-tight text-black dark:text-white/95 mb-1">
                    Verify Your Email
                  </h1>
                  <p className="text-[13px] text-black/60 dark:text-white/60">
                    Enter the 6-digit code sent to
                  </p>
                  <p className="text-[13px] text-black dark:text-white/95 font-medium mt-1">
                    {email}
                  </p>
                </div>

                {/* Verification Code Input */}
                <div className="flex gap-2 justify-center mb-6">
                  {verificationCode.map((digit, index) => (
                    <input
                      key={index}
                      id={`code-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !digit && index > 0) {
                          const prevInput = document.getElementById(`code-${index - 1}`);
                          prevInput?.focus();
                        }
                      }}
                      className="w-11 h-12 text-center text-[18px] font-medium bg-black/[0.02] dark:bg-white/[0.02] border border-black/10 dark:border-white/10 rounded-lg text-black dark:text-white/95 focus:outline-none focus:border-black/20 dark:focus:border-white/20 transition-colors"
                    />
                  ))}
                </div>

                {/* Resend Code */}
                <div className="text-center mb-6">
                  {canResend ? (
                    <button
                      onClick={handleResendCode}
                      className="text-[13px] text-black dark:text-white/95 hover:underline font-medium"
                    >
                      Resend Code
                    </button>
                  ) : (
                    <p className="text-[13px] text-black/60 dark:text-white/60">
                      Resend code in <span className="font-medium">{resendTimer}s</span>
                    </p>
                  )}
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-3 flex items-start gap-2 mb-4">
                    <AlertCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />
                    <p className="text-[12px] text-red-400">{error}</p>
                  </div>
                )}

                {/* Continue Button */}
                <button
                  onClick={handleVerify}
                  disabled={isLoading || verificationCode.some(d => !d)}
                  className="w-full bg-black dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-lg hover:bg-black/90 dark:hover:bg-white/90 transition-all text-[13px] font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify & Continue
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Sign Up Link */}
                <div className="mt-5 pt-4 border-t border-black/5 dark:border-white/5 text-center">
                  <p className="text-[12px] text-black/60 dark:text-white/60">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-black dark:text-white/95 hover:underline font-medium">
                      Sign Up
                    </Link>
                  </p>
                </div>
              </div>

              {/* Info Note */}
              <div className="mt-6 bg-blue-500/5 border border-blue-500/10 rounded-lg p-4">
                <p className="text-[12px] text-black/60 dark:text-white/60 text-center leading-relaxed">
                  <strong className="text-black dark:text-white/95">Demo Mode:</strong> This is a frontend demonstration. 
                  For production use, integrate with a secure authentication provider.
                </p>
              </div>

              {/* Admin Portal Access */}
              <div className="mt-4 text-center">
                <Link 
                  to="/admin/signin" 
                  className="text-[11px] text-black/40 dark:text-white/40 hover:text-black/60 dark:hover:text-white/60 transition-colors tracking-wide"
                >
                  Admin Portal →
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
