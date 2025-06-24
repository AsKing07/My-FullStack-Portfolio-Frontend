"use client";

import { useExperiences } from "@/hooks/useExperience";
import { useSkills } from "@/hooks/useSkills";
import { useCategory } from "@/hooks/useCategory";
import { useUser } from "@/hooks/useUser";
import { Badge } from "@/components/ui/badge_component";
import { Button } from "@/components/ui/button_component";
import { Download, Briefcase, MapPin, Calendar, Loader2, CogIcon, Code2, Terminal, LightbulbIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const typeColors: Record<string, string> = {
  FULLTIME: "bg-blue-600",
  PARTTIME: "bg-green-600",
  FREELANCE: "bg-purple-600",
  INTERNSHIP: "bg-yellow-500",
  CONTRACT: "bg-pink-600",
};

const hardSkills = [
  "Gestion du temps",
  "Travail en équipe",
  "Résolution de problèmes",
  "Communication",
  "Adaptabilité",
  "Créativité",
  "Leadership",
];

export default function ExperiencePage() {
  const { experiences, loading: loadingExp } = useExperiences();
  const { skills, loading: loadingSkills } = useSkills();
  const { categories } = useCategory();
  const { user } = useUser();

  // Regroupe les skills par catégorie
  const skillsByCategory = (Array.isArray(categories) ? categories : []).reduce<Record<string, typeof skills>>((acc, cat) => {
    acc[cat.name] = skills.filter((s) => s.category?.id === cat.id);
    return acc;
  }, {});

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent drop-shadow">
            Expérience professionnelle
          </h1>
          {user?.resumeUrl && (
            <Button
              asChild
              size="lg"
              className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg"
            >
              <Link href={user.resumeUrl} target="_blank" rel="noopener noreferrer">
                <Download className="w-5 h-5" />
                Télécharger mon CV
              </Link>
            </Button>
          )}
        </div>

        {/* Timeline Expériences */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-blue-600" />
            Parcours professionnel
          </h2>
          {loadingExp ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
            </div>
          ) : (
           <ol className="relative border-l-4 border-blue-200 dark:border-blue-800 ml-8">
              {(Array.isArray(experiences) ? experiences : [])
                .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
                .map((exp, i) => (
                   <li key={exp.id} className="mb-12 pl-8 relative group">
                    {/* Timeline dot */}
                    <span
                      className={cn(
          "absolute left-0 top-0 -translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full ring-4 ring-white dark:ring-slate-900 shadow-lg",
          typeColors[exp.type] || "bg-gray-400"
        )}
        style={{ marginTop: "-8px" }}>
                      <Briefcase className="w-4 h-4 text-white" />
                    </span>
                    {/* Card */}
                      <div className="bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-xl p-8 transition group-hover:shadow-2xl border border-blue-100 dark:border-blue-900">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-semibold">{exp.title}</h3>
                          <Badge className={cn("ml-2", typeColors[exp.type], "text-white")}>
                            {exp.type === "FULLTIME" && "CDI"}
                            {exp.type === "PARTTIME" && "Temps partiel"}
                            {exp.type === "FREELANCE" && "Freelance"}
                            {exp.type === "INTERNSHIP" && "Stage"}
                            {exp.type === "CONTRACT" && "Contrat"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {new Date(exp.startDate).toLocaleDateString("fr-FR", { year: "numeric", month: "short" })} 
                          {" - "}
                          {exp.current || !exp.endDate
                            ? "Aujourd'hui"
                            : new Date(exp.endDate).toLocaleDateString("fr-FR", { year: "numeric", month: "short" })}
                          {exp.location && (
                            <>
                              <span className="mx-2">•</span>
                              <MapPin className="w-4 h-4" />
                              {exp.location}
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-blue-600 dark:text-blue-400 font-medium mb-2">{exp.company}</div>
                      <div className="text-muted-foreground mb-2">{exp.description}</div>
                      {exp.technologies && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {exp.technologies.split(",").map((tech) => (
                            <Badge key={tech.trim()} variant="secondary" className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200">
                              {tech.trim()}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
            </ol>
          )}
        </section>

        {/* Compétences techniques */}
        <section className="mb-20">
               <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            {/* <Briefcase className="w-6 h-6 text-blue-600" /> */}
            <Terminal className="w-6 h-6 text-blue-600" />
           Compétences techniques
          </h2>
          {/* <h2 className="text-2xl font-bold mb-8">Compétences techniques</h2> */}
          {loadingSkills ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mx-18">
              {categories.map((cat) =>
                skillsByCategory[cat.name] && skillsByCategory[cat.name].length > 0 ? (
                  <div
                    key={cat.id}
                    className="bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-xl p-6 border border-blue-100 dark:border-blue-900 hover:shadow-2xl transition"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      {cat.icon && (
                        <i
                          className={cn(cat.icon, "text-2xl")}
                          style={{ color: cat.color || undefined }}
                        />
                      )}
                      <span className="font-semibold text-lg">{cat.name}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skillsByCategory[cat.name].map((skill) => (
                        <Badge
                          key={skill.id}
                          variant="outline"
                          className={cn(
                            "text-sm border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-200",
                            "hover:bg-blue-100 dark:hover:bg-blue-900 transition"
                          )}
                        >
                          
                            {skill.icon && <i className={cn(skill.icon, "mr-1")} />} 
                          {skill.name}
                          <span className="ml-1 text-xs text-muted-foreground">
                            {skill.level === "BEGINNER" && "Débutant"}
                            {skill.level === "INTERMEDIATE" && "Intermédiaire"}
                            {skill.level === "ADVANCED" && "Avancé"}
                            {skill.level === "EXPERT" && "Expert"}
                          </span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : null
              )}
            </div>
          )}
        </section>

        {/* Hard Skills */}
        <section className="mb-20">
             
         <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <LightbulbIcon className="w-6 h-6 text-blue-600" />
            Hard Skills

          </h2>
          <div className="flex flex-wrap gap-4 mx-18">
            {hardSkills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="text-base px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 text-blue-900 dark:text-blue-100 border-0 shadow"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}