import { User } from "../User/User";

export interface CertificationSummary {
    id: string;
    name: string;
    nameFr?: string;
}

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
    linkedinAddedAt?: Date;
    createdAt: Date;
    updatedAt: Date;

    user?: User;

    parentId?: string | null;
    parent?: CertificationSummary | null;
    children?: Certification[];
}
