import { Metadata } from 'next';
import { ProjectsService } from '@/services/projects.service';
import { generateProjectMetadata } from '@/lib/seo';

interface ProjectLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProjectLayoutProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const response = await ProjectsService.getProjectBySlug(slug);
    const project = response.data.items;

    if (!project) {
      return {
        title: 'Projet non trouvé - Charbel SONON',
        description: 'Le projet demandé n\'existe pas ou n\'est plus disponible.',
      };
    }

    return generateProjectMetadata({
      title: project.title,
      description: project.shortDesc || project.description || '',
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