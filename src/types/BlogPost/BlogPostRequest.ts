import { PostStatus } from "./BlogPost";

export interface BlogPostRequest {
    title: string;
    titleFr?: string;
    slug: string;
    excerpt?: string;
    excerptFr?: string;
    content: string;
    contentFr?: string;
    status?: PostStatus;
    featured?: boolean;
    metaTitle?: string;
    metaTitleFr?: string;
    metaDesc?: string;
    metaDescFr?: string;
    image?: File;
    readingTime?: number;
    publishedAt?: Date;
}

