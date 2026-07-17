import { User } from "../User/User";


export enum PostStatus {
    DRAFT = "DRAFT",
    PUBLISHED = "PUBLISHED",
    ARCHIVED = "ARCHIVED",
  }
  




export interface BlogPost {
    id: string;
    title: string;
    titleFr?: string;
    slug: string;
    excerpt?: string;
    excerptFr?: string;
    content: string;
    contentFr?: string;
    status: PostStatus;
    featured: boolean;
    metaTitle: string;
    metaTitleFr?: string;
    metaDesc: string;
    metaDescFr?: string;
    image: string;
    readingTime: number;
    publishedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    tags?: string[]; 
    user?: User;
}

