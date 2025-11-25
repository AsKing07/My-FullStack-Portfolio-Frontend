"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth_store";
import { usePathname, useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/loading_spinner";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { User } from "@/types/User/User";
import { Suspense } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { SidebarProvider } from "@/providers/SidebarContext";
import { useSidebar } from "@/hooks/useSidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayoutContent = ({ children }: DashboardLayoutProps) => {
  const { isAuthenticated, user, isLoading: authLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const { isCollapsed, isMobile } = useSidebar();

  useEffect(() => {
    if (authLoading) return;
    
    console.log('DashboardLayout - pathname:', pathname);
    console.log('DashboardLayout - isAuthenticated:', isAuthenticated);
    
    // Pages accessibles sans authentification
    const publicPages = ["/dashboard/login", "/dashboard/forgot-password", "/dashboard/reset-password"];
    const isPublicPage = publicPages.includes(pathname);
    
    
    if (!isAuthenticated && !isPublicPage) {
      router.replace("/dashboard/login");
    } else if (isAuthenticated && pathname === "/dashboard/login") {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, authLoading, pathname, router]);

  if (authLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-sm text-slate-600 dark:text-slate-400">Chargement en cours...</p>
        </div>
      </div>
    );
  }

  // Pages accessibles sans authentification
  const publicPages = ["/dashboard/login", "/dashboard/forgot-password", "/dashboard/reset-password"];
  const isPublicPage = publicPages.includes(pathname);

  // Si on est sur une page publique et pas authentifié, on affiche le contenu
  if (!isAuthenticated && isPublicPage) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        {children}
      </Suspense>
    );
  }

  // Si on n'est pas authentifié et pas sur une page publique, on redirige vers login
  if (!isAuthenticated) {
    return null;
  }

  const authUser: User = user!;

  return (
    <div className="min-h-screen w-full bg-white dark:bg-slate-950 flex">
      <DashboardSidebar user={authUser} />
      <div className={cn(
        "flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out",
        !isMobile && (isCollapsed ? "lg:ml-20" : "lg:ml-72")
      )}>
        <DashboardHeader user={authUser} />
        <main className="flex-1 w-full p-4 md:p-6 bg-slate-50 dark:bg-slate-900 min-h-[calc(100vh-4rem)]">
          <Suspense fallback={
            <div className="flex items-center justify-center h-full">
              <LoadingSpinner />
            </div>
          }>
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </Suspense>
        </main>
      </div>
      <Toaster 
        position="top-right" 
        richColors 
        closeButton
        expand={false}
        duration={4000}
      />
    </div>
  );
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <ErrorBoundary>
      <SidebarProvider>
        <DashboardLayoutContent>
          {children}
        </DashboardLayoutContent>
      </SidebarProvider>
    </ErrorBoundary>
  );
}