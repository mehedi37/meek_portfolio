import {
  Hero,
  Skills,
  Projects,
  Experience,
  BlogPreview,
  Contact,
} from "@/components/sections";
import {
  getSiteProfile,
  getSocialLinks,
  getSkillCategories,
  getSkills,
  getProjects,
  getExperiences,
  getCertifications,
  getBlogPosts,
} from "@/lib/supabase/data";

/**
 * ORBITAL Portfolio - Home Page
 * Modern, immersive portfolio with glassmorphism design
 * Data is fetched server-side for optimal performance
 *
 * Visual Effects are provided by the layout:
 * - FloatingShapes: Geometric shapes that react to scroll
 * - GradientOrbs: Colorful gradient blobs that move with scroll
 * - CursorGlow: Interactive cursor following effect
 */
export default async function HomePage() {
  // Fetch all portfolio data in parallel
  const [
    siteProfile,
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
    getBlogPosts(3), // Limit to 3 for preview
  ]);

  return (
    <>
      {/* Hero Section - Introduction */}
      <Hero profile={siteProfile} socialLinks={socialLinks} />

      {/* Skills Section - Technical expertise */}
      <Skills categories={skillCategories} skills={skills} />

      {/* Projects Section - Featured work */}
      <Projects projects={projects} />

      {/* Experience Section - Professional timeline */}
      <Experience experiences={experiences} />

      {/* Blog Preview Section - Latest articles */}
      <BlogPreview posts={blogPosts} />

      {/* Contact Section - Get in touch */}
      <Contact profile={siteProfile} socialLinks={socialLinks} />
    </>
  );
}
