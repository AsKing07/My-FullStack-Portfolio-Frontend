"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Award, Calendar, ExternalLink, BadgeCheck, Hash, X } from "lucide-react";
import { cn, formatDateShort, pickLocalized } from "@/lib/utils";
import { Certification } from "@/types/Certification/Certification";

interface CertificationsGridClientProps {
  certifications: Certification[];
  locale: string;
}

export function CertificationsGridClient({ certifications, locale }: CertificationsGridClientProps) {
  const t = useTranslations("Certifications");
  const [enlargedImage, setEnlargedImage] = useState<{ src: string; alt: string } | null>(null);

  if (certifications.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground text-lg">{t("noItemsFound")}</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {certifications.map((cert) => {
          const isExpired = cert.expiryDate ? new Date(cert.expiryDate) < new Date() : false;
          const certTitle = pickLocalized(cert.name, cert.nameFr, locale);
          return (
            <div
              key={cert.id}
              className="group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white to-amber-50 dark:from-slate-800 dark:to-amber-900/20 rounded-3xl transform group-hover:scale-105 transition-transform duration-300"></div>
              <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-white/50 dark:border-slate-700/50 hover:shadow-2xl transition-all duration-300 h-full flex flex-col items-center text-center">
                <div
                  className={cn(
                    "w-40 h-40 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center flex-shrink-0 overflow-hidden mb-4 shadow-lg ring-1 ring-black/5 dark:ring-white/10",
                    cert.image && "cursor-pointer transition-transform hover:scale-105"
                  )}
                  onClick={() => cert.image && setEnlargedImage({ src: cert.image, alt: certTitle })}
                  role={cert.image ? "button" : undefined}
                  tabIndex={cert.image ? 0 : undefined}
                  aria-label={cert.image ? t("enlargeImage") : undefined}
                  onKeyDown={(e) => {
                    if (cert.image && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault();
                      setEnlargedImage({ src: cert.image, alt: certTitle });
                    }
                  }}
                >
                  {cert.image ? (
                    <Image
                      src={cert.image}
                      alt={certTitle}
                      width={160}
                      height={160}
                      className="object-contain w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50 flex items-center justify-center">
                      <Award className="w-16 h-16 text-amber-600 dark:text-amber-400" />
                    </div>
                  )}
                </div>
                <div className="mb-4">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {certTitle}
                  </h3>
                  <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                    {cert.issuer}
                  </p>
                </div>

                {cert.description && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-3 text-left">
                    {pickLocalized(cert.description, cert.descriptionFr, locale)}
                  </p>
                )}

                <div className="mt-auto w-full space-y-2 text-left">
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{t("issued")} {formatDateShort(cert.issueDate)}</span>
                  </div>

                  {cert.expiryDate && (
                    <div className="flex items-center gap-2 text-xs">
                      <BadgeCheck className={`w-3.5 h-3.5 ${isExpired ? 'text-red-500' : 'text-green-600 dark:text-green-400'}`} />
                      <span className={isExpired ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}>
                        {isExpired ? t("expired") : `${t("expires")} ${formatDateShort(cert.expiryDate)}`}
                      </span>
                    </div>
                  )}

                  {!cert.expiryDate && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <BadgeCheck className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                      <span>{t("noExpiry")}</span>
                    </div>
                  )}

                  {cert.credentialId && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <Hash className="w-3.5 h-3.5" />
                      <span className="truncate">{t("credentialId")}: {cert.credentialId}</span>
                    </div>
                  )}
                </div>

                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center justify-center gap-2 text-sm font-medium px-4 py-2 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors"
                  >
                    {t("verifyCredential")}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {enlargedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
          role="dialog"
          aria-modal="true"
          aria-label={enlargedImage.alt}
          onClick={() => setEnlargedImage(null)}
        >
          <button
            type="button"
            className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors"
            onClick={() => setEnlargedImage(null)}
            aria-label={t("closeEnlargedImage")}
          >
            <X className="w-8 h-8" />
          </button>
          <Image
            src={enlargedImage.src}
            alt={enlargedImage.alt}
            width={800}
            height={800}
            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
