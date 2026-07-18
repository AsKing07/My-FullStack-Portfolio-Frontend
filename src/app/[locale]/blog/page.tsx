import { getTranslations } from 'next-intl/server';
import { ErrorRetryCard } from '@/components/ui/error_retry_card';
import { BlogService } from '@/services/blog.service';
import { BlogPost } from '@/types/BlogPost/BlogPost';
import { BlogListClient } from './BlogListClient';

interface BlogPageProps {
  params: Promise<{ locale: string }>;
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'BlogList' });
  const tCommon = await getTranslations({ locale, namespace: 'Common' });

  let posts: BlogPost[] = [];
  let error: string | null = null;

  try {
    const res = await BlogService.getBlogPosts({ limit: 1000 });
    posts = res.data.items;
  } catch (err) {
    error = err instanceof Error ? err.message : 'Unknown error';
  }

  if (error) {
    return (
      <ErrorRetryCard
        title={tCommon('errorTitle')}
        message={t('errorPrefix')}
        error={error}
        retryLabel={tCommon('tryAgain')}
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <BlogListClient posts={posts} />
    </div>
  );
}
