import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  AlertCircle,
  ArrowUpRight,
  Briefcase,
  CheckCircle2,
  Clock,
  FileText,
  FolderOpen,
  MessageCircle,
  UserPlus,
  Users,
} from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { useCases } from '../contexts/CasesContext';

type Role = 'admin' | 'operator' | 'rm' | 'partner';
type RmQueueTab = 'callback' | 'assignment';

type Segment = {
  label: string;
  value: number;
  color: string;
};

type StatCardConfig = {
  title: string;
  value: number | string;
  note: string;
  icon: typeof Users;
  onClick: () => void;
};

type WidgetCardProps = {
  title: string;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
};

type MetricCardProps = {
  title: string;
  value: number | string;
  note: string;
  icon: typeof Users;
  onClick: () => void;
};

type PerformanceRow = {
  name: string;
  closed: number;
  onTat: number;
  breached: number;
  breachedPct: string;
  averageDelay: string;
  onTatPct: string;
};

type RecentActivityItem = {
  title: string;
  note: string;
  tone: 'neutral' | 'success' | 'warning';
  onClick: () => void;
};

type RmCardRow = {
  label: string;
  cases: number;
  partners: number;
  success: string;
};

type CallbackRow = {
  id: string;
  clientName: string;
  requestType: string;
  preferredTime: string;
  status: string;
  onClick: () => void;
};

type AssignmentRow = {
  id: string;
  userName: string;
  serviceType: string;
  property: string;
  location: string;
  status: string;
  createdDate: string;
  onClick: () => void;
};

const RM_CLIENT_MAP: Record<string, string[]> = {
  'rajesh.k@vybe.com': ['Ananya Iyer'],
  'priya.s@vybe.com': ['Vikram Malhotra'],
  'aditya.p@vybe.com': ['Alexander Sterling'],
  'sneha.r@vybe.com': ['Sri Vidhya P'],
};

const PARTNER_PERFORMANCE_ROWS: PerformanceRow[] = [
  { name: 'Provider A', closed: 300, onTat: 255, breached: 45, breachedPct: '15.0%', averageDelay: '1.2 D', onTatPct: '85.0%' },
  { name: 'Provider B', closed: 180, onTat: 160, breached: 20, breachedPct: '20.0%', averageDelay: '3.1 D', onTatPct: '90.0%' },
  { name: 'Provider C', closed: 90, onTat: 72, breached: 18, breachedPct: '12.0%', averageDelay: '3.1 D', onTatPct: '80.0%' },
  { name: 'Provider D', closed: 55, onTat: 44, breached: 11, breachedPct: '20.0%', averageDelay: '2.1 D', onTatPct: '80.0%' },
  { name: 'Provider E', closed: 100, onTat: 44, breached: 29, breachedPct: '8.0%', averageDelay: '1.4 D', onTatPct: '56.0%' },
];

const PARTNER_BAR_DATA = [
  { label: 'Provider A', onTat: 30, breached: 8 },
  { label: 'Provider B', onTat: 42, breached: 18 },
  { label: 'Provider C', onTat: 25, breached: 17 },
  { label: 'Provider D', onTat: 38, breached: 10 },
  { label: 'Provider E', onTat: 30, breached: 4 },
];

function getCurrentUser() {
  const userData = localStorage.getItem('vybeAdminUser');
  if (userData) {
    const user = JSON.parse(userData);
    return {
      name: user.name || 'John',
      email: user.email || '',
      role: (user.role || 'admin') as Role,
    };
  }

  return {
    name: 'John',
    email: '',
    role: 'admin' as Role,
  };
}

function getConicGradient(segments: Segment[]) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  if (total === 0) {
    return 'conic-gradient(#E7EBF2 0deg 360deg)';
  }

  let current = 0;
  const stops = segments.map((segment) => {
    const start = current;
    const end = current + (segment.value / total) * 360;
    current = end;
    return `${segment.color} ${start}deg ${end}deg`;
  });

  return `conic-gradient(${stops.join(', ')})`;
}

function formatNumber(value: number) {
  if (value >= 1000) {
    return value.toLocaleString('en-US');
  }

  return String(value);
}

function getServiceBadge(service: string) {
  switch (service) {
    case 'HABU Report':
      return 'bg-[#E9EAFE] text-[#5660C8]';
    case 'Property Service':
      return 'bg-[#FFF4DB] text-[#C49300]';
    case 'Lease & Rent':
      return 'bg-[#DFF6EF] text-[#109B77]';
    case 'Sell or Liquidate':
      return 'bg-[#FFE3EA] text-[#FF4E6A]';
    default:
      return 'bg-black/5 text-black/60 dark:bg-white/5 dark:text-white/60';
  }
}

function getStatusBadge(status: string) {
  if (status.toLowerCase().includes('closed')) {
    return 'bg-[#FFE3EA] text-[#FF4E6A]';
  }

  return 'bg-[#FFF4DB] text-[#C49300]';
}

function DashboardHeader({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle: string }) {
  return (
    <div>
      {eyebrow && (
        <div className="vybe-header-eyebrow mb-2">
          {eyebrow}
        </div>
      )}
      <h1 className="vybe-page-title mb-1">{title}</h1>
      <p className="vybe-page-subtitle">{subtitle}</p>
    </div>
  );
}

