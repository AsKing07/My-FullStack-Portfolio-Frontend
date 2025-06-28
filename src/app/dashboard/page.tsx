"use client";
import { useProjects } from "@/hooks/useProjects";
import { useBlog } from "@/hooks/useBlogPost";
import { useExperiences } from "@/hooks/useExperience";
import { useEducations } from "@/hooks/useEducations";
import { useUser } from "@/hooks/useUser";
import { Loader2, BookOpen, Briefcase, GraduationCap, Mail, FileText, User, Folder, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card_component";
import { Badge } from "@/components/ui/badge_component";
import Image from "next/image";

export default function DashboardHome() {
  const { projects, loading: loadingProj, error: errorProj } = useProjects();
  const { posts, loading: loadingBlog, error: errorBlog } = useBlog();
  const { experiences, loading: loadingExp, error: errorExp } = useExperiences();
  const { educations, loading: loadingEdu, error: errorEdu } = useEducations();
  const { user, loading: loadingUser, error: errorUser } = useUser();

  const isLoading = loadingProj || loadingBlog || loadingExp || loadingEdu || loadingUser;
  const error = errorProj || errorBlog || errorExp || errorEdu || errorUser;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
      </div>
    );
  }
  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <main className="accueil_dashboard px-2 md:px-8 py-8 w-full">
      <div className="dashboard-title mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">Bienvenue sur votre dashboard</h1>
        <p className="text-muted-foreground mt-2">Vue d’ensemble de votre activité et de vos contenus.</p>
      </div>

      {/* Statistiques principales */}
      <section className="stats-section mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={<Folder className="text-blue-600" />} label="Projets" value={projects?.length ?? 0} link="/dashboard/projects" />
          <StatCard icon={<FileText className="text-purple-600" />} label="Articles" value={posts?.length ?? 0} link="/dashboard/blog" />
          <StatCard icon={<Briefcase className="text-green-600" />} label="Expériences" value={experiences?.length ?? 0} link="/dashboard/experiences" />
          <StatCard icon={<GraduationCap className="text-yellow-600" />} label="Formations" value={educations?.length ?? 0} link="/dashboard/education" />
        </div>
      </section>

      {/* Derniers contenus */}
      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Derniers projets */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Folder className="w-5 h-5" />
                Derniers projets
              </CardTitle>
            </CardHeader>
            <CardContent>
              {projects && projects.length > 0 ? (
                <ul className="divide-y divide-slate-200 dark:divide-slate-800">
                  {projects.slice(0, 4).map((proj) => (
                    <li key={proj.id} className="py-2 flex items-center justify-between">
                      <span className="truncate">{proj.title}</span>
                      <Link href={`/dashboard/projects/${proj.id}`} className="text-blue-600 hover:underline flex items-center gap-1 text-sm">
                        Voir <ArrowRight className="w-4 h-4" />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-sm">Aucun projet.</p>
              )}
            </CardContent>
          </Card>
          {/* Derniers articles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Derniers articles
              </CardTitle>
            </CardHeader>
            <CardContent>
              {posts && posts.length > 0 ? (
                <ul className="divide-y divide-slate-200 dark:divide-slate-800">
                  {posts.slice(0, 4).map((post) => (
                    <li key={post.id} className="py-2 flex items-center justify-between">
                      <span className="truncate">{post.title}</span>
                      <Link href={`/dashboard/blog/${post.slug}`} className="text-blue-600 hover:underline flex items-center gap-1 text-sm">
                        Voir <ArrowRight className="w-4 h-4" />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-sm">Aucun article.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Profil rapide */}
      <section className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profil rapide
            </CardTitle>
          </CardHeader>
          <CardContent>
            {user ? (
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                  {user.avatarUrl ? (
                    <Image
                    width={140}
                    height={140}
                    
                    src={user.avatarUrl} alt={user.name} className="w-14 h-14 object-cover rounded-full" />
                  ) : (
                    <span className="text-2xl font-bold text-blue-700 dark:text-blue-300">{user.name.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <div className="font-semibold">{user.name}</div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary">{user.role || "Utilisateur"}</Badge>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">Aucune info utilisateur.</p>
            )}
          </CardContent>
        </Card>
      </section>

      <div className="dashboard-retour-site mt-8 flex justify-center">
        <Link href="/" className="text-blue-600 hover:underline font-semibold">ACCÉDER AU SITE</Link>
      </div>
    </main>
  );
}

// Composant carte statistique
function StatCard({ icon, label, value, link }: { icon: React.ReactNode, label: string, value: number, link: string }) {
  return (
    <Link href={link} className="block group">
      <div className="stat-card card bg-white dark:bg-slate-900 rounded-lg shadow p-6 flex items-center gap-4 transition hover:shadow-lg hover:bg-blue-50/40 dark:hover:bg-blue-900/10">
        <div className="stat-icon text-3xl">{icon}</div>
        <div className="stat-info">
          <h3 className="text-2xl font-bold group-hover:text-blue-700 dark:group-hover:text-blue-400 transition">{value ?? "--"}</h3>
          <p className="text-muted-foreground">{label}</p>
        </div>
      </div>
    </Link>
  );
}