import { Category } from "../Category/Category";
import { User } from "../User/User";

export enum ProjectStatus {
    DRAFT = "DRAFT",
    PUBLISHED = "PUBLISHED",
    ARCHIVED = "ARCHIVED"
}
    


export interface Project {
    id: string; // UUID
    title: string;
    slug: string; // Unique slug for SEO-friendly URLs
    description: string; // Full description, can be markdown or plain text
    shortDesc?: string; // Optional short description, max 255 characters
    content?: string; // Optional detailed content, can be markdown or HTML
    status: ProjectStatus; // Status of the project (DRAFT, PUBLISHED, ARCHIVED)
    featured?: boolean; // Indicates if the project is featured
    priority?: number; // Priority level for sorting, default is 0
    liveUrl?: string; // URL to the live project
    githubUrl?: string; // URL to the project's GitHub repository
    figmaUrl?: string; // URL to the project's Figma design file
    image?: string; // Main image URL for the project
    gallery?: string; // Comma-separated list of image URLs for a gallery
    technologies?: string; // Comma-separated list of technologies used in the project
    startDate?: Date; // Optional start date of the project
    endDate?: Date; // Optional end date of the project
    createdAt: Date; // Timestamp when the project was created
    updatedAt: Date; // Timestamp when the project was last updated

   
    user?: User;

   
    category?: Category;
}

