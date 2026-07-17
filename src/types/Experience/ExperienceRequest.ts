import { ExperienceType } from "./Experience";

export interface ExperienceRequest {
    title: string;
    titleFr?: string;
    company: string;
    location?: string;
    description?: string; // Markdown or plain text
    descriptionFr?: string;
    technologies?: string; // Comma-separated list of technologies used
    type: ExperienceType;
    startDate: Date;
    endDate?: Date;
    current?: boolean; // Indicates if the position is ongoing
}