'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProjects } from '@/hooks/useProjects';
import { Project } from '@/types/Project/Project';
import { Badge } from '@/components/ui/badge_component';
import { Button } from '@/components/ui/button_component';
import { Card, CardContent } from '@/components/ui/card_component';
import { LoadingSpinner } from '@/components/ui/loading_spinner';
import { 
  ExternalLink, 
  Github, 
  Figma, 
  Calendar, 
  ArrowLeft, 
  Clock,
  User,
  Tag,
  Image as ImageIcon,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDate, cn } from '@/lib/utils';

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-400",
  PUBLISHED: "bg-green-600",
  ARCHIVED: "bg-yellow-600",
  IN_PROGRESS: "bg-blue-600",
  PLANNED: "bg-purple-600",
  COMPLETED: "bg-emerald-600",
};

const statusLabels: Record<string, string> = {
  DRAFT: "Brouillon",
  PUBLISHED: "Publié",
  ARCHIVED: "Archivé",
  IN_PROGRESS: "En cours",
  PLANNED: "Planifié",
  COMPLETED: "Terminé",
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getProjectBySlug, loading, error } = useProjects();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    async function fetchProject() {
      if (params.slug) {
        const projectData = await getProjectBySlug(params.slug as string);
        setProject(projectData);
      }
    }
    fetchProject();
  }, [params.slug, getProjectBySlug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="flex flex-col items-center gap-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 px-8 py-8 rounded-xl shadow-lg max-w-md">
          <AlertTriangle className="w-10 h-10 text-red-500 mb-2" />
          <h2 className="text-lg font-semibold text-red-700 dark:text-red-300">
            Error loading
          </h2>
          <p className="text-sm text-red-600 dark:text-red-200 text-center">
            Unable to load project details :<br />
            <span className="font-mono break-all">{error}</span>
          </p>
          <Button
            onClick={() => router.back()}
            className="mt-2"
            variant="outline"
          >
           Back
          </Button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-4">
            Project not found
          </h2>
          <Button onClick={() => router.push('/projects')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
           Back to projects
          </Button>
        </div>
      </div>
    );
  }

  const galleryImages = project.gallery ? project.gallery.split(',').map(url => url.trim()) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-8 mt-8 z-999">
      <div className="container mx-auto px-4">
        {/* Header avec navigation */}
        <div className="flex items-center justify-between mb-8">
            
        <Button onClick={() => router.back()} variant="outline" size="sm" className="z-10">
            <ArrowLeft className="w-4 h-4 mr-2" />
           Back
        </Button>

        <div className="flex gap-3">
            {project.liveUrl && (
                <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="default" className="z-10">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        See the project
                    </Button>
                </Link>
            )}
            {project.githubUrl && (
                <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline" className="z-10">
                        <Github className="w-4 h-4 mr-2" />
                        GitHub
                    </Button>
                </Link>
            )}
            {project.figmaUrl && (
                <Link href={project.figmaUrl} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline" className="z-10">
                        <Figma className="w-4 h-4 mr-2" />
                        Figma
                    </Button>
                </Link>
            )}
        </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* En-tête du projet */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {project.title}
                    </h1>
                    {project.shortDesc && (
                      <p className="text-lg text-gray-600 dark:text-gray-300">
                        {project.shortDesc}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={cn("text-white", statusColors[project.status])}>
                      {statusLabels[project.status]}
                    </Badge>
                    {project.featured && (
                      <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                        Featured
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Métadonnées */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {(project.startDate || project.endDate) && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {project.startDate && formatDate(project.startDate)}
                      {project.endDate && (
                        <>
                          {" - "}
                          {formatDate(project.endDate)}
                        </>
                      )}
                    </div>
                  )}
                  
                  {project.category && (
                    <div className="flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      {project.category.name}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                   Update on {formatDate(project.updatedAt)}
                  </div>
                </div>

                {/* Technologies */}
                {project.technologies && (
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Technologies used</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.split(",").map((tech) => (
                        <Badge 
                          key={tech.trim()} 
                          variant="secondary" 
                          className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200"
                        >
                          {tech.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Image principale */}
            {project.image && (
              <Card>
                <CardContent className="p-0">
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={800}
                    height={400}
                    className="w-full h-64 md:h-96 object-cover rounded-lg"
                  />
                </CardContent>
              </Card>
            )}

            {/* Description complète */}
            {project.description && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Project description</h2>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="whitespace-pre-wrap">{project.description}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contenu détaillé */}
            {project.content && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Technical details</h2>
                  <div className="prose dark:prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: project.content }} />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Galerie d'images */}
            {galleryImages.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Galery ({galleryImages.length})
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {galleryImages.map((imageUrl, index) => (
                      <Image
                        key={index}
                        src={imageUrl}
                        alt={`${project.title} - Image ${index + 1}`}
                        width={300}
                        height={200}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Informations complémentaires */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Informations</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Status:</span>
                    <Badge className={cn("text-white text-xs", statusColors[project.status])}>
                      {statusLabels[project.status]}
                    </Badge>
                  </div>
                  
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Created on:</span>
                    <span>{formatDate(project.createdAt)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Updated on:</span>
                    <span>{formatDate(project.updatedAt)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions rapides */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Actions</h3>
                <div className="space-y-2">
                  <Link href="/projects" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      All projects
                    </Button>
                  </Link>
                  
                  {project.liveUrl && (
                    <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="block">
                      <Button variant="default" className="w-full justify-start">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View online
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}