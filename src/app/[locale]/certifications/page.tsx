import { getTranslations } from "next-intl/server";
import { Award } from "lucide-react";
import { ErrorRetryCard } from "@/components/ui/error_retry_card";
import { CertificationService } from "@/services/certification.service";
import { Certification } from "@/types/Certification/Certification";
import { CertificationsGridClient } from "./CertificationsGridClient";

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
        <CertificationsGridClient certifications={sorted} locale={locale} />
      </div>
    </div>
  );
}
