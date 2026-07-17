import { MetadataRoute } from 'next';
import { ProjectsService } from '@/services/projects.service';
import { BlogService } from '@/services/blog.service';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://charbelsnn.com';
  
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/experience`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/education`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/github-stats`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
  ];

  const [projectRoutes, postRoutes] = await Promise.all([
    ProjectsService.getProjects({ limit: 1000 })
      .then(({ data }) =>
        data.items.map((project) => ({
          url: `${baseUrl}/projects/${project.slug}`,
          lastModified: new Date(project.updatedAt),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        }))
      )
      .catch(() => []),
    BlogService.getBlogPosts({ limit: 1000 })
      .then(({ data }) =>
        data.items.map((post) => ({
          url: `${baseUrl}/blog/${post.slug}`,
          lastModified: new Date(post.updatedAt),
          changeFrequency: 'monthly' as const,
          priority: 0.8,
        }))
      )
      .catch(() => []),
  ]);

  return [
    ...staticRoutes,
    ...projectRoutes,
    ...postRoutes,
  ];
}