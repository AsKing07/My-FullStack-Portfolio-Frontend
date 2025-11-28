import { Metadata } from 'next';

interface SEOMetadata {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'article';
  canonical?: string;
  noindex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
  tags?: string[];
}

export function generateSEOMetadata({
  title = 'Charbel SONON | Portfolio - Développeur Full Stack',
  description = 'Portfolio de Charbel SONON, développeur full stack spécialisé en Angular, React, Next.js, Node.js, Java, et TypeScript.',
  keywords = [],
  ogImage,
  ogType = 'website',
  canonical,
  noindex = false,
  publishedTime,
  modifiedTime,
  authors = ['Charbel SONON'],
  section,
  tags = [],
}: SEOMetadata): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://charbelsnn.com';
  
  const defaultKeywords = [
    'portfolio', 'développeur', 'full stack', 'react', 'nextjs', 'nodejs', 
    'typescript', 'charbel sonon', 'web development', 'javascript', 'angular', 'java', 'spring','html', 'css', 'tailwind',
    'mongodb', 'mysql', 'api rest', 'sites web responsives', 'applications web', 'freelance', 'développeur france', 'développeur bénin'
  ];
  
  const allKeywords = [...defaultKeywords, ...keywords];
  const imageUrl = ogImage || `${baseUrl}/logo.png`;

  const metadata: Metadata = {
    title,
    description,
    keywords: allKeywords,
    authors: authors.map(name => ({ name })),
    creator: 'Charbel SONON',
    ...(canonical && { alternates: { canonical } }),
    ...(noindex && { robots: { index: false, follow: false } }),
    
    openGraph: {
      type: ogType,
      locale: 'fr_FR',
      url: canonical || baseUrl,
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

// Métadonnées prédéfinies pour différentes pages
export const pageMetadata = {
  home: generateSEOMetadata({
    title: 'Charbel SONON | Portfolio - Développeur Full Stack',
    description: 'Découvrez le portfolio de Charbel SONON, développeur full stack passionné. Projets en Angular, React, Next.js, Node.js, Java, TypeScript et plein d\'autres technologies web modernes.',
    keywords: ['accueil', 'portfolio principal', 'développeur web', 'projets'],
  }),
  
  about: generateSEOMetadata({
    title: 'À propos - Charbel SONON | Développeur Full Stack',
    description: 'En savoir plus sur Charbel SONON, développeur full stack avec une expertise en technologies web modernes et une passion pour l\'innovation.',
    keywords: ['à propos', 'profil', 'compétences', 'parcours'],
  }),
  
  experience: generateSEOMetadata({
    title: 'Expérience Professionnelle - Charbel SONON',
    description: 'Découvrez l\'expérience professionnelle de Charbel SONON, son parcours, ses missions, projets et responsabilités en développement.',
    keywords: ['expérience', 'carrière', 'missions', 'projets professionnels'],
  }),
  
  education: generateSEOMetadata({
    title: 'Formation & Éducation - Charbel SONON',
    description: 'Parcours éducatif et formations de Charbel SONON en développement logiciel, web et technologies informatiques.',
    keywords: ['formation', 'éducation', 'diplômes', 'certifications'],
  }),
  
  projects: generateSEOMetadata({
    title: 'Projets - Charbel SONON | Portfolio',
    description: 'Explorez les projets réalisés par Charbel SONON : logiciels,applications web, APIs, sites responsives et solutions innovantes.',
    keywords: ['projets', 'réalisations', 'applications web', 'portfolio', 'logiciels'],
  }),
  
  blog: generateSEOMetadata({
    title: 'Blog - Charbel SONON | Articles Tech',
    description: 'Articles et tutoriels sur le développement web, les technologies modernes et les bonnes pratiques par Charbel SONON.',
    keywords: ['blog', 'articles', 'tutoriels', 'développement web', 'tech'],
  }),
  
  contact: generateSEOMetadata({
    title: 'Contact - Charbel SONON | Développeur Full Stack',
    description: 'Contactez Charbel SONON pour vos projets de développement web et logiciel, collaborations ou opportunités professionnelles.',
    keywords: ['contact', 'collaboration', 'freelance', 'mission'],
  }),
  
  githubStats: generateSEOMetadata({
    title: 'Statistiques - Charbel SONON',
    description: 'Consultez les statistiques de développement de Charbel SONON : contributions, projets open source et activité de développement.',
    keywords: ['github', 'statistiques', 'open source', 'contributions'],
  }),
};

export function generateProjectMetadata(project: {
  title: string;
  description: string;
  technologies?: string[];
  slug: string;
}) {
  return generateSEOMetadata({
    title: `${project.title} - Projet | Charbel SONON`,
    description: project.description,
    keywords: [...(project.technologies || []), 'projet', 'développement'],
    canonical: `${process.env.NEXT_PUBLIC_APP_URL}/projects/${project.slug}`,
  });
}

export function generateBlogPostMetadata(post: {
  title: string;
  excerpt: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  tags?: string[];
}) {
  return generateSEOMetadata({
    title: `${post.title} - Blog | Charbel SONON`,
    description: post.excerpt,
    keywords: [...(post.tags || []), 'article', 'blog', 'tutoriel'],
    ogType: 'article',
    canonical: `${process.env.NEXT_PUBLIC_APP_URL}/blog/${post.slug}`,
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    section: 'Technologie',
    tags: post.tags,
  });
}