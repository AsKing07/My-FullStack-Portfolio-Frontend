

export interface ContactRequest {
    name: string;
    email: string;
    subject?: string;
    message: string; // Markdown or plain text
    phone?: string;
    company?: string;
    website?: string;
}