import { Outlet, ScrollRestoration, useLocation } from "react-router";
import { ChatButton } from './components/ChatButton';
import { Toaster } from 'sonner';

export function Root() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-[#F2F2F2] dark:bg-[#0a0a0a] transition-colors duration-300">
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