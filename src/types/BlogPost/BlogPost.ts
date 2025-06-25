import { User } from "../User/User";


export enum PostStatus {
    DRAFT = "DRAFT",
    PUBLISHED = "PUBLISHED",
    ARCHIVED = "ARCHIVED",
  }
  




export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    status: PostStatus;
    featured: boolean;
    metaTitle: string;
    metaDesc: string;
    image: string;
    readingTime: number;
    publishedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    tags?: string[]; 
    user?: User;
}

