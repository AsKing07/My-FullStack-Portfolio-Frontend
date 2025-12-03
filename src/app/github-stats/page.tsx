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
  Monitor,
  TrendingUp,
  Github,
  ExternalLink,
} from "lucide-react";
import { useGitHub } from "@/hooks/useGithub";
import { LoadingSpinner } from "@/components/ui/loading_spinner";


export default function GitHubStatsPage() {
  const { fetchStats,   stats, loading, error } = useGitHub();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchStats("AsKing07");
       
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching GitHub data:", error);
      }
    };

    fetchData();
  }, [fetchStats]);

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
           An error has occurred
          </h2>
          <p className="text-sm text-red-600 dark:text-red-200 text-center">
            Error loading statistics&nbsp;:<br />
            <span className="font-mono break-all">{error}</span>
          </p>
          <button
            onClick={() => globalThis.location.reload()}
            className="mt-2 px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition cursor-pointer"
          >
            Try again
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
            Development statistics
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Overview of my development activity and open source contributions
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

        {/* Wakatime Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-12 mb-12"
        >
          {/* Language Percentage */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                Language percentage over the last year
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-100 flex items-center justify-center">
                <iframe
                  src="https://wakatime.com/share/@asking007/34ba19f4-dfbe-4949-8c52-b81a61482f84.svg"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  className="rounded-lg"
                  title="Language percentage over the last year"
                />
              </div>
            </CardContent>
          </Card>

          {/* Coding Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
               Personal development activity last 30 days
              </CardTitle>
            </CardHeader>
           <CardContent>
              <div className="w-full h-100  flex items-center justify-center">
                <iframe
                  src="https://wakatime.com/share/@asking007/185b1ad0-6b4b-4d22-b19f-29ff474684ed.svg"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  className="rounded-lg"
                  title="Coding activity last 30 days"
                />
              </div>
            </CardContent>
          </Card>

          {/* Editors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="w-5 h-5" />
                Editors used in the last year
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-80 flex items-center justify-center">
                <iframe
                  src="https://wakatime.com/share/@asking007/ed887c56-b8da-4e9c-976e-fed3e5465d34.svg"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  className="rounded-lg"
                  title="Editors used in the last year"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

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
              Visit my GitHub
            </span>
            
            {/* External Link Icon */}
            <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Tooltip for mobile */}
            <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-sm rounded-lg opacity-0 md:hidden group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
              Visit my GitHub
              <div className="absolute top-full right-4 border-4 border-transparent border-t-gray-800 dark:border-t-gray-200"></div>
            </div>
            
            {/* Pulse animation ring */}
            <div className="absolute inset-0 rounded-full bg-gray-900 dark:bg-gray-100 animate-ping opacity-20"></div>
            <div className="absolute inset-0 rounded-full bg-gray-900 dark:bg-gray-100 animate-pulse opacity-10"></div>
          </a>
        </motion.div>
      </div>
    </div>
  );
}
