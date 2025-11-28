"use client"

import { useState, useCallback, useMemo, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button_component"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/stores/auth_store"
import { ThemeToggle } from "../ui/theme_toggle"

// Types pour une meilleure sécurité de type
interface NavigationItem {
  name: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  children?: NavigationItem[]
}

interface HeaderProps {
  className?: string
  variant?: 'default' | 'transparent' | 'solid'
  showAuthButton?: boolean
  navigation?: NavigationItem[]
}

// Configuration par défaut de la navigation
const DEFAULT_NAVIGATION: NavigationItem[] = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Experience", href: "/experience" },
  { name: "Education", href: "/education" },
  { name: "Projects", href: "/projects" },
  { name: "Dev Stats", href: "/github-stats" },  
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
]

// Hook personnalisé pour la gestion du menu mobile
const useMobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Optimisation des handlers avec useCallback
  const openMenu = useCallback(() => {
    setIsOpen(true)
    // Gestion du focus pour l'accessibilité
    setTimeout(() => {
      const firstFocusable = menuRef.current?.querySelector(
        'a, button, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement
      firstFocusable?.focus()
    }, 100)
  }, [])

  const closeMenu = useCallback(() => {
    setIsOpen(false)
    // Retour du focus au bouton pour l'accessibilité
    buttonRef.current?.focus()
  }, [])

  // Gestion des événements clavier
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape' && isOpen) {
      closeMenu()
    }
  }, [isOpen, closeMenu])

  // Gestion des clics à l'extérieur
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (isOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
      closeMenu()
    }
  }, [isOpen, closeMenu])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.addEventListener('mousedown', handleClickOutside)
      // Prévention du scroll en arrière-plan
      document.body.style.overflow = 'hidden'
      
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
        document.removeEventListener('mousedown', handleClickOutside)
        document.body.style.overflow = 'unset'
      }
    }
  }, [isOpen, handleKeyDown, handleClickOutside])

  return {
    isOpen,
    openMenu,
    closeMenu,
    menuRef,
    buttonRef
  }
}

// Hook personnalisé pour la gestion du focus
const useFocusManagement = () => {
  const [focusedIndex, setFocusedIndex] = useState(-1)
  
  const handleKeyNavigation = useCallback((event: React.KeyboardEvent, itemsLength: number) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setFocusedIndex(prev => (prev + 1) % itemsLength)
        break
      case 'ArrowUp':
        event.preventDefault()
        setFocusedIndex(prev => (prev - 1 + itemsLength) % itemsLength)
        break
      case 'Home':
        event.preventDefault()
        setFocusedIndex(0)
        break
      case 'End':
        event.preventDefault()
        setFocusedIndex(itemsLength - 1)
        break
    }
  }, [])

  return { focusedIndex, handleKeyNavigation, setFocusedIndex }
}

