import { User } from "../User/User";

export interface Certification {
    id: string; // UUID
    name: string;
    nameFr?: string;
    issuer: string;
    description?: string;
    descriptionFr?: string;
    credentialId?: string;
    credentialUrl?: string;
    image?: string;
    issueDate: Date;
    expiryDate?: Date;
    createdAt: Date;
    updatedAt: Date;

    user?: User;
}
