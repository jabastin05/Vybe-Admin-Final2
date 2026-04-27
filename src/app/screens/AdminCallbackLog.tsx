import { useState } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { 
  Phone, 
  Mail, 
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  ChevronDown,
  User,
  MessageSquare
} from 'lucide-react';

interface CallbackRequest {
  id: string;
  userName: string;
  userId: string;
  phone: string;
  email: string;
  createdAt: string;
  preferredDate: string;
  preferredTime: string;
  status: 'pending' | 'resolved';
  message?: string;
  assignedRM: string;
  resolvedBy?: string;
  resolvedAt?: string;
}

export function AdminCallbackLog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'resolved'>('all');
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  // Get user role from localStorage
  const getUserRole = () => {
    const userData = localStorage.getItem('vybeAdminUser');
    if (userData) {
      const user = JSON.parse(userData);
      return user.role || 'admin';
    }
    return 'admin';
  };

  const userRole = getUserRole();

  // Mock callback data
  const [callbacks, setCallbacks] = useState<CallbackRequest[]>([
    {
      id: 'CB001',
      userName: 'Amit Sharma',
      userId: 'CL001',
      phone: '+91 98765 43210',
      email: 'amit.sharma@example.com',
      createdAt: '2026-03-25T09:30:00',
      preferredDate: '2026-03-26',
      preferredTime: '14:00',
      status: 'pending',
      message: 'Interested in property valuation services for my Mumbai property',
      assignedRM: 'Rajesh Kumar'
    },
    {
      id: 'CB002',
      userName: 'Priya Mehta',
      userId: 'CL004',
      phone: '+91 98765 43211',
      email: 'priya.mehta@example.com',
      createdAt: '2026-03-25T10:15:00',
      preferredDate: '2026-03-27',
      preferredTime: '11:00',
      status: 'pending',
      message: 'Need consultation for legal documentation',
      assignedRM: 'Priya Sharma'
    },
    {
      id: 'CB003',
      userName: 'Rajesh Kumar',
      userId: 'CL002',
      phone: '+91 98765 43212',
      email: 'rajesh.kumar@example.com',
      createdAt: '2026-03-24T16:45:00',
      preferredDate: '2026-03-25',
      preferredTime: '15:00',
      status: 'resolved',
      message: 'Inquiry about property management services',
      assignedRM: 'Sneha Reddy',
      resolvedBy: 'Sneha Reddy (RM)',
      resolvedAt: '2026-03-25T11:30:00'
    },
    {
      id: 'CB004',
      userName: 'Vikram Malhotra',
      userId: 'CL003',
      phone: '+91 98765 43213',
      email: 'vikram.m@example.com',
      createdAt: '2026-03-24T14:20:00',
      preferredDate: '2026-03-26',
      preferredTime: '10:00',
      status: 'resolved',
      message: 'Follow-up on commercial property acquisition',
      assignedRM: 'Rajesh Kumar',
      resolvedBy: 'Rajesh Kumar (RM)',
      resolvedAt: '2026-03-24T18:00:00'
    },
    {
      id: 'CB005',
      userName: 'Neha Singh',
      userId: 'CL005',
      phone: '+91 98765 43214',
      email: 'neha.singh@example.com',
      createdAt: '2026-03-25T11:00:00',
      preferredDate: '2026-03-28',
      preferredTime: '16:00',
      status: 'pending',
      message: 'Discuss investment opportunities in Bangalore',
      assignedRM: 'Aditya Patil'
    },
    {
      id: 'CB006',
      userName: 'Arjun Patel',
      userId: 'CL006',
      phone: '+91 98765 43215',
      email: 'arjun.patel@example.com',
      createdAt: '2026-03-25T13:30:00',
      preferredDate: '2026-03-29',
      preferredTime: '12:00',
      status: 'pending',
      message: 'Urgent: Need tax consultation for property sale',
      assignedRM: 'Priya Sharma'
    },
    {
      id: 'CB007',
      userName: 'Kavita Desai',
      userId: 'CL007',
      phone: '+91 98765 43216',
      email: 'kavita.desai@example.com',
      createdAt: '2026-03-23T09:00:00',
      preferredDate: '2026-03-24',
      preferredTime: '13:00',
      status: 'resolved',
      message: 'Property insurance renewal discussion',
      assignedRM: 'Priya Sharma',
      resolvedBy: 'Priya Sharma (RM)',
      resolvedAt: '2026-03-24T10:15:00'
    },
    {
      id: 'CB008',
      userName: 'Sanjay Gupta',
      userId: 'CL008',
      phone: '+91 98765 43217',
      email: 'sanjay.gupta@example.com',
      createdAt: '2026-03-25T08:45:00',
      preferredDate: '2026-03-26',
      preferredTime: '17:00',
      status: 'pending',
      message: 'Portfolio review and expansion strategy',
      assignedRM: 'Rajesh Kumar'
    }
  ]);

  const handleResolve = (callbackId: string) => {
    setCallbacks(callbacks.map(cb => 
      cb.id === callbackId 
        ? { 
            ...cb, 
            status: 'resolved',
            resolvedBy: 'Admin',
            resolvedAt: new Date().toISOString()
          }
        : cb
    ));
    setResolvingId(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const formatPreferredTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Filter callbacks
  const filteredCallbacks = callbacks.filter(cb => {
    const matchesSearch = 
      cb.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cb.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cb.phone.includes(searchQuery) ||
      cb.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || cb.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const pendingCount = callbacks.filter(cb => cb.status === 'pending').length;
  const resolvedCount = callbacks.filter(cb => cb.status === 'resolved').length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="vybe-page-header-row flex items-center justify-between">
          <div>
            <h1 className="vybe-page-title mb-[var(--space-1)]">
              Callback Log
            </h1>
            <p className="vybe-page-subtitle">
              Manage client callback requests and schedule follow-ups
            </p>
          </div>
          
          </div>

        <div className="grid grid-cols-3 gap-[var(--space-4)] mb-[var(--space-6)]">
          {[
            { label: 'Total Callbacks', value: callbacks.length,  valueStyle: { color: 'var(--foreground)' } },
            { label: 'Pending',         value: pendingCount,       valueStyle: { color: '#E16A74' } },
            { label: 'Resolved',        value: resolvedCount,      valueStyle: { color: '#1C75BC' } },
          ].map(({ label, value, valueStyle }) => (
            <div key={label} className="vybe-kpi-card">
              <div className="vybe-kpi-label">{label}</div>
              <div className="vybe-kpi-value" style={valueStyle}>{value}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="vybe-card-padded">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, ID, phone, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="vybe-search"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <button
                onClick={() => setShowStatusFilter(!showStatusFilter)}
                className={`vybe-filter-btn ${
                  statusFilter !== 'all'
                    ? 'bg-primary-700 text-neutral-0 shadow-[0_4px_12px_rgba(28,117,188,0.3)]'
                    : ''
                }`}
              >
                <Filter className="w-4 h-4" />
                {statusFilter === 'all' ? 'All Status' : statusFilter === 'pending' ? 'Pending' : 'Resolved'}
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {showStatusFilter && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-card/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.08] rounded-[var(--radius-card)] shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden z-50">
                  <div className="p-3">
                    {['all', 'pending', 'resolved'].map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setStatusFilter(status as any);
                          setShowStatusFilter(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[var(--radius)] transition-all mb-1 ${
                          statusFilter === status
                            ? 'bg-primary-700/10 dark:bg-primary-700/20 text-primary-700 dark:text-primary-400'
                            : 'hover:bg-neutral-900/[0.02] dark:hover:bg-card/[0.02] text-foreground dark:text-neutral-0'
                        }`}
                      >
                        <span className="text-small font-medium capitalize">{status}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="vybe-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted">
                  <th className="vybe-table-head text-left">
                    User Details
                  </th>
                  <th className="vybe-table-head text-left">
                    Contact Info
                  </th>
                  {(userRole === 'admin' || userRole === 'operator') && (
                    <th className="vybe-table-head text-left">
                      Assigned RM
                    </th>
                  )}
                  <th className="vybe-table-head text-left">
                    Created
                  </th>
                  <th className="vybe-table-head text-left">
                    Preferred Callback
                  </th>
                  <th className="vybe-table-head text-left">
                    Status
                  </th>
                  <th className="vybe-table-head text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCallbacks.map((callback) => (
                  <tr
                    key={callback.id}
                    className="border-b border-border hover:bg-accent transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-700/10 border border-primary-700/20 flex items-center justify-center">
                          <User className="w-5 h-5 text-primary-700" />
                        </div>
                        <div>
                          <p className="text-small font-medium text-foreground dark:text-neutral-0">
                            {callback.userName}
                          </p>
                          <p className="text-caption text-neutral-700/80 dark:text-neutral-300/80">
                            ID: {callback.userId}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-caption text-foreground">
                            {callback.phone}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-caption text-foreground">
                            {callback.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    {(userRole === 'admin' || userRole === 'operator') && (
                      <td className="px-6 py-4">
                        <p className="text-small font-medium text-foreground dark:text-neutral-0">
                          {callback.assignedRM}
                        </p>
                      </td>
                    )}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-caption text-foreground">
                            {formatDate(callback.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-caption text-foreground">
                            {formatTime(callback.createdAt)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-primary-700" />
                          <span className="text-caption font-medium text-foreground">
                            {formatDate(callback.preferredDate)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-primary-700" />
                          <span className="text-caption font-medium text-foreground">
                            {formatPreferredTime(callback.preferredTime)}
                          </span>
                        </div>
                      </div>
                      {callback.message && (
                        <div className="mt-2 flex items-start gap-2 p-2 bg-muted rounded-[var(--radius-sm)]">
                          <MessageSquare className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <p className="text-caption text-muted-foreground line-clamp-2">
                            {callback.message}
                          </p>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {callback.status === 'pending' ? (
                        <div className="vybe-badge vybe-badge-amber">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Pending</span>
                        </div>
                      ) : (
                        <div>
                          <div className="vybe-badge vybe-badge-green mb-2">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Resolved</span>
                          </div>
                          {callback.resolvedBy && (
                            <p className="text-caption text-muted-foreground">
                              By: {callback.resolvedBy}
                            </p>
                          )}
                          {callback.resolvedAt && (
                            <p className="text-caption text-muted-foreground">
                              {formatDate(callback.resolvedAt)} at {formatTime(callback.resolvedAt)}
                            </p>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {callback.status === 'pending' && (
                          <button
                            onClick={() => handleResolve(callback.id)}
                            className="h-[var(--button-height-desktop)] px-[var(--space-5)] bg-primary hover:opacity-90 text-primary-foreground rounded-[var(--radius-button)] text-caption font-medium transition-colors flex items-center gap-[var(--space-2)]"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Resolve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCallbacks.length === 0 && (
            <div className="text-center py-12">
              <Phone className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-small text-muted-foreground">
                No callback requests found. Try adjusting your filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}