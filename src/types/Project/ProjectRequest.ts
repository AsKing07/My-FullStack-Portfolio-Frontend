import { ProjectStatus } from "./Project";

export interface ProjectRequest {
    title: string;
    slug?: string;
    description: string;
    shortDesc?: string;
    content?: string;
    status: ProjectStatus;
    featured?: boolean;
    priority?: number;
    liveUrl?: string;
    githubUrl?: string;
    figmaUrl?: string;
    image: string; // URL or path to the main image of the project
    gallery?: string;
    technologies?: string;
    startDate?: Date;
    endDate?: Date;
    categoryId?: string; // Optional category ID for the project
}
