'use client';
import { useTheme } from 'next-themes';
import { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  Mail,
  User,
  Settings,
  LogOut,
  Github,
  FileCode,
  ChevronRight,
  X,
  Menu,
  Briefcase,
  Shapes,
  GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/button_component';
import { Tooltip } from '@radix-ui/themes';
import { cn } from '@/lib/utils';
import { User as UserType } from '@/types/User/User';
import { useAuthStore } from '@/stores/auth_store';
import { useSidebar } from '@/hooks/useSidebar';

interface MenuItem {
  path: string;
  name: string;
  icon: React.ReactNode;
  badge?: string;
}

interface DashboardSidebarProps {
  user: UserType;
}

// Éléments de menu statiques
const menuItems: MenuItem[] = [
  { 
    path: '/dashboard', 
    name: 'Dashboard', 
    icon: <LayoutDashboard className="h-5 w-5" />
  },
  {
    path: '/dashboard/categories',
    name: 'Gestion des catégories',
    icon: <Shapes className="h-5 w-5" />
  },

  { 
    path: '/dashboard/projects', 
    name: 'Projets', 
    icon: <FileCode className="h-5 w-5" />
  },
  { 
    path: '/dashboard/experiences', 
    name: 'Expériences', 
    icon: < Briefcase  className="h-5 w-5" />
  },
  {
    path: '/dashboard/education',
    name: 'Éducation',
    icon: <GraduationCap className="h-5 w-5" />

  },
  { 
    path: '/dashboard/messages', 
    name: 'Messages', 
    icon: <Mail className="h-5 w-5" />,
    // badge: 'New'
  },
    { 
    path: '/dashboard/blog', 
    name: 'Blog', 
    icon: <FileText className="h-5 w-5" />,
    // badge: '5'
  },
  { 
    path: '/dashboard/github', 
    name: 'GitHub', 
    icon: <Github className="h-5 w-5" />
  },
];

const settingsItems: MenuItem[] = [
  { 
    path: '/dashboard/profile', 
    name: 'Profil', 
    icon: <User className="h-5 w-5" />
  },
  { 
    path: '/dashboard/settings', 
    name: 'Paramètres', 
    icon: <Settings className="h-5 w-5" />
  },
];

// Composant pour un groupe de navigation
const NavGroup = ({ 
  title, 
  items, 
  isCollapsed, 
  pathname 
}: { 
  title?: string;
  items: MenuItem[];
  isCollapsed: boolean;
  pathname: string;
}) => (
  <div className="mb-6">
    {title && !isCollapsed && (
      <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {title}
      </h3>
    )}
    <nav className="space-y-1">
      {items.map((item) => {
        const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
        
        return (
          <Tooltip
            key={item.path}
            content={isCollapsed ? item.name : undefined}
            side="right"
            delayDuration={200}
          >
            <Link
              href={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative group",
                isActive 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-white",
                isCollapsed ? "justify-center" : ""
              )}
            >
              <span className="flex-shrink-0 transition-transform group-hover:scale-110">
                {item.icon}
              </span>
              {!isCollapsed && (
                <>
                  <span className="flex-grow truncate font-medium">{item.name}</span>
                  {item.badge && (
                    <span className={cn(
                      "ml-auto rounded-full px-2 py-0.5 text-xs font-medium transition-colors",
                      item.badge === 'New' 
                        ? "bg-green-500 text-white animate-pulse" 
                        : "bg-slate-700 text-slate-300"
                    )}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              {isCollapsed && item.badge && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-green-500 text-[10px] text-white flex items-center justify-center animate-pulse">
                  •
                </span>
              )}
            </Link>
          </Tooltip>
        );
      })}
    </nav>
  </div>
);

export default function DashboardSidebar({ user }: DashboardSidebarProps) {
  const { logout } = useAuthStore();
  const { isCollapsed, isMobile, toggle, isTransitioning } = useSidebar();
  const pathname = usePathname();
   const { resolvedTheme } = useTheme();


  // Couleurs dynamiques selon le thème
  const isDark = resolvedTheme === 'dark';
  const sidebarClasses = useMemo(() => cn(
    "fixed inset-y-0 left-0 z-50 flex flex-col border-r backdrop-blur-xl transition-all duration-300 ease-in-out",
    isDark
      ? "bg-gradient-to-b from-slate-950 to-slate-900 text-white border-slate-800/50"
      : "bg-gradient-to-b from-white to-slate-100 text-slate-900 border-slate-200/70",
    isMobile 
      ? (isCollapsed ? "w-0 opacity-0 pointer-events-none" : "w-full opacity-100") 
      : (isCollapsed ? "w-20" : "w-72"),
    isTransitioning && "overflow-hidden"
  ), [isCollapsed, isMobile, isTransitioning, isDark]);

  const overlayClasses = useMemo(() => cn(
    "fixed inset-0 transition-all duration-300 z-40",
    isDark
      ? "bg-black/60 backdrop-blur-sm"
      : "bg-black/30 backdrop-blur-[2px]",
    isMobile && !isCollapsed ? "opacity-100" : "opacity-0 pointer-events-none"
  ), [isMobile, isCollapsed, isDark]);


  return (
    <>
      {/* Overlay mobile amélioré */}
      <div 
        className={overlayClasses}
        onClick={toggle}
      />
      
      {/* Sidebar principale */}
      <aside className={sidebarClasses}>
        {/* Header de la sidebar avec améliorations */}
            <div className={cn(
          "flex items-center justify-between p-4 h-16 border-b backdrop-blur-sm",
          isDark
            ? "border-slate-800/50 bg-slate-950/50"
            : "border-slate-200/70 bg-white/70"
        )}>
          {!isCollapsed && (
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shadow-lg transition-all duration-200",
                isDark
                  ? "bg-gradient-to-br from-blue-600 to-blue-700 group-hover:shadow-blue-600/30"
                  : "bg-gradient-to-br from-blue-400 to-blue-600 group-hover:shadow-blue-400/30"
              )}>
                <span className={cn(
                  "font-bold text-sm",
                  isDark ? "text-white" : "text-white"
                )}>P</span>
              </div>
              <span className={cn(
                "font-bold text-lg bg-clip-text text-transparent",
                isDark
                  ? "bg-gradient-to-r from-white to-slate-300"
                  : "bg-gradient-to-r from-blue-900 to-slate-700"
              )}>
                Portfolio
              </span>
            </Link>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            className={cn(
              "transition-all duration-200 hover:scale-105",
              isDark
                ? "text-slate-400 hover:text-white hover:bg-slate-800/50"
                : "text-slate-500 hover:text-blue-700 hover:bg-blue-100/60"
            )}
            aria-label={isCollapsed ? "Développer le menu" : "Réduire le menu"}
          >
            {isCollapsed ? 
              <ChevronRight className="h-5 w-5 transition-transform" /> : 
              <X className="h-5 w-5 transition-transform" />
            }
          </Button>
        </div>
        
        {/* Contenu scrollable avec scroll personnalisé */}
      <div className={cn(
          "flex-1 overflow-y-auto py-6 px-4 scrollbar-thin",
          isDark
            ? "scrollbar-thumb-slate-700 scrollbar-track-transparent"
            : "scrollbar-thumb-blue-200 scrollbar-track-transparent"
        )}>
          <NavGroup 
            items={menuItems}
            isCollapsed={isCollapsed}
            pathname={pathname}
          />
          
          {!isCollapsed && (
            <div className={cn(
              "my-6 border-t",
              isDark ? "border-slate-800/50" : "border-slate-200/70"
            )} />
          )}
         <NavGroup 
            title={!isCollapsed ? "Compte" : undefined}
            items={settingsItems}
            isCollapsed={isCollapsed}
            pathname={pathname}
          />
        </div>
        
        {/* Footer avec déconnexion */}
        <div className={cn(
          "border-t p-4 backdrop-blur-sm",
          isDark
            ? "border-slate-800/50 bg-slate-950/50"
            : "border-slate-200/70 bg-white/70"
        )}>
          <form action={logout} className="w-full">
            <Tooltip 
              content={isCollapsed ? 'Déconnexion' : undefined}
              side="right"
            >
              <Button 
                type="submit" 
                variant="ghost" 
                className={cn(
                  "w-full transition-all duration-200 group",
                  isCollapsed ? "justify-center px-0" : "justify-start",
                  isDark
                    ? "text-slate-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20"
                    : "text-slate-500 hover:bg-red-100 hover:text-red-600"
                )}
              >
             <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform" />
                {!isCollapsed && <span className="ml-2">Déconnexion</span>}
              </Button>
            </Tooltip>
          </form>
        </div>
        
        {/* Profil utilisateur */}
        {!isCollapsed && (
          <div className={cn(
            "border-t p-4 backdrop-blur-sm",
            isDark
              ? "border-slate-800/50 bg-slate-950/50"
              : "border-slate-200/70 bg-white/70"
          )}>
            <div className="flex items-center gap-3 group">
              <div className="relative">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center overflow-hidden ring-2 transition-all duration-200",
                  isDark
                    ? "bg-gradient-to-br from-slate-700 to-slate-800 ring-slate-600 group-hover:ring-blue-500/50"
                    : "bg-gradient-to-br from-blue-100 to-blue-300 ring-blue-300 group-hover:ring-blue-500/30"
                )}>
                  {user.avatarUrl ? (
                    <img 
                      src={user.avatarUrl} 
                      alt={`Avatar de ${user.name}`}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <span className={cn(
                      "text-xl font-semibold",
                      isDark ? "text-white" : "text-blue-900"
                    )}>
                           {user.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className={cn(
                  "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2",
                  isDark ? "bg-green-500 border-slate-900" : "bg-green-500 border-white"
                )}></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "text-sm font-medium truncate transition-colors",
                  isDark
                    ? "text-white group-hover:text-blue-300"
                    : "text-blue-900 group-hover:text-blue-600"
                )}>
                  {user.name}
                </p>
                <p className={cn(
                  "text-xs truncate",
                  isDark ? "text-slate-400" : "text-slate-500"
                )}>
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}