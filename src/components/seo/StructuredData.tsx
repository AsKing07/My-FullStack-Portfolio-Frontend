import Script from 'next/script';

interface PersonSchemaProps {
  name: string;
  jobTitle: string;
  bio: string;
  email?: string;
  url: string;
  image?: string;
  location?: string;
  sameAs?: string[];
}

export function PersonSchema({
  name,
  jobTitle,
  bio,
  email,
  url,
  image,
  location,
  sameAs = []
}: PersonSchemaProps) {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    jobTitle,
    description: bio,
    url,
    ...(email && { email }),
    ...(image && { image }),
    ...(location && { address: { '@type': 'PostalAddress', addressLocality: location } }),
    ...(sameAs.length > 0 && { sameAs }),
  };

  return (
    <Script
      id="person-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
    />
  );
}

interface WebsiteSchemaProps {
  name: string;
  url: string;
  description: string;
  author: string;
}

export function WebsiteSchema({ name, url, description, author }: WebsiteSchemaProps) {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    description,
    author: {
      '@type': 'Person',
      name: author,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
    />
  );
}

interface BlogPostSchemaProps {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  author: string;
  image?: string;
}

export function BlogPostSchema({
  title,
  description,
  url,
  datePublished,
  dateModified,
  author,
  image,
}: BlogPostSchemaProps) {
  const blogPostSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    url,
    datePublished,
    ...(dateModified && { dateModified }),
    author: {
      '@type': 'Person',
      name: author,
    },
    ...(image && { image }),
    publisher: {
      '@type': 'Person',
      name: author,
    },
  };

  return (
    <Script
      id="blog-post-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostSchema) }}
    />
  );
}

interface ProjectSchemaProps {
  name: string;
  description: string;
  url: string;
  author: string;
  programmingLanguage?: string[];
  dateCreated?: string;
  dateModified?: string;
}

export function ProjectSchema({
  name,
  description,
  url,
  author,
  programmingLanguage = [],
  dateCreated,
  dateModified,
}: ProjectSchemaProps) {
  const projectSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    url,
    author: {
      '@type': 'Person',
      name: author,
    },
    ...(programmingLanguage.length > 0 && { programmingLanguage }),
    ...(dateCreated && { dateCreated }),
    ...(dateModified && { dateModified }),
  };

  return (
    <Script
      id="project-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
    />
  );
}

interface BreadcrumbSchemaProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
    />
  );
}