function MetricCard({ title, value, note, icon: Icon, onClick }: MetricCardProps) {
  return (
    <button
      onClick={onClick}
      className="vybe-card-padded text-left hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all"
    >
      <div
        className="w-10 h-10 rounded-[var(--radius)] flex items-center justify-center mb-[var(--space-4)]"
        style={{ background: 'var(--accent)', border: '1px solid var(--border)' }}
      >
        <Icon className="w-5 h-5" style={{ color: 'var(--foreground)' }} />
      </div>
      <div className="vybe-kpi-label mb-[var(--space-2)]">{title}</div>
      <div
        className="leading-none mb-[var(--space-2)]"
        style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--foreground)', letterSpacing: '-0.04em' }}
      >
        {value}
      </div>
      <div className="vybe-card-note">{note}</div>
    </button>
  );
}

function WidgetCard({ title, onClick, children, className = '' }: WidgetCardProps) {
  return (
    <button
      onClick={onClick}
      className={`vybe-card-padded h-full text-left hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-all ${className}`}
    >
      <div className="flex items-center justify-between mb-[var(--space-6)]">
        <h3 className="vybe-card-title">{title}</h3>
        <ArrowUpRight className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
      </div>
      {children}
    </button>
  );
}

function SummaryChip({ label, value, tone }: { label: string; value: string; tone: 'green' | 'amber' | 'rose' }) {
  const chipClass =
    tone === 'green'
      ? 'bg-[#E8FAEF] text-[#2A9D62]'
      : tone === 'amber'
        ? 'bg-[#FFF4DB] text-[#C49300]'
        : 'bg-[#FFE8EA] text-[#E16A74]';

  return (
    <div className={`rounded-[12px] px-4 py-3 min-w-[96px] ${chipClass}`}>
      <div className="text-[10px] uppercase tracking-wide opacity-80 mb-1">{label}</div>
      <div className="text-[18px] font-semibold">{value}</div>
    </div>
  );
}

