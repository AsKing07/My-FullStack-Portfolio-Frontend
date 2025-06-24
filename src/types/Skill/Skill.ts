
import { Category } from "../Category/Category";
import { User } from "../User/User";

export enum SkillLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT',
}

export interface Skill {
  id: string;
  name: string;
  level: SkillLevel;
  yearsExp?: number;
  description?: string;
  icon?: string; // FontAwesome class
  createdAt: Date;
  updatedAt: Date;

user?: User;
category?: Category;
}