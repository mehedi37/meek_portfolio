import {
  Hero,
  Skills,
  Projects,
  Experience,
  BlogPreview,
  Contact,
} from "@/components/sections";
import { ScrollProgress } from "@/components/animations";

/**
 * ORBITAL Portfolio - Home Page
 * Modern, immersive portfolio with glassmorphism design
 */
export default function HomePage() {
  return (
    <>
      {/* Scroll progress indicator */}
      <ScrollProgress />

      {/* Hero Section - Introduction */}
      <Hero />

      {/* Skills Section - Technical expertise */}
      <Skills />

      {/* Projects Section - Featured work */}
      <Projects />

      {/* Experience Section - Professional timeline */}
      <Experience />

      {/* Blog Preview Section - Latest articles */}
      <BlogPreview />

      {/* Contact Section - Get in touch */}
      <Contact />
    </>
  );
}
