import { User } from "../User/User";

export interface Education {
    id: string; // UUID
    degree: string;
    school: string;
    field?: string; // Optional field of study
    location?: string; // Optional location of the school
    description?: string; // Optional description, can be markdown or plain text
    grade?: string; // Optional grade or GPA
    startDate: Date; // Start date of the education
    endDate?: Date; // End date, optional if current
    current?: boolean; // Indicates if the education is ongoing
    createdAt: Date; // Timestamp when the record was created
    updatedAt: Date; // Timestamp when the record was last updated

    user?: User; 

}

