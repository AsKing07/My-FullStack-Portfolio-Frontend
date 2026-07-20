'use client';

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card_component";
import {
  GitBranch,
  Star,
  GitFork,
  Code,
  Activity,
  Monitor,
  TrendingUp,
  Github,
  Gitlab,
  ExternalLink,
  BarChartIcon,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { GitHubStats } from "@/types/Github/Github";
import { GitlabStats } from "@/types/Gitlab/Gitlab";
import { WakapiStats, WakapiDailySummary } from "@/types/Wakapi/Wakapi";

interface DevStatsContentClientProps {
  stats: GitHubStats | null;
  gitlabStats: GitlabStats | null;
  wakapiStats: WakapiStats | null;
  wakapiSummaries: WakapiDailySummary[];
}

const CHART_COLORS = ["#2563eb", "#9333ea", "#16a34a", "#eab308", "#ea580c", "#dc2626", "#0891b2"];

const AXIS_STYLE = { fontSize: 12, fill: "currentColor" };
const GRID_STROKE = "rgba(148, 163, 184, 0.25)";

export function DevStatsContentClient({ stats, gitlabStats, wakapiStats, wakapiSummaries }: DevStatsContentClientProps) {
  const t = useTranslations("DevStats");

  const languageData = (wakapiStats?.languages || [])
    .filter((l) => l.total_seconds > 0)
    .slice(0, 7)
    .map((l) => ({ name: l.name, hours: Math.round((l.total_seconds / 3600) * 10) / 10, percent: l.percent }));

  const editorData = (wakapiStats?.editors || [])
    .filter((e) => e.total_seconds > 0)
    .map((e) => ({ name: e.name, hours: Math.round((e.total_seconds / 3600) * 10) / 10, percent: e.percent }));

  const activityData = wakapiSummaries.map((d) => ({
    date: new Date(d.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    hours: Math.round((d.total_seconds / 3600) * 10) / 10,
  }));

  return (
    <div className="container mx-auto px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-12 drop-shadow flex items-center justify-center gap-3">
          <BarChartIcon className="w-10 h-10 text-primary" />
          {t("pageTitle")}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t("pageSubtitle")}
        </p>
      </motion.div>

      {/* GitHub Stats Overview */}
      {stats ? (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Github className="w-6 h-6" />
          {t("githubSectionTitle")}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("repositories")}
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
                  {t("totalStars")}
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
                  {t("totalForks")}
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
                  {t("commitsThisYear", { year: new Date().getFullYear() })}
                </p>
                <p className="text-2xl font-bold">
                  {stats?.stats.totalCommitsThisYear || 0}
                </p>
              </div>
              <Activity className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        </div>
      </motion.div>
      ) : (
        <div className="mb-12 text-center py-8 rounded-xl border border-dashed border-muted-foreground/30">
          <p className="text-muted-foreground">{t("errorPrefix")}</p>
        </div>
      )}

      {/* GitLab Stats Overview */}
      {gitlabStats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Gitlab className="w-6 h-6 text-orange-600" />
            {t("gitlabSectionTitle")}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t("repositories")}
                    </p>
                    <p className="text-2xl font-bold">
                      {gitlabStats.stats.totalRepos || 0}
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
                      {t("totalStars")}
                    </p>
                    <p className="text-2xl font-bold">
                      {gitlabStats.stats.totalStars || 0}
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
                      {t("totalForks")}
                    </p>
                    <p className="text-2xl font-bold">
                      {gitlabStats.stats.totalForks || 0}
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
                      {t("commitsThisYear", { year: new Date().getFullYear() })}
                    </p>
                    <p className="text-2xl font-bold">
                      {gitlabStats.stats.totalCommitsThisYear || 0}
                    </p>
                  </div>
                  <Activity className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}

      {/* Wakapi Stats */}
      {wakapiStats ? (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="space-y-12 mb-12"
      >
        {/* Language Percentage */}
        {languageData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                {t("languagePercentage")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={languageData} layout="vertical" margin={{ left: 16, right: 24 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} horizontal={false} />
                    <XAxis type="number" unit="h" tick={AXIS_STYLE} />
                    <YAxis type="category" dataKey="name" width={110} tick={AXIS_STYLE} />
                    <Tooltip
                      formatter={(value: number, _name, item) => [`${value}h (${item.payload.percent}%)`, t("languagePercentage")]}
                      contentStyle={{ borderRadius: 8 }}
                    />
                    <Bar dataKey="hours" radius={[0, 6, 6, 0]}>
                      {languageData.map((_, index) => (
                        <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Coding Activity */}
        {activityData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                {t("codingActivity")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityData} margin={{ left: 8, right: 24, top: 8 }}>
                    <defs>
                      <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
                    <XAxis dataKey="date" tick={AXIS_STYLE} interval="preserveStartEnd" />
                    <YAxis unit="h" tick={AXIS_STYLE} />
                    <Tooltip formatter={(value: number) => [`${value}h`, t("codingActivity")]} contentStyle={{ borderRadius: 8 }} />
                    <Area type="monotone" dataKey="hours" stroke="#2563eb" strokeWidth={2} fill="url(#activityGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Editors */}
        {editorData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="w-5 h-5" />
                {t("editors")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={editorData} layout="vertical" margin={{ left: 16, right: 24 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} horizontal={false} />
                    <XAxis type="number" unit="h" tick={AXIS_STYLE} />
                    <YAxis type="category" dataKey="name" width={110} tick={AXIS_STYLE} />
                    <Tooltip
                      formatter={(value: number, _name, item) => [`${value}h (${item.payload.percent}%)`, t("editors")]}
                      contentStyle={{ borderRadius: 8 }}
                    />
                    <Bar dataKey="hours" radius={[0, 6, 6, 0]}>
                      {editorData.map((_, index) => (
                        <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
      ) : (
        <div className="mb-12 text-center py-8 rounded-xl border border-dashed border-muted-foreground/30">
          <p className="text-muted-foreground">{t("wakapiUnavailable")}</p>
        </div>
      )}

      {/* Floating GitHub Profile Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="fixed bottom-8 right-8 z-50"
      >
        <a
          href="https://github.com/AsKing07"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center gap-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-6 py-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
        >
          {/* GitHub Icon */}
          <Github className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />

          {/* Text (hidden on mobile, visible on hover/desktop) */}
          <span className="hidden md:block font-semibold whitespace-nowrap group-hover:text-blue-400 dark:group-hover:text-blue-600 transition-colors duration-300">
            {t("visitGithub")}
          </span>

          {/* External Link Icon */}
          <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Tooltip for mobile */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-sm rounded-lg opacity-0 md:hidden group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
            {t("visitGithub")}
            <div className="absolute top-full right-4 border-4 border-transparent border-t-gray-800 dark:border-t-gray-200"></div>
          </div>

          {/* Pulse animation ring */}
          <div className="absolute inset-0 rounded-full bg-gray-900 dark:bg-gray-100 animate-ping opacity-20"></div>
          <div className="absolute inset-0 rounded-full bg-gray-900 dark:bg-gray-100 animate-pulse opacity-10"></div>
        </a>
      </motion.div>

      {/* Floating GitLab Profile Button */}
      {gitlabStats && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="fixed bottom-28 right-8 z-50"
        >
          <a
            href={gitlabStats.profile.web_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center gap-3 bg-orange-600 text-white px-6 py-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
          >
            <Gitlab className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
            <span className="hidden md:block font-semibold whitespace-nowrap transition-colors duration-300">
              {t("visitGitlab")}
            </span>
            <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-sm rounded-lg opacity-0 md:hidden group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
              {t("visitGitlab")}
              <div className="absolute top-full right-4 border-4 border-transparent border-t-gray-800 dark:border-t-gray-200"></div>
            </div>
          </a>
        </motion.div>
      )}
    </div>
  );
}
