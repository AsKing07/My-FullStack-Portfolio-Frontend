'use client';

import { useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { 
  Bell, 
  Search, 
  Menu, 
  Sun, 
  Moon, 
  Laptop, 
  ChevronDown,
  LogOut,
  Settings,
  User as UserIcon,
  X,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button_component';
import { Input } from '@/components/ui/form/input_component';
import { useAuthStore } from '@/stores/auth_store';
import { DropdownMenu } from '@radix-ui/themes';
import { useTheme } from 'next-themes';
import { User } from '@/types/User/User';
import { useSidebar } from '@/hooks/useSidebar';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface DashboardHeaderProps {
  user: User;
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const { logout } = useAuthStore();
  const { toggle, isCollapsed, isMobile } = useSidebar();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Titre de la page basé sur l'URL avec formatage amélioré
  const pageTitle = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);
    
    if (segments.length === 1) return 'Dashboard';
    
    const pageName = segments[1];
    const formatted = pageName.charAt(0).toUpperCase() + pageName.slice(1);
    
    // Traductions personnalisées
    const translations: Record<string, string> = {
      'Blog': 'Articles',
      'Projects': 'Projets',
      'Media': 'Médias',
      'Messages': 'Messages',
      'Profile': 'Profil',
      'Settings': 'Paramètres',
      'Github': 'GitHub'
    };
    
    return translations[formatted] || formatted;
  }, [pathname]);

  // Breadcrumb pour une meilleure navigation
  const breadcrumbs = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);
    return segments.map((segment, index) => ({
      name: segment.charAt(0).toUpperCase() + segment.slice(1),
      path: '/' + segments.slice(0, index + 1).join('/'),
      isLast: index === segments.length - 1
    }));
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200/50 bg-white/80 backdrop-blur-xl px-4 dark:border-slate-800/50 dark:bg-slate-950/80">
      <div className="flex items-center gap-4">
        {/* Bouton toggle sidebar - amélioré pour mobile */}
  
  {
    isMobile &&
      <Button
          variant="ghost" 
          size="icon"
          className={cn(
            "transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800",
            isMobile ? "flex" : "hidden lg:flex"
          )}
          onClick={toggle}
          aria-label={isCollapsed ? "Développer le menu" : "Réduire le menu"}
        >
          <Menu className="h-5 w-5" />
        </Button>
  }
      
        
        {/* Titre et breadcrumb */}
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
            {pageTitle}
          </h1>
          {breadcrumbs.length > 1 && (
            <nav className="hidden sm:flex items-center space-x-1 text-sm text-slate-500 dark:text-slate-400">
              {breadcrumbs.map((crumb, index) => (
                <div key={crumb.path} className="flex items-center">
                  {index > 0 && <span className="mx-1">/</span>}
                  {crumb.isLast ? (
                    <span className="text-slate-900 dark:text-white font-medium">
                      {crumb.name}
                    </span>
                  ) : (
                    <Link 
                      href={crumb.path}
                      className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                    >
                      {crumb.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Barre de recherche responsive */}
        <div className="relative">
          {/* Version desktop */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              type="search" 
              placeholder="Rechercher..."
              className="w-64 pl-10 bg-slate-50 border-slate-200 focus:bg-white dark:bg-slate-800 dark:border-slate-700 dark:focus:bg-slate-900 transition-colors"
            />
          </div>
          
          {/* Version mobile */}
          <div className="md:hidden">
            {!isSearchOpen ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                className="hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Search className="h-5 w-5" />
              </Button>
            ) : (
              <div className="flex items-center gap-2 absolute right-0 top-0 bg-white dark:bg-slate-900 p-2 rounded-lg shadow-lg border dark:border-slate-800 min-w-[200px]">
                <Input 
                  type="search" 
                  placeholder="Rechercher..."
                  className="flex-1"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Actions rapides pour mobile */}
        <div className="flex items-center gap-1">
          {/* Notifications avec indicateur */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <Button 
                variant="ghost" 
                size="icon"
                className="relative hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Bell className="h-5 w-5" />
                {/* Indicateur de notifications */}
                <span className="absolute -top-0.5 -right-0.5 h-3 w-3 bg-red-500 rounded-full border-2 border-white dark:border-slate-950 animate-pulse"></span>
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end" className="w-80">
              <DropdownMenu.Label className="font-semibold">
                Notifications
              </DropdownMenu.Label>
              <DropdownMenu.Separator />
              <div className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">Nouveau commentaire</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Il y a 5 minutes</p>
                    </div>
                  </div>
                </div>
              </div>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
          
          {/* Sélecteur de thème amélioré */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <Button 
                variant="ghost" 
                size="icon"
                className="hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {theme === 'light' ? (
                  <Sun className="h-5 w-5 transition-transform hover:rotate-90" />
                ) : theme === 'dark' ? (
                  <Moon className="h-5 w-5 transition-transform hover:rotate-12" />
                ) : (
                  <Laptop className="h-5 w-5" />
                )}
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end">
              <DropdownMenu.Item 
                onClick={() => setTheme('light')}
                className="flex items-center gap-2"
              >
                <Sun className="h-4 w-4" />
                <span>Clair</span>
                {theme === 'light' && <span className="ml-auto text-blue-600">✓</span>}
              </DropdownMenu.Item>
              <DropdownMenu.Item 
                onClick={() => setTheme('dark')}
                className="flex items-center gap-2"
              >
                <Moon className="h-4 w-4" />
                <span>Sombre</span>
                {theme === 'dark' && <span className="ml-auto text-blue-600">✓</span>}
              </DropdownMenu.Item>
              <DropdownMenu.Item 
                onClick={() => setTheme('system')}
                className="flex items-center gap-2"
              >
                <Laptop className="h-4 w-4" />
                <span>Système</span>
                {theme === 'system' && <span className="ml-auto text-blue-600">✓</span>}
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
          
          {/* Menu utilisateur responsive */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <Button 
                variant="ghost" 
                className="flex items-center gap-2 h-10 px-3 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <div className="relative">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center overflow-hidden dark:from-slate-700 dark:to-slate-800 ring-2 ring-slate-200 dark:ring-slate-700">
                    {user.avatarUrl ? (
                      <img 
                        src={user.avatarUrl} 
                        alt={`Avatar de ${user.name}`}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {user.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-950"></div>
                </div>
                
                {/* Nom utilisateur masqué sur très petits écrans */}
                <span className="hidden sm:inline-block max-w-[120px] truncate font-medium">
                  {user.name}
                </span>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end" className="w-64">
              {/* Profil utilisateur dans le menu */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50">
                <div className="relative">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center overflow-hidden dark:from-slate-700 dark:to-slate-800">
                    {user.avatarUrl ? (
                      <img 
                        src={user.avatarUrl} 
                        alt={`Avatar de ${user.name}`}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-medium text-slate-700 dark:text-slate-300">
                        {user.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-900"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                  <p className="text-xs text-green-600 dark:text-green-400">En ligne</p>
                </div>
              </div>
              
              <DropdownMenu.Separator />
              
              <DropdownMenu.Item asChild>
                <Link href="/dashboard/profile" className="flex items-center gap-3 py-2">
                  <UserIcon className="h-4 w-4" />
                  <span>Mon Profil</span>
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item asChild>
                <Link href="/dashboard/settings" className="flex items-center gap-3 py-2">
                  <Settings className="h-4 w-4" />
                  <span>Paramètres</span>
                </Link>
              </DropdownMenu.Item>
              
              <DropdownMenu.Separator />
              
              <DropdownMenu.Item asChild>
                <form action={logout} className="w-full">
                  <button 
                    type="submit" 
                    className="flex w-full items-center gap-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Déconnexion</span>
                  </button>
                </form>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
      </div>
    </header>
  );
}
