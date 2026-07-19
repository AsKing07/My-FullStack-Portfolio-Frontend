import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Award, Calendar, ExternalLink, BadgeCheck, Hash } from "lucide-react";
import { ErrorRetryCard } from "@/components/ui/error_retry_card";
import { formatDateShort, pickLocalized } from "@/lib/utils";
import { CertificationService } from "@/services/certification.service";
import { Certification } from "@/types/Certification/Certification";

interface CertificationsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function CertificationsPage({ params }: CertificationsPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Certifications" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });

  let certifications: Certification[] = [];
  let error: string | null = null;

  try {
    const res = await CertificationService.getCertifications({ limit: 1000 });
    certifications = res.data.items;
  } catch (err) {
    error = err instanceof Error ? err.message : "Unknown error";
  }

  if (error) {
    return (
      <ErrorRetryCard
        title={tCommon("errorTitle")}
        message={t("errorPrefix")}
        error={error}
        retryLabel={tCommon("tryAgain")}
      />
    );
  }

  const sorted = [...certifications].sort(
    (a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 dark:from-slate-900 dark:via-amber-950 dark:to-slate-950">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-orange-400/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-in slide-in-from-top duration-1000">
            <div className="inline-flex items-center justify-center p-3 bg-amber-100 dark:bg-amber-900 rounded-full mb-6">
              <Award className="w-12 h-12 text-amber-600 dark:text-amber-400" />
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent leading-tight">
              {t("heroTitle")}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {t("heroSubtitle")}
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-20">
        {sorted.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">{t("noItemsFound")}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {sorted.map((cert) => {
              const isExpired = cert.expiryDate ? new Date(cert.expiryDate) < new Date() : false;
              return (
                <div
                  key={cert.id}
                  className="group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white to-amber-50 dark:from-slate-800 dark:to-amber-900/20 rounded-3xl transform group-hover:scale-105 transition-transform duration-300"></div>
                  <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-white/50 dark:border-slate-700/50 hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {cert.image ? (
                          <Image
                            src={cert.image}
                            alt={pickLocalized(cert.name, cert.nameFr, locale)}
                            width={64}
                            height={64}
                            className="object-contain w-full h-full"
                          />
                        ) : (
                          <Award className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                          {pickLocalized(cert.name, cert.nameFr, locale)}
                        </h3>
                        <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                          {cert.issuer}
                        </p>
                      </div>
                    </div>

                    {cert.description && (
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                        {pickLocalized(cert.description, cert.descriptionFr, locale)}
                      </p>
                    )}

                    <div className="mt-auto space-y-2">
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
        )}
      </div>
    </div>
  );
}