export function Header({ 
  className = "",
  variant = 'default',
  showAuthButton = true,
  navigation = DEFAULT_NAVIGATION 
}: HeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const { isOpen, openMenu, closeMenu, menuRef, buttonRef } = useMobileMenu()
  const { focusedIndex, handleKeyNavigation, setFocusedIndex } = useFocusManagement()

  // Mémorisation des styles de variantes
  const headerStyles = useMemo(() => {
    const baseStyles = "sticky top-0 z-50 w-full border-b transition-all duration-300"
    
    switch (variant) {
      case 'transparent':
        return cn(baseStyles, "bg-transparent backdrop-blur-sm")
      case 'solid':
        return cn(baseStyles, "bg-background border-border")
      default:
        return cn(baseStyles, "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60")
    }
  }, [variant])

  // Optimisation du handler de navigation
  const handleNavigation = useCallback((href: string) => {
    closeMenu()
    router.push(href)
  }, [closeMenu, router])

  // Optimisation du handler de clic sur un élément de navigation
  const handleNavigationClick = useCallback((item: NavigationItem) => (event: React.MouseEvent) => {
    event.preventDefault()
    handleNavigation(item.href)
  }, [handleNavigation])

  // Mémorisation des éléments de navigation
  const navigationElements = useMemo(() => {
    return navigation.map((item, index) => (
      <Link
        key={item.name}
        href={item.href}
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-2 py-1",
          pathname === item.href
            ? "text-primary"
            : "text-muted-foreground"
        )}
        onClick={handleNavigationClick(item)}
        onFocus={() => setFocusedIndex(index)}
        aria-current={pathname === item.href ? 'page' : undefined}
        tabIndex={focusedIndex === index ? 0 : -1}
      >
        {item.name}
      </Link>
    ))
  }, [navigation, pathname, handleNavigationClick, focusedIndex, setFocusedIndex])

  // Mémorisation des éléments de navigation mobile
  const mobileNavigationElements = useMemo(() => {
    return navigation.map((item, index) => (
      <Link
        key={item.name}
        href={item.href}
        className={cn(
          "block rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          pathname === item.href 
            ? "bg-accent text-primary" 
            : "text-foreground"
        )}
        onClick={handleNavigationClick(item)}
        aria-current={pathname === item.href ? 'page' : undefined}
      >
        {item.name}
      </Link>
    ))
  }, [navigation, pathname, handleNavigationClick])

  return (
    <header className={cn(headerStyles, className)} role="banner">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="text-xl font-bold text-gradient focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
            aria-label="Retour à l'accueil"
          >
            Charbel's Portfolio
          </Link>

          {/* Desktop Navigation */}
          <nav 
            className="hidden lg:flex space-x-6" 
            role="navigation"
            aria-label="Navigation principale"
            onKeyDown={(e) => handleKeyNavigation(e, navigation.length)}
          >
            {navigationElements}
          </nav>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {showAuthButton && isAuthenticated && (
              <Button variant="outline" size="sm" asChild>
                <Link 
                  href="/dashboard"
                  className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Dashboard
                </Link>
              </Button>
            )}
            
            {/* Mobile menu button */}
            <div className="lg:hidden">
              <Button
                ref={buttonRef}
                variant="ghost"
                size="icon"
                onClick={openMenu}
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
                aria-label={isOpen ? "Close menu" : "Open menu"}
                className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <span className="sr-only">
                  {isOpen ? "Close menu" : "Open menu"}
                </span>
                <Menu className="h-6 w-6" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
     <>
  {/* Overlay */}
  <div 
    className="lg:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
    aria-hidden="true"
  />
  
  {/* Menu Panel */}
  <div 
    ref={menuRef}
    id="mobile-menu"
    className="lg:hidden fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white dark:bg-slate-900 text-foreground shadow-xl border-l"
    role="dialog"
    aria-modal="true"
    aria-labelledby="mobile-menu-title"
  >
    <div className="flex items-center justify-between p-6 border-b bg-white dark:bg-slate-900 text-foreground">
      <h2 id="mobile-menu-title" className="text-lg font-semibold">
        Navigation
      </h2>
      <Button
        variant="ghost"
        size="icon"
        onClick={closeMenu}
        aria-label="Close menu"
        className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <span className="sr-only">Close menu</span>
        <X className="h-6 w-6" aria-hidden="true" />
      </Button>
    </div>

    <nav 
      className="px-6 py-4 space-y-2 bg-white dark:bg-slate-900 rounded-b-2xl text-foreground"
      role="navigation"
      aria-label="Navigation mobile"
    >
      {mobileNavigationElements}
    </nav>

    {showAuthButton && isAuthenticated && (
      <div className="border-t p-6">
        <Button variant="outline" size="sm" asChild className="w-full">
          <Link 
            href="/dashboard" 
            onClick={closeMenu}
            className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Dashboard
          </Link>
        </Button>
      </div>
    )}
  </div>
</>
      )}
    </header>
  )
}

// Export du type pour utilisation externe
export type { HeaderProps, NavigationItem }
