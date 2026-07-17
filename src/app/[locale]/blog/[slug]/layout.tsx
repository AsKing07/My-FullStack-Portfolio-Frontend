import { Metadata } from 'next';
import { BlogService } from '@/services/blog.service';
import { generateBlogPostMetadata } from '@/lib/seo';
import { pickLocalized } from '@/lib/utils';

interface BlogPostLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: BlogPostLayoutProps): Promise<Metadata> {
  try {
    const { slug, locale } = await params;
    const response = await BlogService.getBlogPostBySlug(slug);
    const post = response.data.items;

    if (!post) {
      return {
        title: 'Article not found - Charbel SONON',
        description: 'The requested article does not exist or is no longer available.',
      };
    }

    return generateBlogPostMetadata(locale, {
      title: pickLocalized(post.title, post.titleFr, locale),
      excerpt: pickLocalized(post.excerpt, post.excerptFr, locale) || pickLocalized(post.metaDesc, post.metaDescFr, locale),
      slug: post.slug,
      publishedAt: post.publishedAt.toString(),
      updatedAt: post.updatedAt?.toString(),
      tags: post.tags,
    });
  } catch (error) {
    console.error('Erreur lors du chargement de l\'article pour les métadonnées:', error);
    return {
      title: 'Erreur de chargement - Charbel SONON',
      description: 'Une erreur s\'est produite lors du chargement de l\'article.',
    };
  }
}

export default function BlogPostLayout({ children }: { readonly children: React.ReactNode }) {
  return <>{children}</>;
}
