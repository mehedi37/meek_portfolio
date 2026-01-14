/**
 * Portfolio Data Service
 * Server-side functions for fetching portfolio data from Supabase
 */

import { createClient } from "./server";
import type {
  SiteProfile,
  SocialLink,
  SkillCategory,
  Skill,
  SkillWithCategory,
  Project,
  Experience,
  Certification,
  BlogPost,
  Contact,
} from "./types";

// Cache durations (in seconds)
const CACHE_DURATION = {
  profile: 3600, // 1 hour
  skills: 1800, // 30 minutes
  projects: 1800,
  experience: 3600,
  certifications: 3600,
  blog: 900, // 15 minutes
  social: 3600,
};

/**
 * Fetch site profile (singleton)
 */
export async function getSiteProfile(): Promise<SiteProfile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_profile")
    .select("*")
    .single();

  if (error) {
    console.error("Error fetching site profile:", error);
    return null;
  }

  return data;
}

/**
 * Fetch all active social links
 */
export async function getSocialLinks(): Promise<SocialLink[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("social_links")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching social links:", error);
    return [];
  }

  return data || [];
}

/**
 * Fetch all skill categories with their skills
 */
export async function getSkillCategories(): Promise<SkillCategory[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("skill_categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching skill categories:", error);
    return [];
  }

  return data || [];
}

/**
 * Fetch all skills with optional category filter
 */
export async function getSkills(categoryId?: string): Promise<Skill[]> {
  const supabase = await createClient();
  let query = supabase
    .from("skills")
    .select("*")
    .order("sort_order", { ascending: true });

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching skills:", error);
    return [];
  }

  return data || [];
}

/**
 * Fetch skills grouped by category
 */
export async function getSkillsGroupedByCategory(): Promise<
  Record<string, Skill[]>
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("skills")
    .select("*, skill_categories(*)")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching skills:", error);
    return {};
  }

  // Group by category
  const grouped: Record<string, Skill[]> = {};
  for (const skill of data || []) {
    const category = skill.category || "Other";
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(skill);
  }

  return grouped;
}

/**
 * Fetch featured skills
 */
export async function getFeaturedSkills(): Promise<Skill[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .eq("is_featured", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching featured skills:", error);
    return [];
  }

  return data || [];
}

/**
 * Fetch all active projects
 */
export async function getProjects(limit?: number): Promise<Project[]> {
  const supabase = await createClient();
  let query = supabase
    .from("projects")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }

  return data || [];
}

/**
 * Fetch featured projects
 */
export async function getFeaturedProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("is_active", true)
    .eq("featured", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching featured projects:", error);
    return [];
  }

  return data || [];
}

/**
 * Fetch a single project by slug
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) {
    console.error("Error fetching project:", error);
    return null;
  }

  return data;
}

/**
 * Fetch all project slugs for static generation
 */
export async function getAllProjectSlugs(): Promise<string[]> {
  const { createServiceRoleClient } = await import("./server");
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from("projects")
    .select("slug")
    .eq("is_active", true);

  if (error) {
    console.error("Error fetching project slugs:", error);
    return [];
  }

  return (data || []).map((p: { slug: string }) => p.slug);
}

/**
 * Fetch all experiences
 */
export async function getExperiences(): Promise<Experience[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .order("start_date", { ascending: false });

  if (error) {
    console.error("Error fetching experiences:", error);
    return [];
  }

  return data || [];
}

/**
 * Fetch all active certifications
 */
export async function getCertifications(): Promise<Certification[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("certifications")
    .select("*")
    .eq("is_active", true)
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching certifications:", error);
    return [];
  }

  return data || [];
}

/**
 * Fetch published blog posts
 */
export async function getBlogPosts(limit?: number): Promise<BlogPost[]> {
  const supabase = await createClient();
  let query = supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }

  return data || [];
}

/**
 * Fetch featured blog posts
 */
export async function getFeaturedBlogPosts(): Promise<BlogPost[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .eq("is_featured", true)
    .order("published_at", { ascending: false })
    .limit(3);

  if (error) {
    console.error("Error fetching featured blog posts:", error);
    return [];
  }

  return data || [];
}

/**
 * Fetch a single blog post by slug
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }

  return data;
}

/**
 * Fetch all blog post slugs for static generation
 */
export async function getAllBlogSlugs(): Promise<string[]> {
  const { createServiceRoleClient } = await import("./server");
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from("blog_posts")
    .select("slug")
    .eq("published", true);

  if (error) {
    console.error("Error fetching blog slugs:", error);
    return [];
  }

  return (data || []).map((p: { slug: string }) => p.slug);
}

/**
 * Submit a contact form
 */
export async function submitContact(
  name: string,
  email: string,
  subject: string,
  message: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("contacts").insert({
    name,
    email,
    subject,
    message,
  });

  if (error) {
    console.error("Error submitting contact:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Fetch all portfolio data at once (for SSG/ISR)
 */
export async function getAllPortfolioData() {
  const [
    profile,
    socialLinks,
    skillCategories,
    skills,
    projects,
    experiences,
    certifications,
    blogPosts,
  ] = await Promise.all([
    getSiteProfile(),
    getSocialLinks(),
    getSkillCategories(),
    getSkills(),
    getProjects(),
    getExperiences(),
    getCertifications(),
    getBlogPosts(3),
  ]);

  return {
    profile,
    socialLinks,
    skillCategories,
    skills,
    projects,
    experiences,
    certifications,
    blogPosts,
  };
}
