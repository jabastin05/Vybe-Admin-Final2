import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowRight, Mail, Lock, AlertCircle, Shield, Users, UserCheck, Briefcase } from 'lucide-react';
import vybeLogoImage from '../../assets/34582dcf9f86202dc7291352c31dcbccf4aff8ac.png';
import { ThemeToggle } from '../components/ThemeToggle';
import { MOCK_SERVICE_PROVIDERS, resolveServiceProviderIdentity } from '../data/mockServiceProviders';

type UserRole = 'admin' | 'operator' | 'rm' | 'partner';

const ROLE_OPTIONS = [
  { value: 'admin' as UserRole, label: 'Admin', icon: Shield, color: 'green' },
  { value: 'operator' as UserRole, label: 'Operations Manager', icon: Users, color: 'blue' },
  { value: 'rm' as UserRole, label: 'RM', icon: UserCheck, color: 'purple' },
  { value: 'partner' as UserRole, label: 'Service Provider', icon: Briefcase, color: 'orange' },
];

export function AdminSignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@vybe.io');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpSendLoading, setOtpSendLoading] = useState(false);

  const getDefaultEmailForRole = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'admin@vybe.io';
      case 'operator':
        return 'ops@vybe.io';
      case 'rm':
        return 'rajesh.k@vybe.com';
      case 'partner':
        return MOCK_SERVICE_PROVIDERS[0].email;
      default:
        return 'admin@vybe.io';
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setOtpSendLoading(true);

    // Simulate sending OTP
    setTimeout(() => {
      setOtpSendLoading(false);
      setIsOtpSent(true);
      setError('');
    }, 1000);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate OTP (for demo, accept any 6-digit code)
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    
    setIsLoading(true);

    // Simulate OTP verification
    setTimeout(() => {
      // Determine available roles based on email or other logic
      // For demo: some users can have multiple roles
      let availableRoles = [selectedRole];
      
      // Add logic for multi-role users
      // Example: certain emails can be both admin and operator
      if (selectedRole === 'admin') {
        availableRoles = ['admin', 'operator']; // Admin can also act as operator
      } else if (selectedRole === 'operator') {
        // Some operators might have multiple operator roles or additional roles
        availableRoles = ['operator'];
      }
      
      // Store admin user data
      const resolvedName = selectedRole === 'partner'
        ? resolveServiceProviderIdentity(email)
        : getRoleLabel(selectedRole);

      const adminData = {
        name: resolvedName,
        email: email,
        role: selectedRole,
        availableRoles: availableRoles,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('vybeAdminUser', JSON.stringify(adminData));
      localStorage.setItem('vybeAdminName', getRoleLabel(selectedRole));
      
      setIsLoading(false);
      
      // Navigate to dashboard
      navigate('/admin/dashboard');
    }, 1000);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Validate password
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Store admin user data
      const resolvedName = selectedRole === 'partner'
        ? resolveServiceProviderIdentity(email)
        : getRoleLabel(selectedRole);

      const adminData = {
        name: resolvedName,
        email: email,
        role: selectedRole,
        availableRoles: selectedRole === 'admin' ? ['admin', 'operator'] : [selectedRole], // Admins can also be operators
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('vybeAdminUser', JSON.stringify(adminData));
      localStorage.setItem('vybeAdminName', getRoleLabel(selectedRole));
      
      setIsLoading(false);
      
      // Navigate to dashboard
      navigate('/admin/dashboard');
    }, 1000);
  };

  const getRoleLabel = (role: UserRole) => {
    const roleOption = ROLE_OPTIONS.find(r => r.value === role);
    return roleOption?.label || 'User';
  };

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setEmail(getDefaultEmailForRole(role));
    setIsOtpSent(false);
    setOtp('');
    setPassword('');
    setError('');
  };

  /* ── Input field class (reused across all form fields) ── */
  const inputCls =
    'w-full h-[var(--input-height)] bg-input-background border border-border rounded-[var(--radius)] px-[var(--space-3)] text-small text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed';

  const inputWithIconCls =
    'w-full h-[var(--input-height)] bg-input-background border border-border rounded-[var(--radius)] pl-10 pr-[var(--space-3)] text-small text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed';

  const labelCls = 'block text-caption text-muted-foreground uppercase tracking-wider mb-[var(--space-1)]';

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="fixed top-0 inset-x-0 z-50 h-16 bg-card/90 backdrop-blur-xl border-b border-border">
        <div className="h-full max-w-screen-xl mx-auto px-[var(--padding-desktop)] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-[var(--space-2)]">
            <img src={vybeLogoImage} alt="VYBE" className="w-8 h-8 object-contain" />
            <span className="text-small font-semibold tracking-tight text-foreground">VYBE</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* ── Centered form ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-center min-h-screen px-[var(--padding-mobile)] pt-16">
        <div className="w-full max-w-[420px]">

          {/* ── Form card ── */}
          <div className="bg-card border border-border rounded-[var(--radius-card)] p-[var(--card-padding-desktop)]">

            {/* Admin badge */}
            <div className="flex justify-center mb-[var(--space-6)]">
              <div className="inline-flex items-center gap-[var(--space-2)] px-[var(--space-3)] py-[var(--space-1)] bg-accent border border-border rounded-full">
                <Shield className="w-3.5 h-3.5 text-foreground" />
                <span className="text-caption font-medium text-foreground uppercase tracking-wider">
                  Admin Portal
                </span>
              </div>
            </div>

            {/* Heading */}
            <div className="text-center mb-[var(--space-6)]">
              <h1 className="text-h1 text-foreground mb-[var(--space-1)]">Admin Access</h1>
              <p className="text-small text-muted-foreground">
                Sign in to the VYBE admin portal
              </p>
            </div>

            <form
              onSubmit={selectedRole === 'admin' ? handleSignIn : (isOtpSent ? handleVerifyOtp : handleSendOtp)}
              className="flex flex-col gap-[var(--space-4)]"
            >
              {/* Role */}
              <div>
                <label htmlFor="role" className={labelCls}>Role</label>
                <select
                  id="role"
                  value={selectedRole}
                  onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                  className={inputCls}
                >
                  {ROLE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className={labelCls}>Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-[var(--space-3)] top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={selectedRole === 'admin' ? 'admin@vybe.io' : 'your.email@vybe.com'}
                    className={inputWithIconCls}
                    required
                    disabled={isOtpSent && selectedRole !== 'admin'}
                  />
                </div>
              </div>

              {/* Password — Admin only */}
              {selectedRole === 'admin' && (
                <div>
                  <label htmlFor="password" className={labelCls}>Password</label>
                  <div className="relative">
                    <Lock className="absolute left-[var(--space-3)] top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className={inputWithIconCls}
                      required
                    />
                  </div>
                </div>
              )}

              {/* OTP — Non-admin, after send */}
              {selectedRole !== 'admin' && isOtpSent && (
                <div>
                  <label htmlFor="otp" className={labelCls}>Enter OTP</label>
                  <div className="relative">
                    <Lock className="absolute left-[var(--space-3)] top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <input
                      id="otp"
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="Enter 6-digit OTP"
                      className={`${inputWithIconCls} tracking-[0.3em]`}
                      maxLength={6}
                      required
                    />
                  </div>
                  <p className="mt-[var(--space-1)] text-caption text-muted-foreground flex items-center gap-[var(--space-1)]">
                    <span>✓</span> OTP sent to {email}
                  </p>
                </div>
              )}

              {/* Resend OTP */}
              {selectedRole !== 'admin' && isOtpSent && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => { setIsOtpSent(false); setOtp(''); }}
                    className="text-small text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
                  >
                    Change email or resend OTP
                  </button>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="bg-destructive/5 border border-destructive/20 rounded-[var(--radius)] p-[var(--space-3)] flex items-start gap-[var(--space-2)]">
                  <AlertCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                  <p className="text-small text-destructive">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading || otpSendLoading}
                className="w-full h-[var(--button-height-desktop)] bg-primary hover:opacity-90 text-primary-foreground rounded-[var(--radius-button)] text-small font-medium transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-[var(--space-2)]"
              >
                {(isLoading || otpSendLoading) ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    {otpSendLoading ? 'Sending OTP…' : 'Verifying…'}
                  </>
                ) : (
                  <>
                    {selectedRole === 'admin'
                      ? 'Sign In to Admin Portal'
                      : isOtpSent
                        ? 'Verify OTP & Sign In'
                        : 'Send OTP'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Security note */}
          <div className="mt-[var(--space-4)] bg-card border border-border rounded-[var(--radius)] p-[var(--space-4)]">
            <p className="text-caption text-muted-foreground text-center leading-relaxed">
              <strong className="text-foreground">Admin Portal:</strong> Exclusively for VYBE internal team members. Unauthorized access is strictly prohibited.
            </p>
          </div>

          {/* Demo credentials */}
          <div className="mt-[var(--space-3)] bg-muted border border-border rounded-[var(--radius)] p-[var(--space-4)]">
            <p className="text-caption text-muted-foreground text-center mb-[var(--space-2)]">
              <strong className="text-foreground">Demo Instructions</strong>
            </p>
            {selectedRole === 'admin' ? (
              <div className="flex flex-col gap-[var(--space-1)] text-caption text-muted-foreground text-center">
                <p>Email: <span className="text-foreground font-medium">admin@vybe.io</span></p>
                <p>Password: <span className="text-foreground font-medium">Any 6+ characters</span></p>
              </div>
            ) : (
              <div className="flex flex-col gap-[var(--space-1)] text-caption text-muted-foreground text-center">
                <p>Enter your registered email and click "Send OTP"</p>
                <p>OTP: <span className="text-foreground font-medium">Any 6-digit code</span></p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
