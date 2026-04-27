import { Share2, ArrowLeft, Download, Check } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import HabuReport from '../../imports/HabuReport';

export function HabuReportView() {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleShare = () => {
    // Fallback for when Clipboard API is blocked (e.g., in some iframe environments)
    try {
      const isIframe = window !== window.parent;
      if (!isIframe && navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(window.location.href).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }).catch((err) => {
          fallbackCopyTextToClipboard(window.location.href);
        });
      } else {
        fallbackCopyTextToClipboard(window.location.href);
      }
    } catch (err) {
      fallbackCopyTextToClipboard(window.location.href);
    }
  };

  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Unable to copy', err);
    }
    document.body.removeChild(textArea);
  };

  return (
    <div className="min-h-screen bg-background dark:bg-neutral-900 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-black/5 dark:border-white/5 bg-card/80 dark:bg-neutral-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className="inline-flex items-center justify-center w-10 h-10 rounded-[var(--radius-card)] bg-neutral-900/5 dark:bg-card/5 hover:bg-neutral-900/10 dark:hover:bg-card/10 transition-colors text-neutral-700/80 dark:text-neutral-300/80"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-small font-medium text-foreground dark:text-neutral-0">
                HABU Report
              </h1>
              <p className="text-caption text-muted-foreground dark:text-neutral-0/50">
                WHF-2024-0847
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900/5 hover:bg-neutral-900/10 dark:bg-card/5 dark:hover:bg-card/10 text-foreground dark:text-neutral-0 rounded-[var(--radius-card)] text-small font-medium transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-primary-700" /> : <Share2 className="w-4 h-4" />}
              {copied ? 'Link Copied!' : 'Share Link'}
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-900 dark:bg-card dark:hover:bg-neutral-100 text-neutral-0 dark:text-neutral-900 rounded-[var(--radius-card)] text-small font-medium transition-colors">
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-border dark:bg-card">
        <div className="min-w-[1200px] w-full min-h-full">
          <HabuReport />
        </div>
      </div>
    </div>
  );
}
