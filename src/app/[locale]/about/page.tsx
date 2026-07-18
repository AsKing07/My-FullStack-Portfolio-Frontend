import { getTranslations } from 'next-intl/server';
import { ErrorRetryCard } from '@/components/ui/error_retry_card';
import { UserService } from '@/services/user.service';
import { User } from '@/types/User/User';
import { AboutContentClient } from './AboutContentClient';

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'About' });
  const tCommon = await getTranslations({ locale, namespace: 'Common' });

  let user: User | null = null;
  let error: string | null = null;

  try {
    const res = await UserService.getUserPublic();
    user = res.data.items;
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
      <AboutContentClient user={user} />
    </div>
  );
}
