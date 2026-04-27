import { useNavigate } from 'react-router';
import { Plus, Building2, FileText, Users, Sparkles, UserCheck, Home } from 'lucide-react';
import { SideNav } from '../components/SideNav';
import { NotificationDropdown } from '../components/NotificationDropdown';
import { ThemeToggle } from '../components/ThemeToggle';
import { useEffect, useState } from 'react';

export function EmptyDashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Get user name from localStorage
    const savedUser = localStorage.getItem('vybeUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUserName(userData.name || '');
    } else {
      // Fallback to legacy key
      const savedName = localStorage.getItem('vybeUserName');
      if (savedName) {
        setUserName(savedName);
      }
    }
  }, []);

  const lockedFeatures = [
    {
      icon: Sparkles,
      title: 'HABU Engine',
      description: 'AI-driven Highest & Best Use scenario modeling',
      color: 'from-purple-500/10 to-blue-500/10',
      borderColor: 'border-purple-500/20',
      iconBg: 'bg-purple-500/20',
      iconColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      icon: FileText,
      title: 'Document Vault',
      description: 'Securely stored deeds, CADs, and legal paperwork',
      color: 'from-yellow-500/10 to-orange-500/10',
      borderColor: 'border-yellow-500/20',
      iconBg: 'bg-yellow-500/20',
      iconColor: 'text-yellow-600 dark:text-yellow-400'
    },
    {
      icon: Users,
      title: 'Off-Market Deal Room',
      description: 'Access curated institutional-level land assets',
      color: 'from-primary-700/10 to-green-500/10',
      borderColor: 'border-primary-700/20',
      iconBg: 'bg-primary-700/20',
      iconColor: 'text-primary-700 dark:text-primary-400'
    }
  ];

  return (
    <div className="min-h-screen bg-background dark:bg-neutral-900 transition-colors duration-300">
      {/* Side Navigation */}
      <SideNav />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-card/70 dark:bg-neutral-900/70 backdrop-blur-[30px] border-b border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="text-caption tracking-[0.05em] uppercase font-medium text-primary-700">
                  Command Center
                </div>
              </div>
              <h1 className="text-h2 tracking-[-0.01em] text-foreground dark:text-neutral-0/95">
                Welcome
              </h1>
              <p className="text-small text-neutral-700/80 dark:text-neutral-300/80 mt-0.5">
                Your intelligence vectors are ready to be activated
              </p>
            </div>
            <div className="flex items-center gap-3">
              <NotificationDropdown />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-16 px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Central Empty State Card */}
          <div className="max-w-3xl mx-auto mb-[var(--space-12)]">
            <div className="bg-card/90 dark:bg-card/90 backdrop-blur-[40px] rounded-[var(--radius-card)] p-12 text-center
                            shadow-[0_2px_4px_rgba(0,0,0,0.02),0_20px_40px_-5px_rgba(0,0,0,0.05)]
                            border border-white/60 dark:border-white/10 relative overflow-hidden">
              
              {/* Top subtle highlight */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent" />
              
              {/* Icon */}
              <div className="w-20 h-20 rounded-[var(--radius-card)] bg-primary-700/20 flex items-center justify-center mx-auto mb-6
                              shadow-[0_8px_24px_rgba(28,117,188,0.15)]">
                <Building2 className="w-10 h-10 text-primary-700" strokeWidth={1.5} />
              </div>

              {/* Heading */}
              <h2 className="text-h1 font-medium tracking-[-0.02em] text-foreground dark:text-neutral-0/95 mb-3">
                Add Your First Property
              </h2>

              {/* Description */}
              <p className="text-small text-neutral-700/80 dark:text-neutral-300/80 max-w-lg mx-auto leading-relaxed mb-8">
                Get started by adding your first property. This unlocks insights, document storage, and execution services tailored to your asset.
              </p>

              {/* CTA Button */}
              <button
                onClick={() => navigate('/upload')}
                className="inline-flex items-center gap-2 bg-primary-700 hover:bg-primary-600 text-neutral-0 
                           px-8 py-4 rounded-[var(--radius-card)] transition-all duration-300"
              >
                <Plus className="w-5 h-5" strokeWidth={2.5} />
                <span className="text-small font-medium tracking-tight">Add Property to VYBE</span>
              </button>
            </div>
          </div>

          {/* Locked Platform Capabilities Section */}
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <div className="text-caption tracking-[0.05em] uppercase font-medium text-muted-foreground dark:text-neutral-300/60 mb-2">
                Unlocks Platform Capabilities
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {lockedFeatures.map((feature, index) => (
                <div
                  key={index}
                  className={`bg-gradient-to-br ${feature.color} backdrop-blur-[20px] 
                              rounded-[var(--radius-card)] p-8 text-center
                              border ${feature.borderColor}
                              shadow-[0_2px_4px_rgba(0,0,0,0.02),0_20px_40px_-5px_rgba(0,0,0,0.05)]
                              opacity-50 relative overflow-hidden`}
                >
                  {/* Locked Overlay Effect */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 dark:to-white/5 pointer-events-none" />
                  
                  {/* Lock Icon Watermark */}
                  <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-neutral-900/10 dark:bg-card/10 flex items-center justify-center">
                    <svg 
                      className="w-3.5 h-3.5 text-muted-foreground dark:text-neutral-300/60" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <rect x="5" y="11" width="14" height="10" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-[var(--radius-card)] ${feature.iconBg} flex items-center justify-center mx-auto mb-4`}>
                    <feature.icon className={`w-8 h-8 ${feature.iconColor}`} strokeWidth={1.5} />
                  </div>

                  {/* Title */}
                  <h3 className="text-[16px] font-medium tracking-tight text-foreground dark:text-neutral-0/95 mb-2">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-caption text-neutral-700/80 dark:text-neutral-300/80 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}