/**
 * Admin Data Service
 * Client-side functions for admin CRUD operations
 */

import { createClient } from "./client";
import type {
  SiteProfile,
  SiteProfileUpdate,
  SocialLink,
  SocialLinkInsert,
  SocialLinkUpdate,
  SkillCategory,
  SkillCategoryInsert,
  SkillCategoryUpdate,
  Skill,
  SkillInsert,
  SkillUpdate,
  Project,
  ProjectInsert,
  ProjectUpdate,
  Experience,
  ExperienceInsert,
  ExperienceUpdate,
  Certification,
  CertificationInsert,
  CertificationUpdate,
  BlogPost,
  BlogPostInsert,
  BlogPostUpdate,
  Contact,
} from "./types";

// =====================================================
// Site Profile (Singleton)
// =====================================================

export async function fetchSiteProfile(): Promise<SiteProfile | null> {
  const supabase = createClient();
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

export async function updateSiteProfile(
  id: string,
  updates: SiteProfileUpdate
): Promise<{ data: SiteProfile | null; error: string | null }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("site_profile")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function createSiteProfile(
  profile: SiteProfileUpdate
): Promise<{ data: SiteProfile | null; error: string | null }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("site_profile")
    .insert(profile as any)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

// =====================================================
// Social Links
// =====================================================

export async function fetchSocialLinks(): Promise<SocialLink[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("social_links")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching social links:", error);
    return [];
  }

  return data || [];
}

export async function createSocialLink(
  link: SocialLinkInsert
): Promise<{ data: SocialLink | null; error: string | null }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("social_links")
    .insert(link)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function updateSocialLink(
  id: string,
  updates: SocialLinkUpdate
): Promise<{ data: SocialLink | null; error: string | null }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("social_links")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function deleteSocialLink(
  id: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase.from("social_links").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

// =====================================================
// Skill Categories
// =====================================================

export async function fetchSkillCategories(): Promise<SkillCategory[]> {
  const supabase = createClient();
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

export async function createSkillCategory(
  category: SkillCategoryInsert
): Promise<{ data: SkillCategory | null; error: string | null }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("skill_categories")
    .insert(category)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function updateSkillCategory(
  id: string,
  updates: SkillCategoryUpdate
): Promise<{ data: SkillCategory | null; error: string | null }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("skill_categories")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function deleteSkillCategory(
  id: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase.from("skill_categories").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

// =====================================================
// Skills
// =====================================================

export async function fetchSkills(): Promise<Skill[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching skills:", error);
    return [];
  }

  return data || [];
}

export async function createSkill(
  skill: SkillInsert
): Promise<{ data: Skill | null; error: string | null }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("skills")
    .insert(skill)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function updateSkill(
  id: string,
  updates: SkillUpdate
): Promise<{ data: Skill | null; error: string | null }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("skills")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function deleteSkill(
  id: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase.from("skills").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

// =====================================================
// Projects
// =====================================================

export async function fetchProjects(): Promise<Project[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }

  return data || [];
}

export async function createProject(
  project: ProjectInsert
): Promise<{ data: Project | null; error: string | null }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .insert(project)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function updateProject(
  id: string,
  updates: ProjectUpdate
): Promise<{ data: Project | null; error: string | null }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function deleteProject(
  id: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

// =====================================================
// Experiences
// =====================================================

export async function fetchExperiences(): Promise<Experience[]> {
  const supabase = createClient();
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

export async function createExperience(
  experience: ExperienceInsert
): Promise<{ data: Experience | null; error: string | null }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("experiences")
    .insert(experience)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function updateExperience(
  id: string,
  updates: ExperienceUpdate
): Promise<{ data: Experience | null; error: string | null }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("experiences")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function deleteExperience(
  id: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase.from("experiences").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

// =====================================================
// Certifications
// =====================================================

export async function fetchCertifications(): Promise<Certification[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("certifications")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching certifications:", error);
    return [];
  }

  return data || [];
}

export async function createCertification(
  cert: CertificationInsert
): Promise<{ data: Certification | null; error: string | null }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("certifications")
    .insert(cert)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function updateCertification(
  id: string,
  updates: CertificationUpdate
): Promise<{ data: Certification | null; error: string | null }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("certifications")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function deleteCertification(
  id: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase.from("certifications").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

// =====================================================
// Blog Posts
// =====================================================

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }

  return data || [];
}

export async function createBlogPost(
  post: BlogPostInsert
): Promise<{ data: BlogPost | null; error: string | null }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .insert(post)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function updateBlogPost(
  id: string,
  updates: BlogPostUpdate
): Promise<{ data: BlogPost | null; error: string | null }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function deleteBlogPost(
  id: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

// =====================================================
// Contacts
// =====================================================

export async function fetchContacts(): Promise<Contact[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching contacts:", error);
    return [];
  }

  return data || [];
}

export async function markContactAsRead(
  id: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase
    .from("contacts")
    .update({ is_read: true })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

export async function deleteContact(
  id: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase.from("contacts").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}
