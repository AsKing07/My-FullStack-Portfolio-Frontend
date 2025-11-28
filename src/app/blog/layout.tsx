import { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata.blog;

export default function BlogLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return <>{children}</>;
}