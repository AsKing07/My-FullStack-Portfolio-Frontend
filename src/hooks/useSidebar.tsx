
import { useContext } from "react";
import {  SidebarContext } from "@/providers/SidebarContext";

// Hook personnalisé pour utiliser le contexte
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};