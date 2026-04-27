import { Link, useLocation } from 'react-router';
import { Building2, Plus, User, LogOut, TrendingUp, LayoutDashboard, Lightbulb, Briefcase, Home, FileText } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useProperties } from '../contexts/PropertiesContext';

interface NavItem {
  icon: typeof Building2;
  label: string;
  path: string;
  accentColor: string; // Each item gets its own color
}

const navItems: NavItem[] = [
  // { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', accentColor: 'bg-gradient-to-br from-primary-700 to-green-500 dark:bg-card' }, // Hidden from navigation
  { icon: Building2, label: 'Case Management', path: '/properties', accentColor: 'bg-gradient-to-br from-primary-700 to-green-500 dark:bg-card' },
  { icon: Briefcase, label: 'Services', path: '/services', accentColor: 'bg-gradient-to-br from-primary-700 to-green-500 dark:bg-card' },
  { icon: FileText, label: 'My Documents', path: '/documents', accentColor: 'bg-gradient-to-br from-primary-700 to-green-500 dark:bg-card' },
  { icon: TrendingUp, label: 'Market Intelligence', path: '/market-intelligence', accentColor: 'bg-gradient-to-br from-primary-700 to-green-500 dark:bg-card' },
  { icon: Plus, label: 'Add Property', path: '/upload', accentColor: 'bg-gradient-to-br from-primary-700 to-green-500 dark:bg-card' },
  { icon: User, label: 'My Profile', path: '/settings', accentColor: 'bg-gradient-to-br from-primary-700 to-green-500 dark:bg-card' },
];

