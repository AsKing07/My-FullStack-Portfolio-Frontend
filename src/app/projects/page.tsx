"use client";

import { useProjects } from "@/hooks/useProjects";
import { useCategory } from "@/hooks/useCategory";
import { Badge } from "@/components/ui/badge_component";
import { Loader2, ExternalLink, Github, Figma, Calendar, Layers } from "lucide-react";
import Link from "next/link";
import { cn, formatDateShort } from "@/lib/utils";
import { useState } from "react";
import Image from "next/image";

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-400",
  PUBLISHED: "bg-green-600",
  ARCHIVED: "bg-yellow-600",
};

export default function ProjectsPage() {
  const { projects, loading } = useProjects();
  const { categories } = useCategory();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Récupère toutes les catégories présentes dans les projets (sécurité si jamais la catégorie n'est pas dans la liste globale)
  const projectCategories = Array.from(
    new Set(
      (projects || [])
        .filter((p) => p.category)
        .map((p) => p.category?.name)
    )
  );

  // Filtrage des projets
  const filteredProjects = selectedCategory
    ? projects.filter((p) => p.category?.name === selectedCategory)
    : projects;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-12 drop-shadow flex justify-center items-center gap-3">
          <Layers className="w-10 h-10 text-blue-600" />
          Projets réalisés
        </h1>

        {/* Filtres par catégorie */}
        <div className="flex flex-wrap gap-3 mb-10">
          <Badge
            variant={selectedCategory === null ? "default" : "outline"}
            className={cn(
              "cursor-pointer px-4 py-2 text-base",
              selectedCategory === null
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                : "hover:bg-blue-100 dark:hover:bg-blue-900"
            )}
            onClick={() => setSelectedCategory(null)}
          >
            Tous
          </Badge>
          {(categories.length > 0 ? categories : projectCategories).map((cat: any) => (
            <Badge
              key={typeof cat === "string" ? cat : cat.id}
              variant={selectedCategory === (typeof cat === "string" ? cat : cat.name) ? "default" : "outline"}
              className={cn(
                "cursor-pointer px-4 py-2 text-base",
                selectedCategory === (typeof cat === "string" ? cat : cat.name)
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  : "hover:bg-blue-100 dark:hover:bg-blue-900"
              )}
              onClick={() => setSelectedCategory(typeof cat === "string" ? cat : cat.name)}
            >
              {typeof cat === "string" ? cat : cat.name}
            </Badge>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {(Array.isArray(filteredProjects) ? filteredProjects : [])
              .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))
              .map((project) => (
                <div
                  key={project.id}
                  className="bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-xl border border-blue-100 dark:border-blue-900 hover:shadow-2xl transition flex flex-col"
                >
                  {project.image && (
                    <Image
                      width={48}
                      height={48}
                      src={project.image}
                      alt={project.title}
                      className="rounded-t-2xl w-full h-48 object-cover border-b border-blue-100 dark:border-blue-900"
                    />
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-xl font-semibold">{project.title}</h2>
                      <Badge className={cn("ml-2", statusColors[project.status], "text-white")}>
                        {project.status === "DRAFT" && "Brouillon"}
                        {project.status === "PUBLISHED" && "Publié"}
                        {project.status === "ARCHIVED" && "Archivé"}
                      </Badge>
                      {project.featured && (
                        <span className="ml-2 px-2 py-1 rounded bg-gradient-to-r from-blue-600 to-purple-600 text-xs text-white font-bold shadow">
                          À la une
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Calendar className="w-4 h-4" />
                      {project.startDate &&
                        formatDateShort(project.startDate)}
                      {project.endDate && (
                        <>
                          {" - "}
                          {formatDateShort(project.endDate)}
                        </>
                      )}
                      {project.category && (
                        <>
                          <span className="mx-2">•</span>
                          <span className="font-medium">{project.category.name}</span>
                        </>
                      )}
                    </div>
                    <div className="text-blue-600 dark:text-blue-400 font-medium mb-2">
                      {project.shortDesc || project.description?.slice(0, 120) + "..."}
                    </div>
                    {project.technologies && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.split(",").map((tech) => (
                          <Badge key={tech.trim()} variant="secondary" className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200">
                            {tech.trim()}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-3 mt-auto">
                      {project.liveUrl && (
                        <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                          <span title="Voir le projet en ligne">
                            <ExternalLink className="w-5 h-5 text-blue-600 hover:text-blue-800 transition" />
                          </span>
                        </Link>
                      )}
                              {project.githubUrl && (
                        <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                          <span title="Voir sur GitHub">
                            <Github className="w-5 h-5 text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white transition" />
                          </span>
                        </Link>
                      )}
                      {project.figmaUrl && (
                        <Link href={project.figmaUrl} target="_blank" rel="noopener noreferrer">
                          <span title="Voir sur Figma">
                            <Figma className="w-5 h-5 text-pink-500 hover:text-pink-700 transition" />
                          </span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}