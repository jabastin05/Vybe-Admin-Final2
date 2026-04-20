import { useNavigate } from 'react-router';
import { Home, ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';

export function NotFound() {
  const navigate = useNavigate();

  // Auto-redirect to dashboard after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#F2F2F2] dark:bg-[#0a0a0a] flex items-center justify-center px-8">
      <div className="max-w-md w-full text-center">
        <div className="bg-white dark:bg-[#111111] rounded-3xl p-12 border border-black/[0.06] dark:border-white/[0.08] shadow-lg">
          <div className="text-[72px] font-bold text-black/10 dark:text-white/10 mb-4">
            404
          </div>
          <h1 className="text-[24px] font-medium text-black dark:text-white mb-3">
            Page Not Found
          </h1>
          <p className="text-[14px] text-black/60 dark:text-white/60 mb-8">
            The page you're looking for doesn't exist. Redirecting to dashboard in 3 seconds...
          </p>
          
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full px-6 py-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 text-white text-[14px] font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Go to Dashboard
            </button>
            <button
              onClick={() => navigate(-1)}
              className="w-full px-6 py-3 rounded-2xl bg-black/5 dark:bg-white/5 text-black/70 dark:text-white/70 text-[14px] font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
