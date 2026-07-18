import { getTranslations } from "next-intl/server";
import { ErrorRetryCard } from "@/components/ui/error_retry_card";
import { GitHubService } from "@/services/github.service";
import { GitHubStats } from "@/types/Github/Github";
import { DevStatsContentClient } from "./DevStatsContentClient";

interface DevStatsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function GitHubStatsPage({ params }: DevStatsPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "DevStats" });

  let stats: GitHubStats | null = null;
  let error: string | null = null;

  try {
    const res = await GitHubService.getGitHubStats("AsKing07");
    stats = res.data!.items;
  } catch (err) {
    error = err instanceof Error ? err.message : "Unknown error";
  }

  if (error) {
    return (
      <ErrorRetryCard
        title={t("errorTitle")}
        message={t("errorPrefix")}
        error={error}
        retryLabel={t("tryAgain")}
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <DevStatsContentClient stats={stats} />
    </div>
  );
}
