"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Download,
  GraduationCap,
  Briefcase,
  BookOpen,
  WorkflowIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button_component";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card_component";
import { useExperiences } from "@/hooks/useExperience";
import { useEducations } from "@/hooks/useEducations";
import { useProjects } from "@/hooks/useProjects";
import { useUser } from "@/hooks/useUser";
import { LoadingSpinner } from "@/components/ui/loading_spinner";
import { Badge } from "@/components/ui/badge_component";
import { useToast } from "@/hooks/useToast";
import { useBlog } from "@/hooks/useBlogPost";
import { formatDate } from "@/lib/utils";
import { PersonSchema, WebsiteSchema } from "@/components/seo/StructuredData";

export default function HomePage() {
  const {
    experiences,
    loading: loadingExp,
    error: errorExp,
  } = useExperiences();
  const { educations, loading: loadingEdu, error: errorEdu } = useEducations();
  const { projects, loading: loadingProj, error: errorProj } = useProjects();
  const { user, loading: loadingUser, error: errorUser } = useUser();
  const { posts, loading: loadingPost, error: errorPost } = useBlog();

  const { toast } = useToast();

  const isLoading =
    loadingExp || loadingEdu || loadingProj || loadingUser || loadingPost;
  const error = errorExp || errorEdu || errorProj || errorUser || errorPost;

  // Fonction utilitaire pour normaliser les technologies en array
  const getTechArray = (
    technologies: string | string[] | undefined
  ): string[] => {
    if (Array.isArray(technologies)) {
      return technologies;
    }
    if (typeof technologies === "string" && technologies) {
      return technologies.split(",");
    }
    return [];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="flex flex-col items-center gap-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 px-8 py-8 rounded-xl shadow-lg max-w-md">
          <span className="text-5xl mb-2" role="img" aria-label="Sad face">
            😢
          </span>
          <h2 className="text-lg font-semibold text-red-700 dark:text-red-300">
            An error has occurred
          </h2>
          <p className="text-sm text-red-600 dark:text-red-200 text-center">
            Error loading portfolio data :<br />
            <span className="font-mono break-all">{error}</span>
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition cursor-pointer"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col w-full">
        {/* Hero Section with enhanced animations */}
        <section className="relative isolate overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-950 py-24 sm:py-32">
          {/* Background decorative elements */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <svg
              className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-200 dark:stroke-gray-800 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
              aria-hidden="true"
            >
              <defs>
                <pattern
                  id="e813992c-7d03-4cc4-a2bd-151760b470a0"
                  width={200}
                  height={200}
                  x="50%"
                  y={-1}
                  patternUnits="userSpaceOnUse"
                >
                  <path d="M100 200V.5M.5 .5H200" fill="none" />
                </pattern>
              </defs>
              <rect
                width="100%"
                height="100%"
                strokeWidth={0}
                fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)"
              />
            </svg>
          </div>

          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 space-y-8 animate-in slide-in-from-left duration-1000">
              {/* Animated greeting */}
              <div className="space-y-2">
                <p className="text-lg text-blue-600 dark:text-blue-400 font-medium tracking-wide">
                  Hello, I'm
                </p>
                <h1 className="text-5xl md:text-7xl font-black tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient bg-300% leading-tight">
                  {user?.name || "Charbel SONON"}
                </h1>
                <div className="text-2xl md:text-3xl font-bold text-gray-700 dark:text-gray-300">
                  <span className="typing-animation">Full Stack Developer</span>
                </div>
              </div>

              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
                {user?.bio ||
                  "Passionate about creating modern, efficient and accessible web applications. I transform ideas into digital experiences that make a difference."}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  <Link href="/about">
                    <span className="flex items-center gap-2">
                      Discover my story
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 dark:border-purple-800 dark:hover:bg-purple-900 transform hover:-translate-y-1 transition-all duration-300 shadow-lg"
                  onClick={() => {
                    toast.info("CV download in progress...");
                    const resumeUrl = user?.resumeUrl;
                    if (resumeUrl) {
                      const link = document.createElement("a");
                      link.href = resumeUrl;
                      link.download = `CV_${user?.name || "Charbel_SONON"}.pdf`;
                      document.body.appendChild(link);
                      link.click();
                      link.remove();
                      toast.success("Resume download completed !");
                    }
                  }}
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download Resume
                </Button>
              </div>

              {/* Social indicators or stats */}
              <div className="flex items-center gap-6 pt-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Available for opportunities</span>
                </div>
              </div>
            </div>

            <div className="flex-1 flex justify-center animate-in slide-in-from-right duration-1000 delay-300">
              <div className="relative group">
                <div className="aspect-square w-72 sm:w-80 relative overflow-hidden rounded-3xl shadow-2xl ring-4 ring-white dark:ring-gray-800 transform hover:scale-105 transition-all duration-500">
                  {user?.avatarUrl ? (
                    <Image
                      src={user.avatarUrl}
                      alt="Profile picture"
                      className="object-cover w-full h-full"
                      width={320}
                      height={320}
                      priority
                    />
                  ) : (
                    <div className="text-8xl flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      👨‍💻
                    </div>
                  )}
                </div>
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce delay-1000"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-pink-400 rounded-full animate-bounce delay-500"></div>
                <div className="absolute top-1/2 -right-8 w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Experience Section with modern cards */}
        <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center p-2 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
                <Briefcase className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                Professional Journey
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Discover my professional experiences and the skills I've
                developed
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
              {(Array.isArray(experiences) && experiences.length === 0
                ? [null, null, null]
                : Array.isArray(experiences)
                ? experiences.slice(0, 3)
                : [null, null, null]
              ).map((exp, i) =>
                exp ? (
                  <Card
                    key={exp.id}
                    className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm"
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="group-hover:text-blue-600 transition-colors duration-300">
                        {exp.title}
                      </CardTitle>
                      <div className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                        {exp.company}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400 text-sm">
                        📍 {exp.location}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-3 font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {exp.startDate
                          ? formatDate(exp.startDate)
                          : exp.startDate}{" "}
                        →{" "}
                        {   exp.current || !exp.endDate ? "Present" : formatDate(exp.endDate)}
                      </div>
                      <div className="line-clamp-3 text-gray-700 dark:text-gray-300">
                        {exp.description}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card key={`exp-skeleton-${i}`} className="h-48">
                    <div className="p-6 space-y-4">
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-2/3"></div>
                      <div className="space-y-2">
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-5/6"></div>
                      </div>
                    </div>
                  </Card>
                )
              )}
            </div>

            <div className="text-center">
              <Button
                variant="outline"
                asChild
                size="lg"
                className="border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-900 transform hover:-translate-y-1 transition-all duration-300"
              >
                <Link href="/experience">
                  View All Experiences
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Education Section with enhanced design */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center p-2 bg-purple-100 dark:bg-purple-900 rounded-full mb-4">
                <GraduationCap className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Education & Learning
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                My academic background and continuous learning journey
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
              {(Array.isArray(educations) && educations.length === 0
                ? [null, null, null]
                : Array.isArray(educations)
                ? educations.slice(0, 3)
                : [null, null, null]
              ).map((edu, i) =>
                edu ? (
                  <Card
                    key={edu.id}
                    className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-purple-900/30"
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="group-hover:text-purple-600 transition-colors duration-300">
                        {edu.degree}
                      </CardTitle>
                      <div className="text-purple-600 dark:text-purple-400 font-semibold text-sm">
                        🎓 {edu.school}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-3 font-mono bg-purple-100 dark:bg-purple-800/30 px-2 py-1 rounded">
                        {edu.startDate
                          ? formatDate(edu.startDate)
                          : edu.startDate}{" "}
                        →{" "}
                        {edu.endDate
                          ? formatDate(edu.endDate)
                          : edu.endDate ?? "Present"}
                      </div>
                      <div className="line-clamp-3 text-gray-700 dark:text-gray-300">
                        {edu.description}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card key={`edu-skeleton-${i}`} className="h-48">
                    <div className="p-6 space-y-4">
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-2/3"></div>
                      <div className="space-y-2">
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-5/6"></div>
                      </div>
                    </div>
                  </Card>
                )
              )}
            </div>

            <div className="text-center">
              <Button
                variant="outline"
                asChild
                size="lg"
                className="border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 dark:border-purple-800 dark:hover:bg-purple-900 transform hover:-translate-y-1 transition-all duration-300"
              >
                <Link href="/education">
                  View All Education
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Projects Section with modern design */}
        <section className="py-20 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-slate-800 dark:to-orange-950/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/50 dark:to-orange-900/50 rounded-full mb-4">
                <WorkflowIcon className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Featured Projects
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Discover the projects I've created with passion and dedication
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
              {(Array.isArray(projects) && projects.length === 0
                ? [null, null, null]
                : Array.isArray(projects)
                ? projects.slice(0, 3)
                : [null, null, null]
              ).map((proj, i) =>
                proj ? (
                  <Card
                    key={proj.id}
                    className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-orange-50 dark:from-slate-800 dark:to-orange-900/20 overflow-hidden"
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="group-hover:text-orange-600 transition-colors duration-300 flex items-start justify-between">
                        <span className="line-clamp-2">{proj.title}</span>
                        <div className="ml-2 p-1 rounded-full bg-orange-100 dark:bg-orange-900/50 group-hover:scale-110 transition-transform">
                          <WorkflowIcon className="w-4 h-4 text-orange-600" />
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {getTechArray(proj.technologies)
                          .slice(0, 3)
                          .map((tech: string, techIndex: number) => (
                            <Badge
                              key={`${proj.id}-tech-${techIndex}`}
                              variant="secondary"
                              className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800"
                            >
                              {tech.trim()}
                            </Badge>
                          ))}
                        {getTechArray(proj.technologies).length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{getTechArray(proj.technologies).length - 3} more
                          </Badge>
                        )}
                      </div>
                      <div className="line-clamp-3 text-gray-700 dark:text-gray-300">
                        {proj.description}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="group-hover:bg-orange-100 dark:group-hover:bg-orange-900/30 w-full justify-start p-0 h-auto text-orange-600 dark:text-orange-400"
                      >
                        <Link href={`/projects/${proj.slug}`}>
                          <span className="flex items-center gap-2 py-2">
                            Explore Project
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Card key={`proj-skeleton-${i}`} className="h-64">
                    <div className="p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse flex-1"></div>
                        <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse ml-2"></div>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                        <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-4/5"></div>
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-2/3"></div>
                      </div>
                    </div>
                  </Card>
                )
              )}
            </div>

            <div className="text-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <Link href="/projects">
                  View All Projects
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Blog Section with elegant design */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center p-2 bg-green-100 dark:bg-green-900 rounded-full mb-4">
                <BookOpen className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                Latest Insights
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Thoughts, tutorials, and insights from my development journey
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 mb-12 max-w-4xl mx-auto">
              {(() => {
                if (Array.isArray(posts) && posts.length === 0) {
                  return [null, null];
                } else if (Array.isArray(posts)) {
                  return posts.slice(0, 2);
                } else {
                  return [null, null];
                }
              })().map((post, i) =>
                post ? (
                  <Card
                    key={post.id}
                    className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-green-50 dark:from-slate-800 dark:to-green-900/20 overflow-hidden"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 mb-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="font-medium">
                          Published {formatDate(post.publishedAt)}
                        </span>
                      </div>
                      <CardTitle className="group-hover:text-green-600 transition-colors duration-300 line-clamp-2">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-4">
                      <div className="line-clamp-3 text-gray-700 dark:text-gray-300">
                        {post.excerpt}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="group-hover:bg-green-100 dark:group-hover:bg-green-900/30 w-full justify-start p-0 h-auto text-green-600 dark:text-green-400"
                      >
                        <Link href={`/blog/${post.slug}`}>
                          <span className="flex items-center gap-2 py-2">
                            Read Article
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Card key={`blog-skeleton`} className="h-56">
                    <div className="p-6 space-y-4">
                      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-1/3"></div>
                      <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                      <div className="space-y-2">
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-4/5"></div>
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-2/3"></div>
                      </div>
                    </div>
                  </Card>
                )
              )}
            </div>

            <div className="text-center">
              <Button
                variant="outline"
                asChild
                size="lg"
                className="border-2 border-green-200 hover:border-green-400 hover:bg-green-50 dark:border-green-800 dark:hover:bg-green-900 transform hover:-translate-y-1 transition-all duration-300"
              >
                <Link href="/blog">
                  View All Articles
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Call to Action Section with modern design */}
        <section className="py-24 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-4xl mx-auto space-y-8">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Ready to{" "}
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Collaborate</span> ?
              </h2>
              <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                Let's bring your ideas to life! I'm passionate about creating
                innovative solutions and would love to discuss your next
                project.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-gray-900 hover:bg-gray-100 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 px-8 py-4 text-lg font-semibold"
                >
                  <Link href="/contact">
                    <span className="flex items-center gap-3">
                      Let's Talk
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  </Link>
                </Button>

                <div className="text-blue-200 text-sm">
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    Usually responds within 24 hours
                  </span>
                </div>
              </div>

              {/* Stats or highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 max-w-3xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">60+</div>
                  <div className="text-blue-200 text-sm">
                    Projects Completed
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">15+</div>
                  <div className="text-blue-200 text-sm">Happy Clients</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">4+</div>
                  <div className="text-blue-200 text-sm">Years Experience</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Données structurées pour le SEO */}
      {user && (
        <>
          <PersonSchema
            name={user.name || "Charbel SONON"}
            jobTitle="Développeur Full Stack"
            bio={
              user.bio ||
              "Développeur full stack passionné par les technologies web modernes"
            }
            url={process.env.NEXT_PUBLIC_APP_URL || ""}
            image={user.avatarUrl}
            email={user.email}
            sameAs={[
              `${user.linkedin}`,
              `${user.twitter}`,
              `${user.github}`,
              `${user.twitter}`,
            ]}
          />
          <WebsiteSchema
            name="Portfolio - Charbel SONON"
            url={process.env.NEXT_PUBLIC_APP_URL || ""}
            description="Portfolio de Charbel SONON, développeur full stack"
            author={user.name || "Charbel SONON"}
          />
        </>
      )}
    </>
  );
}
