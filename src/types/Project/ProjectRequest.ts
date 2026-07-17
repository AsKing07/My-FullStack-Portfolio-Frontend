import { ProjectStatus } from "./Project";

export interface ProjectRequest {
    title: string;
    titleFr?: string;
    slug?: string;
    description: string;
    descriptionFr?: string;
    shortDesc?: string;
    shortDescFr?: string;
    content?: string;
    contentFr?: string;
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
