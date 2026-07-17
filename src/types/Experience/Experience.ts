import { User } from "../User/User";

export enum ExperienceType {
    FULLTIME = 'FULLTIME',
    PARTTIME = 'PARTTIME',
    FREELANCE = 'FREELANCE',
    INTERNSHIP = 'INTERNSHIP',
    CONTRACT = 'CONTRACT',
      APPRENTICESHIP='APPRENTICESHIP',
  VOLUNTEER='VOLUNTEER',
}


export interface Experience {
    id: string;
    title: string;
    titleFr?: string;
    company: string;
    location?: string;
    description?: string; // Markdown or plain text
    descriptionFr?: string;
    technologies?: string; // Comma-separated list of technologies used
    type: ExperienceType;
    startDate: Date;
    endDate?: Date | null; // Nullable for current positions
    current: boolean; // Indicates if the position is ongoing
    createdAt: Date;
    updatedAt: Date;

 user?: User;
}