import { getTranslations } from "next-intl/server";
import { ErrorRetryCard } from "@/components/ui/error_retry_card";
import { GitHubService } from "@/services/github.service";
import { GitLabService } from "@/services/gitlab.service";
import { WakapiService } from "@/services/wakapi.service";
import { GitHubStats } from "@/types/Github/Github";
import { GitlabStats } from "@/types/Gitlab/Gitlab";
import { WakapiStats, WakapiDailySummary } from "@/types/Wakapi/Wakapi";
import { DevStatsContentClient } from "./DevStatsContentClient";

interface DevStatsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function GitHubStatsPage({ params }: DevStatsPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "DevStats" });

  let stats: GitHubStats | null = null;
  let gitlabStats: GitlabStats | null = null;
  let wakapiStats: WakapiStats | null = null;
  let wakapiSummaries: WakapiDailySummary[] = [];
  let error: string | null = null;

  try {
    const res = await GitHubService.getGitHubStats("AsKing07");
    stats = res.data!.items;
  } catch (err) {
    error = err instanceof Error ? err.message : "Unknown error";
  }

  try {
    const res = await GitLabService.getGitLabStats("AsKing07");
    gitlabStats = res.data!.items;
  } catch (err) {
    // Les stats GitLab sont un bonus : une erreur ici n'empêche pas d'afficher GitHub
    gitlabStats = null;
  }

  try {
    const res = await WakapiService.getWakapiStats();
    wakapiStats = res.data!.items;
  } catch (err) {
    wakapiStats = null;
  }

  try {
    const res = await WakapiService.getWakapiSummaries();
    wakapiSummaries = res.data?.items || [];
  } catch (err) {
    wakapiSummaries = [];
  }

  // On n'affiche une page d'erreur bloquante que si aucune des sources n'a pu être chargée
  if (error && !gitlabStats && !wakapiStats) {
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
      <DevStatsContentClient
        stats={stats}
        gitlabStats={gitlabStats}
        wakapiStats={wakapiStats}
        wakapiSummaries={wakapiSummaries}
      />
    </div>
  );
}
