import { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata.education;

export default function EducationLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return <>{children}</>;
}