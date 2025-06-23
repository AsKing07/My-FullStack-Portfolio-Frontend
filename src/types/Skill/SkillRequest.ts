import { SkillLevel } from "./Skill";

export interface SkillRequest {
  name: string;
  level?: SkillLevel;
  yearsExp?: number;
  description?: string;
  icon?: string; // FontAwesome class
  categoryId?: string; // Optional, if you want to associate with a category
}