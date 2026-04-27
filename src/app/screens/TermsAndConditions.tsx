import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import { SideNav } from '../components/SideNav';

export function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-background dark:bg-neutral-900 transition-colors duration-300">
      <SideNav />
      
      {/* Header */}
      <div className="border-b border-black/5 dark:border-white/10 bg-card dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                to="/settings" 
                className="inline-flex items-center justify-center w-10 h-10 rounded-[var(--radius-card)] bg-neutral-900/5 dark:bg-card/5 hover:bg-neutral-900/10 dark:hover:bg-card/10 transition-colors text-neutral-700/80 dark:text-neutral-300/80"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div>
                <h1 className="text-caption tracking-wider uppercase text-muted-foreground dark:text-neutral-300/60 mb-2">
                  Legal
                </h1>
                <div className="text-h1 tracking-tight text-foreground dark:text-neutral-0/95">
                  Terms & Conditions
                </div>
                <p className="text-small text-muted-foreground dark:text-neutral-0/50 mt-1">
                  Last updated: March 17, 2026
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="bg-card/80 dark:bg-neutral-900 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] rounded-[var(--radius-card)] p-10 shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
          <div className="prose dark:prose-invert max-w-none">
            <div className="space-y-8 text-foreground/80 dark:text-neutral-0/80">
              {/* Section 1 */}
              <div>
                <h2 className="text-h3 font-medium text-foreground dark:text-neutral-0 mb-4">1. Acceptance of Terms</h2>
                <p className="text-small leading-relaxed mb-3">
                  By accessing and using VYBE's property intelligence platform, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms and Conditions, please do not use this service.
                </p>
              </div>

              {/* Section 2 */}
              <div>
                <h2 className="text-h3 font-medium text-foreground dark:text-neutral-0 mb-4">2. Use of Services</h2>
                <p className="text-small leading-relaxed mb-3">
                  VYBE provides property analysis, valuation, and intelligence services to high-net-worth individuals and investors. Our platform is intended for professional use in real estate investment and portfolio management.
                </p>
                <p className="text-small leading-relaxed">
                  You agree to use the service only for lawful purposes and in accordance with these Terms and Conditions.
                </p>
              </div>

              {/* Section 3 */}
              <div>
                <h2 className="text-h3 font-medium text-foreground dark:text-neutral-0 mb-4">3. User Accounts</h2>
                <p className="text-small leading-relaxed mb-3">
                  When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password and for all activities that occur under your account.
                </p>
              </div>

              {/* Section 4 */}
              <div>
                <h2 className="text-h3 font-medium text-foreground dark:text-neutral-0 mb-4">4. Data Privacy</h2>
                <p className="text-small leading-relaxed mb-3">
                  We are committed to protecting your privacy. All property data, personal information, and transaction details are handled in accordance with our Privacy Policy and applicable data protection laws.
                </p>
              </div>

              {/* Section 5 */}
              <div>
                <h2 className="text-h3 font-medium text-foreground dark:text-neutral-0 mb-4">5. Intellectual Property</h2>
                <p className="text-small leading-relaxed mb-3">
                  The service and its original content, features, and functionality are and will remain the exclusive property of VYBE and its licensors. Our trademarks and trade dress may not be used without our prior written consent.
                </p>
              </div>

              {/* Section 6 */}
              <div>
                <h2 className="text-h3 font-medium text-foreground dark:text-neutral-0 mb-4">6. Limitation of Liability</h2>
                <p className="text-small leading-relaxed mb-3">
                  VYBE provides property intelligence and analysis for informational purposes. Investment decisions should be made after consulting with qualified professionals. We are not liable for any investment losses or damages arising from the use of our services.
                </p>
              </div>

              {/* Section 7 */}
              <div>
                <h2 className="text-h3 font-medium text-foreground dark:text-neutral-0 mb-4">7. Modifications to Terms</h2>
                <p className="text-small leading-relaxed mb-3">
                  We reserve the right to modify or replace these Terms at any time. We will provide notice of any material changes by posting the new Terms on this page. Your continued use of the service after any such changes constitutes acceptance of the new Terms.
                </p>
              </div>

              {/* Section 8 */}
              <div>
                <h2 className="text-h3 font-medium text-foreground dark:text-neutral-0 mb-4">8. Contact Information</h2>
                <p className="text-small leading-relaxed">
                  If you have any questions about these Terms and Conditions, please contact us at legal@vybe.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