function PartnerPerformanceSection({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="vybe-card-padded w-full text-left hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-all"
    >
      <div className="flex items-start justify-between gap-[var(--space-4)] mb-[var(--space-6)]">
        <div>
          <h3 className="vybe-card-title mb-[var(--space-1)]">Partner Performance</h3>
          <p className="vybe-card-note">Execution quality and breach management across partners.</p>
        </div>
        <div className="flex flex-wrap gap-[var(--space-2)] justify-end">
          <SummaryChip label="On-TAT Closed" value="446" tone="green" />
          <SummaryChip label="On-TAT Now" value="124" tone="amber" />
          <SummaryChip label="TAT Breached" value="78.2%" tone="rose" />
        </div>
      </div>

      <div className="grid grid-cols-5 gap-[var(--space-5)] items-end h-[220px] px-[var(--space-2)]">
        {PARTNER_BAR_DATA.map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-[var(--space-3)]">
            <div className="h-[170px] flex items-end gap-[var(--space-2)]">
              <div className="w-3 rounded-full bg-[#28C76F]" style={{ height: `${item.onTat * 3.2}px` }} />
              <div className="w-3 rounded-full bg-[#FF5B6E]"  style={{ height: `${item.breached * 3.2}px` }} />
            </div>
            <div className="vybe-card-note">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-[var(--space-6)] mt-[var(--space-4)] mb-[var(--space-4)]">
        <div className="flex items-center gap-[var(--space-2)]">
          <div className="w-2.5 h-2.5 rounded-full bg-[#28C76F]" />
          <span className="vybe-card-note">On-TAT</span>
        </div>
        <div className="flex items-center gap-[var(--space-2)]">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5B6E]" />
          <span className="vybe-card-note">Breached</span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-[var(--radius)]" style={{ border: '1px solid var(--border)' }}>
        <table className="w-full min-w-[760px]">
          <thead>
            <tr style={{ background: 'var(--muted)' }}>
              {['Partner', 'Closed', 'On TAT', 'Breached', 'Breached %', 'Avg Delay', 'On TAT %'].map((label) => (
                <th key={label} className="vybe-table-head">{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PARTNER_PERFORMANCE_ROWS.map((row) => (
              <tr key={row.name} style={{ borderBottom: '1px solid var(--border)' }} className="last:border-b-0">
                <td className="px-[var(--space-4)] py-[var(--space-3)]">
                  <span className="text-small font-medium" style={{ color: 'var(--foreground)' }}>{row.name}</span>
                </td>
                <td className="px-[var(--space-4)] py-[var(--space-3)] text-small" style={{ color: 'var(--muted-foreground)' }}>{row.closed}</td>
                <td className="px-[var(--space-4)] py-[var(--space-3)] text-small" style={{ color: 'var(--muted-foreground)' }}>{row.onTat}</td>
                <td className="px-[var(--space-4)] py-[var(--space-3)] text-small" style={{ color: 'var(--muted-foreground)' }}>{row.breached}</td>
                <td className="px-[var(--space-4)] py-[var(--space-3)]">
                  <span className="inline-flex px-[var(--space-2)] py-[var(--space-1)] rounded-[var(--radius-sm)] text-caption font-medium bg-[#FFE8EA] text-[#E16A74]">
                    {row.breachedPct}
                  </span>
                </td>
                <td className="px-[var(--space-4)] py-[var(--space-3)] text-small" style={{ color: 'var(--muted-foreground)' }}>{row.averageDelay}</td>
                <td className="px-[var(--space-4)] py-[var(--space-3)]">
                  <span className="inline-flex px-[var(--space-2)] py-[var(--space-1)] rounded-[var(--radius-sm)] text-caption font-medium bg-[#E8FAEF] text-[#2A9D62]">
                    {row.onTatPct}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </button>
  );
}

function DonutLegendCard({
  title,
  segments,
  legendColumns = 1,
  onClick,
}: {
  title: string;
  segments: Segment[];
  legendColumns?: 1 | 2;
  onClick: () => void;
}) {
  return (
    <WidgetCard title={title} onClick={onClick}>
      <div className="flex items-center justify-center py-[var(--space-2)]">
        <div className="w-40 h-40 rounded-full relative" style={{ background: getConicGradient(segments) }}>
          <div className="absolute inset-[30px] rounded-full" style={{ background: 'var(--card)' }} />
        </div>
      </div>
      <div className={`grid ${legendColumns === 2 ? 'grid-cols-2 gap-x-[var(--space-6)]' : 'grid-cols-1'} gap-y-[var(--space-3)] mt-[var(--space-4)]`}>
        {segments.map((segment) => (
          <div key={segment.label} className="flex items-center gap-[var(--space-3)]">
            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: segment.color }} />
            <div className="flex-1 text-small" style={{ color: 'var(--muted-foreground)' }}>{segment.label}</div>
            <div className="text-small font-medium" style={{ color: 'var(--foreground)' }}>{formatNumber(segment.value)}</div>
          </div>
        ))}
      </div>
    </WidgetCard>
  );
}

function StackedLegendCard({ title, segments, onClick }: { title: string; segments: Segment[]; onClick: () => void }) {
  return (
    <WidgetCard title={title} onClick={onClick}>
      <div className="h-9 rounded-[var(--radius)] overflow-hidden flex mb-[var(--space-8)]">
        {segments.map((segment) => {
          const total = segments.reduce((sum, item) => sum + item.value, 0) || 1;
          return (
            <div
              key={segment.label}
              style={{ width: `${(segment.value / total) * 100}%`, backgroundColor: segment.color }}
            />
          );
        })}
      </div>
      <div className="flex flex-col gap-[var(--space-3)]">
        {segments.map((segment) => (
          <div key={segment.label} className="flex items-center gap-[var(--space-3)]">
            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: segment.color }} />
            <div className="flex-1 text-small" style={{ color: 'var(--muted-foreground)' }}>{segment.label}</div>
            <div className="text-small font-medium" style={{ color: 'var(--foreground)' }}>{formatNumber(segment.value)}</div>
          </div>
        ))}
      </div>
    </WidgetCard>
  );
}

function MissingRequiredDocumentsCard({ onClick }: { onClick: () => void }) {
  const segments: Segment[] = [
    { label: 'Provider A', value: 12, color: '#6F7BF7' },
    { label: 'Provider B', value: 10, color: '#F8C76B' },
    { label: 'Provider C', value: 8, color: '#F29CB0' },
    { label: 'Provider D', value: 6, color: '#89E1B7' },
    { label: 'Provider E', value: 12, color: '#9D86F7' },
  ];

  return (
    <WidgetCard title="Missing Required Documents" onClick={onClick} className="h-full">
      <div className="grid grid-cols-3 gap-[var(--space-3)] mb-[var(--space-5)]">
        {[
          { label: 'Total',     value: '48', bg: 'var(--muted)' },
          { label: 'Breached',  value: '26', bg: '#FFE8EA' },
          { label: 'Within TAT',value: '22', bg: '#E8FAEF' },
        ].map(({ label, value, bg }) => (
          <div
            key={label}
            className="rounded-[var(--radius)] px-[var(--space-3)] py-[var(--space-3)]"
            style={{ background: bg }}
          >
            <div className="vybe-meta-label mb-[var(--space-1)]">{label}</div>
            <div className="text-h3" style={{ color: 'var(--foreground)' }}>{value}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-[var(--space-5)]">
        <div className="w-32 h-32 rounded-full relative shrink-0" style={{ background: getConicGradient(segments) }}>
          <div className="absolute inset-[24px] rounded-full" style={{ background: 'var(--card)' }} />
        </div>
        <div className="flex flex-col gap-[var(--space-3)] flex-1">
          {segments.map((segment, index) => (
            <div key={segment.label} className="flex items-center gap-[var(--space-3)]">
              <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: segment.color }} />
              <div className="flex-1 text-small" style={{ color: 'var(--muted-foreground)' }}>{segment.label}</div>
              <div className={`text-caption font-medium ${index < 3 ? 'text-[#E16A74]' : 'text-[#2A9D62]'}`}>
                {index < 3 ? `${segment.value} Breached` : `${segment.value} Within`}
              </div>
            </div>
          ))}
        </div>
      </div>
    </WidgetCard>
  );
}

function RecentActivityCard({ items }: { items: RecentActivityItem[] }) {
  return (
    <div className="vybe-card-padded h-full">
      <div className="vybe-card-title mb-[var(--space-4)]">Recent Activity</div>
      <div className="flex flex-col gap-[var(--space-2)]">
        {items.map((item) => {
          const toneColor =
            item.tone === 'success'
              ? '#2A9D62'
              : item.tone === 'warning'
                ? '#C49300'
                : 'var(--muted-foreground)';

          return (
            <button
              key={item.title}
              onClick={item.onClick}
              className="w-full text-left rounded-[var(--radius)] px-[var(--space-4)] py-[var(--space-3)] transition-colors"
              style={{ border: '1px solid var(--border)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent)')}
              onMouseLeave={e => (e.currentTarget.style.background = '')}
            >
              <div className="text-small mb-[var(--space-1)]" style={{ color: 'var(--foreground)' }}>{item.title}</div>
              <div className="text-caption" style={{ color: toneColor }}>{item.note}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RmPerformanceCard({ rows, onClick }: { rows: RmCardRow[]; onClick: () => void }) {
  const maxCases = Math.max(...rows.map(r => r.cases));

  return (
    <WidgetCard title="RM Performance" onClick={onClick} className="h-full">
      {/* Summary chips */}
      <div className="grid grid-cols-2 gap-[var(--space-3)] mb-[var(--space-5)]">
        <div className="rounded-[var(--radius)] px-[var(--space-3)] py-[var(--space-3)]" style={{ background: 'var(--muted)' }}>
          <div className="vybe-meta-label mb-[var(--space-1)]">Mapped Cases</div>
          <div className="text-h3" style={{ color: 'var(--foreground)' }}>420</div>
        </div>
        <div className="rounded-[var(--radius)] px-[var(--space-3)] py-[var(--space-3)]" style={{ background: 'rgba(239,68,68,0.08)' }}>
          <div className="vybe-meta-label mb-[var(--space-1)]">Providers</div>
          <div className="text-h3" style={{ color: 'var(--foreground)' }}>28</div>
        </div>
      </div>

      {/* Horizontal bar chart — one row per RM */}
      <div className="flex flex-col gap-[var(--space-4)]">
        {rows.map((row) => {
          const successNum = parseInt(row.success);
          const successPct = Math.round((successNum / row.cases) * 100);
          // Scale bar relative to the highest case load
          const totalBarPct  = (row.cases / maxCases) * 100;
          const successBarPct = (successNum / row.cases) * totalBarPct;
          const openBarPct    = totalBarPct - successBarPct;
          const shortLabel    = row.label.replace('RM - ', '');

          return (
            <div key={row.label}>
              {/* Label row */}
              <div className="flex items-center justify-between mb-[var(--space-1)]">
                <span className="text-small font-medium" style={{ color: 'var(--foreground)' }}>{shortLabel}</span>
                <span className="text-caption" style={{ color: 'var(--muted-foreground)' }}>
                  {successNum} / {row.cases} cases
                </span>
              </div>
              {/* Track */}
              <div className="relative h-2 rounded-full overflow-hidden" style={{ background: 'var(--muted)' }}>
                {/* Closed (success) — solid emerald */}
                <div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ width: `${successBarPct}%`, background: '#10B981' }}
                />
                {/* Open — faint emerald */}
                <div
                  className="absolute inset-y-0 rounded-full"
                  style={{ left: `${successBarPct}%`, width: `${openBarPct}%`, background: 'rgba(16,185,129,0.22)' }}
                />
              </div>
              {/* Sub-label row */}
              <div className="flex items-center justify-between mt-[var(--space-1)]">
                <span className="text-caption" style={{ color: 'var(--muted-foreground)' }}>
                  {row.partners} providers
                </span>
                <span className="text-caption font-semibold" style={{ color: '#10B981' }}>
                  {successPct}% closed
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div
        className="flex items-center gap-[var(--space-4)] mt-[var(--space-4)] pt-[var(--space-3)]"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-[var(--space-2)]">
          <div className="w-2.5 h-2 rounded-full" style={{ background: '#10B981' }} />
          <span className="vybe-card-note">Closed</span>
        </div>
        <div className="flex items-center gap-[var(--space-2)]">
          <div className="w-2.5 h-2 rounded-full" style={{ background: 'rgba(16,185,129,0.22)' }} />
          <span className="vybe-card-note">Open</span>
        </div>
      </div>
    </WidgetCard>
  );
}

function RmWorkQueue({
  activeTab,
  setActiveTab,
  callbackRows,
  assignmentRows,
}: {
  activeTab: RmQueueTab;
  setActiveTab: (tab: RmQueueTab) => void;
  callbackRows: CallbackRow[];
  assignmentRows: AssignmentRow[];
}) {
  return (
    <div className="vybe-card-padded">
      <div className="flex items-center justify-between mb-[var(--space-4)]">
        <h2 className="vybe-card-title">My Work Queue</h2>
        <ArrowUpRight className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-[var(--space-6)] mb-[var(--space-4)]" style={{ borderBottom: '1px solid var(--border)' }}>
        {(['callback', 'assignment'] as RmQueueTab[]).map((tab) => {
          const active = activeTab === tab;
          const label = tab === 'callback' ? 'Client Callback' : 'Pending Case Assignment';
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="pb-[var(--space-3)] text-small transition-colors"
              style={{
                color: active ? 'var(--foreground)' : 'var(--muted-foreground)',
                borderBottom: active ? '2px solid var(--foreground)' : '2px solid transparent',
                fontWeight: active ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)',
                marginBottom: '-1px',
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {activeTab === 'callback' ? (
        <div className="flex flex-col gap-[var(--space-2)]">
          {callbackRows.map((row) => (
            <button
              key={row.id}
              onClick={row.onClick}
              className="w-full text-left rounded-[var(--radius)] px-[var(--space-4)] py-[var(--space-3)] transition-colors"
              style={{ border: '1px solid var(--border)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent)')}
              onMouseLeave={e => (e.currentTarget.style.background = '')}
            >
              <div className="flex items-center justify-between gap-[var(--space-4)]">
                <div>
                  <div className="text-small mb-[var(--space-1)]" style={{ color: 'var(--foreground)' }}>{row.clientName}</div>
                  <div className="text-caption" style={{ color: 'var(--muted-foreground)' }}>{row.id} · {row.requestType}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-caption mb-[var(--space-1)]" style={{ color: 'var(--muted-foreground)' }}>{row.preferredTime}</div>
                  <span className="inline-flex px-[var(--space-2)] py-[var(--space-1)] rounded-[var(--radius-sm)] text-caption font-medium bg-[#FFF4DB] text-[#C49300]">
                    {row.status}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-[var(--radius)]" style={{ border: '1px solid var(--border)' }}>
          <table className="w-full min-w-[860px]">
            <thead>
              <tr style={{ background: 'var(--muted)' }}>
                {['Case ID', 'User Name / ID', 'Service Type', 'Property', 'Location', 'Status', 'Created Date'].map((label) => (
                  <th key={label} className="vybe-table-head">{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {assignmentRows.map((row) => (
                <tr
                  key={row.id}
                  onClick={row.onClick}
                  className="cursor-pointer transition-colors"
                  style={{ borderBottom: '1px solid var(--border)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent)')}
                  onMouseLeave={e => (e.currentTarget.style.background = '')}
                >
                  <td className="px-[var(--space-4)] py-[var(--space-3)] text-small font-medium" style={{ color: 'var(--foreground)' }}>{row.id}</td>
                  <td className="px-[var(--space-4)] py-[var(--space-3)] text-small" style={{ color: 'var(--foreground)' }}>{row.userName}</td>
                  <td className="px-[var(--space-4)] py-[var(--space-3)]">
                    <span className={`inline-flex px-[var(--space-2)] py-[var(--space-1)] rounded-[var(--radius-sm)] text-caption font-medium ${getServiceBadge(row.serviceType)}`}>
                      {row.serviceType}
                    </span>
                  </td>
                  <td className="px-[var(--space-4)] py-[var(--space-3)] text-small" style={{ color: 'var(--foreground)' }}>{row.property}</td>
                  <td className="px-[var(--space-4)] py-[var(--space-3)] text-small" style={{ color: 'var(--muted-foreground)' }}>{row.location}</td>
                  <td className="px-[var(--space-4)] py-[var(--space-3)]">
                    <span className={`inline-flex px-[var(--space-2)] py-[var(--space-1)] rounded-[var(--radius-sm)] text-caption font-medium ${getStatusBadge(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-[var(--space-4)] py-[var(--space-3)] text-small" style={{ color: 'var(--muted-foreground)' }}>{row.createdDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function renderStats(cards: StatCardConfig[]) {
  return (
    <div className={`grid gap-4 ${cards.length === 6 ? 'grid-cols-1 xl:grid-cols-6' : 'grid-cols-1 xl:grid-cols-5'}`}>
      {cards.map((card) => (
        <MetricCard
          key={card.title}
          title={card.title}
          value={card.value}
          note={card.note}
          icon={card.icon}
          onClick={card.onClick}
        />
      ))}
    </div>
  );
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const { cases } = useCases();
  const currentUser = getCurrentUser();
  const [rmQueueTab, setRmQueueTab] = useState<RmQueueTab>('assignment');

  const partnerCases = useMemo(() => {
    if (currentUser.role !== 'partner') return [];
    return cases
      .filter((caseItem) => caseItem.partnerName === currentUser.name)
      .sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime());
  }, [cases, currentUser.name, currentUser.role]);

  const rmCases = useMemo(() => {
    if (currentUser.role !== 'rm') return [];
    const assignedClients = RM_CLIENT_MAP[currentUser.email] || [];
    return cases.filter((caseItem) => caseItem.userName && assignedClients.includes(caseItem.userName));
  }, [cases, currentUser.email, currentUser.role]);

  const partnerOpenCases = partnerCases.filter((caseItem) => caseItem.status === 'Open');
  const partnerClosedCases = partnerCases.filter((caseItem) => caseItem.status === 'Closed');
  const partnerUnreadChats = partnerCases.reduce((total, caseItem) => total + (caseItem.unreadMessages || 0), 0);
  const partnerDocumentCount = partnerCases.reduce((total, caseItem) => total + (caseItem.documents?.length || 0), 0);
  const partnerQueue = partnerCases.slice(0, 5);

  const partnerCaseSegments: Segment[] = [
    { label: 'New assigned', value: partnerCases.filter((caseItem) => (caseItem.progress || 0) <= 25 && caseItem.status === 'Open').length, color: '#3B5EA7' },
    { label: 'Opened', value: partnerCases.filter((caseItem) => (caseItem.progress || 0) > 25 && caseItem.status === 'Open').length, color: '#E3C27B' },
    { label: 'Closed', value: partnerClosedCases.length, color: '#F6DEE2' },
    { label: 'New chats', value: partnerCases.filter((caseItem) => (caseItem.unreadMessages || 0) > 0).length, color: '#82E4AF' },
  ];

  const firstPartnerCaseWithUnread = partnerCases.find((caseItem) => (caseItem.unreadMessages || 0) > 0);

  if (currentUser.role === 'partner') {
    const firstName = currentUser.name.split(' ')[0] || currentUser.name;

    return (
      <AdminLayout>
        <div className="vybe-page">
          <DashboardHeader
            eyebrow="Executive Partner"
            title={`Welcome Back, ${firstName}`}
            subtitle="Full execution visibility across assigned cases, chats, and case documents."
          />

          {renderStats([
            { title: 'Assigned Cases', value: partnerCases.length, note: 'Only cases mapped to the partner', icon: Users, onClick: () => navigate('/admin/cases?tab=all') },
            { title: 'Open Cases', value: partnerOpenCases.length, note: 'In active execution', icon: FolderOpen, onClick: () => navigate('/admin/cases?tab=open') },
            { title: 'Closed Cases', value: partnerClosedCases.length, note: 'Completed work', icon: CheckCircle2, onClick: () => navigate('/admin/cases?tab=closed') },
            { title: 'New Chats', value: partnerUnreadChats, note: 'Need response or update', icon: MessageCircle, onClick: () => navigate(firstPartnerCaseWithUnread ? `/admin/cases/${firstPartnerCaseWithUnread.id}/chat` : '/admin/cases?tab=all') },
            { title: 'Case Documents', value: partnerDocumentCount, note: 'Visible for assigned work only', icon: FileText, onClick: () => navigate('/admin/cases?tab=all') },
          ])}

          <div className="vybe-card-padded">
            <div className="flex items-center justify-between mb-[var(--space-4)]">
              <h2 className="vybe-card-title">My Work Queue</h2>
              <button
                onClick={() => navigate('/admin/cases?tab=all')}
                className="p-2 rounded-[var(--radius)] transition-colors"
                style={{ border: '1px solid var(--border)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent)')}
                onMouseLeave={e => (e.currentTarget.style.background = '')}
                aria-label="Open case management"
              >
                <ArrowUpRight className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
              </button>
            </div>

            <div className="overflow-x-auto rounded-[var(--radius)]" style={{ border: '1px solid var(--border)' }}>
              <table className="w-full min-w-[860px]">
                <thead>
                  <tr style={{ background: 'var(--muted)' }}>
                    {['Case ID', 'User Name / ID', 'Service Type', 'Property', 'Location', 'Status', 'Created Date'].map((label) => (
                      <th key={label} className="vybe-table-head">{label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {partnerQueue.map((caseItem, index) => (
                    <tr
                      key={caseItem.id}
                      onClick={() => navigate(`/admin/cases/${caseItem.id}`)}
                      className="cursor-pointer transition-colors"
                      style={{ borderBottom: index < partnerQueue.length - 1 ? '1px solid var(--border)' : 'none' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent)')}
                      onMouseLeave={e => (e.currentTarget.style.background = '')}
                    >
                      <td className="px-[var(--space-4)] py-[var(--space-3)] text-small font-medium" style={{ color: 'var(--foreground)' }}>{caseItem.caseId}</td>
                      <td className="px-[var(--space-4)] py-[var(--space-3)] text-small" style={{ color: 'var(--foreground)' }}>{caseItem.userName || '—'}</td>
                      <td className="px-[var(--space-4)] py-[var(--space-3)]">
                        <span className={`inline-flex px-[var(--space-2)] py-[var(--space-1)] rounded-[var(--radius-sm)] text-caption font-medium ${getServiceBadge(caseItem.subService || caseItem.serviceRequested)}`}>
                          {caseItem.subService || caseItem.serviceRequested}
                        </span>
                      </td>
                      <td className="px-[var(--space-4)] py-[var(--space-3)] text-small" style={{ color: 'var(--foreground)' }}>{caseItem.propertyName}</td>
                      <td className="px-[var(--space-4)] py-[var(--space-3)] text-small" style={{ color: 'var(--muted-foreground)' }}>{caseItem.propertyLocation}</td>
                      <td className="px-[var(--space-4)] py-[var(--space-3)]">
                        <span className={`inline-flex px-[var(--space-2)] py-[var(--space-1)] rounded-[var(--radius-sm)] text-caption font-medium ${getStatusBadge(caseItem.status)}`}>
                          {caseItem.status === 'Closed' ? 'Closed' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-[var(--space-4)] py-[var(--space-3)] text-small" style={{ color: 'var(--muted-foreground)' }}>
                        {new Date(caseItem.dateCreated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                  {partnerQueue.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-[var(--space-4)] py-10 text-center text-small" style={{ color: 'var(--muted-foreground)' }}>
                        No assigned cases yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 max-w-[480px]">
            <DonutLegendCard title="Case Management" segments={partnerCaseSegments} legendColumns={2} onClick={() => navigate('/admin/cases?tab=all')} />
          </div>
        </div>
      </AdminLayout>
    );
  }

  const adminStats: StatCardConfig[] = [
    { title: 'Invitation Sent', value: '1,248', note: 'Across all roles', icon: UserPlus, onClick: () => navigate('/admin/invitations') },
    { title: 'Active System Users', value: '864', note: 'Total active users', icon: Users, onClick: () => navigate('/admin/user-management') },
    { title: 'Executive Partners', value: '126', note: 'Execution team active', icon: Briefcase, onClick: () => navigate('/admin/users') },
    { title: 'Active Clients', value: '492', note: 'RM and RM-owned', icon: Users, onClick: () => navigate('/admin/clients') },
    { title: 'Open Cases', value: '138', note: 'Case load managed', icon: FolderOpen, onClick: () => navigate('/admin/cases?tab=open') },
    { title: 'Vault Documents', value: '3,426', note: 'Through flow only', icon: FileText, onClick: () => navigate('/admin/documents') },
  ];

  const operatorStats: StatCardConfig[] = [
    { title: 'Invitation Sent', value: '1,248', note: 'Across all roles', icon: UserPlus, onClick: () => navigate('/admin/invitations') },
    { title: 'Executive Partners', value: '126', note: 'Provider network active', icon: Briefcase, onClick: () => navigate('/admin/users') },
    { title: 'Active Clients', value: '492', note: 'RM and RM-owned', icon: Users, onClick: () => navigate('/admin/clients') },
    { title: 'Open Cases', value: '138', note: 'Case load unmanaged', icon: FolderOpen, onClick: () => navigate('/admin/cases?tab=open') },
    { title: 'Vault Documents', value: '3,426', note: 'Document ops enabled', icon: FileText, onClick: () => navigate('/admin/documents') },
  ];

  const invitationFlowSegments: Segment[] = [
    { label: 'Sent', value: 1248, color: '#6D8FEA' },
    { label: 'Accepted', value: 864, color: '#89E1B7' },
    { label: 'Pending', value: 150, color: '#E3C27B' },
    { label: 'Expired', value: 30, color: '#F6DEE2' },
  ];

  const clientManagementSegments: Segment[] = [
    { label: 'Lead', value: 1248, color: '#E3C27B' },
    { label: 'Activated', value: 864, color: '#3B5EA7' },
    { label: 'Deactivated', value: 150, color: '#F6DEE2' },
  ];

  const executivePartnerSegments: Segment[] = [
    { label: 'Legal', value: 45, color: '#3B5EA7' },
    { label: 'Survey', value: 9, color: '#89E1B7' },
    { label: 'Architect', value: 28, color: '#E3C27B' },
    { label: 'Developer', value: 72, color: '#9D86F7' },
    { label: 'Channel', value: 55, color: '#98A1AE' },
    { label: 'Compliance', value: 43, color: '#FFC94A' },
  ];

  const caseManagementSegments: Segment[] = [
    { label: 'New assigned', value: 138, color: '#3B5EA7' },
    { label: 'Opened', value: 84, color: '#E3C27B' },
    { label: 'Closed', value: 26, color: '#F6DEE2' },
    { label: 'New chats', value: 42, color: '#89E1B7' },
  ];

  const documentVaultSegments: Segment[] = [
    { label: 'Stored', value: 1248, color: '#3B5EA7' },
    { label: 'Verified', value: 864, color: '#89E1B7' },
    { label: 'Pending review', value: 150, color: '#E3C27B' },
    { label: 'Rejected', value: 150, color: '#F6DEE2' },
  ];

  const rmPerformanceRows: RmCardRow[] = [
    { label: 'RM - Arun', cases: 140, partners: 8, success: '96 Cases' },
    { label: 'RM - Divya', cases: 118, partners: 7, success: '78 Cases' },
    { label: 'RM - Karthik', cases: 92, partners: 6, success: '64 Cases' },
    { label: 'RM - Neha', cases: 70, partners: 4, success: '47 Cases' },
  ];

  const recentActivities: RecentActivityItem[] = [
    { title: 'Operations Manager Priya assigned RM Arun to Case #CS-20481', note: 'RM assignment in Client Management', tone: 'warning', onClick: () => navigate('/admin/clients') },
    { title: 'RM Divya mapped Provider B to Case #CS-20477', note: 'Service provider mapped by RM', tone: 'neutral', onClick: () => navigate('/admin/cases') },
    { title: 'Provider A closed Case #CS-20456 within TAT', note: 'Case closed by service provider', tone: 'success', onClick: () => navigate('/admin/cases?tab=closed') },
    { title: 'A new request was raised for Case #CS-20449', note: 'New case opened in system', tone: 'warning', onClick: () => navigate('/admin/cases?tab=open') },
  ];

  const rmAssignmentRows: AssignmentRow[] = rmCases
    .filter((caseItem) => caseItem.status === 'Open')
    .slice(0, 4)
    .map((caseItem) => ({
      id: caseItem.caseId,
      userName: caseItem.userName || '-',
      serviceType: caseItem.subService || caseItem.serviceRequested,
      property: caseItem.propertyName,
      location: caseItem.propertyLocation,
      status: 'Pending',
      createdDate: new Date(caseItem.dateCreated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      onClick: () => navigate(`/admin/cases/${caseItem.id}`),
    }));

  const rmCallbackRows: CallbackRow[] = [
    { id: 'CB001', clientName: 'Amit Sharma', requestType: 'Property valuation consultation', preferredTime: 'Today, 02:00 PM', status: 'Pending', onClick: () => navigate('/admin/callback-log') },
    { id: 'CB002', clientName: 'Priya Mehta', requestType: 'Legal documentation callback', preferredTime: 'Tomorrow, 11:00 AM', status: 'Pending', onClick: () => navigate('/admin/callback-log') },
    { id: 'CB003', clientName: 'Sanjay Gupta', requestType: 'Portfolio review follow-up', preferredTime: 'Tomorrow, 05:00 PM', status: 'Pending', onClick: () => navigate('/admin/callback-log') },
  ];

  const rmAssignedClientSegments: Segment[] = [
    { label: 'Lead', value: 1248, color: '#E3C27B' },
    { label: 'Activated', value: 864, color: '#3B5EA7' },
    { label: 'Deactivated', value: 150, color: '#F6DEE2' },
  ];

  const rmStats: StatCardConfig[] = [
    { title: 'Assigned Clients', value: 492, note: 'Only clients mapped to this RM', icon: Users, onClick: () => navigate('/admin/clients') },
    { title: 'Open Cases', value: 138, note: 'Across assigned clients only', icon: FolderOpen, onClick: () => navigate('/admin/cases?tab=open') },
    { title: 'Closed Cases', value: 26, note: 'Recently completed', icon: CheckCircle2, onClick: () => navigate('/admin/cases?tab=closed') },
    { title: 'New Chats', value: 6, note: 'Need follow-up', icon: MessageCircle, onClick: () => navigate('/admin/cases') },
    { title: 'Vault Documents', value: 126, note: 'Assigned client document only', icon: FileText, onClick: () => navigate('/admin/documents') },
  ];

  if (currentUser.role === 'rm') {
    return (
      <AdminLayout>
        <div className="vybe-page">
          <DashboardHeader
            title="Welcome Back, John."
            subtitle="Full platform visibility across invitations, users, partners, clients, cases, chats, and vault."
          />

          {renderStats(rmStats)}

          <RmWorkQueue
            activeTab={rmQueueTab}
            setActiveTab={setRmQueueTab}
            callbackRows={rmCallbackRows}
            assignmentRows={rmAssignmentRows}
          />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <StackedLegendCard title="Assigned Client Management" segments={rmAssignedClientSegments} onClick={() => navigate('/admin/clients')} />
            <DonutLegendCard title="Case Management" segments={caseManagementSegments} legendColumns={2} onClick={() => navigate('/admin/cases')} />
            <StackedLegendCard title="Client Document Vault" segments={documentVaultSegments} onClick={() => navigate('/admin/documents')} />
          </div>
        </div>
      </AdminLayout>
    );
  }

  const isAdmin = currentUser.role === 'admin';
  const stats = isAdmin ? adminStats : operatorStats;

  return (
    <AdminLayout>
        <div className="vybe-page">
        <DashboardHeader
          title="Welcome Back, John."
          subtitle="Full platform visibility across invitations, users, partners, clients, cases, chats, and vault."
        />

        {renderStats(stats)}

        <PartnerPerformanceSection onClick={() => navigate('/admin/users')} />

        <div className={`grid grid-cols-1 items-stretch gap-4 ${isAdmin ? 'xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]' : 'xl:grid-cols-3'}`}>
          {isAdmin ? (
            <>
              <MissingRequiredDocumentsCard onClick={() => navigate('/admin/documents')} />
              <RecentActivityCard items={recentActivities} />
            </>
          ) : (
            <>
              <RmPerformanceCard rows={rmPerformanceRows} onClick={() => navigate('/admin/user-management')} />
              <DonutLegendCard title="Invitation Flow" segments={invitationFlowSegments} onClick={() => navigate('/admin/invitations')} />
              <StackedLegendCard title="Client Management" segments={clientManagementSegments} onClick={() => navigate('/admin/clients')} />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-3">
          {isAdmin && <RmPerformanceCard rows={rmPerformanceRows} onClick={() => navigate('/admin/user-management')} />}
          {isAdmin && <DonutLegendCard title="Invitation Flow" segments={invitationFlowSegments} onClick={() => navigate('/admin/invitations')} />}
          {isAdmin && <StackedLegendCard title="Client Management" segments={clientManagementSegments} onClick={() => navigate('/admin/clients')} />}
          <DonutLegendCard title="Executive Partner" segments={executivePartnerSegments} onClick={() => navigate('/admin/users')} />
          <StackedLegendCard title="Client Document Vault" segments={documentVaultSegments} onClick={() => navigate('/admin/documents')} />
          <DonutLegendCard title="Case Management" segments={caseManagementSegments} legendColumns={2} onClick={() => navigate('/admin/cases')} />
        </div>
      </div>
    </AdminLayout>
  );
}
