/**
 * Database type definitions for Supabase Portfolio
 * Updated to include all tables with proper types
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      // Site Profile - Singleton table for personal info
      site_profile: {
        Row: {
          id: string;
          full_name: string;
          short_name: string | null;
          tagline: string | null;
          about_me: string | null;
          profile_image: string | null;
          resume_url: string | null;
          email: string | null;
          phone: string | null;
          location: string | null;
          status: string | null;
          status_color: string | null;
          years_experience: number | null;
          completed_projects: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          full_name: string;
          short_name?: string | null;
          tagline?: string | null;
          about_me?: string | null;
          profile_image?: string | null;
          resume_url?: string | null;
          email?: string | null;
          phone?: string | null;
          location?: string | null;
          status?: string | null;
          status_color?: string | null;
          years_experience?: number | null;
          completed_projects?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          full_name?: string;
          short_name?: string | null;
          tagline?: string | null;
          about_me?: string | null;
          profile_image?: string | null;
          resume_url?: string | null;
          email?: string | null;
          phone?: string | null;
          location?: string | null;
          status?: string | null;
          status_color?: string | null;
          years_experience?: number | null;
          completed_projects?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };

      // Social Links
      social_links: {
        Row: {
          id: string;
          platform: string;
          url: string;
          icon: string | null;
          is_active: boolean | null;
          sort_order: number | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          platform: string;
          url: string;
          icon?: string | null;
          is_active?: boolean | null;
          sort_order?: number | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          platform?: string;
          url?: string;
          icon?: string | null;
          is_active?: boolean | null;
          sort_order?: number | null;
          created_at?: string | null;
        };
        Relationships: [];
      };

      // Skill Categories
      skill_categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          icon: string | null;
          color: string | null;
          sort_order: number | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          icon?: string | null;
          color?: string | null;
          sort_order?: number | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          icon?: string | null;
          color?: string | null;
          sort_order?: number | null;
          created_at?: string | null;
        };
        Relationships: [];
      };

      // Skills (updated with new fields)
      skills: {
        Row: {
          id: string;
          name: string;
          category: string;
          category_id: string | null;
          icon: string | null;
          color: string | null;
          is_featured: boolean | null;
          sort_order: number | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          category: string;
          category_id?: string | null;
          icon?: string | null;
          color?: string | null;
          is_featured?: boolean | null;
          sort_order?: number | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          category_id?: string | null;
          icon?: string | null;
          color?: string | null;
          is_featured?: boolean | null;
          sort_order?: number | null;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "skills_category_id_fkey";
            columns: ["category_id"];
            referencedRelation: "skill_categories";
            referencedColumns: ["id"];
          }
        ];
      };

      // Projects (updated with new fields)
      projects: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string;
          long_description: string | null;
          image: string | null;
          video_url: string | null;
          images: string[] | null;
          tech_stack: string[];
          github_url: string | null;
          live_url: string | null;
          featured: boolean | null;
          is_active: boolean | null;
          sort_order: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description: string;
          long_description?: string | null;
          image?: string | null;
          video_url?: string | null;
          images?: string[] | null;
          tech_stack: string[];
          github_url?: string | null;
          live_url?: string | null;
          featured?: boolean | null;
          is_active?: boolean | null;
          sort_order?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          description?: string;
          long_description?: string | null;
          image?: string | null;
          video_url?: string | null;
          images?: string[] | null;
          tech_stack?: string[];
          github_url?: string | null;
          live_url?: string | null;
          featured?: boolean | null;
          is_active?: boolean | null;
          sort_order?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };

      // Experiences (updated with new fields)
      experiences: {
        Row: {
          id: string;
          company: string;
          company_logo: string | null;
          company_url: string | null;
          position: string;
          description: string;
          location: string | null;
          type: string | null;
          start_date: string;
          end_date: string | null;
          is_current: boolean | null;
          technologies: string[] | null;
          sort_order: number | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          company: string;
          company_logo?: string | null;
          company_url?: string | null;
          position: string;
          description: string;
          location?: string | null;
          type?: string | null;
          start_date: string;
          end_date?: string | null;
          is_current?: boolean | null;
          technologies?: string[] | null;
          sort_order?: number | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          company?: string;
          company_logo?: string | null;
          company_url?: string | null;
          position?: string;
          description?: string;
          location?: string | null;
          type?: string | null;
          start_date?: string;
          end_date?: string | null;
          is_current?: boolean | null;
          technologies?: string[] | null;
          sort_order?: number | null;
          created_at?: string | null;
        };
        Relationships: [];
      };

      // Certifications (updated with new fields)
      certifications: {
        Row: {
          id: string;
          title: string;
          issuer: string;
          date: string;
          credential_url: string | null;
          image: string | null;
          is_active: boolean | null;
          sort_order: number | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          issuer: string;
          date: string;
          credential_url?: string | null;
          image?: string | null;
          is_active?: boolean | null;
          sort_order?: number | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          issuer?: string;
          date?: string;
          credential_url?: string | null;
          image?: string | null;
          is_active?: boolean | null;
          sort_order?: number | null;
          created_at?: string | null;
        };
        Relationships: [];
      };

      // Blog Posts (updated with new fields)
      blog_posts: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string | null;
          content: string;
          cover_image: string | null;
          video_url: string | null;
          tags: string[] | null;
          author: string | null;
          published: boolean | null;
          is_featured: boolean | null;
          published_at: string | null;
          reading_time: number | null;
          sort_order: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          excerpt?: string | null;
          content: string;
          cover_image?: string | null;
          video_url?: string | null;
          tags?: string[] | null;
          author?: string | null;
          published?: boolean | null;
          is_featured?: boolean | null;
          published_at?: string | null;
          reading_time?: number | null;
          sort_order?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          excerpt?: string | null;
          content?: string;
          cover_image?: string | null;
          video_url?: string | null;
          tags?: string[] | null;
          author?: string | null;
          published?: boolean | null;
          is_featured?: boolean | null;
          published_at?: string | null;
          reading_time?: number | null;
          sort_order?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };

      // Contacts (updated with new fields)
      contacts: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string | null;
          message: string;
          is_read: boolean | null;
          replied_at: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          subject?: string | null;
          message: string;
          is_read?: boolean | null;
          replied_at?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          subject?: string | null;
          message?: string;
          is_read?: boolean | null;
          replied_at?: string | null;
          created_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

// Helper type for accessing table rows
type PublicSchema = Database["public"];

export type Tables<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Row"];

export type TablesInsert<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Insert"];

export type TablesUpdate<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Update"];

// Export convenient type aliases
export type SiteProfile = Tables<"site_profile">;
export type SiteProfileInsert = TablesInsert<"site_profile">;
export type SiteProfileUpdate = TablesUpdate<"site_profile">;

export type SocialLink = Tables<"social_links">;
export type SocialLinkInsert = TablesInsert<"social_links">;
export type SocialLinkUpdate = TablesUpdate<"social_links">;

export type SkillCategory = Tables<"skill_categories">;
export type SkillCategoryInsert = TablesInsert<"skill_categories">;
export type SkillCategoryUpdate = TablesUpdate<"skill_categories">;

export type Skill = Tables<"skills">;
export type SkillInsert = TablesInsert<"skills">;
export type SkillUpdate = TablesUpdate<"skills">;

export type Project = Tables<"projects">;
export type ProjectInsert = TablesInsert<"projects">;
export type ProjectUpdate = TablesUpdate<"projects">;

export type Experience = Tables<"experiences">;
export type ExperienceInsert = TablesInsert<"experiences">;
export type ExperienceUpdate = TablesUpdate<"experiences">;

export type Certification = Tables<"certifications">;
export type CertificationInsert = TablesInsert<"certifications">;
export type CertificationUpdate = TablesUpdate<"certifications">;

export type BlogPost = Tables<"blog_posts">;
export type BlogPostInsert = TablesInsert<"blog_posts">;
export type BlogPostUpdate = TablesUpdate<"blog_posts">;

export type Contact = Tables<"contacts">;
export type ContactInsert = TablesInsert<"contacts">;
export type ContactUpdate = TablesUpdate<"contacts">;

// Skill with category joined
export type SkillWithCategory = Skill & {
  skill_categories?: SkillCategory | null;
};

// Experience type alias
export type ExperienceType = "full-time" | "part-time" | "contract" | "freelance" | "internship";

// Status colors
export type StatusColor = "success" | "warning" | "danger" | "default" | "accent";
