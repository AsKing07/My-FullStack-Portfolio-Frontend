import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ProjectsService } from '@/services/projects.service';
import { Project } from '@/types/Project/Project';
import { Badge } from '@/components/ui/badge_component';
import { Button } from '@/components/ui/button_component';
import { Card, CardContent } from '@/components/ui/card_component';
import { BackButton } from '@/components/ui/back_button';
import { ErrorRetryCard } from '@/components/ui/error_retry_card';
import {
  ExternalLink,
  Github,
  Figma,
  Calendar,
  ArrowLeft,
  Clock,
  Tag,
  Image as ImageIcon,
} from 'lucide-react';
import Image from 'next/image';
import { formatDate, cn, pickLocalized } from '@/lib/utils';
import { ProjectSchema } from '@/components/seo/StructuredData';

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-400",
  PUBLISHED: "bg-green-600",
  ARCHIVED: "bg-yellow-600",
  IN_PROGRESS: "bg-blue-600",
  PLANNED: "bg-purple-600",
  COMPLETED: "bg-emerald-600",
};

interface ProjectDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'ProjectDetail' });
  const tCommon = await getTranslations({ locale, namespace: 'Common' });

  let project: Project | null = null;
  let error: string | null = null;

  try {
    const response = await ProjectsService.getProjectBySlug(slug);
    project = response.data.items;
  } catch (err) {
    error = err instanceof Error ? err.message : 'Unknown error';
  }

  if (error) {
    return (
      <ErrorRetryCard
        title={t('errorLoading')}
        message={t('errorPrefix')}
        error={error}
        retryLabel={t('back')}
      />
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-4">
            {t('notFound')}
          </h2>
          <Link href="/projects">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('allProjects')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const galleryImages = project.gallery ? project.gallery.split(',').map(url => url.trim()) : [];
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://charbelsnn.com';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-8 mt-8 z-999">
      <ProjectSchema
        name={pickLocalized(project.title, project.titleFr, locale)}
        description={pickLocalized(project.shortDesc, project.shortDescFr, locale) || pickLocalized(project.description, project.descriptionFr, locale)}
        url={`${baseUrl}/projects/${project.slug}`}
        author="Charbel SONON"
        programmingLanguage={project.technologies ? project.technologies.split(',').map(t => t.trim()) : []}
        dateCreated={project.createdAt?.toString()}
        dateModified={project.updatedAt?.toString()}
      />
      <div className="container mx-auto px-4">
        {/* Header avec navigation */}
        <div className="flex items-center justify-between mb-8">

        <BackButton label={t('back')} className="z-10" />

        <div className="flex gap-3">
            {project.liveUrl && (
                <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="default" className="z-10">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        {t('viewProject')}
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
                      {pickLocalized(project.title, project.titleFr, locale)}
                    </h1>
                    {project.shortDesc && (
                      <p className="text-lg text-gray-600 dark:text-gray-300">
                        {pickLocalized(project.shortDesc, project.shortDescFr, locale)}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={cn("text-white", statusColors[project.status])}>
                      {t(`status.${project.status}` as Parameters<typeof t>[0])}
                    </Badge>
                    {project.featured && (
                      <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                        {t('featured')}
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
                   {t('updatedOn')} {formatDate(project.updatedAt)}
                  </div>
                </div>

                {/* Technologies */}
                {project.technologies && (
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">{t('technologiesUsed')}</h3>
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
                    alt={pickLocalized(project.title, project.titleFr, locale)}
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
                  <h2 className="text-xl font-semibold mb-4">{t('projectDescription')}</h2>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="whitespace-pre-wrap">{pickLocalized(project.description, project.descriptionFr, locale)}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contenu détaillé */}
            {project.content && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">{t('technicalDetails')}</h2>
                  <div className="prose dark:prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: pickLocalized(project.content, project.contentFr, locale) }} />
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
                    {t('gallery', { count: galleryImages.length })}
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {galleryImages.map((imageUrl, index) => (
                      <Image
                        key={index}
                        src={imageUrl}
                        alt={`${pickLocalized(project.title, project.titleFr, locale)} - Image ${index + 1}`}
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
                <h3 className="font-semibold mb-4">{t('informations')}</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t('statusLabel')}</span>
                    <Badge className={cn("text-white text-xs", statusColors[project.status])}>
                      {t(`status.${project.status}` as Parameters<typeof t>[0])}
                    </Badge>
                  </div>


                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t('createdOn')}</span>
                    <span>{formatDate(project.createdAt)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t('updatedOn')}</span>
                    <span>{formatDate(project.updatedAt)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions rapides */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">{t('actions')}</h3>
                <div className="space-y-2">
                  <Link href="/projects" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      {t('allProjects')}
                    </Button>
                  </Link>

                  {project.liveUrl && (
                    <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="block">
                      <Button variant="default" className="w-full justify-start">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        {t('viewOnline')}
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