export function SideNav() {
  const location = useLocation();
  const { theme } = useTheme();
  const { properties } = useProperties();

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    if (path === '/properties') {
      return (location.pathname === '/properties' || location.pathname.startsWith('/property/')) && !location.pathname.includes('/documents');
    }
    if (path === '/my-properties') {
      return location.pathname === '/my-properties';
    }
    if (path === '/upload') {
      return location.pathname === '/upload';
    }
    if (path === '/documents') {
      return location.pathname.startsWith('/documents') || location.pathname.includes('/documents');
    }
    return location.pathname === path;
  };

  const handleLogout = () => {
    window.location.href = '/';
  };

  return (
    <nav className="fixed left-6 top-1/2 -translate-y-1/2 z-50">
      {/* Floating Pill Container */}
      <div className="bg-card/80 backdrop-blur-xl rounded-[32px] p-4 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-black/[0.06] dark:border-white/[0.08]">
        
        {/* Navigation Items */}
        <div className="flex flex-col gap-3">
          {/* Primary Action: Add Property */}
          <Link
            to="/upload"
            className="relative group mb-1"
            title="Add Property"
          >
            <div className="relative w-[64px] h-[64px] rounded-[22px] flex items-center justify-center bg-primary-700 hover:bg-primary-600 text-neutral-0 shadow-[0_8px_24px_rgba(28,117,188,0.25)] hover:shadow-[0_8px_32px_rgba(28,117,188,0.4)] transition-all duration-300 hover:-translate-y-0.5">
              <Plus className="w-8 h-8 transition-transform group-hover:scale-110" strokeWidth={2} />
            </div>

            {/* Tooltip */}
            <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 pointer-events-none transition-all duration-300 whitespace-nowrap z-50">
              <div className="relative px-5 py-3 bg-card dark:bg-neutral-900 rounded-[16px] shadow-[0_12px_40px_-10px_rgba(0,0,0,0.2)] dark:shadow-[0_12px_40px_-10px_rgba(0,0,0,0.6)] border border-black/[0.08] dark:border-white/[0.08]">
                <span className="text-small font-medium text-neutral-900 dark:text-neutral-0">
                  Add Property
                </span>
                <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-b-[6px] border-r-[8px] border-transparent border-r-white dark:border-r-gray-900" />
              </div>
            </div>
          </Link>

          <div className="h-px w-8 mx-auto bg-neutral-900/10 dark:bg-card/10 my-1" />

          {/* My Properties - Only show when properties exist */}
          {properties.length > 0 && (
            <Link
              to="/my-properties"
              className="relative group"
              title="My Properties"
            >
              {/* Pill Button */}
              <div
                className={`
                  relative w-full h-[52px] rounded-2xl flex items-center justify-center
                  transition-all duration-300 group
                  ${isActive('/my-properties')
                    ? 'bg-neutral-900 dark:bg-card text-neutral-0 dark:text-foreground shadow-md scale-105' 
                    : 'text-muted-foreground dark:text-neutral-300/60 hover:text-foreground/90 dark:hover:text-neutral-0/90 hover:bg-neutral-900/[0.08] dark:hover:bg-card/[0.12] hover:scale-[1.02]'
                  }
                `}
              >
                <Home 
                  className={`w-6 h-6 transition-all duration-300 ${
                    isActive('/my-properties')
                      ? 'text-neutral-0 dark:text-foreground' 
                      : 'text-muted-foreground dark:text-neutral-0/50 group-hover:text-foreground/90 dark:group-hover:text-neutral-0/90'
                  }`}
                  strokeWidth={isActive('/my-properties') ? 2 : 1.5}
                />
              </div>

              {/* Modern Tooltip - Floating Pill Style */}
              <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 pointer-events-none transition-all duration-300 whitespace-nowrap z-50">
                <div className="relative px-5 py-3 bg-card dark:bg-neutral-900 rounded-[16px] shadow-[0_12px_40px_-10px_rgba(0,0,0,0.2)] dark:shadow-[0_12px_40px_-10px_rgba(0,0,0,0.6)] border border-black/[0.08] dark:border-white/[0.08]">
                  <span className="text-small font-medium text-neutral-900 dark:text-neutral-0">
                    My Properties
                  </span>
                  
                  {/* Tooltip Arrow */}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-b-[6px] border-r-[8px] border-transparent border-r-white dark:border-r-gray-900" />
                </div>
              </div>

              {/* Active Indicator - Subtle dot */}
              {isActive('/my-properties') && (
                <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-3 rounded-full bg-neutral-900 dark:bg-card" />
              )}
            </Link>
          )}

          {navItems.filter(item => item.path !== '/upload').map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative group"
                title={item.label}
              >
                {/* Pill Button */}
                <div
                  className={`
                    relative w-full h-[52px] rounded-2xl flex items-center justify-center
                    transition-all duration-300 group
                    ${active 
                      ? 'bg-neutral-900 dark:bg-card text-neutral-0 dark:text-foreground shadow-md scale-105' 
                      : 'text-muted-foreground dark:text-neutral-300/60 hover:text-foreground/90 dark:hover:text-neutral-0/90 hover:bg-neutral-900/[0.08] dark:hover:bg-card/[0.12] hover:scale-[1.02]'
                    }
                  `}
                >
                  <item.icon 
                    className={`w-6 h-6 transition-all duration-300 ${
                      active 
                        ? 'text-neutral-0 dark:text-foreground' 
                        : 'text-muted-foreground dark:text-neutral-0/50 group-hover:text-foreground/90 dark:group-hover:text-neutral-0/90'
                    }`}
                    strokeWidth={active ? 2 : 1.5}
                  />
                </div>

                {/* Modern Tooltip - Floating Pill Style */}
                <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 pointer-events-none transition-all duration-300 whitespace-nowrap z-50">
                  <div className="relative px-5 py-3 bg-card dark:bg-neutral-900 rounded-[16px] shadow-[0_12px_40px_-10px_rgba(0,0,0,0.2)] dark:shadow-[0_12px_40px_-10px_rgba(0,0,0,0.6)] border border-black/[0.08] dark:border-white/[0.08]">
                    <span className="text-small font-medium text-neutral-900 dark:text-neutral-0">
                      {item.label}
                    </span>
                    
                    {/* Tooltip Arrow */}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-b-[6px] border-r-[8px] border-transparent border-r-white dark:border-r-gray-900" />
                  </div>
                </div>

                {/* Active Indicator - Subtle dot */}
                {active && (
                  <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-3 rounded-full bg-neutral-900 dark:bg-card" />
                )}
              </Link>
            );
          })}

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent my-2" />

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="relative group"
            title="Logout"
          >
            <div className="relative w-[64px] h-[64px] rounded-[22px] flex items-center justify-center bg-neutral-900/[0.02] dark:bg-card/[0.02] hover:bg-red-50 dark:hover:bg-red-500/10 hover:scale-105 transition-all duration-300">
              <LogOut 
                className="w-6 h-6 text-muted-foreground dark:text-neutral-300/60 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors duration-300" 
                strokeWidth={1.5}
              />
            </div>

            {/* Tooltip */}
            <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 pointer-events-none transition-all duration-300 whitespace-nowrap z-50">
              <div className="relative px-5 py-3 bg-card dark:bg-neutral-900 rounded-[16px] shadow-[0_12px_40px_-10px_rgba(0,0,0,0.2)] dark:shadow-[0_12px_40px_-10px_rgba(0,0,0,0.6)] border border-black/[0.08] dark:border-white/[0.08]">
                <span className="text-small font-medium text-neutral-900 dark:text-neutral-0">
                  Logout
                </span>
                
                <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-b-[6px] border-r-[8px] border-transparent border-r-white dark:border-r-gray-900" />
              </div>
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
}
