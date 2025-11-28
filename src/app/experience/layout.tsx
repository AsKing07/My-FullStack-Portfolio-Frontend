import { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata.experience;

export default function ExperienceLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return <>{children}</>;
}