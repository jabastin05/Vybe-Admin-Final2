import { useState, useRef, useEffect } from 'react';
import { Bell, CheckCircle2, AlertTriangle, TrendingUp, Users, X, Check } from 'lucide-react';

interface Notification {
  id: string;
  type: 'milestone' | 'approval' | 'team' | 'budget';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'milestone',
      title: 'Milestone Completed',
      message: 'Environmental Clearance approved for Lodha Altamount',
      time: '5 min ago',
      read: false,
    },
    {
      id: '2',
      type: 'budget',
      title: 'Budget Alert',
      message: 'Construction phase budget utilization at 28%',
      time: '2 hours ago',
      read: false,
    },
    {
      id: '3',
      type: 'team',
      title: 'Team Update',
      message: 'Rajesh Malhotra shared project timeline update',
      time: '5 hours ago',
      read: false,
    },
    {
      id: '4',
      type: 'approval',
      title: 'Approval Pending',
      message: 'Fire & Safety NOC requires your review',
      time: '1 day ago',
      read: true,
    },
    {
      id: '5',
      type: 'milestone',
      title: 'Phase Started',
      message: 'Pre-Development phase initiated successfully',
      time: '2 days ago',
      read: true,
    },
  ]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'milestone':
        return <CheckCircle2 className="w-4 h-4 text-primary-700" />;
      case 'approval':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'team':
        return <Users className="w-4 h-4 text-blue-500" />;
      case 'budget':
        return <TrendingUp className="w-4 h-4 text-purple-500" />;
      default:
        return <Bell className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative inline-flex items-center justify-center w-9 h-9 rounded-[var(--radius)] bg-neutral-900/5 dark:bg-card/5 hover:bg-neutral-900/10 dark:hover:bg-card/10 transition-colors text-neutral-700/80 dark:text-neutral-300/80"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full border border-white dark:border-black"></span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          
          {/* Notification Panel */}
          <div className="absolute right-0 top-12 w-[420px] z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="bg-card/95 dark:bg-card/95 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-[var(--radius-card)] shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="px-6 py-5 border-b border-black/5 dark:border-white/5">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-[16px] font-medium text-foreground dark:text-neutral-0/95">
                    Notifications
                  </h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-7 h-7 rounded-[var(--radius)] hover:bg-neutral-900/5 dark:hover:bg-card/5 flex items-center justify-center text-muted-foreground dark:text-neutral-300/60 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {unreadCount > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="text-caption text-neutral-700/80 dark:text-neutral-300/80">
                      {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                    </div>
                    <button
                      onClick={markAllAsRead}
                      className="text-caption text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <Check className="w-3 h-3" />
                      Mark all as read
                    </button>
                  </div>
                )}
              </div>

              {/* Notification List */}
              <div className="max-h-[480px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <Bell className="w-8 h-8 text-foreground/20 dark:text-neutral-0/20 mx-auto mb-3" />
                    <div className="text-small text-muted-foreground dark:text-neutral-300/60">
                      No notifications yet
                    </div>
                  </div>
                ) : (
                  <div className="divide-y divide-black/5 dark:divide-white/5">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => markAsRead(notification.id)}
                        className={`px-6 py-4 hover:bg-neutral-900/[0.02] dark:hover:bg-card/[0.02] transition-colors cursor-pointer ${
                          !notification.read ? 'bg-blue-500/[0.03] dark:bg-blue-400/[0.03]' : ''
                        }`}
                      >
                        <div className="flex gap-3">
                          {/* Icon */}
                          <div className="w-9 h-9 rounded-[var(--radius)] bg-neutral-900/5 dark:bg-card/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                            {getNotificationIcon(notification.type)}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className="text-small font-medium text-foreground dark:text-neutral-0/95">
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5"></div>
                              )}
                            </div>
                            <p className="text-small text-neutral-700/80 dark:text-neutral-300/80 leading-relaxed mb-2">
                              {notification.message}
                            </p>
                            <div className="text-caption text-muted-foreground dark:text-neutral-300/60">
                              {notification.time}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="px-6 py-4 border-t border-black/5 dark:border-white/5 bg-neutral-900/[0.01] dark:bg-card/[0.01]">
                  <button className="w-full text-center text-small font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                    View All Notifications
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
