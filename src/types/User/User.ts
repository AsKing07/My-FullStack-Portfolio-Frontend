




// ENUMS
enum Role {
  ADMIN,
  USER
}


export interface User {
  id: string;
email: string;
// password: string;
name: string;
role: Role;
title?: string;
subtitle?: string;
bio?: string;
avatarUrl?: string
location?: string;
website?: string;
linkedin?: string;
github?: string;
twitter?: string;
phone?: string;
createdAt: Date;
updatedAt: Date;
resumeUrl?: string;

}
    