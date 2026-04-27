import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import {
  UserPlus, Users, Building2, LogOut, Shield, Settings, FolderOpen,
  Briefcase, Database, GitBranch, User, ChevronDown, LayoutDashboard, Phone,
} from 'lucide-react';
import vybeLogoImage from '../../assets/vybe-logo.svg';
import { ThemeToggle } from './ThemeToggle';

interface AdminLayoutProps {
  children: ReactNode;
}

interface NavItem {
  path: string;
  label: string;
  icon: typeof UserPlus;
  roles: string[];
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { path: '/admin/dashboard',    label: 'Dashboard',    icon: LayoutDashboard, roles: ['admin', 'operator', 'rm', 'partner'] },
      { path: '/admin/callback-log', label: 'Callback Log', icon: Phone,           roles: ['admin', 'operator', 'rm'] },
    ],
  },
  {
    label: 'Management',
    items: [
      { path: '/admin/invitations',     label: 'Invitations',       icon: UserPlus,  roles: ['admin', 'operator'] },
      { path: '/admin/user-management', label: 'User Management',   icon: User,      roles: ['admin'] },
      { path: '/admin/users',           label: 'Service Providers', icon: Users,     roles: ['admin', 'operator'] },
      { path: '/admin/clients',         label: 'Clients',           icon: Building2, roles: ['admin', 'operator', 'rm'] },
      { path: '/admin/cases',           label: 'Cases',             icon: Briefcase, roles: ['admin', 'operator', 'rm', 'partner'] },
    ],
  },
  {
    label: 'Configuration',
    items: [
      { path: '/admin/master-data',        label: 'Master Data',       icon: Database,  roles: ['admin'] },
      { path: '/admin/workflow-templates', label: 'Workflows',         icon: GitBranch, roles: ['admin'] },
      { path: '/admin/services',           label: 'Service Config',    icon: Settings,  roles: ['admin'] },
    ],
  },
  {
    label: 'Documents',
    items: [
      { path: '/admin/documents', label: 'Document Vault', icon: FolderOpen, roles: ['admin', 'operator', 'rm'] },
    ],
  },
];

