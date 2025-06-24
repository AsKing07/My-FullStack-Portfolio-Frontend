

import { Project } from "../Project/Project";
import { Skill } from "../Skill/Skill";




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

