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
    <div className="min-h-screen bg-background dark:bg-neutral-900 flex items-center justify-center px-8">
      <div className="max-w-md w-full text-center">
        <div className="bg-card rounded-[var(--radius-card)] p-12 border border-black/[0.06] dark:border-white/[0.08] shadow-lg">
          <div className="text-[72px] font-medium text-foreground/10 dark:text-neutral-0/10 mb-4">
            404
          </div>
          <h1 className="text-h2 font-medium text-foreground dark:text-neutral-0 mb-3">
            Page Not Found
          </h1>
          <p className="text-small text-neutral-700/80 dark:text-neutral-300/80 mb-8">
            The page you're looking for doesn't exist. Redirecting to dashboard in 3 seconds...
          </p>
          
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full px-6 py-3 rounded-[var(--radius-card)] bg-gradient-to-br from-primary-700 to-green-500 text-neutral-0 text-small font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Go to Dashboard
            </button>
            <button
              onClick={() => navigate(-1)}
              className="w-full px-6 py-3 rounded-[var(--radius-card)] bg-neutral-900/5 dark:bg-card/5 text-foreground/70 dark:text-neutral-0/70 text-small font-medium hover:bg-neutral-900/10 dark:hover:bg-card/10 transition-all flex items-center justify-center gap-2"
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
