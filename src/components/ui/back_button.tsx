"use client";

import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button_component";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  label: string;
  variant?: "default" | "outline" | "ghost" | "link" | "destructive" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function BackButton({ label, variant = "outline", size = "sm", className }: BackButtonProps) {
  const router = useRouter();

  return (
    <Button onClick={() => router.back()} variant={variant} size={size} className={className}>
      <ArrowLeft className="w-4 h-4 mr-2" />
      {label}
    </Button>
  );
}
