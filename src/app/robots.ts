import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://charbelsnn.com';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/dashboard/*',
          '/api/auth/*',
          '/_next/',
          '/build/',
        ],
      },
      {
        userAgent: 'GoogleBot',
        allow: '/',
        disallow: [
          '/dashboard',
          '/dashboard/*',
          '/api/auth/*',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}