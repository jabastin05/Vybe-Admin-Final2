import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import { SideNav } from '../components/SideNav';

export function PrivacyPolicy() {
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
                  Privacy Policy
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
              {/* Introduction */}
              <div>
                <h2 className="text-h3 font-medium text-foreground dark:text-neutral-0 mb-4">Introduction</h2>
                <p className="text-small leading-relaxed mb-3">
                  VYBE ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our property intelligence platform.
                </p>
              </div>

              {/* Section 1 */}
              <div>
                <h2 className="text-h3 font-medium text-foreground dark:text-neutral-0 mb-4">1. Information We Collect</h2>
                <p className="text-small leading-relaxed mb-3">
                  We collect information that you provide directly to us, including:
                </p>
                <ul className="list-disc list-inside text-small leading-relaxed space-y-2 mb-3">
                  <li>Personal information (name, email address, phone number)</li>
                  <li>Identity verification documents (Aadhaar, PAN for Indian users)</li>
                  <li>Property information and documents</li>
                  <li>Investment preferences and portfolio details</li>
                  <li>Transaction and service order history</li>
                </ul>
              </div>

              {/* Section 2 */}
              <div>
                <h2 className="text-h3 font-medium text-foreground dark:text-neutral-0 mb-4">2. How We Use Your Information</h2>
                <p className="text-small leading-relaxed mb-3">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside text-small leading-relaxed space-y-2 mb-3">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process your property analysis requests</li>
                  <li>Send you technical notices and support messages</li>
                  <li>Respond to your comments and questions</li>
                  <li>Provide personalized property intelligence insights</li>
                  <li>Detect and prevent fraud or illegal activity</li>
                </ul>
              </div>

              {/* Section 3 */}
              <div>
                <h2 className="text-h3 font-medium text-foreground dark:text-neutral-0 mb-4">3. Data Security</h2>
                <p className="text-small leading-relaxed mb-3">
                  We implement appropriate technical and organizational security measures to protect your personal information. This includes encryption of sensitive data, secure storage systems, and regular security audits.
                </p>
                <p className="text-small leading-relaxed">
                  However, no method of transmission over the Internet is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee its absolute security.
                </p>
              </div>

              {/* Section 4 */}
              <div>
                <h2 className="text-h3 font-medium text-foreground dark:text-neutral-0 mb-4">4. Data Sharing and Disclosure</h2>
                <p className="text-small leading-relaxed mb-3">
                  We do not sell your personal information. We may share your information only in the following circumstances:
                </p>
                <ul className="list-disc list-inside text-small leading-relaxed space-y-2 mb-3">
                  <li>With your consent or at your direction</li>
                  <li>With service providers who assist in our operations</li>
                  <li>With partner professionals (lawyers, architects) when you request their services</li>
                  <li>To comply with legal obligations</li>
                  <li>To protect the rights and safety of VYBE and our users</li>
                </ul>
              </div>

              {/* Section 5 */}
              <div>
                <h2 className="text-h3 font-medium text-foreground dark:text-neutral-0 mb-4">5. Your Rights and Choices</h2>
                <p className="text-small leading-relaxed mb-3">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside text-small leading-relaxed space-y-2 mb-3">
                  <li>Access and update your personal information</li>
                  <li>Request deletion of your data</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Export your data in a portable format</li>
                  <li>Object to processing of your personal information</li>
                </ul>
              </div>

              {/* Section 6 */}
              <div>
                <h2 className="text-h3 font-medium text-foreground dark:text-neutral-0 mb-4">6. Data Retention</h2>
                <p className="text-small leading-relaxed mb-3">
                  We retain your information for as long as necessary to provide our services and comply with legal obligations. Property documents and analysis reports may be retained longer for legal and regulatory purposes.
                </p>
              </div>

              {/* Section 7 */}
              <div>
                <h2 className="text-h3 font-medium text-foreground dark:text-neutral-0 mb-4">7. Children's Privacy</h2>
                <p className="text-small leading-relaxed mb-3">
                  Our services are not directed to individuals under 18 years of age. We do not knowingly collect personal information from children.
                </p>
              </div>

              {/* Section 8 */}
              <div>
                <h2 className="text-h3 font-medium text-foreground dark:text-neutral-0 mb-4">8. Changes to This Privacy Policy</h2>
                <p className="text-small leading-relaxed mb-3">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                </p>
              </div>

              {/* Section 9 */}
              <div>
                <h2 className="text-h3 font-medium text-foreground dark:text-neutral-0 mb-4">9. Contact Us</h2>
                <p className="text-small leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us at privacy@vybe.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
