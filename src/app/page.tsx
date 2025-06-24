"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Download, GraduationCap, Briefcase, BookOpen, AlertTriangle, WorkflowIcon } from "lucide-react";
import { Button } from "@/components/ui/button_component";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card_component";
import { useExperiences } from "@/hooks/useExperience";
import { useEducations } from "@/hooks/useEducations";
import { useProjects } from "@/hooks/useProjects";
import { useUser } from "@/hooks/useUser";
import { LoadingSpinner } from "@/components/ui/loading_spinner";
import { Badge } from "@/components/ui/badge_component";
import { useToast } from "@/hooks/useToast";
import { useBlog } from "@/hooks/useBlogPost";

export default function HomePage() {
  const { experiences, loading: loadingExp, error: errorExp } = useExperiences();
  const { educations, loading: loadingEdu, error: errorEdu } = useEducations();
  const { projects, loading: loadingProj, error: errorProj } = useProjects();
  const { user, loading: loadingUser, error: errorUser } = useUser();
   const{ posts, loading: loadingPost, error: errorPost } = useBlog();

  const {toast} = useToast();

  const isLoading = loadingExp || loadingEdu || loadingProj || loadingUser;
  const error = errorExp || errorEdu || errorProj || errorUser;



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
          <span className="text-5xl mb-2" role="img" aria-label="Triste">
            😢
          </span>
          <h2 className="text-lg font-semibold text-red-700 dark:text-red-300">
            Une erreur est survenue
          </h2>
          <p className="text-sm text-red-600 dark:text-red-200 text-center">
            Erreur lors du chargement des données du portfolio&nbsp;:<br />
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
    <div className="flex flex-col">
      {/* Hero / Présentation rapide */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-950">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {user?.name || "Charbel SONON"}
            </h1>
            <p className="text-lg text-muted-foreground">
              {user?.bio ||
                "Développeur full stack passionné par React, Next.js, Node.js et TypeScript. J’aime créer des applications web modernes, performantes et accessibles."}
            </p>
            <div className="flex gap-4">
              <Button asChild>
                <Link href="/about">
                  Mieux me connaître
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild onClick={()=>{
                toast.info("Téléchargement du CV en cours...");
                const resumeUrl = user?.resumeUrl;
                if (resumeUrl) {
                  //download CV
                  const link = document.createElement("a");
                  link.href = resumeUrl;
                  link.download = `CV_${user?.name || "Charbel_SONON"}.pdf`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  toast.success("Téléchargement du CV terminé !");
               
                }
              }} variant="outline" className="cursor-pointer">
                <span>
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger CV
                </span>
                 
              
              </Button>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="aspect-square w-48 relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600">
        
        {
          user?.avatarUrl?(
               <Image
                src={user?.avatarUrl}
                alt="Photo de profil"
                fill
                className="object-cover"
                priority
              />
            
          ) :
        <div
          className="hero__avatar"
          style={{
            fontSize: "120px",
            textAlign: "center",
            background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))",
            borderRadius: "50%",
            width: "200px",
            height: "200px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          👨‍💻
        </div>
        }
           
            </div>
          </div>
        </div>
      </section>

      {/* Aperçu Expériences */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <Briefcase className="w-7 h-7 text-blue-600" />
              Expériences récentes
            </h2>
            <Button variant="ghost" asChild>
              <Link href="/experience">
                Voir tout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {((Array.isArray(experiences) && experiences.length === 0)
              ? [null, null, null]
              : (Array.isArray(experiences) ? experiences.slice(0, 3) : [null, null, null])
            ).map((exp, i) =>
              exp ? (
                <Card key={exp.id}>
                  <CardHeader>
                    <CardTitle>{exp.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-muted-foreground text-sm mb-2">
                      {exp.company} — {exp.location}
                    </div>
                    <div className="text-xs text-gray-500 mb-2">
                      {(exp.startDate instanceof Date ? exp.startDate.toLocaleDateString() : exp.startDate)} - {(exp.endDate instanceof Date ? exp.endDate.toLocaleDateString() : exp.endDate || "Aujourd'hui")}
                    </div>
                    <div className="line-clamp-3">{exp.description}</div>
                  </CardContent>
                </Card>
              ) : (
                <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
              )
            )}
          </div>
        </div>
      </section>

      {/* Aperçu Formations */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <GraduationCap className="w-7 h-7 text-purple-600" />
              Formations
            </h2>
            <Button variant="ghost" asChild>
              <Link href="/education">
                Voir tout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(Array.isArray(educations) && educations.length === 0
              ? [null, null, null]
              : Array.isArray(educations) ? educations.slice(0, 3) : [null, null, null]
            ).map((edu, i) =>
              edu ? (
                <Card key={edu.id}>
                  <CardHeader>
                    <CardTitle>{edu.degree}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-muted-foreground text-sm mb-2">{edu.school}</div>
                    <div className="text-xs text-gray-500 mb-2">
                      {edu.startDate instanceof Date ? edu.startDate.toLocaleDateString() : edu.startDate} - {edu.endDate instanceof Date ? edu.endDate.toLocaleDateString() : edu.endDate || "Aujourd'hui"}
                    </div>
                    <div className="line-clamp-3">{edu.description}</div>
                  </CardContent>
                </Card>
              ) : (
                <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
              )
            )}
          </div>
        </div>
      </section>

      {/* Aperçu Projets */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold flex items-center gap-2">
             <WorkflowIcon className="w-7 h-7 text-yellow-300" />
              Projets récents
            </h2>
            <Button variant="ghost" asChild>
              <Link href="/projects">
                Voir tout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(Array.isArray(projects) && projects.length === 0
              ? [null, null, null]
              : Array.isArray(projects) ? projects.slice(0, 3) : [null, null, null]
            ).map((proj, i) =>
              proj ? (
                <Card key={proj.id}>
                  <CardHeader>
                    <CardTitle>{proj.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(Array.isArray(proj.technologies)
                        ? proj.technologies
                        : typeof proj.technologies === "string" && proj.technologies
                        ? proj.technologies.split(",")
                        : []
                      ).map((tech: string, idx: number) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tech.trim()}
                        
                        </Badge>
           
                      ))}
                    </div>
                    <div className="line-clamp-3">{proj.description}</div>
                    <Button variant="link" size="sm" asChild>
                      <Link href={`/projects/${proj.slug}`}>
                        Voir le projet
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
              )
            )}
          </div>
        </div>
      </section>

      {/*Apperçu blog*/}
                  <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-bold flex items-center gap-2">
                                <BookOpen className="w-7 h-7 text-green-600" />
                                Blog
                            </h2>
                            <Button variant="ghost" asChild>
                                <Link href="/blog">
                                    Voir tout
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {(Array.isArray(posts) && posts.length === 0
                                ? [null, null, null]
                                : Array.isArray(posts) ? posts.slice(0, 2) : [null, null, null]
                            ).map((post, i) =>
                                post ? (
                                    <Card key={post.id}>
                                        <CardHeader>
                                            <CardTitle>{post.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-muted-foreground text-sm mb-2">
                                                Publié le {new Date(post.publishedAt).toLocaleDateString('fr-FR')}
                                            </div>
                                            <div className="line-clamp-3">{post.excerpt}</div>
                                            <Button variant="link" size="sm" asChild>
                                                <Link href={`/blog/${post.slug}`}>
                                                    Lire l'article
                                                    <ArrowRight className="ml-1 h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                                )
                            )}
                        </div>
                    </div>
                  </section>

      {/* Lien vers la page de contact */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Envie de collaborer ?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            N’hésitez pas à me contacter pour discuter d’un projet, d’une mission ou simplement échanger !
          </p>
          <Button asChild size="lg">
            <Link href="/contact">
              Me contacter
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}