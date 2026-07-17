import { Metadata } from 'next';
import { ProjectsService } from '@/services/projects.service';
import { generateProjectMetadata } from '@/lib/seo';
import { pickLocalized } from '@/lib/utils';

interface ProjectLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: ProjectLayoutProps): Promise<Metadata> {
  try {
    const { slug, locale } = await params;
    const response = await ProjectsService.getProjectBySlug(slug);
    const project = response.data.items;

    if (!project) {
      return {
        title: 'Project not found - Charbel SONON',
        description: 'The requested project does not exist or is no longer available.',
      };
    }

    return generateProjectMetadata(locale, {
      title: pickLocalized(project.title, project.titleFr, locale),
      description: pickLocalized(project.shortDesc, project.shortDescFr, locale) || pickLocalized(project.description, project.descriptionFr, locale),
      technologies: project.technologies?.split(',') || [],
      slug: project.slug,
    });
  } catch (error) {
    console.error('Erreur lors du chargement du projet pour les métadonnées:', error);
    return {
      title: 'Erreur de chargement - Charbel SONON',
      description: 'Une erreur s\'est produite lors du chargement du projet.',
    };
  }
}

export default function ProjectLayout({ children }: { readonly children: React.ReactNode }) {
  return <>{children}</>;
}