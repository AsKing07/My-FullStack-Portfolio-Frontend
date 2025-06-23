

import { User } from "../User/User";


export enum ContactStatus {
    UNREAD = 'UNREAD',
    READ = 'READ',
    REPLIED = 'REPLIED',
    ARCHIVED = 'ARCHIVED',
}



export interface Contact {
    id: string;
    name: string;
    email: string;
    subject?: string;
    message: string; // Markdown or plain text
    status: ContactStatus; // Enum for status
    phone?: string;
    company?: string;
    website?: string;
    read?: boolean; // Indicates if the message has been read
    createdAt: Date;
    updatedAt: Date;
    user?: User;


}




