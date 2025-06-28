import { PostStatus } from "./BlogPost";

export interface BlogPostRequest {
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    status?: PostStatus;
    featured?: boolean;
    metaTitle?: string;
    metaDesc?: string;
    image?: File;
    readingTime?: number;
    publishedAt?: Date;
}

