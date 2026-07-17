export interface UserRequest {
    email: string;
    password: string;
    name: string;
    role?: 'ADMIN' | 'USER';
    title?: string;
    subtitle?: string;
    bio?: string;
    bioFr?: string;
    avatar?: File;
    location?: string;
    website?: string;
    linkedin?: string;
    github?: string;
    twitter?: string;
    phone?: string;
    resume?: File;
}


