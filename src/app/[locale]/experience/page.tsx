import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge_component";
import { Briefcase, MapPin, Calendar, Terminal, LightbulbIcon } from "lucide-react";
import { ResumeDownloadButton } from "@/components/ui/resume_download_button";
import { ErrorRetryCard } from "@/components/ui/error_retry_card";
import { cn, formatDateShort, pickLocalized } from "@/lib/utils";
import { ExperienceService } from "@/services/experience.service";
import { SkillsService } from "@/services/skills.service";
import { CategoryService } from "@/services/category.service";
import { UserService } from "@/services/user.service";
import { Experience } from "@/types/Experience/Experience";
import { Skill } from "@/types/Skill/Skill";
import { Category } from "@/types/Category/Category";
import { User } from "@/types/User/User";

const typeColors: Record<string, string> = {
  FULLTIME: "bg-blue-600",
  PARTTIME: "bg-green-600",
  FREELANCE: "bg-purple-600",
  INTERNSHIP: "bg-yellow-500",
  CONTRACT: "bg-pink-600",
  APPRENTICESHIP: "bg-orange-600",
  VOLUNTEER: "bg-teal-600",
};

interface ExperiencePageProps {
  params: Promise<{ locale: string }>;
}

export default async function ExperiencePage({ params }: ExperiencePageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Experience" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });
  const softSkills = t.raw("softSkillsList") as string[];

  let experiences: Experience[] = [];
  let skills: Skill[] = [];
  let categories: Category[] = [];
  let user: User | null = null;
  let error: string | null = null;

  try {
    const [expRes, skillsRes, catRes, userRes] = await Promise.all([
      ExperienceService.getExperiences({ limit: 1000 }),
      SkillsService.getSkills({ limit: 100 }),
      CategoryService.getCategories(),
      UserService.getUserPublic(),
    ]);
    experiences = expRes.data.items;
    skills = skillsRes.data.items;
    categories = catRes.data.items;
    user = userRes.data.items;
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

  const skillsByCategory = categories.reduce<Record<string, Skill[]>>((acc, cat) => {
    acc[cat.name] = skills.filter((s) => s.category?.id === cat.id);
    return acc;
  }, {});

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-950">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-400/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-in slide-in-from-top duration-1000">
            <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900 rounded-full mb-6">
              <Briefcase className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
              {t("heroTitle")}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
              {t("heroSubtitle")}
            </p>

            <div className="flex justify-center">
              <ResumeDownloadButton
                resumeUrl={user?.resumeUrl}
                resumeUrlFr={user?.resumeUrlFr}
                name={user?.name}
                label={t("downloadResume")}
                size="lg"
                variant="default"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 px-8 py-4 text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-20">
        {/* Timeline Section with enhanced design */}
        <section className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
              {t("timelineTitle")}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t("timelineSubtitle")}
            </p>
          </div>

          {/* Enhanced Timeline */}
          <div className="relative max-w-6xl mx-auto">
            {/* Timeline line - responsive positioning */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400 transform md:-translate-x-1/2"></div>

            <div className="space-y-12 md:space-y-16">
              {(Array.isArray(experiences) ? experiences : [])
                .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
                .map((exp, i) => (
                  <div key={exp.id} className={`relative flex items-center ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col md:gap-8 lg:gap-16 cursor-pointer`}>
                    {/* Timeline dot - responsive positioning */}
                    <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 -translate-y-1/2 top-8 md:top-1/2 z-10">
                      <div className={cn(
                        "w-8 h-8 md:w-16 md:h-16 rounded-full flex items-center justify-center ring-2 md:ring-4 ring-white dark:ring-slate-900 shadow-xl transition-transform hover:scale-110",
                        typeColors[exp.type] || "bg-gray-400"
                      )}>
                        <Briefcase className="w-3 h-3 md:w-6 md:h-6 text-white" />
                      </div>
                    </div>

                    {/* Content Card - responsive layout */}
                    <div className={`w-full md:w-5/12 pl-12 md:pl-0 pr-4 md:pr-0 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                      <div className="group">
                        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-xl p-4 md:p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-white/50 dark:border-slate-700/50">
                          {/* Header - responsive layout */}
                          <div className={`flex flex-col ${i % 2 === 0 ? 'md:items-end' : 'md:items-start'} gap-3 mb-4 md:mb-6`}>
                            <div className={`flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3 ${i % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
                              <h3 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {pickLocalized(exp.title, exp.titleFr, locale)}
                              </h3>
                              <Badge className={cn("text-white text-xs md:text-sm px-2 md:px-3 py-1 self-start", typeColors[exp.type])}>
                                {t(`employmentTypes.${exp.type}` as Parameters<typeof t>[0])}
                              </Badge>
                            </div>

                            <div className="text-blue-600 dark:text-blue-400 font-semibold text-base md:text-lg">
                              {exp.company}
                            </div>

                            <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 text-gray-500 dark:text-gray-400 text-sm">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span className="font-mono text-xs md:text-sm">
                                  {formatDateShort(exp.startDate)} - {exp.current || !exp.endDate ? t("present") : formatDateShort(exp.endDate)}
                                </span>
                              </div>
                              {exp.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  <span className="text-xs md:text-sm">{exp.location}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Description - responsive text */}
                          <div className="text-gray-700 dark:text-gray-300 mb-4 md:mb-6 leading-relaxed text-sm md:text-base">
                            {pickLocalized(exp.description, exp.descriptionFr, locale)}
                          </div>

                          {/* Technologies - responsive layout */}
                          {exp.technologies && (
                            <div className={`flex flex-wrap gap-1 md:gap-2 ${i % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                              {exp.technologies.split(",").map((tech) => (
                                <Badge
                                  key={tech.trim()}
                                  variant="outline"
                                  className="text-xs bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors px-2 py-1"
                                >
                                  {tech.trim()}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Spacer for the other side - only visible on desktop */}
                    <div className="hidden md:block w-5/12"></div>
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* Technical Skills Section with enhanced design */}
        <section className="mb-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-2 bg-purple-100 dark:bg-purple-900 rounded-full mb-4">
              <Terminal className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {t("skillsTitle")}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t("skillsSubtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {categories.map((cat) =>
              skillsByCategory[cat.name] && skillsByCategory[cat.name].length > 0 ? (
                <div
                  key={cat.id}
                  className="group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-purple-900/30 rounded-3xl transform group-hover:scale-105 transition-transform duration-300"></div>
                  <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/50 dark:border-slate-700/50 hover:shadow-2xl transition-all duration-300">
                    {/* Category Header */}
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50">
                        {cat.icon && (
                          <i
                            className={cn(cat.icon, "text-2xl")}
                            style={{ color: cat.color || "#8B5CF6" }}
                          />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {cat.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {t("skillsCount", { count: skillsByCategory[cat.name].length })}
                        </p>
                      </div>
                    </div>

                    {/* Skills Grid */}
                    <div className="flex flex-wrap gap-3">
                      {skillsByCategory[cat.name].map((skill) => (
                        <div
                          key={skill.id}
                          className="relative group/skill"
                        >
                          <Badge
                            variant="outline"
                            className={cn(
                              "relative text-sm px-4 py-2 border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/50 text-purple-900 dark:text-purple-200",
                              "hover:bg-purple-100 dark:hover:bg-purple-900 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-200",
                              "cursor-pointer transform hover:scale-105"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              {skill.icon && <i className={cn(skill.icon, "text-sm")} />}
                              <span className="font-medium">{skill.name}</span>
                              <div className={cn(
                                "w-2 h-2 rounded-full ml-1",
                                skill.level === "BEGINNER" && "bg-yellow-400",
                                skill.level === "INTERMEDIATE" && "bg-orange-400",
                                skill.level === "ADVANCED" && "bg-green-400",
                                skill.level === "EXPERT" && "bg-blue-400"
                              )} />
                            </div>
                          </Badge>

                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg opacity-0 group-hover/skill:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                            {skill.level && t(`levels.${skill.level}` as Parameters<typeof t>[0])}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null
            )}
          </div>
        </section>

        {/* Soft Skills Section with modern design */}
        <section className="mb-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-2 bg-yellow-100 dark:bg-yellow-900 rounded-full mb-4">
              <LightbulbIcon className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              {t("softSkillsTitle")}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t("softSkillsSubtitle")}
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {softSkills.map((skill, index) => (
                <div
                  key={skill}
                  className="group relative overflow-hidden"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100 dark:from-yellow-900/30 dark:via-orange-900/30 dark:to-red-900/30 rounded-2xl transform group-hover:scale-105 transition-transform duration-300"></div>
                  <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-white/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                        <LightbulbIcon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-center text-gray-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                      {skill}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
