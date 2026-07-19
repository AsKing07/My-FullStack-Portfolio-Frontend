import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';

interface SEOMetadata {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'article';
  locale?: string;
  path?: string;
  noindex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
  tags?: string[];
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://charbelsnn.com';

function localizedUrl(locale: string, path: string): string {
  return locale === routing.defaultLocale ? `${baseUrl}${path}` : `${baseUrl}/${locale}${path}`;
}

export function generateSEOMetadata({
  title = 'Charbel SONON | Portfolio - Full Stack Developer',
  description = 'Portfolio of Charbel SONON, full stack developer specialized in Angular, React, Next.js, Node.js, Java and TypeScript.',
  keywords = [],
  ogImage,
  ogType = 'website',
  locale = 'en',
  path = '',
  noindex = false,
  publishedTime,
  modifiedTime,
  authors = ['Charbel SONON'],
  section,
  tags = [],
}: SEOMetadata): Metadata {
  const defaultKeywords = [
    'portfolio', 'developer', 'full stack', 'react', 'nextjs', 'nodejs',
    'typescript', 'charbel sonon', 'web development', 'javascript', 'angular', 'java', 'spring', 'html', 'css', 'tailwind',
    'mongodb', 'mysql', 'rest api', 'responsive websites', 'web applications', 'freelance', 'developer france', 'developer benin'
  ];

  const allKeywords = [...defaultKeywords, ...keywords];
  const imageUrl = ogImage || `${baseUrl}/logo.png`;
  const canonical = localizedUrl(locale, path);

  const metadata: Metadata = {
    title: { absolute: title },
    description,
    keywords: allKeywords,
    authors: authors.map(name => ({ name })),
    creator: 'Charbel SONON',
    alternates: {
      canonical,
      languages: {
        en: localizedUrl('en', path),
        fr: localizedUrl('fr', path),
        'x-default': localizedUrl(routing.defaultLocale, path),
      },
    },
    ...(noindex && { robots: { index: false, follow: false } }),

    openGraph: {
      type: ogType,
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
      url: canonical,
      title,
      description,
      siteName: 'Portfolio - Charbel SONON',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(authors.length > 0 && { authors }),
      ...(section && { section }),
      ...(tags.length > 0 && { tags }),
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@charbel_sonon',
      images: [imageUrl],
    },

    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };

  return metadata;
}

type SEOPageKey = 'about' | 'experience' | 'education' | 'certifications' | 'projects' | 'blog' | 'contact' | 'githubStats';

const pagePaths: Record<SEOPageKey, string> = {
  about: '/about',
  experience: '/experience',
  education: '/education',
  certifications: '/certifications',
  projects: '/projects',
  blog: '/blog',
  contact: '/contact',
  githubStats: '/github-stats',
};

export async function getLocalizedPageMetadata(locale: string, page: SEOPageKey): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'SEO' });

  return generateSEOMetadata({
    title: t(`${page}.title`),
    description: t(`${page}.description`),
    keywords: t.raw(`${page}.keywords`) as string[],
    locale,
    path: pagePaths[page],
  });
}

export async function generateProjectMetadata(locale: string, project: {
  title: string;
  description: string;
  technologies?: string[];
  slug: string;
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'SEO' });

  return generateSEOMetadata({
    title: `${project.title} - ${t('projectSuffix')}`,
    description: project.description,
    keywords: [...(project.technologies || []), 'project', 'development'],
    locale,
    path: `/projects/${project.slug}`,
  });
}

export async function generateBlogPostMetadata(locale: string, post: {
  title: string;
  excerpt: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  tags?: string[];
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'SEO' });

  return generateSEOMetadata({
    title: `${post.title} - ${t('blogSuffix')}`,
    description: post.excerpt,
    keywords: [...(post.tags || []), 'article', 'blog', 'tutorial'],
    ogType: 'article',
    locale,
    path: `/blog/${post.slug}`,
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    section: 'Technology',
    tags: post.tags,
  });
}
