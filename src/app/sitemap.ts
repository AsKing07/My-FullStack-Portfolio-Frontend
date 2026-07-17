import { MetadataRoute } from 'next';
import { ProjectsService } from '@/services/projects.service';
import { BlogService } from '@/services/blog.service';
import { routing } from '@/i18n/routing';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://charbelsnn.com';

function localizedUrl(locale: string, path: string): string {
  return locale === routing.defaultLocale ? `${baseUrl}${path}` : `${baseUrl}/${locale}${path}`;
}

function languageAlternates(path: string) {
  return {
    languages: Object.fromEntries([
      ...routing.locales.map((locale) => [locale, localizedUrl(locale, path)]),
      ['x-default', localizedUrl(routing.defaultLocale, path)],
    ]),
  };
}

function localizedEntry(
  path: string,
  lastModified: Date,
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'],
  priority: number
): MetadataRoute.Sitemap {
  return routing.locales.map((locale) => ({
    url: localizedUrl(locale, path),
    lastModified,
    changeFrequency,
    priority,
    alternates: languageAlternates(path),
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPaths: Array<{ path: string; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number }> = [
    { path: '', changeFrequency: 'weekly', priority: 1 },
    { path: '/about', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/experience', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/education', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/projects', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/blog', changeFrequency: 'daily', priority: 0.9 },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/github-stats', changeFrequency: 'weekly', priority: 0.6 },
  ];

  const staticRoutes = staticPaths.flatMap(({ path, changeFrequency, priority }) =>
    localizedEntry(path, now, changeFrequency, priority)
  );

  const [projectRoutes, postRoutes] = await Promise.all([
    ProjectsService.getProjects({ limit: 1000 })
      .then(({ data }) =>
        data.items.flatMap((project) =>
          localizedEntry(`/projects/${project.slug}`, new Date(project.updatedAt), 'monthly', 0.7)
        )
      )
      .catch(() => []),
    BlogService.getBlogPosts({ limit: 1000 })
      .then(({ data }) =>
        data.items.flatMap((post) =>
          localizedEntry(`/blog/${post.slug}`, new Date(post.updatedAt), 'monthly', 0.8)
        )
      )
      .catch(() => []),
  ]);

  return [
    ...staticRoutes,
    ...projectRoutes,
    ...postRoutes,
  ];
}
