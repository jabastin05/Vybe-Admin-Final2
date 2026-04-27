import { Outlet, ScrollRestoration, useLocation } from "react-router";
import { ChatButton } from './components/ChatButton';
import { Toaster } from 'sonner';

export function Root() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-background dark:bg-neutral-900 transition-colors duration-300">
      <Outlet />
      <ScrollRestoration />
      {!isAdminRoute && <ChatButton />}
      <Toaster 
        position="top-right" 
        expand={false}
        richColors
        closeButton
      />
    </div>
  );
}