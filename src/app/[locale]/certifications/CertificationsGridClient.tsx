"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Award, Calendar, ExternalLink, BadgeCheck, Hash, X, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge_component";
import { cn, formatDateShort, pickLocalized } from "@/lib/utils";
import { Certification } from "@/types/Certification/Certification";

interface CertificationsGridClientProps {
  certifications: Certification[];
  locale: string;
}

const CERTS_PER_PAGE = 6;

export function CertificationsGridClient({ certifications, locale }: CertificationsGridClientProps) {
  const t = useTranslations("Certifications");
  const [enlargedImage, setEnlargedImage] = useState<{ src: string; alt: string } | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [selectedIssuer, setSelectedIssuer] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Les sous-certifications (rattachées à une certification globale) ne sont
  // affichées que repliées sous leur parent, pas comme cartes indépendantes.
  const topLevelCertifications = certifications.filter((cert) => !cert.parentId);

  if (topLevelCertifications.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground text-lg">{t("noItemsFound")}</p>
      </div>
    );
  }

  const issuers = Array.from(new Set(topLevelCertifications.map((c) => c.issuer))).sort();

  const filteredCertifications = topLevelCertifications.filter((cert) => {
    const matchesIssuer = !selectedIssuer || cert.issuer === selectedIssuer;
    if (!matchesIssuer) return false;
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    return (
      pickLocalized(cert.name, cert.nameFr, locale).toLowerCase().includes(q) ||
      cert.issuer.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filteredCertifications.length / CERTS_PER_PAGE);
  const startIndex = (currentPage - 1) * CERTS_PER_PAGE;
  const endIndex = startIndex + CERTS_PER_PAGE;
  const currentCertifications = filteredCertifications.slice(startIndex, endIndex);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleIssuerChange = (issuer: string | null) => {
    setSelectedIssuer(issuer);
    setCurrentPage(1);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto mb-10 space-y-4">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full pl-9 pr-4 py-2 rounded-full border border-amber-200 dark:border-amber-900 bg-white/90 dark:bg-slate-900/90 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        {issuers.length > 1 && (
          <div className="flex flex-wrap justify-center gap-3">
            <Badge
              variant={selectedIssuer === null ? "default" : "outline"}
              className={cn(
                "cursor-pointer px-4 py-2 text-sm",
                selectedIssuer === null
                  ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white"
                  : "hover:bg-amber-100 dark:hover:bg-amber-900"
              )}
              onClick={() => handleIssuerChange(null)}
            >
              {t("all")}
            </Badge>
            {issuers.map((issuer) => (
              <Badge
                key={issuer}
                variant={selectedIssuer === issuer ? "default" : "outline"}
                className={cn(
                  "cursor-pointer px-4 py-2 text-sm",
                  selectedIssuer === issuer
                    ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white"
                    : "hover:bg-amber-100 dark:hover:bg-amber-900"
                )}
                onClick={() => handleIssuerChange(issuer)}
              >
                {issuer}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {filteredCertifications.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">{t("noResultsFound")}</p>
        </div>
      ) : (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {currentCertifications.map((cert) => {
          const isExpired = cert.expiryDate ? new Date(cert.expiryDate) < new Date() : false;
          const certTitle = pickLocalized(cert.name, cert.nameFr, locale);
          const isExpanded = expandedIds.has(cert.id);
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

                {cert.children && cert.children.length > 0 && (
                  <div className="w-full mt-4 pt-4 border-t border-gray-100 dark:border-slate-700 text-left">
                    <button
                      type="button"
                      onClick={() => toggleExpanded(cert.id)}
                      className="w-full inline-flex items-center justify-center gap-2 text-sm font-medium text-amber-700 dark:text-amber-300 hover:text-amber-800 dark:hover:text-amber-200 transition-colors"
                    >
                      {isExpanded ? t("hideIncluded") : t("showIncluded", { count: cert.children.length })}
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {isExpanded && (
                      <ul className="mt-3 space-y-2">
                        {cert.children.map((child) => (
                          <li
                            key={child.id}
                            className="flex items-center gap-3 p-2 rounded-lg bg-amber-50/60 dark:bg-amber-950/30"
                          >
                            <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
                              {child.image ? (
                                <Image src={child.image} alt={pickLocalized(child.name, child.nameFr, locale)} width={40} height={40} className="object-contain w-full h-full" />
                              ) : (
                                <Award className="w-5 h-5 text-amber-500" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {pickLocalized(child.name, child.nameFr, locale)}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{formatDateShort(child.issueDate)}</p>
                            </div>
                            {child.credentialUrl && (
                              <a
                                href={child.credentialUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={t("verifyCredential")}
                                className="flex-shrink-0 text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-12">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 1}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-amber-200 dark:border-amber-900 text-sm font-medium text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            {t("previous")}
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 2 && page <= currentPage + 2)
              ) {
                return (
                  <button
                    type="button"
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      "w-10 h-10 rounded-lg text-sm font-medium border transition-colors",
                      currentPage === page
                        ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white border-transparent"
                        : "border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/50"
                    )}
                  >
                    {page}
                  </button>
                );
              } else if (page === currentPage - 3 || page === currentPage + 3) {
                return (
                  <span key={page} className="px-2 text-gray-500">
                    ...
                  </span>
                );
              }
              return null;
            })}
          </div>

          <button
            type="button"
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-amber-200 dark:border-amber-900 text-sm font-medium text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {t("next")}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {filteredCertifications.length > 0 && (
        <div className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
          {t("showingRange", {
            start: startIndex + 1,
            end: Math.min(endIndex, filteredCertifications.length),
            total: filteredCertifications.length,
          })}
        </div>
      )}

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
