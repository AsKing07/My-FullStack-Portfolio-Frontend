"use client";

import { useLocale, useTranslations } from "next-intl";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button_component";
import { useToast } from "@/hooks/useToast";

interface ResumeDownloadButtonProps {
  resumeUrl?: string;
  resumeUrlFr?: string;
  name?: string;
  label: string;
  toastMessages?: { downloading: string; success: string };
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "outline" | "ghost" | "link" | "destructive" | "secondary";
  className?: string;
}

function triggerDownload(url: string, filename: string) {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function ResumeDownloadButton({
  resumeUrl,
  resumeUrlFr,
  name,
  label,
  toastMessages,
  size = "lg",
  variant = "outline",
  className,
}: ResumeDownloadButtonProps) {
  const t = useTranslations("Common");
  const locale = useLocale();
  const { toast } = useToast();

  const primaryUrl = locale === "fr" && resumeUrlFr ? resumeUrlFr : resumeUrl;
  const otherUrl = locale === "fr" ? resumeUrl : resumeUrlFr;
  const hasOther = Boolean(otherUrl) && otherUrl !== primaryUrl;

  if (!primaryUrl) return null;

  const filenameBase = `CV_${(name || "Charbel_SONON").replace(/\s+/g, "_")}`;

  const handleDownload = (url: string, langSuffix: "EN" | "FR") => {
    if (toastMessages) toast.info(toastMessages.downloading);
    triggerDownload(url, `${filenameBase}_${langSuffix}.pdf`);
    if (toastMessages) toast.success(toastMessages.success);
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => handleDownload(primaryUrl, locale === "fr" ? "FR" : "EN")}
      >
        <Download className="mr-2 h-5 w-5" />
        {label}
      </Button>
      {hasOther && otherUrl && (
        <button
          type="button"
          onClick={() => handleDownload(otherUrl, locale === "fr" ? "EN" : "FR")}
          className="text-sm underline text-muted-foreground hover:text-foreground transition-colors"
        >
          {locale === "fr" ? t("downloadInEnglish") : t("downloadInFrench")}
        </button>
      )}
    </div>
  );
}
