import { Metadata } from 'next';
import { getLocalizedPageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getLocalizedPageMetadata(locale, 'blog');
}

export default function BlogLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return <>{children}</>;
}
