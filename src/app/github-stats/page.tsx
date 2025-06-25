"use client";
import { use, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card_component";
import { Badge } from "@/components/ui/badge_component";
import {
  GitBranch,
  Star,
  GitFork,
  Calendar,
  Code,
  Activity,
  AlertTriangle,
  BarChartIcon,
} from "lucide-react";
import { useGitHub } from "@/hooks/useGithub";
import { LoadingSpinner } from "@/components/ui/loading_spinner";


const languageColors: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Java: "#b07219",
  "C++": "#f34b7d",
  CSS: "#1572B6",
  HTML: "#e34c26",
  React: "#61dafb",
  Vue: "#4FC08D",
};

export default function GitHubStatsPage() {
  const { fetchStats, fetchRepos, repos, stats, loading, error } = useGitHub();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchStats("AsKing07");
        await fetchRepos("AsKing07");
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching GitHub data:", error);
      }
    };

    fetchData();
  }, [fetchStats, fetchRepos]);



  if (isLoading) {
    return (
<div className="flex-1 flex flex-col justify-center items-center min-h-full w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">        
  <div className="container mx-auto">
    
     <div className="min-h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
  <LoadingSpinner />
</div>
        </div>
      </div>
    );
  }

if (error) {
  return (
    <div className="flex-1 w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="flex flex-col items-center gap-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 px-8 py-8 rounded-xl shadow-lg max-w-md">
        <AlertTriangle className="w-10 h-10 text-red-500 mb-2" />
        <h2 className="text-lg font-semibold text-red-700 dark:text-red-300">
          Une erreur est survenue
        </h2>
        <p className="text-sm text-red-600 dark:text-red-200 text-center">
          Erreur lors du chargement des statistiques GitHub&nbsp;:<br />
          <span className="font-mono break-all">{error}</span>
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition cursor-pointer"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-12 drop-shadow flex items-center justify-center gap-3">
          <BarChartIcon className="w-10 h-10 text-primary" />
          Statistique Github
        </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Aperçu de mon activité de développement et de mes contributions open
            source
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Repositories
                  </p>
                  <p className="text-2xl font-bold">
                    {stats?.stats.totalRepos || 0}
                  </p>
                </div>
                <GitBranch className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Stars
                  </p>
                  <p className="text-2xl font-bold">
                    {stats?.stats.totalStars || 0}
                  </p>
                </div>
                <Star className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Forks
                  </p>
                  <p className="text-2xl font-bold">
                    {stats?.stats.totalForks || 0}
                  </p>
                </div>
                <GitFork className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Commits( {new Date().getFullYear()} )
                  </p>
                  <p className="text-2xl font-bold">
                    {stats?.stats.totalCommitsThisYear || 0}
                  </p>
                </div>
                <Activity className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Language Stats */}
        {stats?.stats.languages && stats.stats.languages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Langages les Plus Utilisés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.stats.languages
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 8)
                    .map((lang) => (
                      <div key={lang.name} className="flex items-center gap-4">
                        <div className="flex items-center gap-2 min-w-[120px]">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor:
                                languageColors[lang.name] || "#6b7280",
                            }}
                          ></div>
                          <span className="text-sm font-medium">
                            {lang.name}
                          </span>
                        </div>
                        <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                            style={{ width: `${lang.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-muted-foreground min-w-[40px] text-right">
                          {lang.percentage.toFixed(1)}%
                        </span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Popular Repositories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-center mb-8">
            Repositories Populaires
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repos?.slice(0, 6).map((repo, index) => (
              <motion.div
                key={repo.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 transition-colors truncate"
                      >
                        {repo.name}
                      </a>
                      <Badge variant="secondary" className="text-xs">
                        {repo.visibility}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {repo.description || "Aucune description disponible"}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4" />
                          {repo.stargazers_count}
                        </div>
                        <div className="flex items-center gap-1">
                          <GitFork className="w-4 h-4" />
                          {repo.forks_count}
                        </div>
                      </div>
                      {repo.language && (
                        <Badge variant="outline" className="text-xs">
                          {repo.language}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      Mis à jour le{" "}
                      {repo.updated_at
                        ? new Date(
                            Date.parse(repo.updated_at)
                          ).toLocaleDateString("fr-FR")
                        : "Date inconnue"}
                    </div>
                    {/* topics badge */}
                    {repo.topics && repo.topics.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {repo.topics.map((topic) => (
                          <Badge
                            key={topic}
                            variant="secondary"
                            className="text-xs"
                          >
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
