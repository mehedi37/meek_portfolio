import {
  Hero,
  Skills,
  Projects,
  Experience,
  Certifications,
  BlogPreview,
  Contact,
} from "@/components/sections";
import { ScrollProgress } from "@/components/animations";

/**
 * Home page with all main sections
 * Professional portfolio layout with smooth scroll progress
 */
export default function HomePage() {
  return (
    <>
      {/* Scroll progress indicator */}
      <ScrollProgress />

      {/* Hero Section */}
      <Hero />

      {/* Skills Section */}
      <Skills />

      {/* Projects Section */}
      <Projects />

      {/* Experience Section */}
      <Experience />

      {/* Certifications Section */}
      <Certifications />

      {/* Blog Preview Section */}
      <BlogPreview />

      {/* Contact Section */}
      <Contact />
    </>
  );
}
