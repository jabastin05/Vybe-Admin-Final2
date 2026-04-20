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
    <div className="min-h-screen bg-[#F2F2F2] dark:bg-[#0a0a0a] flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-black/5 dark:border-white/5 bg-white/80 dark:bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-black/60 dark:text-white/60"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-[14px] font-medium text-black dark:text-white">
                HABU Report
              </h1>
              <p className="text-[12px] text-black/50 dark:text-white/50">
                WHF-2024-0847
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-2 bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 text-black dark:text-white rounded-xl text-[13px] font-medium transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
              {copied ? 'Link Copied!' : 'Share Link'}
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-[#1A1A1A] rounded-xl text-[13px] font-medium transition-colors">
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-[#e5e7eb] dark:bg-[#111111]">
        <div className="min-w-[1200px] w-full min-h-full">
          <HabuReport />
        </div>
      </div>
    </div>
  );
}
