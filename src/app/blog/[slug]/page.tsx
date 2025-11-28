'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useBlog } from '@/hooks/useBlogPost';
import { BlogPost } from '@/types/BlogPost/BlogPost';
import { Loader2, Calendar, Clock, User, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge_component';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card_component';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import Image from 'next/image';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { getBlogPostBySlug, loading, error } = useBlog();
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    if (slug) {
      getBlogPostBySlug(slug as string).then((data) => {
        setPost(data);
      });
    }
  }, [slug, getBlogPostBySlug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
      </div>
    );
  }

  if ( error || !post) {
    return (
      <div className="flex-1 w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="flex flex-col items-center gap-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 px-8 py-8 rounded-xl shadow-lg max-w-md">
          <AlertTriangle className="w-10 h-10 text-red-500 mb-2" />
          <h2 className="text-lg font-semibold text-red-700 dark:text-red-300">
            Item not found
          </h2>
          <p className="text-sm text-red-600 dark:text-red-200 text-center">
            Unable to load this blog item.<br />
            <span className="font-mono break-all">{error}</span>
          </p>
          <Link
            href="/blog"
            className="mt-2 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition cursor-pointer"
          >
            Back to blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <Card>
          {post.image && (
            <div className="relative h-64 w-full overflow-hidden rounded-t-2xl">
              <Image
                layout='fill'
                src={post.image}
                alt={post.title}
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
            <CardTitle className="text-3xl font-bold mb-2">{post.title}</CardTitle>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-2">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(post.publishedAt)}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readingTime ?? post.readingTime} min of reading
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
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </CardContent>
        </Card>
        <div className="mt-8">
          <Link
            href="/blog"
            className="inline-block px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            ← Back to blog
          </Link>
        </div>
      </div>
    </div>
  );
}