// ============================================
// Core Type Definitions for Portfolio Website
// Re-export Supabase types for database entities
// ============================================

// Re-export Supabase types (snake_case) for database entities
export type {
  Project,
  ProjectInsert,
  ProjectUpdate,
  Skill,
  SkillInsert,
  SkillUpdate,
  Experience,
  ExperienceInsert,
  ExperienceUpdate,
  Education,
  EducationInsert,
  EducationUpdate,
  Certification,
  CertificationInsert,
  CertificationUpdate,
  Contact,
  ContactInsert,
  ContactUpdate,
  BlogPost,
  BlogPostInsert,
  BlogPostUpdate,
  SocialLink,
  SiteProfile,
} from "@/lib/supabase/types";

// Additional UI/local types not in database
export type ProjectCategory =
  | "web"
  | "mobile"
  | "ai"
  | "backend"
  | "fullstack"
  | "other";

export type SkillCategory =
  | "frontend"
  | "backend"
  | "database"
  | "devops"
  | "tools"
  | "languages"
  | "frameworks";

export interface BlogFrontmatter {
  title: string;
  description: string;
  image?: string;
  tags: string[];
  publishedAt: string;
  updatedAt?: string;
  featured?: boolean;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  url: string;
  ogImage?: string;
  links: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

// Navigation
export interface NavItem {
  name: string;
  href: string;
  isExternal?: boolean;
}
