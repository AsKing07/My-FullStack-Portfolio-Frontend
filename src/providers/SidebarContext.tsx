'use client';

import { createContext, useRef, useState, useEffect, ReactNode } from 'react';

export interface SidebarContextType {
  isCollapsed: boolean;
  isTransitioning?: boolean; // Optionnel, si vous voulez gérer les transitions
  isMobile: boolean;
  toggle: () => void;
  collapse: () => void;
  expand: () => void;
}

export const SidebarContext = createContext<SidebarContextType | undefined>(undefined);



// Constantes pour les breakpoints
const MOBILE_BREAKPOINT = 1024;

interface SidebarProviderProps {
  children: ReactNode;
}

export const SidebarProvider = ({ children }: SidebarProviderProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const wasMobile = useRef(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT;
      setIsMobile(mobile);

      // Collapse uniquement lors du passage desktop → mobile
      if (mobile && !wasMobile.current) {
        setIsCollapsed(true);
      }
      wasMobile.current = mobile;
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggle = () => setIsCollapsed(prev => !prev);
  const collapse = () => setIsCollapsed(true);
  const expand = () => setIsCollapsed(false);

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        isMobile,
        isTransitioning,
        toggle,
        collapse,
        expand,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};