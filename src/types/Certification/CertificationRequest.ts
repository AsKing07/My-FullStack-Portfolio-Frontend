export interface CertificationRequest {
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
}