// flat list kept for any code that may reference navItems directly
const navItems: NavItem[] = navGroups.flatMap(g => g.items);

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  const getUserData = () => {
    const userData = localStorage.getItem('vybeAdminUser');
    if (userData) {
      const user = JSON.parse(userData);
      return {
        name: user.name || 'User',
        email: user.email || '',
        role: user.role || 'admin',
        availableRoles: user.availableRoles || [user.role || 'admin'],
      };
    }
    return { name: 'User', email: '', role: 'admin', availableRoles: ['admin'] };
  };

  const userData = getUserData();
  const userRole = userData.role;
  const hasMultipleRoles = userData.availableRoles.length > 1;

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: 'Admin',
      operator: 'Operations Manager',
      rm: 'RM',
      partner: 'Service Provider',
    };
    return labels[role] || role;
  };

  const getRoleInitials = (role: string) => {
    const map: Record<string, string> = { admin: 'A', operator: 'O', rm: 'R', partner: 'SP' };
    return map[role] || 'U';
  };

  const handleRoleSwitch = (newRole: string) => {
    const storedData = localStorage.getItem('vybeAdminUser');
    if (storedData) {
      const user = JSON.parse(storedData);
      user.role = newRole;
      user.name = getRoleLabel(newRole);
      localStorage.setItem('vybeAdminUser', JSON.stringify(user));
      localStorage.setItem('vybeAdminName', getRoleLabel(newRole));
      setShowRoleSwitcher(false);
      window.location.reload();
    }
  };

  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole));

  const handleSignOut = () => {
    localStorage.removeItem('vybeAdminUser');
    localStorage.removeItem('vybeAdminName');
    navigate('/admin/signin');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">

      {/* ══════════════════════════════════════════════════════
          TOP HEADER
      ══════════════════════════════════════════════════════ */}
      <header className="fixed top-0 inset-x-0 z-50 h-14 bg-card border-b border-border" style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.06)' }}>
        <div className="h-full px-[var(--padding-desktop)] flex items-center justify-between gap-[var(--space-6)]">

          {/* ── Left: logo + portal badge ─────────────────── */}
          <div className="flex items-center gap-[var(--space-3)] shrink-0">
            {/* Logo */}
            <img src={vybeLogoImage} alt="VYBE" className="h-7 w-auto object-contain" />

            {/* Divider */}
            <div className="w-px h-5 bg-border" />

            {/* Role badge — changes based on logged-in role */}
            <div
              className="flex items-center gap-[var(--space-1)] px-[var(--space-2)] rounded-[var(--radius-sm)] border border-border"
              style={{ paddingTop: '0.2rem', paddingBottom: '0.2rem', backgroundColor: 'var(--muted)' }}
            >
              <Shield className="w-3 h-3 text-muted-foreground" />
              <span className="text-caption font-medium text-muted-foreground uppercase tracking-wider">
                {getRoleLabel(userRole)}
              </span>
            </div>
          </div>

          {/* ── Right: theme + user + sign-out ────────────── */}
          <div className="flex items-center gap-[var(--space-1)]">

            <ThemeToggle />

            {/* Divider */}
            <div className="w-px h-5 bg-border mx-[var(--space-2)]" />

            {/* User block */}
            <div className="relative">
              <button
                onClick={() => hasMultipleRoles && setShowRoleSwitcher(!showRoleSwitcher)}
                className={`flex items-center gap-[var(--space-2)] px-[var(--space-2)] py-[var(--space-1)] rounded-[var(--radius)] transition-colors ${
                  hasMultipleRoles ? 'hover:bg-accent cursor-pointer' : 'cursor-default'
                }`}
              >
                {/* Avatar — solid foreground circle */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-medium"
                  style={{
                    background: 'var(--foreground)',
                    color: 'var(--background)',
                    fontSize: '0.6875rem',
                    letterSpacing: '0.02em',
                  }}
                >
                  {getRoleInitials(userRole)}
                </div>

                {/* Name + role label */}
                <div className="flex flex-col items-start min-w-0">
                  <span className="text-small font-medium text-foreground leading-none truncate max-w-[130px]">
                    {userData.name}
                  </span>
                  <span
                    className="text-muted-foreground leading-none truncate max-w-[130px] mt-0.5"
                    style={{ fontSize: '0.6875rem' }}
                  >
                    {getRoleLabel(userRole)}
                  </span>
                </div>

                {hasMultipleRoles && (
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0 ml-[var(--space-1)]" />
                )}
              </button>

              {/* Role-switcher dropdown */}
              {showRoleSwitcher && hasMultipleRoles && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowRoleSwitcher(false)} />
                  <div className="absolute top-full mt-[var(--space-1)] right-0 w-52 bg-card border border-border rounded-[var(--radius-card)] shadow-xl z-50 overflow-hidden">
                    <div className="px-[var(--space-3)] py-[var(--space-2)] border-b border-border">
                      <p className="text-caption text-muted-foreground uppercase tracking-wider font-medium">
                        Switch Role
                      </p>
                    </div>
                    <div className="p-[var(--space-1)]">
                      {userData.availableRoles.map((role) => {
                        const active = role === userRole;
                        return (
                          <button
                            key={role}
                            onClick={() => handleRoleSwitch(role)}
                            className={`w-full flex items-center gap-[var(--space-2)] px-[var(--space-3)] py-[var(--space-2)] rounded-[var(--radius)] transition-colors ${
                              active
                                ? 'bg-foreground text-background'
                                : 'hover:bg-accent text-foreground'
                            }`}
                          >
                            <div
                              className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-medium"
                              style={{
                                fontSize: '0.625rem',
                                background: active ? 'rgba(255,255,255,0.2)' : 'var(--muted)',
                                color: active ? 'inherit' : 'var(--muted-foreground)',
                                border: active ? 'none' : '1px solid var(--border)',
                              }}
                            >
                              {getRoleInitials(role)}
                            </div>
                            <span className="text-small">{getRoleLabel(role)}</span>
                            {active && (
                              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-current" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Divider */}
            <div className="w-px h-5 bg-border mx-[var(--space-2)]" />

            {/* Sign-out icon button */}
            <button
              onClick={handleSignOut}
              title="Sign out"
              className="vybe-icon-btn"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════
          SIDEBAR
      ══════════════════════════════════════════════════════ */}
      <aside className="fixed left-0 top-14 bottom-0 w-56 bg-sidebar border-r border-sidebar-border overflow-y-auto z-40 flex flex-col">
        <nav className="flex-1 px-[var(--space-3)] py-[var(--space-4)] flex flex-col gap-[var(--space-5)]">
          {navGroups.map((group) => {
            // Only render group if at least one item is visible for current role
            const visibleItems = group.items.filter(item => item.roles.includes(userRole));
            if (visibleItems.length === 0) return null;

            return (
              <div key={group.label}>
                {/* Group label */}
                <p
                  className="px-[var(--space-3)] mb-[var(--space-1)]"
                  style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(161,161,170,0.5)' }}
                >
                  {group.label}
                </p>

                {/* Group items */}
                <div className="flex flex-col gap-[var(--space-1)]">
                  {visibleItems.map((item) => {
                    const active = isActive(item.path);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`
                          flex items-center gap-[var(--space-3)] px-[var(--space-3)] py-[var(--space-2)]
                          rounded-[var(--radius)] transition-all duration-150 relative
                          ${active
                            ? 'bg-sidebar-primary text-neutral-0'
                            : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'}
                        `}
                      >
                        {/* Active emerald indicator */}
                        {active && (
                          <span
                            className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full"
                            style={{ width: '3px', height: '1.125rem', background: '#1C75BC' }}
                          />
                        )}
                        <item.icon
                          className="w-[15px] h-[15px] shrink-0"
                          strokeWidth={active ? 2.2 : 1.6}
                          style={{ color: active ? '#1C75BC' : undefined }}
                        />
                        <span style={{ fontSize: '0.8125rem', fontWeight: active ? 600 : 500, letterSpacing: '-0.01em' }} className="whitespace-nowrap">
                          {item.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Sidebar footer — user at a glance */}
        <div className="px-[var(--space-3)] py-[var(--space-3)] border-t border-sidebar-border shrink-0">
          <div className="flex items-center gap-[var(--space-2)]">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-medium"
              style={{
                background: 'var(--sidebar-foreground)',
                color: 'var(--sidebar)',
                fontSize: '0.625rem',
              }}
            >
              {getRoleInitials(userRole)}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-small font-medium text-sidebar-foreground leading-none truncate">
                {userData.name}
              </span>
              <span
                className="text-muted-foreground leading-none truncate mt-0.5"
                style={{ fontSize: '0.6875rem' }}
              >
                {userData.email || getRoleLabel(userRole)}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* ══════════════════════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════════════════════ */}
      <main className="pt-14 pl-56 min-h-screen">
        <div className="max-w-[1400px] p-[var(--padding-desktop)]">
          {children}
        </div>
      </main>
    </div>
  );
}
