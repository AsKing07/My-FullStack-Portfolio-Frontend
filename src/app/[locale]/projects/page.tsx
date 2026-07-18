import { getTranslations } from "next-intl/server";
import { ProjectsService } from "@/services/projects.service";
import { CategoryService } from "@/services/category.service";
import { ErrorRetryCard } from "@/components/ui/error_retry_card";
import { ProjectsListClient } from "./ProjectsListClient";
import { Project } from "@/types/Project/Project";
import { Category } from "@/types/Category/Category";

interface ProjectsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Projects" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });

  let projects: Project[] = [];
  let categories: Category[] = [];
  let error: string | null = null;

  try {
    const [projRes, catRes] = await Promise.all([
      ProjectsService.getProjects({ limit: 1000 }),
      CategoryService.getCategories(),
    ]);
    projects = projRes.data.items;
    categories = catRes.data.items;
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

  return <ProjectsListClient projects={projects} categories={categories} />;
}
