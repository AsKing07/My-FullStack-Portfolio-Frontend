import { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata.projects;

export default function ProjectsLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return <>{children}</>;
}