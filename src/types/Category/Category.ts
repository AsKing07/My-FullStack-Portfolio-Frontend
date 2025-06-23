//   id          String      @id @default(uuid())
//   name        String      @unique
//   slug        String      @unique
//   description String?
//   color       String?
//   icon        String? //FontAwesome class
//   createdAt   DateTime    @default(now())
//   updatedAt   DateTime    @updatedAt

import { Project } from "../Project/Project";
import { Skill } from "../Skill/Skill";

//   // Relations
//   projects    Project[]
//   skills      Skill[]



export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    color?: string;
    icon?: string; // FontAwesome class
    createdAt: Date;
    updatedAt: Date;
    
    // Relations
    projects? : Project[];
    skills?: Skill[];

}

