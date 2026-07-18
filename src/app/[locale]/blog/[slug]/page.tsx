import { getTranslations } from 'next-intl/server';
import { Calendar, Clock, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge_component';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card_component';
import { Link } from '@/i18n/navigation';
import { formatDate, pickLocalized } from '@/lib/utils';
import Image from 'next/image';
import { BlogPostSchema } from '@/components/seo/StructuredData';
import { BlogService } from '@/services/blog.service';

interface BlogPostPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'BlogDetail' });

  const post = await BlogService.getBlogPostBySlug(slug)
    .then((res) => res.data.items)
    .catch(() => null);

  if (!post) {
    return (
      <div className="flex-1 w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="flex flex-col items-center gap-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 px-8 py-8 rounded-xl shadow-lg max-w-md">
          <h2 className="text-lg font-semibold text-red-700 dark:text-red-300">
            {t('notFound')}
          </h2>
          <p className="text-sm text-red-600 dark:text-red-200 text-center">
            {t('errorPrefix')}
          </p>
          <Link
            href="/blog"
            className="mt-2 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition cursor-pointer"
          >
            {t('backToBlog')}
          </Link>
        </div>
      </div>
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://charbelsnn.com';

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12">
      <BlogPostSchema
        title={pickLocalized(post.title, post.titleFr, locale)}
        description={pickLocalized(post.excerpt, post.excerptFr, locale) || pickLocalized(post.metaDesc, post.metaDescFr, locale)}
        url={`${baseUrl}/blog/${post.slug}`}
        datePublished={post.publishedAt.toString()}
        dateModified={post.updatedAt?.toString()}
        author={post.user?.name || 'Charbel SONON'}
        image={post.image}
      />
      <div className="container mx-auto px-4 max-w-3xl">
        <Card>
          {post.image && (
            <div className="relative h-64 w-full overflow-hidden rounded-t-2xl">
              <Image
                layout='fill'
                src={post.image}
                alt={pickLocalized(post.title, post.titleFr, locale)}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <CardHeader>
            <div className="flex flex-wrap gap-2 mb-2">
              {(post.tags || []).map((tag: string) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            <CardTitle className="text-3xl font-bold mb-2">{pickLocalized(post.title, post.titleFr, locale)}</CardTitle>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-2">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(post.publishedAt)}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {t('minRead', { minutes: post.readingTime })}
              </div>
              {post.user && (
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {post.user.name}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div
              className="prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: pickLocalized(post.content, post.contentFr, locale) }}
            />
          </CardContent>
        </Card>
        <div className="mt-8">
          <Link
            href="/blog"
            className="inline-block px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            ← {t('backToBlog')}
          </Link>
        </div>
      </div>
    </div>
  );
}
